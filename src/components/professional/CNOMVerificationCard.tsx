import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Clock, Shield } from "lucide-react";
import { toast } from "sonner";

interface CNOMVerificationCardProps {
  professionalId: string;
  numeroOrdre?: string;
}

export function CNOMVerificationCard({ professionalId, numeroOrdre }: CNOMVerificationCardProps) {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVerifications();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('cnom-verifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cnom_verifications',
          filter: `professional_id=eq.${professionalId}`,
        },
        () => {
          fetchVerifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('cnom_verifications')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching CNOM verifications:', error);
      toast.error("Erreur lors du chargement de la vérification CNOM");
    } finally {
      setLoading(false);
    }
  };

  const requestVerification = async () => {
    if (!numeroOrdre) {
      toast.error("Numéro d'ordre manquant");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('cnom_verifications')
        .insert([{
          professional_id: professionalId,
          numero_ordre: numeroOrdre,
          verification_status: 'pending',
        }]);

      if (error) throw error;

      toast.success("Demande de vérification envoyée", {
        description: "Vous serez notifié une fois la vérification effectuée",
      });
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast.error("Erreur lors de la demande de vérification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'verified': 'Vérifié',
      'rejected': 'Rejeté',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vérification CNOM</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const latestVerification = verifications[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Vérification CNOM
          {latestVerification && getStatusIcon(latestVerification.verification_status)}
        </CardTitle>
        <CardDescription>
          Conseil National de l'Ordre des Médecins
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!latestVerification ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Numéro d'ordre</Label>
              <Input value={numeroOrdre || ''} disabled />
            </div>
            <Button
              onClick={requestVerification}
              disabled={isSubmitting || !numeroOrdre}
              className="w-full"
            >
              {isSubmitting ? "Envoi en cours..." : "Demander la vérification"}
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">N° d'ordre: {latestVerification.numero_ordre}</p>
                {latestVerification.specialty && (
                  <p className="text-sm text-muted-foreground">
                    Spécialité: {latestVerification.specialty}
                  </p>
                )}
              </div>
              <Badge variant={getStatusVariant(latestVerification.verification_status)}>
                {getStatusLabel(latestVerification.verification_status)}
              </Badge>
            </div>

            {latestVerification.verified_at && (
              <div className="text-sm">
                <span className="text-muted-foreground">Vérifié le: </span>
                {new Date(latestVerification.verified_at).toLocaleDateString('fr-FR')}
              </div>
            )}

            {latestVerification.inscription_date && (
              <div className="text-sm">
                <span className="text-muted-foreground">Inscrit depuis: </span>
                {new Date(latestVerification.inscription_date).toLocaleDateString('fr-FR')}
              </div>
            )}

            {latestVerification.verification_notes && (
              <div className="text-sm p-3 bg-muted rounded-md">
                <p className="text-muted-foreground mb-1">Notes:</p>
                <p>{latestVerification.verification_notes}</p>
              </div>
            )}

            {latestVerification.verification_status === 'pending' && (
              <div className="text-sm text-muted-foreground">
                Votre demande de vérification est en cours de traitement. Vous serez notifié par email une fois le processus terminé.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}