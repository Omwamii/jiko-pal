import api from './api';
import { Notification, PaginatedResponse } from '../types';

export const notificationService = {
  async getNotifications(params?: Record<string, string>): Promise<PaginatedResponse<Notification>> {
    const response = await api.get<PaginatedResponse<Notification>>('/notifications/', { params });
    return response.data;
  },

  async getNotification(id: string): Promise<Notification> {
    const response = await api.get<Notification>(`/notifications/${id}/`);
    return response.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch<Notification>(`/notifications/${id}/read/`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ detail: string }> {
    const response = await api.post<{ detail: string }>('/notifications/mark_all_read/');
    return response.data;
  },

  async getUnreadCount(): Promise<{ unread_count: number }> {
    const response = await api.get<{ unread_count: number }>('/notifications/unread_count/');
    return response.data;
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}/`);
  },
};
