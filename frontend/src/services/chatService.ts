import apiClient from './apiClient';

export const chatService = {
  sendMessage: (chatId: string, message: string) =>
    apiClient.post('/chat/message', { chatId, message }),
  getChatHistory: (chatId: string) =>
    apiClient.get(`/chat/history/${chatId}`),
  startNewChat: () =>
    apiClient.post('/chat/start', {}),
};
