import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import neuralApi from '../lib/neuralApi';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await neuralApi.getMe();
      setUser(userData.user);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (credentials: any) => {
    try {
      setLoading(true);
      const data = await neuralApi.login(credentials);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      setLoading(true);
      const data = await neuralApi.register(userData);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await neuralApi.logout();
      setUser(null);
      setError(null);
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}

export default useAuth;
