import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";

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
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', profile.id)
          .eq('role', role)
          .single();

        if (existingRole) {
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
          <h1 className="text-3xl font-bold mb-2">🔧 Correction des Rôles Démo</h1>
          <p className="text-gray-600">
            Assignez automatiquement les rôles manquants aux comptes démo
          </p>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                Ce tool va assigner les rôles corrects aux {Object.keys(ROLE_MAPPING).length} comptes démo.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Vérifie si le profil existe</li>
                <li>Vérifie si le rôle est déjà assigné</li>
                <li>Assigne le rôle si nécessaire</li>
                <li>Affiche les résultats en temps réel</li>
              </ul>
              <p className="text-amber-600 font-medium">
                ⚠️ Cette opération est sûre et n'écrase pas les rôles existants
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={fixDemoRoles}
              disabled={isFixing}
              size="lg"
              className="w-full"
            >
              {isFixing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Correction en cours...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Corriger les Rôles Démo
                </>
              )}
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

