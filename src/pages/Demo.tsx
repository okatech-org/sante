import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Clock, CheckCircle2, Info, ArrowLeft, MapPin, Home, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import logoSante from "@/assets/logo_sante.png";

type DemoStatus = 'active' | 'testing' | 'temporary';

interface SogaraAccount {
  title: string;
  email: string;
  password: string;
  status: string;
  badges: string[];
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
}

const Demo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sogaraAccounts: SogaraAccount[] = [
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
  ];

  const demoAccounts: DemoAccount[] = [
    {
      id: 'patient',
      title: 'demo.account.patient',
      email: 'patient.demo@sante.ga',
      password: 'Patient2025!',
      icon: User,
      target: '/dashboard/patient',
      color: 'primary',
      status: 'active',
      statusLabel: t('demo.status.active')
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
      statusLabel: t('demo.status.active')
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
      statusLabel: t('demo.status.testing')
    },
    {
      id: 'pharmacy',
      title: 'demo.account.pharmacy',
      email: 'pharmacie.demo@sante.ga',
      password: 'Pharmacy2025!',
      icon: User,
      target: '/dashboard/professional',
      color: 'warning',
      status: 'testing',
      statusLabel: t('demo.status.testing')
    },
    {
      id: 'laboratory',
      title: 'demo.account.laboratory',
      email: 'labo.demo@sante.ga',
      password: 'Lab2025!',
      icon: User,
      target: '/dashboard/professional',
      color: 'primary',
      status: 'testing',
      statusLabel: t('demo.status.testing')
    },
    {
      id: 'hospital_admin',
      title: 'demo.account.hospitalAdmin',
      email: 'admin.hopital@sante.ga',
      password: 'Hospital2025!',
      icon: User,
      target: '/admin',
      color: 'secondary',
      status: 'temporary',
      statusLabel: t('demo.status.temporary')
    },
    {
      id: 'minister',
      title: 'demo.account.minister',
      email: 'ministre@sante.gouv.ga',
      password: 'Ministre2025!',
      icon: User,
      target: '/ministry/dashboard',
      color: 'accent',
      status: 'active',
      statusLabel: t('demo.status.active')
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

      {/* Establishment Card */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden border-2 hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10 shadow-lg">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">{t('demo.cmstSogara')}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{t('demo.location')}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {t('demo.demo')}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <Badge variant="outline">{t('demo.category')}</Badge>
                <Badge variant="outline" className="gap-1">
                  <User className="h-3 w-3" />
                  4 {t('common.accounts')}
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 h-12"
                  onClick={() => navigate('/establishment/cmst-sogara/public')}
                >
                  <Home className="h-4 w-4" />
                  {t('demo.homePage')}
                </Button>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 gap-2 h-12">
                      <LogIn className="h-4 w-4" />
                      {t('demo.accessAccounts')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{t('demo.modalTitle')}</DialogTitle>
                      <DialogDescription>{t('demo.modalDescription')}</DialogDescription>
                    </DialogHeader>

                    {/* Demo Accounts Grid in Modal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {sogaraAccounts.map((account, index) => (
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
                                  <Badge variant="outline" className="text-xs">
                                    {t('demo.demo')}
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
                            onClick={() => handleQuickLogin(account.email, account.password)}
                          >
                            <Clock className="h-4 w-4" />
                            {t('demo.quickLogin')}
                          </Button>
                        </Card>
                      ))}
                    </div>

                    {/* Important Info in Modal */}
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
        </div>
      </section>

      {/* Other Demo Accounts */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Autres comptes de démonstration</h2>
            <p className="text-muted-foreground">Testez différents rôles sur la plateforme SANTE.GA</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <Card key={account.id} className="p-6 hover:shadow-xl transition-all duration-300 border-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{t(account.title)}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {account.statusLabel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="text-xs text-muted-foreground font-mono">{account.email}</div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{t('demo.password')}</p>
                      <code className="text-xs font-mono">{account.password}</code>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => {
                      sessionStorage.setItem('demoAccount', JSON.stringify({
                        email: account.email,
                        password: account.password
                      }));
                      if (account.id === 'patient') {
                        navigate('/login/patient');
                      } else if (account.id === 'minister') {
                        navigate('/ministry/login');
                      } else {
                        navigate('/login/professional');
                      }
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {t('demo.quickLogin')}
                  </Button>
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
