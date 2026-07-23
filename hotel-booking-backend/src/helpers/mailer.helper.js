const nodemailer = require('nodemailer');
const { smtp } = require('../config/env');
const logger = require('../utils/logger');

let cachedTransporter = null;

/**
 * Builds (and caches) a nodemailer transporter from either the static .env
 * SMTP config or dynamic settings stored in the `settings` table (site admin
 * can update SMTP credentials without redeploying).
 */
function getTransporter(overrides = {}) {
  const cfg = { ...smtp, ...overrides };
  if (cachedTransporter && !Object.keys(overrides).length) return cachedTransporter;

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.user ? { user: cfg.user, pass: cfg.password } : undefined,
  });

  if (!Object.keys(overrides).length) cachedTransporter = transporter;
  return transporter;
}

async function sendMail({ to, subject, html, text, from }) {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: from || smtp.from,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
    return false;
  }
}

function passwordResetEmail(resetUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2>Reset your password</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;
}

module.exports = { sendMail, passwordResetEmail, getTransporter };
