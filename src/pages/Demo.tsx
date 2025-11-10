import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Clock, CheckCircle2, Info, ArrowLeft, MapPin, Home, LogIn, Pill, TestTube, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const establishments: Establishment[] = [
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

  const handleQuickLogin = (email: string, password: string) => {
    sessionStorage.setItem('demoAccount', JSON.stringify({
      email,
      password
    }));
    navigate('/login/professional');
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
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('demo.returnHome')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-2 gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {t('demo.environment')}
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('demo.title')}
            <span className="block sm:inline mt-2 sm:mt-0 sm:ml-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('demo.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl mb-4 text-muted-foreground max-w-3xl mx-auto">
            {t('demo.subtitle')}
          </p>
        </div>
      </section>

      {/* Establishments Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {establishments.map((establishment) => {
              const EstIcon = establishment.icon;
              return (
                <Card 
                  key={establishment.id} 
                  className={`overflow-hidden border-2 transition-all duration-300 ${
                    establishment.available 
                      ? 'hover:shadow-2xl' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`bg-gradient-to-r ${establishment.color} to-background p-6 relative`}>
                    {!establishment.available && (
                      <Badge className="absolute top-4 right-4 bg-muted text-muted-foreground">
                        {t('demo.comingSoon')}
                      </Badge>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl shadow-lg ${
                          establishment.available 
                            ? 'bg-primary/10' 
                            : 'bg-muted/30'
                        }`}>
                          <EstIcon className={`h-8 w-8 ${
                            establishment.available 
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <h2 className={`text-2xl font-bold mb-1 ${
                            establishment.available 
                              ? 'text-foreground' 
                              : 'text-muted-foreground'
                          }`}>
                            {establishment.name}
                          </h2>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{establishment.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <Badge variant="outline" className="text-xs">{establishment.category}</Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <User className="h-3 w-3" />
                        {establishment.accounts.length} {t('common.accounts')}
                      </Badge>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 h-11"
                        onClick={() => navigate(`/establishment/${establishment.id}/public`)}
                        disabled={!establishment.available}
                      >
                        <Home className="h-4 w-4" />
                        {t('demo.homePage')}
                      </Button>
                      
                      <Dialog open={openModalId === establishment.id} onOpenChange={(open) => setOpenModalId(open ? establishment.id : null)}>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex-1 gap-2 h-11"
                            disabled={!establishment.available}
                          >
                            <LogIn className="h-4 w-4" />
                            {t('demo.accessAccounts')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-3">
                              <EstIcon className="h-6 w-6 text-primary" />
                              {t('demo.modalTitle')} - {establishment.name}
                            </DialogTitle>
                            <DialogDescription>{t('demo.modalDescription')}</DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {establishment.accounts.map((account, index) => (
                              <Card key={index} className="p-6 hover:shadow-lg transition-all border-2">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                      <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg text-foreground">
                                        {t(`demo.${account.title}`)}
                                      </h3>
                                      <div className="flex gap-2 mt-1">
                                        <Badge variant="secondary" className="text-xs gap-1">
                                          <CheckCircle2 className="h-3 w-3" />
                                          {t(`demo.${account.status}`)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground font-mono text-xs">{account.email}</span>
                                  </div>
                                  
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                      {t('demo.password')}
                                    </p>
                                    <code className="text-sm font-mono text-foreground">{account.password}</code>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {account.badges.map((badge, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {t(`demo.${badge}`)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <Button 
                                  className="w-full gap-2"
                                  onClick={() => {
                                    sessionStorage.setItem('demoAccount', JSON.stringify({
                                      email: account.email,
                                      password: account.password
                                    }));
                                    if (establishment.id === 'ministere-sante') {
                                      navigate('/ministry/login');
                                    } else {
                                      navigate('/login/professional');
                                    }
                                  }}
                                >
                                  <Clock className="h-4 w-4" />
                                  {t('demo.quickLogin')}
                                </Button>
                              </Card>
                            ))}
                          </div>

                          <Card className="mt-6 bg-muted/20 border-muted">
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-4">
                                <Info className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold text-foreground">{t('demo.info.title')}</h4>
                              </div>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                  <span>{t('demo.info.demoDesc')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                  <span>{t('demo.info.fictionalDesc')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
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
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Comptes individuels</h2>
            <p className="text-muted-foreground">Testez différents rôles individuels sur la plateforme</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {individualAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <Card 
                  key={account.id} 
                  className={`p-6 transition-all duration-300 border-2 ${
                    account.available 
                      ? 'hover:shadow-xl' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="relative">
                    {!account.available && (
                      <Badge className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-xs">
                        {t('demo.comingSoon')}
                      </Badge>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          account.available 
                            ? 'bg-primary/10' 
                            : 'bg-muted/30'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            account.available 
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold text-base ${
                            account.available 
                              ? 'text-foreground' 
                              : 'text-muted-foreground'
                          }`}>
                            {t(account.title)}
                          </h3>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {account.statusLabel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className={`text-xs font-mono ${
                        account.available 
                          ? 'text-muted-foreground' 
                          : 'text-muted-foreground/60'
                      }`}>
                        {account.email}
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">{t('demo.password')}</p>
                        <code className="text-xs font-mono">{account.password}</code>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
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
                      <Clock className="h-4 w-4 mr-2" />
                      {t('demo.quickLogin')}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-t bg-gradient-to-r from-muted/20 to-muted/5 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('demo.cta.title')}</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('demo.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80"
              onClick={() => navigate('/register/patient')}
            >
              {t('demo.cta.patient')}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/register/professional')}
            >
              {t('demo.cta.professional')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Demo;
