import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Calendar, Clock, User, Phone, FileText, Stethoscope,
  Loader2, AlertCircle, CheckCircle, X, Save
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Appointment {
  id: number;
  patient: string;
  time: string;
  service: string;
  status: 'confirmé' | 'arrivé' | 'en attente' | 'en cours' | 'terminé';
  phone: string;
  numeroCNAMGS?: string;
  motif?: string;
}

interface ModifierRDVModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  onUpdate: (updatedAppointment: Appointment) => void;
}

export function ModifierRDVModal({
  open,
  onClose,
  appointment,
  onUpdate
}: ModifierRDVModalProps) {
  const [formData, setFormData] = useState<Appointment>(appointment);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const services = [
    'Consultation générale',
    'Cardiologie',
    'Radiologie',
    'Pédiatrie',
    'Gynécologie',
    'Ophtalmologie',
    'Dermatologie',
    'Laboratoire'
  ];

  const horairesDispo = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  // Charger les données du RDV
  useEffect(() => {
    if (open) {
      setFormData(appointment);
      setIsDirty(false);
      setErrors({});
    }
  }, [open, appointment]);

  // Détecter les changements
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(appointment);
    setIsDirty(hasChanged);
  }, [formData, appointment]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.patient.trim()) {
      newErrors.patient = 'Le nom du patient est obligatoire';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else {
      const phoneRegex = /^(06|07)\d{7}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Format téléphone invalide (ex: 077123456)';
      }
    }

    if (!formData.time) {
      newErrors.time = 'L\'heure est obligatoire';
    }

    if (!formData.service) {
      newErrors.service = 'Le service est obligatoire';
    }

    if (formData.numeroCNAMGS && formData.numeroCNAMGS.trim()) {
      const cnamgsRegex = /^GA\d{9}$/;
      if (!cnamgsRegex.test(formData.numeroCNAMGS)) {
        newErrors.numeroCNAMGS = 'Format CNAMGS invalide (ex: GA123456789)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestionnaires
  const handleChange = (field: keyof Appointment, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Nettoyer l'erreur du champ
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    if (!isDirty) {
      toast.info('Aucune modification à enregistrer');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simule un appel API PUT /api/appointments/:id
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Appeler le callback de mise à jour
      onUpdate(formData);

      toast.success(`Rendez-vous de ${formData.patient} modifié avec succès`);
      
      // Fermer le modal après succès
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (err) {
      toast.error('Erreur lors de la modification du rendez-vous');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir fermer ?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'arrivé': return 'bg-green-500 text-white';
      case 'confirmé': return 'bg-blue-500 text-white';
      case 'en attente': return 'bg-yellow-500 text-white';
      case 'en cours': return 'bg-purple-500 text-white';
      case 'terminé': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Modifier le rendez-vous
            <Badge className={cn("ml-2", getStatusColor(formData.status))}>
              {formData.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations patient */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations Patient
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">
                  Nom du patient *
                </Label>
                <Input
                  id="patient"
                  value={formData.patient}
                  onChange={(e) => handleChange('patient', e.target.value.toUpperCase())}
                  placeholder="NOM Prénom"
                  className={errors.patient ? 'border-red-500' : ''}
                  aria-label="Nom du patient"
                />
                {errors.patient && (
                  <p className="text-xs text-red-500 mt-1">{errors.patient}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="077 XX XX XX"
                  className={errors.phone ? 'border-red-500' : ''}
                  aria-label="Numéro de téléphone"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="numeroCNAMGS">
                Numéro CNAMGS (optionnel)
              </Label>
              <Input
                id="numeroCNAMGS"
                value={formData.numeroCNAMGS || ''}
                onChange={(e) => handleChange('numeroCNAMGS', e.target.value)}
                placeholder="GA123456789"
                className={errors.numeroCNAMGS ? 'border-red-500' : ''}
                aria-label="Numéro CNAMGS"
              />
              {errors.numeroCNAMGS && (
                <p className="text-xs text-red-500 mt-1">{errors.numeroCNAMGS}</p>
              )}
            </div>
          </div>

          {/* Informations RDV */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Détails du rendez-vous
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service">
                  Service *
                </Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => handleChange('service', value)}
                >
                  <SelectTrigger 
                    id="service"
                    className={errors.service ? 'border-red-500' : ''}
                    aria-label="Sélectionner un service"
                  >
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service} value={service}>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-3 w-3" />
                          {service}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-xs text-red-500 mt-1">{errors.service}</p>
                )}
              </div>

              <div>
                <Label htmlFor="time">
                  Heure *
                </Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => handleChange('time', value)}
                >
                  <SelectTrigger 
                    id="time"
                    className={errors.time ? 'border-red-500' : ''}
                    aria-label="Sélectionner une heure"
                  >
                    <SelectValue placeholder="Sélectionner une heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {horairesDispo.map(horaire => (
                      <SelectItem key={horaire} value={horaire}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {horaire}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p className="text-xs text-red-500 mt-1">{errors.time}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="motif">
                Motif de consultation
              </Label>
              <Textarea
                id="motif"
                value={formData.motif || ''}
                onChange={(e) => handleChange('motif', e.target.value)}
                placeholder="Décrivez le motif de la consultation..."
                rows={3}
                aria-label="Motif de consultation"
              />
            </div>
          </div>

          {/* Alerte si modifications */}
          {isDirty && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Vous avez des modifications non sauvegardées
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              aria-label="Annuler les modifications"
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isDirty}
              className="bg-blue-600 hover:bg-blue-700"
              aria-label="Sauvegarder les modifications"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
