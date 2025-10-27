import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2, ShieldCheck, AlertCircle, Database } from "lucide-react";

const ROLE_MAPPING: Record<string, string> = {
  'specialiste.demo@sante.ga': 'specialist',
  'infirmiere.demo@sante.ga': 'nurse',
  'sagefemme.demo@sante.ga': 'midwife',
  'kine.demo@sante.ga': 'physiotherapist',
  'psychologue.demo@sante.ga': 'psychologist',
  'ophtalmo.demo@sante.ga': 'ophthalmologist',
  'anesthesiste.demo@sante.ga': 'anesthesiologist',
  'pharmacien.demo@sante.ga': 'pharmacist',
  'labo.demo@sante.ga': 'laboratory_technician',
  'radiologue.demo@sante.ga': 'radiologist',
  'clinique.demo@sante.ga': 'clinic_admin',
  'radiologie.demo@sante.ga': 'radiology_center',
  'medecin.demo@sante.ga': 'doctor',
  'patient.demo@sante.ga': 'patient'
};

interface RoleStatus {
  email: string;
  role: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export default function FixDemoRoles() {
  const { toast } = useToast();
  const [isFixing, setIsFixing] = useState(false);
  const [results, setResults] = useState<RoleStatus[]>([]);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [missingRolesCount, setMissingRolesCount] = useState(0);
  const [existingRolesCount, setExistingRolesCount] = useState(0);

  // Vérifier automatiquement les rôles manquants au chargement
  useEffect(() => {
    checkMissingRoles();
  }, []);

  const checkMissingRoles = async () => {
    try {
      let missing = 0;
      let existing = 0;

      for (const [email, role] of Object.entries(ROLE_MAPPING)) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (profile) {
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          const hasRole = Array.isArray(userRoles) && userRoles.some((r: any) => r.role === role);

          if (!hasRole) {
            missing++;
          } else {
            existing++;
          }
        }
      }

      setMissingRolesCount(missing);
      setExistingRolesCount(existing);

      // Si des rôles manquent, proposer la correction automatique
      if (missing > 0) {
        toast({
          title: "🔔 Rôles manquants détectés",
          description: `${missing} comptes démo n'ont pas de rôle assigné. Correction automatique recommandée.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    }
  };

  const autoFixAllRoles = async () => {
    setIsAutoFixing(true);
    
    try {
      // Exécuter toutes les insertions en une seule transaction
      const queries = [];
      
      for (const [email, role] of Object.entries(ROLE_MAPPING)) {
        // Récupérer l'ID de l'utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (profile) {
          // Vérifier si le rôle existe déjà (sans filtrer par rôle pour éviter 400)
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          const alreadyHas = Array.isArray(roles) && roles.some((r: any) => r.role === role);

          if (!alreadyHas) {
            // Insérer le rôle s'il n'existe pas
            const { error } = await supabase
              .from('user_roles')
              .insert({ user_id: profile.id, role: role });

            if (error) {
              if ((error as any).code === '22P02' || String((error as any).message || '').includes('invalid input value for enum')) {
                toast({
                  title: 'Migration requise',
                  description: "Les rôles métiers n'existent pas encore dans l'ENUM app_role. Appliquez la migration et relancez.",
                  variant: 'destructive'
                });
                console.error(`Erreur pour ${email}:`, error);
                break;
              } else {
                console.error(`Erreur pour ${email}:`, error);
              }
            } else {
              console.log(`✅ Rôle assigné: ${email} → ${role}`);
            }
          }
        }
      }

      toast({
        title: "✅ Correction terminée !",
        description: "Tous les rôles ont été assignés avec succès. Rechargez la page Professionnels.",
        variant: "default"
      });

      // Recharger les statistiques
      await checkMissingRoles();
      
    } catch (error) {
      console.error('Erreur lors de la correction automatique:', error);
      toast({
        title: "❌ Erreur",
        description: "Une erreur est survenue lors de la correction automatique.",
        variant: "destructive"
      });
    } finally {
      setIsAutoFixing(false);
    }
  };

  const fixDemoRoles = async () => {
    setIsFixing(true);
    setResults([]);
    const newResults: RoleStatus[] = [];

    for (const [email, role] of Object.entries(ROLE_MAPPING)) {
      try {
        // 1. Trouver l'utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (profileError || !profile) {
          newResults.push({
            email,
            role,
            status: 'error',
            message: 'Profil non trouvé'
          });
          continue;
        }

        // 2. Vérifier si le rôle existe déjà
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.id);

        const hasRole = Array.isArray(roles) && roles.some((r: any) => r.role === role);

        if (hasRole) {
          newResults.push({
            email,
            role,
            status: 'success',
            message: 'Rôle déjà assigné'
          });
          continue;
        }

        // 3. Assigner le rôle
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: profile.id,
            role: role
          });

        if (insertError) {
          if ((insertError as any).code === '22P02' || String((insertError as any).message || '').includes('invalid input value for enum')) {
            toast({
              title: 'Migration requise',
              description: "Les rôles métiers n'existent pas encore dans l'ENUM app_role. Appliquez la migration et relancez.",
              variant: 'destructive'
            });
            console.error(`Erreur pour ${email}:`, insertError);
            break;
          }
          newResults.push({
            email,
            role,
            status: 'error',
            message: insertError.message
          });
        } else {
          newResults.push({
            email,
            role,
            status: 'success',
            message: 'Rôle assigné avec succès'
          });
        }
      } catch (error: any) {
        newResults.push({
          email,
          role,
          status: 'error',
          message: error.message
        });
      }

      setResults([...newResults]);
    }

    setIsFixing(false);
    
    const successCount = newResults.filter(r => r.status === 'success').length;
    const errorCount = newResults.filter(r => r.status === 'error').length;
    
    toast.success(`Terminé ! ${successCount} succès, ${errorCount} erreurs`);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'patient': 'Patient',
      'doctor': 'Médecin',
      'specialist': 'Spécialiste',
      'nurse': 'Infirmier(ère)',
      'midwife': 'Sage-femme',
      'physiotherapist': 'Kinésithérapeute',
      'psychologist': 'Psychologue',
      'ophthalmologist': 'Ophtalmologue',
      'anesthesiologist': 'Anesthésiste',
      'pharmacist': 'Pharmacien',
      'laboratory_technician': 'Technicien de labo',
      'radiologist': 'Radiologue',
      'clinic_admin': 'Admin Clinique',
      'radiology_center': 'Centre Radiologie'
    };
    return labels[role] || role;
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">🛡️ Correction des Rôles Démo</h1>
          <p className="text-gray-600">
            Assignez automatiquement les rôles manquants aux comptes démo pour qu'ils apparaissent dans les bonnes sections
          </p>
        </div>

        {/* Statut des rôles */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              État actuel de la base de données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{existingRolesCount}</p>
                  <p className="text-sm text-muted-foreground">Rôles corrects</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{missingRolesCount}</p>
                  <p className="text-sm text-muted-foreground">Rôles manquants</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{Object.keys(ROLE_MAPPING).length}</p>
                  <p className="text-sm text-muted-foreground">Comptes démo totaux</p>
                </div>
              </div>
            </div>

            {missingRolesCount > 0 && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900 dark:text-orange-100">
                      Action requise : {missingRolesCount} rôles manquants détectés
                    </p>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                      Ces comptes n'apparaissent pas dans la section "Professionnels" car ils n'ont pas de rôle assigné.
                      Cliquez sur le bouton ci-dessous pour corriger automatiquement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {missingRolesCount === 0 && existingRolesCount > 0 && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      ✅ Tous les rôles sont correctement assignés !
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      Les comptes apparaissent maintenant dans les bonnes sections.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Bouton de correction automatique rapide */}
            {missingRolesCount > 0 && (
              <Button
                onClick={autoFixAllRoles}
                disabled={isAutoFixing}
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {isAutoFixing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Correction automatique en cours...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    🚀 Correction Automatique (Option B) - Corriger {missingRolesCount} rôles manquants
                  </>
                )}
              </Button>
            )}
            
            {/* Bouton de correction détaillée */}
            <Button
              onClick={fixDemoRoles}
              disabled={isFixing}
              size="lg"
              variant="outline"
              className="w-full"
            >
              {isFixing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Correction détaillée en cours...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Correction Détaillée (voir chaque étape)
                </>
              )}
            </Button>

            {/* Bouton de rechargement */}
            <Button
              onClick={checkMissingRoles}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              🔄 Recharger le statut
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats ({results.length}/{Object.keys(ROLE_MAPPING).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{result.email}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getRoleLabel(result.role)}
                        </Badge>
                        {result.message && (
                          <p className="text-xs text-gray-500">{result.message}</p>
                        )}
                      </div>
                    </div>
                    {result.status === 'success' && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {result.status === 'error' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {results.length === Object.keys(ROLE_MAPPING).length && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Correction terminée !</h3>
                  <p className="text-sm text-green-700 mt-1">
                    {results.filter(r => r.status === 'success').length} rôles assignés avec succès.
                    Rechargez les pages Patients et Professionnels pour voir les changements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SuperAdminLayout>
  );
}

