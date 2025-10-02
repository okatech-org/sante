import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { InsuranceStatus } from "@/components/dashboard/InsuranceStatus";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { ActivePrescriptions } from "@/components/dashboard/ActivePrescriptions";
import { RecentResults } from "@/components/dashboard/RecentResults";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
      <DashboardHeader />
      
      <MainLayout>
        <div className="container max-w-7xl mx-auto px-4 py-6 lg:py-8 space-y-6">
          {/* Section Statut Assurance - Pleine largeur */}
          <InsuranceStatus 
            hasInsurance={true}
            type="CNAMGS"
            sector="Secteur Public"
            coverageRate={80}
            remainingBalance={2500000}
          />

          {/* Grille responsive 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-6">
              <UpcomingAppointments />
              <ActivePrescriptions />
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              <RecentResults />
              <QuickActions />
            </div>
          </div>
        </div>
      </MainLayout>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
