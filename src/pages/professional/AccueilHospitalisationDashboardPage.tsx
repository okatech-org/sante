import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { DashboardAdmissions } from '@/components/hospital/DashboardAdmissions';

export default function AccueilHospitalisationDashboardPage() {
  return (
    <ProfessionalEstablishmentLayout>
      <DashboardAdmissions />
    </ProfessionalEstablishmentLayout>
  );
}
