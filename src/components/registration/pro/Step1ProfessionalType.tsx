import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { Stethoscope, Users, Pill, TestTube, Building2 } from "lucide-react";

interface Step1ProfessionalTypeProps {
  form: UseFormReturn<ProfessionalRegistrationData>;
}

const professionalTypes = [
  {
    value: "doctor",
    label: "Médecin",
    description: "Médecin généraliste ou spécialiste",
    icon: Stethoscope,
  },
  {
    value: "medical-staff",
    label: "Autres Corps médicaux",
    description: "Infirmier(ère), sage-femme, kinésithérapeute, etc.",
    icon: Users,
  },
  {
    value: "pharmacy",
    label: "Pharmacie",
    description: "Officine ou pharmacie d'établissement",
    icon: Pill,
  },
  {
    value: "laboratory",
    label: "Laboratoire",
    description: "Laboratoire d'analyses médicales",
    icon: TestTube,
  },
  {
    value: "hospital",
    label: "Hôpital / Clinique",
    description: "Établissement de santé",
    icon: Building2,
  },
];

export function Step1ProfessionalType({ form }: Step1ProfessionalTypeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Type de professionnel</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez le type qui correspond à votre activité
        </p>
      </div>

      <FormField
        control={form.control}
        name="professionalType"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid gap-4"
              >
                {professionalTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <FormItem key={type.value}>
                      <FormControl>
                        <div className="relative">
                          <RadioGroupItem
                            value={type.value}
                            id={type.value}
                            className="peer sr-only"
                          />
                          <FormLabel
                            htmlFor={type.value}
                            className="flex items-start gap-4 rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:border-primary cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <p className="font-medium leading-none">{type.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
