import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3000;

// Configuração para aceitar dados JSON e servir arquivos estáticos
app.use(express.json({ limit: '10mb' }));
// O caminho para a pasta 'public' precisa ser ajustado para a estrutura do Replit
app.use(express.static('client/public'));

// Pega a chave de API dos Secrets do Replit
const API_KEY = process.env['GEMINI_API_KEY'];
const genAI = new GoogleGenerativeAI(API_KEY);

// Nosso "endpoint" de API. O frontend vai chamar este endereço.
app.post('/api/get-observation', async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64 || !prompt) {
      return res.status(400).json({ error: 'Imagem ou prompt faltando.' });
    }

    const pureBase64 = imageBase64.split(',')[1];

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const imagePart = {
      inlineData: {
        data: pureBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    res.json({ observation: text });

  } catch (error) {
    console.error("Erro na API do Gemini:", error);
    res.status(500).json({ error: 'Falha ao se comunicar com a IA.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});