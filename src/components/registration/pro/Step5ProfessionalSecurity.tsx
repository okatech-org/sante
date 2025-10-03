import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { Lock, Shield, FileCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Step5ProfessionalSecurityProps {
  form: UseFormReturn<ProfessionalRegistrationData>;
}

export function Step5ProfessionalSecurity({ form }: Step5ProfessionalSecurityProps) {
  const password = form.watch("password");
  
  const passwordStrength = {
    hasLength: password?.length >= 8,
    hasUpperCase: /[A-Z]/.test(password || ""),
    hasLowerCase: /[a-z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Sécurité du compte</h3>
        <p className="text-sm text-muted-foreground">
          Créez un mot de passe sécurisé pour protéger votre compte professionnel
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Compte professionnel sécurisé</AlertTitle>
        <AlertDescription>
          Votre inscription sera vérifiée par nos équipes avant activation. Vous recevrez un email de confirmation.
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mot de passe *</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              <div className="space-y-1 mt-2">
                <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasLength ? 'text-success' : 'text-muted-foreground'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasLength ? 'bg-success' : 'bg-muted-foreground'}`} />
                  Au moins 8 caractères
                </div>
                <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasUpperCase ? 'text-success' : 'text-muted-foreground'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasUpperCase ? 'bg-success' : 'bg-muted-foreground'}`} />
                  Une majuscule
                </div>
                <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasLowerCase ? 'text-success' : 'text-muted-foreground'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasLowerCase ? 'bg-success' : 'bg-muted-foreground'}`} />
                  Une minuscule
                </div>
                <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasNumber ? 'bg-success' : 'bg-muted-foreground'}`} />
                  Un chiffre
                </div>
              </div>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="passwordConfirm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe *</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  J'accepte les{" "}
                  <a href="/terms" className="text-primary hover:underline" target="_blank">
                    conditions d'utilisation
                  </a>
                  {" "}et la{" "}
                  <a href="/privacy" className="text-primary hover:underline" target="_blank">
                    politique de confidentialité
                  </a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptProfessionalCode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Je m'engage à respecter le{" "}
                  <a href="/professional-code" className="text-primary hover:underline" target="_blank">
                    code de déontologie
                  </a>
                  {" "}et les règles professionnelles en vigueur
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
