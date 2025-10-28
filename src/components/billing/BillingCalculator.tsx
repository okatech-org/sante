import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Shield,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEstablishment } from '@/contexts/EstablishmentContext';

interface BillingCalculation {
  montant_total: number;
  tarif_conventionne_cnamgs: number;
  prise_en_charge_cnamgs: number;
  gap: number;
  ticket_moderateur: number;
  reste_a_charge_patient: number;
}

interface CnamgsVerification {
  cnamgs_number: string;
  verification_status: string;
  fund: string;
  coverage_rate: number;
  plafond_remaining: number;
}

interface BillingCalculatorProps {
  patientId: string;
  consultationId?: string;
  prescriptionId?: string;
  onInvoiceCreated?: (invoiceId: string) => void;
  className?: string;
}

export function BillingCalculator({ 
  patientId, 
  consultationId, 
  prescriptionId,
  onInvoiceCreated,
  className = "" 
}: BillingCalculatorProps) {
  const { currentEstablishment } = useEstablishment();
  const [cnamgsVerification, setCnamgsVerification] = useState<CnamgsVerification | null>(null);
  const [montantTotal, setMontantTotal] = useState<number>(0);
  const [tarifConventionne, setTarifConventionne] = useState<number>(0);
  const [calculation, setCalculation] = useState<BillingCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  useEffect(() => {
    if (patientId) {
      verifyCnamgsRights();
    }
  }, [patientId]);

  useEffect(() => {
    if (montantTotal > 0) {
      calculateBilling();
    }
  }, [montantTotal, tarifConventionne, cnamgsVerification]);

  const verifyCnamgsRights = async () => {
    try {
      setLoading(true);
      
      // Récupérer les droits CNAMGS du patient
      const { data, error } = await supabase
        .from('cnamgs_verifications')
        .select('*')
        .eq('user_id', patientId)
        .eq('verification_status', 'verified')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCnamgsVerification({
          cnamgs_number: data.cnamgs_number,
          verification_status: data.verification_status,
          fund: data.fund,
          coverage_rate: 0.8, // 80% par défaut
          plafond_remaining: 500000 // FCFA par défaut
        });
      }
    } catch (err) {
      console.error('Erreur lors de la vérification CNAMGS:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la vérification CNAMGS');
    } finally {
      setLoading(false);
    }
  };

  const calculateBilling = async () => {
    if (!montantTotal || !currentEstablishment) return;

    try {
      // Utiliser la fonction SQL pour calculer les charges CNAMGS
      const { data, error } = await supabase.rpc('calculate_cnamgs_charges', {
        p_montant_total: montantTotal,
        p_taux_cnamgs: cnamgsVerification?.coverage_rate || 0.8,
        p_tarif_conventionne: tarifConventionne || montantTotal
      });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const calc = data[0];
        setCalculation({
          montant_total: montantTotal,
          tarif_conventionne_cnamgs: calc.tarif_conventionne,
          prise_en_charge_cnamgs: calc.prise_en_charge,
          gap: calc.gap,
          ticket_moderateur: calc.ticket_moderateur,
          reste_a_charge_patient: calc.reste_a_charge
        });
      }
    } catch (err) {
      console.error('Erreur lors du calcul:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul');
    }
  };

  const createInvoice = async () => {
    if (!calculation || !currentEstablishment || !patientId) return;

    try {
      setLoading(true);

      // Générer le numéro de facture
      const { data: invoiceNumber, error: numberError } = await supabase.rpc('generate_invoice_number');
      
      if (numberError) {
        throw numberError;
      }

      // Créer la facture
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          patient_id: patientId,
          establishment_id: currentEstablishment.id,
          consultation_id: consultationId,
          prescription_id: prescriptionId,
          montant_total: calculation.montant_total,
          tarif_conventionne_cnamgs: calculation.tarif_conventionne_cnamgs,
          prise_en_charge_cnamgs: calculation.prise_en_charge_cnamgs,
          gap: calculation.gap,
          ticket_moderateur: calculation.ticket_moderateur,
          reste_a_charge_patient: calculation.reste_a_charge_patient,
          statut: 'pending'
        })
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // Créer le paiement si méthode sélectionnée
      if (paymentMethod && invoice) {
        await createPayment(invoice.id);
      }

      onInvoiceCreated?.(invoice.id);
    } catch (err) {
      console.error('Erreur lors de la création de la facture:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          invoice_id: invoiceId,
          amount: calculation?.reste_a_charge_patient || 0,
          payment_method: paymentMethod,
          statut: 'pending'
        });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Erreur lors de la création du paiement:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'cnamgs_tiers_payant':
        return <Shield className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Espèces';
      case 'mobile_money':
        return 'Mobile Money';
      case 'card':
        return 'Carte bancaire';
      case 'cnamgs_tiers_payant':
        return 'Tiers-payant CNAMGS';
      default:
        return method;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Vérification CNAMGS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Vérification CNAMGS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cnamgsVerification ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Droits CNAMGS actifs
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">N° CNAMGS :</span>
                  <span className="ml-2 font-medium">{cnamgsVerification.cnamgs_number}</span>
                </div>
                <div>
                  <span className="text-gray-500">Taux couverture :</span>
                  <span className="ml-2 font-medium">
                    {(cnamgsVerification.coverage_rate * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Caisse :</span>
                  <span className="ml-2 font-medium">{cnamgsVerification.fund}</span>
                </div>
                <div>
                  <span className="text-gray-500">Plafond restant :</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(cnamgsVerification.plafond_remaining)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              <span>Droits CNAMGS non vérifiés - Facturation au tarif normal</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calcul de facturation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-green-600" />
            <span>Calcul de facturation</span>
          </CardTitle>
          <CardDescription>
            Calcul automatique des charges CNAMGS et reste à charge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Montants de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="montant-total">Montant total (FCFA)</Label>
              <Input
                id="montant-total"
                type="number"
                value={montantTotal || ''}
                onChange={(e) => setMontantTotal(Number(e.target.value))}
                placeholder="25000"
              />
            </div>
            <div>
              <Label htmlFor="tarif-conventionne">Tarif conventionné CNAMGS (FCFA)</Label>
              <Input
                id="tarif-conventionne"
                type="number"
                value={tarifConventionne || ''}
                onChange={(e) => setTarifConventionne(Number(e.target.value))}
                placeholder="20000"
              />
            </div>
          </div>

          {/* Résultat du calcul */}
          {calculation && (
            <div className="space-y-4">
              <Separator />
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Détail du calcul</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Montant total :</span>
                    <span className="font-medium">{formatCurrency(calculation.montant_total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tarif conventionné CNAMGS :</span>
                    <span className="font-medium">{formatCurrency(calculation.tarif_conventionne_cnamgs)}</span>
                  </div>
                  
                  <div className="flex justify-between text-green-600">
                    <span>Prise en charge CNAMGS :</span>
                    <span className="font-medium">-{formatCurrency(calculation.prise_en_charge_cnamgs)}</span>
                  </div>
                  
                  {calculation.gap > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>GAP (différence tarif) :</span>
                      <span className="font-medium">+{formatCurrency(calculation.gap)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-blue-600">
                    <span>Ticket modérateur (20%) :</span>
                    <span className="font-medium">+{formatCurrency(calculation.ticket_moderateur)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Reste à charge patient :</span>
                    <span className="text-red-600">{formatCurrency(calculation.reste_a_charge_patient)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Méthode de paiement */}
          {calculation && (
            <div className="space-y-4">
              <Separator />
              
              <div>
                <Label className="text-base font-medium">Méthode de paiement</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {['cash', 'mobile_money', 'card', 'cnamgs_tiers_payant'].map((method) => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? 'default' : 'outline'}
                      className="flex items-center space-x-2"
                      onClick={() => setPaymentMethod(method)}
                    >
                      {getPaymentMethodIcon(method)}
                      <span className="text-xs">{getPaymentMethodLabel(method)}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => window.print()}>
                  Imprimer
                </Button>
                <Button 
                  onClick={createInvoice}
                  disabled={loading || !paymentMethod}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Création...' : 'Créer la facture'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <Info className="h-4 w-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium mb-1">Informations importantes :</p>
              <ul className="space-y-1 text-xs">
                <li>• Le GAP correspond à la différence entre le tarif pratiqué et le tarif conventionné CNAMGS</li>
                <li>• Le ticket modérateur est de 20% du tarif conventionné (non remboursé par CNAMGS)</li>
                <li>• Le tiers-payant CNAMGS sera traité automatiquement après paiement patient</li>
                <li>• Les remboursements CNAMGS sont généralement effectués sous 30 jours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Erreur */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Erreur</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BillingCalculator;
