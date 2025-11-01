import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MultiEstablishmentProvider } from "./contexts/MultiEstablishmentContext";
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
import Login from "./pages/Login";
import LoginPatient from "./pages/LoginPatient";
import LoginProfessional from "./pages/LoginProfessional";
import Register from "./pages/Register";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterProfessional from "./pages/RegisterProfessional";

// Pages de dashboard
import DashboardPatient from "./pages/DashboardPatient";
import DashboardProfessional from "./pages/DashboardProfessional";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import SelectEstablishment from "./pages/professional/SelectEstablishment";
import EstablishmentsManager from "./pages/professional/EstablishmentsManager";
import SogaraDashboard from "./pages/establishments/sogara/admin/SogaraDashboard";

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
import AdminEstablishments from "./pages/admin/AdminEstablishments";
import SuperAdminLogin from "./pages/SuperAdminLogin";
// import SuperAdminDashboard from "./pages/SuperAdminDashboard"; // Temporarily disabled

// Pages de support
import Support from "./pages/Support";

// Pages de démonstration
import DemoDoctorDashboard from "./pages/demo/DemoDoctorDashboard";
import Sogara from "./pages/Sogara";

// Pages du Ministère de la Santé
import MinistryDashboard from "./pages/ministry/MinistryDashboard";
import MinistryPublic from "./pages/ministry/MinistryPublic";
import MinistryGouvPublic from "./pages/ministry/MinistryGouvPublic";
import MinistryLogin from "./pages/ministry/MinistryLogin";
import MinistryTest from "./pages/ministry/MinistryTest";

// Pages des établissements
import EstablishmentHomePage from "./pages/establishment/EstablishmentHomePage";

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
          <AuthProvider>
            <MultiEstablishmentProvider>
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/patient" element={<LoginPatient />} />
                    <Route path="/login/professional" element={<LoginProfessional />} />
                    <Route path="/login/admin" element={<SuperAdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register/patient" element={<RegisterPatient />} />
                    <Route path="/register/professional" element={<RegisterProfessional />} />
                    
                    {/* Routes de dashboard */}
                    <Route path="/dashboard/patient" element={<DashboardPatient />} />
                    <Route path="/dashboard/professional" element={<DashboardProfessional />} />
                    <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
                    <Route path="/professional/select-establishment" element={<SelectEstablishment />} />
                    <Route path="/professional/establishments" element={<EstablishmentsManager />} />
                    <Route path="/establishments/sogara/admin" element={<SogaraDashboard />} />
                    
                    {/* Routes de profil */}
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Routes de services */}
                    <Route path="/medical-record" element={<MedicalRecord />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/professional/teleconsultations" element={<Teleconsultations />} />
                    <Route path="/prescriptions" element={<Prescriptions />} />
                    
                    {/* Routes d'administration */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/dashboard/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/health-actors" element={<AdminHealthActors />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    <Route path="/admin/establishments" element={<AdminEstablishments />} />
                    {/* <Route path="/superadmin" element={<SuperAdminDashboard />} /> */}
                    {/* <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} /> */}
                    
                    {/* Routes de support */}
                    <Route path="/support" element={<Support />} />
                    
                    {/* Routes de démonstration */}
                    <Route path="/demo/doctor" element={<DemoDoctorDashboard />} />
                    
                    {/* Route Sogara */}
                    <Route path="/sogara" element={<Sogara />} />
                    
                    {/* Routes Ministère de la Santé - Pages publiques (sans auth) */}
                    <Route path="/gouv" element={<MinistryGouvPublic />} />
                    <Route path="/Gouv" element={<MinistryGouvPublic />} />
                    <Route path="/ministry" element={<MinistryPublic />} />
                    <Route path="/Ministry" element={<MinistryPublic />} />
                    <Route path="/ministry/public" element={<MinistryPublic />} />
                    <Route path="/ministry/test" element={<MinistryTest />} />
                    <Route path="/ministere" element={<MinistryPublic />} />
                    <Route path="/Ministere" element={<MinistryPublic />} />
                    
                    {/* Routes Ministère protégées (avec auth) */}
                    <Route path="/ministry/dashboard" element={<MinistryDashboard />} />
                    <Route path="/ministry/login" element={<MinistryLogin />} />
                    <Route path="/ministere/dashboard" element={<MinistryDashboard />} />
                    <Route path="/ministere/connexion" element={<MinistryLogin />} />
                    
                    {/* Pages d'accueil des établissements */}
                    <Route path="/establishment/:id" element={<EstablishmentHomePage />} />
                    <Route path="/etablissement/:id" element={<EstablishmentHomePage />} />
                    
                    {/* Routes personnalisées pour établissements spécifiques */}
                    {/* Cas spéciaux avec pages dédiées */}
                    <Route path="/sogara" element={<Sogara />} />
                    
                    {/* CHU - Centres Hospitaliers Universitaires */}
                    <Route path="/chu-libreville" element={<EstablishmentHomePage />} />
                    <Route path="/chu-jeanne-ebori" element={<EstablishmentHomePage />} />
                    <Route path="/chu-melen" element={<EstablishmentHomePage />} />
                    <Route path="/chu-angondje" element={<EstablishmentHomePage />} />
                    
                    {/* CHR - Centres Hospitaliers Régionaux */}
                    <Route path="/chr-franceville" element={<EstablishmentHomePage />} />
                    <Route path="/chr-port-gentil" element={<EstablishmentHomePage />} />
                    <Route path="/chr-oyem" element={<EstablishmentHomePage />} />
                    <Route path="/chr-mouila" element={<EstablishmentHomePage />} />
                    <Route path="/chr-tchibanga" element={<EstablishmentHomePage />} />
                    <Route path="/chr-makokou" element={<EstablishmentHomePage />} />
                    <Route path="/chr-koulamoutou" element={<EstablishmentHomePage />} />
                    <Route path="/chr-lambarene" element={<EstablishmentHomePage />} />
                    <Route path="/chr-omboue" element={<EstablishmentHomePage />} />
                    
                    {/* Hôpitaux spécialisés */}
                    <Route path="/hopital-sino-gabonais" element={<EstablishmentHomePage />} />
                    <Route path="/hia-obo" element={<EstablishmentHomePage />} />
                    <Route path="/hopital-psychiatrique-melen" element={<EstablishmentHomePage />} />
                    <Route path="/ch-nkembo" element={<EstablishmentHomePage />} />
                    
                    {/* Cliniques et polycliniques importantes */}
                    <Route path="/clinique-el-rapha" element={<EstablishmentHomePage />} />
                    <Route path="/polyclinique-chambrier" element={<EstablishmentHomePage />} />
                    <Route path="/polyclinique-el-rapha-2" element={<EstablishmentHomePage />} />
                    <Route path="/cm-sabliere" element={<EstablishmentHomePage />} />
                    <Route path="/clinique-littoral" element={<EstablishmentHomePage />} />
                    <Route path="/clinique-estuaire" element={<EstablishmentHomePage />} />
                    
                    {/* Centres spécialisés */}
                    <Route path="/cts-libreville" element={<EstablishmentHomePage />} />
                    <Route path="/icl" element={<EstablishmentHomePage />} />
                    <Route path="/dialyse-libreville" element={<EstablishmentHomePage />} />
                    <Route path="/cnr" element={<EstablishmentHomePage />} />
                    
                    {/* Laboratoires et centres de recherche */}
                    <Route path="/lnsp" element={<EstablishmentHomePage />} />
                    <Route path="/cermel" element={<EstablishmentHomePage />} />
                    <Route path="/iele" element={<EstablishmentHomePage />} />
                    
                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </BrowserRouter>
              </TooltipProvider>
            </MultiEstablishmentProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
