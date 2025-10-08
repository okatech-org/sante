import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Stethoscope, Briefcase, Building2, FlaskConical, Pill, UserCog, LogIn, Baby, Sparkles, Activity, HeartPulse, Brain, Eye, Syringe, Hospital, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface DemoAccount {
  id: string;
  type: string;
  name: string;
  email: string;
  role: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}

const demoAccounts: DemoAccount[] = [
  {
    id: "patient-demo",
    type: "Patient",
    name: "Marie OKOME",
    email: "patient.demo@sante.ga",
    role: "patient",
    description: "Compte patient avec historique médical complet, ordonnances actives et rendez-vous à venir",
    icon: User,
    badgeColor: "bg-blue-500"
  },
  {
    id: "doctor-demo",
    type: "Médecin",
    name: "Dr. Pierre KOMBILA",
    email: "medecin.demo@sante.ga",
    role: "doctor",
    description: "Médecin généraliste avec agenda de consultations, patients en suivi et prescriptions",
    icon: Stethoscope,
    badgeColor: "bg-green-500"
  },
  {
    id: "specialist-demo",
    type: "Médecin Spécialiste",
    name: "Dr. Sylvie NGUEMA",
    email: "specialiste.demo@sante.ga",
    role: "specialist",
    description: "Cardiologue avec consultations spécialisées, examens cardiologiques et suivi de pathologies",
    icon: HeartPulse,
    badgeColor: "bg-rose-500"
  },
  {
    id: "nurse-demo",
    type: "Infirmier(ère)",
    name: "Sophie MBOUMBA",
    email: "infirmiere.demo@sante.ga",
    role: "nurse",
    description: "Infirmière avec planning de soins, vaccinations et suivi post-opératoire",
    icon: Briefcase,
    badgeColor: "bg-purple-500"
  },
  {
    id: "midwife-demo",
    type: "Sage-femme",
    name: "Grace ONDO",
    email: "sagefemme.demo@sante.ga",
    role: "midwife",
    description: "Sage-femme avec suivi de grossesses, accouchements et consultations pré/post-natales",
    icon: Baby,
    badgeColor: "bg-pink-500"
  },
  {
    id: "physiotherapist-demo",
    type: "Kinésithérapeute",
    name: "Marc MOUNGUENGUI",
    email: "kine.demo@sante.ga",
    role: "physiotherapist",
    description: "Kinésithérapeute avec séances de rééducation, suivi post-traumatique et planning de soins",
    icon: Activity,
    badgeColor: "bg-teal-500"
  },
  {
    id: "psychologist-demo",
    type: "Psychologue",
    name: "Alice BOULINGUI",
    email: "psychologue.demo@sante.ga",
    role: "psychologist",
    description: "Psychologue clinicien avec consultations, thérapies et suivi psychologique",
    icon: Brain,
    badgeColor: "bg-violet-500"
  },
  {
    id: "ophthalmologist-demo",
    type: "Ophtalmologiste",
    name: "Dr. Joseph MENGUE",
    email: "ophtalmo.demo@sante.ga",
    role: "ophthalmologist",
    description: "Ophtalmologiste avec examens de la vue, prescriptions de lunettes et chirurgie oculaire",
    icon: Eye,
    badgeColor: "bg-amber-500"
  },
  {
    id: "anesthesiologist-demo",
    type: "Anesthésiste",
    name: "Dr. François OVONO",
    email: "anesthesiste.demo@sante.ga",
    role: "anesthesiologist",
    description: "Anesthésiste-réanimateur avec consultations pré-opératoires et gestion de la douleur",
    icon: Syringe,
    badgeColor: "bg-slate-500"
  },
  {
    id: "pharmacist-demo",
    type: "Pharmacien(ne)",
    name: "Jean MOUSSAVOU",
    email: "pharmacien.demo@sante.ga",
    role: "pharmacist",
    description: "Pharmacien diplômé avec ordonnances, conseils pharmaceutiques et suivi médicamenteux",
    icon: Pill,
    badgeColor: "bg-orange-500"
  },
  {
    id: "pharmacy-demo",
    type: "Pharmacie",
    name: "Pharmacie du Centre",
    email: "pharmacie.demo@sante.ga",
    role: "pharmacy",
    description: "Établissement pharmaceutique avec gestion de stock, personnel et dispensation",
    icon: Building2,
    badgeColor: "bg-orange-600"
  },
  {
    id: "lab-demo",
    type: "Laborantin(e)",
    name: "Claire NDONG",
    email: "labo.demo@sante.ga",
    role: "laboratory_technician",
    description: "Technicien(ne) de laboratoire avec analyses en cours et résultats à publier",
    icon: FlaskConical,
    badgeColor: "bg-cyan-500"
  },
  {
    id: "radiologist-demo",
    type: "Radiologue",
    name: "Dr. Daniel IBINGA",
    email: "radiologue.demo@sante.ga",
    role: "radiologist",
    description: "Radiologue avec interprétation d'imagerie, échographies, scanners et IRM",
    icon: Sparkles,
    badgeColor: "bg-sky-500"
  },
  {
    id: "radiology-center-demo",
    type: "Centre de Radiologie",
    name: "Centre d'Imagerie Médicale",
    email: "radiologie.demo@sante.ga",
    role: "radiology_center",
    description: "Centre d'imagerie avec équipements (scanner, IRM, échographie) et personnel technique",
    icon: Building2,
    badgeColor: "bg-sky-600"
  },
  {
    id: "admin-demo",
    type: "Administrateur",
    name: "Admin MBADINGA",
    email: "admin.demo@sante.ga",
    role: "admin",
    description: "Administrateur d'établissement avec gestion du personnel et des équipements",
    icon: UserCog,
    badgeColor: "bg-red-500"
  },
  {
    id: "hospital-demo",
    type: "Hôpital",
    name: "CHU Owendo",
    email: "hopital.demo@sante.ga",
    role: "hospital_admin",
    description: "Établissement hospitalier public avec services, lits, urgences et bloc opératoire",
    icon: Building2,
    badgeColor: "bg-indigo-500"
  },
  {
    id: "clinic-demo",
    type: "Clinique",
    name: "Clinique Sainte-Marie",
    email: "clinique.demo@sante.ga",
    role: "clinic_admin",
    description: "Établissement de santé privé avec consultations, hospitalisations et chirurgie",
    icon: Hospital,
    badgeColor: "bg-emerald-500"
  }
];

export default function AdminDemo() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeDemoAccounts = async () => {
    setIsInitializing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-accounts', {
        body: { init: true },
      });

      if (error) throw error as any;

      if ((data as any)?.success) {
        toast({
          title: "Comptes démo initialisés",
          description: "Tous les comptes démo ont été créés/mis à jour.",
        });
        return true;
      } else {
        throw new Error((data as any)?.error || 'Initialisation échouée');
      }
    } catch (error) {
      console.error('Error initializing demo accounts:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser les comptes démo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsInitializing(false);
    }
  };

  const handleQuickLogin = async (account: DemoAccount) => {
    try {
      // 1) Tentative de connexion
      let { data, error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: "demo123"
      });

      // 2) Si échec pour identifiants invalides, initialiser et réessayer
      if (error && /invalid login credentials/i.test(error.message)) {
        const initialized = await initializeDemoAccounts();
        if (initialized) {
          const retry = await supabase.auth.signInWithPassword({
            email: account.email,
            password: "demo123"
          });
          data = retry.data;
          error = retry.error;
        }
      }

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter au compte démo.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: `Connecté en tant que ${account.name} (${account.type})`,
      });

      // Navigation intelligente vers le dashboard approprié
      switch (account.role) {
        case 'patient':
          navigate('/dashboard');
          break;
        case 'doctor':
          navigate('/demo/doctor');
          break;
        case 'specialist':
          navigate('/demo/specialist');
          break;
        case 'nurse':
        case 'midwife':
        case 'physiotherapist':
        case 'psychologist':
        case 'ophthalmologist':
        case 'anesthesiologist':
          navigate('/dashboard/professional');
          break;
        case 'pharmacist':
        case 'pharmacy':
          navigate('/dashboard/professional');
          break;
        case 'laboratory_technician':
        case 'radiologist':
        case 'radiology_center':
          navigate('/dashboard/professional');
          break;
        case 'admin':
        case 'hospital_admin':
        case 'clinic_admin':
          navigate('/admin');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during quick login:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive"
      });
    }
  };

  return (
    <SuperAdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Comptes Démo</h1>
            <p className="text-muted-foreground">
              Accédez rapidement aux différents types de comptes pour tester les fonctionnalités de l'application
            </p>
          </div>
          <Button 
            onClick={initializeDemoAccounts}
            disabled={isInitializing}
            variant="outline"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Initialisation...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Initialiser les comptes
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <Card key={account.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${account.badgeColor} p-3 rounded-lg text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{account.type}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {account.name}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {account.description}
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-mono text-xs">
                          {account.email}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        🔗 Dashboard: <span className="font-mono text-primary">
                          {account.role === 'doctor' ? '/demo/doctor' : 
                           account.role === 'specialist' ? '/demo/specialist' :
                           account.role === 'patient' ? '/dashboard' : 
                           '/dashboard/professional'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleQuickLogin(account)}
                    className="w-full"
                    variant="default"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion rapide
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Les comptes démo sont pré-configurés avec des données fictives pour tester toutes les fonctionnalités</p>
            <p>• La connexion rapide vous déconnecte automatiquement de votre session super admin</p>
            <p>• Vous pouvez revenir à votre compte super admin à tout moment en vous reconnectant</p>
            <p>• Les données créées dans les comptes démo peuvent être réinitialisées à tout moment</p>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}

function Info({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
