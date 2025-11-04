import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { OfflineAuthProvider } from "./contexts/OfflineAuthContext";
import { MultiEstablishmentProvider } from "./contexts/MultiEstablishmentContext";
import { SogaraAuthProvider } from "./contexts/SogaraAuthContext";
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
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import ProfessionalHub from "./pages/professional/ProfessionalHub";
import AccueilHDJPage from "./pages/professional/AccueilHDJPage";
import AccueilUrgencesPage from "./pages/professional/AccueilUrgencesPage";
import AccueilHDJRdvPage from "./pages/professional/AccueilHDJRdvPage";
import AccueilHDJFilesAttentePage from "./pages/professional/AccueilHDJFilesAttentePage";
import AccueilHDJDossiersPage from "./pages/professional/AccueilHDJDossiersPage";
import AccueilUrgencesTriagePage from "./pages/professional/AccueilUrgencesTriagePage";
import AccueilUrgencesDossiersPage from "./pages/professional/AccueilUrgencesDossiersPage";
import AccueilHospitalisationPage from "./pages/professional/AccueilHospitalisationPage";
import AccueilHospitalisationDashboardPage from "./pages/professional/AccueilHospitalisationDashboardPage";
import AccueilHospitalisationAdmissionsPage from "./pages/professional/AccueilHospitalisationAdmissionsPage";
import AccueilHospitalisationChambresPage from "./pages/professional/AccueilHospitalisationChambresPage";
import AccueilHospitalisationSortiesPage from "./pages/professional/AccueilHospitalisationSortiesPage";
import DirectorDashboard from "./pages/professional/DirectorDashboard";
import DoctorDashboard from "./pages/professional/DoctorDashboard";
import ProfessionalConsultations from "./pages/professional/ProfessionalConsultations";
import ProfessionalHospitalization from "./pages/professional/ProfessionalHospitalization";
import ProfessionalTechnicalPlatforms from "./pages/professional/ProfessionalTechnicalPlatforms";
import ProfessionalStatistics from "./pages/professional/ProfessionalStatistics";
import ProfessionalMessages from "./pages/professional/ProfessionalMessages";
import ProfessionalStaff from "./pages/professional/ProfessionalStaff";
import ProfessionalBilling from "./pages/professional/ProfessionalBilling";
import ProfessionalInventory from "./pages/professional/ProfessionalInventory";
import ProfessionalReports from "./pages/professional/ProfessionalReports";
import ProfessionalMedicalStaff from "./pages/professional/ProfessionalMedicalStaff";
import ProfessionalServices from "./pages/professional/ProfessionalServices";
import ProfessionalProtocols from "./pages/professional/ProfessionalProtocols";
import ProfessionalInfrastructure from "./pages/professional/ProfessionalInfrastructure";
import ProfessionalSettings from "./pages/professional/ProfessionalSettings";
import ProfessionalTeleconsultations from "./pages/professional/ProfessionalTeleconsultations";
import ProfessionalPatients from "./pages/professional/ProfessionalPatients";
import ProfessionalAppointments from "./pages/professional/ProfessionalAppointments";
import { ProfessionalEstablishmentLayout } from "./components/layout/ProfessionalEstablishmentLayout";
import SelectEstablishment from "./pages/professional/SelectEstablishment";
import SelectRole from "./pages/professional/SelectRole";
import EstablishmentsManager from "./pages/professional/EstablishmentsManager";
import RequireProfessional from "./components/auth/RequireProfessional";

// Pages Patient
import MedicalRecord from "./pages/patient/MedicalRecord";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import ProfessionalPrescriptions from "./pages/professional/Prescriptions";
import Results from "./pages/Results";
import Reimbursements from "./pages/Reimbursements";
import Teleconsultation from "./pages/Teleconsultation";
import Messages from "./pages/Messages";
import Parametres from "./pages/Parametres";

// Pages de profil
import Profile from "./pages/Profile";

// Pages de services
import Teleconsultations from "./pages/professional/Teleconsultations";

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
import PharmacyManagement from "./pages/admin/PharmacyManagement";
import AdminBilling from "./pages/admin/AdminBilling";
import AdminAPI from "./pages/admin/AdminAPI";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSystem from "./pages/admin/AdminSystem";
import AdminCredentials from "./pages/admin/AdminCredentials";

// Pages de démonstration
import DemoDoctorDashboard from "./pages/demo/DemoDoctorDashboard";

// Pages du Ministère de la Santé
import MinistryModern from "./pages/ministry/MinistryModern";
import MinistryDashboard from "./pages/ministry/MinistryDashboard";
import MinisterDashboard from "./pages/ministry/MinisterDashboard";
import LoginMinister from "./pages/ministry/LoginMinister";
import MinistryLogin from "./pages/ministry/MinistryLogin";

// Pages SOGARA
import SogaraPublic from "./pages/establishments/sogara/SogaraPublic";
import SogaraLogin from "./pages/SogaraLogin";
import SogaraDashboard from "./pages/establishments/sogara/admin/SogaraDashboard";
import SogaraRedirect from "./pages/establishments/sogara/admin/SogaraRedirect";
import SogaraEmergency from "./pages/establishments/sogara/SogaraEmergency";
import SogaraConsultations from "./pages/establishments/sogara/SogaraConsultations";
import SogaraEmployees from "./pages/establishments/sogara/SogaraEmployees";
import SogaraBeneficiaries from "./pages/establishments/sogara/SogaraBeneficiaries";
import SogaraWorkMedicine from "./pages/establishments/sogara/SogaraWorkMedicine";
import SogaraHospitalization from "./pages/establishments/sogara/SogaraHospitalization";
import SogaraTechnical from "./pages/establishments/sogara/SogaraTechnical";
import SogaraStaff from "./pages/establishments/sogara/SogaraStaff";
import SogaraManagement from "./pages/admin/establishments/SogaraManagement";

// Pages d'authentification admin
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Pharmacies from "./pages/Pharmacies";
import EstablishmentPublicPage from "./pages/establishments/EstablishmentPublicPage";
import PharmacyPublicPage from "./pages/pharmacy/PharmacyPublicPage";

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
            <MultiEstablishmentProvider>
                <SogaraAuthProvider>
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
                  <Route path="/pharmacies" element={<Pharmacies />} />
                  <Route path="/pharmacie" element={<Pharmacies />} />
                  <Route path="/pharmacies/:id" element={<PharmacyPublicPage />} />
                  <Route path="/pharmacy/:id" element={<PharmacyPublicPage />} />

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
                    <Route path="/professional" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalHub />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/dashboard" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalHub />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/director-dashboard" element={
                      <ProfessionalEstablishmentLayout>
                        <DirectorDashboard />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/doctor-dashboard" element={
                      <ProfessionalEstablishmentLayout>
                        <DoctorDashboard />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/accueil-hdj" element={<AccueilHDJPage />} />
                    <Route path="/professional/accueil-hdj/rdv" element={<AccueilHDJRdvPage />} />
                    <Route path="/professional/accueil-hdj/files-attente" element={<AccueilHDJFilesAttentePage />} />
                    <Route path="/professional/accueil-hdj/dossiers" element={<AccueilHDJDossiersPage />} />
                    <Route path="/professional/accueil-urgences" element={<AccueilUrgencesPage />} />
                    <Route path="/professional/accueil-urgences/triage" element={<AccueilUrgencesTriagePage />} />
                    <Route path="/professional/accueil-urgences/dossiers" element={<AccueilUrgencesDossiersPage />} />
                    <Route path="/professional/accueil-hospitalisation" element={<AccueilHospitalisationDashboardPage />} />
                    <Route path="/professional/accueil-hospitalisation/admissions" element={<AccueilHospitalisationAdmissionsPage />} />
                    <Route path="/professional/accueil-hospitalisation/chambres" element={<AccueilHospitalisationChambresPage />} />
                    <Route path="/professional/accueil-hospitalisation/sorties" element={<AccueilHospitalisationSortiesPage />} />
                    <Route path="/professional/consultations" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalConsultations />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/consultations/new" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalConsultations />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/hospitalization" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalHospitalization />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/technical" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalTechnicalPlatforms />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/statistics" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalStatistics />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/messages" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalMessages />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/staff" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalStaff />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/billing" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalBilling />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/inventory" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalInventory />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/reports" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalReports />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/medical-staff" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalMedicalStaff />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/services" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalServices />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/protocols" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalProtocols />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/infrastructure" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalInfrastructure />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/settings" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalSettings />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/teleconsultations" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalTeleconsultations />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/teleconsultation" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalTeleconsultations />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/prescriptions" element={
                      <RequireProfessional>
                        <ProfessionalEstablishmentLayout>
                          <ProfessionalPrescriptions />
                        </ProfessionalEstablishmentLayout>
                      </RequireProfessional>
                    } />
                    <Route path="/professional/prescriptions/new" element={
                      <RequireProfessional>
                        <ProfessionalEstablishmentLayout>
                          <ProfessionalPrescriptions />
                        </ProfessionalEstablishmentLayout>
                      </RequireProfessional>
                    } />
                    <Route path="/professional/patients" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalPatients />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/appointments" element={
                      <ProfessionalEstablishmentLayout>
                        <ProfessionalAppointments />
                      </ProfessionalEstablishmentLayout>
                    } />
                    <Route path="/professional/select-establishment" element={<SelectEstablishment />} />
                    <Route path="/professional/select-role/:establishmentId" element={<SelectRole />} />
                    <Route path="/professional/establishments" element={<EstablishmentsManager />} />

                    {/* Routes de profil */}
                    <Route path="/profile/patient" element={<Profile />} />
                    <Route path="/profile/professional" element={<Profile />} />

                    {/* Routes de services */}
                    <Route path="/medical-record" element={<MedicalRecord />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/prescriptions" element={<Prescriptions />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/reimbursements" element={<Reimbursements />} />
                    <Route path="/teleconsultation" element={<Teleconsultation />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/parametres" element={<Parametres />} />
                    <Route path="/professional/teleconsultations" element={<Teleconsultations />} />

                    {/* Routes d'administration */}
                    <Route path="/login/superadmin" element={<SuperAdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/health-actors" element={<AdminHealthActors />} />
                    <Route path="/admin/establishments" element={<AdminEstablishments />} />
                    <Route path="/admin/pharmacies" element={<PharmacyManagement />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    <Route path="/admin/cartography" element={<AdminCartography />} />
                    <Route path="/admin/billing" element={<AdminBilling />} />
                    <Route path="/admin/api" element={<AdminAPI />} />
                    <Route path="/admin/security" element={<AdminSecurity />} />
                    <Route path="/admin/support" element={<AdminSupport />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/system" element={<AdminSystem />} />
                    <Route path="/admin/credentials" element={<AdminCredentials />} />
                    
                    {/* Route de cartographie publique */}
                    <Route path="/cartography" element={<Cartography />} />

                    {/* Routes de support */}
                    <Route path="/support" element={<Support />} />

                    {/* Pages de démonstration */}
                    <Route path="/demo/doctor" element={<DemoDoctorDashboard />} />

                    {/* Routes SOGARA */}
                    {/* Page publique SOGARA */}
                    <Route path="/sogara" element={<SogaraPublic />} />
                  
                  {/* Pages publiques d'établissement */}
                  <Route path="/establishments/:id" element={<EstablishmentPublicPage />} />
                  <Route path="/establishment/:id" element={<EstablishmentPublicPage />} />
                    
                    {/* Routes Ministère de la Santé - Pages publiques (sans auth) */}
                    <Route path="/gouv" element={<MinistryModern />} />
                    <Route path="/ministry" element={<MinistryModern />} />
                    <Route path="/ministere" element={<MinistryModern />} />
                    <Route path="/Ministry" element={<MinistryModern />} />
                    <Route path="/Ministere" element={<MinistryModern />} />
                    
                    {/* Routes Ministère protégées (avec auth) */}
                    <Route path="/gouv/login" element={<LoginMinister />} />
                    <Route path="/gouv/dashboard" element={<MinisterDashboard />} />
                    <Route path="/minister/dashboard" element={<MinisterDashboard />} />
                    <Route path="/ministre/dashboard" element={<MinisterDashboard />} />
                    
                    {/* Connexion Personnel SOGARA */}
                    <Route path="/login/sogara" element={<SogaraLogin />} />
                    
                    {/* Dashboard Admin SOGARA - Redirection vers nouvelle interface */}
                    <Route path="/establishments/sogara/admin" element={<SogaraRedirect />} />
                    <Route path="/establishments/sogara/admin/consultations" element={<SogaraConsultations />} />
                    <Route path="/establishments/sogara/admin/emergency" element={<SogaraEmergency />} />
                    <Route path="/establishments/sogara/admin/employees" element={<SogaraEmployees />} />
                    <Route path="/establishments/sogara/admin/beneficiaries" element={<SogaraBeneficiaries />} />
                    <Route path="/establishments/sogara/admin/work-medicine" element={<SogaraWorkMedicine />} />
                    <Route path="/establishments/sogara/admin/hospitalization" element={<SogaraHospitalization />} />
                    <Route path="/establishments/sogara/admin/technical" element={<SogaraTechnical />} />
                    <Route path="/establishments/sogara/admin/staff" element={<SogaraStaff />} />
                    
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
              </SogaraAuthProvider>
            </MultiEstablishmentProvider>
            </OfflineAuthProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppMain;


