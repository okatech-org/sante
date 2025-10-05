import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Video, Stethoscope, Shield, Activity, Pill, CheckCircle, FileHeart, AlertCircle } from "lucide-react";
import { QuickActionCard } from "@/components/dashboard/patient/QuickActionCard";
import { HealthOverviewCard } from "@/components/dashboard/patient/HealthOverviewCard";
import { StatCard } from "@/components/dashboard/patient/StatCard";
import { ReminderCard } from "@/components/dashboard/patient/ReminderCard";
import { MedicalDocumentCard } from "@/components/dashboard/patient/MedicalDocumentCard";
import { useNavigate } from "react-router-dom";

export default function DashboardPatient() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const userName = (user?.user_metadata as any)?.full_name?.split(' ')[0] || 'Patient';

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="rounded-2xl backdrop-blur-lg p-6 bg-card/70 border border-border/40 shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Bonjour {userName} ! 👋
          </h2>
          <p className="text-muted-foreground">
            Bienvenue sur votre espace santé personnel. Gérez vos rendez-vous et consultations facilement.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            icon={Calendar}
            title="Prendre rendez-vous"
            badge="Prochain disponible aujourd'hui"
            onClick={() => navigate('/appointments')}
          />
          <QuickActionCard
            icon={Video}
            title="Téléconsultation"
            badge="Médecins disponibles"
            onClick={() => navigate('/teleconsultation')}
          />
        </div>

        {/* Health Overview */}
        <div className="rounded-2xl backdrop-blur-lg p-6 bg-card/70 border border-border/40 shadow-lg">
          <h3 className="text-lg font-semibold mb-6 text-foreground">
            Aperçu de votre Santé
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthOverviewCard
              title="Prochain Rendez-vous"
              mainValue="Mardi 8 Oct - 14h30"
              subtitle="Dr.Ékomi - Cardiologie"
              details={["Cabinet Montagne Sainte, Libreville"]}
              location="3.2 km de votre position"
              icon={Stethoscope}
            />
            <HealthOverviewCard
              title="Couverture CNAMGS"
              mainValue="100%"
              subtitle="Statut: Actif"
              details={["N° GA2384567891"]}
              icon={Shield}
              showProgress
              progressValue={100}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Consultations"
            value="8"
            icon={Stethoscope}
            trend="Cette année"
          />
          <StatCard
            label="Ordonnances actives"
            value="3"
            icon={Pill}
            trend="En cours"
          />
          <StatCard
            label="Analyses en attente"
            value="1"
            icon={Activity}
            trend="Résultat prévu lundi"
          />
          <StatCard
            label="Vaccins à jour"
            value="100%"
            icon={CheckCircle}
            trend="Prochain: 2026"
          />
        </div>

        {/* Rappels & Alertes */}
        <div className="rounded-2xl backdrop-blur-lg p-6 bg-card/70 border border-border/40 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Rappels & Alertes
          </h3>
          
          <div className="space-y-3">
            <ReminderCard
              time="Aujourd'hui 14h30"
              event="Consultation cardiologie - Dr.Ékomi"
              location="Cabinet Montagne Sainte"
              icon={Calendar}
            />
            <ReminderCard
              time="Dans 3 jours"
              event="Résultats d'analyses disponibles"
              location="Laboratoire BIOLAB"
              icon={Activity}
            />
            <ReminderCard
              time="Cette semaine"
              event="Ordonnance à renouveler"
              location="Pharmacie de la Grâce"
              icon={Pill}
            />
            <ReminderCard
              time="Urgent"
              event="Vaccin tétanos recommandé"
              location="Tout centre de vaccination"
              icon={AlertCircle}
            />
          </div>
        </div>

        {/* Dossier Médical Récent */}
        <div className="rounded-2xl backdrop-blur-lg p-6 bg-card/70 border border-border/40 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Dossier Médical Récent
            </h3>
            <button 
              onClick={() => navigate('/medical-record')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Voir tout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MedicalDocumentCard
              title="Dernière consultation"
              date="28 Sept 2025"
              type="Cardiologie"
              icon={FileHeart}
            />
            <MedicalDocumentCard
              title="Dernière ordonnance"
              date="28 Sept 2025"
              type="3 médicaments"
              icon={Pill}
            />
            <MedicalDocumentCard
              title="Dernière analyse"
              date="15 Sept 2025"
              type="Bilan sanguin"
              icon={Activity}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
