import api from './api';
import { RefillRequest, RefillRequestStatus, Review, PaginatedResponse } from '../types';

export interface CreateRefillRequestData {
  provider_id: string;
  device_id?: string;
  scheduled_date?: string;
  notes?: string;
}

export interface UpdateRefillStatusData {
  status: RefillRequestStatus;
}

export const refillRequestService = {
  async getRefillRequests(params?: Record<string, string>): Promise<PaginatedResponse<RefillRequest>> {
    const response = await api.get<PaginatedResponse<RefillRequest>>('/refill-requests/', { params });
    return response.data;
  },

  async getRefillRequest(id: string): Promise<RefillRequest> {
    const response = await api.get<RefillRequest>(`/refill-requests/${id}/`);
    return response.data;
  },

  async createRefillRequest(data: CreateRefillRequestData): Promise<RefillRequest> {
    const response = await api.post<RefillRequest>('/refill-requests/', data);
    return response.data;
  },

  async acceptRefillRequest(id: string): Promise<RefillRequest> {
    const response = await api.patch<RefillRequest>(`/refill-requests/${id}/status/`, { status: 'accepted' });
    return response.data;
  },

  async startRefillRequest(id: string): Promise<RefillRequest> {
    const response = await api.patch<RefillRequest>(`/refill-requests/${id}/status/`, { status: 'in_transit' });
    return response.data;
  },

  async completeRefillRequest(id: string): Promise<RefillRequest> {
    const response = await api.patch<RefillRequest>(`/refill-requests/${id}/status/`, { status: 'completed' });
    return response.data;
  },

  async rejectRefillRequest(id: string): Promise<RefillRequest> {
    const response = await api.patch<RefillRequest>(`/refill-requests/${id}/status/`, { status: 'cancelled' });
    return response.data;
  },

  async updateRefillStatus(id: string, data: UpdateRefillStatusData): Promise<RefillRequest> {
    const response = await api.patch<RefillRequest>(`/refill-requests/${id}/status/`, data);
    return response.data;
  },

  async cancelRefillRequest(id: string): Promise<RefillRequest> {
    const response = await api.patch<RefillRequest>(`/refill-requests/${id}/status/`, { status: 'cancelled' });
    return response.data;
  },

  async deleteRefillRequest(id: string): Promise<void> {
    await api.delete(`/refill-requests/${id}/`);
  },
};

export interface CreateReviewData {
  request_id: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  async getReviews(params?: Record<string, string>): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>('/reviews/', { params });
    return response.data;
  },

  async getReview(id: string): Promise<Review> {
    const response = await api.get<Review>(`/reviews/${id}/`);
    return response.data;
  },

  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await api.post<Review>('/reviews/', data);
    return response.data;
  },

  async deleteReview(id: string): Promise<void> {
    await api.delete(`/reviews/${id}/`);
  },
};
