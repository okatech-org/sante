import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { Mail, Phone, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step3ProfessionalContactProps {
  form: UseFormReturn<ProfessionalRegistrationData>;
}

export function Step3ProfessionalContact({ form }: Step3ProfessionalContactProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Contact professionnel</h3>
        <p className="text-sm text-muted-foreground">
          Ces informations seront visibles par vos patients
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Utilisez vos coordonnées professionnelles pour faciliter la prise de rendez-vous
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="professionalEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email professionnel *</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="dr.dupont@exemple.com"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Cet email servira aussi pour la connexion à votre compte
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="professionalPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone professionnel *</FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+241 01 23 45 67"
                  className="pl-10"
                  {...field}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!value.startsWith('+241')) {
                      value = '+241 ' + value.replace(/^\+241\s*/, '');
                    }
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>
              Numéro principal pour les rendez-vous patients
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
