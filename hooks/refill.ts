import { useCallback, useState } from 'react';
import { refillRequestService, CreateRefillRequestData } from '@/lib/refill';
import { RefillRequest, Vendor } from '@/types';

export const useCreateRefillRequest = () => {
  const [refillRequest, setRefillRequest] = useState<RefillRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = useCallback(async (data: CreateRefillRequestData): Promise<RefillRequest> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await refillRequestService.createRefillRequest(data);
      setRefillRequest(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create refill request';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createRequest, refillRequest, isLoading, error };
};

export const useVendorOrders = () => {
  const [orders, setOrders] = useState<RefillRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await refillRequestService.getRefillRequests(params);
      setOrders(response.results);
      return response.results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { orders, isLoading, error, fetchOrders };
};

export const useAcceptRefillRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptOrder = useCallback(async (id: string): Promise<RefillRequest> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await refillRequestService.acceptRefillRequest(id);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { acceptOrder, isLoading, error };
};

export const useRejectRefillRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectOrder = useCallback(async (id: string): Promise<RefillRequest> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await refillRequestService.rejectRefillRequest(id);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { rejectOrder, isLoading, error };
};

export const useCompleteRefillRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeOrder = useCallback(async (id: string): Promise<RefillRequest> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await refillRequestService.completeRefillRequest(id);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { completeOrder, isLoading, error };
};

export const useRefillRequestDetails = () => {
  const [refillRequest, setRefillRequest] = useState<RefillRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await refillRequestService.getRefillRequest(id);
      setRefillRequest(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch refill request';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchRequest, refillRequest, isLoading, error };
};

export const useCancelRefillRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelRequest = useCallback(async (id: string): Promise<RefillRequest> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await refillRequestService.cancelRefillRequest(id);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel refill request';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { cancelRequest, isLoading, error };
};