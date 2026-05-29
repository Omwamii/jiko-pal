import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';
import { navigateFromNotificationLink } from '@/lib/deepLinking';
import { pushNotificationService } from '@/lib/pushNotifications';

function getDeepLinkFromNotificationResponse(response: Notifications.NotificationResponse | null | undefined) {
  const data: any = response?.notification?.request?.content?.data;
  return (data?.deep_link ?? data?.deepLink ?? data?.action_url ?? data?.actionUrl) as string | null | undefined;
}

export function NotificationResponseNavigator() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const pendingLinkRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleLink = async (link: string) => {
      navigateFromNotificationLink({ router, urlOrPath: link, isAuthenticated, role: user?.role });
      try {
        // Prevent replaying the same "last notification response" on next app start/login.
        await Notifications.clearLastNotificationResponseAsync();
      } catch {
        // no-op
      }
    };

    if (!isLoading) {
      const pending = pendingLinkRef.current;
      if (pending) {
        pendingLinkRef.current = null;
        handleLink(pending).catch(() => {});
      } else {
        Notifications.getLastNotificationResponseAsync()
          .then((last) => {
            if (!isMounted) return;
            const link = getDeepLinkFromNotificationResponse(last || undefined);
            if (!link) return;
            handleLink(link).catch(() => {});
          })
          .catch(() => {});
      }
    }

    const sub = pushNotificationService.onNotificationResponseReceived((response) => {
      const link = getDeepLinkFromNotificationResponse(response);
      if (!link) return;
      if (isLoading) {
        pendingLinkRef.current = link;
        return;
      }
      handleLink(link).catch(() => {});
    });

    return () => {
      isMounted = false;
      sub.remove();
    };
  }, [router, isAuthenticated, isLoading, user?.role]);

  return null;
}
