import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Video, Check, AlertCircle } from "lucide-react";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step1Props {
  onNext: () => void;
}

export const Step1ConsultationType = ({ onNext }: Step1Props) => {
  const { consultationType, setConsultationType, provider } = useAppointmentStore();

  const canProceed = consultationType !== null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Comment souhaitez-vous consulter ?</h2>
        <p className="text-muted-foreground">Choisissez le mode de consultation qui vous convient</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Consultation au cabinet */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            consultationType === 'cabinet' ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
          onClick={() => setConsultationType('cabinet')}
        >
          <CardContent className="p-6 relative">
            {consultationType === 'cabinet' && (
              <div className="absolute top-4 right-4">
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-5 w-5" />
                </div>
              </div>
            )}
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Building2 className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Consultation au cabinet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Rendez-vous en personne au cabinet du praticien
                </p>
              </div>

              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span>Examen physique complet</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span>Tous types de soins disponibles</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span>Contact direct avec le praticien</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Téléconsultation */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            consultationType === 'telemedicine' ? 'ring-2 ring-primary shadow-lg' : ''
          } ${!provider?.telemedicine ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => provider?.telemedicine && setConsultationType('telemedicine')}
        >
          <CardContent className="p-6 relative">
            {consultationType === 'telemedicine' && (
              <div className="absolute top-4 right-4">
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-5 w-5" />
                </div>
              </div>
            )}
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Video className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Téléconsultation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Consultation vidéo en ligne depuis chez vous
                </p>
              </div>

              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span>Rapide et pratique</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span>Idéal pour renouvellement ordonnance</span>
                </div>
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Pas d'examen physique possible</span>
                </div>
              </div>

              {!provider?.telemedicine && (
                <p className="text-xs text-muted-foreground mt-4">
                  Ce praticien ne propose pas de téléconsultation
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {consultationType === 'telemedicine' && (
        <Alert className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Prérequis pour la téléconsultation :</p>
            <ul className="space-y-1 text-sm">
              <li>✓ Vérifiez votre connexion internet</li>
              <li>✓ Préparez vos documents médicaux</li>
              <li>✓ Soyez dans un endroit calme</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end max-w-4xl mx-auto">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          size="lg"
          className="min-w-32"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
