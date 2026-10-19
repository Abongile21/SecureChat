import axios from 'axios';
import openRouterConfig from '../config/openai';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONTEXT_MESSAGES = 10;

const openRouterClient = axios.create({
  baseURL: openRouterConfig.baseURL,
  timeout: openRouterConfig.timeout,
  headers: {
    Authorization: `Bearer ${openRouterConfig.apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': openRouterConfig.referer,
    'X-Title': openRouterConfig.title,
  },
});

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const requestCompletion = async (messages: ChatMessage[]): Promise<string> => {
  const response = await openRouterClient.post('/chat/completions', {
    model: openRouterConfig.model,
    messages,
  });
  return response.data.choices?.[0]?.message?.content || 'Unable to generate a response.';
};

export const generateChatbotResponse = async (
  userMessage: string,
  _chatId: string,
  context: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> => {
  const boundedMessage = userMessage.trim().slice(0, MAX_MESSAGE_LENGTH);

  try {
    return await requestCompletion([
      { role: 'system', content: openRouterConfig.systemPrompt },
      ...context.slice(-MAX_CONTEXT_MESSAGES),
      { role: 'user', content: boundedMessage },
    ]);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('OpenRouter API error:', error.message);
      return 'I\'m unable to reach the AI service right now, but I can still help with general cybersecurity guidance.';
    }
    console.error('Unexpected AI service error:', error);
    return 'I\'m unable to process your request at the moment.';
  }
};

export const analyzePhishingAttempt = async (
  emailContent: string
): Promise<{ isPhishing: boolean; confidence: number; reason: string }> => {
  try {
    const content = await requestCompletion([
      {
        role: 'system',
        content: 'You are a phishing detection expert. Respond only with valid JSON containing isPhishing (boolean), confidence (number from 0 to 100), and reason (string).',
      },
      {
        role: 'user',
        content: `Analyze this email for phishing: ${emailContent}`,
      },
    ]);
    return JSON.parse(content) as { isPhishing: boolean; confidence: number; reason: string };
  } catch (error) {
    console.error('Phishing analysis error:', error);
    return {
      isPhishing: false,
      confidence: 0,
      reason: 'Unable to analyze phishing attempt at the moment.',
    };
  }
};
