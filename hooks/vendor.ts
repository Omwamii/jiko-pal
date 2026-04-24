import { useCallback, useState } from 'react';
import { vendorService } from '@/lib/vendor';
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