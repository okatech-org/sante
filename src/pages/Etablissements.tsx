import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoSante from "@/assets/logo_sante.png";
import {
  Building2,
  Building,
  Cross,
  Pill,
  FlaskConical,
  Scan,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Users,
  Home
} from "lucide-react";
import { ESTABLISHMENTS_STATS } from "@/data/real-establishments";

export default function Etablissements() {
  const categories = [
    {
      type: "hospitals",
      icon: Building,
      title: "Hôpitaux",
      count: ESTABLISHMENTS_STATS.byType.hospitals,
      color: "bg-blue-500",
      description: "Établissements hospitaliers publics et privés"
    },
    {
      type: "clinics",
      icon: Cross,
      title: "Cliniques",
      count: ESTABLISHMENTS_STATS.byType.clinics,
      color: "bg-emerald-500",
      description: "Cliniques privées et centres médicaux spécialisés"
    },
    {
      type: "pharmacies",
      icon: Pill,
      title: "Pharmacies",
      count: ESTABLISHMENTS_STATS.byType.pharmacies,
      color: "bg-violet-500",
      description: "Pharmacies de ville et officines"
    },
    {
      type: "cabinets",
      icon: Building2,
      title: "Cabinets Médicaux",
      count: ESTABLISHMENTS_STATS.byType.cabinets,
      color: "bg-amber-500",
      description: "Cabinets médicaux et dentaires"
    },
    {
      type: "laboratories",
      icon: FlaskConical,
      title: "Laboratoires",
      count: ESTABLISHMENTS_STATS.byType.laboratories,
      color: "bg-cyan-500",
      description: "Laboratoires d'analyses médicales"
    },
    {
      type: "imaging",
      icon: Scan,
      title: "Centres d'Imagerie",
      count: ESTABLISHMENTS_STATS.byType.imaging,
      color: "bg-pink-500",
      description: "IRM, Scanner, Radiologie, Échographie"
    }
  ];

  const provinces = [
    { name: "Estuaire", count: ESTABLISHMENTS_STATS.byProvince["Estuaire"] || 0 },
    { name: "Haut-Ogooué", count: ESTABLISHMENTS_STATS.byProvince["Haut-Ogooué"] || 0 },
    { name: "Ogooué-Maritime", count: ESTABLISHMENTS_STATS.byProvince["Ogooué-Maritime"] || 0 },
    { name: "Woleu-Ntem", count: ESTABLISHMENTS_STATS.byProvince["Woleu-Ntem"] || 0 },
    { name: "Moyen-Ogooué", count: ESTABLISHMENTS_STATS.byProvince["Moyen-Ogooué"] || 0 },
    { name: "Ogooué-Lolo", count: ESTABLISHMENTS_STATS.byProvince["Ogooué-Lolo"] || 0 },
    { name: "Ogooué-Ivindo", count: ESTABLISHMENTS_STATS.byProvince["Ogooué-Ivindo"] || 0 },
    { name: "Ngounié", count: ESTABLISHMENTS_STATS.byProvince["Ngounié"] || 0 },
    { name: "Nyanga", count: ESTABLISHMENTS_STATS.byProvince["Nyanga"] || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src={logoSante} alt="SANTE.GA" className="h-10 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                SANTE.GA
              </span>
            </Link>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Cartographie Nationale</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Établissements de Santé
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez l'ensemble des structures de santé du Gabon, réparties sur tout le territoire national
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Building2 className="h-4 w-4 mr-2" />
              {ESTABLISHMENTS_STATS.total} Établissements
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-base">
              <MapPin className="h-4 w-4 mr-2" />
              9 Provinces
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-base">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Données Vérifiées
            </Badge>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-3xl font-bold text-primary">{ESTABLISHMENTS_STATS.total}</p>
                <p className="text-xs text-muted-foreground mt-1">Structures de santé</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Secteur Public</p>
                <p className="text-3xl font-bold text-blue-500">{ESTABLISHMENTS_STATS.bySector.public}</p>
                <p className="text-xs text-muted-foreground mt-1">Établissements publics</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Secteur Privé</p>
                <p className="text-3xl font-bold text-emerald-500">{ESTABLISHMENTS_STATS.bySector.prive}</p>
                <p className="text-xs text-muted-foreground mt-1">Établissements privés</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Par Type d'Établissement</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez la répartition des structures de santé par catégorie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.type}
                className="p-6 hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-105 border-2 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-xl ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                      {category.count}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Provinces Distribution */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Répartition par Province</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Couverture nationale des établissements de santé
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {provinces.map((province, index) => (
            <Card
              key={province.name}
              className="p-4 hover:shadow-lg transition-all duration-300 animate-fade-in border-l-4 border-l-primary"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{province.name}</p>
                    <p className="text-xs text-muted-foreground">Province</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{province.count}</p>
                  <p className="text-xs text-muted-foreground">établissements</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Information Section */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Informations Importantes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 rounded-lg bg-background/50 backdrop-blur">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Données Officielles</h3>
                <p className="text-sm text-muted-foreground">
                  Les informations présentées proviennent de la base de données nationale des établissements de santé agréés au Gabon.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-background/50 backdrop-blur">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Conventionnement CNAMGS</h3>
                <p className="text-sm text-muted-foreground">
                  La majorité des établissements sont conventionnés avec la CNAMGS pour faciliter la prise en charge de vos soins.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-background/50 backdrop-blur">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Service 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  De nombreux établissements offrent un service d'urgence disponible 24 heures sur 24 et 7 jours sur 7.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-background/50 backdrop-blur">
              <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Contact Direct</h3>
                <p className="text-sm text-muted-foreground">
                  Chaque établissement dispose de coordonnées vérifiées pour faciliter votre prise de contact et vos rendez-vous.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 text-center">
          <h2 className="text-3xl font-bold mb-4">Trouvez l'établissement qu'il vous faut</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Utilisez notre moteur de recherche pour trouver rapidement un établissement de santé près de chez vous
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-providers">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                <MapPin className="h-5 w-5" />
                Rechercher un établissement
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="gap-2">
                <Users className="h-5 w-5" />
                Tester la plateforme
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
