import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Building2, Phone, Mail, MapPin, Heart, 
  Shield, Stethoscope, Activity, AlertTriangle,
  Baby, FlaskConical, Calendar, Users, Award,
  CheckCircle, Clock, Truck, Bed, UserCheck, HeartPulse
} from "lucide-react";

export default function Sogara() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("presentation");

  const stats = [
    { icon: Users, value: "1,250", label: "Employés" },
    { icon: UserCheck, value: "420", label: "Ayants droit" },
    { icon: Bed, value: "85", label: "Lits" },
    { icon: Stethoscope, value: "12", label: "Médecins" },
    { icon: HeartPulse, value: "28", label: "Infirmiers" },
    { icon: Truck, value: "2", label: "Ambulances" }
  ];

  const services = [
    {
      icon: AlertTriangle,
      title: "Urgences 24/7",
      description: "Service d'urgence disponible jour et nuit pour toute situation médicale"
    },
    {
      icon: Stethoscope,
      title: "Consultations",
      description: "Médecine générale et consultations spécialisées"
    },
    {
      icon: Baby,
      title: "Maternité",
      description: "Suivi de grossesse et soins maternels complets"
    },
    {
      icon: Activity,
      title: "Chirurgie",
      description: "Bloc opératoire moderne pour interventions chirurgicales"
    },
    {
      icon: FlaskConical,
      title: "Laboratoire",
      description: "Analyses médicales et examens biologiques"
    },
    {
      icon: Shield,
      title: "Médecine du Travail",
      description: "Suivi santé des employés et prévention des risques"
    }
  ];

  const certifications = [
    { label: "ISO 9001:2015", description: "Management de la qualité" },
    { label: "CNAMGS", description: "Conventionné assurance maladie" },
    { label: "CNSS", description: "Agréé sécurité sociale" }
  ];

  const missionItems = [
    "Assurer la santé et le bien-être des employés SOGARA",
    "Prévenir les risques professionnels",
    "Offrir des soins de qualité aux ayants droit",
    "Gérer les urgences médicales 24h/24"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CMST SOGARA</h1>
                <p className="text-xs text-muted-foreground">Centre de Médecine de Santé au Travail</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <MapPin className="w-4 h-4 mr-2" />
                Accueil SANTE.GA
              </Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" size="sm">
                Espace Professionnel
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center text-white space-y-6 max-w-5xl mx-auto">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Award className="w-3 h-3 mr-1" />
              Établissement Certifié ISO 9001
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Centre de Médecine de Santé au Travail
              <span className="block mt-2">SOGARA</span>
            </h1>
            
            <p className="text-xl text-blue-50 max-w-3xl mx-auto">
              Excellence médicale au service des employés SOGARA et leurs familles depuis 1974
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
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
                Nous Contacter
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <Icon className="w-8 h-8 text-white mb-3 mx-auto" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white dark:bg-gray-900 border-b sticky top-[73px] z-40">
        <div className="container mx-auto px-6">
          <nav className="flex gap-8">
            {["presentation", "services", "horaires", "contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-16">
        {/* Presentation Tab */}
        {activeTab === "presentation" && (
          <div className="max-w-6xl mx-auto space-y-12">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">À propos du CMST SOGARA</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Centre de Médecine de Santé au Travail (CMST) SOGARA est un établissement de santé d'excellence dédié aux employés de la Société Gabonaise de Raffinage et à leurs familles. Situé à Port-Gentil, notre centre offre une gamme complète de services médicaux avec des équipements de pointe et une équipe médicale hautement qualifiée.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold">Notre Mission</h3>
                  </div>
                  <ul className="space-y-3">
                    {missionItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold">Nos Certifications</h3>
                  </div>
                  <ul className="space-y-4">
                    {certifications.map((cert, index) => (
                      <li key={index}>
                        <Badge variant="outline" className="mb-2">{cert.label}</Badge>
                        <p className="text-sm text-muted-foreground">{cert.description}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Nos Services Médicaux</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une gamme complète de services médicaux pour répondre à tous vos besoins de santé
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Horaires Tab */}
        {activeTab === "horaires" && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Horaires d'Ouverture</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Consultations Programmées
                      </h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Lundi - Vendredi: 7h30 - 16h30</p>
                        <p>Samedi: 8h00 - 12h00</p>
                        <p>Dimanche: Fermé</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Urgences
                      </h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p className="font-semibold text-foreground">24h/24 - 7j/7</p>
                        <p>Service d'urgence disponible en permanence</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Contactez-nous</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Adresse</h3>
                        <p className="text-muted-foreground">
                          Zone Industrielle SOGARA<br />
                          Port-Gentil, Gabon
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Téléphone</h3>
                        <p className="text-muted-foreground">
                          +241 01 55 55 00<br />
                          +241 01 55 55 01
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">cmst@sogara.ga</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-24 h-24 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Notre équipe est à votre écoute pour répondre à toutes vos questions
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Besoin de soins médicaux ?</h2>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto mb-8">
            Prenez rendez-vous en ligne ou contactez-nous directement pour bénéficier de nos services médicaux de qualité.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-emerald-50"
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
              +241 01 55 55 00
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
