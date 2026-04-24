import api from './api';
import { PaginatedResponse } from '../types';

export interface ActivityLog {
  id: string;
  action: string;
  title: string;
  subtitle: string;
  description: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const activityLogService = {
  async getActivityLogs(params?: Record<string, string>): Promise<PaginatedResponse<ActivityLog>> {
    const response = await api.get<PaginatedResponse<ActivityLog>>('/activity-logs/', { params });
    return response.data;
  },

  async getRecentActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    const response = await api.get<ActivityLog[]>('/activity-logs/recent/', {
      params: { limit: String(limit) },
    });
    return response.data;
  },
};