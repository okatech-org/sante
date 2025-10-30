import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Building2,
  ArrowLeft, 
  Eye, 
  EyeOff,
  Loader2,
  Users,
  FileBarChart,
  Calendar,
  Info,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authService } from '@/lib/auth';

export default function LoginProfessionalNew() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const establishmentId = searchParams.get('establishment');

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
            description: "Cet espace est réservé aux professionnels de santé. Veuillez utiliser l'espace patient.",
          });
          return;
        }
        
        // Ou un admin
        const hasAdminRole = userRoles.some(role => ['admin', 'super_admin'].includes(role));
        if (hasAdminRole) {
          await authService.signOut();
          toast.error("Accès refusé", {
            description: "Veuillez utiliser l'espace administration.",
          });
          return;
        }
      }

      // Récupérer les établissements du professionnel
      const { data: establishments } = await supabase
        .from('professional_establishments')
        .select('*, establishments(*)')
        .eq('professional_id', user.id)
        .eq('is_active', true);

      // Si un établissement est spécifié dans l'URL et que l'utilisateur y a accès
      if (establishmentId && establishments?.some(e => e.establishment_id === establishmentId)) {
        localStorage.setItem('selected_establishment_id', establishmentId);
        const selectedEst = establishments.find(e => e.establishment_id === establishmentId);
        if (selectedEst?.establishments) {
          localStorage.setItem('selected_establishment_name', selectedEst.establishments.name);
        }
        toast.success("Connexion réussie !", {
          description: `Bienvenue dans votre espace professionnel`,
        });
        navigate("/dashboard/professional");
        return;
      }

      // Si un seul établissement, connexion directe
      if (establishments && establishments.length === 1) {
        const est = establishments[0];
        localStorage.setItem('selected_establishment_id', est.establishment_id || est.establishments?.id);
        localStorage.setItem('selected_establishment_name', est.establishments?.name || '');
        toast.success("Connexion réussie !", {
          description: `Bienvenue à ${est.establishments?.name}`,
        });
        navigate("/dashboard/professional");
      } else if (establishments && establishments.length > 1) {
        // Si plusieurs établissements, page de sélection
        toast.success("Connexion réussie !", {
          description: "Veuillez sélectionner un établissement",
        });
        navigate("/professional/select-establishment");
      } else {
        // Aucun établissement trouvé
        toast.warning("Aucun établissement associé", {
          description: "Veuillez contacter l'administrateur pour obtenir l'accès à un établissement.",
        });
        navigate("/professional/claim-establishment");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
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
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-center">Espace Professionnel</CardTitle>
            <CardDescription className="text-center">
              Pour tous les professionnels de santé et administratifs
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Types de professionnels */}
          <div className="flex flex-wrap gap-2 justify-center pb-4 border-b">
            <Badge variant="secondary">Médecins</Badge>
            <Badge variant="secondary">Infirmiers</Badge>
            <Badge variant="secondary">Pharmaciens</Badge>
            <Badge variant="secondary">Laborantins</Badge>
            <Badge variant="secondary">Administratifs</Badge>
            <Badge variant="secondary">Directeurs</Badge>
          </div>

          {/* Fonctionnalités principales */}
          <div className="grid grid-cols-3 gap-3 pb-4 border-b">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-xs">Patients</div>
            </div>
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-xs">Consultations</div>
            </div>
            <div className="text-center">
              <FileBarChart className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-xs">Statistiques</div>
            </div>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="prenom.nom@etablissement.ga"
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Connexion Professionnel
                </>
              )}
            </Button>
          </form>

          {/* Information multi-établissements */}
          <Alert className="bg-blue-50 border-blue-200">
            <Building2 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong>Multi-établissements :</strong> Si vous travaillez dans plusieurs établissements, vous pourrez les sélectionner après connexion.
            </AlertDescription>
          </Alert>

          {/* Options d'inscription */}
          <div className="space-y-3 pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground">
              Nouveau professionnel ?
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link to="/signup/professional">
                <Button variant="outline" className="w-full" size="sm">
                  Créer un compte
                </Button>
              </Link>
              
              <Link to="/professional/claim-establishment">
                <Button variant="outline" className="w-full" size="sm">
                  Rejoindre un établissement
                </Button>
              </Link>
            </div>
          </div>

          {/* Accès rapide établissements populaires */}
          <div className="pt-4 border-t">
            <div className="text-xs text-center text-muted-foreground mb-3">
              Accès rapide
            </div>
            <div className="flex justify-center gap-2">
              <Link to="/login/professional?establishment=cmst-sogara">
                <Button variant="ghost" size="sm" className="text-xs">
                  CMST SOGARA
                </Button>
              </Link>
              <Link to="/login/professional?establishment=chu-libreville">
                <Button variant="ghost" size="sm" className="text-xs">
                  CHU Libreville
                </Button>
              </Link>
            </div>
          </div>

          {/* Liens vers autres espaces */}
          <div className="flex justify-center gap-4 text-xs">
            <Link 
              to="/login/patient" 
              className="text-muted-foreground hover:text-primary"
            >
              Espace Patient
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
