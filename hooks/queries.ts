import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { clientService, CreateClientData } from '../lib/client';
import { vendorService, CreateVendorData, CreateCatalogueData } from '../lib/vendor';
import { circleService, CreateCircleData } from '../lib/circle';
import { notificationService } from '../lib/notification';
import { refillRequestService, reviewService, CreateRefillRequestData } from '../lib/refill';
import { deviceService } from '../lib/device';
import { authService } from '../lib/auth';
import { activityLogService } from '../lib/activity';
import { chatApi } from '../lib/chat';
import { userSettingsApi, type UpdateUserSettingsInput } from '../lib/userSettings';
import { ActivityLog, Conversation, Message, VendorCatalogue, VendorAnalyticsPeriod } from '../types';

export const useClient = (id?: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id!),
    enabled: !!id,
  });
};

export const useMyClient = () => {
  return useQuery({
    queryKey: ['myClient'],
    queryFn: () => clientService.getMyClient(),
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientData> }) =>
      clientService.updateClient(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client', data.id] });
      queryClient.invalidateQueries({ queryKey: ['myClient'] });
    },
  });
};

export const useVendors = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['vendors', params],
    queryFn: () => vendorService.getVendors(params),
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => vendorService.getVendor(id),
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVendorData> }) =>
      vendorService.updateVendor(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendor', data.id] });
    },
  });
};

export const useToggleVendorAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vendorService.toggleAvailability(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendor', data.id] });
    },
  });
};

export const useCircles = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['circles', params],
    queryFn: () => circleService.getCircles(params),
  });
};

export const useCircle = (id: string) => {
  return useQuery({
    queryKey: ['circle', id],
    queryFn: () => circleService.getCircle(id),
  });
};

export const useCreateCircle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCircleData) => circleService.createCircle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
    },
  });
};

export const useJoinCircle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => circleService.joinCircle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
    },
  });
};

export const useLeaveCircle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => circleService.leaveCircle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
    },
  });
};

export const useNotifications = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notificationCount'],
    queryFn: () => notificationService.getUnreadCount(),
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
    },
  });
};

export const useDevices = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['devices', params],
    queryFn: () => deviceService.getDevices(params),
  });
};

export const useDevice = (id: string) => {
  return useQuery({
    queryKey: ['device', id],
    queryFn: () => deviceService.getDevice(id),
    enabled: !!id,
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => deviceService.updateDevice(id, data as any),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', variables.id] });
    },
  });
};

export const useChangeActivityMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      activity_mode,
    }: {
      id: string;
      activity_mode: 'low' | 'medium' | 'high' | 'ultra_high' | 'perpetual';
    }) => deviceService.changeActivityMode(id, activity_mode),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', variables.id] });
    },
  });
};

export const useDisconnectDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: string) => deviceService.disconnectDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

export const useDeviceReadings = (deviceId: string, params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['deviceReadings', deviceId, params],
    queryFn: () => deviceService.getDeviceReadings(deviceId, params),
    enabled: !!deviceId,
  });
};

export const useLatestDeviceReading = (deviceId: string) => {
  return useQuery({
    queryKey: ['deviceLatestReading', deviceId],
    queryFn: () => deviceService.getLatestDeviceReading(deviceId),
    enabled: !!deviceId,
    // refetchInterval: 30_000,
  });
};

export const useDeviceStats = (deviceId: string) => {
  return useQuery({
    queryKey: ['deviceStats', deviceId],
    queryFn: () => deviceService.getDeviceStats(deviceId),
    enabled: !!deviceId,
  });
};

export const useRefillRequests = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['refillRequests', params],
    queryFn: () => refillRequestService.getRefillRequests(params),
  });
};

export const useRefillRequest = (id: string) => {
  return useQuery({
    queryKey: ['refillRequest', id],
    queryFn: () => refillRequestService.getRefillRequest(id),
  });
};

export const useCreateRefillRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRefillRequestData) => refillRequestService.createRefillRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refillRequests'] });
    },
  });
};

export const useUpdateRefillStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      refillRequestService.updateRefillStatus(id, { status: status as any }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['refillRequests'] });
      queryClient.invalidateQueries({ queryKey: ['refillRequest', data.id] });
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActivityLogs = (limit: number = 10) => {
  return useQuery({
    queryKey: ['activityLogs', limit],
    queryFn: () => activityLogService.getRecentActivityLogs(limit),
    staleTime: 60 * 1000,
  });
};

export const useConversations = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: () => chatApi.getConversations(),
  });
};

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => chatApi.getConversation(id),
    enabled: !!id,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { vendor_id?: string; client_id?: string }) =>
      chatApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatApi.getMessages(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMarkMessagesRead = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatApi.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useUserSettings = () => {
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: () => userSettingsApi.getMySettings(),
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserSettingsInput) => userSettingsApi.updateMySettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });
};

export const useRequestAccountDeletion = () => {
  return useMutation({
    mutationFn: () => userSettingsApi.requestAccountDeletion(),
  });
};

export const useDeactivateAccount = () => {
  return useMutation({
    mutationFn: () => api.post('/auth/deactivate/'),
  });
};

export const useReviews = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewService.getReviews(params),
  });
};

export const useMyCatalogue = () => {
  return useQuery({
    queryKey: ['myCatalogue'],
    queryFn: () => vendorService.getMyCatalogue(),
  });
};

export const useCatalogueByVendor = (vendorId: string) => {
  return useQuery({
    queryKey: ['catalogue', vendorId],
    queryFn: () => vendorService.getCatalogueByVendor(vendorId),
    enabled: !!vendorId,
  });
};

export const useCreateCatalogueItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCatalogueData) => vendorService.createCatalogueItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCatalogue'] });
    },
  });
};

export const useUpdateCatalogueItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCatalogueData> }) =>
      vendorService.updateCatalogueItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCatalogue'] });
    },
  });
};

export const useDeleteCatalogueItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vendorService.deleteCatalogueItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCatalogue'] });
    },
  });
};

export const useVendorReviews = (vendorId: string) => {
  return useQuery({
    queryKey: ['vendorReviews', vendorId],
    queryFn: () => reviewService.getReviews({ vendor: vendorId }),
    enabled: !!vendorId,
  });
};

export const useVendorAnalytics = (period: VendorAnalyticsPeriod) => {
  return useQuery({
    queryKey: ['vendorAnalytics', period],
    queryFn: () => vendorService.getMyAnalytics(period),
  });
};
