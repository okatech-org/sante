import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Loader2,
  Users,
  Stethoscope,
  Shield,
  Info,
  Heart
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authService } from '@/lib/auth';

export default function SogaraLoginEnhanced() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Déterminer d'où vient l'utilisateur pour le bouton retour
  const referrer = location.state?.from || '/sogara';
  const isFromSogaraPage = referrer === '/sogara';

  useEffect(() => {
    // Sauvegarder l'établissement dans le sessionStorage
    sessionStorage.setItem('login_establishment', 'cmst-sogara');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authentification
      const { user } = await authService.signIn(email, password);
      
      if (!user) {
        throw new Error("Erreur lors de la connexion");
      }

      // Vérifier que l'utilisateur a un rôle professionnel
      const userRoles = await authService.getUserRoles(user.id);
      const professionalRoles = ['doctor', 'medical_staff', 'pharmacy', 'laboratory', 'hospital', 'moderator'];
      const hasProfessionalRole = userRoles.some(role => professionalRoles.includes(role));

      if (!hasProfessionalRole) {
        // Vérifier si c'est un patient
        const hasPatientRole = userRoles.includes('patient');
        if (hasPatientRole) {
          await authService.signOut();
          toast.error("Accès refusé", {
            description: "Cet espace est réservé au personnel du CMST SOGARA. Veuillez utiliser l'espace patient.",
          });
          return;
        }
      }

      // Vérifier l'accès à SOGARA spécifiquement
      const { data: establishments } = await supabase
        .from('professional_establishments')
        .select('*, establishments(*)')
        .eq('professional_id', user.id)
        .eq('establishment_id', 'cmst-sogara')
        .eq('is_active', true)
        .single();

      if (!establishments) {
        // Vérifier si l'utilisateur a accès à d'autres établissements
        const { data: otherEstablishments } = await supabase
          .from('professional_establishments')
          .select('*, establishments(*)')
          .eq('professional_id', user.id)
          .eq('is_active', true);

        if (otherEstablishments && otherEstablishments.length > 0) {
          toast.warning("Accès non autorisé", {
            description: "Vous n'avez pas accès au CMST SOGARA. Redirection vers vos établissements.",
          });
          navigate("/professional/select-establishment");
        } else {
          toast.error("Accès refusé", {
            description: "Vous n'êtes pas autorisé à accéder au CMST SOGARA.",
          });
          await authService.signOut();
        }
        return;
      }

      // Connexion réussie avec accès SOGARA
      localStorage.setItem('selected_establishment_id', 'cmst-sogara');
      localStorage.setItem('selected_establishment_name', 'CMST SOGARA');
      
      toast.success("Connexion réussie", {
        description: "Bienvenue au CMST SOGARA",
      });
      
      // Rediriger vers le dashboard professionnel avec SOGARA sélectionné
      navigate("/dashboard/professional");
      
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error("Erreur de connexion", {
        description: error.message || "Email ou mot de passe incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Link to={referrer}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isFromSogaraPage ? "Retour à CMST SOGARA" : "Retour"}
              </Button>
            </Link>
            <Badge variant="outline" className="text-xs">
              Établissement
            </Badge>
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full shadow-lg">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-center">CMST SOGARA</CardTitle>
            <CardDescription className="text-center">
              Centre de Médecine de Santé au Travail
            </CardDescription>
            <Badge className="bg-blue-100 text-blue-700">
              Connexion Personnel
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Types de personnels acceptés */}
          <div className="flex flex-wrap gap-2 justify-center pb-4 border-b">
            <Badge variant="secondary" className="text-xs">
              <Stethoscope className="w-3 h-3 mr-1" />
              Médecins
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Infirmiers
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Administratifs
            </Badge>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="prenom.nom@sogara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Se souvenir de moi</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Se connecter à CMST SOGARA
                </>
              )}
            </Button>
          </form>

          {/* Information spécifique SOGARA */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong>Réservé au personnel SOGARA :</strong> Cette interface est exclusivement destinée aux employés du CMST SOGARA. Si vous travaillez dans un autre établissement, utilisez l'
              <Link to="/login/professional" className="text-blue-600 hover:underline ml-1">
                espace professionnel général
              </Link>.
            </AlertDescription>
          </Alert>

          {/* Options alternatives */}
          <div className="pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Vous n'êtes pas personnel SOGARA ?
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link to="/login/patient">
                <Button variant="outline" className="w-full" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Espace Patient
                </Button>
              </Link>
              
              <Link to="/login/professional">
                <Button variant="outline" className="w-full" size="sm">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Autre Établissement
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact support SOGARA */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Pour toute question, contactez l'administration :
            </p>
            <a 
              href="mailto:cmst@sogara.ga" 
              className="text-xs text-blue-600 hover:underline"
            >
              cmst@sogara.ga
            </a>
            <span className="text-xs text-muted-foreground mx-2">•</span>
            <a 
              href="tel:+24101555500" 
              className="text-xs text-blue-600 hover:underline"
            >
              +241 01 55 55 00
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
