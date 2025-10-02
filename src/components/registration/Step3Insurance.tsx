import { UseFormReturn } from "react-hook-form";
import { CreditCard } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientRegistrationData } from "@/lib/validation";
import { cnamgsFunds, mutuelles } from "@/lib/gabon-data";

interface Step3InsuranceProps {
  form: UseFormReturn<PatientRegistrationData>;
}

export const Step3Insurance = ({ form }: Step3InsuranceProps) => {
  const insuranceType = form.watch("insuranceType");

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Assurance santé (optionnel)</h3>

      <FormField
        control={form.control}
        name="insuranceType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Type d'assurance</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { value: "none", label: "Aucune", emoji: "❌" },
                  { value: "cnamgs", label: "CNAMGS", emoji: "🏥" },
                  { value: "cnss", label: "CNSS", emoji: "💼" },
                  { value: "mutuelle", label: "Mutuelle", emoji: "🤝" },
                ].map((type) => (
                  <FormItem key={type.value}>
                    <FormControl>
                      <div>
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={type.value}
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                        >
                          <span className="text-xl mr-2">{type.emoji}</span>
                          <span className="font-medium text-sm">{type.label}</span>
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CNAMGS Fields */}
      {insuranceType === "cnamgs" && (
        <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-medium text-primary">Informations CNAMGS</h4>
          
          <FormField
            control={form.control}
            name="cnamgsNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro assuré CNAMGS *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Ex: 123456789"
                      className="pl-10 btn-mobile-xxl"
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
            name="cnamgsFund"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fonds *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="btn-mobile-xxl">
                      <SelectValue placeholder="Sélectionnez un fonds" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cnamgsFunds.map((fund) => (
                      <SelectItem key={fund.value} value={fund.value}>
                        {fund.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* CNSS Fields */}
      {insuranceType === "cnss" && (
        <div className="space-y-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
          <h4 className="font-medium text-secondary">Informations CNSS</h4>
          
          <FormField
            control={form.control}
            name="cnssNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro salarié CNSS *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Ex: 987654321"
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
      )}

      {/* Mutuelle Fields */}
      {insuranceType === "mutuelle" && (
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <h4 className="font-medium text-accent">Informations Mutuelle</h4>
          
          <FormField
            control={form.control}
            name="mutuelleProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la mutuelle *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="btn-mobile-xxl">
                      <SelectValue placeholder="Sélectionnez une mutuelle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mutuelles.map((mutuelle) => (
                      <SelectItem key={mutuelle.value} value={mutuelle.value}>
                        {mutuelle.label}
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
            name="mutuelleMemberNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro d'adhérent *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Ex: MTL123456"
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
      )}
    </div>
  );
};
