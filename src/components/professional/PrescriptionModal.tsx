import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, QrCode } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface PrescriptionModalProps {
  open: boolean;
  onClose: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export function PrescriptionModal({ open, onClose }: PrescriptionModalProps) {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [medications, setMedications] = useState<Medication[]>([{
    id: "1",
    name: "",
    dosage: "",
    form: "comprimé",
    frequency: "",
    duration: "",
    instructions: ""
  }]);

  const addMedication = () => {
    setMedications([...medications, {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      form: "comprimé",
      frequency: "",
      duration: "",
      instructions: ""
    }]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la génération de prescription avec QR Code
    console.log("Nouvelle prescription:", { patient: selectedPatient, medications });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Nouvelle Prescription Électronique
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label>Patient *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Rechercher un patient (nom, N° CNAMGS)..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
              <Button type="button" variant="outline">
                Rechercher
              </Button>
            </div>
            {selectedPatient && (
              <Badge className="mt-2">
                {selectedPatient.name} - CNAMGS: {selectedPatient.cnamgs}
              </Badge>
            )}
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Médicaments prescrits</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un médicament
              </Button>
            </div>

            {medications.map((med, index) => (
              <div key={med.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Médicament #{index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(med.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom du médicament (DCI) *</Label>
                    <Input
                      value={med.name}
                      onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                      placeholder="Ex: Paracétamol"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dosage *</Label>
                    <Input
                      value={med.dosage}
                      onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                      placeholder="Ex: 500mg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Forme *</Label>
                    <Select 
                      value={med.form}
                      onValueChange={(value) => updateMedication(med.id, "form", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprimé">Comprimé</SelectItem>
                        <SelectItem value="gélule">Gélule</SelectItem>
                        <SelectItem value="sirop">Sirop</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="pommade">Pommade</SelectItem>
                        <SelectItem value="gouttes">Gouttes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fréquence *</Label>
                    <Input
                      value={med.frequency}
                      onChange={(e) => updateMedication(med.id, "frequency", e.target.value)}
                      placeholder="Ex: 3 fois/jour"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Durée *</Label>
                    <Input
                      value={med.duration}
                      onChange={(e) => updateMedication(med.id, "duration", e.target.value)}
                      placeholder="Ex: 7 jours"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instructions particulières</Label>
                  <Textarea
                    rows={2}
                    value={med.instructions}
                    onChange={(e) => updateMedication(med.id, "instructions", e.target.value)}
                    placeholder="Ex: À prendre pendant les repas"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              La prescription sera générée avec un QR Code pour validation en pharmacie
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Générer la prescription
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
