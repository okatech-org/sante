import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Info } from "lucide-react";

interface AirtelMoneyFormProps {
  onValidationChange: (isValid: boolean, data: AirtelMoneyData) => void;
}

interface AirtelMoneyData {
  phoneNumber: string;
  accountName: string;
}

export function AirtelMoneyForm({ onValidationChange }: AirtelMoneyFormProps) {
  const [formData, setFormData] = useState<AirtelMoneyData>({
    phoneNumber: "",
    accountName: ""
  });

  const [errors, setErrors] = useState<Partial<AirtelMoneyData>>({});

  const validatePhoneNumber = (phone: string) => {
    // Gabon phone format: +241 XX XX XX XX or 0X XX XX XX
    const cleaned = phone.replace(/\s/g, '');
    return /^(\+241|0)[67]\d{7}$/.test(cleaned);
  };

  const handleChange = (field: keyof AirtelMoneyData, value: string) => {
    let formattedValue = value;

    // Format phone number
    if (field === 'phoneNumber') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.startsWith('241')) {
        formattedValue = '+' + formattedValue;
      } else if (!formattedValue.startsWith('+241') && !formattedValue.startsWith('0')) {
        formattedValue = '+241' + formattedValue;
      }
    }

    const newFormData = { ...formData, [field]: formattedValue };
    setFormData(newFormData);

    // Validate field
    const newErrors = { ...errors };
    if (field === 'phoneNumber' && !validatePhoneNumber(formattedValue)) {
      newErrors.phoneNumber = "Numéro de téléphone invalide";
    } else if (field === 'phoneNumber') {
      delete newErrors.phoneNumber;
    }

    if (field === 'accountName' && formattedValue.trim().length < 3) {
      newErrors.accountName = "Nom du compte requis";
    } else if (field === 'accountName') {
      delete newErrors.accountName;
    }

    setErrors(newErrors);

    // Check if form is valid
    const isValid = 
      validatePhoneNumber(newFormData.phoneNumber) &&
      newFormData.accountName.trim().length >= 3;

    onValidationChange(isValid, newFormData);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Mode démo: Vous recevrez une notification de paiement simulée
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Numéro Airtel Money</Label>
        <div className="relative">
          <Input
            id="phoneNumber"
            placeholder="+241 XX XX XX XX"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className={errors.phoneNumber ? "border-destructive" : ""}
          />
          <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Format: +241 XX XX XX XX ou 0X XX XX XX
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountName">Nom du compte</Label>
        <Input
          id="accountName"
          placeholder="Votre nom complet"
          value={formData.accountName}
          onChange={(e) => handleChange('accountName', e.target.value)}
          className={errors.accountName ? "border-destructive" : ""}
        />
        {errors.accountName && (
          <p className="text-sm text-destructive">{errors.accountName}</p>
        )}
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Smartphone className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          Vous recevrez une demande de confirmation sur votre téléphone mobile
        </AlertDescription>
      </Alert>
    </div>
  );
}