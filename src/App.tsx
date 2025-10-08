import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import ForProfessionals from "./pages/ForProfessionals";
import Awareness from "./pages/Awareness";
import LoginPatient from "./pages/LoginPatient";
import LoginProfessional from "./pages/LoginProfessional";
import Register from "./pages/Register";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterProfessional from "./pages/RegisterProfessional";
import DashboardPatient from "./pages/DashboardPatient";
import DashboardProfessional from "./pages/DashboardProfessional";
import DemoDoctorDashboard from "./pages/demo/DemoDoctorDashboard";
import DemoSpecialistDashboard from "./pages/demo/DemoSpecialistDashboard";
import DemoHospitalDashboard from "./pages/demo/DemoHospitalDashboard";
import DemoClinicDashboard from "./pages/demo/DemoClinicDashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import ProfessionalAgenda from "./pages/professional/Agenda";
import ProfessionalPatients from "./pages/professional/Patients";
import ProfessionalTeleconsultations from "./pages/professional/Teleconsultations";
import ProfessionalConsultations from "./pages/professional/Consultations";
import ProfessionalPrescriptions from "./pages/professional/Prescriptions";
import ProfessionalFinances from "./pages/professional/Finances";
import ProfessionalStatistics from "./pages/professional/Statistics";
import ProfessionalMessages from "./pages/professional/Messages";
import ProfessionalTeleExpertise from "./pages/professional/TeleExpertise";
import ProfessionalSettings from "./pages/professional/Settings";
import ProfessionalIntegrations from "./pages/professional/Integrations";
import TeleconsultationSession from "./pages/professional/TeleconsultationSession";
import Appointments from "./pages/Appointments";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import Prescriptions from "./pages/Prescriptions";
import Results from "./pages/Results";
import Providers from "./pages/Providers";
import Reimbursements from "./pages/Reimbursements";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminApprovals from "./pages/AdminApprovals";
import AdminEstablishments from "./pages/AdminEstablishments";
import AdminProfessionals from "./pages/AdminProfessionals";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDemo from "./pages/AdminDemo";
import AdminProject from "./pages/AdminProject";
import AdminAudit from "./pages/AdminAudit";
import NotFound from "./pages/NotFound";
import AdminSettings from "./pages/AdminSettings";
import Cartography from "./pages/Cartography";
import MedicalRecord from "./pages/MedicalRecord";
import Support from "./pages/Support";
import Teleconsultation from "./pages/Teleconsultation";
import ConsoleSilencer from "@/components/dev/ConsoleSilencer";

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
            <Route path="/superadmin" element={<SuperAdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/patient" element={<RegisterPatient />} />
            <Route path="/register/pro" element={<RegisterProfessional />} />
            <Route path="/dashboard/patient" element={
              <ProtectedRoute requiredRoles={['patient']}>
                <DashboardPatient />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/professional" element={
              <ProtectedRoute requiredRoles={['doctor', 'hospital', 'pharmacy', 'laboratory', 'medical_staff']}>
                <DashboardProfessional />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/superadmin" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <SuperAdminDashboard />
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
            <Route path="/admin" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/demo" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminDemo />
              </ProtectedRoute>
            } />
            <Route path="/admin/project" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminProject />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/approvals" element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <AdminApprovals />
              </ProtectedRoute>
            } />
            <Route path="/admin/establishments" element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <AdminEstablishments />
              </ProtectedRoute>
            } />
            <Route path="/admin/professionals" element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <AdminProfessionals />
              </ProtectedRoute>
            } />
          <Route path="/admin/audit" element={
            <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
              <AdminAudit />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRoles={['super_admin']}>
              <AdminSettings />
            </ProtectedRoute>
          } />
            <Route path="/demo/doctor" element={<DemoDoctorDashboard />} />
            <Route path="/demo/specialist" element={<DemoSpecialistDashboard />} />
            <Route path="/demo/hospital" element={<DemoHospitalDashboard />} />
            <Route path="/demo/clinic" element={<DemoClinicDashboard />} />
            
            {/* Routes professionnelles */}
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
