import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MAPBOX_PUBLIC_TOKEN } from "@/lib/mapbox-config";
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
              <div className="flex items-baseline gap-2">
                <h1 className="text-base font-bold text-gray-900">CMST SOGARA</h1>
                <span className="text-xs text-gray-500 hidden sm:inline">Centre Médical de Santé au Travail</span>
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
      <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Excellence Médicale,
                  <span className="text-blue-600"> Bien-être Assuré</span>
                </h1>
                <p className="text-base text-gray-600 leading-relaxed">
                  Centre médical moderne au service des employés SOGARA et leurs familles. 
                  Équipements de pointe, équipe qualifiée et soins de qualité depuis 1974.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8"
                  onClick={() => navigate("/appointments")}
                >
                  Prendre Rendez-vous
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-gray-300"
                >
                  En savoir plus
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[
                  { src: sogaraDoctorFemale, name: "Dr. M" },
                  { src: sogaraDoctorMale, name: "Dr. S" },
                  { src: sogaraPediatrician, name: "Dr. L" },
                  { src: sogaraDoctorMale, name: "Dr. J" }
                ].map((doctor, i) => (
                    <Avatar key={i} className="border-2 border-white w-12 h-12">
                      <AvatarImage src={doctor.src} />
                      <AvatarFallback>{doctor.name}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">150k+</p>
                  <p className="text-sm text-gray-600">Patients Satisfaits</p>
                </div>
              </div>

              {/* Experience Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-gray-900">15+</p>
                  <p className="text-sm text-gray-600">Années d'Excellence</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-gray-900">20+</p>
                  <p className="text-sm text-gray-600">Médecins Spécialistes</p>
                </div>
              </div>
            </div>

            {/* Right Content - Doctor Image */}
            <div className="relative hidden lg:block">
              <img 
                src={sogaraDoctorFemale}
                alt="Équipe Médicale" 
                className="w-full h-[400px] object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highly Qualified Team */}
      <section id="doctors" className="py-10 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Notre Équipe Médicale</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Médecins spécialistes dévoués à votre santé
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.map((doctor, index) => (
              <div key={index} className="group">
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{doctor.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-blue-600">{doctor.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Content */}
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 border-0">
                Notre Histoire
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">
                Plus de 50 ans d'Excellence Médicale
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Depuis 1974, le CMST SOGARA s'engage à offrir des soins de santé de qualité supérieure 
                aux employés de la Société Gabonaise de Raffinage et à leurs familles.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Équipements de Pointe</p>
                    <p className="text-sm text-gray-600">Technologies médicales modernes pour des diagnostics précis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Personnel Expert</p>
                    <p className="text-sm text-gray-600">Médecins et infirmiers hautement qualifiés et dévoués</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Soins Personnalisés</p>
                    <p className="text-sm text-gray-600">Approche centrée sur le patient et suivi individualisé</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">85</p>
                  <p className="text-xs text-gray-600">Lits</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-xs text-gray-600">Médecins</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">28</p>
                  <p className="text-xs text-gray-600">Infirmiers</p>
                </div>
              </div>
            </div>

            {/* Right - Image */}
            <div>
              <img 
                src={sogaraFamilyHealth}
                alt="Santé Familiale"
                className="w-full h-[350px] object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-10 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Nos Services Médicaux
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Services de santé complets adaptés à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group p-4 rounded-lg border border-gray-200 hover:border-blue-600 hover:shadow-md transition-all">
                  <Icon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="text-base font-bold text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Image */}
            <div>
              <img 
                src={sogaraReception}
                alt="Réception CMST SOGARA"
                className="w-full h-[350px] object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Right - Features */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <Icon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Content */}
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 border-0">
                Application Mobile
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">
                Gestion Simplifiée de vos Soins
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Prenez rendez-vous, consultez vos résultats, suivez vos traitements et 
                communiquez avec votre médecin directement depuis votre smartphone.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Prise de Rendez-vous Rapide</p>
                    <p className="text-sm text-gray-600">Choisissez votre médecin et votre créneau en quelques clics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Dossier Médical Numérique</p>
                    <p className="text-sm text-gray-600">Accédez à tout votre historique médical sécurisé</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Résultats en Ligne</p>
                    <p className="text-sm text-gray-600">Recevez vos résultats d'analyses directement sur l'app</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
                Télécharger l'Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Right - Image */}
            <div className="flex justify-center">
              <img 
                src="/src/assets/hero-telemedicine.jpg" 
                alt="Application Mobile"
                className="w-full max-w-md h-[350px] object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-blue-600 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à Prendre Soin de Votre Santé ?
            </h2>
            <p className="text-lg text-blue-100">
              Prenez rendez-vous dès aujourd'hui et bénéficiez de soins médicaux de qualité
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
                onClick={() => navigate("/appointments")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                011 55 26 21
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-10 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Nous Contacter</h2>
                <p className="text-gray-600">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600">Route de la Sogara<br />Port-Gentil, Gabon</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Téléphone</p>
                    <p className="text-gray-600">
                      Standard: 011 55 26 21<br />
                      Urgences: 011 55 26 22
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">service.rgc@sogara.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Horaires</p>
                    <p className="text-gray-600">
                      Lun-Ven: 07h00 - 17h00<br />
                      Urgences: 24h/24, 7j/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <SogaraLocationMap accessToken={MAPBOX_PUBLIC_TOKEN} />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-8 bg-gray-50 border-y">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/Sceau du Gabon.png" alt="République Gabonaise" className="h-10 w-auto" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Agréé par</p>
                <p className="text-xs text-gray-600">République Gabonaise<br />Ministère de la Santé</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src="/cnamgs_logo.png" alt="CNAMGS" className="h-10 w-auto" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Conventionné</p>
                <p className="text-xs text-gray-600">CNAMGS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Certifié</p>
                <p className="text-xs text-gray-600">ISO 9001:2015</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src="/logo_sogara.png" alt="SOGARA" className="h-12 w-auto" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Créé par</p>
                <p className="text-xs text-gray-600">SOGARA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src="/logo_sante.png" alt="SANTE.GA" className="h-10 w-auto" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Partenaire de</p>
                <p className="text-xs text-gray-600">SANTE.GA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-2">
                <img src="/cmst_sogara_logo.png" alt="CMST SOGARA" className="h-8 md:h-10 w-auto rounded" />
                <div>
                  <p className="text-xs md:text-sm font-bold">CMST SOGARA</p>
                  <p className="text-[10px] md:text-xs text-gray-400">Excellence Médicale</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400">
                Centre médical moderne dédié à votre santé depuis 1974
              </p>
            </div>

            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-4">Services</h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Urgences</a></li>
                <li><a href="#" className="hover:text-white transition">Consultations</a></li>
                <li><a href="#" className="hover:text-white transition">Chirurgie</a></li>
                <li><a href="#" className="hover:text-white transition">Maternité</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-4">À Propos</h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Notre Équipe</a></li>
                <li><a href="#" className="hover:text-white transition">Nos Valeurs</a></li>
                <li><a href="#" className="hover:text-white transition">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition">Actualités</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-4">Contact</h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li>Port-Gentil, Gabon</li>
                <li>011 55 26 21</li>
                <li>service.rgc@sogara.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-wrap justify-center items-center gap-2 md:gap-4">
            <p className="text-xs text-gray-400">© 2024 CMST SOGARA. Tous droits réservés.</p>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">Certifié ISO 9001</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">Conventionné CNAMGS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
