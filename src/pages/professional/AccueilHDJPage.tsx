import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { AccueilHDJ } from '@/components/hospital/AccueilHDJ';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2 } from 'lucide-react';

export default function AccueilHDJPage() {
  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Accueil Hôpital du Jour
            </h1>
            <p className="text-muted-foreground mt-1">
              Centre Médical de Santé au Travail SOGARA
            </p>
          </div>
          <Badge className="px-4 py-2 text-lg">
            Mode HDJ
          </Badge>
        </div>

        {/* Composant principal HDJ */}
        <AccueilHDJ />
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
