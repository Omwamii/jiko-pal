import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService, CreateClientData } from '../lib/client';
import { vendorService, CreateVendorData } from '../lib/vendor';
import { circleService, CreateCircleData } from '../lib/circle';
import { notificationService } from '../lib/notification';
import { refillRequestService, CreateRefillRequestData } from '../lib/refill';
import { deviceService } from '../lib/device';
import { authService } from '../lib/auth';

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
  });
};

export const useDeviceReadings = (deviceId: string, params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['deviceReadings', deviceId, params],
    queryFn: () => deviceService.getDeviceReadings(deviceId, params),
    enabled: !!deviceId,
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
