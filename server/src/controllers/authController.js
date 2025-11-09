const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/emailService');

// Register new user
async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user (password will be hashed automatically)
    const user = new User({ name, email, password, phone });
    await user.save();

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(email, name).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'grambazaar-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        joinDate: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

// Login user
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'grambazaar-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        joinDate: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

// Get user profile
async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Update user profile
async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Get all users (for debugging/admin)
async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        joinDate: u.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
}

// Forgot password - generate reset token
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({ 
        message: 'If an account exists with this email, you will receive a password reset link shortly.' 
      });
    }

    // Generate a unique reset token with timestamp
    const resetToken = 'reset-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    
    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);
      
      console.log(`✅ Password reset requested for: ${email}`);
      
      res.json({ 
        message: 'Password reset link sent to your email',
        // For demo mode, include the reset URL
        ...(emailResult.resetUrl && { demoResetUrl: emailResult.resetUrl })
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still return success to user (security: don't reveal if email failed)
      res.json({ 
        message: 'If an account exists with this email, you will receive a password reset link shortly.' 
      });
    }
  } catch (err) {
    next(err);
  }
}

// Reset password with token
async function resetPassword(req, res, next) {
  try {
    const { email, token, newPassword } = req.body;
    
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Email, token, and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, you would:
    // 1. Verify token exists and is not expired
    // 2. Check token matches the one stored in database
    // 3. Delete token after successful reset
    
    // For demo, accept any token starting with 'reset-' or 'demo-token'
    if (!token.startsWith('reset-') && !token.startsWith('demo-token')) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password (will be hashed automatically by pre-save hook)
    user.password = newPassword;
    await user.save();

    console.log(`Password reset successful for: ${email}`);

    res.json({ 
      message: 'Password reset successful! You can now login with your new password.' 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  forgotPassword,
  resetPassword
};
