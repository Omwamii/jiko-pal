import api from './api';
import { Vendor, VendorSubscription, VendorCatalogue, PaginatedResponse } from '../types';

export interface CreateVendorData {
  company_name: string;
  location: string;
}

export interface VendorWithSubscription extends Vendor {
  is_subscribed?: boolean;
}

export interface CreateCatalogueData {
  cylinder_company: string;
  size: number;
  price: number;
  picture?: any;
  is_available?: boolean;
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

  async getSubscriberDetail(subscriptionId: string): Promise<any> {
    const response = await api.get(`/vendors/${subscriptionId}/subscriber_detail/`);
    return response.data;
  },

  async getSubscriberDevices(subscriptionId: string): Promise<any> {
    const response = await api.get(`/vendors/${subscriptionId}/subscriber_devices/`);
    return response.data;
  },

  async getSubscribersDevices(): Promise<any> {
    const response = await api.get('/vendors/subscribers_devices/');
    return response.data;
  },

  // Catalogue methods
  async getMyCatalogue(): Promise<VendorCatalogue[]> {
    const response = await api.get<VendorCatalogue[]>('/catalogue/my_catalogue/');
    return response.data;
  },

  async getCatalogueByVendor(vendorId: string): Promise<VendorCatalogue[]> {
    const response = await api.get<VendorCatalogue[]>('/catalogue/by_vendor/', {
      params: { vendor_id: vendorId }
    });
    return response.data;
  },

  async createCatalogueItem(data: CreateCatalogueData): Promise<VendorCatalogue> {
    const formData = new FormData();
    formData.append('cylinder_company', data.cylinder_company);
    formData.append('size', data.size.toString());
    formData.append('price', data.price.toString());
    if (data.picture) {
      formData.append('picture', {
        uri: data.picture,
        type: 'image/jpeg',
        name: 'catalogue-image.jpg',
      } as any);
    }
    if (data.is_available !== undefined) {
      formData.append('is_available', data.is_available.toString());
    }

    const response = await api.post<VendorCatalogue>('/catalogue/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateCatalogueItem(id: string, data: Partial<CreateCatalogueData>): Promise<VendorCatalogue> {
    const formData = new FormData();
    if (data.cylinder_company) formData.append('cylinder_company', data.cylinder_company);
    if (data.size !== undefined) formData.append('size', data.size.toString());
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.picture) formData.append('picture', {
      uri: data.picture,
      type: 'image/jpeg',
      name: 'catalogue-image.jpg',
    } as any);
    if (data.is_available !== undefined) formData.append('is_available', data.is_available.toString());

    const response = await api.patch<VendorCatalogue>(`/catalogue/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteCatalogueItem(id: string): Promise<void> {
    await api.delete(`/catalogue/${id}/`);
  },
};