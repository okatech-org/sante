import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { User, Building2, Award, FileText, Calendar as CalendarIcon, Globe } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="M" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Homme</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="F" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Femme</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre professionnel *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="doctor">Docteur</SelectItem>
                  <SelectItem value="professor">Professeur (Agrégé)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de naissance *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionnez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationalité *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-50 max-h-[200px]">
                  <SelectItem value="gabonaise">Gabonaise</SelectItem>
                  <SelectItem value="camerounaise">Camerounaise</SelectItem>
                  <SelectItem value="congolaise">Congolaise</SelectItem>
                  <SelectItem value="francaise">Française</SelectItem>
                  <SelectItem value="senegalaise">Sénégalaise</SelectItem>
                  <SelectItem value="ivoirienne">Ivoirienne</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
