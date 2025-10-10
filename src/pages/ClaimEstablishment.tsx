import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function ClaimEstablishment() {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [establishment, setEstablishment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEstablishment();
  }, [token]);

  const loadEstablishment = async () => {
    if (!token) {
      setError("Token d'invitation manquant");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('invitation_token', token)
        .eq('account_claimed', false)
        .single();

      if (error || !data) {
        setError("Token d'invitation invalide ou déjà utilisé");
        return;
      }

      setEstablishment(data);
    } catch (error) {
      console.error('Error loading establishment:', error);
      setError("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user) {
      navigate('/login/patient', { 
        state: { 
          returnTo: `/claim-establishment/${token}` 
        } 
      });
      return;
    }

    setIsClaiming(true);
    try {
      const { data, error } = await supabase.rpc('claim_establishment_account', {
        _token: token,
        _user_id: user.id
      });

      if (error) throw error;

      toast.success("Compte réclamé avec succès !");
      
      // Rediriger vers le tableau de bord de l'établissement
      setTimeout(() => {
        navigate('/demo/hospital');
      }, 2000);
    } catch (error: any) {
      console.error('Error claiming account:', error);
      toast.error(error.message || "Erreur lors de la réclamation du compte");
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md border-2 border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle>Erreur</CardTitle>
                <CardDescription>{error}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              variant="outline"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Réclamer votre établissement</CardTitle>
              <CardDescription>
                Connectez-vous pour gérer votre établissement
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {establishment && (
            <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
              <h3 className="font-semibold text-lg">
                {establishment.raison_sociale}
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Type: {establishment.type_etablissement}</p>
                <p>Ville: {establishment.ville}, {establishment.province}</p>
                {establishment.telephone_standard && (
                  <p>Tél: {establishment.telephone_standard}</p>
                )}
              </div>
            </div>
          )}

          {!user ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Vous devez être connecté pour réclamer cet établissement.
              </p>
              <Button 
                onClick={() => navigate('/login/patient', { 
                  state: { returnTo: `/claim-establishment/${token}` } 
                })}
                className="w-full"
              >
                Se connecter
              </Button>
              <Button 
                onClick={() => navigate('/register/patient', { 
                  state: { returnTo: `/claim-establishment/${token}` } 
                })}
                variant="outline"
                className="w-full"
              >
                Créer un compte
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Vous êtes connecté en tant que {user.email}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleClaim}
                disabled={isClaiming}
                className="w-full"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réclamation en cours...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Réclamer cet établissement
                  </>
                )}
              </Button>

              <Button 
                onClick={() => {
                  // Déconnexion pour permettre une autre connexion
                  supabase.auth.signOut();
                  navigate('/login/patient', { 
                    state: { returnTo: `/claim-establishment/${token}` } 
                  });
                }}
                variant="ghost"
                className="w-full text-xs"
              >
                Se connecter avec un autre compte
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
