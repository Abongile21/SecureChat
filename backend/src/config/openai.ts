import dotenv from 'dotenv';

dotenv.config();

export const ollamaConfig = {
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'mistral',
  timeout: 60000, // 60 seconds
};

export default ollamaConfig;
