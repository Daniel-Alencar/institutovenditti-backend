import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import sendEmailRoute from './routes/send-email';
import aiAnalyzeRoute from './routes/ai-analyze';

const app = express();

app.use(cors({
  origin: [
    'https://seu-direito.institutovenditti.org',
    'https://www.seu-direito.institutovenditti.org',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Internal-Token'
  ],
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.url, 'Origin:', req.headers.origin);
  next();
});


app.use('/api', sendEmailRoute);
app.use('/api', aiAnalyzeRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.port, () => {
  console.log(`Backend rodando na porta ${env.port}`);
});
