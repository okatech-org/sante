import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Stethoscope, User, Pill, TestTube, Shield, UserCog, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type DemoStatus = 'active' | 'testing' | 'temporary';

interface DemoAccount {
  id: string;
  title: string;
  email: string;
  password: string;
  icon: any;
  target: string;
  color: string;
  status: DemoStatus;
  statusLabel: string;
}

export default function Demo() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  console.log('Demo page mounted');

  const demoAccounts: DemoAccount[] = [
    {
      id: 'patient',
      title: 'Patient',
      email: 'patient.demo@sante.ga',
      password: 'Patient2025!',
      icon: User,
      target: '/dashboard/patient',
      color: 'primary',
      status: 'active',
      statusLabel: 'Actif'
    },
    {
      id: 'doctor',
      title: 'Médecin',
      email: 'dr.demo@sante.ga',
      password: 'Doctor2025!',
      icon: Stethoscope,
      target: '/professional/doctor-dashboard',
      color: 'secondary',
      status: 'active',
      statusLabel: 'Actif'
    },
    {
      id: 'nurse',
      title: 'Infirmier(ère)',
      email: 'infirmier.demo@sante.ga',
      password: 'Nurse2025!',
      icon: Users,
      target: '/dashboard/professional',
      color: 'accent',
      status: 'testing',
      statusLabel: 'En test'
    },
    {
      id: 'sogara_admin',
      title: 'Administration CMST SOGARA',
      email: 'sogara.demo@sante.ga',
      password: 'Sogara2025!',
      icon: Building2,
      target: '/establishments/sogara/admin',
      color: 'success',
      status: 'active',
      statusLabel: 'Actif'
    },
    {
      id: 'pharmacy',
      title: 'Pharmacie',
      email: 'pharmacie.demo@sante.ga',
      password: 'Pharmacy2025!',
      icon: Pill,
      target: '/dashboard/professional',
      color: 'warning',
      status: 'testing',
      statusLabel: 'En test'
    },
    {
      id: 'laboratory',
      title: 'Laboratoire',
      email: 'labo.demo@sante.ga',
      password: 'Lab2025!',
      icon: TestTube,
      target: '/dashboard/professional',
      color: 'primary',
      status: 'testing',
      statusLabel: 'En test'
    },
    {
      id: 'hospital_admin',
      title: 'Administration Hôpital',
      email: 'admin.hopital@sante.ga',
      password: 'Hospital2025!',
      icon: UserCog,
      target: '/admin',
      color: 'secondary',
      status: 'temporary',
      statusLabel: 'Temporaire'
    },
    {
      id: 'minister',
      title: 'Ministère de la Santé',
      email: 'ministre@sante.gouv.ga',
      password: 'Ministre2025!',
      icon: Shield,
      target: '/ministry/dashboard',
      color: 'accent',
      status: 'active',
      statusLabel: 'Actif'
    }
  ];

  const getStatusBadgeVariant = (status: DemoStatus) => {
    switch (status) {
      case 'active':
        return 'default'; // Green/Primary
      case 'testing':
        return 'secondary'; // Blue/Secondary
      case 'temporary':
        return 'outline'; // Gray/Outline
      default:
        return 'default';
    }
  };

  const getStatusBadgeClass = (status: DemoStatus) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'testing':
        return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'temporary':
        return 'bg-muted text-muted-foreground border-border hover:bg-muted/80';
      default:
        return '';
    }
  };

  const handleQuickLogin = (account: typeof demoAccounts[0]) => {
    // Store demo account info in sessionStorage for auto-login
    sessionStorage.setItem('demoAccount', JSON.stringify({
      email: account.email,
      password: account.password,
      target: account.target
    }));
    
    // Navigate to appropriate login page
    if (account.id === 'patient') {
      navigate('/login/patient');
    } else if (account.id === 'minister') {
      navigate('/ministry/login');
    } else {
      navigate('/login/professional');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('demo.title') || 'Comptes de Démonstration'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('demo.subtitle') || 'Testez SANTE.GA avec nos comptes de démonstration. Cliquez sur un compte pour vous connecter automatiquement.'}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Accounts Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            const colorClasses = {
              primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'hover:border-primary/30' },
              secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'hover:border-secondary/30' },
              accent: { bg: 'bg-accent/10', text: 'text-accent', border: 'hover:border-accent/30' },
              success: { bg: 'bg-success/10', text: 'text-success', border: 'hover:border-success/30' },
              warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'hover:border-warning/30' }
            };
            const colors = colorClasses[account.color as keyof typeof colorClasses];
            
            return (
              <Card 
                key={account.id}
                className={`group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-border/40 ${colors.border}`}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <CardTitle className="text-base leading-tight">{account.title}</CardTitle>
                        <Badge 
                          className={`text-xs font-medium ${getStatusBadgeClass(account.status)} flex-shrink-0`}
                        >
                          {account.statusLabel}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs break-all mt-1">
                        {account.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Mot de passe:</p>
                    <code className="text-xs font-mono text-foreground break-all">{account.password}</code>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleQuickLogin(account)}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Connexion rapide
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(account.target)}
                    >
                      Accéder au dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Informations importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-2">Légende des statuts :</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success/10 text-success border-success/20">Actif</Badge>
                    <span className="text-xs">Compte pleinement fonctionnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-warning/10 text-warning border-warning/20">En test</Badge>
                    <span className="text-xs">Fonctionnalités en développement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-muted text-muted-foreground border-border">Temporaire</Badge>
                    <span className="text-xs">Accès limité dans le temps</span>
                  </div>
                </div>
              </div>
              <p>
                • Ces comptes sont uniquement à des fins de démonstration et de test
              </p>
              <p>
                • Les données sont fictives et peuvent être réinitialisées à tout moment
              </p>
              <p>
                • Pour créer un véritable compte utilisateur, utilisez les pages d'inscription standard
              </p>
              <p>
                • La "Connexion rapide" remplit automatiquement les champs de connexion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
