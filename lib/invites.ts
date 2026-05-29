import api from './api';
import type { PaginatedResponse } from '@/types';

export type InviteType = 'circle' | 'platform';

export type Invite = {
  id: string;
  code: string;
  type: InviteType;
  inviter: { id: string; email: string; username: string; role: string; created_at: string; updated_at: string };
  circle: string | null;
  circle_name: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  max_uses: number;
  uses_count: number;
  last_used_at: string | null;
  created_at: string;
  invite_url: string;
  recipient_email?: string | null;
  recipient_phone?: string | null;
};

export const invitesApi = {
  create: async (data: { type: InviteType; circle_id?: string; recipient_email?: string; recipient_phone?: string }) =>
    (await api.post<Invite>('/invites/', data)).data,

  listMine: async (params?: { type?: InviteType; circle_id?: string }) =>
    (await api.get<PaginatedResponse<Invite>>('/invites/', { params })).data,

  getByCode: async (code: string) =>
    (await api.get<Invite>(`/invites/${code}/`)).data,

  accept: async (code: string) =>
    (await api.post<{ detail: string; circle_id?: string }>(`/invites/${code}/accept/`, {})).data,
};
