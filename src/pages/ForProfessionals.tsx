import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={professionalsHero} 
            alt="Professionnels de santé" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Pour les Professionnels de Santé
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Modernisez votre pratique et développez votre activité avec SANTE.GA
          </p>
          <Link to="/register/professional">
            <Button size="lg" variant="secondary" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Rejoindre SANTE.GA
            </Button>
          </Link>
        </div>
      </section>

      {/* Target Audience */}
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
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
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

          <div className="space-y-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="overflow-hidden relative min-h-[500px] lg:min-h-[600px]">
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/20" />
                
                <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-end h-full">
                  <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-2xl border border-border/50">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary mb-6">
                      <benefit.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl mb-4">{benefit.title}</CardTitle>
                    <CardDescription className="text-base mb-6">{benefit.description}</CardDescription>
                    
                    <ul className="space-y-3">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
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

      {/* Additional Features */}
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
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
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

      {/* Pricing */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Tarification Simple</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des formules adaptées à votre activité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Essentiel</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">Gratuit</div>
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

            <Card className="hover:shadow-xl transition-shadow border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Professionnel</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">50k FCFA<span className="text-lg">/mois</span></div>
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
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Établissement</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">Sur devis</div>
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

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Rejoignez SANTE.GA dès aujourd'hui
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Plus de 500 professionnels nous font déjà confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/professional">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Créer mon compte professionnel
              </Button>
            </Link>
            <Link to="/support">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Contacter notre équipe
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
