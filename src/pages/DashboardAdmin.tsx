import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCog, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardAdmin() {
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    establishments: 0,
    professionals: 0,
    pendingApprovals: 0,
  });

  // Rediriger les super admins vers leur dashboard spécifique
  useEffect(() => {
    if (isSuperAdmin) {
      navigate("/dashboard/superadmin");
    }
  }, [isSuperAdmin, navigate]);

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      // Compter les utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Compter les établissements
      const { count: establishmentsCount } = await supabase
        .from('pharmacies')
        .select('*', { count: 'exact', head: true });

      // Compter les professionnels
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

    if (user?.id && isAdmin && !isSuperAdmin) {
      loadStats();
    }
  }, [user?.id, isAdmin, isSuperAdmin]);

  const statsData = [
    { title: "Total utilisateurs", value: stats.totalUsers, icon: Users, color: "#00d4ff" },
    { title: "Établissements", value: stats.establishments, icon: Building2, color: "#0088ff" },
    { title: "Professionnels", value: stats.professionals, icon: UserCog, color: "#ffaa00" },
    { title: "En attente d'approbation", value: stats.pendingApprovals, icon: AlertCircle, color: "#ff0088" },
  ];

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-8 bg-card/80 border border-border shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#0088ff]/20">
              <Shield className="w-8 h-8 text-[#0088ff]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Administrateur</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Admin - {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-xl backdrop-blur-xl p-4 sm:p-6 text-center bg-card/80 border border-border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: stat.color }} />
                </div>
                <p className="text-xs sm:text-sm mb-2 text-muted-foreground font-medium">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#ff0088]/20">
                <AlertCircle className="w-5 h-5 text-[#ff0088]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Demandes en attente</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.pendingApprovals} professionnel{stats.pendingApprovals > 1 ? 's' : ''} en attente de validation
            </p>
          </div>

          <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00ff88]/20">
                <Shield className="w-5 h-5 text-[#00ff88]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Activité récente</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Aucune alerte système
            </p>
          </div>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}
