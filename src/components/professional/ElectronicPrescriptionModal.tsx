import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, FileSignature, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DigitalSignaturePad } from "./DigitalSignaturePad";
import { PharmacySelector } from "./PharmacySelector";
import { QRCodeSVG } from "qrcode.react";

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
  teleconsultationId,
}: ElectronicPrescriptionModalProps) {
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "1x/jour", duration: "", instructions: "" }
  ]);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("prescription");
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState<string>("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>("");
  const [prescriptionId, setPrescriptionId] = useState<string>("");
  const [qrCodeData, setQrCodeData] = useState<string>("");

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "1x/jour", duration: "", instructions: "" }]);
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
    if (!diagnosis.trim()) {
      toast.error("Veuillez saisir un diagnostic");
      return;
    }

    if (medications.some(med => !med.name.trim() || !med.dosage.trim())) {
      toast.error("Veuillez remplir tous les médicaments");
      return;
    }

    if (!digitalSignature) {
      toast.error("Veuillez signer l'ordonnance");
      setCurrentTab("signature");
      return;
    }

    setIsSubmitting(true);

    try {
      // Générer le numéro d'ordonnance
      const { data: prescriptionNumber, error: rpcError } = await supabase.rpc('generate_prescription_number');
      
      if (rpcError) throw rpcError;

      // Calculer la date d'expiration (90 jours)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);

      // Créer l'ordonnance
      const { data: prescription, error: prescriptionError } = await supabase
        .from('electronic_prescriptions')
        .insert({
          prescription_number: prescriptionNumber as any,
          professional_id: professionalId,
          patient_id: patientId,
          teleconsultation_id: teleconsultationId,
          diagnosis,
          medications: medications as any,
          additional_notes: additionalNotes,
          status: 'active',
          expiry_date: expiryDate.toISOString().split('T')[0],
          digital_signature: digitalSignature,
          signature_timestamp: new Date().toISOString(),
          pharmacy_id: selectedPharmacy || null,
        } as any)
        .select()
        .single();

      if (prescriptionError) throw prescriptionError;

      // Générer les données du QR code
      const { data: qrData } = await supabase.rpc('generate_prescription_qr_data', {
        prescription_id: prescription.id
      });

      // Mettre à jour avec le QR code
      await supabase
        .from('electronic_prescriptions')
        .update({ qr_code_data: qrData })
        .eq('id', prescription.id);

      setPrescriptionId(prescription.id);
      setQrCodeData(qrData);

      // Si une pharmacie est sélectionnée, envoyer l'ordonnance
      if (selectedPharmacy) {
        await sendToPharmacy(prescription.id, selectedPharmacy);
      }

      toast.success("Ordonnance créée avec succès", {
        description: `N° ${prescriptionNumber}`
      });

      setCurrentTab("qrcode");
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error("Erreur lors de la création de l'ordonnance");
      setIsSubmitting(false);
    }
  };

  const sendToPharmacy = async (prescriptionId: string, pharmacyId: string) => {
    try {
      await supabase.functions.invoke('send-prescription-to-pharmacy', {
        body: {
          prescriptionId,
          pharmacyId
        }
      });

      await supabase
        .from('electronic_prescriptions')
        .update({
          sent_to_pharmacy: true,
          delivery_status: 'sent'
        })
        .eq('id', prescriptionId);

      toast.success("Ordonnance envoyée à la pharmacie");
    } catch (error) {
      console.error('Error sending to pharmacy:', error);
      toast.error("Erreur lors de l'envoi à la pharmacie");
    }
  };

  const handleSign = (signatureData: string) => {
    setDigitalSignature(signatureData);
    setShowSignaturePad(false);
    toast.success("Signature enregistrée");
  };

  const resetForm = () => {
    setMedications([{ name: "", dosage: "", frequency: "1x/jour", duration: "", instructions: "" }]);
    setDiagnosis("");
    setAdditionalNotes("");
    setDigitalSignature("");
    setSelectedPharmacy("");
    setShowSignaturePad(false);
    setCurrentTab("prescription");
    setPrescriptionId("");
    setQrCodeData("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une Ordonnance Électronique</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prescription">Ordonnance</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacie</TabsTrigger>
            <TabsTrigger value="signature" disabled={!diagnosis || medications.some(m => !m.name)}>
              <FileSignature className="h-4 w-4 mr-2" />
              Signature
            </TabsTrigger>
            <TabsTrigger value="qrcode" disabled={!prescriptionId}>
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescription" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Diagnostic *</Label>
              <Textarea
                placeholder="Indiquez le diagnostic..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

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
                  Ajouter
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
                      placeholder="Instructions spécifiques..."
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Notes additionnelles</Label>
              <Textarea
                placeholder="Recommandations, précautions, etc..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="pharmacy" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <Label>Sélectionner une pharmacie (optionnel)</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                L'ordonnance sera envoyée automatiquement à la pharmacie sélectionnée
              </p>
            </div>
            <PharmacySelector 
              onSelect={setSelectedPharmacy}
              selectedPharmacyId={selectedPharmacy}
            />
          </TabsContent>

          <TabsContent value="signature" className="mt-4">
            {showSignaturePad ? (
              <DigitalSignaturePad
                onSign={handleSign}
                onCancel={() => setShowSignaturePad(false)}
              />
            ) : digitalSignature ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Signature enregistrée</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setDigitalSignature("");
                      setShowSignaturePad(true);
                    }}
                  >
                    Modifier
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-background">
                  <img src={digitalSignature} alt="Signature" className="max-h-40 mx-auto" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <FileSignature className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Aucune signature enregistrée</p>
                <Button onClick={() => setShowSignaturePad(true)}>
                  Signer l'ordonnance
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="qrcode" className="mt-4">
            {qrCodeData && (
              <div className="space-y-4 text-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Ordonnance créée avec succès !</h3>
                  <p className="text-sm text-muted-foreground">
                    Le patient peut scanner ce QR code à la pharmacie
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-lg inline-block">
                  <QRCodeSVG
                    value={qrCodeData}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleClose}>
                    Fermer
                  </Button>
                  <Button onClick={() => window.print()}>
                    Imprimer
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {currentTab !== "qrcode" && (
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            {currentTab === "prescription" && (
              <Button onClick={() => setCurrentTab("pharmacy")}>
                Suivant
              </Button>
            )}
            {currentTab === "pharmacy" && (
              <Button onClick={() => setCurrentTab("signature")}>
                Suivant
              </Button>
            )}
            {currentTab === "signature" && (
              <Button onClick={handleSubmit} disabled={isSubmitting || !digitalSignature}>
                {isSubmitting ? "Création..." : "Créer l'ordonnance"}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
