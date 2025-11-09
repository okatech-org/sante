import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Stethoscope, User, Pill, TestTube, Shield, UserCog, ArrowRight, Sparkles, Lock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logoSante from "@/assets/logo_sante.png";

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
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl bg-card/95 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src={logoSante} alt="SANTE.GA" className="h-10 md:h-12 w-auto" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                SANTE.GA
              </span>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 backdrop-blur-sm animate-scale-in">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-foreground">Environnement de Démonstration</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            {t('demo.title') || 'Comptes de'}
            <span className="block sm:inline mt-2 sm:mt-0 sm:ml-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Démonstration
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl mb-4 text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('demo.subtitle') || 'Testez SANTE.GA avec nos comptes de démonstration. Cliquez sur un compte pour vous connecter automatiquement.'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Accès instantané</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <span>Données fictives</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" />
              <span>Environnement sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Accounts Grid */}
      <section className="relative py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                className={`group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-border/40 ${colors.border} animate-fade-in`}
                style={{ animationDelay: `${account.id === 'patient' ? '0.1' : account.id === 'doctor' ? '0.2' : account.id === 'nurse' ? '0.3' : account.id === 'sogara_admin' ? '0.4' : account.id === 'pharmacy' ? '0.5' : account.id === 'laboratory' ? '0.6' : account.id === 'hospital_admin' ? '0.7' : '0.8'}s` }}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`relative w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg}`} style={{ filter: 'blur(8px)' }} />
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
                  <div className="backdrop-blur-sm bg-muted/30 rounded-lg p-3 space-y-1 border border-border/20">
                    <p className="text-xs text-muted-foreground font-medium">Mot de passe:</p>
                    <code className="text-xs font-mono text-foreground break-all block bg-background/50 px-2 py-1 rounded">{account.password}</code>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      className={`w-full group/btn relative overflow-hidden ${
                        account.id === 'patient' || account.id === 'sogara_admin' || account.id === 'minister' ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70' :
                        account.id === 'doctor' ? 'bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70' :
                        'bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70'
                      }`}
                      onClick={() => handleQuickLogin(account)}
                    >
                      <ArrowRight className="h-4 w-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                      <span>Connexion rapide</span>
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full hover:bg-muted/50"
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
        <div className="mt-12 max-w-5xl mx-auto">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-border/40 shadow-xl animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                Informations importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-4 border border-border/20">
                <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Légende des statuts :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                    <Badge className="bg-success/10 text-success border-success/20">Actif</Badge>
                    <span className="text-xs">Pleinement fonctionnel</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                    <Badge className="bg-warning/10 text-warning border-warning/20">En test</Badge>
                    <span className="text-xs">En développement</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                    <Badge className="bg-muted text-muted-foreground border-border">Temporaire</Badge>
                    <span className="text-xs">Accès limité</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/0 border border-primary/10">
                  <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Comptes de démonstration</p>
                    <p className="text-xs">Uniquement à des fins de test et de découverte de la plateforme</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/0 border border-secondary/10">
                  <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Données fictives</p>
                    <p className="text-xs">Les informations peuvent être réinitialisées à tout moment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-accent/5 to-accent/0 border border-accent/10">
                  <ArrowRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Connexion rapide</p>
                    <p className="text-xs">Remplit automatiquement les champs de connexion pour un accès instantané</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-warning/5 to-warning/0 border border-warning/10">
                  <Users className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Compte réel</p>
                    <p className="text-xs">Utilisez les pages d'inscription standard pour créer un véritable compte</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-t bg-gradient-to-r from-muted/20 to-muted/5">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à créer votre compte ?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Inscrivez-vous gratuitement et accédez à tous les services de santé du Gabon
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => navigate('/register/patient')}
            >
              Créer un compte Patient
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/register/professional')}
            >
              Inscription Professionnel
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
