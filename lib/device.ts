import api from './api';
import { IoTDevice, DeviceReading, DeviceStats, PaginatedResponse } from '../types';

export interface CreateDeviceData {
  device_id: string;
  owner_id: string;
  circle_id?: string | null;
  mac_address?: string;
  current_level?: number;
  battery_level?: number;
  cylinder_size?: number | null;
  activity_mode?: 'low' | 'medium' | 'high' | 'ultra_high';
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

  async changeActivityMode(id: string, activityMode: NonNullable<CreateDeviceData['activity_mode']>) {
    const response = await api.post(`/devices/${id}/change_activity_mode/`, { activity_mode: activityMode });
    return response.data as {
      status: string;
      device_id: string;
      activity_mode: NonNullable<CreateDeviceData['activity_mode']>;
      previous_activity_mode?: NonNullable<CreateDeviceData['activity_mode']>;
      detail?: string;
      warning?: string;
    };
  },

  async deleteDevice(id: string): Promise<void> {
    await api.delete(`/devices/${id}/`);
  },

  async getDeviceReadings(id: string, params?: Record<string, string>): Promise<PaginatedResponse<DeviceReading>> {
    const response = await api.get(`/devices/${id}/readings/`, { params });
    const data: any = response.data;

    // Normalize non-paginated shapes (some endpoints may return a bare array).
    if (Array.isArray(data)) {
      return { count: data.length, next: null, previous: null, results: data };
    }

    // Some backends return { results: [...] } without full pagination metadata.
    if (data && Array.isArray(data.results)) {
      return {
        count: typeof data.count === 'number' ? data.count : data.results.length,
        next: data.next ?? null,
        previous: data.previous ?? null,
        results: data.results,
      };
    }

    // Last-ditch: support { data: [...] }.
    if (data && Array.isArray(data.data)) {
      return { count: data.data.length, next: null, previous: null, results: data.data };
    }

    return { count: 0, next: null, previous: null, results: [] };
  },

  async getLatestDeviceReading(id: string): Promise<DeviceReading> {
    const [byEndpoint, byList] = await Promise.allSettled([
      api.get<DeviceReading>(`/devices/${id}/latest_reading/`),
      deviceService.getDeviceReadings(id, { ordering: '-timestamp', limit: '1' }),
    ]);

    const endpointReading = byEndpoint.status === 'fulfilled' ? byEndpoint.value.data : null;
    const listReading = byList.status === 'fulfilled' ? byList.value.results?.[0] : null;

    if (!endpointReading && listReading) return listReading;
    if (endpointReading && !listReading) return endpointReading;
    if (!endpointReading && !listReading) {
      throw new Error('No readings available for this device.');
    }

    const endpointTs = endpointReading?.timestamp ? Date.parse(endpointReading.timestamp) : NaN;
    const listTs = listReading?.timestamp ? Date.parse(listReading.timestamp) : NaN;

    if (!Number.isNaN(listTs) && (Number.isNaN(endpointTs) || listTs >= endpointTs)) {
      return listReading!;
    }
    return endpointReading!;
  },

  async addReading(id: string, data: { level_percent: number; battery_level?: number }): Promise<DeviceReading> {
    const response = await api.post<DeviceReading>(`/devices/${id}/reading/`, data);
    return response.data;
  },

  async getDeviceStats(deviceId: string): Promise<DeviceStats> {
    const response = await api.get<DeviceStats>('/readings/stats/', { params: { device_id: deviceId } });
    return response.data;
  },

  async disconnectDevice(id: string): Promise<void> {
    await api.post(`/devices/${id}/disconnect/`);
  },
};
