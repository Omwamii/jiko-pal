import api from './api';
import { Client, PaginatedResponse } from '../types';

export interface CreateClientData {
  full_name: string;
  phone_number: string;
  location_latitude?: number;
  location_longitude?: number;
}

export const clientService = {
  async getClients(params?: Record<string, string>): Promise<PaginatedResponse<Client>> {
    const response = await api.get<PaginatedResponse<Client>>('/clients/', { params });
    return response.data;
  },

  async getClient(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}/`);
    return response.data;
  },

  async getMyClient(): Promise<Client> {
    const response = await api.get<Client>('/clients/me/');
    return response.data;
  },

  async updateClient(id: string, data: Partial<CreateClientData>): Promise<Client> {
    const response = await api.patch<Client>(`/clients/${id}/`, data);
    return response.data;
  },

  async deleteClient(id: string): Promise<void> {
    await api.delete(`/clients/${id}/`);
  },
};
