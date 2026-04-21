import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import QueryProvider from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="account-type" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="vendor-dashboard" />
            <Stack.Screen name="vendor-orders" />
            <Stack.Screen name="vendor-order-detail" />
            <Stack.Screen name="vendor-mark-delivered" />
            <Stack.Screen name="vendor-delivery-success" />
            <Stack.Screen name="vendor-reviews" />
            <Stack.Screen name="vendor-subscribers" />
            <Stack.Screen name="vendor-customer-detail" />
            <Stack.Screen name="vendor-customer-chat" />
            <Stack.Screen name="vendor-monitor-detail" />
            <Stack.Screen name="vendor-settings" />
            <Stack.Screen name="vendor-business-information" />
            <Stack.Screen name="vendor-password-security" />
            <Stack.Screen name="vendor-analytics" />
            <Stack.Screen name="vendor-help" />
            <Stack.Screen name="monitors" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
