const nodemailer = require('nodemailer');

async function sendEmailSim(to, subject, text) {
  console.log('[EmailSim] to:', to, subject, text);
  // If SMTP is configured, try to send. Otherwise just log.
  if (process.env.SMTP_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
      console.log('[EmailSim] sent');
    } catch (err) {
      console.error('[EmailSim] send error', err.message);
    }
  }
}

function sendSmsSim(phone, message) {
  console.log('[SmsSim] to:', phone, message);
}

module.exports = { sendEmailSim, sendSmsSim };
