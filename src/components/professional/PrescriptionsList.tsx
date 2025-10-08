import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Send, QrCode, Search } from "lucide-react";
import { toast } from "sonner";

interface PrescriptionsListProps {
  professionalId: string;
}

export function PrescriptionsList({ professionalId }: PrescriptionsListProps) {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrescriptions();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('prescriptions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'electronic_prescriptions',
          filter: `professional_id=eq.${professionalId}`,
        },
        () => {
          fetchPrescriptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('electronic_prescriptions')
        .select(`
          *,
          profiles!electronic_prescriptions_patient_id_fkey(full_name)
        `)
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error("Erreur lors du chargement des ordonnances");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      expired: "destructive",
      dispensed: "secondary",
    };

    const labels: Record<string, string> = {
      active: "Active",
      expired: "Expirée",
      dispensed: "Délivrée",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    p.prescription_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ordonnances électroniques</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Ordonnances électroniques
        </CardTitle>
        <CardDescription>
          Historique des ordonnances créées
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro ou patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune ordonnance trouvée</p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{prescription.prescription_number}</h4>
                      {getStatusBadge(prescription.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Patient: {prescription.profiles?.full_name || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Émise le {new Date(prescription.issued_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {prescription.diagnosis && (
                  <div className="text-sm mb-2">
                    <span className="font-medium">Diagnostic: </span>
                    <span className="text-muted-foreground">{prescription.diagnosis}</span>
                  </div>
                )}

                <div className="text-sm">
                  <span className="font-medium">Médicaments: </span>
                  <span className="text-muted-foreground">
                    {prescription.medications?.length || 0} item(s)
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}