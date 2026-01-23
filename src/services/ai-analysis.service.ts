import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from '../config/env';

// Inicializa o SDK com a chave de API do ambiente
const genAI = new GoogleGenerativeAI(env.geminiApiKey);

export interface AIAnalysisInput {
  area: {
    name: string;
    id: string;
    questions: Array<{
      id: string;
      text: string;
      type: string;
      options?: Array<{
        label: string;
        value: string;
        points?: number;
      }>;
    }>;
  };
  responses: Array<{
    questionId: string;
    answer: string | string[];
  }>;
  totalScore: number;
  urgencyLevel: 'low' | 'medium' | 'high';
}

const ANALYSIS_SYSTEM_PROMPT = `
  OBJETIVO GERAL
  Elaborar um diagnóstico jurídico técnico e acessível, que ajude o usuário a compreender:
  1. Quais direitos podem ter sido violados;
  2. Quais medidas práticas deve tomar;
  3. Qual a urgência e a viabilidade de agir.

  ESTRUTURA OBRIGATÓRIA DO RELATÓRIO

  1. SUMÁRIO EXECUTIVO
  • Contexto breve do caso, identificando o problema central.
  • Principais direitos potencialmente envolvidos.
  • Nível de urgência com base nas respostas.

  2. ANÁLISE DETALHADA DAS RESPOSTAS
  • Interprete cada resposta, destacando fatos juridicamente relevantes.
  • Identifique condutas ilegais, abusivas ou omissões.
  • Avalie indícios de violação de direitos com base na legislação aplicável.
  • Se possível, indique prazo de prescrição ou decadência pertinente.
  • Aponte inconsistências ou informações que precisam ser comprovadas com documentos.

  3. FUNDAMENTAÇÃO LEGAL
  • Cite artigos específicos de lei (CLT, CC, CDC, CPC, CF, etc.).
  • Mencione jurisprudência exemplificativa quando for útil.
  • Inclua o fundamento jurídico de cada direito mencionado.
  • Evite exageros: mantenha o texto técnico, fiel ao direito vigente.

  4. RECOMENDAÇÕES PRÁTICAS
  • Liste documentos que o usuário deve reunir (ex: contrato, comprovantes, laudos, prints).
  • Indique quais órgãos procurar (Procon, Justiça do Trabalho, advogado especializado, etc.).
  • Recomende ações imediatas (registrar denúncia, notificar empresa, etc.).
  • Sugira alternativas viáveis: acordo, mediação, processo judicial, etc.

  5. AVALIAÇÃO DE VIABILIDADE
  • Indique, em linguagem simples:
    ○ Chances de êxito: Alta / Média / Baixa
    ○ Custos estimados: Baixo / Médio / Alto
    ○ Tempo médio de solução
    ○ Riscos e benefícios jurídicos
  • Justifique brevemente cada avaliação.

  6. CONCLUSÃO E ORIENTAÇÃO FINAL
  • Síntese clara do que o usuário deve fazer.
  • Tom de aconselhamento profissional, não apenas informativo.
  • Reforce a importância de consultar um advogado, sem substituir a atuação humana.
  • Feche com tom ético e tranquilizador.

  REQUISITOS DE QUALIDADE
  • Linguagem acessível, mas tecnicamente correta.
  • Evite jargões sem explicação.
  • Estruture o texto com subtítulos e seções bem destacadas.
  • Sem markdown (sem #, **, etc.).
  • Utilize títulos em maiúsculas e seções bem destacadas.
  • Texto entre 1000 e 1800 palavras, dependendo da complexidade.
  • Evite qualquer opinião política, ideológica ou especulativa.
  • Adote tom de confiança e empatia profissional.

  INSTRUÇÕES DE ESTILO
  • Escrever como um advogado experiente redigindo um parecer consultivo.
  • Mistura ideal: 60% técnico / 40% explicativo e orientativo.
  • Priorizar sempre segurança jurídica, clareza e aplicabilidade prática.
  • Evitar redundâncias e floreios.
  • Se houver pontuação baixa ou respostas vagas, emitir alerta de dados insuficientes.

  OBSERVAÇÕES:
  Preciso de quatro espaços publicitários na resposta final, indicados como [ESPAÇO_PUBLICITARIO_1], [ESPAÇO_PUBLICITARIO_2], [ESPAÇO_PUBLICITARIO_3] e [ESPAÇO_PUBLICITARIO_4], para futuras inserções de anúncios. O [ESPAÇO_PUBLICITARIO_1] aparece após o SUMÁRIO EXECUTIVO, o [ESPAÇO_PUBLICITARIO_2] após a ANÁLISE DETALHADA DAS RESPOSTAS, o [ESPAÇO_PUBLICITARIO_3] após as AVALIAÇÃO DE VIABILIDADE, e o [ESPAÇO_PUBLICITARIO_4] após a CONCLUSÃO E ORIENTAÇÃO FINAL.
`;

export async function generateAIAnalysis(input: AIAnalysisInput): Promise<string> {
  console.log('🤖 Gemini AI Analysis - Iniciando análise jurídica...');

  try {
    // Preparar contexto com as respostas do usuário
    const context = prepareAnalysisContext(input);

    // Obtém o modelo generativo
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      systemInstruction: ANALYSIS_SYSTEM_PROMPT,
    });

    const result = await model.generateContent(context);
    const response = await result.response;
    const analysisText = response.text();

    if (!analysisText) {
      throw new Error("Resposta vazia do modelo Gemini");
    }
    console.log('✅ Análise gerada com sucesso pelo Gemini');
    return analysisText;

  } catch (error) {
    console.error('❌ Erro ao gerar análise com Gemini:', error);
    throw new Error(
      `Falha ao gerar análise: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    );
  }
}


function prepareAnalysisContext(input: AIAnalysisInput): string {
  const { area, responses, totalScore, urgencyLevel } = input;

  let context = `RELATÓRIO JURÍDICO - ${area.name.toUpperCase()}\n\n`;
  context += `DADOS DO CASO:\n`;
  context += `- Área do Direito: ${area.name}\n`;
  context += `- Pontuação Total: ${totalScore} pontos\n`;
  context += `- Nível de Urgência: ${urgencyLevel === 'high' ? 'ALTA' : urgencyLevel === 'medium' ? 'MÉDIA' : 'BAIXA'}\n\n`;

  context += `RESPOSTAS DO QUESTIONÁRIO:\n\n`;

  responses.forEach((response, index) => {
    const question = area.questions.find(q => q.id === response.questionId);
    if (!question) return;

    context += `${index + 1}. ${question.text}\n`;

    if (question.type === 'radio' && typeof response.answer === 'string') {
      const option = question.options?.find(opt => opt.value === response.answer);
      context += `   Resposta: ${option?.label || response.answer}\n`;
      context += `   Pontuação: ${option?.points || 0} pontos\n\n`;
    } else if (question.type === 'checkbox' && Array.isArray(response.answer)) {
      const selectedOptions = question.options?.filter(opt => response.answer.includes(opt.value));
      context += `   Respostas selecionadas:\n`;
      selectedOptions?.forEach(opt => {
        context += `   - ${opt.label} (${opt.points} pontos)\n`;
      });
      context += '\n';
    } else if (question.type === 'textarea' && typeof response.answer === 'string') {
      context += `   Descrição do usuário:\n`;
      context += `   "${response.answer}"\n\n`;
    }
  });

  context += `\n---\n\n`;
  context += `Por favor, gere um diagnóstico jurídico completo seguindo rigorosamente a estrutura e requisitos especificados. O relatório deve ser técnico, preciso e acessível.\n`;

  return context;
}
