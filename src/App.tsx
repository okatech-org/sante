import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { MultiEstablishmentProvider } from "./contexts/MultiEstablishmentContext";
import { ThemeProvider } from "next-themes";
import ConsoleSilencer from "@/components/dev/ConsoleSilencer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { EstablishmentGuard } from "./components/auth/EstablishmentGuard";

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
import PublicProviderSearch from "./pages/PublicProviderSearch";
import Support from "./pages/Support";

// Admin Pages
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminApprovals from "./pages/AdminApprovals";
import AdminHealthActors from "./pages/AdminHealthActors";
import AdminDemo from "./pages/AdminDemo";
import AdminDemoV2 from "./pages/AdminDemoV2";
import AdminProject from "./pages/AdminProject";
import AdminAudit from "./pages/AdminAudit";
import AdminSettings from "./pages/AdminSettings";
import AdminCartography from "./pages/admin/AdminCartography";
import MultiEstablishmentArchitecture from "./pages/admin/MultiEstablishmentArchitecture";
import UnclaimedEstablishments from "./pages/establishments/UnclaimedEstablishments";
import EstablishmentPublicPage from "./pages/establishments/EstablishmentPublicPage";
import ClaimEstablishment from "./pages/establishments/ClaimEstablishment";
import ClaimsManagement from "./pages/superadmin/ClaimsManagement";
import ProfessionalsManagement from "./pages/superadmin/ProfessionalsManagement";
import PatientsManagement from "./pages/superadmin/PatientsManagement";
import FixDemoRoles from "./pages/superadmin/FixDemoRoles";
import DoctorDashboard from "./pages/demo/DoctorDashboard";
import NurseDashboard from "./pages/demo/NurseDashboard";
import AdminDashboard from "./pages/demo/AdminDashboard";
import OSMSync from "./pages/admin/OSMSync";

// Demo Pages
import DemoClinicDashboard from "./pages/demo/DemoClinicDashboard";
import DemoDoctorDashboard from "./pages/demo/DemoDoctorDashboard";
import DemoSpecialistDashboard from "./pages/demo/DemoSpecialistDashboard";
import DemoHospitalDashboard from "./pages/demo/DemoHospitalDashboard";
import DemoHospitalManageDashboard from "./pages/demo/DemoHospitalManageDashboard";
import DemoClinicManageDashboard from "./pages/demo/DemoClinicManageDashboard";
import DemoSogaraDashboard from "./pages/demo/DemoSogaraDashboard";
import DemoAdmissions from "./pages/demo/hospital/DemoAdmissions";
import DemoEmergency from "./pages/demo/hospital/DemoEmergency";
import DemoLaboratory from "./pages/demo/hospital/DemoLaboratory";
import DemoPharmacy from "./pages/demo/hospital/DemoPharmacy";
import DemoPlanning from "./pages/demo/hospital/DemoPlanning";
import DemoFinances from "./pages/demo/hospital/DemoFinances";
import DemoStatistics from "./pages/demo/hospital/DemoStatistics";
import DemoSettings from "./pages/demo/hospital/DemoSettings";
import DemoStaffManagement from "./pages/demo/hospital/DemoStaffManagement";
import EcosystemCMST from "./pages/demo/sogara/EcosystemCMST";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <MultiEstablishmentProvider>
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
            
            {/* Recherche Publique d'Établissements */}
            <Route path="/find-providers" element={<PublicProviderSearch />} />
            <Route path="/search" element={<PublicProviderSearch />} />
            
            {/* Établissements Non-Revendiqués */}
            <Route path="/establishments/unclaimed" element={<UnclaimedEstablishments />} />
            <Route path="/establishment/:id/public" element={<EstablishmentPublicPage />} />
            <Route path="/establishments/:id/claim" element={
              <ProtectedRoute>
                <ClaimEstablishment />
              </ProtectedRoute>
            } />
            
            {/* CMST SOGARA Demo Dashboards */}
            <Route path="/demo/sogara" element={<DoctorDashboard />} />
            <Route path="/demo/sogara/nurse" element={<NurseDashboard />} />
            <Route path="/demo/sogara/admin" element={<AdminDashboard />} />
            
            <Route path="/dashboard/patient" element={
              <ProtectedRoute requiredRoles={['patient']}>
                <DashboardPatient />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/professional" element={
              <ProtectedRoute requiredRoles={['doctor', 'hospital', 'pharmacy', 'laboratory', 'medical_staff']}>
                <EstablishmentGuard>
                  <DashboardProfessional />
                </EstablishmentGuard>
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
            <Route path="/superadmin/cartography" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminCartography />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/audit" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminAudit />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/panel" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/settings" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/demo" element={
              <Navigate to="/establishments/unclaimed" replace />
            } />
            <Route path="/superadmin/demo-legacy" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminDemoV2 />
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
            <Route path="/superadmin/claims" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <ClaimsManagement />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/professionals" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <ProfessionalsManagement />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/patients" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <PatientsManagement />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/fix-roles" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <FixDemoRoles />
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
            <Route path="/demo/sogara" element={<DemoSogaraDashboard />} />
            <Route path="/demo/hospital/manage" element={<DemoHospitalManageDashboard />} />
            <Route path="/demo/clinic/manage" element={<DemoClinicManageDashboard />} />
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
                <EstablishmentGuard>
                  <ProfessionalAgenda />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/patients" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalPatients />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/teleconsultations" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalTeleconsultations />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/consultations" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalConsultations />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/prescriptions" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalPrescriptions />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/finances" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalFinances />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/stats" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalStatistics />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/messages" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalMessages />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/tele-expertise" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalTeleExpertise />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/settings" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalSettings />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/integrations" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <ProfessionalIntegrations />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
            <Route path="/professional/teleconsultation/:sessionId" element={
              <ProtectedRoute requiredRoles={['doctor', 'medical_staff']}>
                <EstablishmentGuard>
                  <TeleconsultationSession />
                </EstablishmentGuard>
              </ProtectedRoute>
            } />
          <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
              </TooltipProvider>
            </LanguageProvider>
          </MultiEstablishmentProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
