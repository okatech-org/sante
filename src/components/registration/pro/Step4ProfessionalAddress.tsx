import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfessionalRegistrationData } from "@/lib/validation";
import { MapPin, Home } from "lucide-react";
import { provinces, getCitiesByProvince } from "@/lib/gabon-data";

interface Step4ProfessionalAddressProps {
  form: UseFormReturn<ProfessionalRegistrationData>;
}

export function Step4ProfessionalAddress({ form }: Step4ProfessionalAddressProps) {
  const selectedProvince = form.watch("province");
  const cities = selectedProvince ? getCitiesByProvince(selectedProvince) : [];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Localisation de l'établissement</h3>
        <p className="text-sm text-muted-foreground">
          Cette adresse sera visible sur la carte et dans les résultats de recherche
        </p>
      </div>

      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Province *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="btn-mobile-xxl">
                  <SelectValue placeholder="Sélectionnez une province" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ville / Département *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={!selectedProvince}
            >
              <FormControl>
                <SelectTrigger className="btn-mobile-xxl">
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse complète *</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Quartier, Rue, Immeuble, etc."
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Soyez le plus précis possible pour faciliter l'accès des patients
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
