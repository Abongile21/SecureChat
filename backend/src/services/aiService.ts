import openai from '../config/openai';

const SYSTEM_PROMPT = `You are SecureChat, an AI-powered cybersecurity awareness assistant. Your role is to:
1. Educate employees about cybersecurity best practices
2. Explain phishing, malware, and other security threats
3. Provide practical security tips and recommendations
4. Simulate phishing scenarios for training
5. Answer security-related questions
6. Motivate employees through engaging conversations

Always maintain a professional yet friendly tone. Focus on practical, actionable advice.`;

export const generateChatbotResponse = async (
  userMessage: string,
  chatId: string
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Unable to generate response';
  } catch (error) {
    throw new Error('Failed to generate AI response');
  }
};

export const analyzePhishingAttempt = async (
  emailContent: string
): Promise<{ isPhishing: boolean; confidence: number; reason: string }> => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
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
    throw new Error('Failed to analyze phishing attempt');
  }
};
