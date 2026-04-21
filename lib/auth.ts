import api, { setTokens, clearTokens } from './api';
import { User, LoginResponse, AuthTokens, Client, Vendor } from '../types';

export interface RegisterClientData {
  email: string;
  username: string;
  password: string;
  full_name: string;
  phone_number: string;
  location_latitude?: number;
  location_longitude?: number;
}

export interface RegisterVendorData {
  email: string;
  username: string;
  password: string;
  company_name: string;
  location: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateClientData {
  full_name?: string;
  phone_number?: string;
  location_latitude?: number;
  location_longitude?: number;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login/', data);
    const { access, refresh, user } = response.data;
    setTokens(access, refresh);
    return response.data;
  },

  async registerClient(data: RegisterClientData): Promise<{user: User, tokens: { access: string, refresh: string }}> {
    const response = await api.post<{user: User, tokens: { access: string, refresh: string}}>('/clients/', data);
    const { tokens, user } = response.data;
    setTokens(tokens.access, tokens.refresh);
    return { user, tokens };
  },

  async registerVendor(data: RegisterVendorData): Promise<{user: User, tokens: { access: string, refresh: string }}> {
    const response = await api.post<{user: User, tokens: { access: string, refresh: string}}>('/vendors/', data);
    const { tokens, user } = response.data;
    setTokens(tokens.access, tokens.refresh);
    return { user, tokens };
  },

  async logout(refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } finally {
      clearTokens();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me/');
    return response.data;
  },

  async getMyClientProfile(): Promise<Client> {
    const response = await api.get<Client>('/clients/me/');
    return response.data;
  },

  async getMyVendorProfile(): Promise<Vendor> {
    const response = await api.get<Vendor>('/vendors/me/');
    return response.data;
  },

  async updateClientProfile(data: UpdateClientData): Promise<Client> {
    const response = await api.patch<Client>('/clients/me/', data);
    return response.data;
  },

  async updateVendorProfile(data: Partial<RegisterVendorData>): Promise<Vendor> {
    const response = await api.patch<Vendor>('/vendors/me/', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ detail: string }> {
    const response = await api.post<{ detail: string }>('/auth/change-password/', data);
    return response.data;
  },

  async refreshToken(refresh: string): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/refresh/', { refresh });
    const { access, refresh: newRefresh } = response.data;
    setTokens(access, newRefresh);
    return response.data;
  },
};
