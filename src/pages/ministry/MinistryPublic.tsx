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
  Stethoscope
} from "lucide-react";
import heroImage from "@/assets/ministry-hero.jpg";
import consultationImage from "@/assets/ministry-consultation.jpg";
import maternalImage from "@/assets/ministry-maternal.jpg";
import strategyImage from "@/assets/ministry-strategy.jpg";
import { GabonHealthMap } from "@/components/ministry/GabonHealthMap";

const MinistryPublic = () => {
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">1.8M</div>
              <div className="text-sm text-muted-foreground">Bénéficiaires CNAMGS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">238</div>
              <div className="text-sm text-muted-foreground">Établissements</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">2,159</div>
              <div className="text-sm text-muted-foreground">Médecins actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">78%</div>
              <div className="text-sm text-muted-foreground">Taux de couverture</div>
            </div>
          </div>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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


      {/* Cartographie du Réseau de Santé */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                Cartographie Nationale
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Réseau de Santé au Gabon
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez la répartition des établissements de santé sur l'ensemble du territoire gabonais
              </p>
            </div>

            <Card className="border-2 overflow-hidden">
              <CardContent className="p-0">
                <GabonHealthMap />
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Cliquez sur les marqueurs pour plus d'informations sur chaque établissement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            <Card className="border-2 bg-gradient-to-br from-secondary/5 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Nous Contacter</h3>
                </div>
                
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
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="font-medium mb-2">
              © 2025 Ministère de la Santé publique et de la Population
            </p>
            <p className="text-sm text-secondary-foreground/80">
              République Gabonaise - Propulsé par SANTE.GA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinistryPublic;
