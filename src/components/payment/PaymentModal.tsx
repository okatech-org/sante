import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CardPaymentForm } from "./CardPaymentForm";
import { AirtelMoneyForm } from "./AirtelMoneyForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  professionalId: string;
  appointmentId?: string;
  teleconsultationId?: string;
  onPaymentSuccess?: () => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  amount,
  professionalId,
  appointmentId,
  teleconsultationId,
  onPaymentSuccess
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleMethodSelect = (methodType: string) => {
    setSelectedMethod(methodType);
    setPaymentData(null);
    setIsValid(false);
    setPaymentStatus('idle');
  };

  const handleValidationChange = (valid: boolean, data: any) => {
    setIsValid(valid);
    setPaymentData(data);
  };

  const simulatePaymentProcessing = async (): Promise<boolean> => {
    // Simulate payment gateway processing (demo mode)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 95% success rate in demo mode
    return Math.random() > 0.05;
  };

  const handlePayment = async () => {
    if (!isValid || !selectedMethod || !paymentData) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    setProcessing(true);
    setPaymentStatus('processing');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      // Simulate payment processing
      const paymentSuccess = await simulatePaymentProcessing();

      if (!paymentSuccess) {
        throw new Error("Le paiement a été refusé. Veuillez réessayer.");
      }

      // Generate transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          appointment_id: appointmentId || null,
          teleconsultation_id: teleconsultationId || null,
          patient_id: user.id,
          professional_id: professionalId,
          amount: amount,
          currency: 'XAF',
          payment_method: selectedMethod,
          status: 'completed',
          transaction_id: transactionId,
          payment_details: {
            ...paymentData,
            demo_mode: true,
            processed_at: new Date().toISOString()
          }
        });

      if (paymentError) throw paymentError;

      // Send success notification
      await supabase.functions.invoke('send-payment-notifications', {
        body: {
          userId: user.id,
          title: 'Paiement réussi',
          message: `Votre paiement de ${amount.toLocaleString()} XAF a été traité avec succès.`,
          type: 'payment_success',
          paymentId: transactionId,
          metadata: {
            amount,
            currency: 'XAF',
            paymentMethod: selectedMethod,
            transactionId
          }
        }
      });

      setPaymentStatus('success');
      
      toast.success("Paiement effectué avec succès", {
        description: `Transaction: ${transactionId}`
      });

      // Wait a bit to show success state
      setTimeout(() => {
        onPaymentSuccess?.();
        onOpenChange(false);
        resetForm();
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      
      // Send failure notification
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await supabase.functions.invoke('send-payment-notifications', {
            body: {
              userId: currentUser.id,
              title: 'Paiement échoué',
              message: `Le paiement de ${amount.toLocaleString()} XAF n'a pas pu être traité. ${error.message}`,
              type: 'payment_failed',
              paymentId: '',
              metadata: {
                amount,
                currency: 'XAF',
                error: error.message
              }
            }
          });
        }
      } catch (notifError) {
        console.error('Error sending failure notification:', notifError);
      }
      
      toast.error("Erreur de paiement", {
        description: error.message || "Une erreur est survenue lors du paiement"
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedMethod(null);
    setPaymentData(null);
    setIsValid(false);
    setPaymentStatus('idle');
  };

  const handleClose = () => {
    if (!processing) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Paiement sécurisé</DialogTitle>
          <DialogDescription>
            Effectuez votre paiement de manière sécurisée
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Display */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Montant à payer</span>
              <span className="text-2xl font-bold">{amount.toLocaleString()} XAF</span>
            </div>
          </div>

          {paymentStatus === 'idle' || paymentStatus === 'error' ? (
            <>
              {/* Payment Method Selection */}
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onMethodSelect={handleMethodSelect}
              />

              {selectedMethod && <Separator />}

              {/* Payment Form */}
              {selectedMethod === 'card' && (
                <CardPaymentForm onValidationChange={handleValidationChange} />
              )}

              {selectedMethod === 'airtel_money' && (
                <AirtelMoneyForm onValidationChange={handleValidationChange} />
              )}

              {paymentStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Le paiement a échoué. Veuillez vérifier vos informations et réessayer.
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : paymentStatus === 'processing' ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="font-medium">Traitement du paiement...</p>
                <p className="text-sm text-muted-foreground">
                  Veuillez ne pas fermer cette fenêtre
                </p>
              </div>
            </div>
          ) : paymentStatus === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium text-lg">Paiement réussi !</p>
                <p className="text-sm text-muted-foreground">
                  Votre transaction a été traitée avec succès
                </p>
              </div>
            </div>
          )}
        </div>

        {(paymentStatus === 'idle' || paymentStatus === 'error') && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={processing}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!isValid || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                `Payer ${amount.toLocaleString()} XAF`
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}