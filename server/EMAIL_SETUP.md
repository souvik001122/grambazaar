# Email Setup Guide

## 📧 Actual Email Sending (Optional)

GramBazaar supports real email sending for password resets and welcome emails using Nodemailer.

### Current Status
- ✅ Email service implemented
- ✅ Works in **demo mode** (emails logged to console)
- ⚠️ Requires email credentials for actual sending

---

## 🔧 Setup Instructions

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification** on your Google Account
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. **Update `.env` file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # Your 16-char app password
   ```

4. **Restart server**:
   ```cmd
   npm start
   ```

### Option 2: Outlook/Hotmail

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

Update `emailService.js` line 16:
```javascript
service: 'outlook', // changed from 'gmail'
```

### Option 3: Custom SMTP Server

Update `emailService.js`:
```javascript
return nodemailer.createTransporter({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## 🧪 Testing

### Demo Mode (No Credentials)
Emails are printed to the server console:
```
📧 ═══════════════════════════════════════════
📧  PASSWORD RESET EMAIL (DEMO MODE)
📧 ═══════════════════════════════════════════
To: user@example.com
Subject: Reset Your GramBazaar Password

Reset Link:
http://localhost:5173/reset-password?token=...
```

### Production Mode (With Credentials)
Real emails are sent to users' inboxes.

---

## 📝 Email Features

### 1. Password Reset Email
- ✅ Beautiful HTML template
- ✅ Secure reset link with token
- ✅ 1-hour expiry warning
- ✅ Security tips
- ✅ Fallback plain text version

### 2. Welcome Email (Bonus)
- ✅ Sent on user registration
- ✅ Lists platform features
- ✅ Call-to-action button

---

## 🔒 Security Notes

- Never commit `.env` file with real credentials
- Use **App Passwords**, not account passwords
- Reset links expire after 1 hour (implement in production)
- Tokens are one-time use only (implement in production)

---

## 🐛 Troubleshooting

**Email not sending?**
1. Check credentials in `.env`
2. Check server console for errors
3. Verify 2-Step Verification is enabled (Gmail)
4. Check spam folder

**Gmail blocking?**
- Use App Password, not regular password
- Enable "Less secure app access" (not recommended)
- Use a dedicated email account for testing

---

## 📚 Resources

- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Nodemailer Docs: https://nodemailer.com/
- Email Testing Tool: https://mailtrap.io (for dev/testing)
