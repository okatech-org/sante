import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface ElectronicPrescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionalId: string;
  patientId: string;
  teleconsultationId?: string;
}

export function ElectronicPrescriptionModal({
  open,
  onOpenChange,
  professionalId,
  patientId,
  teleconsultationId
}: ElectronicPrescriptionModalProps) {
  const [medications, setMedications] = useState<Medication[]>([{
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: ""
  }]);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMedication = () => {
    setMedications([...medications, {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = async () => {
    // Validation
    if (medications.some(m => !m.name || !m.dosage || !m.frequency)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    try {
      // Générer le numéro de prescription
      const { data: prescriptionNumber } = await supabase.rpc('generate_prescription_number');

      if (!prescriptionNumber) {
        throw new Error("Impossible de générer le numéro de prescription");
      }

      // Calculer la date d'expiration (30 jours par défaut)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Créer l'ordonnance
      const { error } = await supabase
        .from('electronic_prescriptions')
        .insert([{
          professional_id: professionalId,
          patient_id: patientId,
          teleconsultation_id: teleconsultationId,
          prescription_number: prescriptionNumber,
          medications: medications as any,
          diagnosis: diagnosis,
          additional_notes: additionalNotes,
          expiry_date: expiryDate.toISOString().split('T')[0],
          status: 'active'
        }]);

      if (error) throw error;

      toast.success("Ordonnance électronique créée", {
        description: `Numéro: ${prescriptionNumber}`
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error("Erreur lors de la création de l'ordonnance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMedications([{
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    }]);
    setDiagnosis("");
    setAdditionalNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Créer une ordonnance électronique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Diagnostic */}
          <div className="space-y-2">
            <Label>Diagnostic</Label>
            <Textarea
              placeholder="Indiquez le diagnostic..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Médicaments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Médicaments prescrits</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedication}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un médicament
              </Button>
            </div>

            {medications.map((med, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(index)}
                    className="absolute top-2 right-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom du médicament *</Label>
                    <Input
                      placeholder="Ex: Paracétamol"
                      value={med.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dosage *</Label>
                    <Input
                      placeholder="Ex: 500mg"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fréquence *</Label>
                    <Select
                      value={med.frequency}
                      onValueChange={(value) => updateMedication(index, 'frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x/jour">1 fois par jour</SelectItem>
                        <SelectItem value="2x/jour">2 fois par jour</SelectItem>
                        <SelectItem value="3x/jour">3 fois par jour</SelectItem>
                        <SelectItem value="4x/jour">4 fois par jour</SelectItem>
                        <SelectItem value="matin">Le matin</SelectItem>
                        <SelectItem value="soir">Le soir</SelectItem>
                        <SelectItem value="besoin">Si besoin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Durée</Label>
                    <Input
                      placeholder="Ex: 7 jours"
                      value={med.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Textarea
                    placeholder="Instructions spécifiques pour ce médicament..."
                    value={med.instructions}
                    onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notes additionnelles */}
          <div className="space-y-2">
            <Label>Notes additionnelles</Label>
            <Textarea
              placeholder="Recommandations, précautions, etc..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer l'ordonnance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}