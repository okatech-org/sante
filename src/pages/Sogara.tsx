import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { 
  Building2, Phone, Mail, MapPin, Calendar,
  Heart, Shield, Stethoscope, Activity, AlertTriangle,
  Baby, FlaskConical, Clock, Users, Award, ArrowRight, ChevronRight
} from "lucide-react";
import sogaraHero from "@/assets/sogara-hero.jpg";
import sogaraDoctor from "@/assets/sogara-doctor.jpg";
import sogaraEquipment from "@/assets/sogara-equipment.jpg";

export default function Sogara() {
  const navigate = useNavigate();

  // Update Open Graph meta tags for social sharing
  useEffect(() => {
    const updateMetaTags = () => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      if (ogTitle) ogTitle.setAttribute('content', 'CMST SOGARA - Centre de Médecine de Santé au Travail');
      if (ogDescription) ogDescription.setAttribute('content', 'Excellence médicale au service des employés SOGARA et leurs familles. Des soins de qualité avec des équipements de pointe depuis 1974.');
      if (ogImage) ogImage.setAttribute('content', 'https://sante.ga/cmst_sogara_logo.png');
      if (ogUrl) ogUrl.setAttribute('content', 'https://sante.ga/sogara');
      if (twitterImage) twitterImage.setAttribute('content', 'https://sante.ga/cmst_sogara_logo.png');
    };

    updateMetaTags();

    // Cleanup: restore original meta tags when component unmounts
    return () => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      if (ogTitle) ogTitle.setAttribute('content', 'SANTE.GA - Votre santé digitale au Gabon');
      if (ogDescription) ogDescription.setAttribute('content', 'Gérez votre santé en ligne facilement : rendez-vous, ordonnances, résultats et remboursements');
      if (ogImage) ogImage.setAttribute('content', 'https://sante.ga/logo_sante.png');
      if (ogUrl) ogUrl.setAttribute('content', 'https://sante.ga');
      if (twitterImage) twitterImage.setAttribute('content', 'https://sante.ga/logo_sante.png');
    };
  }, []);

  const services = [
    { icon: AlertTriangle, title: "Urgences 24/7", description: "Service d'urgence disponible jour et nuit" },
    { icon: Stethoscope, title: "Consultations", description: "Médecine générale et spécialisée" },
    { icon: Baby, title: "Maternité", description: "Suivi de grossesse complet" },
    { icon: Activity, title: "Chirurgie", description: "Bloc opératoire moderne" },
    { icon: FlaskConical, title: "Laboratoire", description: "Analyses médicales complètes" },
    { icon: Shield, title: "Médecine du Travail", description: "Prévention et suivi santé" }
  ];

  const team = [
    { name: "Dr. Jean-Paul NZENZE", specialty: "Médecin du Travail", initials: "JN" },
    { name: "Dr. Marie BOUNDA", specialty: "Médecin Généraliste", initials: "MB" },
    { name: "Dr. Sophie NDONG", specialty: "Médecin Urgentiste", initials: "SN" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CMST SOGARA</h1>
                <p className="text-xs text-muted-foreground">Centre de Médecine de Santé au Travail</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">À propos</a>
              <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
              <a href="#team" className="text-sm font-medium hover:text-primary transition-colors">Équipe</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
              <Button onClick={() => navigate("/appointments")} className="bg-gradient-to-r from-blue-600 to-blue-500">
                Prendre Rendez-vous
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Centre de Médecine{" "}
                  <span className="block">de Santé au Travail</span>
                  <span className="text-blue-600">SOGARA</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Excellence médicale au service des employés SOGARA et leurs familles. Des soins de qualité avec des équipements de pointe depuis 1974.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Prendre Rendez-vous
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Nous Contacter
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Patient Stats */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <Avatar key={i} className="w-12 h-12 border-2 border-background">
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
                          P{i}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">1,670+ Employés</div>
                    <div className="text-sm text-muted-foreground">Pris en charge chaque année</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-4xl font-bold">50+</div>
                    <div className="text-sm text-muted-foreground">Années d'expérience</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">28+</div>
                    <div className="text-sm text-muted-foreground">Personnel Médical</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Medical Center Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={sogaraHero} 
                  alt="CMST SOGARA - Centre Médical"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Badge */}
                <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">12</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">12+ Médecins</div>
                      <div className="text-xs text-muted-foreground">Qualifiés</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Badge */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-xs">Dr</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs font-semibold">Disponible 24/7</div>
                      <div className="text-[10px] text-muted-foreground">Urgences</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Une gamme complète de{" "}
                <span className="block">services médicaux</span>
              </h2>
              
              {/* Large Service Card */}
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-0 relative aspect-[4/5]">
                  <img 
                    src={sogaraDoctor} 
                    alt="Médecin du CMST SOGARA"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%]">
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">Dr. NZENZE</div>
                            <div className="text-xs text-muted-foreground">Médecin du Travail</div>
                            <Badge variant="outline" className="mt-2 text-[10px]">
                              Disponible Maintenant
                            </Badge>
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">JN</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* Service Icons */}
              <div className="flex gap-8 justify-center pt-4">
                {[Activity, Shield, Heart].map((Icon, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Excellence Médicale
                </Badge>
                <p className="text-muted-foreground">
                  Nous vous traitons comme une famille, offrant des services de santé complets et personnalisés adaptés à vos besoins individuels.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">
                  Votre santé,<br />Notre priorité
                </h3>
                <p className="text-muted-foreground">
                  Depuis 1974, le CMST SOGARA offre des soins de qualité aux employés et à leurs familles avec une équipe médicale expérimentée et des équipements modernes.
                </p>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Équipe Hautement Qualifiée
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rencontrez nos médecins hautement qualifiés
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-900">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center relative">
                    <Avatar className="w-32 h-32">
                      <AvatarFallback className="bg-white dark:bg-gray-800 text-4xl font-bold text-blue-600">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{member.specialty}</p>
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
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Features */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Équipements Modernes</h3>
                <p className="text-muted-foreground">
                  Des équipements médicaux de dernière génération pour des diagnostics précis et des soins de qualité optimale.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Système de Facturation Simplifié</h3>
                <p className="text-muted-foreground">
                  Conventionné CNAMGS et CNSS pour une prise en charge simplifiée de vos soins médicaux.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Personnel Qualifié</h3>
                <p className="text-muted-foreground">
                  Une équipe de 28 infirmiers et 12 médecins qualifiés pour vous offrir les meilleurs soins.
                </p>
              </div>
            </div>
            
            {/* Right Side - Equipment Image */}
            <div className="relative">
              <Card className="overflow-hidden border-0 shadow-2xl">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={sogaraEquipment} 
                      alt="Équipements médicaux modernes du CMST SOGARA"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Stats Card */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%]">
                      <Card className="bg-white/95 backdrop-blur-sm border-0">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="text-3xl font-bold">1,670</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Employés Couverts</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Heart className="w-5 h-5 text-blue-600" />
                                <span className="text-3xl font-bold">98%</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Satisfaction</p>
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Nous Contacter</h2>
              <p className="text-muted-foreground">
                Prenez contact avec notre équipe pour plus d'informations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Téléphone</h3>
                <p className="text-sm text-muted-foreground">+241 01 55 55 00</p>
                <p className="text-xs text-muted-foreground mt-1">Urgences 24/7</p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">cmst@sogara.ga</p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Adresse</h3>
                <p className="text-sm text-muted-foreground">Zone Industrielle SOGARA</p>
                <p className="text-xs text-muted-foreground mt-1">Port-Gentil, Gabon</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à prendre soin de votre santé ?
          </h2>
          <p className="text-blue-50 mb-8 max-w-2xl mx-auto text-lg">
            Prenez rendez-vous dès maintenant et bénéficiez de notre expertise médicale
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="rounded-full px-8"
              onClick={() => navigate("/appointments")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Prendre Rendez-vous
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white/20 rounded-full px-8"
            >
              <Phone className="w-5 h-5 mr-2" />
              Appeler Maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-white">CMST SOGARA</span>
              </div>
              <p className="text-sm text-gray-400">
                Excellence en médecine de santé au travail depuis 1974
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Urgences 24/7</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consultations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Laboratoire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chirurgie</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +241 01 55 55 00
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  cmst@sogara.ga
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Port-Gentil, Gabon
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Horaires</h4>
              <ul className="space-y-2 text-sm">
                <li>Lun-Ven: 7h30 - 16h30</li>
                <li>Samedi: 8h00 - 12h00</li>
                <li>Urgences: 24h/24</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 CMST SOGARA - Centre de Médecine de Santé au Travail. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
