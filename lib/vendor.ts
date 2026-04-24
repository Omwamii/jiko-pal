import api from './api';
import { Vendor, VendorSubscription, PaginatedResponse } from '../types';

export interface CreateVendorData {
  company_name: string;
  location: string;
}

export interface VendorWithSubscription extends Vendor {
  is_subscribed?: boolean;
}

export const vendorService = {
  async getVendors(params?: Record<string, string>): Promise<PaginatedResponse<Vendor>> {
    const response = await api.get<PaginatedResponse<Vendor>>('/vendors/', { params });
    return response.data;
  },

  async getVendor(id: string): Promise<Vendor> {
    const response = await api.get<Vendor>(`/vendors/${id}/`);
    return response.data;
  },

  async updateVendor(id: string, data: Partial<CreateVendorData>): Promise<Vendor> {
    const response = await api.patch<Vendor>(`/vendors/${id}/`, data);
    return response.data;
  },

  async toggleAvailability(id: string): Promise<Vendor> {
    const response = await api.patch<Vendor>(`/vendors/${id}/availability/`);
    return response.data;
  },

  async deleteVendor(id: string): Promise<void> {
    await api.delete(`/vendors/${id}/`);
  },

  async subscribeToVendor(id: string): Promise<VendorSubscription> {
    const response = await api.post<VendorSubscription>(`/vendors/${id}/subscribe/`);
    return response.data;
  },

  async unsubscribeFromVendor(id: string): Promise<{ detail: string }> {
    const response = await api.post<{ detail: string }>(`/vendors/${id}/unsubscribe/`);
    return response.data;
  },

  async getMySubscriptions(): Promise<VendorSubscription[]> {
    const response = await api.get<VendorSubscription[]>('/vendors/my_subscriptions/');
    return response.data;
  },

  async getSubscribers(): Promise<VendorSubscription[]> {
    const response = await api.get<VendorSubscription[]>('/vendors/subscribers/');
    return response.data;
  },
};
