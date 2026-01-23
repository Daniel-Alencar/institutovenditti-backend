import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import sendEmailRoute from './routes/send-email';
import aiAnalyzeRoute from './routes/ai-analyze';

const app = express();

app.use(express.json());

// 1. Defina as opções do CORS separadamente para reutilização
const corsOptions = {
  origin: 'https://seu-direito.institutovenditti.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// 2. Aplique o middleware CORS
app.use(cors(corsOptions));

// 3. Habilite explicitamente o Preflight (OPTIONS) para todas as rotas
app.options('*', cors(corsOptions));

app.use('/api', sendEmailRoute);
app.use('/api', aiAnalyzeRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.port, () => {
  console.log(`Backend rodando na porta ${env.port}`);
});