import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import professionalsHero from "@/assets/professionals-hero.jpg";
import doctorImage from "@/assets/doctor-consultation.jpg";
import hospitalImage from "@/assets/hospital-reception.jpg";
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
  Check
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ForProfessionals() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Calendar,
      title: "Gestion d'Agenda Intelligente",
      description: "Optimisez votre planning avec notre système de gestion de rendez-vous automatisé",
      image: doctorImage,
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
      image: hospitalImage,
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
      image: doctorImage,
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
      image: hospitalImage,
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

  return (
    <MainLayout>
      <div className="min-h-screen">
      {/* Hero Section - Style Landing */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={professionalsHero} 
            alt="Professionnels de santé" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/10 backdrop-blur-sm border border-white/20 animate-scale-in">
            <Award className="w-4 h-4 text-white" />
            <span className="text-white">Rejoignez la plateforme E-Santé Nationale</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white animate-fade-in leading-tight">
            Pour les Professionnels de Santé
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Modernisez votre pratique et développez votre activité avec SANTE.GA
          </p>
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/register/professional">
              <Button 
                size="lg" 
                className="shadow-2xl hover:shadow-3xl hover-scale bg-white text-primary hover:bg-white/90 border-2 border-white/40 text-lg px-8 py-6 h-auto"
              >
                Rejoindre SANTE.GA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Target Audience - Style Landing */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              SANTE.GA est fait pour vous
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Que vous soyez médecin, établissement de santé ou pharmacie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targetAudience.map((target, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border-border/40 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-accent text-white mx-auto mb-4 shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
                    <target.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{target.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{target.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Benefits - Style Landing */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Avantages Principaux</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils professionnels pour une pratique médicale moderne
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="overflow-hidden relative h-[400px] lg:h-[500px] group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-110 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                  <div className="bg-card/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-border/40 group-hover:bg-card/95 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex-shrink-0 shadow-lg">
                        <benefit.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">{benefit.title}</CardTitle>
                        <CardDescription className="text-xs">{benefit.description}</CardDescription>
                      </div>
                    </div>
                    
                    <ul className="space-y-1.5 ml-13">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features - Style Landing */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Fonctionnalités Complètes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour exercer efficacement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border-border/40 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent text-white mb-4 shadow-lg group-hover:shadow-secondary/50 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Style Landing */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Tarification Simple
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des formules adaptées à votre activité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-border/40 animate-fade-in" style={{ animationDelay: '0s' }}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Essentiel</CardTitle>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Gratuit</div>
                <CardDescription>Pour débuter sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Profil dans l'annuaire</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Gestion de rendez-vous</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Dossiers patients</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Support par email</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary via-secondary to-accent text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                Recommandé
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Professionnel</CardTitle>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">50k FCFA<span className="text-lg">/mois</span></div>
                <CardDescription>Pour une pratique complète</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Tout Essentiel +</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Téléconsultation illimitée</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Statistiques avancées</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-lg transition-all">
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-border/40 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Établissement</CardTitle>
                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">Sur devis</div>
                <CardDescription>Pour les structures de santé</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Tout Professionnel +</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multi-praticiens</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>API personnalisée</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Account manager dédié</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Style Landing */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent animate-aurora opacity-75" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Rejoignez SANTE.GA dès aujourd'hui
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Plus de 500 professionnels nous font déjà confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/professional">
              <Button 
                size="lg" 
                className="w-full sm:w-auto shadow-2xl hover:shadow-3xl hover-scale bg-white text-primary hover:bg-white/90 border-2 border-white/40 text-lg px-8 py-6 h-auto"
              >
                Créer mon compte professionnel
              </Button>
            </Link>
            <Link to="/support">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto shadow-xl hover:shadow-2xl hover-scale bg-white/10 hover:bg-white/20 border-2 border-white text-white text-lg px-8 py-6 h-auto"
              >
                Contacter notre équipe
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
  );
}
