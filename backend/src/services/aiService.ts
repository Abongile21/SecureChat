import axios from 'axios';
import ollamaConfig from '../config/openai';

const SYSTEM_PROMPT = `You are SecureChat, an AI-powered cybersecurity awareness assistant. Your role is to:
1. Educate employees about cybersecurity best practices
2. Explain phishing, malware, and other security threats
3. Provide practical security tips and recommendations
4. Simulate phishing scenarios for training
5. Answer security-related questions
6. Motivate employees through engaging conversations

Always maintain a professional yet friendly tone. Focus on practical, actionable advice.`;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONTEXT_MESSAGES = 10;

const ollamaClient = axios.create({
  baseURL: ollamaConfig.baseURL,
  timeout: ollamaConfig.timeout,
});

export const generateChatbotResponse = async (
  userMessage: string,
  _chatId: string,
  context: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> => {
  const boundedMessage = userMessage.trim().slice(0, MAX_MESSAGE_LENGTH);

  try {
    const response = await ollamaClient.post('/api/chat', {
      model: ollamaConfig.model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...context.slice(-MAX_CONTEXT_MESSAGES),
        { role: 'user', content: boundedMessage },
      ],
      stream: false,
    });

    return response.data.message?.content || 'Unable to generate response';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ollama API error:', error.message);
      return 'I\'m unable to reach the AI service right now, but I can still help with general cybersecurity guidance.';
    }
    console.error('Unexpected error:', error);
    return 'I\'m unable to process your request at the moment.';
  }
};

export const analyzePhishingAttempt = async (
  emailContent: string
): Promise<{ isPhishing: boolean; confidence: number; reason: string }> => {
  try {
    const response = await ollamaClient.post('/api/chat', {
      model: ollamaConfig.model,
      messages: [
        {
          role: 'system',
          content: `You are a phishing detection expert. Analyze emails for phishing indicators. 
          Respond with a JSON object containing: { "isPhishing": boolean, "confidence": number (0-100), "reason": string }`,
        },
        {
          role: 'user',
          content: `Analyze this email for phishing: ${emailContent}`,
        },
      ],
      stream: false,
    });

    const content = response.data.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Phishing analysis error:', error);
    return {
      isPhishing: false,
      confidence: 0,
      reason: 'Unable to analyze phishing attempt at the moment.',
    };
  }
};
