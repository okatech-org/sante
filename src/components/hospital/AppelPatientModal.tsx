import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bell, User, Clock, Building, Phone, AlertCircle,
  Loader2, Volume2, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  arrivalTime: string;
  waitTime: number;
  status: 'waiting' | 'called' | 'in_service';
}

interface AppelPatientModalProps {
  open: boolean;
  onClose: () => void;
  service: string;
  patient: Patient | null;
  onConfirm: () => void;
}

export function AppelPatientModal({
  open,
  onClose,
  service,
  patient,
  onConfirm
}: AppelPatientModalProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [callMethod, setCallMethod] = useState<'audio' | 'sms' | 'les_deux'>('audio');

  const handleConfirmCall = async () => {
    setIsCalling(true);

    try {
      // Simulation appel patient
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Son d'appel (simulation)
      if (callMethod === 'audio' || callMethod === 'les_deux') {
        toast.success('🔔 Appel audio diffusé dans la salle d\'attente');
      }

      // SMS (simulation)
      if (callMethod === 'sms' || callMethod === 'les_deux') {
        toast.success('📱 SMS envoyé au patient');
      }

      onConfirm();
      onClose();

    } catch (err) {
      toast.error('Erreur lors de l\'appel du patient');
    } finally {
      setIsCalling(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600 animate-pulse" />
            Appeler le patient
          </DialogTitle>
          <DialogDescription>
            Sélectionnez la méthode d'appel et confirmez l'action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informations patient */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-lg">{patient.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-medium flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {service}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Temps d'attente</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {patient.waitTime} minutes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Méthode d'appel */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Méthode d'appel</Label>
            
            <div className="grid gap-2">
              <Button
                type="button"
                variant={callMethod === 'audio' ? 'default' : 'outline'}
                onClick={() => setCallMethod('audio')}
                className="justify-start"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Appel audio salle d'attente
              </Button>
              
              <Button
                type="button"
                variant={callMethod === 'sms' ? 'default' : 'outline'}
                onClick={() => setCallMethod('sms')}
                className="justify-start"
              >
                <Phone className="mr-2 h-4 w-4" />
                Notification SMS
              </Button>
              
              <Button
                type="button"
                variant={callMethod === 'les_deux' ? 'default' : 'outline'}
                onClick={() => setCallMethod('les_deux')}
                className="justify-start"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Audio + SMS (recommandé)
              </Button>
            </div>
          </div>

          {/* Alerte */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Le patient sera retiré de la file d'attente et le prochain patient avancera automatiquement.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isCalling}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmCall}
              disabled={isCalling}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCalling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Appel en cours...
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Confirmer l'appel
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
