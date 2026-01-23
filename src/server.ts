import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import sendEmailRoute from './routes/send-email';
import aiAnalyzeRoute from './routes/ai-analyze';

const app = express();

// 🔒 Origens permitidas
const allowedOrigins = [
  'https://seu-direito.institutovenditti.org',
  'http://localhost:5173'
];

// ✅ CORS — SEMPRE antes das rotas
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Responde preflight
app.options('*', cors());

// Middleware
app.use(express.json());

// Rotas
app.use('/api', sendEmailRoute);
app.use('/api', aiAnalyzeRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ⚠️ Escutar em 0.0.0.0 (container)
app.listen(env.port, '0.0.0.0', () => {
  console.log(`🚀 Backend rodando na porta ${env.port}`);
});
