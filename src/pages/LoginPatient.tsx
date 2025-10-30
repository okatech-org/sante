import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Heart, Mail, Lock, ArrowLeft, Eye, EyeOff, Shield, Clock, Users, CheckCircle, UserPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, LoginData } from "@/lib/validation";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import { sanitizeAuthError, logError } from "@/lib/errorHandler";

export default function LoginPatient() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const { user } = await authService.signIn(data.identifier, data.password);
      
      if (!user) {
        throw new Error("Erreur lors de la connexion");
      }

      const userRoles = await authService.getUserRoles(user.id);
      const adminRoles = ['admin', 'super_admin'];
      const hasAdminRole = userRoles.some(role => adminRoles.includes(role));

      if (hasAdminRole) {
        await authService.signOut();
        toast.error("Accès refusé", {
          description: "Cet espace est réservé aux patients. Veuillez utiliser l'espace administrateur.",
        });
        return;
      }

      const professionalRoles = ['doctor', 'medical_staff', 'pharmacy', 'laboratory', 'hospital'];
      const hasProfessionalRole = userRoles.some(role => professionalRoles.includes(role));

      if (hasProfessionalRole) {
        await authService.signOut();
        toast.error("Accès refusé", {
          description: "Cet espace est réservé aux patients. Veuillez utiliser l'espace professionnel.",
        });
        return;
      }
      
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
          description: "Bienvenue sur votre espace patient",
        });
        navigate("/dashboard/patient");
      }
    } catch (error: any) {
      const sanitized = sanitizeAuthError(error);
      if (sanitized.shouldLog) {
        logError('Login', error);
      }
      toast.error("Erreur de connexion", {
        description: sanitized.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Section Gauche - Branding & Image (cachée sur mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-[url('/watermark_waves.jpg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo et titre */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img 
                src="/logo_sante.png" 
                alt="SANTE.GA" 
                className="h-12 w-12 rounded-xl bg-white/10 p-2 backdrop-blur-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <h1 className="text-2xl font-bold">SANTE.GA</h1>
                <p className="text-sm text-white/80">Votre santé, notre priorité</p>
              </div>
            </Link>
          </div>

          {/* Contenu central */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Bienvenue sur votre
                <br />
                espace santé personnel
              </h2>
              <p className="text-lg text-white/90">
                Gérez vos rendez-vous, consultez votre dossier médical et accédez à tous vos services de santé en un seul endroit.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Clock, text: "Prenez rendez-vous en quelques clics" },
                { icon: Shield, text: "Vos données sont sécurisées et protégées" },
                { icon: Users, text: "Accès à tous les professionnels de santé" },
                { icon: CheckCircle, text: "Suivi médical simplifié" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <p className="text-white/90">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/70">
            <p>© 2025 SANTE.GA - Tous droits réservés</p>
          </div>
        </div>
      </div>

      {/* Section Droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="w-full max-w-md">
          {/* Header mobile avec logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img 
                src="/logo_sante.png" 
                alt="SANTE.GA" 
                className="h-12 w-12 rounded-xl bg-primary/10 p-2 group-hover:scale-105 transition-transform"
              />
              <div>
                <h1 className="text-2xl font-bold">SANTE.GA</h1>
                <p className="text-sm text-muted-foreground">Votre santé, notre priorité</p>
              </div>
            </Link>
          </div>

          {/* Bouton retour */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          <Card className="p-6 sm:p-8 shadow-xl border-2">
            {/* Titre */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4">
                <Heart className="h-8 w-8 text-white" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Connexion Patient</h2>
              <p className="text-muted-foreground">
                Accédez à votre espace santé personnel
              </p>
            </div>

            {/* Formulaire */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Email ou Téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="votre@email.com ou +241 XX XX XX XX"
                            className="pl-11 h-12 text-base border-2 focus:border-primary transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-semibold">Mot de passe</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline font-medium"
                        >
                          Oublié ?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-11 pr-11 h-12 text-base border-2 focus:border-primary transition-colors"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Se souvenir de moi
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </Form>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Bouton Créer un compte */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => navigate("/register/patient")}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Créer un compte patient
            </Button>

            {/* Info supplémentaire */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              En vous connectant, vous acceptez nos{" "}
              <Link to="/terms" className="text-primary hover:underline">
                conditions d'utilisation
              </Link>
              {" "}et notre{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
            </p>
          </Card>

          {/* Aide */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Besoin d'aide ?{" "}
              <Link to="/help" className="text-primary hover:underline font-medium">
                Contactez le support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
