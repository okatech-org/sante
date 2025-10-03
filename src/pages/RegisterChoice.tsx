import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";

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
  const type = searchParams.get('type');
  
  useEffect(() => {
    // Redirection automatique si le type est patient
    if (type === 'patient') {
      navigate('/register/patient', { replace: true });
    }
  }, [type, navigate]);
  
  // Filtrer les types selon le paramètre
  const displayedUserTypes = type === 'pro' 
    ? userTypes.filter(user => user.type !== 'patient')
    : userTypes;
  
  const title = type === 'pro' 
    ? 'Inscription Professionnel de Santé' 
    : 'Bienvenue sur SANTE.GA';
    
  const subtitle = type === 'pro'
    ? 'Choisissez votre type de profil professionnel'
    : 'Choisissez votre profil pour commencer';
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          {type === 'pro' && (
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          )}
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-9 w-9 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedUserTypes.map((user) => (
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
