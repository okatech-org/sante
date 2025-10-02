import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PatientRegistrationData } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Step4SecurityProps {
  form: UseFormReturn<PatientRegistrationData>;
}

export const Step4Security = ({ form }: Step4SecurityProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const password = form.watch("password");
  
  const passwordStrength = {
    hasMinLength: password?.length >= 8,
    hasUpperCase: /[A-Z]/.test(password || ""),
    hasLowerCase: /[a-z]/.test(password || ""),
    hasNumber: /[0-9]/.test(password || ""),
  };

  const strengthCount = Object.values(passwordStrength).filter(Boolean).length;
  const strengthLabel = 
    strengthCount === 0 ? "" :
    strengthCount <= 2 ? "Faible" :
    strengthCount === 3 ? "Moyen" :
    "Fort";
  
  const strengthColor = 
    strengthCount <= 2 ? "text-destructive" :
    strengthCount === 3 ? "text-warning" :
    "text-success";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Sécurité de votre compte</h3>

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 caractères"
                  className="pl-10 pr-12 btn-mobile-xxl"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </FormControl>
            
            {password && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Force du mot de passe:</span>
                  <span className={`text-sm font-medium ${strengthColor}`}>{strengthLabel}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>8 caractères min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasUpperCase ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>Une majuscule</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasLowerCase ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>Une minuscule</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasNumber ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>Un chiffre</span>
                  </div>
                </div>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="passwordConfirm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmation du mot de passe *</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Retapez votre mot de passe"
                  className="pl-10 pr-12 btn-mobile-xxl"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPasswordConfirm ? (
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
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal cursor-pointer">
                J'accepte les{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="h-auto p-0 text-primary">
                      Conditions Générales d'Utilisation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Conditions Générales d'Utilisation</DialogTitle>
                      <DialogDescription>
                        Dernière mise à jour: Février 2025
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="font-semibold mb-2">1. Objet</h3>
                        <p className="text-muted-foreground">
                          SANTE.GA est une plateforme e-santé qui facilite l'accès aux soins de santé au Gabon.
                        </p>
                      </section>
                      <section>
                        <h3 className="font-semibold mb-2">2. Protection des données</h3>
                        <p className="text-muted-foreground">
                          Vos données personnelles et médicales sont protégées conformément à la réglementation en vigueur au Gabon.
                        </p>
                      </section>
                      <section>
                        <h3 className="font-semibold mb-2">3. Responsabilités</h3>
                        <p className="text-muted-foreground">
                          SANTE.GA est un intermédiaire entre patients et professionnels de santé. Les actes médicaux relèvent de la responsabilité exclusive des professionnels.
                        </p>
                      </section>
                      {/* Add more sections as needed */}
                    </div>
                  </DialogContent>
                </Dialog>
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
