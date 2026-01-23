import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import sendEmailRoute from './routes/send-email';
import aiAnalyzeRoute from './routes/ai-analyze';

const app = express();

app.use(express.json());

// 1. Origens devem SEMPRE incluir o protocolo (https:// )
const allowedOrigins = [
  'https://seu-direito.institutovenditti.org',
  'https://www.seu-direito.institutovenditti.org',
  'https://encubadora-venditti-frontend.wievbf.easypanel.host',
  'https://www.encubadora-venditti-frontend.wievbf.easypanel.host',
];

app.use(cors({
  origin: (origin, callback ) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`[CORS Bloqueado] Origem não permitida: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use('/api', sendEmailRoute);
app.use('/api', aiAnalyzeRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.port, () => {
  console.log(`Backend rodando na porta ${env.port}`);
});