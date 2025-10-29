import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Building2, Phone, Mail, MapPin, Clock, Users, Heart, 
  Shield, Stethoscope, Activity, AlertTriangle, Truck,
  Baby, Pill, FlaskConical, UserCheck, Calendar, Home,
  ChevronRight, Info, Globe, Award, Target, Sparkles,
  CheckCircle, ArrowRight, LogIn, ChevronLeft, Star,
  TrendingUp, Smile, Eye, Microscope, Menu
} from "lucide-react";
import sogaraDoctorFemale from "@/assets/sogara-doctor-female.jpg";
import sogaraDoctorMale from "@/assets/sogara-doctor-male.jpg";
import sogaraPediatrician from "@/assets/sogara-pediatrician.jpg";
import sogaraFamilyHealth from "@/assets/sogara-family-health.jpg";
import sogaraReception from "@/assets/sogara-reception.jpg";
import SogaraLocationMap from "@/components/maps/SogaraLocationMap";

export default function SogaraPublic() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token: mapboxToken } = useMapboxToken();

  const doctors = [
    {
      name: "Dr. Sophie Taylor",
      specialty: "Cardiologie",
      image: sogaraDoctorFemale,
      rating: 4.9,
      patients: 1250
    },
    {
      name: "Dr. Marc Dubois",
      specialty: "Chirurgie",
      image: sogaraDoctorMale,
      rating: 4.8,
      patients: 980
    },
    {
      name: "Dr. Lisa Chen",
      specialty: "Pédiatrie",
      image: sogaraPediatrician,
      rating: 5.0,
      patients: 1520
    },
    {
      name: "Dr. Jean Nkosi",
      specialty: "Médecine du Travail",
      image: sogaraDoctorMale,
      rating: 4.9,
      patients: 1100
    }
  ];

  const services = [
    {
      icon: AlertTriangle,
      title: "Service d'Urgences 24/7",
      description: "Équipe médicale disponible jour et nuit pour toutes vos urgences"
    },
    {
      icon: Baby,
      title: "Maternité Moderne",
      description: "Accompagnement complet de la grossesse à l'accouchement"
    },
    {
      icon: Stethoscope,
      title: "Consultations Spécialisées",
      description: "Large gamme de spécialités médicales et chirurgicales"
    },
    {
      icon: FlaskConical,
      title: "Laboratoire d'Analyses",
      description: "Analyses médicales complètes avec résultats rapides"
    },
    {
      icon: Activity,
      title: "Bloc Opératoire",
      description: "Équipements chirurgicaux de dernière génération"
    },
    {
      icon: Shield,
      title: "Médecine Préventive",
      description: "Bilans de santé et suivi médical personnalisé"
    }
  ];

  const features = [
    {
      icon: Microscope,
      title: "Équipements Modernes",
      description: "Technologies médicales de pointe pour des diagnostics précis et des soins de qualité"
    },
    {
      icon: TrendingUp,
      title: "Système de Facturation Simple",
      description: "Gestion facilitée avec la CNAMGS. Prise en charge directe et transparente"
    },
    {
      icon: UserCheck,
      title: "Personnel Qualifié",
      description: "Équipe médicale hautement qualifiée et expérimentée à votre service"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src="/cmst_sogara_logo.png" alt="CMST SOGARA" className="h-12 w-auto rounded" />
              <div>
                <h1 className="text-base font-bold text-gray-900">CMST SOGARA</h1>
                <p className="text-[10px] text-gray-500">Centre Médical de Santé au Travail</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">À Propos</a>
              <a href="#services" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Services</a>
              <a href="#doctors" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Médecins</a>
              <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Contact</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/")}
                className="hidden sm:flex"
              >
                <img src="/logo_sante.png" alt="SANTE.GA" className="w-4 h-4 mr-2" />
                SANTE.GA
              </Button>
              <Button 
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 hidden md:flex"
                onClick={() => navigate("/login/sogara")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Personnel CMST
              </Button>
              
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <img src="/cmst_sogara_logo.png" alt="CMST SOGARA" className="h-10 w-auto rounded" />
                      <span className="text-sm">CMST SOGARA</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-4">
                    <a 
                      href="#about" 
                      className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      À Propos
                    </a>
                    <a 
                      href="#services" 
                      className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Services
                    </a>
                    <a 
                      href="#doctors" 
                      className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Médecins
                    </a>
                    <a 
                      href="#contact" 
                      className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact
                    </a>
                    <div className="pt-4 mt-4 border-t space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/");
                        }}
                      >
                        <img src="/logo_sante.png" alt="SANTE.GA" className="w-4 h-4 mr-2" />
                        SANTE.GA
                      </Button>
                      <Button 
                        className="w-full bg-gray-900 hover:bg-gray-800"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/login/sogara");
                        }}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Personnel CMST
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-16 pt-12 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Excellence
              <br />
              <span className="text-gray-400">Médicale sans</span>
              <br />
              contraintes
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Centre médical moderne au service des employés SOGARA et leurs familles depuis 1974
            </p>

            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg" 
                className="bg-gray-900 hover:bg-gray-800 text-white px-7 py-5 rounded-full"
                onClick={() => navigate("/appointments")}
              >
                Prendre Rendez-vous
              </Button>
              <Button 
                size="lg" 
                variant="ghost"
                className="text-gray-900 px-7 py-5 rounded-full hover:bg-gray-100"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Full Width Image */}
        <div className="container mx-auto px-4 lg:px-16 pb-16">
          <img 
            src={sogaraDoctorFemale}
            alt="Équipe Médicale" 
            className="w-full h-[350px] lg:h-[500px] object-cover rounded-3xl"
          />
        </div>
      </section>

      {/* Vision Statement */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Des idées audacieuses
                <br />
                pour la vie
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                Depuis 1974, le CMST SOGARA s'engage à offrir des soins de santé de qualité supérieure 
                aux employés de la Société Gabonaise de Raffinage et à leurs familles.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Notre mission : votre bien-être et votre santé au quotidien avec des équipements 
                de pointe et une équipe médicale dévouée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="bg-white py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Nos Services
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Transformez votre
                <br />
                vision en santé
              </h2>
              <p className="text-base text-gray-600">
                Des services médicaux complets pour prendre soin de vous et de votre famille
              </p>
            </div>

            <div className="space-y-16">
              {/* Service 1 */}
              <div>
                <img 
                  src={sogaraDoctorMale}
                  alt="Urgences"
                  className="w-full h-[320px] object-cover rounded-2xl mb-6"
                />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Service d'Urgences 24/7</h3>
                    <p className="text-base text-gray-600">
                      Équipe médicale disponible jour et nuit pour toutes vos urgences. 
                      Prise en charge rapide et efficace.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service 2 */}
              <div>
                <img 
                  src={sogaraPediatrician}
                  alt="Maternité"
                  className="w-full h-[320px] object-cover rounded-2xl mb-6"
                />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Baby className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Maternité Moderne</h3>
                    <p className="text-base text-gray-600">
                      Accompagnement complet de la grossesse à l'accouchement avec 
                      des équipements de pointe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service 3 */}
              <div>
                <img 
                  src={sogaraFamilyHealth}
                  alt="Consultations"
                  className="w-full h-[320px] object-cover rounded-2xl mb-6"
                />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Consultations Spécialisées</h3>
                    <p className="text-base text-gray-600">
                      Large gamme de spécialités médicales et chirurgicales pour 
                      tous vos besoins de santé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-3">85</div>
              <p className="text-lg text-gray-600">Lits d'hospitalisation disponibles</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-3">12</div>
              <p className="text-lg text-gray-600">Médecins spécialistes qualifiés</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-3">50+</div>
              <p className="text-lg text-gray-600">Années d'excellence médicale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="doctors" className="bg-white py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="mb-12">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Notre Équipe
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
              Pourquoi nous choisir pour
              <br />
              construire l'avenir ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => (
              <div key={index} className="group">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                  <span className="font-semibold text-xs">{doctor.rating}</span>
                  <span className="text-xs text-gray-500">• {doctor.patients} patients</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Prêt à commencer
              <br />
              à construire ?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Prenez rendez-vous dès aujourd'hui et bénéficiez de soins médicaux de qualité
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-7 py-5 rounded-full"
                onClick={() => navigate("/appointments")}
              >
                Prendre Rendez-vous
              </Button>
              <Button 
                size="lg" 
                variant="ghost"
                className="text-white px-7 py-5 rounded-full hover:bg-white/10"
              >
                <Phone className="w-4 h-4 mr-2" />
                011 55 26 21
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Contact
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nous Contacter</h2>
                <p className="text-base text-gray-600">
                  Notre équipe est à votre disposition
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Adresse</p>
                  <p className="text-base text-gray-600">Route de la Sogara<br />Port-Gentil, Gabon</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Téléphone</p>
                  <p className="text-base text-gray-600">
                    Standard: 011 55 26 21<br />
                    Urgences: 011 55 26 22
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Email</p>
                  <p className="text-base text-gray-600">service.rgc@sogara.com</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Horaires</p>
                  <p className="text-base text-gray-600">
                    Lun-Ven: 07h00 - 17h00<br />
                    Urgences: 24h/24, 7j/7
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <SogaraLocationMap accessToken={mapboxToken} />
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/cmst_sogara_logo.png" alt="CMST SOGARA" className="h-9 w-auto rounded" />
              </div>
              <p className="text-sm text-gray-600">
                Excellence médicale depuis 1974
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Urgences</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Consultations</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Chirurgie</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Maternité</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">À Propos</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Notre Équipe</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Nos Valeurs</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Carrières</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Actualités</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Port-Gentil, Gabon</li>
                <li>011 55 26 21</li>
                <li>service.rgc@sogara.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-wrap justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2024 CMST SOGARA. Tous droits réservés.</p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Certifié ISO 9001</span>
              <span>Conventionné CNAMGS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
