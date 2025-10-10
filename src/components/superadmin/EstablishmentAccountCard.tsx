import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Building2, Copy, Link2, Mail, CheckCircle2, AlertCircle, Ban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface EstablishmentAccountCardProps {
  establishment: {
    id: string;
    raison_sociale: string;
    email: string | null;
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
      toast.error(error.message || "Erreur lors de la génération du token");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyInvitationLink = () => {
    if (invitationUrl) {
      navigator.clipboard.writeText(invitationUrl);
      toast.success("Lien copié dans le presse-papiers");
    }
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
      toast.error(error.message || "Erreur lors de la révocation");
    }
  };

  const loadClaimedByInfo = async () => {
    if (establishment.claimed_by) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', establishment.claimed_by)
        .single();

      if (data) {
        setClaimedByName(data.full_name || data.email);
      }
    }
  };

  useEffect(() => {
    loadClaimedByInfo();
  }, [establishment.claimed_by]);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Gestion du compte</CardTitle>
            </div>
            {establishment.account_claimed ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Revendiqué
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="h-3 w-3 mr-1" />
                En attente
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {establishment.account_claimed ? (
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Revendiqué par:</span>
                <p className="font-medium">{claimedByName || "Chargement..."}</p>
              </div>
              {establishment.claimed_at && (
                <div className="text-sm text-muted-foreground">
                  Le {format(new Date(establishment.claimed_at), "dd/MM/yyyy à HH:mm")}
                </div>
              )}
              <Button
                onClick={() => setShowRevokeDialog(true)}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Ban className="h-4 w-4 mr-2" />
                Révoquer le compte
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {invitationUrl ? (
                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Lien d'invitation</span>
                    </div>
                    <code className="text-xs break-all block p-2 bg-background rounded">
                      {invitationUrl}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyInvitationLink}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                    {establishment.email && (
                      <Button
                        onClick={() => {
                          window.location.href = `mailto:${establishment.email}?subject=Invitation à revendiquer votre établissement&body=Bonjour,%0D%0A%0D%0AVous pouvez revendiquer votre établissement en cliquant sur ce lien :%0D%0A${invitationUrl}`;
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Envoyer
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={generateToken}
                    disabled={isGenerating}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    Regénérer le token
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={generateToken}
                  disabled={isGenerating}
                  className="w-full"
                >
                  Générer un lien d'invitation
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Révoquer le compte</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir révoquer ce compte ? L'utilisateur perdra l'accès à
              la gestion de l'établissement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={revokeAccount} className="bg-destructive">
              Révoquer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
