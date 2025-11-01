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
      {/* Hero Section - Inspired Modern Design */}
      <section className="relative min-h-[700px] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-0 text-sm px-4 py-2">
              République Gabonaise
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
              Améliorer votre santé<br />
              <span className="text-primary">pour un Gabon en meilleure santé</span>
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Ministère de la Santé publique et de la Population
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 shadow-lg">
                Nos Services
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                Accès Administration
              </Button>
            </div>
          </div>

          {/* Hero Visual Cards */}
          <div className="relative max-w-5xl mx-auto mt-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Card 1 - With overlay image */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 border-0 shadow-xl min-h-[400px]">
                <CardContent className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Accès universel aux<br />soins de santé
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Services de santé publique pour tous les Gabonais
                  </p>
                  <Button className="bg-foreground text-background hover:bg-foreground/90">
                    Découvrir
                  </Button>
                </CardContent>
                <div className="absolute bottom-0 right-0 w-48 h-48 opacity-20">
                  <img src={heroImage} alt="" className="w-full h-full object-cover" />
                </div>
              </Card>

              {/* Card 2 - Testimonial style */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">78%</div>
                    <p className="text-sm text-muted-foreground">de couverture CNAMGS</p>
                  </div>
                  <blockquote className="text-sm italic text-muted-foreground mb-4">
                    "Le Plan National de Développement Sanitaire transforme notre système de santé. L'accès aux soins s'améliore dans toutes les provinces."
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-xs">
                      <div className="font-medium">Ministère de la Santé</div>
                      <div className="text-muted-foreground">Gabon</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

      {/* Vision & Mission Section - 2x2 Grid */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
              Solutions éprouvées,
              <br />
              <span className="text-primary">personnalisées pour vous</span>
            </h2>
          </div>

          {/* 2x2 Grid Layout */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl">
              <CardContent className="p-10 text-center">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Soins adaptés à
                </h3>
                <p className="text-primary text-xl mb-6">votre rythme</p>
                <p className="text-sm text-muted-foreground mb-8">
                  Pas besoin de visites en personne. Gérez votre traitement et bénéficiez d'un soutien continu via la plateforme.
                </p>
                <div className="mb-6">
                  <img 
                    src={consultationImage} 
                    alt="Consultation" 
                    className="w-32 h-32 object-cover rounded-2xl mx-auto"
                  />
                </div>
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  Commencer
                </Button>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
              <CardContent className="p-10 text-center">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Prescrit par
                </h3>
                <p className="text-primary text-xl mb-6">des professionnels agréés</p>
                <p className="text-sm text-muted-foreground mb-8">
                  Consultations gratuites et soutien continu de professionnels agréés dans les 9 provinces du Gabon.
                </p>
                <div className="mb-6 relative">
                  <div className="w-32 h-32 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Stethoscope className="h-16 w-16 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-400 text-foreground border-0 px-3 py-1">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Certifié
                    </Badge>
                  </div>
                </div>
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full mt-4">
                  Traitement personnalisé
                </Button>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl">
              <CardContent className="p-10 text-center">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Ingrédients approuvés
                </h3>
                <p className="text-primary text-xl mb-6">par les autorités</p>
                <p className="text-sm text-muted-foreground mb-8">
                  Traitements personnalisés formulés spécifiquement pour vous selon les normes gabonaises.
                </p>
                <div className="mb-6">
                  <div className="w-32 h-32 mx-auto bg-white rounded-2xl shadow-lg p-4">
                    <img 
                      src={strategyImage} 
                      alt="Ingrédients" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  Mon traitement
                </Button>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl">
              <CardContent className="p-10 text-center">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Pharmacies réglementées
                </h3>
                <p className="text-primary text-xl mb-6">au Gabon</p>
                <p className="text-sm text-muted-foreground mb-8">
                  Médicaments préparés par des pharmacies agréées, avec livraison gratuite à votre porte.
                </p>
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-white rounded-lg shadow-md">
                        <img 
                          src={maternalImage} 
                          alt={`Pharmacie ${i}`} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  Traitement personnalisé
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Section - Two Column Layout */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
              Améliorez votre santé avec nos
              <br />
              <span className="text-primary">Programmes Nationaux</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Program 1 */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl">
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Lutte contre le Paludisme
                </h3>
                <p className="text-primary text-lg mb-6">
                  pour réduire l'incidence
                </p>
                <div className="mb-8">
                  <img 
                    src={consultationImage} 
                    alt="Lutte contre le paludisme" 
                    className="w-48 h-48 object-cover rounded-2xl mx-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Distribution de 500,000 moustiquaires imprégnées dans toutes les provinces. Programme national de prévention et de traitement.
                </p>
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>

            {/* Program 2 */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Santé Maternelle
                </h3>
                <p className="text-primary text-lg mb-6">
                  pour vérifier la santé des mères
                </p>
                <div className="mb-8 relative">
                  <img 
                    src={maternalImage} 
                    alt="Santé maternelle" 
                    className="w-48 h-56 object-cover rounded-2xl mx-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Réduction de la mortalité maternelle. Soins prénatals gratuits et accompagnement des femmes enceintes dans tout le pays.
                </p>
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  Commencer maintenant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Contact CTA Section - Email Capture */}
      <section className="py-20 bg-gradient-to-br from-amber-900/90 to-orange-900/90 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              Accédez au Guide gratuit<br />
              de la Santé au Gabon
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Rédigé par des professionnels certifiés pour accompagner votre parcours de santé.
            </p>
            
            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-md shadow-xl">
              <input 
                type="email" 
                placeholder="Email" 
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-foreground text-background hover:bg-foreground/90 px-8 rounded-lg whitespace-nowrap">
                Obtenir le guide
              </Button>
            </div>
            
            <p className="text-xs text-white/70 mt-4">
              En créant un compte par email, j'accepte les{" "}
              <a href="#" className="underline">Termes & Conditions</a>, et reconnais la{" "}
              <a href="#" className="underline">Politique de Confidentialité</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Network & Contact Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Map */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Réseau de Santé au Gabon
              </h3>
              <Card className="border-2 overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <GabonHealthMap />
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                238 établissements opérationnels dans 9 provinces
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Nous Contacter
              </h3>
              <Card className="border-2 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Adresse</div>
                      <div className="text-sm text-muted-foreground">
                        À côté de l'immeuble Alu-Suisse<br />
                        Libreville, Gabon
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Téléphone</div>
                      <div className="text-sm text-muted-foreground">
                        +241 01-72-26-61<br />
                        +241 06 47 74 83
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <div className="text-sm text-muted-foreground">
                        contact@sante.gouv.ga
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Horaires</div>
                      <div className="text-sm text-muted-foreground">
                        Lundi - Vendredi: 08h00 - 17h00<br />
                        Weekend: Fermé
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Récentes - Colorful Cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
              Voici ce que vous
              <br />
              <span className="text-primary">devez savoir</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Large featured card */}
            <Card className="md:col-span-2 lg:row-span-2 overflow-hidden border-0 shadow-xl relative group">
              <div className="absolute inset-0">
                <img 
                  src={heroImage} 
                  alt="Couverture santé" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
              </div>
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                <h3 className="text-3xl font-bold mb-4">
                  La couverture maladie est-elle prise en charge par l'assurance?
                </h3>
                <Button className="bg-white text-foreground hover:bg-white/90 w-fit rounded-full">
                  Explorer
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">Vaccination</h3>
                <p className="text-white/90 text-sm mb-4">Calendrier vaccinal</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">Urgences</h3>
                <p className="text-white/90 text-sm mb-4">Numéros d'urgence</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">Consultations</h3>
                <p className="text-white/90 text-sm mb-4">Prendre RDV</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-pink-500 to-red-600 text-white hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">Santé Infantile</h3>
                <p className="text-white/90 text-sm mb-4">Suivi pédiatrique</p>
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
