import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import servicesHero from "@/assets/services-hero.jpg";
import doctorImage from "@/assets/doctor-consultation.jpg";
import familyImage from "@/assets/family-health.jpg";
import hospitalImage from "@/assets/hospital-reception.jpg";
import { 
  Calendar, 
  Video, 
  FileText, 
  Shield,
  Clock,
  CheckCircle2,
  Smartphone,
  Database,
  Bell
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Calendar,
      title: "Prise de Rendez-vous",
      description: "Réservez facilement vos rendez-vous médicaux en ligne, 24h/24 et 7j/7",
      features: [
        "Recherche par spécialité ou localisation",
        "Calendrier en temps réel",
        "Rappels automatiques",
        "Annulation et modification faciles"
      ],
      image: doctorImage,
      link: "/providers"
    },
    {
      icon: Video,
      title: "Téléconsultation",
      description: "Consultez un médecin par vidéo depuis n'importe où au Gabon",
      features: [
        "Consultation vidéo HD sécurisée",
        "Ordonnances électroniques",
        "Disponible partout au Gabon",
        "Tarifs conventionnés CNAMGS"
      ],
      image: familyImage,
      link: "/teleconsultation"
    },
    {
      icon: FileText,
      title: "Dossier Médical Numérique",
      description: "Tous vos documents médicaux centralisés et sécurisés",
      features: [
        "Accès 24/7 à votre historique",
        "Partage sécurisé avec vos médecins",
        "Ordonnances et résultats d'examens",
        "Stockage conforme RGPD"
      ],
      image: hospitalImage,
      link: "/medical-record"
    },
    {
      icon: Shield,
      title: "Gestion CNAMGS",
      description: "Vérifiez vos droits et suivez vos remboursements",
      features: [
        "Vérification instantanée de couverture",
        "Suivi des remboursements en temps réel",
        "Historique des prestations",
        "Alertes de renouvellement"
      ],
      image: doctorImage,
      link: "/reimbursements"
    }
  ];

  const additionalServices = [
    {
      icon: Clock,
      title: "Service d'Urgence",
      description: "Accès rapide aux services d'urgence et géolocalisation des hôpitaux les plus proches"
    },
    {
      icon: Bell,
      title: "Rappels et Notifications",
      description: "Rappels automatiques pour vos rendez-vous, médicaments et vaccinations"
    },
    {
      icon: Database,
      title: "Carnet de Vaccination",
      description: "Suivi numérique de vos vaccinations et rappels automatiques"
    },
    {
      icon: Smartphone,
      title: "Application Mobile",
      description: "Accédez à tous les services depuis votre smartphone iOS ou Android"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={servicesHero} 
            alt="Services médicaux" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Nos Services
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Une gamme complète de services de santé numériques pour faciliter votre parcours de soins
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Services Principaux</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils modernes pour une gestion simple et efficace de votre santé
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover min-h-[300px]"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary mb-6">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl mb-4">{service.title}</CardTitle>
                    <CardDescription className="text-base mb-6">{service.description}</CardDescription>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to={service.link}>
                      <Button size="lg" className="w-full sm:w-auto">
                        Accéder au service
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Services Complémentaires</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encore plus de fonctionnalités pour votre bien-être
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Créez votre compte gratuitement et accédez à tous nos services en quelques minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/patient">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                S'inscrire gratuitement
              </Button>
            </Link>
            <Link to="/login/patient">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
