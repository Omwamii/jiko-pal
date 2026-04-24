import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, LoginData, RegisterClientData, RegisterVendorData } from '../lib/auth';
import { getTokens, clearTokens, setTokens } from '../lib/api';
import { User, LoginResponse, Client, Vendor } from '../types';
import { clientService } from '../lib/client';
import { vendorService } from '../lib/vendor';

interface AuthContextType {
  user: User | null;
  clientProfile: Client | null;
  vendorProfile: Vendor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<LoginResponse>;
  registerClient: (data: RegisterClientData) => Promise<void>;
  registerVendor: (data: RegisterVendorData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshClientProfile: () => Promise<void>;
  refreshVendorProfile: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredAuth = useCallback(async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEYS.access),
        AsyncStorage.getItem(TOKEN_KEYS.refresh),
      ]);

      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        const currentUser = await authService.getCurrentUser();
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
            const vendors = await vendorService.getVendors();
            if (vendors.results.length > 0) {
              setVendorProfile(vendors.results[0]);
            }
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

const login = async (data: LoginData) => {
    const response = await authService.login(data);
    
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEYS.access, response.access),
      AsyncStorage.setItem(TOKEN_KEYS.refresh, response.refresh),
    ]);

    setTokens(response.access, response.refresh);
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
    setUser(response.user);
  };

  const registerVendor = async (data: RegisterVendorData) => {
    const response = await authService.registerVendor(data);
    
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEYS.access, response.tokens.access),
      AsyncStorage.setItem(TOKEN_KEYS.refresh, response.tokens.refresh),
    ]);

    setTokens(response.tokens.access, response.tokens.refresh);
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
        login,
        registerClient,
        registerVendor,
        logout,
        refreshUser,
        refreshClientProfile,
        refreshVendorProfile,
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
