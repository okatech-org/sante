import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const medicalStaffTypes = [
  { value: "nurse", label: "Infirmier(ère)" },
  { value: "midwife", label: "Sage-femme" },
  { value: "physiotherapist", label: "Kinésithérapeute" },
  { value: "speech-therapist", label: "Orthophoniste" },
  { value: "occupational-therapist", label: "Ergothérapeute" },
  { value: "dietitian", label: "Diététicien(ne)" },
  { value: "psychologist", label: "Psychologue" },
  { value: "radiologist", label: "Manipulateur radio" },
  { value: "dental-assistant", label: "Assistant(e) dentaire" },
  { value: "medical-secretary", label: "Secrétaire médical(e)" },
  { value: "other", label: "Autre" },
];

const doctorSpecialties = [
  { value: "general-medicine", label: "Médecine générale" },
  { value: "cardiology", label: "Cardiologie" },
  { value: "dermatology", label: "Dermatologie" },
  { value: "pediatrics", label: "Pédiatrie" },
  { value: "gynecology", label: "Gynécologie-Obstétrique" },
  { value: "surgery", label: "Chirurgie générale" },
  { value: "orthopedics", label: "Orthopédie" },
  { value: "ophthalmology", label: "Ophtalmologie" },
  { value: "ent", label: "ORL (Oto-Rhino-Laryngologie)" },
  { value: "neurology", label: "Neurologie" },
  { value: "psychiatry", label: "Psychiatrie" },
  { value: "radiology", label: "Radiologie" },
  { value: "anesthesiology", label: "Anesthésie-Réanimation" },
  { value: "emergency", label: "Médecine d'urgence" },
  { value: "internal-medicine", label: "Médecine interne" },
  { value: "dentistry", label: "Chirurgie dentaire" },
  { value: "pulmonology", label: "Pneumologie" },
  { value: "gastroenterology", label: "Gastro-entérologie" },
  { value: "nephrology", label: "Néphrologie" },
  { value: "endocrinology", label: "Endocrinologie" },
  { value: "other", label: "Autre spécialité" },
];

export function Step1ProfessionalType({ form }: Step1ProfessionalTypeProps) {
  const selectedType = form.watch("professionalType");
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

      {selectedType === "doctor" && (
        <FormField
          control={form.control}
          name="doctorSpecialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spécifiez votre spécialité médicale *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sélectionnez votre spécialité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-50">
                  {doctorSpecialties.map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {selectedType === "medical-staff" && (
        <FormField
          control={form.control}
          name="medicalStaffType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spécifiez votre corps médical *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sélectionnez votre fonction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-50">
                  {medicalStaffTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
