import { useState, useEffect, useCallback } from 'react';
import SuperAdminService, { 
  SystemMetrics, 
  SystemHealth, 
  SecurityIncident,
  SecurityAuditLog 
} from '@/services/SuperAdminService';
import { useOfflineAuth } from '@/contexts/OfflineAuthContext';
import { toast } from 'sonner';

export const useSuperAdmin = () => {
  const { user, isSuperAdmin } = useOfflineAuth();
  const [loading, setLoading] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  // Check if user has permission
  const hasPermission = useCallback((category: string, action: string): boolean => {
    if (!isSuperAdmin) return false;
    // In real implementation, check specific permissions
    return true;
  }, [isSuperAdmin]);

  // Fetch system metrics
  const fetchSystemMetrics = useCallback(async () => {
    if (!isSuperAdmin) return;
    
    setLoading(true);
    try {
      const metrics = await SuperAdminService.getSystemMetrics();
      setSystemMetrics(metrics);
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      toast.error('Erreur lors de la récupération des métriques');
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  // Fetch system health
  const fetchSystemHealth = useCallback(async () => {
    if (!isSuperAdmin) return;
    
    setLoading(true);
    try {
      const health = await SuperAdminService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      toast.error('Erreur lors de la vérification de la santé système');
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  // Perform security audit
  const performSecurityAudit = useCallback(async () => {
    if (!hasPermission('security', 'view_logs')) {
      toast.error('Permission refusée');
      return null;
    }

    setLoading(true);
    try {
      const audit = await SuperAdminService.performSecurityAudit();
      toast.success('Audit de sécurité terminé');
      return audit;
    } catch (error) {
      console.error('Failed to perform security audit:', error);
      toast.error('Erreur lors de l\'audit de sécurité');
      return null;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // Handle security incident
  const handleSecurityIncident = useCallback(async (
    incident: Omit<SecurityIncident, 'id' | 'timestamp'>
  ) => {
    if (!hasPermission('security', 'emergency_shutdown')) {
      toast.error('Permission refusée');
      return null;
    }

    setLoading(true);
    try {
      const result = await SuperAdminService.handleSecurityIncident(incident);
      toast.success('Incident de sécurité enregistré');
      return result;
    } catch (error) {
      console.error('Failed to handle security incident:', error);
      toast.error('Erreur lors du traitement de l\'incident');
      return null;
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // Suspend user
  const suspendUser = useCallback(async (userId: string, reason: string) => {
    if (!hasPermission('users', 'suspend')) {
      toast.error('Permission refusée');
      return false;
    }

    setLoading(true);
    try {
      await SuperAdminService.suspendUser(userId, reason, user?.id || '');
      toast.success('Utilisateur suspendu avec succès');
      return true;
    } catch (error) {
      console.error('Failed to suspend user:', error);
      toast.error('Erreur lors de la suspension de l\'utilisateur');
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, user]);

  // Reset user password
  const resetUserPassword = useCallback(async (userId: string) => {
    if (!hasPermission('users', 'reset_password')) {
      toast.error('Permission refusée');
      return null;
    }

    setLoading(true);
    try {
      const result = await SuperAdminService.resetUserPassword(userId, user?.id || '');
      toast.success('Mot de passe réinitialisé avec succès');
      return result;
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error('Erreur lors de la réinitialisation du mot de passe');
      return null;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, user]);

  // Suspend establishment
  const suspendEstablishment = useCallback(async (establishmentId: string, reason: string) => {
    if (!hasPermission('establishments', 'suspend')) {
      toast.error('Permission refusée');
      return false;
    }

    setLoading(true);
    try {
      await SuperAdminService.suspendEstablishment(establishmentId, reason, user?.id || '');
      toast.success('Établissement suspendu avec succès');
      return true;
    } catch (error) {
      console.error('Failed to suspend establishment:', error);
      toast.error('Erreur lors de la suspension de l\'établissement');
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, user]);

  // Get dashboard stats
  const getDashboardStats = useCallback(async () => {
    if (!isSuperAdmin) return null;

    setLoading(true);
    try {
      const stats = await SuperAdminService.getDashboardStats();
      return stats;
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      toast.error('Erreur lors de la récupération des statistiques');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  // Load audit logs
  const loadAuditLogs = useCallback(() => {
    if (!hasPermission('security', 'view_logs')) return;
    
    const logs = JSON.parse(localStorage.getItem('security_audit_logs') || '[]');
    setAuditLogs(logs);
  }, [hasPermission]);

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    if (!isSuperAdmin) return;

    fetchSystemMetrics();
    fetchSystemHealth();
    loadAuditLogs();

    const interval = setInterval(() => {
      fetchSystemMetrics();
      fetchSystemHealth();
      loadAuditLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, [isSuperAdmin, fetchSystemMetrics, fetchSystemHealth, loadAuditLogs]);

  return {
    loading,
    systemMetrics,
    systemHealth,
    auditLogs,
    hasPermission,
    fetchSystemMetrics,
    fetchSystemHealth,
    performSecurityAudit,
    handleSecurityIncident,
    suspendUser,
    resetUserPassword,
    suspendEstablishment,
    getDashboardStats,
    loadAuditLogs
  };
};
