import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Pill, Shield, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MedicationDetailModalProps {
  open: boolean;
  onClose: () => void;
  medId: string | null;
}

export function MedicationDetailModal({ open, onClose, medId }: MedicationDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [med, setMed] = useState<any | null>(null);

  useEffect(() => {
    if (!open || !medId) return;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('medicaments')
          .select(`
            id, code_cip, code_atc, nom_commercial, dci, forme_pharmaceutique, dosage,
            categorie, classe_therapeutique, laboratoire_fabricant, pays_origine,
            tarif_conventionne_cnamgs, prix_moyen_pharmacie, taux_remboursement,
            est_generique, necessite_ordonnance,
            description, indications, contre_indications, effets_secondaires, posologie_standard,
            image_url, notice_pdf_url
          `)
          .eq('id', medId)
          .maybeSingle();
        if (error) throw error;
        setMed(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, medId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            {med?.dci || med?.nom_commercial || 'Détail du médicament'}
          </DialogTitle>
          {med?.nom_commercial && (
            <DialogDescription>
              Nom commercial: {med.nom_commercial}
            </DialogDescription>
          )}
        </DialogHeader>

        {loading ? (
          <div className="py-10 flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : med ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {med.forme_pharmaceutique && (
                <Badge variant="outline">{med.forme_pharmaceutique}</Badge>
              )}
              {med.dosage && (
                <Badge variant="outline">{med.dosage}</Badge>
              )}
              {med.est_generique && (
                <Badge variant="secondary">Générique</Badge>
              )}
              {med.necessite_ordonnance && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Sur ordonnance
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Code CIP</p>
                <p className="font-medium">{med.code_cip || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Code ATC</p>
                <p className="font-medium">{med.code_atc || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Classe thérapeutique</p>
                <p className="font-medium">{med.classe_therapeutique || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Laboratoire</p>
                <p className="font-medium">{med.laboratoire_fabricant || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tarif CNAMGS</p>
                <p className="font-medium">{med.tarif_conventionne_cnamgs ? `${Number(med.tarif_conventionne_cnamgs).toLocaleString()} FCFA` : '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Prix moyen pharmacie</p>
                <p className="font-medium">{med.prix_moyen_pharmacie ? `${Number(med.prix_moyen_pharmacie).toLocaleString()} FCFA` : '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Taux de remboursement</p>
                <p className="font-medium">{med.taux_remboursement ? `${med.taux_remboursement}%` : '—'}</p>
              </div>
            </div>

            {(med.description || med.indications || med.contre_indications || med.posologie_standard) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {med.description && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm whitespace-pre-wrap">{med.description}</p>
                    </CardContent>
                  </Card>
                )}
                {med.indications && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Indications</p>
                      <p className="text-sm whitespace-pre-wrap">{med.indications}</p>
                    </CardContent>
                  </Card>
                )}
                {med.contre_indications && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Contre-indications</p>
                      <p className="text-sm whitespace-pre-wrap">{med.contre_indications}</p>
                    </CardContent>
                  </Card>
                )}
                {med.posologie_standard && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Posologie (standard)</p>
                      <p className="text-sm whitespace-pre-wrap">{med.posologie_standard}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {med.notice_pdf_url && (
              <div>
                <Button variant="outline" size="sm" onClick={() => window.open(med.notice_pdf_url, '_blank')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Voir la notice
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}


