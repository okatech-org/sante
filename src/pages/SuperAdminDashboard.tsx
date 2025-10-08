import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { SuperAdminHeader } from "@/components/superadmin/SuperAdminHeader";
import { AdminStatCard } from "@/components/superadmin/AdminStatCard";
import { AdminActionCard } from "@/components/superadmin/AdminActionCard";
import { RecentActivityCard } from "@/components/superadmin/RecentActivityCard";
import { Users, Building2, UserCog, Activity, Settings, Shield, FileText, AlertCircle, CheckCircle, Clock, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function SuperAdminDashboard() {
  const { user, isSuperAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    establishments: 0,
    professionals: 0,
    pendingApprovals: 0,
  });

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      // Compter les utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Compter les établissements (pharmacies pour l'instant)
      const { count: establishmentsCount } = await supabase
        .from('pharmacies')
        .select('*', { count: 'exact', head: true });

      // Compter les professionnels (users avec role doctor ou medical_staff)
      const { count: professionalsCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['doctor', 'medical_staff']);

      // Compter les demandes en attente
      const { count: pendingCount } = await supabase
        .from('profile_change_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalUsers: usersCount || 0,
        establishments: establishmentsCount || 0,
        professionals: professionalsCount || 0,
        pendingApprovals: pendingCount || 0,
      });
    };

    if (user?.id) {
      loadStats();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Chargement...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    navigate("/dashboard/admin");
    return null;
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <SuperAdminHeader />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <AdminActionCard
            title="Gérer les utilisateurs"
            description="Voir et gérer tous les utilisateurs"
            icon={Users}
            color="#00d4ff"
            onClick={() => navigate('/admin/users')}
          />
          <AdminActionCard
            title="Paramètres système"
            description="Configuration du système"
            icon={Settings}
            color="#ff0088"
            onClick={() => navigate('/admin/settings')}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <AdminStatCard
            label="Utilisateurs"
            value={stats.totalUsers}
            icon={Users}
            trend="Total des comptes"
            color="#00d4ff"
            onClick={() => navigate('/admin/users')}
          />
          <AdminStatCard
            label="Établissements"
            value={stats.establishments}
            icon={Building2}
            trend="Pharmacies et cliniques"
            color="#0088ff"
            onClick={() => navigate('/admin/establishments')}
          />
          <AdminStatCard
            label="Professionnels"
            value={stats.professionals}
            icon={UserCog}
            trend="Médecins et personnel"
            color="#ffaa00"
            onClick={() => navigate('/admin/professionals')}
          />
          <AdminStatCard
            label="En attente"
            value={stats.pendingApprovals}
            icon={Clock}
            trend="Demandes à traiter"
            color="#ff0088"
            onClick={() => navigate('/admin/approvals')}
          />
        </div>

        {/* System Health */}
        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">État du système</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Base de données', status: 'En ligne', icon: Activity, color: '#00d4ff' },
              { label: 'Authentification', status: 'Actif', icon: Shield, color: '#0088ff' },
              { label: 'Stockage', status: 'Opérationnel', icon: FileText, color: '#ffaa00' },
              { label: 'API', status: 'Disponible', icon: CheckCircle, color: '#00ff88' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: item.color }} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1">{item.label}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{item.status}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
            Activité récente
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <RecentActivityCard
              time="Il y a 5 min"
              event="Nouvel utilisateur inscrit"
              user="patient@example.com"
              icon={UserPlus}
              color="#00d4ff"
            />
            <RecentActivityCard
              time="Il y a 15 min"
              event="Demande d'approbation"
              user="Dr. Martin Okome"
              icon={Clock}
              color="#0088ff"
            />
            <RecentActivityCard
              time="Il y a 1h"
              event="Modification de profil approuvée"
              user="Jean Mbadinga"
              icon={CheckCircle}
              color="#00ff88"
            />
            <RecentActivityCard
              time="Il y a 2h"
              event="Alerte système"
              user="Espace de stockage à 75%"
              icon={AlertCircle}
              color="#ff0088"
            />
          </div>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}
