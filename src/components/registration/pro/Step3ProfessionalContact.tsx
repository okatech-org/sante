import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { Mail, Phone } from "lucide-react";

interface Step3ProfessionalContactProps {
  form: UseFormReturn<ProfessionalRegistrationData>;
}

export function Step3ProfessionalContact({ form }: Step3ProfessionalContactProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Contact professionnel</h3>
        <p className="text-sm text-muted-foreground">
          Ces coordonnées seront visibles par les patients et utilisées pour les notifications
        </p>
      </div>

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
                  placeholder="contact@cabinet-medical.ga"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Cet email sera utilisé pour la connexion et les notifications
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
                  placeholder="+241 XX XX XX XX"
                  className="pl-10"
                  {...field}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Auto-format phone number
                    if (!value.startsWith('+241')) {
                      value = '+241 ' + value.replace(/^\+241\s?/, '');
                    }
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>
              Les patients pourront vous contacter via ce numéro
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
