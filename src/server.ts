import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import sendEmailRoute from './routes/send-email';
import aiAnalyzeRoute from './routes/ai-analyze';

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'https://seu-direito.institutovenditti.org'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api', sendEmailRoute);
app.use('/api', aiAnalyzeRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.port, '0.0.0.0', () => {
  console.log(`🚀 Backend rodando na porta ${env.port}`);
});
