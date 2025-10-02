import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientRegistrationData } from "@/lib/validation";
import { gabonProvinces, gabonCities } from "@/lib/gabon-data";

interface Step2AddressProps {
  form: UseFormReturn<PatientRegistrationData>;
}

export const Step2Address = ({ form }: Step2AddressProps) => {
  const selectedProvince = form.watch("province");
  const availableCities = selectedProvince ? gabonCities[selectedProvince] || [] : [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Adresse</h3>

      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Province *</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("city", ""); // Reset city when province changes
              }} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="btn-mobile-xxl">
                  <SelectValue placeholder="Sélectionnez une province" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {gabonProvinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
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
            <FormLabel>Ville *</FormLabel>
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
                {availableCities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
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
        name="neighborhood"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quartier (optionnel)</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Ex: Nombakélé, Glass, etc."
                  className="pl-10 btn-mobile-xxl"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
