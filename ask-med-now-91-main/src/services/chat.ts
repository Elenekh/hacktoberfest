import { api } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: Array<{
    specialty: string;
    reason: string;
  }>;
}

export const chatService = {
  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    return api.post('/chat', { messages });
  },
};
