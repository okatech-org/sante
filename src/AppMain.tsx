import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OfflineAuthProvider } from "./contexts/OfflineAuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ConsoleSilencer from "@/components/dev/ConsoleSilencer";

// Pages principales
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import Awareness from "./pages/Awareness";
import ForProfessionals from "./pages/ForProfessionals";

// Pages d'authentification
import LoginPatient from "./pages/LoginPatient";
import LoginProfessional from "./pages/LoginProfessional";
import Register from "./pages/Register";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterProfessional from "./pages/RegisterProfessional";

// Pages de dashboard
import DashboardPatient from "./pages/DashboardPatient";
import DashboardProfessional from "./pages/DashboardProfessional";
import SelectEstablishment from "./pages/professional/SelectEstablishment";

// Pages de profil
import Profile from "./pages/Profile";

// Pages de services
import MedicalRecord from "./pages/MedicalRecord";
import Appointments from "./pages/Appointments";
import Teleconsultations from "./pages/professional/Teleconsultations";
import Prescriptions from "./pages/Prescriptions";

// Pages d'administration
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminHealthActors from "./pages/AdminHealthActors";
import AdminApprovals from "./pages/AdminApprovals";

// Pages de support
import Support from "./pages/Support";

// Pages de cartographie
import Cartography from "./pages/Cartography";
import AdminCartography from "./pages/admin/AdminCartography";

// Pages Admin Super Admin
import AdminEstablishments from "./pages/admin/AdminEstablishments";
import AdminBilling from "./pages/admin/AdminBilling";
import AdminAPI from "./pages/admin/AdminAPI";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSystem from "./pages/admin/AdminSystem";

// Pages de démonstration
import DemoDoctorDashboard from "./pages/demo/DemoDoctorDashboard";

// Pages SOGARA
import SogaraPublic from "./pages/establishments/sogara/SogaraPublic";
import SogaraLogin from "./pages/SogaraLogin";
import SogaraDashboard from "./pages/establishments/sogara/SogaraDashboard";
import SogaraEmergency from "./pages/establishments/sogara/SogaraEmergency";
import SogaraConsultations from "./pages/establishments/sogara/SogaraConsultations";
import SogaraEmployees from "./pages/establishments/sogara/SogaraEmployees";
import SogaraManagement from "./pages/admin/establishments/SogaraManagement";

// Pages d'authentification admin
import SuperAdminLogin from "./pages/SuperAdminLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function AppMain() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <OfflineAuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <ConsoleSilencer />
                <div className="min-h-screen bg-background">
                  <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/awareness" element={<Awareness />} />
                    <Route path="/for-professionals" element={<ForProfessionals />} />

                    {/* Routes d'authentification */}
                    <Route path="/login/patient" element={<LoginPatient />} />
                    <Route path="/login/professional" element={<LoginProfessional />} />
                    <Route path="/login/pro" element={<LoginProfessional />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register/patient" element={<RegisterPatient />} />
                    <Route path="/register/professional" element={<RegisterProfessional />} />

                    {/* Routes de dashboard */}
                    <Route path="/dashboard/patient" element={<DashboardPatient />} />
                    <Route path="/dashboard/professional" element={<DashboardProfessional />} />
                    <Route path="/professional/select-establishment" element={<SelectEstablishment />} />

                    {/* Routes de profil */}
                    <Route path="/profile/patient" element={<Profile />} />
                    <Route path="/profile/professional" element={<Profile />} />

                    {/* Routes de services */}
                    <Route path="/medical-record" element={<MedicalRecord />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/professional/teleconsultations" element={<Teleconsultations />} />
                    <Route path="/prescriptions" element={<Prescriptions />} />

                    {/* Routes d'administration */}
                    <Route path="/login/superadmin" element={<SuperAdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/health-actors" element={<AdminHealthActors />} />
                    <Route path="/admin/establishments" element={<AdminEstablishments />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    <Route path="/admin/cartography" element={<AdminCartography />} />
                    <Route path="/admin/billing" element={<AdminBilling />} />
                    <Route path="/admin/api" element={<AdminAPI />} />
                    <Route path="/admin/security" element={<AdminSecurity />} />
                    <Route path="/admin/support" element={<AdminSupport />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/system" element={<AdminSystem />} />
                    
                    {/* Route de cartographie publique */}
                    <Route path="/cartography" element={<Cartography />} />

                    {/* Routes de support */}
                    <Route path="/support" element={<Support />} />

                    {/* Pages de démonstration */}
                    <Route path="/demo/doctor" element={<DemoDoctorDashboard />} />

                    {/* Routes SOGARA */}
                    {/* Page publique SOGARA */}
                    <Route path="/sogara" element={<SogaraPublic />} />
                    
                    {/* Connexion Personnel SOGARA */}
                    <Route path="/login/sogara" element={<SogaraLogin />} />
                    
                    {/* Dashboard Admin SOGARA (pour l'admin de l'établissement) */}
                    <Route path="/establishments/sogara/admin" element={<SogaraDashboard />} />
                    <Route path="/establishments/sogara/admin/emergency" element={<SogaraEmergency />} />
                    <Route path="/establishments/sogara/admin/consultations" element={<SogaraConsultations />} />
                    <Route path="/establishments/sogara/admin/employees" element={<SogaraEmployees />} />
                    
                    {/* Page de gestion Super Admin pour SOGARA */}
                    <Route path="/admin/establishments/sogara" element={<SogaraManagement />} />

                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </TooltipProvider>
            </OfflineAuthProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppMain;


