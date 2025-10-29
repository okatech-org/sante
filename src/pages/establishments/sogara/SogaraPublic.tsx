import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Phone, Mail, MapPin, Clock, Users, Heart, 
  Shield, Stethoscope, Activity, AlertTriangle, Truck,
  Baby, Pill, FlaskConical, UserCheck, Calendar, Home,
  ChevronRight, Info, Globe, Award, Target, Sparkles,
  CheckCircle, ArrowRight, LogIn
} from "lucide-react";

export default function SogaraPublic() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("presentation");

  const services = [
    {
      icon: AlertTriangle,
      title: "Urgences 24/7",
      description: "Service d'urgence disponible jour et nuit",
      available: true,
      details: ["Médecins urgentistes", "2 ambulances", "Réanimation"]
    },
    {
      icon: Stethoscope,
      title: "Consultations Générales",
      description: "Médecine générale et spécialisée",
      available: true,
      details: ["Médecine du travail", "Médecine générale", "Suivi médical"]
    },
    {
      icon: Baby,
      title: "Maternité",
      description: "Suivi grossesse et accouchement",
      available: true,
      details: ["Consultations prénatales", "Accouchements", "Suivi postnatal"]
    },
    {
      icon: Activity,
      title: "Chirurgie",
      description: "Interventions chirurgicales programmées",
      available: true,
      details: ["Chirurgie générale", "Bloc opératoire moderne", "Anesthésie"]
    },
    {
      icon: FlaskConical,
      title: "Laboratoire",
      description: "Analyses médicales complètes",
      available: true,
      details: ["Biologie", "Hématologie", "Biochimie"]
    },
    {
      icon: Shield,
      title: "Médecine du Travail",
      description: "Suivi santé des employés SOGARA",
      available: true,
      details: ["Visites médicales", "Prévention", "Aptitude au travail"]
    }
  ];

  const stats = {
    employees: "1,250",
    beneficiaries: "420",
    beds: "85",
    doctors: "12",
    nurses: "28",
    ambulances: "2"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CMST SOGARA</h1>
                <p className="text-xs text-muted-foreground">Centre de Médecine de Santé au Travail</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/")}
              >
                <Home className="w-4 h-4 mr-2" />
                Accueil SANTE.GA
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate("/login/professional")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Espace Professionnel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Award className="w-3 h-3 mr-1" />
              Établissement Certifié ISO 9001
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Centre de Médecine de Santé au Travail SOGARA
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Excellence médicale au service des employés SOGARA et leurs familles depuis 1974
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/appointments")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => setActiveTab("contact")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Nous Contacter
              </Button>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-12 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{stats.employees}</div>
              <div className="text-xs text-blue-200">Employés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{stats.beneficiaries}</div>
              <div className="text-xs text-blue-200">Ayants droit</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{stats.beds}</div>
              <div className="text-xs text-blue-200">Lits</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{stats.doctors}</div>
              <div className="text-xs text-blue-200">Médecins</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{stats.nurses}</div>
              <div className="text-xs text-blue-200">Infirmiers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{stats.ambulances}</div>
              <div className="text-xs text-blue-200">Ambulances</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="presentation">Présentation</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="horaires">Horaires</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="presentation" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  À propos du CMST SOGARA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Le Centre de Médecine de Santé au Travail (CMST) SOGARA est un établissement de santé 
                  d'excellence dédié aux employés de la Société Gabonaise de Raffinage et à leurs familles. 
                  Situé à Port-Gentil, notre centre offre une gamme complète de services médicaux avec 
                  des équipements de pointe et une équipe médicale hautement qualifiée.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Notre Mission
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Assurer la santé et le bien-être des employés SOGARA</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Prévenir les risques professionnels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Offrir des soins de qualité aux ayants droit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Gérer les urgences médicales 24h/24</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Nos Certifications
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline">ISO 9001:2015</Badge>
                        <span>Management de la qualité</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline">CNAMGS</Badge>
                        <span>Conventionné assurance maladie</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline">CNSS</Badge>
                        <span>Agréé sécurité sociale</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        {service.available && (
                          <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
                            Disponible
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-3">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {service.details.map((detail, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="horaires" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horaires d'Ouverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Services Généraux</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Lundi - Vendredi</span>
                        <span className="font-medium">07:00 - 17:00</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Samedi</span>
                        <span className="font-medium">08:00 - 13:00</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Dimanche</span>
                        <span className="font-medium">Fermé</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Services d'Urgence</h3>
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-900 dark:text-red-400">24h/24, 7j/7</p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Service d'urgence toujours disponible
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Nous Contacter</CardTitle>
                <CardDescription>
                  Plusieurs moyens pour nous joindre selon vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Adresse</p>
                        <p className="text-sm text-muted-foreground">
                          Route de la Sogara<br />
                          Port-Gentil, Gabon
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Téléphones</p>
                        <p className="text-sm text-muted-foreground">
                          Standard: 011 55 26 21<br />
                          Urgences: 011 55 26 22<br />
                          RDV: 011 55 26 23
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">
                          service.rgc@sogara.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Coordonnées GPS</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          -0.681398, 8.772557
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900 dark:text-orange-400">
                        Urgences Médicales
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        En cas d'urgence médicale, appelez directement le <strong>011 55 26 22</strong> 
                        ou présentez-vous directement au service des urgences, disponible 24h/24.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Besoin de soins médicaux ?
          </h2>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Prenez rendez-vous en ligne ou contactez-nous directement pour bénéficier 
            de nos services médicaux de qualité.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/appointments")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Prendre Rendez-vous
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white/20"
              onClick={() => window.location.href = "tel:0115526221"}
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
              <span>Conventionné CNAMGS & CNSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
