import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppointmentStore } from "@/stores/appointmentStore";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

const documentOptions = [
  "Carte d'identité",
  "Carte CNAMGS/CNSS",
  "Ordonnances précédentes",
  "Résultats d'examens récents",
  "Carnet de vaccination",
  "Liste médicaments actuels"
];

export const Step3ReasonInfo = ({ onNext, onBack }: Step3Props) => {
  const {
    reason,
    isFirstVisit,
    documents,
    additionalInfo,
    setReason,
    setIsFirstVisit,
    toggleDocument,
    setAdditionalInfo
  } = useAppointmentStore();

  const canProceed = reason.trim().length > 0 && isFirstVisit !== null;
  const reasonCharCount = reason.length;
  const additionalInfoCharCount = additionalInfo.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Motif de consultation</h2>
        <p className="text-muted-foreground">Aidez le praticien à mieux préparer votre consultation</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Motif principal */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="reason" className="text-base font-semibold">
                Motif principal <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Décrivez brièvement la raison de votre consultation
              </p>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 200))}
                placeholder="Ex: Contrôle tension artérielle, Douleur thoracique, Renouvellement ordonnance..."
                className="min-h-24 resize-none"
                maxLength={200}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${reasonCharCount > 180 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {reasonCharCount}/200 caractères
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Première consultation */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Première consultation avec ce praticien ? <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={isFirstVisit === null ? undefined : isFirstVisit ? "yes" : "no"}
                onValueChange={(value) => setIsFirstVisit(value === "yes")}
                className="space-y-3"
              >
                <Card className={`cursor-pointer transition-all ${isFirstVisit === true ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="yes" id="first-yes" />
                      <Label htmlFor="first-yes" className="cursor-pointer flex-1 font-normal">
                        Oui, c'est ma première fois
                      </Label>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${isFirstVisit === false ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="no" id="first-no" />
                      <Label htmlFor="first-no" className="cursor-pointer flex-1 font-normal">
                        Non, je suis déjà patient(e)
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Documents à apporter */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Documents à apporter <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
              </Label>
              <div className="space-y-3">
                {documentOptions.map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      id={doc}
                      checked={documents.includes(doc)}
                      onCheckedChange={() => toggleDocument(doc)}
                    />
                    <Label htmlFor={doc} className="font-normal cursor-pointer">
                      {doc}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations importantes */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="additional-info" className="text-base font-semibold">
                Informations importantes <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Allergies, traitements en cours, antécédents médicaux importants
              </p>
              <Textarea
                id="additional-info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value.slice(0, 300))}
                placeholder="Ex: Allergie à la pénicilline, traitement pour hypertension..."
                className="min-h-24 resize-none"
                maxLength={300}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${additionalInfoCharCount > 270 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {additionalInfoCharCount}/300 caractères
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between max-w-3xl mx-auto">
        <Button variant="outline" onClick={onBack} size="lg">
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="min-w-32">
          Suivant
        </Button>
      </div>
    </div>
  );
};
