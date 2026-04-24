import api from './api';
import { IoTDevice, MonitoringCircle, PaginatedResponse } from '../types';

export interface CreateCircleData {
  circle_name: string;
}

export const circleService = {
  async getCircles(params?: Record<string, string>): Promise<PaginatedResponse<MonitoringCircle>> {
    const response = await api.get<PaginatedResponse<MonitoringCircle>>('/circles/', { params });
    return response.data;
  },

  async getCircle(id: string): Promise<MonitoringCircle> {
    const response = await api.get<MonitoringCircle>(`/circles/${id}/`);
    return response.data;
  },

  async createCircle(data: CreateCircleData): Promise<MonitoringCircle> {
    const response = await api.post<MonitoringCircle>('/circles/', data);
    return response.data;
  },

  async updateCircle(id: string, data: Partial<CreateCircleData>): Promise<MonitoringCircle> {
    const response = await api.patch<MonitoringCircle>(`/circles/${id}/`, data);
    return response.data;
  },

  async deleteCircle(id: string): Promise<void> {
    await api.delete(`/circles/${id}/`);
  },

  async joinCircle(id: string): Promise<{ detail: string }> {
    const response = await api.post<{ detail: string }>(`/circles/${id}/join/`);
    return response.data;
  },

  async leaveCircle(id: string): Promise<{ detail: string }> {
    const response = await api.post<{ detail: string }>(`/circles/${id}/leave/`);
    return response.data;
  },

  async getCircleDevices(id: string, params?: Record<string, string>): Promise<PaginatedResponse<IoTDevice>> {
    const response = await api.get<PaginatedResponse<IoTDevice>>(`/circles/${id}/devices/`, { params });
    return response.data;
  },
};
