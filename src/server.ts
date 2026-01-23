import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import sendEmailRoute from './routes/send-email';
import aiAnalyzeRoute from './routes/ai-analyze';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  // ajuste para seu domínio em produção
  origin: '*',
}));

// Rotas
app.use('/api', sendEmailRoute);
app.use('/api', aiAnalyzeRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(env.port, () => {
  console.log(`🚀 Backend rodando em http://localhost:${env.port}`);
});
