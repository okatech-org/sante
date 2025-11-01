import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { NouvellesAdmissions } from '@/components/hospital/NouvellesAdmissions';

export default function AccueilHospitalisationAdmissionsPage() {
  return (
    <ProfessionalEstablishmentLayout>
      <NouvellesAdmissions />
    </ProfessionalEstablishmentLayout>
  );
}
