import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loginSchema, LoginData } from "@/lib/validation";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import { sanitizeAuthError, logError } from "@/lib/errorHandler";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";

// Liste des comptes SOGARA pour le mode offline
const SOGARA_ACCOUNTS = [
  { email: "admin@sogara.com", password: "Admin@SOGARA2024", fullName: "Jean-Pierre Mbadinga", role: "admin" },
  { email: "directeur@sogara.com", password: "DirecteurSOGARA2024!", fullName: "Dr. François Obiang", role: "admin" },
  { email: "dr.okemba@sogara.com", password: "Okemba@2024Med", fullName: "Dr. Marie Okemba", role: "doctor" },
  { email: "dr.nguema@sogara.com", password: "Nguema@Urgence24", fullName: "Dr. Paul Nguema", role: "doctor" },
  { email: "dr.mbina@sogara.com", password: "Mbina@Cardio2024", fullName: "Dr. Léa Mbina", role: "doctor" },
  { email: "dr.mezui@sogara.com", password: "Mezui@Pediatrie24", fullName: "Dr. Thomas Mezui", role: "doctor" },
  { email: "nurse.mba@sogara.com", password: "MbaSI@2024", fullName: "Sylvie Mba", role: "medical_staff" },
  { email: "nurse.nze@sogara.com", password: "NzeUrg@2024", fullName: "Patricia Nze", role: "medical_staff" },
  { email: "nurse.andeme@sogara.com", password: "Andeme@Mat2024", fullName: "Claire Andeme", role: "medical_staff" },
  { email: "lab.tech@sogara.com", password: "LabSOGARA@2024", fullName: "André Moussavou", role: "laboratory" },
  { email: "pharma@sogara.com", password: "PharmaSOGARA@24", fullName: "Dr. Lydie Kombila", role: "pharmacy" },
  { email: "accueil@sogara.com", password: "AccueilSOGARA@24", fullName: "Nadège Oyono", role: "medical_staff" }
];

export default function LoginProfessional() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn: offlineSignIn } = useOfflineAuth();

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
    
    // D'abord, vérifier si c'est un compte SOGARA (mode offline)
    const sogaraAccount = SOGARA_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === data.identifier.toLowerCase() && acc.password === data.password
    );
    
    if (sogaraAccount) {
      try {
        // Connexion offline pour SOGARA
        await offlineSignIn(sogaraAccount.email, [sogaraAccount.role]);
        
        // Stocker les informations SOGARA
        localStorage.setItem('sogara_user_data', JSON.stringify({
          fullName: sogaraAccount.fullName,
          establishment: 'CMST SOGARA',
          role: sogaraAccount.role
        }));
        
        toast.success("Connexion réussie !", {
          description: `Bienvenue ${sogaraAccount.fullName}`,
        });
        
        // Rediriger vers le dashboard SOGARA
        if (sogaraAccount.role === 'admin') {
          navigate("/establishments/sogara/admin");
        } else {
          navigate("/establishments/sogara/admin");
        }
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Erreur connexion offline:", error);
      }
    }
    
    // Si ce n'est pas un compte SOGARA, essayer Supabase
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
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Espace Professionnel</AlertTitle>
            <AlertDescription>
              Cet espace est réservé aux professionnels de santé inscrits et validés.
            </AlertDescription>
          </Alert>

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
                          type="password"
                          placeholder="••••••••"
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
