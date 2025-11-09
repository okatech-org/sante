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

export default function ForProfessionals() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const benefits = [
    {
      icon: Calendar,
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Header/Navigation */}
      <nav className="relative z-10 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center -gap-1 group">
              <img src={logoSante} alt="Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  <span className="text-foreground">SANTE</span>
                  <span className="text-primary">.GA</span>
                </span>
                <span className="text-[10px] text-muted-foreground">Votre santé, notre priorité</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/for-professionals" className="text-primary transition-colors text-sm font-medium">
                Professionnels
              </Link>
              <Link to="/awareness" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Sensibilisation
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <ThemeToggle />
                <LanguageToggle />
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('landing.cta.login') || 'Se connecter'}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="shadow-lg">
                    {t('landing.hero.patient') || "S'inscrire"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/for-professionals" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-primary transition-colors">
                      Professionnels
                    </Link>
                    <Link to="/awareness" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                      Sensibilisation
                    </Link>
                    <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          {t('landing.cta.login') || 'Se connecter'}
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              Rejoignez la plateforme E-Santé Nationale
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Pour les </span>
            <span className="text-primary">Professionnels de Santé</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Modernisez votre pratique et développez votre activité avec SANTE.GA
          </p>
          <div>
            <Link to="/register/pro">
              <Button size="lg" className="shadow-lg hover:shadow-xl text-base px-8 py-6 h-auto">
                Rejoindre SANTE.GA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              SANTE.GA est fait pour vous
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
      <section className="relative z-10 py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
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
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
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
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
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
      <section className="relative z-10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
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
      <section className="relative z-10 py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
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
                className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  plan.recommended ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold rounded-t-xl">
                    Recommandé
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
                  </div>
                  {plan.trial && (
                    <div className="bg-secondary/20 text-secondary-foreground px-3 py-2 rounded-lg text-sm font-medium">
                      {plan.trial}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register/pro" className="block">
                    <Button className="w-full shadow-lg" variant={plan.recommended ? "default" : "secondary"}>
                      Choisir {plan.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Offer Note */}
          <div className="mt-10 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
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
      <section className="relative z-10 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-primary/5 border rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à rejoindre SANTE.GA ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Plus de 500 professionnels nous font déjà confiance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/pro">
                <Button size="lg" className="w-full sm:w-auto shadow-lg text-base px-8 py-6 h-auto">
                  Créer mon compte professionnel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/messages">
                <Button size="lg" variant="outline" className="w-full sm:w-auto shadow-lg text-base px-8 py-6 h-auto">
                  Contacter notre équipe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t z-10">
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
