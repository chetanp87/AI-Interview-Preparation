import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();

// Gemini config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask-ai', async (req, res) => {
  const { topic, previousQuestion, answer } = req.body;

  if (!topic) {
    return res.status(400).json({ message: '❌ Topic is required.' });
  }

  // Construct dynamic prompt
  const prompt = `
You are an AI interviewer. Conduct a technical interview on "${topic}".
${previousQuestion && answer ? 
  `\nPrevious Question: "${previousQuestion}"\nCandidate's Answer: "${answer}"\n
  Provide short feedback on the answer and ask the next technical question.` 
  : 
  `\nStart the interview by asking the first technical question on ${topic}. Only ask the question, no explanation.`}
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split feedback and question (if possible)
    let feedback = '', question = '';
    if (/next question/i.test(text)) {
      const [fb, q] = text.split(/next question[:\-]*/i);
      feedback = fb.trim();
      question = q.trim();
    } else {
      question = text.trim(); // First question only
    }

    res.json({ feedback, question });
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(500).json({ message: '❌ Gemini API failed. Check logs.' });
  }
});

export default router;
