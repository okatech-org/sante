import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Smartphone, CreditCard, Building2, Shield, MapPin, Calendar, Clock, FileText, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step4Props {
  onConfirm: () => void;
  onBack: () => void;
}

export const Step4Payment = ({ onConfirm, onBack }: Step4Props) => {
  const {
    provider,
    consultationType,
    selectedDate,
    selectedTimeSlot,
    reason,
    paymentMethod,
    mobileMoneyNumber,
    mobileMoneyOperator,
    acceptedTerms,
    consultationPrice,
    conventionedPrice,
    cnamgsCoverage,
    gap,
    totalToPay,
    setPaymentMethod,
    setMobileMoneyNumber,
    setMobileMoneyOperator,
    setAcceptedTerms
  } = useAppointmentStore();

  const canProceed = paymentMethod !== null && acceptedTerms;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Récapitulatif et paiement</h2>
        <p className="text-muted-foreground">Vérifiez les informations et procédez au paiement</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Récapitulatif */}
        <Card className="bg-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl">👨‍⚕️</div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold">{provider?.name}</h3>
                  <p className="text-muted-foreground">{provider?.specialtyLabel}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-primary mt-0.5" />
                    <p className="font-medium">{selectedTimeSlot}</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {consultationType === 'cabinet' ? provider?.address : 'Téléconsultation'}
                      </p>
                      {consultationType === 'cabinet' && (
                        <p className="text-muted-foreground">{provider?.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Motif</p>
                      <p className="text-muted-foreground line-clamp-1">{reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              💰 DÉTAIL DES FRAIS
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Consultation :</span>
                <span className="font-medium">{consultationPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Tarif Conventionné :</span>
                <span className="font-medium">{conventionedPrice.toLocaleString()} FCFA</span>
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-green-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Votre assurance : CNAMGS Secteur Public</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Part CNAMGS (80%) :</span>
                  <span className="font-medium text-green-600">-{cnamgsCoverage.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Ticket modérateur (20%) :</span>
                  <span className="font-medium">+{(conventionedPrice - cnamgsCoverage).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>GAP (TP - TC) :</span>
                  <span className="font-medium">+{gap.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>TOTAL À PAYER :</span>
                  <span className="text-primary">{totalToPay.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Paiement exigé à la réservation pour confirmer votre rendez-vous
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Mode de paiement */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Mode de paiement</h3>
            <RadioGroup
              value={paymentMethod || undefined}
              onValueChange={(value) => setPaymentMethod(value as any)}
              className="space-y-3"
            >
              {/* Mobile Money */}
              <Card className={`cursor-pointer transition-all ${paymentMethod === 'mobile-money' ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <RadioGroupItem value="mobile-money" id="mobile-money" />
                    <Label htmlFor="mobile-money" className="cursor-pointer flex items-center gap-2 flex-1">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-xs text-muted-foreground">Airtel Money / Moov Money</p>
                      </div>
                    </Label>
                  </div>

                  {paymentMethod === 'mobile-money' && (
                    <div className="space-y-3 pl-8 animate-fade-in">
                      <div>
                        <Label htmlFor="phone">Numéro de téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={mobileMoneyNumber}
                          onChange={(e) => setMobileMoneyNumber(e.target.value)}
                          placeholder="+241 XX XX XX XX"
                          className="mt-1"
                        />
                      </div>

                      <RadioGroup
                        value={mobileMoneyOperator || undefined}
                        onValueChange={(value) => setMobileMoneyOperator(value as any)}
                        className="flex gap-3"
                      >
                        <Card className={`flex-1 cursor-pointer ${mobileMoneyOperator === 'airtel' ? 'ring-2 ring-primary' : ''}`}>
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="airtel" id="airtel" />
                              <Label htmlFor="airtel" className="cursor-pointer text-sm">
                                Airtel Money
                              </Label>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className={`flex-1 cursor-pointer ${mobileMoneyOperator === 'moov' ? 'ring-2 ring-primary' : ''}`}>
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="moov" id="moov" />
                              <Label htmlFor="moov" className="cursor-pointer text-sm">
                                Moov Money
                              </Label>
                            </div>
                          </CardContent>
                        </Card>
                      </RadioGroup>

                      <p className="text-xs text-muted-foreground">
                        Un code USSD sera envoyé à votre téléphone pour confirmer le paiement
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Carte bancaire */}
              <Card className={`cursor-pointer transition-all ${paymentMethod === 'card' ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer flex items-center gap-2 flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Carte Bancaire</p>
                        <p className="text-xs text-muted-foreground">Visa / Mastercard</p>
                      </div>
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      🔒 Sécurisé
                    </Badge>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="pl-8 mt-3 space-y-3 animate-fade-in">
                      <Alert>
                        <AlertDescription className="text-xs">
                          Paiement sécurisé 100%. Vos données bancaires ne sont jamais stockées.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payer sur place */}
              <Card className={`cursor-pointer transition-all ${paymentMethod === 'on-site' ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <RadioGroupItem value="on-site" id="on-site" />
                    <Label htmlFor="on-site" className="cursor-pointer flex items-center gap-2 flex-1">
                      <Building2 className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Payer sur place</p>
                        <p className="text-xs text-muted-foreground">Paiement au cabinet le jour du RDV</p>
                      </div>
                    </Label>
                  </div>

                  {paymentMethod === 'on-site' && (
                    <Alert className="ml-8 animate-fade-in" variant="default">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Assurez-vous d'avoir le montant exact ({totalToPay.toLocaleString()} FCFA) en espèces ou préparez votre Mobile Money
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                J'accepte les{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="h-auto p-0 text-sm">
                      conditions d'annulation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Conditions d'annulation</DialogTitle>
                      <DialogDescription asChild>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-foreground">✓ Annulation gratuite</p>
                            <p>Plus de 24 heures avant le rendez-vous : Remboursement intégral</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">⚠️ Annulation tardive</p>
                            <p>Moins de 24 heures avant : 50% du montant remboursé</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">❌ Annulation très tardive</p>
                            <p>Moins de 2 heures avant : Aucun remboursement</p>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto sticky bottom-0 bg-background pt-4 border-t">
        <Button variant="outline" onClick={onBack} size="lg">
          Précédent
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={!canProceed} 
          size="lg" 
          className="min-w-48"
        >
          Confirmer le rendez-vous
        </Button>
      </div>
    </div>
  );
};
