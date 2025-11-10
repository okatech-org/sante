import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Clock, CheckCircle2, Info, ArrowLeft, MapPin, Home, LogIn, Pill, TestTube, Shield, Sparkles, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import logoSante from "@/assets/logo_sante.png";

type DemoStatus = 'active' | 'testing' | 'temporary';

interface EstablishmentAccount {
  title: string;
  email: string;
  password: string;
  status: string;
  badges: string[];
}

interface Establishment {
  id: string;
  name: string;
  location: string;
  category: string;
  icon: any;
  accounts: EstablishmentAccount[];
  available: boolean;
  color: string;
}

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
  available: boolean;
}

const Demo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const establishments: Establishment[] = [
    {
      id: 'ministere-sante',
      name: 'Ministère de la Santé',
      location: 'Libreville, Gabon',
      category: 'Administration Publique',
      icon: Shield,
      available: true,
      color: 'from-purple-500/10 via-purple-400/5',
      accounts: [
        {
          title: "adminAccount",
          email: "ministre@sante.gouv.ga",
          password: "Ministre2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        },
        {
          title: "doctorAccount",
          email: "dg.sante@gouv.ga",
          password: "DG2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        }
      ]
    },
    {
      id: 'cmst-sogara',
      name: 'CMST SOGARA',
      location: 'Libreville, Gabon',
      category: 'Centre Médical',
      icon: Building2,
      available: true,
      color: 'from-blue-500/10 via-blue-400/5',
      accounts: [
        {
          title: "adminAccount",
          email: "sogara.demo@sante.ga",
          password: "Sogara2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        },
        {
          title: "doctorAccount",
          email: "dr.nzenze@sogara.sante.ga",
          password: "Doctor2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        },
        {
          title: "nurseAccount",
          email: "m.bounda@sogara.sante.ga",
          password: "Nurse2025!",
          status: "active",
          badges: ["readOnly", "active"]
        },
        {
          title: "receptionAccount",
          email: "p.okandze@sogara.sante.ga",
          password: "Reception2025!",
          status: "active",
          badges: ["readOnly", "active"]
        }
      ]
    },
    {
      id: 'pharmacie-centrale',
      name: 'Pharmacie Centrale',
      location: 'Libreville, Gabon',
      category: 'Pharmacie',
      icon: Pill,
      available: true,
      color: 'from-green-500/10 via-green-400/5',
      accounts: [
        {
          title: "adminAccount",
          email: "pharmacie.demo@sante.ga",
          password: "Pharmacy2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        },
        {
          title: "doctorAccount",
          email: "pharmacien.demo@sante.ga",
          password: "Pharma2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        }
      ]
    },
    {
      id: 'chu-libreville',
      name: 'CHU Libreville',
      location: 'Libreville, Gabon',
      category: 'Centre Hospitalier',
      icon: Building2,
      available: false,
      color: 'from-muted/20 via-muted/10',
      accounts: [
        {
          title: "adminAccount",
          email: "admin.hopital@sante.ga",
          password: "Hospital2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        },
        {
          title: "doctorAccount",
          email: "directeur.chu@sante.ga",
          password: "CHU2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        }
      ]
    },
    {
      id: 'laboratoire-national',
      name: 'Laboratoire National',
      location: 'Libreville, Gabon',
      category: 'Laboratoire d\'analyses',
      icon: TestTube,
      available: false,
      color: 'from-muted/20 via-muted/10',
      accounts: [
        {
          title: "adminAccount",
          email: "labo.demo@sante.ga",
          password: "Lab2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        },
        {
          title: "doctorAccount",
          email: "biologiste.demo@sante.ga",
          password: "Bio2025!",
          status: "active",
          badges: ["fullAccess", "active"]
        }
      ]
    }
  ];

  const individualAccounts: DemoAccount[] = [
    {
      id: 'patient',
      title: 'demo.account.patient',
      email: 'patient.demo@sante.ga',
      password: 'Patient2025!',
      icon: User,
      target: '/dashboard/patient',
      color: 'primary',
      status: 'active',
      statusLabel: t('demo.status.active'),
      available: true
    },
    {
      id: 'doctor',
      title: 'demo.account.doctor',
      email: 'dr.demo@sante.ga',
      password: 'Doctor2025!',
      icon: User,
      target: '/professional/doctor-dashboard',
      color: 'secondary',
      status: 'active',
      statusLabel: t('demo.status.active'),
      available: true
    },
    {
      id: 'nurse',
      title: 'demo.account.nurse',
      email: 'infirmier.demo@sante.ga',
      password: 'Nurse2025!',
      icon: User,
      target: '/dashboard/professional',
      color: 'accent',
      status: 'testing',
      statusLabel: t('demo.status.testing'),
      available: false
    }
  ];

  const handleQuickLogin = (email: string, password: string, targetId?: string) => {
    sessionStorage.setItem('demoAccount', JSON.stringify({
      email,
      password
    }));
    if (targetId === 'ministere-sante') {
      navigate('/ministry/login');
    } else {
      navigate('/login/professional');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background avec pattern subtil et animations - identique à Landing */}
      <div className="fixed inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20 animate-fade-in">
        <div 
          className="absolute inset-0 opacity-[0.03] animate-pulse" 
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px), radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animationDuration: '4s'
          }}
        />
      </div>

      {/* Header Navigation avec effet glassmorphism - identique à Landing */}
      <header className={`fixed top-0 w-full z-[1100] border-b transition-all duration-500 ${
        scrolled 
          ? 'bg-card/95 border-border/60 shadow-lg backdrop-blur-2xl' 
          : 'bg-card/60 border-border/40 backdrop-blur-xl shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover-scale group">
              <img 
                src={logoSante} 
                alt="SANTE.GA Logo" 
                className="h-16 w-auto object-contain group-hover:scale-110 transition-transform"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-foreground">SANTE</span>
                  <span className="text-primary">.GA</span>
                </h1>
                <p className="text-xs text-muted-foreground">{t('landing.footer.tagline')}</p>
              </div>
            </Link>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />
              <Button 
                variant="outline" 
                className="hover-scale" 
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('demo.returnHome')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content with padding for fixed header */}
      <div className="relative pt-20">
        {/* Hero Section - Style Landing */}
        <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm animate-scale-in shadow-lg">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-foreground">{t('demo.environment')}</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in">
              {t('demo.title')}{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t('demo.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-8 text-muted-foreground max-w-4xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
              {t('demo.subtitle')}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-success/10 border border-success/20">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="font-medium">{t('demo.badge.instant')}</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                <Lock className="w-5 h-5 text-primary" />
                <span className="font-medium">{t('demo.badge.fictional')}</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/10 border border-secondary/20">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="font-medium">{t('demo.badge.secure')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Establishments Section */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {establishments.map((establishment) => {
                const EstIcon = establishment.icon;
                return (
                  <Card 
                    key={establishment.id} 
                    className={`group overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl ${
                      establishment.available 
                        ? 'hover:-translate-y-2 cursor-pointer' 
                        : 'opacity-60'
                    }`}
                  >
                    <div className={`bg-gradient-to-br ${establishment.color} to-background p-8 relative`}>
                      {!establishment.available && (
                        <Badge className="absolute top-4 right-4 bg-muted text-muted-foreground shadow-lg">
                          {t('demo.comingSoon')}
                        </Badge>
                      )}
                      
                      <div className="mb-6">
                        <div className={`inline-flex p-4 rounded-2xl shadow-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                          establishment.available 
                            ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                            : 'bg-muted/30'
                        }`}>
                          <EstIcon className={`h-10 w-10 ${
                            establishment.available 
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        
                        <h2 className={`text-2xl font-bold mb-2 ${
                          establishment.available 
                            ? 'text-foreground' 
                            : 'text-muted-foreground'
                        }`}>
                          {establishment.name}
                        </h2>
                        
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{establishment.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="outline" className="text-xs font-medium">{establishment.category}</Badge>
                        <Badge variant="outline" className="text-xs gap-1 font-medium">
                          <User className="h-3 w-3" />
                          {establishment.accounts.length} {t('common.accounts')}
                        </Badge>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2 h-12 hover-scale"
                          onClick={() => navigate(establishment.id === 'ministere-sante' ? '/ministry' : `/establishment/${establishment.id}/public`)}
                          disabled={!establishment.available}
                        >
                          <Home className="h-4 w-4" />
                          {t('demo.homePage')}
                        </Button>
                        
                        <Dialog open={openModalId === establishment.id} onOpenChange={(open) => setOpenModalId(open ? establishment.id : null)}>
                          <DialogTrigger asChild>
                            <Button 
                              className="flex-1 gap-2 h-12 hover-scale shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary/90"
                              disabled={!establishment.available}
                            >
                              <LogIn className="h-4 w-4" />
                              {t('demo.accessAccounts')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-3xl flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-primary/10">
                                  <EstIcon className="h-7 w-7 text-primary" />
                                </div>
                                <span>{establishment.name}</span>
                              </DialogTitle>
                              <DialogDescription className="text-base">{t('demo.modalDescription')}</DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                              {establishment.accounts.map((account, index) => (
                                <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                                  <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                                      <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-bold text-lg text-foreground mb-2">
                                        {t(`demo.${account.title}`)}
                                      </h3>
                                      <div className="flex gap-2">
                                        <Badge variant="secondary" className="text-xs gap-1">
                                          <CheckCircle2 className="h-3 w-3" />
                                          {t(`demo.${account.status}`)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
                                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <span className="text-muted-foreground font-mono text-xs break-all">{account.email}</span>
                                    </div>
                                    
                                    <div className="p-4 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50">
                                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        {t('demo.password')}
                                      </p>
                                      <code className="text-base font-mono text-foreground font-bold">{account.password}</code>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                      {account.badges.map((badge, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {t(`demo.${badge}`)}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <Button 
                                    className="w-full gap-2 h-12 hover-scale shadow-lg bg-gradient-to-r from-accent to-accent/90"
                                    onClick={() => handleQuickLogin(account.email, account.password, establishment.id)}
                                  >
                                    <Clock className="h-4 w-4" />
                                    {t('demo.quickLogin')}
                                  </Button>
                                </Card>
                              ))}
                            </div>

                            <Card className="mt-8 bg-gradient-to-br from-muted/50 to-muted/20 border-2">
                              <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 rounded-lg bg-primary/10">
                                    <Info className="h-5 w-5 text-primary" />
                                  </div>
                                  <h4 className="font-bold text-lg text-foreground">{t('demo.info.title')}</h4>
                                </div>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                  <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                    <span>{t('demo.info.demoDesc')}</span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                    <span>{t('demo.info.fictionalDesc')}</span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                    <span>{t('demo.info.quickLoginDesc')}</span>
                                  </li>
                                </ul>
                              </div>
                            </Card>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Individual Demo Accounts */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Comptes individuels
              </h2>
              <p className="text-xl text-muted-foreground">Testez différents rôles individuels sur la plateforme</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {individualAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <Card 
                    key={account.id} 
                    className={`group p-8 transition-all duration-500 border-2 ${
                      account.available 
                        ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer' 
                        : 'opacity-60'
                    }`}
                  >
                    <div className="relative">
                      {!account.available && (
                        <Badge className="absolute -top-4 -right-4 bg-muted text-muted-foreground text-xs shadow-lg">
                          {t('demo.comingSoon')}
                        </Badge>
                      )}
                      
                      <div className="mb-6">
                        <div className={`inline-flex p-4 rounded-2xl shadow-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                          account.available 
                            ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                            : 'bg-muted/30'
                        }`}>
                          <Icon className={`h-8 w-8 ${
                            account.available 
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        
                        <h3 className={`font-bold text-xl mb-2 ${
                          account.available 
                            ? 'text-foreground' 
                            : 'text-muted-foreground'
                        }`}>
                          {t(account.title)}
                        </h3>
                        
                        <Badge variant="secondary" className="text-xs">
                          {account.statusLabel}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className={`text-xs font-mono p-3 rounded-lg bg-muted/50 ${
                          account.available 
                            ? 'text-muted-foreground' 
                            : 'text-muted-foreground/60'
                        }`}>
                          {account.email}
                        </div>
                        
                        <div className="p-4 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1 font-semibold">{t('demo.password')}</p>
                          <code className="text-sm font-mono font-bold">{account.password}</code>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full gap-2 h-12 hover-scale shadow-lg bg-gradient-to-r from-accent to-accent/90"
                        disabled={!account.available}
                        onClick={() => {
                          if (account.available) {
                            sessionStorage.setItem('demoAccount', JSON.stringify({
                              email: account.email,
                              password: account.password
                            }));
                            if (account.id === 'patient') {
                              navigate('/login/patient');
                            } else {
                              navigate('/login/professional');
                            }
                          }
                        }}
                      >
                        <Clock className="h-4 w-4" />
                        {t('demo.quickLogin')}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Style Landing */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {t('demo.cta.title')}
            </h3>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('demo.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                className="h-14 px-8 text-lg hover-scale shadow-2xl bg-gradient-to-r from-primary to-primary/90"
                onClick={() => navigate('/register/patient')}
              >
                {t('demo.cta.patient')}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg hover-scale"
                onClick={() => navigate('/register/professional')}
              >
                {t('demo.cta.professional')}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Demo;
