import * as Notifications from 'expo-notifications';
import * as Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from './api';

export interface DeviceTokenData {
  token: string;
  platform: 'ios' | 'android' | 'web';
}

export const pushNotificationService = {
  async registerDeviceToken(token: string): Promise<void> {
    const platform = Platform.OS as 'ios' | 'android';
    
    try {
      await api.post('/notifications/register-device/', {
        token,
        platform,
      });
      console.log('[PUSH] Device token registered');
    } catch (error) {
      console.error('[PUSH ERROR] Failed to register device token:', error);
    }
  },

  async unregisterDeviceToken(token: string): Promise<void> {
    try {
      await api.delete('/notifications/register-device/', {
        data: { token },
      });
      console.log('[PUSH] Device token unregistered');
    } catch (error) {
      console.error('[PUSH ERROR] Failed to unregister device token:', error);
    }
  },

  async getPushToken(): Promise<string | null> {
    try {
      // Check if we're running in Expo Go (no Firebase needed)
      const isExpoGo = Constants.ExecutionEnvironment === 'store-env' as any;
      
      if (!isExpoGo) {
        // For standalone builds, Firebase must be configured
        console.log('[PUSH] Standalone build - ensure Firebase is configured');
      }

      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.log('[PUSH] Push notification permission denied');
          return null;
        }
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      console.log('[PUSH] Got push token:', token.data);
      return token.data;
    } catch (error: any) {
      // Handle Firebase not initialized error gracefully
      if (error.message?.includes('FirebaseApp')) {
        console.log('[PUSH] Firebase not configured - skipping push notifications');
        return null;
      }
      console.error('[PUSH ERROR] Failed to get push token:', error);
      return null;
    }
  },

  setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  },

  onNotificationReceived(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  onNotificationResponseReceived(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
