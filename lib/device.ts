import api from './api';
import { IoTDevice, DeviceReading, DeviceStats, PaginatedResponse } from '../types';

export interface CreateDeviceData {
  device_id: string;
  owner_id: string;
  circle_id?: string | null;
  mac_address?: string;
  current_level?: number;
  battery_level?: number;
}

export const deviceService = {
  async getDevices(params?: Record<string, string>): Promise<PaginatedResponse<IoTDevice>> {
    const response = await api.get<PaginatedResponse<IoTDevice>>('/devices/', { params });
    return response.data;
  },

  async getDevice(id: string): Promise<IoTDevice> {
    const response = await api.get<IoTDevice>(`/devices/${id}/`);
    return response.data;
  },

  async createDevice(data: CreateDeviceData): Promise<IoTDevice> {
    const response = await api.post<IoTDevice>('/devices/', data);
    return response.data;
  },

  async updateDevice(id: string, data: Partial<CreateDeviceData>): Promise<IoTDevice> {
    const response = await api.patch<IoTDevice>(`/devices/${id}/`, data);
    return response.data;
  },

  async deleteDevice(id: string): Promise<void> {
    await api.delete(`/devices/${id}/`);
  },

  async getDeviceReadings(id: string, params?: Record<string, string>): Promise<PaginatedResponse<DeviceReading>> {
    const response = await api.get<PaginatedResponse<DeviceReading>>(`/devices/${id}/readings/`, { params });
    return response.data;
  },

  async addReading(id: string, data: { level_percent: number; battery_level?: number }): Promise<DeviceReading> {
    const response = await api.post<DeviceReading>(`/devices/${id}/reading/`, data);
    return response.data;
  },

  async getDeviceStats(deviceId: string): Promise<DeviceStats> {
    const response = await api.get<DeviceStats>('/readings/stats/', { params: { device_id: deviceId } });
    return response.data;
  },
};
