import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Loader2,
  Lock,
  AlertTriangle,
  Settings,
  BarChart3,
  Database,
  Key
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authService } from '@/lib/auth';

export default function LoginAdminNew() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
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

      // Vérifier que l'utilisateur a un rôle admin
      const userRoles = await authService.getUserRoles(user.id);
      const adminRoles = ['admin', 'super_admin'];
      const hasAdminRole = userRoles.some(role => adminRoles.includes(role));

      if (!hasAdminRole) {
        await authService.signOut();
        toast.error("Accès refusé", {
          description: "Cet espace est réservé aux administrateurs de la plateforme SANTE.GA.",
        });
        return;
      }

      // Déterminer le niveau d'admin
      const isSuperAdmin = userRoles.includes('super_admin');
      
      toast.success("Connexion réussie !", {
        description: `Bienvenue ${isSuperAdmin ? 'Super Admin' : 'Admin'}`,
      });

      // Enregistrer le type d'admin dans localStorage
      localStorage.setItem('admin_level', isSuperAdmin ? 'super_admin' : 'admin');
      
      navigate("/admin");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error("Erreur de connexion", {
        description: error.message || "Email ou mot de passe incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de vérification 2FA à implémenter
    toast.info("La vérification 2FA sera implémentée prochainement");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-gray-700 bg-gray-800/90 backdrop-blur">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-center text-white">Administration SANTE.GA</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Accès réservé aux administrateurs de la plateforme
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avertissement de sécurité */}
          <Alert className="bg-yellow-950/50 border-yellow-700">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200 text-sm">
              <strong>Zone sécurisée :</strong> Toutes les connexions sont enregistrées et surveillées. Accès non autorisé interdit.
            </AlertDescription>
          </Alert>

          {/* Indicateurs de privilèges */}
          <div className="grid grid-cols-4 gap-2 pb-4 border-b border-gray-700">
            <div className="text-center">
              <Settings className="w-6 h-6 mx-auto mb-1 text-purple-400" />
              <div className="text-xs text-gray-400">Système</div>
            </div>
            <div className="text-center">
              <Database className="w-6 h-6 mx-auto mb-1 text-blue-400" />
              <div className="text-xs text-gray-400">Données</div>
            </div>
            <div className="text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-1 text-green-400" />
              <div className="text-xs text-gray-400">Analytics</div>
            </div>
            <div className="text-center">
              <Key className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
              <div className="text-xs text-gray-400">Accès</div>
            </div>
          </div>

          {!showTwoFactor ? (
            // Formulaire de connexion principal
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email administrateur</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sante.ga"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-600 rounded"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authentification...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Connexion Sécurisée
                  </>
                )}
              </Button>
            </form>
          ) : (
            // Formulaire 2FA
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twofa" className="text-gray-200">Code de vérification</Label>
                <Input
                  id="twofa"
                  type="text"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-400 text-center">
                  Entrez le code à 6 chiffres de votre application d'authentification
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600" 
              >
                Vérifier
              </Button>

              <Button 
                type="button"
                variant="ghost" 
                className="w-full text-gray-300"
                onClick={() => setShowTwoFactor(false)}
              >
                Retour
              </Button>
            </form>
          )}

          {/* Information de sécurité */}
          <div className="space-y-2 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>IP : {typeof window !== 'undefined' ? '•••.•••.•••.•••' : ''}</span>
              <span>Session sécurisée</span>
            </div>
            <div className="text-xs text-center text-gray-500">
              Connexion chiffrée TLS 1.3
            </div>
          </div>

          {/* Contact support */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Problème de connexion ? Contactez le support technique
            </p>
            <Link 
              to="/support" 
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              support@sante.ga
            </Link>
          </div>

          {/* Liens vers autres espaces */}
          <div className="flex justify-center gap-4 text-xs pt-4">
            <Link 
              to="/login/patient" 
              className="text-gray-500 hover:text-gray-300"
            >
              Espace Patient
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              to="/login/professional" 
              className="text-gray-500 hover:text-gray-300"
            >
              Espace Professionnel
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer de sécurité */}
      <div className="fixed bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-gray-500">
          © 2024 SANTE.GA - Plateforme sécurisée de santé numérique
        </p>
      </div>
    </div>
  );
}
