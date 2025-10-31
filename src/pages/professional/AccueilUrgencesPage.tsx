import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { AccueilUrgences } from '@/components/hospital/AccueilUrgences';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Siren, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { TriageForm } from '@/components/hospital/TriageForm';
import { DossierUrgence } from '@/types/accueil.types';

export default function AccueilUrgencesPage() {
  const [showTriageForm, setShowTriageForm] = useState(false);
  const [urgenceVitale, setUrgenceVitale] = useState(false);

  const handleUrgenceVitale = () => {
    setUrgenceVitale(true);
    setShowTriageForm(true);
  };

  const handleTriageComplete = (dossier: DossierUrgence) => {
    setShowTriageForm(false);
    setUrgenceVitale(false);
  };

  return (
    <ProfessionalEstablishmentLayout>
      {/* Bouton URGENCE VITALE fixe en haut à droite */}
      <div className="fixed top-20 right-6 z-50">
        <Button 
          size="lg"
          onClick={handleUrgenceVitale}
          className="bg-red-600 hover:bg-red-700 text-white shadow-2xl animate-pulse text-lg px-6 py-6 font-bold"
        >
          <AlertTriangle className="mr-2 h-6 w-6" />
          URGENCE VITALE
        </Button>
      </div>

      <div className="space-y-8 pb-20">
        {/* En-tête de la page - Redesigné */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-red-100 dark:border-red-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-500 p-3 rounded-xl">
                  <Siren className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Accueil Service d'Urgences
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 text-base">
                    Service d'urgences - Triage et prise en charge immédiate
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="destructive" className="px-6 py-3 text-base font-bold shadow-lg">
              Mode URGENCES
            </Badge>
          </div>
        </div>

        {/* Composant principal Urgences */}
        <AccueilUrgences />
      </div>

      {/* Modal de triage */}
      {showTriageForm && (
        <TriageForm
          open={showTriageForm}
          onClose={() => {
            setShowTriageForm(false);
            setUrgenceVitale(false);
          }}
          onComplete={handleTriageComplete}
          urgenceVitale={urgenceVitale}
        />
      )}
    </ProfessionalEstablishmentLayout>
  );
}
