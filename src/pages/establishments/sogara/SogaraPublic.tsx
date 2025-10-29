import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building2, Phone, Mail, MapPin, Clock, Users, Heart, 
  Shield, Stethoscope, Activity, AlertTriangle, Truck,
  Baby, Pill, FlaskConical, UserCheck, Calendar, Home,
  ChevronRight, Info, Globe, Award, Target, Sparkles,
  CheckCircle, ArrowRight, LogIn, ChevronLeft, Star,
  TrendingUp, Smile, Eye, Microscope
} from "lucide-react";

export default function SogaraPublic() {
  const navigate = useNavigate();

  const doctors = [
    {
      name: "Dr. Sophie Taylor",
      specialty: "Cardiologie",
      image: "/placeholder.svg",
      rating: 4.9,
      patients: 1250
    },
    {
      name: "Dr. Marc Dubois",
      specialty: "Chirurgie",
      image: "/placeholder.svg",
      rating: 4.8,
      patients: 980
    },
    {
      name: "Dr. Lisa Chen",
      specialty: "Pédiatrie",
      image: "/placeholder.svg",
      rating: 5.0,
      patients: 1520
    },
    {
      name: "Dr. Jean Nkosi",
      specialty: "Médecine du Travail",
      image: "/placeholder.svg",
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
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CMST SOGARA</h1>
                <p className="text-xs text-gray-500">Centre Médical de Santé au Travail</p>
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
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <Button 
                size="sm"
                className="bg-gray-900 hover:bg-gray-800"
                onClick={() => navigate("/login/professional")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Excellence Médicale,
                  <span className="text-blue-600"> Bien-être Assuré</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
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
              <div className="flex items-center gap-8 pt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="border-2 border-white w-12 h-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>P{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">150k+</p>
                  <p className="text-sm text-gray-600">Patients Satisfaits</p>
                </div>
              </div>

              {/* Experience Stats */}
              <div className="grid grid-cols-2 gap-6 pt-4">
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

            {/* Right Content - Doctor Images */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-3 gap-4">
                {/* Main doctor */}
                <div className="col-span-3 relative">
                  <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <img 
                      src="/placeholder.svg" 
                      alt="Doctor" 
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-12 left-12 bg-white rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">Dr. Jean Dupont</p>
                          <p className="text-sm text-gray-600">Médecin Chef</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute top-8 -right-4 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">200+</p>
                    <p className="text-sm text-gray-600">Médecins Expérimentés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highly Qualified Team */}
      <section id="doctors" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Équipe Hautement Qualifiée</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rencontrez nos médecins spécialistes dévoués à votre santé
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gray-50">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2 mt-6">
                    <h3 className="font-bold text-lg text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-200">
                    <Button size="sm" variant="ghost" className="rounded-full">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Large Gamme de Services Médicaux
            </h2>
            <p className="text-lg text-gray-600">
              Nous traitons votre famille avec compassion, offrant des services de santé complets 
              adaptés à vos besoins individuels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="group border-0 bg-white hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8">
                <img 
                  src="/placeholder.svg" 
                  alt="Medical Professional"
                  className="w-full h-[600px] object-cover rounded-2xl"
                />
                
                {/* Floating Stats */}
                <div className="absolute bottom-12 right-12 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Smile className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">265K</p>
                      <p className="text-sm text-gray-600">Patients Traités</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">96%</p>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Features */}
            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <Badge className="bg-blue-100 text-blue-700 border-0">
                Application Mobile
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900">
                Gestion Simplifiée de vos Soins
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
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

            {/* Right - Phone Mockup */}
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="w-80 h-[600px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-[3rem] p-4 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center space-y-4 p-8">
                        <Calendar className="w-16 h-16 mx-auto" />
                        <p className="text-sm">Interface Application</p>
                        <p className="text-xs">Gestion des Rendez-vous</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Prêt à Prendre Soin de Votre Santé ?
            </h2>
            <p className="text-xl text-blue-100">
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
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nous Contacter</h2>
                <p className="text-gray-600">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600">Route de la Sogara<br />Port-Gentil, Gabon</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Téléphone</p>
                    <p className="text-gray-600">
                      Standard: 011 55 26 21<br />
                      Urgences: 011 55 26 22
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">service.rgc@sogara.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
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

            {/* Map or Additional Info */}
            <div className="bg-gray-100 rounded-3xl p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Globe className="w-16 h-16 mx-auto text-gray-400" />
                <p className="text-gray-600">Carte de localisation</p>
                <p className="text-sm text-gray-500">-0.681398, 8.772557</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold">CMST SOGARA</p>
                  <p className="text-xs text-gray-400">Excellence Médicale</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Centre médical moderne dédié à votre santé depuis 1974
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Urgences</a></li>
                <li><a href="#" className="hover:text-white transition">Consultations</a></li>
                <li><a href="#" className="hover:text-white transition">Chirurgie</a></li>
                <li><a href="#" className="hover:text-white transition">Maternité</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">À Propos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Notre Équipe</a></li>
                <li><a href="#" className="hover:text-white transition">Nos Valeurs</a></li>
                <li><a href="#" className="hover:text-white transition">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition">Actualités</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Port-Gentil, Gabon</li>
                <li>011 55 26 21</li>
                <li>service.rgc@sogara.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 CMST SOGARA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Certifié ISO 9001</span>
              <span>•</span>
              <span>Conventionné CNAMGS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
