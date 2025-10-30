import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Heart, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Loader2,
  Calendar,
  FileText,
  UserCircle,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authService } from '@/lib/auth';

export default function LoginPatientNew() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authentification
      const { user } = await authService.signIn(email, password);
      
      if (!user) {
        throw new Error("Erreur lors de la connexion");
      }

      // Vérifier que c'est bien un patient
      const userRoles = await authService.getUserRoles(user.id);
      
      // Vérifier qu'il n'a pas de rôle professionnel ou admin
      const nonPatientRoles = ['doctor', 'medical_staff', 'pharmacy', 'laboratory', 'hospital', 'admin', 'super_admin'];
      const hasNonPatientRole = userRoles.some(role => nonPatientRoles.includes(role));

      if (hasNonPatientRole) {
        await authService.signOut();
        toast.error("Accès refusé", {
          description: "Cet espace est réservé aux patients. Veuillez utiliser l'espace approprié.",
        });
        return;
      }
      
      // Vérifier la redirection de rendez-vous
      const redirectUrl = localStorage.getItem('appointment_redirect');
      if (redirectUrl) {
        localStorage.removeItem('appointment_redirect');
        localStorage.removeItem('selected_provider_id');
        toast.success("Connexion réussie !", {
          description: "Redirection vers votre rendez-vous...",
        });
        navigate(redirectUrl);
      } else {
        toast.success("Connexion réussie !", {
          description: "Bienvenue sur votre espace santé",
        });
        navigate("/dashboard/patient");
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-center">Espace Patient</CardTitle>
            <CardDescription className="text-center">
              Accédez à votre dossier médical et gérez vos rendez-vous
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avantages de l'espace patient */}
          <div className="grid grid-cols-3 gap-3 pb-4 border-b">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-xs">Rendez-vous</div>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-xs">Ordonnances</div>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-xs">Dossier Médical</div>
            </div>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@example.com"
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
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          {/* Information CNAMGS/CNSS */}
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              Votre compte patient est compatible avec vos assurances <strong>CNAMGS</strong> et <strong>CNSS</strong> pour faciliter vos remboursements.
            </AlertDescription>
          </Alert>

          {/* Lien d'inscription */}
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Nouveau patient ?
            </p>
            <Link to="/signup/patient">
              <Button variant="outline" className="w-full">
                <UserCircle className="w-4 h-4 mr-2" />
                Créer un compte patient
              </Button>
            </Link>
          </div>

          {/* Liens vers autres espaces */}
          <div className="flex justify-center gap-4 text-xs">
            <Link 
              to="/login/professional" 
              className="text-muted-foreground hover:text-primary"
            >
              Espace Professionnel
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/login/admin" 
              className="text-muted-foreground hover:text-primary"
            >
              Administration
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
