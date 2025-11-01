import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { SortiesDuJour } from '@/components/hospital/SortiesDuJour';

export default function AccueilHospitalisationSortiesPage() {
  return (
    <ProfessionalEstablishmentLayout>
      <SortiesDuJour />
    </ProfessionalEstablishmentLayout>
  );
}
