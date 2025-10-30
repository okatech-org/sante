import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Building2, Phone, Mail, MapPin, Clock, Users, Heart, Shield, Stethoscope, Activity, AlertTriangle, Truck, Baby, Pill, FlaskConical, UserCheck, Calendar, Home, ChevronRight, Info, Globe, Award, Target, Sparkles, CheckCircle, ArrowRight, LogIn, ChevronLeft, Star, TrendingUp, Smile, Eye, Microscope, Menu } from "lucide-react";
import sogaraDoctorFemale from "@/assets/sogara-doctor-female.jpg";
import sogaraDoctorMale from "@/assets/sogara-doctor-male.jpg";
import sogaraPediatrician from "@/assets/sogara-pediatrician.jpg";
import sogaraFamilyHealth from "@/assets/sogara-family-health.jpg";
import sogaraReception from "@/assets/sogara-reception.jpg";
import SogaraLocationMap from "@/components/maps/SogaraLocationMap";
export default function SogaraPublic() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    token: mapboxToken
  } = useMapboxToken();
  const doctors = [{
    name: "Dr. Sophie Taylor",
    specialty: "Cardiologie",
    image: sogaraDoctorFemale,
    rating: 4.9,
    patients: 1250
  }, {
    name: "Dr. Marc Dubois",
    specialty: "Chirurgie",
    image: sogaraDoctorMale,
    rating: 4.8,
    patients: 980
  }, {
    name: "Dr. Lisa Chen",
    specialty: "Pédiatrie",
    image: sogaraPediatrician,
    rating: 5.0,
    patients: 1520
  }, {
    name: "Dr. Jean Nkosi",
    specialty: "Médecine du Travail",
    image: sogaraDoctorMale,
    rating: 4.9,
    patients: 1100
  }];
  const services = [{
    icon: AlertTriangle,
    title: "Service d'Urgences 24/7",
    description: "Équipe médicale disponible jour et nuit pour toutes vos urgences"
  }, {
    icon: Baby,
    title: "Maternité Moderne",
    description: "Accompagnement complet de la grossesse à l'accouchement"
  }, {
    icon: Stethoscope,
    title: "Consultations Spécialisées",
    description: "Large gamme de spécialités médicales et chirurgicales"
  }, {
    icon: FlaskConical,
    title: "Laboratoire d'Analyses",
    description: "Analyses médicales complètes avec résultats rapides"
  }, {
    icon: Activity,
    title: "Bloc Opératoire",
    description: "Équipements chirurgicaux de dernière génération"
  }, {
    icon: Shield,
    title: "Médecine Préventive",
    description: "Bilans de santé et suivi médical personnalisé"
  }];
  const features = [{
    icon: Microscope,
    title: "Équipements Modernes",
    description: "Technologies médicales de pointe pour des diagnostics précis et des soins de qualité"
  }, {
    icon: TrendingUp,
    title: "Système de Facturation Simple",
    description: "Gestion facilitée avec la CNAMGS. Prise en charge directe et transparente"
  }, {
    icon: UserCheck,
    title: "Personnel Qualifié",
    description: "Équipe médicale hautement qualifiée et expérimentée à votre service"
  }];
  return <div className="min-h-screen bg-white">
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
              <Button variant="outline" size="sm" onClick={() => navigate("/")} className="hidden sm:flex">
                <img src="/logo_sante.png" alt="SANTE.GA" className="w-4 h-4 mr-2" />
                SANTE.GA
              </Button>
              <Button size="sm" className="bg-gray-900 hover:bg-gray-800 hidden md:flex" onClick={() => navigate("/login/sogara")}>
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
                    <a href="#about" className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      À Propos
                    </a>
                    <a href="#services" className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Services
                    </a>
                    <a href="#doctors" className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Médecins
                    </a>
                    <a href="#contact" className="text-base font-medium text-gray-700 hover:text-blue-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Contact
                    </a>
                    
                    {/* Boutons Téléphone */}
                    <div className="pt-4 mt-4 border-t space-y-3">
                      <a 
                        href="tel:+241074521880" 
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-full text-sm transition-colors w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Phone className="w-4 h-4" />
                        Urgence : +241 07 45 21 88
                      </a>
                      
                      <a 
                        href="tel:+241015611280"
                        className="flex items-center justify-center gap-2 text-gray-900 px-4 py-3 rounded-full hover:bg-gray-100 text-sm transition-colors border border-gray-300 w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Phone className="w-4 h-4" />
                        +241 01 56 11 28
                      </a>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t space-y-3">
                      <Button variant="outline" className="w-full justify-start" onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/");
                    }}>
                        <img src="/logo_sante.png" alt="SANTE.GA" className="w-4 h-4 mr-2" />
                        SANTE.GA
                      </Button>
                      <Button className="w-full bg-gray-900 hover:bg-gray-800" onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login/sogara");
                    }}>
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

      {/* Hero Section - Two Columns */}
      <section className="relative bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-16 py-8 md:py-10 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 leading-[1.1] tracking-tight">
                Excellence Médicale
                <br />
                <span className="text-gray-400">Sans contraintes</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-5 md:mb-6">
                Centre médical moderne au service des employés SOGARA et leurs familles depuis 1974
              </p>

              {/* Boutons */}
              <div className="flex gap-2 mb-8 md:mb-10 overflow-x-auto">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-3 md:px-6 h-10 md:h-14 rounded-full text-xs md:text-base whitespace-nowrap flex-shrink-0" onClick={() => navigate("/appointments")}>
                  Prendre RDV
                </Button>
                
                <a 
                  href="tel:+241074521880" 
                  className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 md:px-6 h-10 md:h-14 rounded-full text-xs md:text-base transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Urgence
                </a>
                
                <a 
                  href="tel:+241015611280"
                  className="inline-flex items-center justify-center gap-1.5 text-gray-900 px-3 md:px-6 h-10 md:h-14 rounded-full hover:bg-gray-100 text-xs md:text-base transition-colors border border-gray-300 whitespace-nowrap flex-shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Appel
                </a>
              </div>

              {/* Stats Inline */}
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">85</div>
                  <p className="text-xs md:text-sm text-gray-600">Lits disponibles</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">12</div>
                  <p className="text-xs md:text-sm text-gray-600">Médecins qualifiés</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">50+</div>
                  <p className="text-xs md:text-sm text-gray-600">Années d'excellence</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="order-first lg:order-last">
              <img src={sogaraDoctorFemale} alt="Équipe Médicale" className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-2xl md:rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="bg-gray-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-5 lg:mb-6 leading-tight">
                Des idées audacieuses
                <br />
                pour la vie
              </h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
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
      <section id="services" className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-16">
          {/* Header - Full Width */}
          <div className="mb-10 md:mb-12 lg:mb-16">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Nos Services
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-5 leading-tight">
              Transformez votre vision en santé
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl">
              Des services médicaux complets pour prendre soin de vous et de votre famille
            </p>
          </div>

          {/* Services Grid - Full Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Service 1 */}
            <div>
              <img src={sogaraDoctorMale} alt="Urgences" className="w-full h-[240px] md:h-[280px] lg:h-[320px] object-cover rounded-xl md:rounded-2xl mb-4 md:mb-5 lg:mb-6" />
              <div className="flex items-start gap-2.5 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">Service d'Urgences 24/7</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Équipe médicale disponible jour et nuit pour toutes vos urgences. 
                    Prise en charge rapide et efficace.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div>
              <img src={sogaraPediatrician} alt="Maternité" className="w-full h-[240px] md:h-[280px] lg:h-[320px] object-cover rounded-xl md:rounded-2xl mb-4 md:mb-5 lg:mb-6" />
              <div className="flex items-start gap-2.5 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Baby className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">Maternité Moderne</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Accompagnement complet de la grossesse à l'accouchement avec 
                    des équipements de pointe.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div>
              <img src={sogaraFamilyHealth} alt="Consultations" className="w-full h-[240px] md:h-[280px] lg:h-[320px] object-cover rounded-xl md:rounded-2xl mb-4 md:mb-5 lg:mb-6" />
              <div className="flex items-start gap-2.5 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">Consultations Spécialisées</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Large gamme de spécialités médicales et chirurgicales pour 
                    tous vos besoins de santé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section id="doctors" className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="mb-8 md:mb-10 lg:mb-12">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">
              Notre Équipe
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-5 leading-tight">
              Pourquoi nous choisir pour
              <br />
              construire l'avenir ?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {doctors.map((doctor, index) => <div key={index} className="group">
                <div className="relative mb-3 md:mb-4 overflow-hidden rounded-xl md:rounded-2xl">
                  <img src={doctor.image} alt={doctor.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-0.5 md:mb-1">{doctor.name}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-1.5 md:mb-2">{doctor.specialty}</p>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-gray-900 text-gray-900" />
                  <span className="font-semibold text-[10px] md:text-xs">{doctor.rating}</span>
                  <span className="text-[10px] md:text-xs text-gray-500">• {doctor.patients}</span>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section with Contact Info */}
      <section id="contact" className="bg-gray-900 text-white py-8 md:py-10 lg:py-12">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-8 items-stretch">
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                  Prêt à commencer
                  <br />
                  à construire ?
                </h2>
                <p className="text-base md:text-lg text-gray-400 mb-5 md:mb-6">
                  Prenez rendez-vous dès aujourd'hui et bénéficiez de soins médicaux de qualité
                </p>
                
                {/* Boutons alignés */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-6">
                  {/* Bouton Urgence */}
                  <a 
                    href="tel:+241074521880" 
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 md:px-6 h-12 md:h-14 rounded-full text-sm md:text-base transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4" />
                    Urgence : +241 07 45 21 88
                  </a>
                  
                  <Button 
                    size="lg" 
                    className="bg-white text-gray-900 hover:bg-gray-100 px-4 md:px-6 h-12 md:h-14 rounded-full text-sm md:text-base"
                    onClick={() => navigate("/appointments")}
                  >
                    Prendre RDV
                  </Button>
                  
                  <a 
                    href="tel:+241015611280"
                    className="inline-flex items-center justify-center gap-2 text-white px-4 md:px-6 h-12 md:h-14 rounded-full hover:bg-white/10 text-sm md:text-base transition-colors border border-white/20 whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4" />
                    +241 01 56 11 28
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-5 border-t border-white/20">
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-0.5">Adresse</p>
                  <p className="text-sm text-white leading-tight">Route de la Sogara, Port-Gentil</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-0.5">Email</p>
                  <p className="text-sm text-white">sogara@sante.ga</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-0.5">Horaires</p>
                  <p className="text-sm text-white leading-tight">Lun - Ven: 8h - 17h • Sam: 8h - 12h</p>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="h-80 lg:h-full min-h-[400px] rounded-xl overflow-hidden">
              <SogaraLocationMap accessToken={mapboxToken} />
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Certifications */}
      <section className="bg-gray-50 py-8 md:py-10 border-t">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Nos Partenaires & Certifications
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center mb-4 md:mb-6">
            {/* CNAMGS */}
            <div className="flex items-center justify-center">
              <img src="/cnamgs_logo.png" alt="CNAMGS" className="h-10 md:h-12 w-auto" />
            </div>

            {/* SOGARA */}
            <div className="flex items-center justify-center">
              <img src="/logo_sogara.png" alt="SOGARA" className="h-10 md:h-12 w-auto" />
            </div>

            {/* Ministère de la Santé */}
            <div className="flex items-center justify-center">
              <img src="/logo_sante.png" alt="Ministère de la Santé" className="h-10 md:h-12 w-auto" />
            </div>

            {/* Sceau du Gabon */}
            <div className="flex items-center justify-center">
              <img src="/Sceau du Gabon.png" alt="République Gabonaise" className="h-10 md:h-12 w-auto" />
            </div>
          </div>

          {/* Certifications Text */}
          <div className="text-center">
            <div className="inline-flex flex-wrap justify-center items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>ISO 9001</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>CNAMGS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Ministère Santé</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 md:py-10 lg:py-12">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-10 lg:mb-12">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2">
                <img src="/cmst_sogara_logo.png" alt="CMST SOGARA" className="h-8 md:h-9 w-auto rounded" />
                <div>
                  <p className="text-xs md:text-sm font-bold text-gray-900">CMST SOGARA</p>
                  <p className="text-[10px] md:text-xs text-gray-600">Centre Médical</p>
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-gray-600">
                Excellence médicale depuis 1974
              </p>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">Services</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Urgences</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Consultations</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Chirurgie</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Maternité</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">Centre Médical</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Notre Équipe</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Nos Valeurs</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Carrières</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Actualités</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">Contact</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                <li>Port-Gentil, Gabon</li>
                <li>011 55 26 21</li>
                <li>service.rgc@sogara.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-5 md:pt-6 border-t flex flex-wrap justify-between items-center gap-3 md:gap-4">
            <p className="text-xs md:text-sm text-gray-600">© 2024 CMST SOGARA. Tous droits réservés.</p>
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
              <span>Certifié ISO 9001</span>
              <span>Conventionné CNAMGS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}