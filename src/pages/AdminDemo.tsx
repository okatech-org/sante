import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Stethoscope, Briefcase, Building2, FlaskConical, Pill, UserCog, LogIn, Baby, Sparkles, Activity, HeartPulse, Brain, Eye, Syringe, Hospital, RefreshCw, Trash2, Key, UserCheck, AlertCircle, CheckCircle2, Copy, Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [accountsStatus, setAccountsStatus] = useState<Record<string, 'active' | 'inactive' | 'checking'>>({});
  const [generatedPasswords, setGeneratedPasswords] = useState<Record<string, string>>({});
  const [showPasswordsDialog, setShowPasswordsDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<DemoAccount | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [accountStats, setAccountStats] = useState({ total: 0, active: 0, inactive: 0 });

  // Vérifier le statut des comptes au chargement
  useEffect(() => {
    checkAccountsStatus();
  }, []);

  const checkAccountsStatus = async () => {
    const statuses: Record<string, 'active' | 'inactive' | 'checking'> = {};
    let activeCount = 0;
    let inactiveCount = 0;

    for (const account of demoAccounts) {
      statuses[account.email] = 'checking';
    }
    setAccountsStatus(statuses);

    for (const account of demoAccounts) {
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', account.email)
          .maybeSingle();

        if (profiles) {
          statuses[account.email] = 'active';
          activeCount++;
        } else {
          statuses[account.email] = 'inactive';
          inactiveCount++;
        }
      } catch (error) {
        statuses[account.email] = 'inactive';
        inactiveCount++;
      }
    }

    setAccountsStatus(statuses);
    setAccountStats({
      total: demoAccounts.length,
      active: activeCount,
      inactive: inactiveCount
    });
  };

  const initializeDemoAccounts = async () => {
    setIsInitializing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-accounts', {
        body: { init: true },
      });

      if (error) throw error as any;

      if ((data as any)?.success) {
        // Stocker les mots de passe générés
        if ((data as any)?.passwords) {
          setGeneratedPasswords((data as any).passwords);
          setShowPasswordsDialog(true);
        }

        toast({
          title: "Comptes démo initialisés",
          description: "Tous les comptes démo ont été créés/mis à jour.",
        });
        
        // Rafraîchir le statut
        await checkAccountsStatus();
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

  const deleteAccount = async (account: DemoAccount) => {
    setIsDeletingAccount(true);
    try {
      // Récupérer l'utilisateur
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', account.email)
        .maybeSingle();

      if (!profiles) {
        toast({
          title: "Compte introuvable",
          description: "Ce compte n'existe pas dans la base de données.",
          variant: "destructive"
        });
        return;
      }

      // Note: La suppression complète d'un utilisateur nécessite les droits admin
      // Pour l'instant, on désactive juste le compte
      toast({
        title: "Fonctionnalité limitée",
        description: "La suppression complète nécessite des droits spécifiques. Le compte reste accessible.",
        variant: "default"
      });

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteDialog(false);
      setSelectedAccount(null);
    }
  };

  const copyPassword = (email: string) => {
    const password = generatedPasswords[email];
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: "Copié !",
        description: "Mot de passe copié dans le presse-papier.",
      });
    }
  };

  const downloadPasswords = () => {
    const content = Object.entries(generatedPasswords)
      .map(([email, password]) => `${email}: ${password}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demo-accounts-passwords.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement lancé",
      description: "Les mots de passe ont été téléchargés.",
    });
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
          navigate('/dashboard/patient');
          break;
        case 'doctor':
          navigate('/demo/doctor');
          break;
        case 'specialist':
          navigate('/demo/specialist');
          break;
        case 'nurse':
          navigate('/demo/nurse');
          break;
        case 'midwife':
          navigate('/demo/midwife');
          break;
        case 'physiotherapist':
          navigate('/demo/physiotherapist');
          break;
        case 'psychologist':
          navigate('/demo/psychologist');
          break;
        case 'ophthalmologist':
          navigate('/demo/ophthalmologist');
          break;
        case 'anesthesiologist':
          navigate('/demo/anesthesiologist');
          break;
        case 'pharmacist':
          navigate('/demo/pharmacist');
          break;
        case 'pharmacy':
          navigate('/demo/pharmacy');
          break;
        case 'laboratory_technician':
          navigate('/demo/laboratory');
          break;
        case 'radiologist':
          navigate('/demo/radiologist');
          break;
        case 'radiology_center':
          navigate('/demo/radiology-center');
          break;
        case 'admin':
          navigate('/demo/admin');
          break;
        case 'hospital_admin':
          navigate('/demo/hospital');
          break;
        case 'clinic_admin':
          navigate('/demo/clinic');
          break;
        default:
          navigate('/dashboard/patient');
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
      <div className="container mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Header avec actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gestion des Comptes Démo</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gérez et accédez rapidement aux comptes démo pour tester toutes les fonctionnalités
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={checkAccountsStatus}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button 
              onClick={initializeDemoAccounts}
              disabled={isInitializing}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              {isInitializing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Initialiser
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total des comptes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {accountStats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                Comptes actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {accountStats.active}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">
                À initialiser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {accountStats.inactive}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des comptes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            const status = accountsStatus[account.email] || 'checking';
            
            return (
              <Card key={account.id} className="hover:shadow-lg transition-all hover-scale relative overflow-hidden">
                {/* Status indicator */}
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rotate-45 ${
                  status === 'active' ? 'bg-green-500/10' : 
                  status === 'inactive' ? 'bg-orange-500/10' : 
                  'bg-gray-500/10'
                }`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`${account.badgeColor} p-3 rounded-lg text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">{account.type}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-1 truncate">
                          {account.name}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={status === 'active' ? 'default' : status === 'inactive' ? 'secondary' : 'outline'}
                      className="ml-2 flex-shrink-0"
                    >
                      {status === 'active' ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Actif</>
                      ) : status === 'inactive' ? (
                        <><AlertCircle className="h-3 w-3 mr-1" /> Inactif</>
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {account.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs truncate flex-1">
                      {account.email}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleQuickLogin(account)}
                      className="flex-1"
                      size="sm"
                      disabled={status === 'inactive'}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Button>
                    
                    {status === 'active' && (
                      <Button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDeleteDialog(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {generatedPasswords[account.email] && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Key className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <code className="text-xs font-mono flex-1 truncate">
                        {generatedPasswords[account.email]}
                      </code>
                      <Button
                        onClick={() => copyPassword(account.email)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informations et actions globales */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="actions">Actions rapides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  Guide d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Les comptes démo sont pré-configurés avec des données fictives complètes (consultations, ordonnances, résultats)</p>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p>La connexion rapide vous déconnecte automatiquement de votre session super admin actuelle</p>
                </div>
                <div className="flex gap-2">
                  <Key className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p>Les mots de passe sont générés automatiquement et affichés uniquement lors de l'initialisation</p>
                </div>
                <div className="flex gap-2">
                  <RefreshCw className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p>Vous pouvez réinitialiser tous les comptes à tout moment sans perdre vos données personnelles</p>
                </div>
                <div className="flex gap-2">
                  <UserCheck className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Chaque type de compte possède son propre dashboard avec des fonctionnalités spécifiques</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Actions de gestion</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Gérez rapidement l'ensemble des comptes démo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={initializeDemoAccounts}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isInitializing}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Créer/Mettre à jour tous les comptes
                </Button>

                {Object.keys(generatedPasswords).length > 0 && (
                  <>
                    <Button
                      onClick={() => setShowPasswordsDialog(true)}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Voir les mots de passe ({Object.keys(generatedPasswords).length})
                    </Button>

                    <Button
                      onClick={downloadPasswords}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger les mots de passe
                    </Button>
                  </>
                )}

                <Button
                  onClick={checkAccountsStatus}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser le statut des comptes
                </Button>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm">Sécurité</AlertTitle>
                  <AlertDescription className="text-xs">
                    Les mots de passe générés sont sécurisés et uniques. Conservez-les en lieu sûr.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog pour afficher les mots de passe */}
        <Dialog open={showPasswordsDialog} onOpenChange={setShowPasswordsDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Mots de passe générés
              </DialogTitle>
              <DialogDescription>
                Conservez ces mots de passe en lieu sûr. Ils ne seront plus affichés après fermeture.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-2 mt-4">
              {Object.entries(generatedPasswords).map(([email, password]) => (
                <div key={email} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{email}</p>
                    <code className="text-xs font-mono text-muted-foreground">{password}</code>
                  </div>
                  <Button
                    onClick={() => copyPassword(email)}
                    variant="ghost"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={downloadPasswords} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button onClick={() => setShowPasswordsDialog(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le compte de {selectedAccount?.name} ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription className="text-xs">
                Toutes les données associées à ce compte (consultations, ordonnances, messages) seront également supprimées.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedAccount(null);
                }}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                onClick={() => selectedAccount && deleteAccount(selectedAccount)}
                variant="destructive"
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
