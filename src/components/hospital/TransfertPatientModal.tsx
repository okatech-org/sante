import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight, User, Clock, AlertCircle, Loader2,
  CheckCircle, X, Building, Stethoscope, Users, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Patient {
  id: string;
  name: string;
  arrivalTime: string;
  waitTime: number;
  status: 'waiting' | 'called' | 'in_service';
}

interface TransfertPatientModalProps {
  open: boolean;
  onClose: () => void;
  serviceOrigine: string;
  patient?: Patient;
  onTransfertComplete: (serviceDestination: string, motif: string) => void;
}

export function TransfertPatientModal({
  open,
  onClose,
  serviceOrigine,
  patient,
  onTransfertComplete
}: TransfertPatientModalProps) {
  const [serviceDestination, setServiceDestination] = useState('');
  const [motifTransfert, setMotifTransfert] = useState('');
  const [priorite, setPriorite] = useState<'normale' | 'urgente'>('normale');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const servicesDisponibles = [
    { value: 'Consultation générale', label: 'Consultation générale', icon: Users, disponibilite: 'Disponible' },
    { value: 'Cardiologie', label: 'Cardiologie', icon: Stethoscope, disponibilite: 'Disponible' },
    { value: 'Radiologie', label: 'Radiologie', icon: Activity, disponibilite: 'Attente 15min' },
    { value: 'Pédiatrie', label: 'Pédiatrie', icon: Users, disponibilite: 'Disponible' },
    { value: 'Gynécologie', label: 'Gynécologie', icon: Stethoscope, disponibilite: 'Disponible' },
    { value: 'Laboratoire', label: 'Laboratoire', icon: Activity, disponibilite: 'Disponible' },
    { value: 'Ophtalmologie', label: 'Ophtalmologie', icon: Stethoscope, disponibilite: 'Attente 30min' },
    { value: 'Dermatologie', label: 'Dermatologie', icon: Stethoscope, disponibilite: 'Disponible' }
  ].filter(s => s.value !== serviceOrigine);

  const motifsFrequents = [
    'Besoin d\'une consultation spécialisée',
    'Examen complémentaire requis',
    'Avis spécialiste demandé par médecin',
    'Patient mal orienté initialement',
    'Urgence médicale détectée',
    'Transfert pour imagerie',
    'Transfert pour analyses biologiques'
  ];

  // Reset au changement de patient
  useEffect(() => {
    if (open) {
      setServiceDestination('');
      setMotifTransfert('');
      setPriorite('normale');
      setErrors({});
    }
  }, [open, patient]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!serviceDestination) {
      newErrors.serviceDestination = 'Le service de destination est obligatoire';
    }

    if (!motifTransfert.trim()) {
      newErrors.motifTransfert = 'Le motif du transfert est obligatoire';
    } else if (motifTransfert.trim().length < 10) {
      newErrors.motifTransfert = 'Le motif doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation API POST /api/transfert-patient
      await new Promise(resolve => setTimeout(resolve, 2000));

      onTransfertComplete(serviceDestination, motifTransfert);
      
      toast.success(`Patient transféré vers ${serviceDestination}`);
      onClose();

    } catch (err) {
      toast.error('Erreur lors du transfert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-blue-600" />
            Transfert de patient
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations patient */}
          {patient && (
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-semibold flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {patient.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Temps d'attente</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {patient.waitTime} min
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service actuel</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {serviceOrigine}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Arrivée</p>
                    <p className="font-semibold">{patient.arrivalTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service de destination */}
          <div className="space-y-2">
            <Label htmlFor="serviceDestination">
              Service de destination *
            </Label>
            <Select
              value={serviceDestination}
              onValueChange={(value) => {
                setServiceDestination(value);
                if (errors.serviceDestination) {
                  setErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors.serviceDestination;
                    return newErrors;
                  });
                }
              }}
            >
              <SelectTrigger 
                id="serviceDestination"
                className={errors.serviceDestination ? 'border-red-500' : ''}
                aria-label="Sélectionner le service de destination"
              >
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {servicesDisponibles.map(service => (
                  <SelectItem key={service.value} value={service.value}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="flex items-center gap-2">
                        <service.icon className="h-4 w-4" />
                        {service.label}
                      </span>
                      <Badge 
                        variant={service.disponibilite === 'Disponible' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {service.disponibilite}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceDestination && (
              <p className="text-xs text-red-500">{errors.serviceDestination}</p>
            )}
          </div>

          {/* Priorité */}
          <div className="space-y-2">
            <Label>Priorité du transfert</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={priorite === 'normale' ? 'default' : 'outline'}
                onClick={() => setPriorite('normale')}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Normale
              </Button>
              <Button
                type="button"
                variant={priorite === 'urgente' ? 'destructive' : 'outline'}
                onClick={() => setPriorite('urgente')}
                className="flex-1"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Urgente
              </Button>
            </div>
          </div>

          {/* Motif */}
          <div className="space-y-2">
            <Label htmlFor="motifTransfert">
              Motif du transfert *
            </Label>
            
            {/* Suggestions rapides */}
            <div className="flex flex-wrap gap-2 mb-2">
              {motifsFrequents.slice(0, 3).map(motif => (
                <Button
                  key={motif}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMotifTransfert(motif)}
                  className="text-xs"
                >
                  {motif}
                </Button>
              ))}
            </div>

            <Textarea
              id="motifTransfert"
              value={motifTransfert}
              onChange={(e) => {
                setMotifTransfert(e.target.value);
                if (errors.motifTransfert) {
                  setErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors.motifTransfert;
                    return newErrors;
                  });
                }
              }}
              placeholder="Expliquez la raison du transfert (min. 10 caractères)..."
              rows={4}
              className={errors.motifTransfert ? 'border-red-500' : ''}
              aria-label="Motif du transfert"
            />
            {errors.motifTransfert && (
              <p className="text-xs text-red-500">{errors.motifTransfert}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {motifTransfert.length}/200 caractères
            </p>
          </div>

          {/* Info transfert urgente */}
          {priorite === 'urgente' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Transfert urgent : Le patient sera placé en priorité dans la file du service de destination
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Annuler le transfert"
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={priorite === 'urgente' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
              aria-label="Confirmer le transfert"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transfert en cours...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Transférer patient
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
