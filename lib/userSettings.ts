import api from './api';
import type { UserSettings } from '../types';

export type UpdateUserSettingsInput = Partial<Pick<
  UserSettings,
  'cylinder_level_alert_threshold' | 'email_notifications' | 'push_notifications' | 'sms_notifications'
>>;

export const userSettingsApi = {
  getMySettings: async () => (await api.get<UserSettings>('/users/me/settings/')).data,
  updateMySettings: async (data: UpdateUserSettingsInput) =>
    (await api.patch<UserSettings>('/users/me/settings/', data)).data,
  requestAccountDeletion: async () =>
    (await api.post<{ detail: string }>('/users/me/request-account-deletion/', {})).data,
};

