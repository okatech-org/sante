import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, Stethoscope, ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const navigate = useNavigate();

  const loginOptions = [
    {
      title: "Patient",
      description: "Accédez à votre espace santé personnel",
      icon: Heart,
      color: "bg-blue-500",
      route: "/login/patient",
      features: ["Dossier médical", "Prise de RDV", "Téléconsultation", "Suivi CNAMGS"],
      badge: null,
    },
    {
      title: "Professionnel de santé",
      description: "Gérez vos consultations et patients",
      icon: Stethoscope,
      color: "bg-green-500",
      route: "/login/professional",
      features: ["Agenda médical", "Prescriptions", "Dossiers patients", "Télémédecine"],
      badge: "Pro",
    },
    {
      title: "Administrateur",
      description: "Administrez la plateforme",
      icon: Shield,
      color: "bg-purple-500",
      route: "/login/admin",
      features: ["Gestion utilisateurs", "Statistiques", "Modération", "Configuration"],
      badge: "Admin",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur SANTE.GA</h1>
          <p className="text-xl text-muted-foreground">
            Sélectionnez votre type de compte pour vous connecter
          </p>
        </div>

        {/* Login Options Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {loginOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.route}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(option.route)}
              >
                {option.badge && (
                  <Badge className="absolute top-4 right-4 z-10">
                    {option.badge}
                  </Badge>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-lg ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    Se connecter
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="link"
              onClick={() => navigate("/register/patient")}
              className="text-primary"
            >
              Créer un compte patient
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="link"
              onClick={() => navigate("/register/professional")}
              className="text-primary"
            >
              Inscription professionnel
            </Button>
          </div>
          
          <div className="pt-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
