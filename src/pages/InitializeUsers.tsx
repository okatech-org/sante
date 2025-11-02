import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function InitializeUsers() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createUsers = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-initial-users', {
        body: {}
      });

      if (fnError) throw fnError;

      if (data?.results) {
        setResults(data.results);
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
            <User className="h-6 w-6" />
            Initialisation des Utilisateurs
          </CardTitle>
          <CardDescription>
            Créer les comptes initiaux pour le système SANTE.GA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Comptes à créer :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>ministre@sante.gouv.ga (Ministre de la Santé)</li>
              <li>admin@test.com (Compte administrateur test)</li>
            </ul>
          </div>

          <Button 
            onClick={createUsers} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer les Utilisateurs'
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

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Résultats :</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-md border ${
                      result.status === 'created' 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                        : result.status === 'already_exists'
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                        : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.status === 'created' && (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      )}
                      {result.status === 'already_exists' && (
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      )}
                      {result.status === 'error' && (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{result.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.status === 'created' && 'Compte créé avec succès'}
                          {result.status === 'already_exists' && 'Le compte existe déjà'}
                          {result.status === 'error' && `Erreur: ${result.error}`}
                        </p>
                        {result.user_id && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {result.user_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && results.every(r => r.status !== 'error') && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Vous pouvez maintenant vous connecter avec ces identifiants :
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/login/professional'}
              >
                Aller à la page de connexion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
