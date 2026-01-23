import 'dotenv/config';

export const env = {
  port: process.env.PORT || 3333,
  internalToken: process.env.INTERNAL_API_TOKEN!,
  geminiApiKey: process.env.GEMINI_API_KEY!,
  smtp: {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  mailFrom: process.env.MAIL_FROM!,
};
