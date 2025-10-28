import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OfflineAuthProvider } from "./contexts/OfflineAuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
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

// Pages de démonstration
import DemoDoctorDashboard from "./pages/demo/DemoDoctorDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Désactiver les tentatives de reconnexion en mode hors-ligne
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
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
                    <Route path="/register" element={<Register />} />
                    <Route path="/register/patient" element={<RegisterPatient />} />
                    <Route path="/register/professional" element={<RegisterProfessional />} />
                    
                    {/* Routes de dashboard */}
                    <Route path="/dashboard/patient" element={<DashboardPatient />} />
                    <Route path="/dashboard/professional" element={<DashboardProfessional />} />
                    <Route path="/professional/select-establishment" element={<SelectEstablishment />} />
                    
                    {/* Routes de profil */}
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Routes de services */}
                    <Route path="/medical-record" element={<MedicalRecord />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/professional/teleconsultations" element={<Teleconsultations />} />
                    <Route path="/prescriptions" element={<Prescriptions />} />
                    
                    {/* Routes d'administration */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/health-actors" element={<AdminHealthActors />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    
                    {/* Routes de support */}
                    <Route path="/support" element={<Support />} />
                    
                    {/* Routes de démonstration */}
                    <Route path="/demo/doctor" element={<DemoDoctorDashboard />} />
                    
                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </TooltipProvider>
          </OfflineAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
