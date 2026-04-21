import { useCallback, useState } from 'react';
import { circleService, CreateCircleData } from '@/lib/circle';
import { MonitoringCircle } from '../types';

export const useCircleList = () => {
  const [circles, setCircles] = useState<MonitoringCircle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCircles = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await circleService.getCircles(params);
      setCircles(response.results);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch circles';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { circles, isLoading, error, fetchCircles };
};

export const useCircleDetails = () => {
  const [circle, setCircle] = useState<MonitoringCircle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCircle = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await circleService.getCircle(id);
      setCircle(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch circle';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { circle, isLoading, error, fetchCircle };
};

export const useCreateCircle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCircle = useCallback(async (data: CreateCircleData): Promise<MonitoringCircle> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await circleService.createCircle(data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create circle';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createCircle, isLoading, error };
};

export const useUpdateCircle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCircle = useCallback(async (id: string, data: Partial<CreateCircleData>): Promise<MonitoringCircle> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await circleService.updateCircle(id, data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update circle';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateCircle, isLoading, error };
};

export const useDeleteCircle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCircle = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await circleService.deleteCircle(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete circle';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteCircle, isLoading, error };
};

export const useJoinCircle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinCircle = useCallback(async (id: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await circleService.joinCircle(id);
      return response.detail;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join circle';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { joinCircle, isLoading, error };
};

export const useLeaveCircle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leaveCircle = useCallback(async (id: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await circleService.leaveCircle(id);
      return response.detail;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to leave circle';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { leaveCircle, isLoading, error };
};