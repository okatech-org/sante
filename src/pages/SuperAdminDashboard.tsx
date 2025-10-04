import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { KPICards } from "@/components/superadmin/KPICards";
import { SystemHealth } from "@/components/superadmin/SystemHealth";
import { QuickActions } from "@/components/superadmin/QuickActions";
import { ProvinceAnalytics } from "@/components/superadmin/ProvinceAnalytics";
import { RecentActivity } from "@/components/superadmin/RecentActivity";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const periods = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" }
];

export default function SuperAdminDashboard() {
  const { user, isSuperAdmin, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!isSuperAdmin || user?.email !== "superadmin@sante.ga") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return (
    <div className="theme-superadmin min-h-screen bg-background">
      <MainLayout>
        <div className="flex flex-col space-y-8 p-6">
          {/* Header avec sélecteur de période */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border/20">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-xl backdrop-blur-lg">
                  <Shield className="h-8 w-8" />
                </div>
                Super Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                SANTE.GA - Système National de Santé Numérique • {user?.email}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {periods.map((period) => (
                  <Button
                    key={period.value}
                    variant={selectedPeriod === period.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.value)}
                    className="backdrop-blur-lg"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {period.label}
                  </Button>
                ))}
              </div>
              <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30 justify-center backdrop-blur-lg">
                <Activity className="h-3 w-3 mr-2" />
                Système Opérationnel
              </Badge>
            </div>
          </div>

          {/* KPI Cards */}
          <KPICards />

          {/* System Health + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SystemHealth />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Analytics par Province */}
          <ProvinceAnalytics />

          {/* Activité Récente */}
          <RecentActivity />
        </div>
      </MainLayout>
    </div>
  );
}
