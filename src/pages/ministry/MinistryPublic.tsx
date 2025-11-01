// Page publique du Ministère de la Santé (sans authentification)
// SANTE.GA - Plateforme E-Santé Gabon

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Users, 
  Activity, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  FileText,
  Eye
} from "lucide-react";
import heroImage from "@/assets/ministry-hero.jpg";
import consultationImage from "@/assets/ministry-consultation.jpg";
import maternalImage from "@/assets/ministry-maternal.jpg";
import strategyImage from "@/assets/ministry-strategy.jpg";
import { GabonHealthMap } from "@/components/ministry/GabonHealthMap";
import { NationalStatisticsCard } from "@/components/ministry/NationalStatisticsCard";
import { NationalStatistics } from "@/types/ministry";

const MinistryPublic = () => {
  // Statistiques nationales du système de santé
  const nationalStats: NationalStatistics = {
    population_couverte_cnamgs: 1800000,
    taux_couverture: "78%",
    etablissements_operationnels: 238,
    professionnels_actifs: {
      medecins: 2159,
      infirmiers: 5847,
      pharmaciens: 423
    },
    consultations_mensuelles: 145000,
    teleconsultations_mensuelles: 12000
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Modern & Clean */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Ministère de la Santé - Gabon" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Badge className="mb-4 bg-primary text-primary-foreground border-0">
              République Gabonaise
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ministère de la Santé publique et de la Population
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 font-light leading-relaxed">
              Accélérer les progrès vers la Couverture Sanitaire Universelle pour garantir l'accès à des soins de qualité pour tous les Gabonais
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Nos Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <NationalStatisticsCard statistics={nationalStats} />
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">
              PNDS 2024-2028
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
              Notre Vision
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Améliorer l'état de santé et le bien-être de la population gabonaise en assurant l'accès universel à des services de santé de qualité, équitables et efficaces.
            </p>
          </div>

          {/* Strategic Axes - Image & Cards Layout */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={strategyImage} 
                alt="Stratégie de santé au Gabon" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>

            {/* Strategic Axes Cards */}
            <div className="space-y-4">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Target className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Gouvernance & Leadership</h3>
                    <p className="text-sm text-muted-foreground">
                      Renforcement du secteur santé
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:scale-110 transition-all">
                    <Building2 className="h-6 w-6 text-secondary group-hover:text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Offre de Soins</h3>
                    <p className="text-sm text-muted-foreground">
                      Infrastructures & qualité
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Users className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Ressources Humaines</h3>
                    <p className="text-sm text-muted-foreground">
                      Formation & gestion
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:scale-110 transition-all">
                    <TrendingUp className="h-6 w-6 text-secondary group-hover:text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Financement</h3>
                    <p className="text-sm text-muted-foreground">
                      Couverture Universelle
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Shield className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Promotion & Prévention</h3>
                    <p className="text-sm text-muted-foreground">
                      Santé publique
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Programmes Prioritaires
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des actions concrètes pour améliorer la santé des Gabonais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-2 hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={consultationImage} 
                  alt="Consultation médicale" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-success/10 text-success border-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  72% accompli
                </Badge>
                <h3 className="text-xl font-bold mb-3">Lutte contre le Paludisme</h3>
                <p className="text-muted-foreground mb-4">
                  Distribution de 500,000 moustiquaires imprégnées dans toutes les provinces pour réduire l'incidence du paludisme de 30%.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                    <span>Budget: 15 Mds FCFA</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                    <span>Provinces ciblées: 9/9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={maternalImage} 
                  alt="Santé maternelle" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-accent/10 text-accent border-0">
                  <Activity className="h-3 w-3 mr-1" />
                  68% accompli
                </Badge>
                <h3 className="text-xl font-bold mb-3">Santé Maternelle et Infantile</h3>
                <p className="text-muted-foreground mb-4">
                  Réduction de la mortalité maternelle à moins de 150 pour 100,000 naissances vivantes à travers un renforcement des capacités.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                    <span>Budget: 25 Mds FCFA</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                    <span>Objectif 2028: -50% mortalité</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Cartographie et Contact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            
            {/* Carte du Réseau de Santé */}
            <div>
              <div className="mb-8">
                <Badge className="mb-4 bg-primary/10 text-primary border-0">
                  Cartographie Nationale
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                  Réseau de Santé au Gabon
                </h2>
                <p className="text-lg text-muted-foreground">
                  Découvrez la répartition des établissements de santé
                </p>
              </div>

              <Card className="border-2 overflow-hidden">
                <CardContent className="p-0">
                  <GabonHealthMap />
                </CardContent>
              </Card>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Cliquez sur les marqueurs pour plus d'informations
                </p>
              </div>
            </div>

            {/* Nous Contacter */}
            <div>
              <div className="mb-8">
                <Badge className="mb-4 bg-secondary/10 text-secondary border-0">
                  Contact
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                  Nous Contacter
                </h2>
                <p className="text-lg text-muted-foreground">
                  Pour toute question ou demande d'information
                </p>
              </div>

              <Card className="border-2 bg-gradient-to-br from-secondary/5 to-primary/5">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Adresse</div>
                        <div className="text-sm text-muted-foreground">
                          À côté de l'immeuble Alu-Suisse<br />
                          Libreville, Gabon
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Téléphone</div>
                        <div className="text-sm text-muted-foreground">
                          +241 01-72-26-61<br />
                          +241 06 47 74 83
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Email</div>
                        <div className="text-sm text-muted-foreground">
                          contact@sante.gouv.ga
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Horaires</div>
                        <div className="text-sm text-muted-foreground">
                          Lun - Ven: 08h00 - 17h00<br />
                          Weekend: Fermé
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Récentes */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">
              <FileText className="h-3 w-3 mr-1" />
              Documentation
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Publications Récentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accédez aux derniers rapports et documents officiels du Ministère
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <Badge className="mb-3 bg-success/10 text-success border-0">
                  Annuel
                </Badge>
                <h3 className="font-bold mb-2">Rapport Performance 2024</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyse complète de la performance du système de santé gabonais
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="h-3 w-3" />
                  <span>15 Jan 2025</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Consulter
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-secondary" />
                </div>
                <Badge className="mb-3 bg-accent/10 text-accent border-0">
                  Trimestriel
                </Badge>
                <h3 className="font-bold mb-2">Bulletin Épidémiologique T3</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Surveillance des maladies prioritaires au 3ème trimestre 2025
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="h-3 w-3" />
                  <span>05 Oct 2025</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Consulter
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <Badge className="mb-3 bg-primary/10 text-primary border-0">
                  Spécial
                </Badge>
                <h3 className="font-bold mb-2">Télémédecine SANTE.GA</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bilan du déploiement de la plateforme de télémédecine
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="h-3 w-3" />
                  <span>15 Sep 2025</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Consulter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div>
              <p className="font-medium mb-2">
                © 2025 Ministère de la Santé publique et de la Population
              </p>
              <p className="text-sm text-secondary-foreground/80 mb-4">
                République Gabonaise - Propulsé par SANTE.GA
              </p>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                onClick={() => window.location.href = '/ministry'}
              >
                <Shield className="h-4 w-4 mr-2" />
                Accès Administration
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinistryPublic;
