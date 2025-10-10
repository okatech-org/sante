import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import ConsoleSilencer from "@/components/dev/ConsoleSilencer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import Awareness from "./pages/Awareness";
import ForProfessionals from "./pages/ForProfessionals";

// Auth Pages
import LoginPatient from "./pages/LoginPatient";
import LoginProfessional from "./pages/LoginProfessional";
import Register from "./pages/Register";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterProfessional from "./pages/RegisterProfessional";

// Dashboard Pages
import DashboardPatient from "./pages/DashboardPatient";
import DashboardProfessional from "./pages/DashboardProfessional";
import DashboardAdmin from "./pages/DashboardAdmin";

// Professional Pages
import ProfessionalAgenda from "./pages/professional/Agenda";
import ProfessionalConsultations from "./pages/professional/Consultations";
import ProfessionalTeleconsultations from "./pages/professional/Teleconsultations";
import TeleconsultationSession from "./pages/professional/TeleconsultationSession";
import ProfessionalTeleExpertise from "./pages/professional/TeleExpertise";
import ProfessionalPatients from "./pages/professional/Patients";
import ProfessionalPrescriptions from "./pages/professional/Prescriptions";
import ProfessionalMessages from "./pages/professional/Messages";
import ProfessionalFinances from "./pages/professional/Finances";
import ProfessionalStatistics from "./pages/professional/Statistics";
import ProfessionalSettings from "./pages/professional/Settings";
import ProfessionalIntegrations from "./pages/professional/Integrations";
import SelectEstablishment from "./pages/professional/SelectEstablishment";

// Patient Pages
import Appointments from "./pages/Appointments";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import Profile from "./pages/Profile";
import MedicalRecord from "./pages/MedicalRecord";
import Results from "./pages/Results";
import Prescriptions from "./pages/Prescriptions";
import Teleconsultation from "./pages/Teleconsultation";
import Reimbursements from "./pages/Reimbursements";
import Cartography from "./pages/Cartography";
import Providers from "./pages/Providers";
import Support from "./pages/Support";

// Admin Pages
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminApprovals from "./pages/AdminApprovals";
import AdminHealthActors from "./pages/AdminHealthActors";
import AdminDemo from "./pages/AdminDemo";
import AdminProject from "./pages/AdminProject";
import AdminAudit from "./pages/AdminAudit";
import AdminSettings from "./pages/AdminSettings";
import MultiEstablishmentArchitecture from "./pages/admin/MultiEstablishmentArchitecture";
import OSMSync from "./pages/admin/OSMSync";

// Demo Pages
import DemoClinicDashboard from "./pages/demo/DemoClinicDashboard";
import DemoDoctorDashboard from "./pages/demo/DemoDoctorDashboard";
import DemoSpecialistDashboard from "./pages/demo/DemoSpecialistDashboard";
import DemoHospitalDashboard from "./pages/demo/DemoHospitalDashboard";
import DemoAdmissions from "./pages/demo/hospital/DemoAdmissions";
import DemoEmergency from "./pages/demo/hospital/DemoEmergency";
import DemoLaboratory from "./pages/demo/hospital/DemoLaboratory";
import DemoPharmacy from "./pages/demo/hospital/DemoPharmacy";
import DemoPlanning from "./pages/demo/hospital/DemoPlanning";
import DemoFinances from "./pages/demo/hospital/DemoFinances";
import DemoStatistics from "./pages/demo/hospital/DemoStatistics";
import DemoSettings from "./pages/demo/hospital/DemoSettings";
import DemoStaffManagement from "./pages/demo/hospital/DemoStaffManagement";

import NotFound from "./pages/NotFound";
import ClaimEstablishment from "./pages/ClaimEstablishment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              {import.meta.env.DEV && <ConsoleSilencer />}
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-professionals" element={<ForProfessionals />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/login/patient" element={<LoginPatient />} />
            <Route path="/login/pro" element={<LoginProfessional />} />
            <Route path="/login/superadmin" element={<SuperAdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/patient" element={<RegisterPatient />} />
            <Route path="/register/pro" element={<RegisterProfessional />} />
            <Route path="/claim-establishment/:token" element={<ClaimEstablishment />} />
            <Route path="/dashboard/patient" element={
              <ProtectedRoute requiredRoles={['patient']}>
                <DashboardPatient />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/professional" element={
              <ProtectedRoute requiredRoles={['doctor', 'hospital', 'pharmacy', 'laboratory', 'medical_staff']}>
                <Navigate to="/demo/doctor" replace />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
            
            {/* Super Admin Routes */}
            <Route path="/superadmin" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/dashboard" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/users" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/approvals" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminApprovals />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/health-actors" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminHealthActors />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/audit" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminAudit />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/settings" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/demo" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminDemo />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/project" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminProject />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/architecture" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <MultiEstablishmentArchitecture />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/appointments/confirmation/:id" element={
              <ProtectedRoute>
                <AppointmentConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/prescriptions" element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            } />
            <Route path="/cartography" element={<Cartography />} />
            <Route path="/results" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/providers" element={
              <ProtectedRoute>
                <Providers />
              </ProtectedRoute>
            } />
            <Route path="/reimbursements" element={
              <ProtectedRoute>
                <Reimbursements />
              </ProtectedRoute>
            } />
            <Route path="/medical-record" element={
              <ProtectedRoute>
                <MedicalRecord />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/teleconsultation" element={
              <ProtectedRoute>
                <Teleconsultation />
              </ProtectedRoute>
            } />
            <Route path="/parametres" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/osm-sync" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <OSMSync />
              </ProtectedRoute>
            } />
            <Route path="/demo/doctor" element={<DemoDoctorDashboard />} />
            <Route path="/demo/specialist" element={<DemoSpecialistDashboard />} />
            <Route path="/demo/hospital" element={<DemoHospitalDashboard />} />
            <Route path="/demo/clinic" element={<DemoClinicDashboard />} />
            <Route path="/demo/hospital/admissions" element={<DemoAdmissions />} />
            <Route path="/demo/hospital/pharmacy" element={<DemoPharmacy />} />
            <Route path="/demo/hospital/laboratory" element={<DemoLaboratory />} />
            <Route path="/demo/hospital/emergency" element={<DemoEmergency />} />
            <Route path="/demo/hospital/planning" element={<DemoPlanning />} />
            <Route path="/demo/hospital/finances" element={<DemoFinances />} />
            <Route path="/demo/hospital/statistics" element={<DemoStatistics />} />
            <Route path="/demo/hospital/settings" element={<DemoSettings />} />
            <Route path="/demo/hospital/staff" element={<DemoStaffManagement />} />
            
            {/* Routes professionnelles */}
            <Route path="/professional/select-establishment" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <SelectEstablishment />
              </ProtectedRoute>
            } />
            <Route path="/professional/agenda" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalAgenda />
              </ProtectedRoute>
            } />
            <Route path="/professional/patients" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalPatients />
              </ProtectedRoute>
            } />
            <Route path="/professional/teleconsultations" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalTeleconsultations />
              </ProtectedRoute>
            } />
            <Route path="/professional/consultations" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalConsultations />
              </ProtectedRoute>
            } />
            <Route path="/professional/prescriptions" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalPrescriptions />
              </ProtectedRoute>
            } />
            <Route path="/professional/finances" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalFinances />
              </ProtectedRoute>
            } />
            <Route path="/professional/stats" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalStatistics />
              </ProtectedRoute>
            } />
            <Route path="/professional/messages" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalMessages />
              </ProtectedRoute>
            } />
            <Route path="/professional/tele-expertise" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalTeleExpertise />
              </ProtectedRoute>
            } />
            <Route path="/professional/settings" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalSettings />
              </ProtectedRoute>
            } />
            <Route path="/professional/integrations" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <ProfessionalIntegrations />
              </ProtectedRoute>
            } />
            <Route path="/professional/teleconsultation/:sessionId" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <TeleconsultationSession />
              </ProtectedRoute>
            } />
          <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
