import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Phone, Mail, MapPin, Heart, 
  Shield, Stethoscope, Activity, AlertTriangle,
  Baby, FlaskConical, Calendar, Home, Award,
  CheckCircle, Users, ArrowRight, Smile, TrendingUp
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
      specialty: "SPECIALIST CMT",
      initials: "JN"
    },
    {
      name: "Dr. Marie BOUNDA",
      role: "Médecin Généraliste",
      specialty: "SPECIALIST ENT",
      initials: "MB"
    },
    {
      name: "Dr. Sophie NDONG",
      role: "Médecin Urgentiste",
      specialty: "CARDIOLOGIST",
      initials: "SN"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Award className="w-3 h-3 mr-1" />
                Établissement Certifié ISO 9001
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  WellCare <span className="block">Nurturing Health,</span>
                  <span className="text-primary">Inspiring Life</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Empowering wellness through comprehensive care. Discover the journey to vibrant health and an inspired life with wellcare health.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full" onClick={() => navigate("/appointments")}>
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  Contact us <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Patient Avatars & Stats */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar key={i} className="w-10 h-10 border-2 border-background">
                        <AvatarFallback className="bg-primary/10">P{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="font-semibold">150k Patient Recovered</span>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-4xl font-bold">15+</div>
                    <div className="text-sm text-muted-foreground">Years of Experience</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">20+</div>
                    <div className="text-sm text-muted-foreground">Operation Specialist</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Doctor Image Placeholder */}
            <div className="relative lg:pl-12">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Stethoscope className="w-16 h-16 text-primary" />
                    </div>
                    <Badge className="bg-white/90 text-primary">
                      <Users className="w-3 h-3 mr-1" />
                      200+ Best Doctor
                    </Badge>
                  </div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-xs">JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs font-semibold">Josh</div>
                      <div className="text-[10px] text-muted-foreground">specialist ENT</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Services Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                We provide a wide range of{" "}
                <span className="block">medical services</span>
              </h2>
              
              {/* Large Doctor Card */}
              <Card className="overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-0 relative aspect-[4/5]">
                  <div className="absolute inset-0 flex items-end p-8">
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10">JN</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">Josh</div>
                          <div className="text-xs text-muted-foreground">SPECIALIST ENT</div>
                          <Badge variant="outline" className="mt-1 text-[10px]">Available Now</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Stethoscope className="w-24 h-24 text-primary/30" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Service Icons */}
              <div className="flex gap-8 justify-center pt-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline">Preparing your future</Badge>
                <p className="text-muted-foreground">
                  We treat you like family, providing compassionate and comprehensive healthcare services tailored to your individual needs.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">
                  Achieving<br />Your Vision
                </h3>
                <p className="text-muted-foreground">
                  Planning for retirement is essential to your long-term financial well-being. At Finovate, our experienced team collaborates with you to identify your retirement goals.
                </p>
              </div>
            </div>
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
                      En savoir plus <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Highly Qualified Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet our highly qualified doctors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/50 dark:to-gray-900">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar className="w-32 h-32">
                        <AvatarFallback className="bg-white dark:bg-gray-800 text-4xl font-bold text-primary">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground uppercase mb-4">{member.specialty}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="rounded-full w-10 h-10 p-0">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full w-10 h-10 p-0">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-background dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Feature List */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Modern Instrument</h3>
                <p className="text-muted-foreground">
                  Embrace the joy of a radiant smile! Our artistic team crafts dazzling grins with cutting-edge care...
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Easy Billing System</h3>
                <p className="text-muted-foreground">
                  Embrace the joy of a radiant smile! Our artistic team crafts dazzling grins with cutting edge care...
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Qualified Nurses & Staff</h3>
                <p className="text-muted-foreground">
                  Embrace the joy of a radiant smile! Our artistic team crafts dazzling grins with cutting edge care...
                </p>
              </div>
            </div>
            
            {/* Right Side - Doctor Image & Stats */}
            <div className="relative">
              <Card className="overflow-hidden border-0 shadow-2xl">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Stethoscope className="w-24 h-24 text-primary/40" />
                      </div>
                    </div>
                    
                    {/* Stats Card */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%]">
                      <Card className="bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <span className="text-3xl font-bold">265K</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Patients Treated</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Smile className="w-5 h-5 text-primary" />
                                <span className="text-3xl font-bold">96%</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile App Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mobile App Mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <div className="relative aspect-[9/16] max-w-[300px] mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white text-sm font-semibold">Today</span>
                      <Badge className="bg-white text-blue-600">8 JAN</Badge>
                    </div>
                    <div className="flex gap-2">
                      {[12, 13, 14, 15, 16, 17, 18].map((hour) => (
                        <div key={hour} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${hour === 15 ? 'bg-white text-blue-600' : 'text-white/60'}`}>
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Schedule Today</div>
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">Cardiologist</div>
                          <div className="text-xs text-muted-foreground">09:00 AM</div>
                        </div>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-xs">DR</AvatarFallback>
                        </Avatar>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Treatment is Easy{" "}
                  <span className="block">with Medifye</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget libero duis lacinia nisi enim ornare massa tempor consequat.
                </p>
              </div>
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
