import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, Phone, Mail, MapPin, Clock, Users, Heart, 
  Shield, Stethoscope, Activity, AlertTriangle,
  Calendar, Home, Award, 
  CheckCircle, LogIn, Star, TrendingUp, Smile
} from "lucide-react";

export default function SogaraPublic() {
  const navigate = useNavigate();

  const services = [
    { icon: AlertTriangle, title: "Urgences 24/7", description: "Service d'urgence disponible jour et nuit" },
    { icon: Stethoscope, title: "Consultations", description: "Médecine générale et spécialisée" },
    { icon: Heart, title: "Maternité", description: "Suivi grossesse et accouchement" },
    { icon: Activity, title: "Chirurgie", description: "Interventions chirurgicales" },
    { icon: Shield, title: "Médecine du Travail", description: "Suivi santé employés SOGARA" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Épurée */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/logo_sante.png" alt="SANTE.GA" className="h-10 w-auto" />
              <div>
                <h1 className="font-bold text-gray-900">CMST SOGARA</h1>
                <p className="text-xs text-gray-500">Centre Médical de Santé au Travail</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <Button size="sm" onClick={() => navigate("/login/professional")}>
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Simple */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-white/20 text-white border-0">
              <Award className="w-3 h-3 mr-1" />
              Certifié ISO 9001
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Excellence Médicale au Service de SOGARA
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Centre médical moderne dédié aux employés et leurs familles depuis 1974
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/appointments")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Phone className="w-5 h-5 mr-2" />
                011 55 26 21
              </Button>
            </div>

            {/* Stats Compacts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl font-bold">85</p>
                <p className="text-sm text-blue-100">Lits</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-blue-100">Médecins</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl font-bold">28</p>
                <p className="text-sm text-blue-100">Infirmiers</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-blue-100">Urgences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Compacts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Nos Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Services médicaux complets adaptés à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Image + Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image Simple */}
            <div>
              <img 
                src="/src/assets/professionals-hero.jpg" 
                alt="Équipe Médicale"
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Info Condensée */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Excellence & Expertise
                </h2>
                <p className="text-lg text-gray-600">
                  Équipe médicale qualifiée avec équipements modernes au service de votre santé
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Équipements de dernière génération</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Personnel hautement qualifié</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Prise en charge CNAMGS</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Smile className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">265K</span>
                  </div>
                  <p className="text-sm text-gray-600">Patients Traités</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">96%</span>
                  </div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>

              {/* Certifications Compactes */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <img src="/emblem_gabon.png" alt="Gabon" className="h-8 w-auto" />
                  <span className="text-xs text-gray-600">Agréé</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/cnamgs_logo.png" alt="CNAMGS" className="h-8 w-auto" />
                  <span className="text-xs text-gray-600">Conventionné</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">ISO 9001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section Compacte */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Nous Contacter</h2>
              <p className="text-gray-600">Notre équipe est à votre disposition</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Adresse</p>
                  <p className="text-sm text-gray-600">Port-Gentil, Gabon</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Standard</p>
                  <p className="text-sm text-gray-600">011 55 26 21</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Urgences</p>
                  <p className="text-sm text-gray-600">011 55 26 22</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Horaires</p>
                  <p className="text-sm text-gray-600">24h/24, 7j/7</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Prendre Soin de Votre Santé ?
            </h2>
            <p className="text-blue-100 mb-6">
              Prenez rendez-vous dès aujourd'hui
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/appointments")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Prendre Rendez-vous
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Minimaliste */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo_sante.png" alt="SANTE.GA" className="h-8 w-auto" />
              <div>
                <p className="font-semibold">CMST SOGARA</p>
                <p className="text-xs text-gray-400">Excellence Médicale depuis 1974</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="tel:0115526221" className="hover:text-white transition">
                <Phone className="w-4 h-4 inline mr-1" />
                011 55 26 21
              </a>
              <a href="mailto:service.rgc@sogara.com" className="hover:text-white transition">
                <Mail className="w-4 h-4 inline mr-1" />
                Contact
              </a>
            </div>

            <div className="text-xs text-gray-400">
              © 2024 CMST SOGARA
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
