import express, { Request, Response } from 'express';
import { generateAIAnalysis, type AIAnalysisInput } from '../services/ai-analysis.service';

const router = express.Router();

/**
 * POST /analyze
 * Endpoint para análise jurídica com IA (Gemini)
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    console.log('📥 Requisição recebida no endpoint /analyze');

    const input: AIAnalysisInput = req.body;

    // Validar dados de entrada
    if (!input.area || !input.responses || input.totalScore === undefined) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Favor enviar: area, responses, totalScore, urgencyLevel',
      });
    }

    console.log(`📋 Analisando caso de ${input.area.name} com pontuação ${input.totalScore}`);

    // Gerar análise com Gemini
    const analysis = await generateAIAnalysis(input);

    // Retornar análise
    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erro ao processar análise:', error);

    res.status(500).json({
      error: 'Falha ao gerar análise',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
