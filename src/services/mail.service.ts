import nodemailer from 'nodemailer';
import { env } from '../config/env';

export const mailTransporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  attachment?: {
    filename: string;
    buffer: Buffer;
  };
}) {

  console.log(env.smtp.user);

  return mailTransporter.sendMail({
    from: env.mailFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachment
      ? [
          {
            filename: options.attachment.filename,
            content: options.attachment.buffer,
          },
        ]
      : [],
  });
}
