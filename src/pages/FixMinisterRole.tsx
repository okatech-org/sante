import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Shield, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function FixMinisterRole() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fixRole = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fix-minister-role', {
        body: {}
      });

      if (fnError) throw fnError;

      if (data?.success) {
        setResult(data.data);
      } else {
        throw new Error(data?.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Correction Rôle Ministre
          </CardTitle>
          <CardDescription>
            Ajouter le rôle professionnel au compte du Ministre de la Santé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Compte concerné :</h3>
            <div className="bg-muted p-4 rounded-lg space-y-1">
              <p className="text-sm"><strong>Email :</strong> ministre@sante.gouv.ga</p>
              <p className="text-sm"><strong>Nom :</strong> Pr. Adrien MOUGOUGOU</p>
              <p className="text-sm"><strong>Titre :</strong> Ministre de la Santé</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Action :</strong> Cette opération va ajouter le rôle <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">moderator</code> 
              au compte pour permettre l'accès à l'espace professionnel.
            </p>
          </div>

          <Button 
            onClick={fixRole} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Correction en cours...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Corriger le Rôle
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-sm text-destructive font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-900 dark:text-green-100 font-medium flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  Configuration réussie !
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informations du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{result.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nom complet:</span>
                    <span className="font-medium">{result.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rôles:</span>
                    <span className="font-medium">{result.roles?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Utilisateur:</span>
                    <span className="font-mono text-xs">{result.user_id}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4 border-t space-y-3">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Identifiants de connexion</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email :</strong> {result.credentials?.email}</p>
                    <p><strong>Mot de passe :</strong> {result.credentials?.password}</p>
                  </div>
                </div>

                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate('/login/professional')}
                >
                  Se connecter maintenant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

