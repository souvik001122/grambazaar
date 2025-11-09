const { Resend } = require('resend');

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendPasswordResetEmail(toEmail, resetToken, userName = 'User') {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${toEmail}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password for your GramBazaar account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy this link: <br><code>${resetUrl}</code></p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 GramBazaar. Your Local Marketplace.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!resend) {
    console.log('📧 Demo mode - Password reset email:');
    console.log('To:', toEmail);
    console.log('Reset URL:', resetUrl);
    return { success: true, resetUrl, demo: true };
  }

  try {
    console.log('🔄 Attempting to send email via Resend...');
    console.log('   API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('   API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 8));
    
    const result = await resend.emails.send({
      from: 'GramBazaar <onboarding@resend.dev>', // Will use default until you verify domain
      to: toEmail,
      subject: '🔐 Reset Your GramBazaar Password',
      html: htmlContent
    });

    console.log('✅ Password reset email sent via Resend to:', toEmail);
    console.log('   Resend response:', JSON.stringify(result));
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Resend email error:', error);
    console.error('   Error details:', JSON.stringify(error, null, 2));
    throw new Error('Failed to send email');
  }
}

async function sendWelcomeEmail(toEmail, userName) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to GramBazaar!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Thank you for joining GramBazaar - your local marketplace!</p>
          <p>You can now:</p>
          <ul>
            <li>🏪 Browse local shops and products</li>
            <li>🛒 Add items to your cart</li>
            <li>🚚 Get doorstep delivery</li>
            <li>💰 Multiple payment options</li>
          </ul>
          <p>Happy shopping!</p>
        </div>
        <div class="footer">
          <p>© 2025 GramBazaar. Your Local Marketplace.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!resend) {
    console.log('📧 Demo mode - Welcome email would be sent to:', toEmail);
    return { success: true, demo: true };
  }

  try {
    const result = await resend.emails.send({
      from: 'GramBazaar <onboarding@resend.dev>',
      to: toEmail,
      subject: '🎉 Welcome to GramBazaar!',
      html: htmlContent
    });

    console.log('✅ Welcome email sent via Resend to:', toEmail);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Resend welcome email error:', error);
    // Don't throw - welcome email failure shouldn't block registration
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};
