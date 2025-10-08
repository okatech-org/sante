import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step6DocumentsProps {
  form: UseFormReturn<ProfessionalRegistrationData>;
}

export function Step6Documents({ form }: Step6DocumentsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Diplômes et Documents</h3>
        <p className="text-sm text-muted-foreground">
          Ces informations seront vérifiées par nos équipes
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Les documents pourront être téléversés après la création de votre compte
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="diplomaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre du diplôme principal *</FormLabel>
            <FormControl>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Ex: Doctorat en Médecine"
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
        name="diplomaInstitution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Établissement d'obtention *</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Université des Sciences de la Santé"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="diplomaYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année d'obtention *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2015"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diplomaCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Gabon"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="professionalExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expérience professionnelle</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez brièvement votre parcours professionnel..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Mentionnez vos postes précédents et domaines d'expertise
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}