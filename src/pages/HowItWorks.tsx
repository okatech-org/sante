import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import howItWorksHero from "@/assets/how-it-works-hero.jpg";
import { 
  UserPlus, 
  Search, 
  Calendar,
  Video,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Clock,
  Shield
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Créez votre compte",
      description: "Inscription rapide et gratuite en moins de 2 minutes. Renseignez vos informations personnelles de base et votre numéro CNAMGS si vous en avez un.",
      details: [
        "Informations personnelles sécurisées",
        "Numéro CNAMGS (optionnel)",
        "Validation par email ou SMS",
        "Compte actif immédiatement"
      ],
      color: "bg-blue-500"
    },
    {
      number: "02",
      icon: Search,
      title: "Recherchez un professionnel",
      description: "Utilisez notre moteur de recherche pour trouver le médecin ou l'établissement qui correspond à vos besoins, partout au Gabon.",
      details: [
        "Recherche par spécialité médicale",
        "Filtrage par localisation",
        "Consultation des profils et avis",
        "Vérification des disponibilités"
      ],
      color: "bg-green-500"
    },
    {
      number: "03",
      icon: Calendar,
      title: "Prenez rendez-vous",
      description: "Sélectionnez le créneau horaire qui vous convient le mieux et confirmez votre rendez-vous en un clic. Recevez une confirmation instantanée.",
      details: [
        "Calendrier en temps réel",
        "Choix de l'horaire",
        "Confirmation immédiate",
        "Rappels automatiques par SMS/email"
      ],
      color: "bg-purple-500"
    },
    {
      number: "04",
      icon: Video,
      title: "Consultez et suivez",
      description: "Présentez-vous à votre rendez-vous ou consultez en ligne. Accédez ensuite à tous vos documents médicaux dans votre espace personnel.",
      details: [
        "Consultation en cabinet ou en ligne",
        "Ordonnances électroniques",
        "Résultats d'examens",
        "Historique médical complet"
      ],
      color: "bg-orange-500"
    }
  ];

  const advantages = [
    {
      icon: Clock,
      title: "Gain de temps",
      description: "Fini les files d'attente et les appels téléphoniques. Tout se fait en ligne en quelques clics."
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Vos données médicales sont cryptées et protégées selon les normes internationales."
    },
    {
      icon: Smartphone,
      title: "Accessible partout",
      description: "Utilisez la plateforme depuis votre ordinateur, tablette ou smartphone, où que vous soyez."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={howItWorksHero} 
            alt="Comment ça marche" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Comment ça marche ?
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            4 étapes simples pour prendre soin de votre santé
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className="flex items-start gap-6 mb-6">
                        <div className={`${step.color} text-white text-4xl font-bold px-6 py-3 rounded-lg`}>
                          {step.number}
                        </div>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                          <step.icon className="w-8 h-8" />
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl lg:text-3xl mb-4">{step.title}</CardTitle>
                      <CardDescription className="text-base mb-6">{step.description}</CardDescription>
                      
                      <ul className="space-y-3">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={`${step.color} p-8 lg:p-12 flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div className="text-white text-center">
                        <step.icon className="w-32 h-32 mx-auto mb-6 opacity-20" strokeWidth={1} />
                        <h3 className="text-3xl font-bold">Étape {step.number}</h3>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8">
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Les Avantages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pourquoi choisir SANTE.GA pour gérer votre santé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <advantage.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{advantage.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Tutoriel Vidéo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez en images comment utiliser la plateforme
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Tutoriel vidéo à venir</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            C'est simple, rapide et gratuit !
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Rejoignez des milliers de Gabonais qui utilisent déjà SANTE.GA
          </p>
          <Link to="/register/patient">
            <Button size="lg" variant="secondary">
              Créer mon compte maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
