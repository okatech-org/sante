import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, ArrowLeft, AlertCircle, Shield, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loginSchema, LoginData } from "@/lib/validation";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import { sanitizeAuthError, logError } from "@/lib/errorHandler";

export default function LoginProfessional() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  // Auto-fill from demo account
  useEffect(() => {
    const demoAccountData = sessionStorage.getItem('demoAccount');
    if (demoAccountData) {
      try {
        const { email, password } = JSON.parse(demoAccountData);
        form.setValue('identifier', email);
        form.setValue('password', password);
        setIsDemoAccount(true);
        
        // Clear sessionStorage after using it
        sessionStorage.removeItem('demoAccount');
        
        toast.info("Compte démo chargé", {
          description: "Les identifiants ont été remplis automatiquement",
        });
      } catch (error) {
        console.error('Error parsing demo account data:', error);
      }
    }
  }, [form]);

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      const { user } = await authService.signIn(data.identifier, data.password);
      
      if (!user) {
        throw new Error("Erreur lors de la connexion");
      }

      // Vérifier que l'utilisateur n'a pas un rôle admin
      const userRoles = await authService.getUserRoles(user.id);
      const adminRoles = ['admin', 'super_admin'];
      const hasAdminRole = userRoles.some(role => adminRoles.includes(role));

      if (hasAdminRole) {
        // Déconnecter l'utilisateur
        await authService.signOut();
        toast.error("Accès refusé", {
          description: "Cet espace est réservé aux professionnels. Veuillez utiliser l'espace administrateur.",
        });
        return;
      }

      // Vérifier d'abord si c'est le ministre et le rediriger vers son dashboard dédié
      if (data.identifier === 'ministre@sante.gouv.ga' || user.email === 'ministre@sante.gouv.ga') {
        toast.success("Bienvenue Ministre !", {
          description: "Pr. Adrien MOUGOUGOU - Accès à votre espace ministériel",
        });
        window.location.href = "/gouv/dashboard";
        return;
      }

      // Vérifier que l'utilisateur a un rôle professionnel
      const professionalRoles = ['doctor', 'medical_staff', 'pharmacy', 'laboratory', 'hospital', 'moderator'];
      const hasProfessionalRole = userRoles.some(role => professionalRoles.includes(role));

      if (!hasProfessionalRole) {
        // Déconnecter l'utilisateur
        await authService.signOut();
        toast.error("Accès refusé", {
          description: "Cet espace est réservé aux professionnels de santé. Veuillez utiliser l'espace patient.",
        });
        return;
      }
      
      toast.success("Connexion réussie !", {
        description: "Bienvenue sur votre espace professionnel",
      });
      navigate("/professional/select-establishment");
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary/5 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-7 w-7 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="w-5" /> {/* Spacer */}
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">Connexion Professionnel</CardTitle>
            <CardDescription>Accédez à votre espace professionnel de santé</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isDemoAccount ? (
            <Alert className="bg-primary/10 border-primary/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-2 flex-1">
                  <Shield className="h-4 w-4 mt-0.5" />
                  <div className="flex-1">
                    <AlertTitle>Compte de démonstration</AlertTitle>
                    <AlertDescription>
                      Les identifiants ont été remplis automatiquement. Vous pouvez vous connecter directement.
                    </AlertDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  className="flex-shrink-0"
                >
                  Connexion auto
                </Button>
              </div>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Espace Professionnel</AlertTitle>
              <AlertDescription>
                Cet espace est réservé aux professionnels de santé inscrits et validés.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email professionnel</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="votre@email-pro.com"
                          className="pl-10 btn-mobile-xxl"
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
                      <FormLabel>Mot de passe</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 btn-mobile-xxl"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
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

              <Button type="submit" className="w-full btn-mobile-xxl" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Pas encore inscrit ?{" "}
              <Link to="/register/professional" className="text-primary hover:underline font-medium">
                Créer un compte professionnel
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
