# Integração Gemini - Guia de Configuração

## 📋 Resumo

Este backend agora possui integração completa com **Google Gemini** para análise jurídica automatizada.

## 🔧 O que foi implementado

### 1. **Serviço de Análise** (`src/services/ai-analysis.service.ts`)
- Classe que encapsula a lógica de chamada ao Gemini
- Usa o modelo `gemini-1.5-flash` para análises rápidas
- System prompt customizado para diagnósticos jurídicos
- Preparação automática de contexto a partir das respostas do questionário

### 2. **Rota API** (`src/routes/ai-analyze.ts`)
- Endpoint: `POST /api/analyze`
- Validação de dados de entrada
- Tratamento de erros com mensagens claras
- Resposta estruturada com timestamp

### 3. **Configuração de Ambiente** (`src/config/env.ts`)
- Adicionada variável `geminiApiKey`
- Carregamento automático do `.env`

### 4. **Integração no Servidor** (`src/server.ts`)
- Rota registrada no Express
- Middleware de JSON ativado
- Endpoint `/health` para verificar status

## 🚀 Como usar

### 1. Obter Chave do Gemini

1. Acesse [Google AI Studio](https://aistudio.google.com)
2. Clique em "Get API Key"
3. Crie um novo projeto ou selecione um existente
4. Copie a chave gerada

### 2. Configurar .env

Abra `backend/.env` e atualize:

```env
GEMINI_API_KEY=sua_chave_gemini_aqui
```

### 3. Iniciar o Backend

```bash
cd backend
npm install  # se já não foi feito
npm run dev
```

Você verá:
```
🚀 Backend rodando em http://localhost:3333
✅ Integração Gemini ativada
```

### 4. Testar o Endpoint

Use cURL ou Postman para testar:

```bash
curl -X POST http://localhost:3333/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "area": {
      "id": "trabalhista",
      "name": "Direito Trabalhista",
      "questions": [
        {
          "id": "q1",
          "text": "Você foi demitido sem justa causa?",
          "type": "radio",
          "options": [
            {"label": "Sim", "value": "yes", "points": 30},
            {"label": "Não", "value": "no", "points": 0}
          ]
        }
      ]
    },
    "responses": [
      {"questionId": "q1", "answer": "yes"}
    ],
    "totalScore": 30,
    "urgencyLevel": "high"
  }'
```

### 5. Resposta Esperada

```json
{
  "success": true,
  "analysis": "RELATÓRIO JURÍDICO - DIREITO TRABALHISTA\n\nSUMÁRIO EXECUTIVO\n...",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 📝 Estrutura do Request

```typescript
POST /api/analyze
Content-Type: application/json

{
  "area": {
    "id": string;        // ID único da área jurídica
    "name": string;      // Nome amigável (ex: "Direito Trabalhista")
    "questions": [{
      "id": string;
      "text": string;
      "type": "radio" | "checkbox" | "textarea";
      "options": [{
        "label": string;
        "value": string;
        "points": number;
      }];
    }];
  };
  "responses": [{
    "questionId": string;
    "answer": string | string[];
  }];
  "totalScore": number;
  "urgencyLevel": "low" | "medium" | "high";
}
```

## 🎯 Recurso: System Prompt Customizado

O Gemini recebe um prompt detalhado que especifica:

- **Estrutura obrigatória**: Sumário, Análise, Fundamentação Legal, Recomendações, Viabilidade, Conclusão
- **Ton e estilo**: Técnico mas acessível, como um parecer jurídico profissional
- **Requisitos de qualidade**: Sem markdown, entre 1000-1800 palavras
- **Conteúdo esperado**: Artigos específicos, jurisprudência, prazos prescricionais

## ⚡ Dicas de Performance

1. **Rate Limiting**: Considere implementar rate limiting para evitar abusos
2. **Cache**: Análises semelhantes podem ser cacheadas
3. **Timeout**: A função tem timeout automático, ajustável conforme necessário
4. **Modelo**: `gemini-1.5-flash` é mais rápido que `gemini-1.5-pro`, mas ambos funcionam

## 🔒 Segurança

- ✅ Chave da API armazenada em `.env` (nunca commitar)
- ✅ Validação de entrada no endpoint
- ✅ Tratamento de erros sem expor detalhes internos
- ✅ Logs estruturados para debugging

## 🐛 Troubleshooting

### "GEMINI_API_KEY não configurada"
- Verifique se você atualizou `.env`
- Reinicie o servidor após alterar `.env`

### "401 Unauthorized"
- Verifique se a chave do Gemini está correta
- Acesse [Google AI Studio](https://aistudio.google.com) para confirmar

### "Timeout"
- Análises complexas podem levar alguns segundos
- Aumentar `maxOutputTokens` se necessário

### Análise muito curta ou incompleta
- Verifique se o totalScore está acima de 30
- Aumente a qualidade das respostas do questionário

## 📚 Referências

- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [Gemini API Docs](https://ai.google.dev)
- [Modelos disponíveis](https://ai.google.dev/models)

## ✅ Próximos Passos

- [ ] Implementar cache de análises
- [ ] Adicionar rate limiting
- [ ] Criar webhook para notificações
- [ ] Integrar com banco de dados para histórico
- [ ] Adicionar autenticação/autorização
