import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();

// Gemini config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask-ai', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ message: reply });
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(500).json({ message: 'Gemini API failed. Check logs.' });
  }
});

export default router;
