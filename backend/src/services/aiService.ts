import openai from '../config/openai';

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

export const generateChatbotResponse = async (
  userMessage: string,
  _chatId: string,
  context: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> => {
  const boundedMessage = userMessage.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!openai) {
    return `I am running in local mode without an OpenAI key. Your message was: ${boundedMessage}`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...context.slice(-MAX_CONTEXT_MESSAGES),
        { role: 'user', content: boundedMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Unable to generate response';
  } catch (error) {
    return 'I’m unable to reach the AI service right now, but I can still help with general cybersecurity guidance.';
  }
};

export const analyzePhishingAttempt = async (
  emailContent: string
): Promise<{ isPhishing: boolean; confidence: number; reason: string }> => {
  if (!openai) {
    return {
      isPhishing: false,
      confidence: 0,
      reason: 'OpenAI service is not configured in local mode.',
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
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
      temperature: 0.2,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    return {
      isPhishing: false,
      confidence: 0,
      reason: 'Unable to analyze phishing attempt at the moment.',
    };
  }
};
