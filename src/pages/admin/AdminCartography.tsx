import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Map, Building2, RefreshCw, Download, Shield } from "lucide-react";

export default function AdminCartography() {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({ total: 0, hopitaux: 0, cliniques: 0, pharmacies: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('osm_health_providers')
        .select('type');

      if (error) throw error;

      setStats({
        total: data?.length || 0,
        hopitaux: data?.filter(p => p.type === 'hopital').length || 0,
        cliniques: data?.filter(p => p.type === 'clinique').length || 0,
        pharmacies: data?.filter(p => p.type === 'pharmacie').length || 0
      });
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    toast.info("Synchronisation en cours...");
    await loadStats();
    toast.success("Données synchronisées");
  };

  if (!isSuperAdmin) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
              <p className="text-muted-foreground">Seuls les super admins peuvent accéder à cette page.</p>
            </CardContent>
          </Card>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cartographie Santé
            </h1>
            <p className="text-muted-foreground mt-1">
              Vue d'ensemble des prestataires de santé au Gabon
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSync} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Synchroniser
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Prestataires', value: stats.total, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { label: 'Hôpitaux', value: stats.hopitaux, icon: Building2, color: 'from-purple-500 to-pink-500' },
            { label: 'Cliniques', value: stats.cliniques, icon: Building2, color: 'from-green-500 to-emerald-500' },
            { label: 'Pharmacies', value: stats.pharmacies, icon: Building2, color: 'from-orange-500 to-amber-500' }
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Carte interactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg bg-muted/20 flex items-center justify-center">
              <p className="text-muted-foreground">Carte des prestataires - En développement</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
