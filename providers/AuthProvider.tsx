import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { authService, LoginData, RegisterClientData, RegisterVendorData } from '../lib/auth';
import { getTokens, clearTokens, setTokens } from '../lib/api';
import { User, LoginResponse, Client, Vendor } from '../types';
import { clientService } from '../lib/client';
import { getCurrentCoords, isTimestampStale, requestForegroundLocationPermission } from '../lib/location';

interface AuthContextType {
  user: User | null;
  clientProfile: Client | null;
  vendorProfile: Vendor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tokens: { access: string; refresh: string } | null;
  login: (data: LoginData) => Promise<LoginResponse>;
  registerClient: (data: RegisterClientData) => Promise<void>;
  registerVendor: (data: RegisterVendorData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshClientProfile: () => Promise<void>;
  refreshVendorProfile: () => Promise<void>;
  updateVendorLocationIfNeeded: (opts?: { force?: boolean; staleMinutes?: number; showDeniedAlert?: boolean }) => Promise<void>;
  updateClientLocationIfNeeded: (opts?: { force?: boolean; staleMinutes?: number; showDeniedAlert?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEYS = {
  access: '@jiko_pal_access_token',
  refresh: '@jiko_pal_refresh_token',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [clientProfile, setClientProfile] = useState<Client | null>(null);
  const [vendorProfile, setVendorProfile] = useState<Vendor | null>(null);
  const [tokens, setTokensState] = useState<{ access: string; refresh: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateVendorLocationIfNeeded = useCallback(
    async (opts?: { force?: boolean; staleMinutes?: number; showDeniedAlert?: boolean }) => {
      const profile = vendorProfile;
      if (!profile) return;

      const staleMinutes = opts?.staleMinutes ?? 15;
      const shouldUpdate = opts?.force ? true : isTimestampStale(profile.location_updated_at, staleMinutes);
      if (!shouldUpdate) return;

      const perm = await requestForegroundLocationPermission();
      if (perm.status !== 'granted') {
        if (opts?.showDeniedAlert === false) return;
        await new Promise<void>((resolve) => {
          const baseMessage =
            "Location access helps show you to nearby clients. Denying this may reduce your visibility to customers searching for vendors near them.";

          const canTryAgain = perm.canAskAgain !== false;
          if (!canTryAgain) {
            Alert.alert('Location disabled', baseMessage, [{ text: 'OK', onPress: () => resolve() }]);
            return;
          }

          Alert.alert('Location access needed', baseMessage, [
            { text: 'Continue', style: 'cancel', onPress: () => resolve() },
            {
              text: 'Try again',
              onPress: async () => {
                try {
                  await updateVendorLocationIfNeeded({ force: true, staleMinutes });
                } finally {
                  resolve();
                }
              },
            },
          ]);
        });
        return;
      }

      const coords = await getCurrentCoords();
      const updated = await authService.updateVendorProfile({
        location_latitude: coords.latitude,
        location_longitude: coords.longitude,
      });
      setVendorProfile(updated);
    },
    [vendorProfile]
  );

  const updateClientLocationIfNeeded = useCallback(
    async (opts?: { force?: boolean; staleMinutes?: number; showDeniedAlert?: boolean }) => {
      const profile = clientProfile;
      if (!profile) return;

      const staleMinutes = opts?.staleMinutes ?? 15;
      const hasCoords = profile.location_latitude != null && profile.location_longitude != null;
      const shouldUpdate = opts?.force ? true : !hasCoords || isTimestampStale(profile.location_updated_at, staleMinutes);
      if (!shouldUpdate) return;

      const perm = await requestForegroundLocationPermission();
      if (perm.status !== 'granted') {
        if (opts?.showDeniedAlert === false) return;

        await new Promise<void>((resolve) => {
          const baseMessage =
            "Location access helps us show you nearby gas vendors and enables live location-based updates. Denying this may reduce the accuracy of nearby vendor suggestions.";

          const canTryAgain = perm.canAskAgain !== false;
          if (!canTryAgain) {
            Alert.alert('Location disabled', baseMessage, [{ text: 'OK', onPress: () => resolve() }]);
            return;
          }

          Alert.alert('Location access needed', baseMessage, [
            { text: 'Continue', style: 'cancel', onPress: () => resolve() },
            {
              text: 'Try again',
              onPress: async () => {
                try {
                  await updateClientLocationIfNeeded({ force: true, staleMinutes });
                } finally {
                  resolve();
                }
              },
            },
          ]);
        });
        return;
      }

      const coords = await getCurrentCoords();
      const updated = await authService.updateClientProfile({
        location_latitude: coords.latitude,
        location_longitude: coords.longitude,
      });
      setClientProfile(updated);
    },
    [clientProfile]
  );

  const loadStoredAuth = useCallback(async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEYS.access),
        AsyncStorage.getItem(TOKEN_KEYS.refresh),
      ]);

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        setTokensState({ access: accessToken, refresh: refreshToken });
        const currentUser = await authService.getCurrentUser();

        if (!currentUser.is_active) {
          await logout();
          return;
        }

        setUser(currentUser);

        if (currentUser.role === 'client') {
          try {
            const client = await clientService.getMyClient();
            setClientProfile(client);
          } catch (e) {
            console.log('No client profile found');
          }
        } else if (currentUser.role === 'vendor') {
          try {
            const vendor = await authService.getMyVendorProfile();
            setVendorProfile(vendor);
          } catch (e) {
            console.log('No vendor profile found');
          }
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  useEffect(() => {
    if (user?.role !== 'vendor') return;
    if (!vendorProfile) return;
    updateVendorLocationIfNeeded().catch((e) => console.log('Vendor location update failed:', e));
  }, [user?.role, vendorProfile?.id, updateVendorLocationIfNeeded]);

  useEffect(() => {
    if (user?.role !== 'client') return;
    if (!clientProfile) return;
    updateClientLocationIfNeeded().catch((e) => console.log('Client location update failed:', e));
  }, [user?.role, clientProfile?.id, updateClientLocationIfNeeded]);

  const login = async (data: LoginData) => {
    const response = await authService.login(data);
    console.log(response)

    if (!response.user.is_active) {
      await clearTokens();
      throw new Error('Your account has been deactivated. Please contact support at jikopalsupport@gmail.com for account reactivation.');
    }

    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEYS.access, response.access),
      AsyncStorage.setItem(TOKEN_KEYS.refresh, response.refresh),
    ]);

    setTokens(response.access, response.refresh);
    setTokensState({ access: response.access, refresh: response.refresh });
    setUser(response.user);

    if (response.user.role === 'client') {
      try {
        const client = await clientService.getMyClient();
        setClientProfile(client);
      } catch (e) {
        console.log('No client profile found');
      }
    } else if (response.user.role === 'vendor') {
      try {
        const vendor = await authService.getMyVendorProfile();
        setVendorProfile(vendor);
      } catch (e) {
        console.log('No vendor profile found');
      }
    }
    
    return response;
  };

  const registerClient = async (data: RegisterClientData) => {
    const response = await authService.registerClient(data);
    
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEYS.access, response.tokens.access),
      AsyncStorage.setItem(TOKEN_KEYS.refresh, response.tokens.refresh),
    ]);

    setTokens(response.tokens.access, response.tokens.refresh);
    setTokensState({ access: response.tokens.access, refresh: response.tokens.refresh });
    setUser(response.user);
  };

  const registerVendor = async (data: RegisterVendorData) => {
    const response = await authService.registerVendor(data);
    
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEYS.access, response.tokens.access),
      AsyncStorage.setItem(TOKEN_KEYS.refresh, response.tokens.refresh),
    ]);

    setTokens(response.tokens.access, response.tokens.refresh);
    setTokensState({ access: response.tokens.access, refresh: response.tokens.refresh });
    setUser(response.user);
    
    try {
      const vendor = await authService.getMyVendorProfile();
      setVendorProfile(vendor);
    } catch (e) {
      console.log('No vendor profile found');
    }
  };

  const logout = async () => {
    const refreshToken = await AsyncStorage.getItem(TOKEN_KEYS.refresh);
    
    try {
      await authService.logout(refreshToken || undefined);
    } catch (e) {
      console.log('Logout error:', e);
    } finally {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEYS.access),
        AsyncStorage.removeItem(TOKEN_KEYS.refresh),
      ]);
      
      clearTokens();
      setTokensState(null);
      setUser(null);
      setClientProfile(null);
      setVendorProfile(null);
      
      router.replace('/login');
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const refreshClientProfile = async () => {
    try {
      const profile = await authService.getMyClientProfile();
      setClientProfile(profile);
    } catch (error) {
      console.error('Error refreshing client profile:', error);
    }
  };

  const refreshVendorProfile = async () => {
    try {
      const profile = await authService.getMyVendorProfile();
      setVendorProfile(profile);
    } catch (error) {
      console.error('Error refreshing vendor profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        clientProfile,
        vendorProfile,
        isLoading,
        isAuthenticated: !!user,
        tokens,
        login,
        registerClient,
        registerVendor,
        logout,
        refreshUser,
        refreshClientProfile,
        refreshVendorProfile,
        updateVendorLocationIfNeeded,
        updateClientLocationIfNeeded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
