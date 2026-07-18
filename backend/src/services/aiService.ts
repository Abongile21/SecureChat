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
  _chatId: string
): Promise<string> => {
  if (!openai) {
    return `I’m running in local mode without an OpenAI key. You can still continue the conversation, and I’ll respond with a safe fallback. Your message was: ${userMessage}`;
  }

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
    return {
      isPhishing: false,
      confidence: 0,
      reason: 'Unable to analyze phishing attempt at the moment.',
    };
  }
};
