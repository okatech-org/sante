import { useEffect, useState } from "react";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Building2, Shield } from "lucide-react";
import { CNAMGSVerificationCard } from "@/components/professional/CNAMGSVerificationCard";
import { CNOMVerificationCard } from "@/components/professional/CNOMVerificationCard";

export default function Integrations() {
  const { user } = useAuth();
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfessionalData();
    }
  }, [user]);

  const fetchProfessionalData = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfessional(data);
    } catch (error) {
      console.error('Error fetching professional:', error);
      toast.error("Erreur lors du chargement de vos données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  if (!professional) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Profil professionnel non trouvé</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Intégrations</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos intégrations avec la CNAMGS et le CNOM
          </p>
        </div>

        <Tabs defaultValue="cnamgs" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="cnamgs" className="gap-2">
              <Building2 className="h-4 w-4" />
              CNAMGS
            </TabsTrigger>
            <TabsTrigger value="cnom" className="gap-2">
              <Shield className="h-4 w-4" />
              CNOM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cnamgs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Caisse Nationale d'Assurance Maladie</CardTitle>
                <CardDescription>
                  Gérez votre conventionnement et activez le tiers-payant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CNAMGSVerificationCard professionalId={professional.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cnom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conseil National de l'Ordre des Médecins</CardTitle>
                <CardDescription>
                  Vérification de votre inscription à l'ordre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CNOMVerificationCard
                  professionalId={professional.id}
                  numeroOrdre={professional.numero_ordre}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PatientDashboardLayout>
  );
}