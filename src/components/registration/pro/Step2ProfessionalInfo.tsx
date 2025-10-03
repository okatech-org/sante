import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { User, Building2, Award, FileText } from "lucide-react";

interface Step2ProfessionalInfoProps {
  form: UseFormReturn<ProfessionalRegistrationData>;
}

export function Step2ProfessionalInfo({ form }: Step2ProfessionalInfoProps) {
  const professionalType = form.watch("professionalType");
  
  const getSpecialtyLabel = () => {
    if (professionalType === "doctor") return "Spécialité médicale";
    if (professionalType === "medical-staff") return "Spécialité / Fonction";
    if (professionalType === "pharmacy") return "Type de pharmacie";
    if (professionalType === "laboratory") return "Type d'analyses";
    return "Spécialité";
  };

  const getLicenseLabel = () => {
    if (professionalType === "doctor") return "Numéro d'inscription à l'Ordre des Médecins";
    if (professionalType === "medical-staff") return "Numéro d'inscription professionnelle";
    if (professionalType === "pharmacy") return "Numéro d'agrément de la pharmacie";
    if (professionalType === "laboratory") return "Numéro d'agrément du laboratoire";
    if (professionalType === "hospital") return "Numéro d'agrément de l'établissement";
    return "Numéro de licence professionnelle";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Informations professionnelles</h3>
        <p className="text-sm text-muted-foreground">
          Renseignez vos informations d'identification professionnelle
        </p>
      </div>

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom {professionalType === "hospital" ? "du responsable" : ""}</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="DUPONT"
                  className="pl-10 uppercase"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prénom {professionalType === "hospital" ? "du responsable" : ""}</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Jean"
                  className="pl-10"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                    field.onChange(formatted);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="establishmentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {professionalType === "hospital" ? "Nom de l'établissement" : 
               professionalType === "pharmacy" ? "Nom de la pharmacie" :
               professionalType === "laboratory" ? "Nom du laboratoire" :
               "Nom du cabinet / établissement"}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={
                    professionalType === "hospital" ? "Centre Hospitalier de Libreville" :
                    professionalType === "pharmacy" ? "Pharmacie Centrale" :
                    professionalType === "laboratory" ? "Laboratoire d'Analyses BioGabon" :
                    "Cabinet Médical Dr. Dupont"
                  }
                  className="pl-10"
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
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{getSpecialtyLabel()}</FormLabel>
            <FormControl>
              <div className="relative">
                <Award className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={
                    professionalType === "doctor" ? "Cardiologie, Pédiatrie, etc." :
                    professionalType === "medical-staff" ? "Infirmier(ère), Sage-femme, etc." :
                    professionalType === "pharmacy" ? "Officine, Hospitalière, etc." :
                    professionalType === "laboratory" ? "Biologie, Hématologie, etc." :
                    "Spécialité"
                  }
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              {professionalType === "doctor" && "Votre spécialité médicale principale"}
              {professionalType === "medical-staff" && "Votre fonction dans le corps médical"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="licenseNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{getLicenseLabel()}</FormLabel>
            <FormControl>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Ex: OM-GA-2024-12345"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Ce numéro sera vérifié par nos services avant validation de votre compte
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
