import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import aboutHero from "@/assets/about-hero.jpg";
import { 
  Target, 
  Eye, 
  Heart,
  Users,
  Award,
  Globe,
  TrendingUp,
  Shield
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const mission = {
    icon: Target,
    title: "Notre Mission",
    description: "Démocratiser l'accès aux soins de santé pour tous les Gabonais en offrant une plateforme digitale moderne, sécurisée et accessible partout sur le territoire national."
  };

  const vision = {
    icon: Eye,
    title: "Notre Vision",
    description: "Faire du Gabon un leader africain de la santé numérique et garantir à chaque citoyen un accès équitable aux meilleurs soins, où qu'il se trouve."
  };

  const values = [
    {
      icon: Heart,
      title: "Accessibilité",
      description: "Rendre les soins de santé accessibles à tous, partout au Gabon, sans discrimination."
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protéger vos données médicales avec les plus hauts standards de sécurité internationaux."
    },
    {
      icon: Users,
      title: "Inclusivité",
      description: "Une plateforme pensée pour tous : patients, médecins, pharmaciens et établissements."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Offrir un service de qualité supérieure avec les meilleures technologies disponibles."
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Professionnels de santé"
    },
    {
      icon: Globe,
      number: "9",
      label: "Provinces couvertes"
    },
    {
      icon: TrendingUp,
      number: "10k+",
      label: "Consultations réalisées"
    },
    {
      icon: Award,
      number: "100%",
      label: "Données sécurisées"
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Lancement du projet",
      description: "Initiative du Ministère de la Santé pour moderniser le système de santé gabonais"
    },
    {
      year: "2024",
      title: "Phase pilote",
      description: "Déploiement dans les principales villes : Libreville et Port-Gentil"
    },
    {
      year: "2025",
      title: "Extension nationale",
      description: "Couverture de toutes les provinces du Gabon et intégration CNAMGS"
    },
    {
      year: "2026",
      title: "Innovation continue",
      description: "IA pour le diagnostic, télémédecine avancée et partenariats internationaux"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={aboutHero} 
            alt="À propos de SANTE.GA" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            À Propos de SANTE.GA
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            La plateforme nationale de santé numérique du Gabon
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary mb-4">
                  <mission.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">{mission.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{mission.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary mb-4">
                  <vision.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">{vision.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{vision.description}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">SANTE.GA en Chiffres</h2>
            <p className="text-xl opacity-90">Notre impact sur la santé des Gabonais</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 text-primary-foreground mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Notre Parcours</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              L'évolution de SANTE.GA depuis sa création
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-primary">{item.year}</div>
                      <div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nos Partenaires</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              SANTE.GA est une initiative du Ministère de la Santé du Gabon en partenariat avec :
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="font-semibold">Ministère de la Santé</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="font-semibold">CNAMGS</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="font-semibold">Ordre des Médecins</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
