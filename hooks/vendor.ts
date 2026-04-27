import { useCallback, useState } from 'react';
import { vendorService } from '@/lib/vendor';
import { authService } from '@/lib/auth';
import { Vendor, VendorSubscription } from '@/types';

export const useVendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await vendorService.getVendors(params);
      setVendors(response.results);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vendors';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { vendors, isLoading, error, fetchVendors };
};

export const useVendorDetails = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendor = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendor(id);
      setVendor(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vendor';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { vendor, isLoading, error, fetchVendor };
};

export const useVendorSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<VendorSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getMySubscriptions();
      setSubscriptions(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscriptions';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { subscriptions, isLoading, error, fetchSubscriptions };
};

export const useVendorSubscribers = () => {
  const [subscribers, setSubscribers] = useState<VendorSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getSubscribers();
      setSubscribers(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscribers';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { subscribers, isLoading, error, fetchSubscribers };
};

export interface SubscriberDeviceInfo {
  id: string;
  device_id: string;
  owner_id: string;
  current_level: number;
  battery_level: number;
  status: string;
  last_seen: string | null;
  circle: string | null;
}

export const useSubscribersDevices = () => {
  const [devicesByClient, setDevicesByClient] = useState<{[key: string]: SubscriberDeviceInfo[]}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribersDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getSubscribersDevices();
      setDevicesByClient(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscribers devices';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { devicesByClient, isLoading, error, fetchSubscribersDevices };
};

export interface SubscriberDetail {
  id: string;
  client: {
    id: string;
    full_name: string;
    phone_number: string;
    email: string | null;
    location_latitude: string | null;
    location_longitude: string | null;
  };
  subscribed_at: string | null;
  orders_count: number;
  cylinders_count: number;
}

export interface SubscriberDevice {
  id: string;
  device_id: string;
  current_level: number;
  battery_level: number;
  status: string;
  last_seen: string | null;
  circle: string | null;
}

export const useSubscriberDetail = () => {
  const [detail, setDetail] = useState<SubscriberDetail | null>(null);
  const [devices, setDevices] = useState<SubscriberDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriberDetail = useCallback(async (subscriptionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [detailData, devicesData] = await Promise.all([
        vendorService.getSubscriberDetail(subscriptionId),
        vendorService.getSubscriberDevices(subscriptionId),
      ]);
      setDetail(detailData);
      setDevices(devicesData);
      return { detail: detailData, devices: devicesData };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscriber detail';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { detail, devices, isLoading, error, fetchSubscriberDetail };
};

export const useSubscribeVendor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (vendorId: string): Promise<VendorSubscription> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await vendorService.subscribeToVendor(vendorId);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { subscribe, isLoading, error };
};

export const useUnsubscribeVendor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsubscribe = useCallback(async (vendorId: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await vendorService.unsubscribeFromVendor(vendorId);
      return response.detail;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { unsubscribe, isLoading, error };
};

export interface VendorProfile {
  id: string;
  company_name: string;
  location: string;
  is_available: boolean;
  business_registration_number: string;
  tax_pin: string;
  business_description: string;
  primary_phone: string;
  alternate_phone: string;
  website: string;
  street_address: string;
  city: string;
  county: string;
  postal_code: string;
  delivery_radius: number;
  created_at: string;
  updated_at: string;
}

export const useVendorProfile = () => {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.getMyVendorProfile();
      setProfile(data as unknown as VendorProfile);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<VendorProfile>): Promise<VendorProfile> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.updateVendorProfile(data as any);
      setProfile(response as unknown as VendorProfile);
      return response as unknown as VendorProfile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { profile, isLoading, error, fetchProfile, updateProfile };
};