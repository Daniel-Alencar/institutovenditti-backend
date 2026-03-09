import { Router } from 'express';
import multer from 'multer';
import { sendMail } from '../services/mail.service';
import { env } from '../config/env';
import { wasEmailSent, markEmailAsSent } from '../utils/sent.cache';

const upload = multer();
const router = Router();

router.post(
  '/send-email',
  upload.single('attachment'),
  async (req, res) => {
    try {
      console.log('📧 Send Email - Recebendo requisição de envio de email...');

      // 🔐 Segurança
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
      }

      const [, token] = authHeader.split(' ');

      if (token !== env.internalToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const {
        to,
        subject,
        htmlContent,
        userName,
        emailId,
      } = req.body;

      // ✅ Validação básica
      if (!to || !subject || !htmlContent) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // 🧠 Anti-duplicação
      if (emailId && wasEmailSent(emailId)) {
        return res.json({ status: 'already_sent' });
      }

      await sendMail({
        to,
        subject,
        html: htmlContent,
        attachment: req.file
          ? {
              filename: req.file.originalname,
              buffer: req.file.buffer,
            }
          : undefined,
      });

      if (emailId) {
        markEmailAsSent(emailId);
      }

      return res.json({ status: 'sent' });
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;