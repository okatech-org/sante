import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { GestionChambresPage } from '@/components/hospital/GestionChambresPage';

export default function AccueilHospitalisationChambresPage() {
  return (
    <ProfessionalEstablishmentLayout>
      <GestionChambresPage />
    </ProfessionalEstablishmentLayout>
  );
}
