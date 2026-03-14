'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
};

export async function processAITask(prompt: string) {
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { text: response.text() };
  } catch (error: any) {
    console.error('AI Task Error:', error);
    return { error: 'Error processing AI task' };
  }
}
