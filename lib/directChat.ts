import api from './api';
import type { Message, PaginatedResponse } from '../types';

export type DirectConversation = {
  id: string;
  user1: string;
  user2: string;
  created_at: string;
  updated_at: string;
};

export const directChatApi = {
  createConversation: async (other_user_id: string) =>
    (await api.post<DirectConversation>('/direct-conversations/', { other_user_id })).data,

  getMessages: async (conversationId: string) =>
    (await api.get<PaginatedResponse<Message>>(`/direct-conversations/${conversationId}/messages/`)).data,

  sendMessage: async (conversationId: string, content: string) =>
    (await api.post<Message>(`/direct-conversations/${conversationId}/send_message/`, { content })).data,
};

export const getDirectWebSocketUrl = (conversationId: string, token: string) => {
  const baseUrl = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:8000';
  const wsBase = baseUrl.replace(/^http/, 'ws');
  return `${wsBase}/ws/dm/${conversationId}/?token=${token}`;
};

