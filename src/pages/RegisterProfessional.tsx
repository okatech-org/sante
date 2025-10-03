import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const professionalTypes = {
  doctor: {
    title: "Inscription Médecin",
    description: "Médecin généraliste ou spécialiste"
  },
  "medical-staff": {
    title: "Inscription Personnel Médical",
    description: "Infirmier(ère), sage-femme, kinésithérapeute, etc."
  },
  pharmacy: {
    title: "Inscription Pharmacie",
    description: "Officine ou pharmacie d'établissement"
  },
  laboratory: {
    title: "Inscription Laboratoire",
    description: "Laboratoire d'analyses médicales"
  },
  hospital: {
    title: "Inscription Établissement",
    description: "Hôpital, clinique ou centre de santé"
  }
};

export default function RegisterProfessional() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') as keyof typeof professionalTypes || 'doctor';
  
  const professionalInfo = professionalTypes[type] || professionalTypes.doctor;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary/5 to-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-7 w-7 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="w-5" /> {/* Spacer */}
          </div>
          
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">{professionalInfo.title}</CardTitle>
            <CardDescription>{professionalInfo.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fonctionnalité en développement</AlertTitle>
            <AlertDescription>
              L'inscription pour les professionnels de santé est actuellement en cours de développement. 
              Cette fonctionnalité sera disponible prochainement et comprendra :
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Vérification des diplômes et qualifications</li>
                <li>Validation par l'Ordre des Médecins du Gabon</li>
                <li>Configuration du profil professionnel</li>
                <li>Gestion du planning et des disponibilités</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Vous êtes déjà inscrit ?</h3>
              <p className="text-sm text-muted-foreground">
                Si vous avez déjà un compte professionnel, connectez-vous pour accéder à votre espace.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Se connecter
                </Button>
              </Link>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Besoin d'aide ?</h3>
              <p className="text-sm text-muted-foreground">
                Pour toute question concernant l'inscription des professionnels de santé, 
                contactez notre équipe de support.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@sante.ga">
                  Contacter le support
                </a>
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/register')}
              className="flex-1"
            >
              Retour
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
