import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onMethodSelect: (methodType: string) => void;
}

export function PaymentMethodSelector({ selectedMethod, onMethodSelect }: PaymentMethodSelectorProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setMethods(data || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error("Erreur lors du chargement des méthodes de paiement");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return CreditCard;
      case 'Smartphone':
        return Smartphone;
      default:
        return CreditCard;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Mode de paiement</Label>
      <RadioGroup value={selectedMethod || ""} onValueChange={onMethodSelect}>
        <div className="grid gap-3">
          {methods.map((method) => {
            const Icon = getIcon(method.icon);
            return (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all ${
                  selectedMethod === method.type 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => onMethodSelect(method.type)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value={method.type} id={method.id} />
                  <Icon className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <Label 
                      htmlFor={method.id}
                      className="cursor-pointer font-medium"
                    >
                      {method.name}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}