
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { ActivePrescriptions } from "@/components/dashboard/ActivePrescriptions";
import { RecentResults } from "@/components/dashboard/RecentResults";
import { InsuranceStatus } from "@/components/dashboard/InsuranceStatus";

export default function DashboardPatient() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <DashboardHeader />
        <QuickActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingAppointments />
          <ActivePrescriptions />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentResults />
          <InsuranceStatus />
        </div>
      </div>
    </MainLayout>
  );
}
