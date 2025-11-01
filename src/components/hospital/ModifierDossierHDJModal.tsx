import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Edit, Loader2, AlertCircle, X, Save, FileText,
  Stethoscope, Calendar, User
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DossierHDJ {
  id: string;
  patient: string;
  service: string;
  medecin: string;
  heure: string;
  status: 'en_attente' | 'en_cours' | 'termine' | 'annule';
  cnamgs: 'verifie' | 'non_verifie' | 'rejete';
  reste: number;
  dateCreation: string;
  motif: string;
  diagnostics?: string[];
  prescriptions?: string[];
}

interface ModifierDossierHDJModalProps {
  open: boolean;
  onClose: () => void;
  dossier: DossierHDJ;
  onUpdate: (updatedDossier: DossierHDJ) => void;
}

export function ModifierDossierHDJModal({
  open,
  onClose,
  dossier,
  onUpdate
}: ModifierDossierHDJModalProps) {
  const [formData, setFormData] = useState(dossier);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Charger les données
  useEffect(() => {
    if (open) {
      setFormData(dossier);
      setIsDirty(false);
      setErrors({});
    }
  }, [open, dossier]);

  // Détecter changements
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(dossier);
    setIsDirty(hasChanged);
  }, [formData, dossier]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.patient.trim()) {
      newErrors.patient = 'Le nom du patient est obligatoire';
    }

    if (!formData.motif.trim()) {
      newErrors.motif = 'Le motif est obligatoire';
    } else if (formData.motif.trim().length < 10) {
      newErrors.motif = 'Le motif doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestionnaires
  const handleChange = (field: keyof DossierHDJ, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddDiagnostic = (diagnostic: string) => {
    if (diagnostic.trim()) {
      const currentDiags = formData.diagnostics || [];
      handleChange('diagnostics', [...currentDiags, diagnostic.trim()]);
    }
  };

  const handleRemoveDiagnostic = (index: number) => {
    const currentDiags = formData.diagnostics || [];
    handleChange('diagnostics', currentDiags.filter((_, i) => i !== index));
  };

  const handleAddPrescription = (prescription: string) => {
    if (prescription.trim()) {
      const currentPrescs = formData.prescriptions || [];
      handleChange('prescriptions', [...currentPrescs, prescription.trim()]);
    }
  };

  const handleRemovePrescription = (index: number) => {
    const currentPrescs = formData.prescriptions || [];
    handleChange('prescriptions', currentPrescs.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    if (!isDirty) {
      toast.info('Aucune modification à enregistrer');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation API PUT /api/dossiers-hdj/:id
      await new Promise(resolve => setTimeout(resolve, 2000));

      onUpdate(formData);
      toast.success(`Dossier ${dossier.id} modifié avec succès`);
      
      setTimeout(() => onClose(), 500);

    } catch (err) {
      toast.error('Erreur lors de la modification du dossier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && !confirm('Modifications non sauvées. Continuer ?')) return;
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Modifier le dossier {dossier.id}
          </DialogTitle>
          <DialogDescription>
            Éditez les informations médicales et administratives du dossier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations Générales
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Nom du patient *</Label>
                <Input
                  id="patient"
                  value={formData.patient}
                  onChange={(e) => handleChange('patient', e.target.value.toUpperCase())}
                  className={errors.patient ? 'border-red-500' : ''}
                />
                {errors.patient && (
                  <p className="text-xs text-red-500 mt-1">{errors.patient}</p>
                )}
              </div>

              <div>
                <Label htmlFor="service">Service</Label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  disabled
                  className="bg-gray-100 dark:bg-gray-900"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Le service ne peut pas être modifié
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="motif">Motif de consultation *</Label>
              <Textarea
                id="motif"
                value={formData.motif}
                onChange={(e) => handleChange('motif', e.target.value)}
                rows={3}
                className={errors.motif ? 'border-red-500' : ''}
                placeholder="Décrivez le motif de la consultation..."
              />
              {errors.motif && (
                <p className="text-xs text-red-500 mt-1">{errors.motif}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formData.motif.length}/500 caractères
              </p>
            </div>
          </div>

          {/* Notes additionnelles */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes et Observations
            </h3>
            <Textarea
              placeholder="Notes complémentaires, observations, remarques..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Alerte modifications */}
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
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isDirty}
              className="bg-blue-600 hover:bg-blue-700"
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
