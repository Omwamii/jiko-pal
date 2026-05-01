import api from './api';
import type { Conversation, Message, PaginatedResponse } from '../types';

export const chatApi = {
  getConversations: async () => (await api.get<PaginatedResponse<Conversation>>('/conversations/')).data,

  getConversation: async (id: string) => (await api.get<Conversation>(`/conversations/${id}/`)).data,

  createConversation: async (data: { vendor_id?: string; client_id?: string }) =>
    (await api.post<Conversation>('/conversations/', data)).data,

  // Backend currently returns a bare list for `/messages/` (not paginated),
  // but other endpoints use DRF pagination. Normalize to PaginatedResponse.
  getMessages: async (conversationId: string) => {
    const data = (await api.get<PaginatedResponse<Message> | Message[]>(`/conversations/${conversationId}/messages/`))
      .data;
    if (Array.isArray(data)) {
      return { count: data.length, next: null, previous: null, results: data };
    }
    return data;
  },

  sendMessage: async (conversationId: string, content: string) =>
    (await api.post<Message>(`/conversations/${conversationId}/send_message/`, { content })).data,

  markAsRead: async (conversationId: string) =>
    (await api.post(`/conversations/${conversationId}/mark_read/`)).data,
};

export const getWebSocketUrl = (conversationId: string, token: string) => {
  const baseUrl = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:8000';
  const wsBase = baseUrl.replace(/^http/, 'ws');
  return `${wsBase}/ws/chat/${conversationId}/?token=${token}`;
};
