const nodemailer = require('nodemailer');

// Create email transporter
// For production, use environment variables for credentials
const createTransporter = () => {
  // Check if email credentials are configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.warn('⚠️  Email credentials not configured. Emails will be logged to console only.');
    return null;
  }

  // Configure transporter based on email provider
  // This example works with Gmail - for other providers, adjust settings
  return nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: emailUser,
      pass: emailPass // For Gmail, use App Password (not regular password)
    }
  });
};

// Send password reset email
async function sendPasswordResetEmail(email, resetToken, userName = 'User') {
  const transporter = createTransporter();
  
  // Generate reset URL
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  
  // Email template
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password for your <strong>GramBazaar</strong> account.</p>
          <p>Click the button below to reset your password:</p>
          <center>
            <a href="${resetUrl}" class="button">Reset Password</a>
          </center>
          <p>Or copy and paste this link into your browser:</p>
          <p style="background: white; padding: 10px; border-radius: 4px; word-break: break-all;">${resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          <p>If you have any questions, contact our support team.</p>
          <p>Best regards,<br><strong>GramBazaar Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GramBazaar - Hyperlocal Marketplace for West Bengal Villages</p>
          <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Hello ${userName},

We received a request to reset your password for your GramBazaar account.

Click this link to reset your password:
${resetUrl}

⚠️ Security Notice:
- This link will expire in 1 hour
- If you didn't request this, please ignore this email
- Never share this link with anyone

Best regards,
GramBazaar Team

© ${new Date().getFullYear()} GramBazaar
  `;

  // If transporter is not configured, log to console
  if (!transporter) {
    console.log('\n📧 ═══════════════════════════════════════════════════════');
    console.log('📧  PASSWORD RESET EMAIL (DEMO MODE)');
    console.log('📧 ═══════════════════════════════════════════════════════');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your GramBazaar Password`);
    console.log(`\nReset Link:\n${resetUrl}`);
    console.log('📧 ═══════════════════════════════════════════════════════\n');
    
    return {
      success: true,
      message: 'Email logged to console (demo mode)',
      resetUrl // Return URL for demo purposes
    };
  }

  // Send actual email
  try {
    const info = await transporter.sendMail({
      from: `"GramBazaar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your GramBazaar Password',
      text: emailText,
      html: emailHtml
    });

    console.log(`✅ Password reset email sent to ${email} (Message ID: ${info.messageId})`);
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

// Send welcome email (bonus feature)
async function sendWelcomeEmail(email, userName) {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log(`\n📧 Welcome email for ${email} (demo mode - not sent)\n`);
    return { success: true, message: 'Demo mode' };
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-item { margin: 10px 0; padding-left: 25px; position: relative; }
        .feature-item:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to GramBazaar!</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Welcome to <strong>GramBazaar</strong> - Your hyperlocal marketplace connecting West Bengal villages!</p>
          <p>We're excited to have you join our community. Here's what you can do:</p>
          <div class="features">
            <div class="feature-item">Browse local shops in your village</div>
            <div class="feature-item">Order fresh produce, groceries, and daily essentials</div>
            <div class="feature-item">Support local businesses in your community</div>
            <div class="feature-item">Get doorstep delivery from nearby vendors</div>
            <div class="feature-item">Track your orders in real-time</div>
          </div>
          <center>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Start Shopping</a>
          </center>
          <p>If you need any help, our support team is always here for you.</p>
          <p>Happy shopping!<br><strong>GramBazaar Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GramBazaar - Hyperlocal Marketplace for West Bengal Villages</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"GramBazaar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to GramBazaar! 🎉',
      html: emailHtml
    });
    console.log(`✅ Welcome email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false };
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};
