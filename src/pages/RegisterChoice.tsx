import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const userTypes = [
  {
    type: "patient",
    emoji: "👤",
    title: "Patient",
    description: "Je cherche un médecin ou je veux gérer mes rendez-vous",
    href: "/register/patient",
  },
  {
    type: "doctor",
    emoji: "👨‍⚕️",
    title: "Médecin",
    description: "Je suis médecin généraliste ou spécialiste",
    href: "/register/pro?type=doctor",
  },
  {
    type: "medical-staff",
    emoji: "👩‍⚕️",
    title: "Autres Corps médicaux",
    description: "Je suis infirmier(ère), sage-femme, kinésithérapeute, etc.",
    href: "/register/pro?type=medical-staff",
  },
  {
    type: "pharmacy",
    emoji: "💊",
    title: "Pharmacie",
    description: "Je gère une pharmacie ou officine",
    href: "/register/pro?type=pharmacy",
  },
  {
    type: "laboratory",
    emoji: "🧪",
    title: "Laboratoire",
    description: "Je gère un laboratoire d'analyses médicales",
    href: "/register/pro?type=laboratory",
  },
  {
    type: "hospital",
    emoji: "🏥",
    title: "Hôpital / Clinique",
    description: "Je représente un établissement de santé",
    href: "/register/pro?type=hospital",
  },
];

export default function RegisterChoice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const type = searchParams.get('type');
    
    // Redirection automatique si le type est spécifié
    if (type === 'patient') {
      navigate('/register/patient', { replace: true });
    } else if (type === 'pro') {
      // Pour l'instant, on affiche la page de choix pour les professionnels
      // Ils peuvent choisir leur type spécifique (médecin, pharmacie, etc.)
    }
  }, [searchParams, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-9 w-9 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Bienvenue sur SANTE.GA</h1>
          <p className="text-lg text-muted-foreground">Choisissez votre profil pour commencer</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.map((user) => (
            <Link key={user.type} to={user.href}>
              <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {user.emoji}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{user.title}</CardTitle>
                  <CardDescription className="text-base">{user.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
