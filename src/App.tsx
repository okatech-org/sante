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
import Login from "./pages/Login";
import LoginPatient from "./pages/LoginPatient";
import LoginProfessional from "./pages/LoginProfessional";
import Register from "./pages/Register";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterProfessional from "./pages/RegisterProfessional";
import DashboardPatient from "./pages/DashboardPatient";
import DashboardProfessional from "./pages/DashboardProfessional";
import DashboardAdmin from "./pages/DashboardAdmin";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-professionals" element={<ForProfessionals />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/teleconsultation" element={
              <ProtectedRoute>
                <Teleconsultation />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
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
