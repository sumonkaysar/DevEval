export const forgotPasswordEmailTemplate = (name: string, resetUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested a password reset for your DevEval account. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
};
