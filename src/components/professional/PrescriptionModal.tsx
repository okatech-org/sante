import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, QrCode } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicationsSearch } from "@/hooks/useMedicationsSearch";

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
  const { user } = useAuth();
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([{
    id: "1",
    name: "",
    dosage: "",
    form: "comprimé",
    frequency: "",
    duration: "",
    instructions: ""
  }]);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSearch = async () => {
    if (!patientSearch.trim()) return;
    try {
      setIsSearching(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, cnamgs_number")
        .ilike("full_name", `%${patientSearch}%`)
        .limit(10);
      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la recherche patient");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient?.id) {
      toast.error("Sélectionnez un patient");
      return;
    }
    if (medications.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
      toast.error("Complétez les champs obligatoires des médicaments");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: professional, error: profError } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();
      if (profError) throw profError;
      if (!professional?.id) throw new Error("Profil professionnel introuvable");

      const { data: prescNumber, error: numError } = await supabase.rpc("generate_prescription_number");
      if (numError) throw numError;
      if (!prescNumber) throw new Error("Numéro de prescription indisponible");

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const { error: insertError } = await supabase
        .from("electronic_prescriptions")
        .insert([
          {
            professional_id: professional.id,
            patient_id: selectedPatient.id,
            prescription_number: prescNumber,
            medications: medications.map(({ name, dosage, frequency, duration, instructions }) => ({ name, dosage, frequency, duration, instructions })),
            diagnosis,
            additional_notes: additionalNotes,
            expiry_date: expiryDate.toISOString().split("T")[0],
            status: "active",
          },
        ]);
      if (insertError) throw insertError;

      toast.success("Ordonnance créée", { description: `Numéro: ${prescNumber}` });
    onClose();
      // reset
      setSelectedPatient(null);
      setPatientSearch("");
      setSearchResults([]);
      setMedications([{ id: "1", name: "", dosage: "", form: "comprimé", frequency: "", duration: "", instructions: "" }]);
      setDiagnosis("");
      setAdditionalNotes("");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de l'ordonnance");
    } finally {
      setIsSubmitting(false);
    }
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
              <Button type="button" variant="outline" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Recherche..." : "Rechercher"}
              </Button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-md divide-y">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full text-left p-2 hover:bg-muted/50"
                    onClick={() => { setSelectedPatient(p); setSearchResults([]); }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{p.full_name}</span>
                      {p.cnamgs_number && <Badge variant="outline">CNAMGS: {p.cnamgs_number}</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {selectedPatient && (
              <Badge className="mt-2">
                {selectedPatient.full_name}
                {selectedPatient.cnamgs_number ? ` - CNAMGS: ${selectedPatient.cnamgs_number}` : ""}
              </Badge>
            )}
          </div>
          {/* Infos médicales */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Diagnostic</Label>
              <Textarea rows={2} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Notes additionnelles</Label>
              <Textarea rows={2} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
            </div>
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
                    <div className="relative">
                      <Input
                        value={med.name}
                        onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                        placeholder="Ex: Paracétamol"
                        required
                      />
                      {/* Suggestions */}
                      <MedicationSuggestions 
                        query={med.name}
                        onPick={(sugg) => {
                          updateMedication(med.id, "name", sugg.dci || sugg.nom_commercial || "");
                          if (sugg.dosage) updateMedication(med.id, "dosage", sugg.dosage);
                          if (sugg.forme_pharmaceutique) updateMedication(med.id, "form", sugg.forme_pharmaceutique);
                        }}
                      />
                    </div>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Génération..." : "Générer la prescription"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MedicationSuggestions({ query, onPick }: { query: string; onPick: (s: any) => void }) {
  const { data, isLoading } = useMedicationsSearch(query || "", 8);
  const suggestions = Array.isArray(data) ? data : [];
  if (!query || query.trim().length < 2 || isLoading || suggestions.length === 0) return null;
  return (
    <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover shadow-sm max-h-56 overflow-auto">
      {suggestions.map((s: any) => (
        <button
          key={s.id}
          type="button"
          className="w-full px-3 py-2 text-left hover:bg-muted/60 text-sm"
          onClick={() => onPick(s)}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">{s.dci || s.nom_commercial}</span>
            {s.dosage && <span className="text-muted-foreground">{s.dosage}</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            {s.nom_commercial}
            {s.forme_pharmaceutique ? ` • ${s.forme_pharmaceutique}` : ""}
          </div>
        </button>
      ))}
    </div>
  );
}
