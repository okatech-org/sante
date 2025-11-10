import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Lock } from "lucide-react";

interface CardPaymentFormProps {
  onValidationChange: (isValid: boolean, data: CardData) => void;
}

interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export function CardPaymentForm({ onValidationChange }: CardPaymentFormProps) {
  const [formData, setFormData] = useState<CardData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });

  const [errors, setErrors] = useState<Partial<CardData>>({});

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiryDate = (date: string) => {
    return /^\d{2}\/\d{2}$/.test(date);
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const handleChange = (field: keyof CardData, value: string) => {
    let formattedValue = value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }

    // Only allow digits for CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    const newFormData = { ...formData, [field]: formattedValue };
    setFormData(newFormData);

    // Validate field
    const newErrors = { ...errors };
    if (field === 'cardNumber' && !validateCardNumber(formattedValue)) {
      newErrors.cardNumber = "Numéro de carte invalide";
    } else if (field === 'cardNumber') {
      delete newErrors.cardNumber;
    }

    if (field === 'expiryDate' && formattedValue.length === 5 && !validateExpiryDate(formattedValue)) {
      newErrors.expiryDate = "Date invalide (MM/AA)";
    } else if (field === 'expiryDate') {
      delete newErrors.expiryDate;
    }

    if (field === 'cvv' && formattedValue.length >= 3 && !validateCVV(formattedValue)) {
      newErrors.cvv = "CVV invalide";
    } else if (field === 'cvv') {
      delete newErrors.cvv;
    }

    if (field === 'cardHolder' && formattedValue.trim().length < 3) {
      newErrors.cardHolder = "Nom requis";
    } else if (field === 'cardHolder') {
      delete newErrors.cardHolder;
    }

    setErrors(newErrors);

    // Check if form is valid
    const isValid = 
      validateCardNumber(newFormData.cardNumber) &&
      newFormData.cardHolder.trim().length >= 3 &&
      validateExpiryDate(newFormData.expiryDate) &&
      validateCVV(newFormData.cvv);

    onValidationChange(isValid, newFormData);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Mode démo: utilisez n'importe quel numéro de carte pour tester
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Numéro de carte</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            maxLength={19}
            className={errors.cardNumber ? "border-destructive" : ""}
          />
          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-destructive">{errors.cardNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardHolder">Titulaire de la carte</Label>
        <Input
          id="cardHolder"
          placeholder="JEAN DUPONT"
          value={formData.cardHolder}
          onChange={(e) => handleChange('cardHolder', e.target.value.toUpperCase())}
          className={errors.cardHolder ? "border-destructive" : ""}
        />
        {errors.cardHolder && (
          <p className="text-sm text-destructive">{errors.cardHolder}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Date d'expiration</Label>
          <Input
            id="expiryDate"
            placeholder="MM/AA"
            value={formData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            maxLength={5}
            className={errors.expiryDate ? "border-destructive" : ""}
          />
          {errors.expiryDate && (
            <p className="text-sm text-destructive">{errors.expiryDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="123"
            value={formData.cvv}
            onChange={(e) => handleChange('cvv', e.target.value)}
            maxLength={4}
            className={errors.cvv ? "border-destructive" : ""}
          />
          {errors.cvv && (
            <p className="text-sm text-destructive">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
}