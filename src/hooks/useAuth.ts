import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore, User } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  role: string;
  permissions: string[];
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, logout: logoutStore, token, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axios.post<LoginResponse>('/api/auth/login', credentials);
      return data;
    },
    onSuccess: ({ token, user, role, permissions }) => {
      const userWithRole: User = {
        ...user,
        role: role || user.role,
        permissions,
      };
      setAuth(token, userWithRole);
      
      // Redirection basée sur le rôle
      if (role === 'MINISTRE' || role === 'ADMIN' || role === 'SUPER_ADMIN') {
        navigate('/dashboard');
        toast.success(`Bienvenue ${user.firstName || user.email}`);
      } else {
        navigate('/');
        toast.success('Connexion réussie');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erreur de connexion');
    },
  });

  const logoutUser = () => {
    logoutStore();
    navigate('/');
    toast.info('Déconnexion réussie');
  };

  return {
    login: loginMutation.mutate,
    logout: logoutUser,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    token,
    user,
    isAuthenticated,
  };
};
