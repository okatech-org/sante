import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionalId: string;
  onSuccess?: () => void;
}

interface ConsultationFormData {
  patientId: string;
  patientSearch: string;
  type: string;
  date: Date;
  time: string;
  reason: string;
  notes: string;
}

export function CreateConsultationModal({
  open,
  onOpenChange,
  professionalId,
  onSuccess
}: CreateConsultationModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchingPatients, setSearchingPatients] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<ConsultationFormData>({
    patientId: '',
    patientSearch: '',
    type: '',
    date: new Date(),
    time: '',
    reason: '',
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Recherche de patients
  const searchPatients = async (query: string) => {
    if (!query || query.length < 2) {
      setPatients([]);
      return;
    }

    setSearchingPatients(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.error('Error searching patients:', err);
      toast.error("Erreur lors de la recherche");
    } finally {
      setSearchingPatients(false);
    }
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.patientId) {
      errors.patient = "Veuillez sélectionner un patient";
    }

    if (!formData.type) {
      errors.type = "Veuillez sélectionner un type de consultation";
    }

    if (!formData.date) {
      errors.date = "Veuillez sélectionner une date";
    }

    if (!formData.time) {
      errors.time = "Veuillez sélectionner une heure";
    }

    if (!formData.reason?.trim()) {
      errors.reason = "Veuillez indiquer le motif de consultation";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    // Reset error
    setError(null);

    // Validation
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      // Créer la date et l'heure combinées
      const [hours, minutes] = formData.time.split(':');
      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Créer le rendez-vous/consultation
      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert({
          professional_id: professionalId,
          patient_id: formData.patientId,
          appointment_date: appointmentDate.toISOString(),
          type: formData.type,
          reason: formData.reason,
          notes: formData.notes,
          status: 'completed', // Directement marquée comme complétée
          duration_minutes: 30
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Success feedback
      toast.success("Consultation créée avec succès", {
        description: `Patient enregistré pour le ${format(formData.date, 'dd MMMM yyyy', { locale: fr })}`
      });

      // Reset form
      resetForm();
      
      // Callback de succès
      onSuccess?.();
      
      // Fermer le modal
      onOpenChange(false);

    } catch (err) {
      console.error('Error creating consultation:', err);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création";
      setError(errorMessage);
      toast.error("Échec de la création de la consultation");
    } finally {
      setLoading(false);
    }
  };

  // Reset du formulaire
  const resetForm = () => {
    setFormData({
      patientId: '',
      patientSearch: '',
      type: '',
      date: new Date(),
      time: '',
      reason: '',
      notes: ''
    });
    setValidationErrors({});
    setError(null);
    setPatients([]);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Consultation</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Recherche patient */}
          <div className="space-y-2">
            <Label>Patient *</Label>
            <Input
              placeholder="Rechercher un patient (nom, email, téléphone)..."
              value={formData.patientSearch}
              onChange={(e) => {
                setFormData({ ...formData, patientSearch: e.target.value });
                searchPatients(e.target.value);
              }}
              disabled={loading}
            />
            {validationErrors.patient && (
              <p className="text-sm text-destructive">{validationErrors.patient}</p>
            )}
            
            {/* Liste des patients trouvés */}
            {patients.length > 0 && (
              <div className="border rounded-lg divide-y">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        patientId: patient.id,
                        patientSearch: patient.full_name
                      });
                      setPatients([]);
                      setValidationErrors({ ...validationErrors, patient: '' });
                    }}
                    className="w-full p-3 text-left hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{patient.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {patient.email} • {patient.phone}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {searchingPatients && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche...
              </div>
            )}
          </div>

          {/* Type de consultation */}
          <div className="space-y-2">
            <Label>Type de consultation *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData({ ...formData, type: value });
                setValidationErrors({ ...validationErrors, type: '' });
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teleconsultation">Téléconsultation</SelectItem>
                <SelectItem value="consultation">Consultation de suivi</SelectItem>
                <SelectItem value="urgence">Urgence</SelectItem>
                <SelectItem value="controle">Consultation de contrôle</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.type && (
              <p className="text-sm text-destructive">{validationErrors.type}</p>
            )}
          </div>

          {/* Date et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "dd MMMM yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData({ ...formData, date });
                        setValidationErrors({ ...validationErrors, date: '' });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.date && (
                <p className="text-sm text-destructive">{validationErrors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Heure *</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => {
                  setFormData({ ...formData, time: e.target.value });
                  setValidationErrors({ ...validationErrors, time: '' });
                }}
                disabled={loading}
              />
              {validationErrors.time && (
                <p className="text-sm text-destructive">{validationErrors.time}</p>
              )}
            </div>
          </div>

          {/* Motif */}
          <div className="space-y-2">
            <Label>Motif de consultation *</Label>
            <Textarea
              placeholder="Décrivez le motif de la consultation..."
              value={formData.reason}
              onChange={(e) => {
                setFormData({ ...formData, reason: e.target.value });
                setValidationErrors({ ...validationErrors, reason: '' });
              }}
              className="min-h-[80px]"
              disabled={loading}
            />
            {validationErrors.reason && (
              <p className="text-sm text-destructive">{validationErrors.reason}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optionnel)</Label>
            <Textarea
              placeholder="Notes complémentaires..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="min-h-[80px]"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "Créer la consultation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
