import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Stethoscope, 
  Calendar, 
  Users,
  FileText,
  TrendingUp,
  Shield,
  Clock,
  CreditCard,
  BarChart,
  Video,
  Smartphone,
  Award,
  Check,
  Menu,
  MapPin,
  Mail,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import logoSante from "@/assets/logo_sante.png";
import agendaImage from "@/assets/pro-agenda-management.jpg";
import recordsImage from "@/assets/pro-digital-records.jpg";
import teleconsultImage from "@/assets/pro-teleconsultation.jpg";
import paymentImage from "@/assets/pro-payment-system.jpg";

export default function ForProfessionals() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const benefits = [
    {
      icon: Calendar,
      image: agendaImage,
      colorTheme: "primary", // Turquoise
      title: "Gestion d'Agenda Intelligente",
      description: "Optimisez votre planning avec notre système de gestion de rendez-vous automatisé",
      features: [
        "Calendrier synchronisé en temps réel",
        "Rappels automatiques aux patients",
        "Gestion des annulations et reprogrammations",
        "Statistiques de présence"
      ]
    },
    {
      icon: Users,
      image: recordsImage,
      colorTheme: "secondary", // Bleu électrique
      title: "Dossiers Patients Numériques",
      description: "Accédez instantanément à l'historique complet de vos patients",
      features: [
        "Historique médical centralisé",
        "Ordonnances électroniques",
        "Résultats d'examens intégrés",
        "Notes de consultation sécurisées"
      ]
    },
    {
      icon: Video,
      image: teleconsultImage,
      colorTheme: "accent", // Rose vibrant
      title: "Téléconsultation Intégrée",
      description: "Consultez vos patients à distance avec notre solution de vidéoconférence sécurisée",
      features: [
        "Vidéo HD cryptée",
        "Prescriptions en ligne",
        "Facturation automatique",
        "Compatible CNAMGS"
      ]
    },
    {
      icon: CreditCard,
      image: paymentImage,
      colorTheme: "warning", // Jaune doré
      title: "Paiements Simplifiés",
      description: "Recevez vos paiements rapidement et suivez votre comptabilité facilement",
      features: [
        "Paiement en ligne sécurisé",
        "Intégration CNAMGS",
        "Facturation automatique",
        "Rapports financiers détaillés"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: BarChart,
      title: "Statistiques & Analyses",
      description: "Suivez vos performances avec des tableaux de bord détaillés"
    },
    {
      icon: Shield,
      title: "Sécurité Médicale",
      description: "Conformité RGPD et protection maximale des données patients"
    },
    {
      icon: Smartphone,
      title: "Application Mobile",
      description: "Gérez votre activité depuis votre smartphone ou tablette"
    },
    {
      icon: Award,
      title: "Visibilité Accrue",
      description: "Augmentez votre patientèle grâce à notre annuaire national"
    },
    {
      icon: Clock,
      title: "Gain de Temps",
      description: "Automatisez les tâches administratives chronophages"
    },
    {
      icon: TrendingUp,
      title: "Développement",
      description: "Formation continue et outils d'aide à la décision médicale"
    }
  ];

  const targetAudience = [
    {
      title: "Médecins",
      description: "Généralistes et spécialistes de toutes disciplines",
      icon: Stethoscope
    },
    {
      title: "Établissements",
      description: "Hôpitaux, cliniques et centres médicaux",
      icon: Users
    },
    {
      title: "Pharmacies",
      description: "Pharmacies et officines",
      icon: FileText
    }
  ];

  const pricingPlans = [
    {
      name: "Essentiel",
      price: "49 500",
      period: "FCFA/mois",
      trial: "Essai 7 jours gratuit",
      colorTheme: "secondary", // Bleu électrique
      features: [
        "Agenda en ligne",
        "Gestion de 50 patients",
        "Paiements sécurisés",
        "Support standard"
      ]
    },
    {
      name: "Professionnel",
      price: "149 500",
      period: "FCFA/mois",
      trial: "Essai 14 jours gratuit",
      colorTheme: "primary", // Turquoise
      features: [
        "Tous les avantages Essentiel",
        "Patients illimités",
        "Téléconsultation intégrée",
        "Dossiers médicaux",
        "Support prioritaire",
        "Statistiques avancées"
      ],
      recommended: true
    },
    {
      name: "Labo et Pharmacie",
      price: "249 000",
      period: "FCFA/mois",
      trial: "Essai 7 jours gratuit",
      colorTheme: "accent", // Rose vibrant
      features: [
        "Tous les avantages Professionnel",
        "Gestion de stock",
        "Gestion de commandes",
        "Analyses de laboratoire",
        "Multi-utilisateurs",
        "Support prioritaire"
      ]
    },
    {
      name: "Grande structures",
      price: "Sur devis",
      period: "hôpital, clinique etc...",
      colorTheme: "warning", // Jaune doré
      features: [
        "Solutions personnalisées",
        "Multi-praticiens illimités",
        "API et intégrations complètes",
        "Formation sur mesure",
        "Support dédié 24/7",
        "Infrastructure dédiée"
      ]
    }
  ];

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
      <header className="fixed top-0 w-full z-[1100] border-b transition-all duration-500 bg-card/95 border-border/60 shadow-lg backdrop-blur-2xl">
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
                <p className="text-xs text-muted-foreground">{t('landing.footer.tagline') || "Votre santé, notre priorité"}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="story-link font-medium text-foreground/80 hover:text-primary transition-all duration-300 py-2"
              >
                Accueil
              </Link>
              <Link 
                to="/for-professionals" 
                className="font-medium text-primary py-2"
              >
                Professionnels
              </Link>
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <ThemeToggle />
                <Link to="/login/pro">
                  <Button variant="outline" className="shadow-md">
                    Connexion Pro
                  </Button>
                </Link>
                <Link to="/register/pro">
                  <Button className="shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground">
                    Créer mon compte
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                      Accueil
                    </Link>
                    <Link to="/for-professionals" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-primary transition-colors">
                      Professionnels
                    </Link>
                    <div className="pt-4 border-t">
                      <Link to="/login/pro" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full mb-3">
                          Connexion Pro
                        </Button>
                      </Link>
                      <Link to="/register/pro" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground">
                          Créer mon compte
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 z-10 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 backdrop-blur-sm animate-float">
              <ShieldCheck className="w-4 h-4" />
              <span>Plateforme certifiée pour professionnels de santé</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 lg:whitespace-nowrap">
              Modernisez votre{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-aurora">
                pratique médicale
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez la première plateforme e-santé nationale du Gabon. 
              Gérez vos patients, vos rendez-vous et développez votre activité en toute simplicité.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register/pro">
                <Button size="lg" className="shadow-xl text-base px-8 py-6 h-auto group hover-scale bg-accent hover:bg-accent/90 text-accent-foreground">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="relative z-10 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-aurora">
                SANTE.GA est fait pour vous
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Que vous soyez médecin, établissement de santé ou pharmacie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {targetAudience.map((target, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <target.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{target.title}</CardTitle>
                  <CardDescription>{target.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="relative z-10 py-10 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tous les outils dont vous avez besoin
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète pour gérer efficacement votre activité médicale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className={`card-interactive group overflow-hidden bg-card/50 backdrop-blur-sm border-2 ${
                  benefit.colorTheme === 'primary' ? 'border-primary/30' :
                  benefit.colorTheme === 'secondary' ? 'border-secondary/30' :
                  benefit.colorTheme === 'accent' ? 'border-accent/30' :
                  benefit.colorTheme === 'warning' ? 'border-warning/30' :
                  'border-border/50'
                }`}
              >
                {/* Image */}
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={benefit.image} 
                    alt={benefit.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-card/90 to-transparent ${
                    benefit.colorTheme === 'primary' ? 'via-primary/10' :
                    benefit.colorTheme === 'secondary' ? 'via-secondary/10' :
                    benefit.colorTheme === 'accent' ? 'via-accent/10' :
                    benefit.colorTheme === 'warning' ? 'via-warning/10' :
                    ''
                  }`} />
                </div>
                
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      benefit.colorTheme === 'primary' ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground' :
                      benefit.colorTheme === 'secondary' ? 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground' :
                      benefit.colorTheme === 'accent' ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground' :
                      benefit.colorTheme === 'warning' ? 'bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground' :
                      'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}>
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                      <CardDescription>{benefit.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          benefit.colorTheme === 'primary' ? 'text-primary' :
                          benefit.colorTheme === 'secondary' ? 'text-secondary' :
                          benefit.colorTheme === 'accent' ? 'text-accent' :
                          benefit.colorTheme === 'warning' ? 'text-warning' :
                          'text-primary'
                        }`} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="relative z-10 py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="card-interactive group bg-card/50 backdrop-blur-sm border-border/50"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-10 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choisissez votre formule
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des tarifs adaptés à tous les professionnels de santé
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`card-interactive bg-card/50 backdrop-blur-sm border-2 ${
                  plan.colorTheme === 'primary' ? 'border-primary/40 shadow-primary/20' :
                  plan.colorTheme === 'secondary' ? 'border-secondary/40 shadow-secondary/20' :
                  plan.colorTheme === 'accent' ? 'border-accent/40 shadow-accent/20' :
                  plan.colorTheme === 'warning' ? 'border-warning/40 shadow-warning/20' :
                  'border-border/50'
                } ${plan.recommended ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}
              >
                {plan.recommended && (
                  <div className={`bg-${plan.colorTheme} text-${plan.colorTheme}-foreground text-center py-2 text-sm font-semibold rounded-t-xl`}>
                    Recommandé
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${
                      plan.colorTheme === 'primary' ? 'text-primary' :
                      plan.colorTheme === 'secondary' ? 'text-secondary' :
                      plan.colorTheme === 'accent' ? 'text-accent' :
                      plan.colorTheme === 'warning' ? 'text-warning' :
                      'text-primary'
                    }`}>{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
                  </div>
                  {plan.trial && (
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      plan.colorTheme === 'primary' ? 'bg-primary/20 text-primary' :
                      plan.colorTheme === 'secondary' ? 'bg-secondary/20 text-secondary' :
                      plan.colorTheme === 'accent' ? 'bg-accent/20 text-accent' :
                      plan.colorTheme === 'warning' ? 'bg-warning/20 text-warning' :
                      'bg-secondary/20 text-secondary-foreground'
                    }`}>
                      {plan.trial}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.colorTheme === 'primary' ? 'text-primary' :
                          plan.colorTheme === 'secondary' ? 'text-secondary' :
                          plan.colorTheme === 'accent' ? 'text-accent' :
                          plan.colorTheme === 'warning' ? 'text-warning' :
                          'text-primary'
                        }`} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register/pro" className="block">
                    <Button 
                      className={`w-full shadow-lg hover-scale ${
                        plan.colorTheme === 'secondary' ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' :
                        plan.colorTheme === 'accent' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' :
                        plan.colorTheme === 'warning' ? 'bg-warning hover:bg-warning/90 text-warning-foreground' :
                        ''
                      }`}
                      variant={plan.colorTheme === 'primary' || plan.recommended ? "default" : undefined}
                    >
                      Choisir {plan.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Offer Note */}
          <div className="mt-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 card-interactive backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary animate-float" />
                  <h3 className="text-lg font-semibold">Offre spéciale formation</h3>
                </div>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">1 mois d'essai gratuit</strong> avec la souscription au pack formation à l'utilisation de l'application santé.ga
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border rounded-2xl p-10 md:p-16 backdrop-blur-sm animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à rejoindre SANTE.GA ?
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto text-muted-foreground">
              Plus de 500 professionnels nous font déjà confiance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/pro">
                <Button size="lg" className="w-full sm:w-auto shadow-xl text-base px-8 py-6 h-auto hover-scale group bg-accent hover:bg-accent/90 text-accent-foreground">
                  Créer mon compte professionnel
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 md:py-14 px-4 sm:px-6 lg:px-8 bg-muted/20 border-t z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="flex items-center -gap-1 mb-4">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-12 object-contain" />
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold tracking-tight">
                    <span className="text-foreground">SANTE</span>
                    <span className="text-primary">.GA</span>
                  </h2>
                  <p className="text-[10px] text-muted-foreground">{t('landing.footer.tagline') || "Votre santé, notre priorité"}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {t('landing.footer.description') || "La plateforme nationale e-santé du Gabon. Connectant patients, médecins et professionnels de santé pour un accès équitable aux soins partout au Gabon."}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-3">{t('landing.services') || "Services"}</h4>
              <ul className="space-y-2">
                <li><Link to="/providers" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('landing.footer.findDoctor') || "Trouver un médecin"}</Link></li>
                <li><Link to="/teleconsultation" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('landing.footer.teleconsultation') || "Téléconsultation"}</Link></li>
                <li><Link to="/medical-record" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('landing.footer.medicalRecord') || "Dossier médical"}</Link></li>
                <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('landing.footer.cnamgsRights') || "Droits CNAMGS"}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-3">{t('landing.footer.support') || "Contact"}</h4>
              <ul className="space-y-2">
                <li className="flex items-start text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{t('landing.footer.location') || "Libreville, Gabon"}</span>
                </li>
                <li className="flex items-start text-muted-foreground text-sm">
                  <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>support@sante.ga</span>
                </li>
                <li className="flex items-start text-muted-foreground text-sm">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{t('landing.footer.availability') || "24/7 Support disponible"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © 2025 SANTE.GA - Conçu et développé par ORGANÉUS Gabon. Tous droits réservés.
              </p>
              <Link to="/superadmin" className="opacity-30 hover:opacity-60 transition-opacity flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Admin</span>
              </Link>
              <div className="flex space-x-4 text-sm">
                <Link to="/messages" className="text-muted-foreground hover:text-primary transition-colors">{t('landing.footer.privacy') || 'Confidentialité'}</Link>
                <Link to="/messages" className="text-muted-foreground hover:text-primary transition-colors">{t('landing.footer.terms') || "Conditions d'utilisation"}</Link>
                <Link to="/messages" className="text-muted-foreground hover:text-primary transition-colors">{t('landing.footer.helpCenter') || 'Aide'}</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
