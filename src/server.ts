import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import sendEmailRoute from './routes/send-email';
import aiAnalyzeRoute from './routes/ai-analyze';

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'https://seu-direito.institutovenditti.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true,
};

// 1. Aplica o CORS globalmente
app.use(cors(corsOptions));

// 2. CORREÇÃO AQUI: Usar /.*/ (Regex) em vez de '*' (String)
// Isso evita o erro "Missing parameter name" e força o preflight em tudo
app.options(/.*/, cors(corsOptions));

app.use('/api', sendEmailRoute);
app.use('/api', aiAnalyzeRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.port, () => {
  console.log(`Backend rodando na porta ${env.port}`);
});