import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  UserPlus, Clock, AlertCircle, CheckCircle, Bed, Building,
  Calendar, Siren, Home, Activity, FileText, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AdmissionModal } from './AdmissionModal';
import { GestionChambres } from './GestionChambres';
import type { DossierHospitalisation } from '@/types/hospitalisation.types';

export function NouvellesAdmissions() {
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showGestionChambres, setShowGestionChambres] = useState(false);
  const [origineAdmission, setOrigineAdmission] = useState<'hdj' | 'urgences' | 'programmee' | 'transfert'>('programmee');

  const handleNouvelleAdmission = (origine: typeof origineAdmission) => {
    setOrigineAdmission(origine);
    setShowAdmissionModal(true);
  };

  const handleAdmissionComplete = (data: Partial<DossierHospitalisation>) => {
    console.log('Admission créée:', data);
    toast.success(`Admission ${data.numeroAdmission} créée avec succès`);
    setShowAdmissionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold tracking-tight">Nouvelles Admissions</h1>
          </div>
          <p className="text-muted-foreground">Enregistrement et traitement des demandes d'hospitalisation</p>
        </div>
      </div>

      {/* Instructions */}
      <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950/20">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-1">💡 Processus d'admission</div>
          <div className="text-sm">
            1. Sélectionnez l'origine de l'admission<br />
            2. Remplissez le formulaire patient<br />
            3. Vérifiez les droits d'assurance<br />
            4. Attribuez une chambre disponible<br />
            5. Validez l'admission
          </div>
        </AlertDescription>
      </Alert>

      {/* Choix du type d'admission */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-b">
          <CardTitle>Type d'Admission</CardTitle>
          <p className="text-sm text-muted-foreground">Sélectionnez l'origine de la demande d'hospitalisation</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Admission Programmée */}
            <Card 
              className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all group"
              onClick={() => handleNouvelleAdmission('programmee')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20" />
              <CardContent className="relative p-6 text-center">
                <div className="mb-4 p-4 rounded-full bg-blue-100 dark:bg-blue-900/50 inline-flex group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Programmée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hospitalisation planifiée avec RDV
                </p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Standard
                </Badge>
              </CardContent>
            </Card>

            {/* Depuis Urgences */}
            <Card 
              className="relative overflow-hidden border-2 border-red-200 hover:border-red-400 cursor-pointer transition-all group"
              onClick={() => handleNouvelleAdmission('urgences')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20" />
              <CardContent className="relative p-6 text-center">
                <div className="mb-4 p-4 rounded-full bg-red-100 dark:bg-red-900/50 inline-flex group-hover:scale-110 transition-transform">
                  <Siren className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Urgences</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Patient transféré des urgences
                </p>
                <Badge variant="destructive" className="bg-red-100 text-red-700">
                  Prioritaire
                </Badge>
              </CardContent>
            </Card>

            {/* Depuis HDJ */}
            <Card 
              className="relative overflow-hidden border-2 border-green-200 hover:border-green-400 cursor-pointer transition-all group"
              onClick={() => handleNouvelleAdmission('hdj')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" />
              <CardContent className="relative p-6 text-center">
                <div className="mb-4 p-4 rounded-full bg-green-100 dark:bg-green-900/50 inline-flex group-hover:scale-110 transition-transform">
                  <Home className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Hôpital de Jour</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Suite à consultation HDJ
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Médical
                </Badge>
              </CardContent>
            </Card>

            {/* Transfert */}
            <Card 
              className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all group"
              onClick={() => handleNouvelleAdmission('transfert')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20" />
              <CardContent className="relative p-6 text-center">
                <div className="mb-4 p-4 rounded-full bg-purple-100 dark:bg-purple-900/50 inline-flex group-hover:scale-110 transition-transform">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Transfert</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Transfert d'un autre établissement
                </p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Externe
                </Badge>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chambres disponibles</p>
                <p className="text-2xl font-bold text-green-600">42</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-950/50">
                <Bed className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3"
              onClick={() => setShowGestionChambres(true)}
            >
              <Activity className="mr-2 h-3 w-3" />
              Voir plan chambres
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admissions aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-950/50">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              8 programmées • 3 urgences • 1 HDJ
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen admission</p>
                <p className="text-2xl font-bold text-purple-600">4.5min</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-950/50">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Performance optimale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guide rapide */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-b">
          <CardTitle>Guide d'Admission</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Documents Requis
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Consentement aux soins signé
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Pièce d'identité (CNI, Passeport)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Carte d'assurance (CNAMGS/CNSS)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Ordonnance médicale (si programmée)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Vérifications Assurance
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                    1
                  </div>
                  <span>Vérifier le statut assuré (actif/suspendu)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                    2
                  </div>
                  <span>Contrôler le plafond restant</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                    3
                  </div>
                  <span>Calculer la prise en charge (80%/90%/100%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                    4
                  </div>
                  <span>Estimer le reste à charge patient</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showAdmissionModal && (
        <AdmissionModal
          open={showAdmissionModal}
          onClose={() => setShowAdmissionModal(false)}
          onComplete={handleAdmissionComplete}
          origine={origineAdmission}
        />
      )}

      {showGestionChambres && (
        <GestionChambres
          open={showGestionChambres}
          onClose={() => setShowGestionChambres(false)}
        />
      )}
    </div>
  );
}
