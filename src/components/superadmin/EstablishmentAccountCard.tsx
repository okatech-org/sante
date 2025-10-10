import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Link as LinkIcon,
  Calendar,
  User,
  Ban
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EstablishmentAccountCardProps {
  establishment: {
    id: string;
    raison_sociale: string;
    account_claimed: boolean | null;
    invitation_token: string | null;
    claimed_at: string | null;
    claimed_by: string | null;
  };
  onUpdate: () => void;
}

export function EstablishmentAccountCard({ establishment, onUpdate }: EstablishmentAccountCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [claimedByName, setClaimedByName] = useState<string | null>(null);

  const invitationUrl = establishment.invitation_token
    ? `${window.location.origin}/claim-establishment/${establishment.invitation_token}`
    : null;

  const generateToken = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.rpc('generate_establishment_invitation_token', {
        _establishment_id: establishment.id
      });

      if (error) throw error;

      toast.success("Token d'invitation généré avec succès");
      onUpdate();
    } catch (error: any) {
      console.error('Error generating token:', error);
      toast.error("Erreur lors de la génération du token");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyInvitationLink = () => {
    if (!invitationUrl) return;
    
    navigator.clipboard.writeText(invitationUrl);
    toast.success("Lien copié dans le presse-papiers");
  };

  const revokeAccount = async () => {
    try {
      const { error } = await supabase
        .from('establishments')
        .update({
          account_claimed: false,
          claimed_at: null,
          claimed_by: null,
          invitation_token: null
        })
        .eq('id', establishment.id);

      if (error) throw error;

      toast.success("Compte révoqué avec succès");
      setShowRevokeDialog(false);
      onUpdate();
    } catch (error: any) {
      console.error('Error revoking account:', error);
      toast.error("Erreur lors de la révocation");
    }
  };

  const loadClaimedByInfo = async () => {
    if (!establishment.claimed_by) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', establishment.claimed_by)
        .single();

      if (error) throw error;
      setClaimedByName(data.full_name || data.email);
    } catch (error) {
      console.error('Error loading claimed by info:', error);
    }
  };

  useState(() => {
    loadClaimedByInfo();
  });

  return (
    <>
      <Card className="border-2">
        <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
          <CardTitle className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Gestion du compte
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 pt-0 space-y-2">
          {/* Statut du compte */}
          <div className="flex items-center justify-between p-2 rounded bg-muted/50 border">
            <span className="text-xs text-muted-foreground">Statut</span>
            {establishment.account_claimed ? (
              <Badge variant="outline" className="gap-1 text-xs bg-green-500/10 border-green-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Compte réclamé
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-xs bg-yellow-500/10 border-yellow-500/20">
                <XCircle className="h-3 w-3" />
                En attente
              </Badge>
            )}
          </div>

          {/* Informations de réclamation */}
          {establishment.account_claimed && establishment.claimed_at && (
            <div className="space-y-1.5 p-2 rounded bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Réclamé le:</span>
                <span className="font-medium">
                  {new Date(establishment.claimed_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              {claimedByName && (
                <div className="flex items-center gap-1.5 text-xs">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Par:</span>
                  <span className="font-medium">{claimedByName}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRevokeDialog(true)}
                className="w-full mt-1 h-7 text-xs gap-1"
              >
                <Ban className="h-3 w-3" />
                Révoquer le compte
              </Button>
            </div>
          )}

          {/* Génération/Affichage du token */}
          {!establishment.account_claimed && (
            <div className="space-y-1.5">
              {!establishment.invitation_token ? (
                <Button
                  onClick={generateToken}
                  disabled={isGenerating}
                  className="w-full h-7 text-xs gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  Générer un token d'invitation
                </Button>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">Lien d'invitation</label>
                    <div className="flex gap-1">
                      <Input
                        value={invitationUrl || ''}
                        readOnly
                        className="h-7 text-[10px] font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyInvitationLink}
                        className="h-7 px-2 shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={generateToken}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full h-7 text-xs gap-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    Régénérer le token
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de révocation */}
      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Révoquer le compte</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir révoquer le compte de {establishment.raison_sociale} ?
              Cette action supprimera l'accès de l'utilisateur qui a réclamé ce compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={revokeAccount} className="bg-destructive hover:bg-destructive/90">
              Révoquer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
