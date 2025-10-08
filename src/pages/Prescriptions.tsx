import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SendToPharmacyModal } from "@/components/prescriptions/SendToPharmacyModal";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import {
  FileText, 
  Download, 
  Share2,
  Eye,
  Send,
  Calendar, 
  Clock, 
  User, 
  Pill,
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  status: "active" | "expired" | "renewed";
  validUntil: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  notes?: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: "ORD-2024-001",
    date: "15/12/2024",
    doctor: "Dr. Ondo (Cardiologue)",
    specialty: "Cardiologie",
    status: "active",
    validUntil: "15/03/2025",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10 mg",
        frequency: "1 comprimé par jour",
        duration: "3 mois",
        instructions: "À prendre le matin à jeun"
      },
      {
        name: "Aspirine",
        dosage: "100 mg",
        frequency: "1 comprimé par jour",
        duration: "3 mois",
        instructions: "À prendre le soir après le repas"
      }
    ],
    notes: "Contrôle tension artérielle tous les mois. Prochain RDV: 15/01/2025"
  },
  {
    id: "ORD-2024-002",
    date: "03/11/2024",
    doctor: "Dr. Nzamba",
    specialty: "Médecine générale",
    status: "active",
    validUntil: "03/02/2025",
    medications: [
      {
        name: "Metformine",
        dosage: "500 mg",
        frequency: "2 fois par jour",
        duration: "3 mois",
        instructions: "Pendant ou après les repas"
      },
      {
        name: "Atorvastatine",
        dosage: "20 mg",
        frequency: "1 comprimé le soir",
        duration: "3 mois"
      }
    ],
    notes: "Surveillance glycémie. Bilan sanguin dans 1 mois."
  },
  {
    id: "ORD-2023-089",
    date: "15/09/2024",
    doctor: "Dr. Mbina",
    specialty: "Médecine générale",
    status: "expired",
    validUntil: "15/12/2024",
    medications: [
      {
        name: "Amoxicilline",
        dosage: "500 mg",
        frequency: "3 fois par jour",
        duration: "7 jours",
        instructions: "Pendant les repas"
      }
    ],
    notes: "Traitement infection respiratoire - Terminé"
  },
  {
    id: "ORD-2023-078",
    date: "10/08/2024",
    doctor: "Dr. Ondo (Cardiologue)",
    specialty: "Cardiologie",
    status: "renewed",
    validUntil: "10/11/2024",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10 mg",
        frequency: "1 comprimé par jour",
        duration: "3 mois"
      }
    ],
    notes: "Renouvelée le 15/12/2024"
  }
];

export default function Prescriptions() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [previewPrescription, setPreviewPrescription] = useState<Prescription | null>(null);
  const [sendToPharmacyOpen, setSendToPharmacyOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);

  const activePrescriptions = mockPrescriptions.filter(p => p.status === "active");
  const expiredPrescriptions = mockPrescriptions.filter(p => p.status === "expired");

  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medications.some(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTab = 
      selectedTab === "all" ||
      prescription.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  const handleDownload = (id: string) => {
    toast.success(`Téléchargement de l'ordonnance ${id}...`);
  };

  const handleShare = (id: string) => {
    toast.success(`Partage de l'ordonnance ${id}...`);
  };

  const handleSendToPharmacy = (id: string) => {
    setSelectedPrescriptionId(id);
    setSendToPharmacyOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expirée</Badge>;
      case "renewed":
        return <Badge className="bg-secondary text-secondary-foreground">Renouvelée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "renewed":
        return <AlertCircle className="h-5 w-5 text-secondary" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Mes <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Ordonnances</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Consultez et gérez vos prescriptions médicales
                </p>
              </div>

              {/* Statistiques */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-6 bg-card/50 border-border backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ordonnances actives</p>
                      <p className="text-2xl font-bold text-foreground">{activePrescriptions.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expirées</p>
                      <p className="text-2xl font-bold text-foreground">{expiredPrescriptions.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-foreground">{mockPrescriptions.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recherche */}
              <Card className="p-4 bg-card/50 border-border backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par médicament, médecin ou numéro..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-border"
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </Card>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    Toutes ({mockPrescriptions.length})
                  </TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-success/20 data-[state=active]:text-success">
                    Actives ({activePrescriptions.length})
                  </TabsTrigger>
                  <TabsTrigger value="expired" className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive">
                    Expirées ({expiredPrescriptions.length})
                  </TabsTrigger>
                  <TabsTrigger value="renewed" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                    Renouvelées
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="mt-6">
                  {filteredPrescriptions.length === 0 ? (
                    <Card className="p-12 text-center bg-card/50 border-border backdrop-blur-sm">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Aucune ordonnance trouvée</h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? "Essayez avec d'autres termes de recherche"
                          : "Vous n'avez pas encore d'ordonnances dans cette catégorie"}
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredPrescriptions.map((prescription) => (
                      <Card key={prescription.id} className="p-4 bg-card/50 border-border backdrop-blur-sm hover:bg-card/70 transition-all">
                        {/* En-tête */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                              {getStatusIcon(prescription.status)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-base text-foreground">{prescription.id}</h3>
                                {getStatusBadge(prescription.status)}
                              </div>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">{prescription.doctor}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {prescription.date}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {prescription.validUntil}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1 flex-shrink-0 ml-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setPreviewPrescription(prescription)}
                              className="text-accent hover:text-accent hover:bg-accent/10 h-8 w-8 p-0"
                              title="Visualiser"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleShare(prescription.id)}
                              className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0"
                              title="Partager"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownload(prescription.id)}
                              className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 p-0"
                              title="Télécharger"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Colonne gauche - Informations */}
                          <div className="flex-1 min-w-0">
                            {/* Médicaments */}
                            <div className="space-y-2 mb-3">
                              <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground">
                                <Pill className="h-3.5 w-3.5 text-accent" />
                                Médicaments ({prescription.medications.length})
                              </h4>
                              {prescription.medications.map((med, index) => (
                                <div 
                                  key={index} 
                                  className="border border-border rounded-lg p-3 bg-muted/50"
                                >
                                  <div className="flex items-start justify-between mb-1.5">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-sm text-foreground truncate">{med.name}</p>
                                      <p className="text-xs text-muted-foreground">{med.dosage}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">{med.duration}</Badge>
                                  </div>
                                  <div className="space-y-0.5 text-xs">
                                    <p className="text-foreground"><span className="font-medium">Posologie:</span> {med.frequency}</p>
                                    {med.instructions && (
                                      <p className="text-muted-foreground">
                                        <AlertCircle className="h-3 w-3 inline mr-1" />
                                        {med.instructions}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Actions pharmacie */}
                            <div className="mb-3">
                              <Button
                                onClick={() => handleSendToPharmacy(prescription.id)}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Envoyer à une pharmacie
                              </Button>
                            </div>

                            {/* Notes */}
                            {prescription.notes && (
                              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                                <p className="text-xs text-foreground">
                                  <span className="font-semibold">Note:</span>{" "}
                                  {prescription.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Colonne droite - Miniature A4 (desktop uniquement) */}
                          <div className="hidden lg:block w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden aspect-[1/1.414] relative">
                              <div className="absolute inset-0 p-4 overflow-hidden text-[6px] leading-tight">
                                {/* En-tête */}
                                <div className="text-center mb-2 pb-1 border-b border-gray-300">
                                  <h2 className="font-bold text-gray-800 text-[8px]">ORDONNANCE MÉDICALE</h2>
                                  <p className="text-gray-600 text-[5px]">République Gabonaise</p>
                                </div>

                                {/* Médecin */}
                                <div className="mb-2">
                                  <p className="font-bold text-gray-800 text-[6px]">{prescription.doctor}</p>
                                  <p className="text-gray-600 text-[5px]">{prescription.specialty}</p>
                                  <p className="text-gray-600 text-[5px]">N°: {prescription.id}</p>
                                </div>

                                {/* Dates */}
                                <div className="flex justify-between text-[5px] mb-2 pb-1 border-b border-gray-200">
                                  <span className="text-gray-600">Date: {prescription.date}</span>
                                  <span className="text-gray-600">Valable: {prescription.validUntil}</span>
                                </div>

                                {/* Médicaments */}
                                <div className="mb-2">
                                  <h3 className="font-bold text-gray-800 text-[6px] mb-1">MÉDICAMENTS</h3>
                                  {prescription.medications.map((med, index) => (
                                    <div key={index} className="mb-1.5 pl-2 border-l-2 border-accent">
                                      <p className="font-semibold text-gray-800 text-[5px]">{index + 1}. {med.name}</p>
                                      <p className="text-gray-600 text-[4px]">{med.dosage}</p>
                                      <p className="text-gray-600 text-[4px]">{med.frequency}</p>
                                      <p className="text-gray-600 text-[4px]">{med.duration}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* Notes */}
                                {prescription.notes && (
                                  <div className="bg-blue-50 p-1 rounded text-[4px] mb-2">
                                    <p className="text-gray-700">{prescription.notes}</p>
                                  </div>
                                )}

                                {/* Actions desktop */}
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setPreviewPrescription(prescription)}
                                    className="text-accent hover:text-accent hover:bg-accent/10 h-6 w-6 p-0"
                                    title="Agrandir"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleShare(prescription.id)}
                                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-6 w-6 p-0"
                                    title="Partager"
                                  >
                                    <Share2 className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDownload(prescription.id)}
                                    className="text-primary hover:text-primary hover:bg-primary/10 h-6 w-6 p-0"
                                    title="Télécharger"
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
      </div>

      {/* Modal de prévisualisation */}
      <Dialog open={!!previewPrescription} onOpenChange={() => setPreviewPrescription(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Aperçu de l'ordonnance</DialogTitle>
          </DialogHeader>
          
          {previewPrescription && (
            <div className="space-y-4">
              {/* En-tête ordonnance */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">ORDONNANCE MÉDICALE</h2>
                  <p className="text-sm text-gray-600">République Gabonaise - Ministère de la Santé</p>
                </div>

                {/* Informations médecin */}
                <div className="mb-6">
                  <p className="font-bold text-gray-800">{previewPrescription.doctor}</p>
                  <p className="text-sm text-gray-600">{previewPrescription.specialty}</p>
                  <p className="text-sm text-gray-600">N° d'ordre: {previewPrescription.id}</p>
                </div>

                {/* Date et validité */}
                <div className="flex justify-between text-sm mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-600">Date: <span className="font-medium text-gray-800">{previewPrescription.date}</span></p>
                  <p className="text-gray-600">Valable jusqu'au: <span className="font-medium text-gray-800">{previewPrescription.validUntil}</span></p>
                </div>

                {/* Médicaments */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">MÉDICAMENTS PRESCRITS</h3>
                  {previewPrescription.medications.map((med, index) => (
                    <div key={index} className="mb-4 pl-4 border-l-2 border-accent">
                      <p className="font-semibold text-gray-800">{index + 1}. {med.name}</p>
                      <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                      <p className="text-sm text-gray-600">Posologie: {med.frequency}</p>
                      <p className="text-sm text-gray-600">Durée: {med.duration}</p>
                      {med.instructions && (
                        <p className="text-sm text-gray-600 italic mt-1">→ {med.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {previewPrescription.notes && (
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500 mb-6">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Note du médecin:</span> {previewPrescription.notes}
                    </p>
                  </div>
                )}

                {/* Signature */}
                <div className="mt-8 pt-4 border-t border-gray-200 text-right">
                  <p className="text-sm text-gray-600 mb-4">Signature et cachet du médecin</p>
                  <div className="h-16"></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => handleShare(previewPrescription.id)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button 
                  onClick={() => handleDownload(previewPrescription.id)}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal envoi pharmacie */}
      {selectedPrescriptionId && (
        <SendToPharmacyModal
          open={sendToPharmacyOpen}
          onOpenChange={setSendToPharmacyOpen}
          prescriptionId={selectedPrescriptionId}
        />
      )}
    </PatientDashboardLayout>
  );
}
