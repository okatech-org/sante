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
  Award
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
      {/* Hero Section - Aurora Glass */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Aurora Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent animate-aurora" />
        <div 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url(${professionalsHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background/90" />
        
        {/* Glassmorphism Container */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="backdrop-blur-2xl bg-white/10 dark:bg-white/5 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg animate-float">
              Pour les Professionnels de Santé
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Modernisez votre pratique et développez votre activité avec SANTE.GA
            </p>
            <Link to="/register/professional">
              <Button 
                size="lg" 
                className="backdrop-blur-xl bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/20"
              >
                Rejoindre SANTE.GA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Target Audience - Glassmorphism Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">SANTE.GA est fait pour vous</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Que vous soyez médecin, établissement de santé ou pharmacie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targetAudience.map((target, index) => (
              <Card 
                key={index} 
                className="text-center backdrop-blur-xl bg-white/5 dark:bg-white/10 border-2 border-white/10 dark:border-white/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-accent text-white mx-auto mb-4 shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
                    <target.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{target.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{target.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Avantages Principaux</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils professionnels pour une pratique médicale moderne
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="overflow-hidden relative h-[400px] lg:h-[500px]">
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                  <div className="backdrop-blur-2xl bg-white/10 dark:bg-black/20 rounded-xl p-4 shadow-2xl border-2 border-white/20 dark:border-white/30 hover:border-primary/50 transition-all duration-300 group-hover:shadow-primary/20 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:1000px_100%]">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex-shrink-0 shadow-lg">
                        <benefit.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1 text-white drop-shadow-md">{benefit.title}</CardTitle>
                        <CardDescription className="text-xs text-white/90">{benefit.description}</CardDescription>
                      </div>
                    </div>
                    
                    <ul className="space-y-1.5 ml-13">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0 shadow-glow" />
                          <span className="text-white/80">{feature}</span>
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

      {/* Additional Features - Compact Glass Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Fonctionnalités Complètes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour exercer efficacement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 dark:from-white/10 dark:to-white/5 border border-white/10 dark:border-white/20 hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent text-white mb-4 shadow-lg group-hover:shadow-secondary/50 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Premium Glass Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Tarification Simple</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des formules adaptées à votre activité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="backdrop-blur-2xl bg-white/5 dark:bg-white/10 border border-white/10 dark:border-white/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Essentiel</CardTitle>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Gratuit</div>
                <CardDescription>Pour débuter sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2">✓ Profil dans l'annuaire</li>
                  <li className="flex gap-2">✓ Gestion de rendez-vous</li>
                  <li className="flex gap-2">✓ Dossiers patients</li>
                  <li className="flex gap-2">✓ Support par email</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-2xl bg-white/5 dark:bg-white/10 border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative group animate-aurora-pulse shadow-primary/20">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-card/95 backdrop-blur-2xl rounded-lg border-2 border-white/20">
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
                    <li className="flex gap-2">✓ Tout Essentiel +</li>
                    <li className="flex gap-2">✓ Téléconsultation illimitée</li>
                    <li className="flex gap-2">✓ Statistiques avancées</li>
                    <li className="flex gap-2">✓ Support prioritaire</li>
                  </ul>
                </CardContent>
              </div>
            </Card>

            <Card className="backdrop-blur-2xl bg-white/5 dark:bg-white/10 border border-white/10 dark:border-white/20 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Établissement</CardTitle>
                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">Sur devis</div>
                <CardDescription>Pour les structures de santé</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2">✓ Tout Professionnel +</li>
                  <li className="flex gap-2">✓ Multi-praticiens</li>
                  <li className="flex gap-2">✓ API personnalisée</li>
                  <li className="flex gap-2">✓ Account manager dédié</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Aurora Gradient */}
      <section className="py-16 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent animate-aurora opacity-75" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Rejoignez SANTE.GA dès aujourd'hui
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Plus de 500 professionnels nous font déjà confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/professional">
              <Button 
                size="lg" 
                className="w-full sm:w-auto backdrop-blur-xl bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/30"
              >
                Créer mon compte professionnel
              </Button>
            </Link>
            <Link to="/support">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto backdrop-blur-xl bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white hover:scale-105 transition-all duration-300"
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
