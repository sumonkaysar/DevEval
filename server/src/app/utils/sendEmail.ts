import nodemailer from "nodemailer";
import { env } from "../config/env.config";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"DevEval Support" <${env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
