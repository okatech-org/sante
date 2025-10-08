import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CNAMGSVerificationCardProps {
  professionalId: string;
}

export function CNAMGSVerificationCard({ professionalId }: CNAMGSVerificationCardProps) {
  const [conventions, setConventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConventions();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('professional-conventions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'professional_conventions',
          filter: `professional_id=eq.${professionalId}`,
        },
        () => {
          fetchConventions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  const fetchConventions = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_conventions')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConventions(data || []);
    } catch (error) {
      console.error('Error fetching conventions:', error);
      toast.error("Erreur lors du chargement des conventions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conventionne':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'en_cours':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'suspendu':
      case 'expire':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'non_conventionne': 'Non conventionné',
      'en_cours': 'En cours',
      'conventionne': 'Conventionné',
      'suspendu': 'Suspendu',
      'expire': 'Expiré',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'conventionne':
        return 'default';
      case 'en_cours':
        return 'secondary';
      case 'suspendu':
      case 'expire':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convention CNAMGS</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Convention CNAMGS
          {conventions.length > 0 && getStatusIcon(conventions[0].status)}
        </CardTitle>
        <CardDescription>
          Gestion de votre conventionnement avec la CNAMGS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {conventions.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucune convention CNAMGS enregistrée
            </p>
            <Button>Demander un conventionnement</Button>
          </div>
        ) : (
          conventions.map((convention) => (
            <div key={convention.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{convention.organization}</p>
                  {convention.convention_number && (
                    <p className="text-sm text-muted-foreground">
                      N° {convention.convention_number}
                    </p>
                  )}
                </div>
                <Badge variant={getStatusVariant(convention.status)}>
                  {getStatusLabel(convention.status)}
                </Badge>
              </div>

              {convention.start_date && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Période: </span>
                  {new Date(convention.start_date).toLocaleDateString('fr-FR')}
                  {convention.end_date && (
                    <> - {new Date(convention.end_date).toLocaleDateString('fr-FR')}</>
                  )}
                </div>
              )}

              {convention.tiers_payant_enabled && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Tiers-payant activé</span>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}