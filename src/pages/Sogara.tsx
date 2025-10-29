import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Phone, Mail, MapPin, Heart, 
  Shield, Stethoscope, Activity, AlertTriangle,
  Baby, FlaskConical, Calendar, Home, Award,
  CheckCircle, Users, ArrowRight, ChevronRight
} from "lucide-react";

export default function Sogara() {
  const navigate = useNavigate();

  const services = [
    {
      icon: AlertTriangle,
      title: "Urgences 24/7",
      description: "Service d'urgence disponible jour et nuit avec médecins urgentistes qualifiés"
    },
    {
      icon: Stethoscope,
      title: "Consultations Générales",
      description: "Médecine générale et spécialisée pour tous les besoins de santé"
    },
    {
      icon: Baby,
      title: "Maternité",
      description: "Suivi de grossesse complet, accouchement et soins postnataux"
    },
    {
      icon: Activity,
      title: "Chirurgie",
      description: "Interventions chirurgicales programmées avec bloc opératoire moderne"
    },
    {
      icon: FlaskConical,
      title: "Laboratoire",
      description: "Analyses médicales complètes avec résultats rapides"
    },
    {
      icon: Shield,
      title: "Médecine du Travail",
      description: "Suivi santé et prévention pour les employés SOGARA"
    }
  ];

  const team = [
    {
      name: "Dr. Jean-Paul NZENZE",
      role: "Médecin du Travail",
      experience: "12 ans d'expérience",
      specialization: "Médecine du travail et prévention"
    },
    {
      name: "Dr. Marie BOUNDA",
      role: "Médecin Généraliste",
      experience: "8 ans d'expérience",
      specialization: "Médecine générale et urgences"
    },
    {
      name: "Inf. Sophie NDONG",
      role: "Infirmière Chef",
      experience: "15 ans d'expérience",
      specialization: "Soins infirmiers et coordination"
    }
  ];

  const stats = [
    { label: "Patients Traités", value: "1,500+", icon: Users },
    { label: "Années d'Expérience", value: "50+", icon: Award },
    { label: "Spécialistes", value: "20+", icon: Stethoscope },
    { label: "Taux de Satisfaction", value: "98%", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CMST SOGARA</h1>
                <p className="text-xs text-muted-foreground">Excellence en Santé au Travail</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-sm hover:text-primary transition-colors">Services</a>
              <a href="#team" className="text-sm hover:text-primary transition-colors">Équipe</a>
              <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Award className="w-3 h-3 mr-1" />
                Établissement Certifié ISO 9001
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  WellCare Nurturing{" "}
                  <span className="text-primary">Health</span>, Inspiring{" "}
                  <span className="text-primary">Life</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Excellence médicale au service des employés SOGARA et leurs familles depuis 1974. 
                  Votre santé est notre priorité.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate("/appointments")}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Prendre Rendez-vous
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Nous Contacter
                </Button>
              </div>

              {/* Mini Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">150+</div>
                  <div className="text-sm text-muted-foreground">Patients Traités</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Années d'Expérience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">20+</div>
                  <div className="text-sm text-muted-foreground">Spécialistes</div>
                </div>
              </div>
            </div>

            {/* Right Content - Team Preview */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Stethoscope className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Médecins Experts</h3>
                    <p className="text-sm text-muted-foreground">Équipe médicale hautement qualifiée</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 mt-8">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Équipements Modernes</h3>
                    <p className="text-sm text-muted-foreground">Technologies de pointe</p>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Nos Services</Badge>
            <h2 className="text-4xl font-bold mb-4">
              We provide a wide range of{" "}
              <span className="text-primary">medical services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des soins complets et personnalisés pour répondre à tous vos besoins de santé
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                    <Button variant="link" className="mt-4 p-0 h-auto">
                      En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Notre Équipe</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Highly <span className="text-primary">Qualified Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rencontrez nos professionnels de santé dévoués et expérimentés
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                    <Stethoscope className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-3">{member.experience}</p>
                  <p className="text-xs text-muted-foreground">{member.specialization}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Pourquoi Nous Choisir</Badge>
              <h2 className="text-4xl font-bold mb-6">
                Achieving Your <span className="text-primary">Vision</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Le CMST SOGARA offre une gamme complète de services médicaux avec des équipements 
                de pointe et une équipe hautement qualifiée pour assurer votre bien-être.
              </p>
              <div className="space-y-4">
                {[
                  "Équipe médicale expérimentée et certifiée",
                  "Équipements médicaux de dernière génération",
                  "Service d'urgence disponible 24h/24",
                  "Prise en charge CNAMGS et assurances"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <Activity className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Modern Instrument</h3>
                <p className="text-sm text-muted-foreground">Équipements médicaux de pointe</p>
              </Card>
              <Card className="p-6 mt-8">
                <Shield className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Easy Billing System</h3>
                <p className="text-sm text-muted-foreground">Système de facturation simplifié</p>
              </Card>
              <Card className="p-6">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Qualified Nurses</h3>
                <p className="text-sm text-muted-foreground">Personnel soignant qualifié</p>
              </Card>
              <Card className="p-6 mt-8">
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">24/7 Care</h3>
                <p className="text-sm text-muted-foreground">Soins disponibles en permanence</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Contact</Badge>
              <h2 className="text-4xl font-bold mb-4">Nous Contacter</h2>
              <p className="text-muted-foreground">
                Prenez contact avec notre équipe pour plus d'informations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Téléphone</h3>
                <p className="text-sm text-muted-foreground">011 55 26 21</p>
                <p className="text-xs text-muted-foreground mt-1">Urgences: 011 55 26 22</p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">service.rgc@sogara.com</p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Adresse</h3>
                <p className="text-sm text-muted-foreground">Route de la Sogara</p>
                <p className="text-xs text-muted-foreground mt-1">Port-Gentil, Gabon</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à prendre soin de votre santé ?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Prenez rendez-vous dès maintenant et bénéficiez de notre expertise médicale
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/appointments")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Prendre Rendez-vous
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Phone className="w-5 h-5 mr-2" />
              Appeler Maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">CMST SOGARA</span>
              <span className="text-muted-foreground">© 2024</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Établissement certifié ISO 9001</span>
              <span>•</span>
              <span>Conventionné CNAMGS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
