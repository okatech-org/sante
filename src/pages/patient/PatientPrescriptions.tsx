import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService, type Prescription } from "@/services/patientService";
import { generatePrescriptionPDF } from "@/utils/pdfGenerator";
import { 
  Pill, Calendar, User, Building2, Download, 
  Search, Loader2, ChevronRight, CheckCircle,
  AlertCircle, Clock, FileText
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendToPharmacyModal } from "@/components/prescriptions/SendToPharmacyModal";

export default function PatientPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  
  const patientName = (user?.user_metadata as any)?.full_name || 'Patient';

  useEffect(() => {
    const loadPrescriptions = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const data = await patientService.getPrescriptions(user.id);
        setPrescriptions(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des ordonnances');
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [user?.id]);

  // Filtrer les ordonnances
  const filteredPrescriptions = prescriptions.filter(pres => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pres.doctor_name.toLowerCase().includes(searchLower) ||
      pres.medications.some(med => med.name.toLowerCase().includes(searchLower)) ||
      pres.pharmacy?.toLowerCase().includes(searchLower)
    );
  });

  // Statistiques
  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(p => p.status === 'active').length,
    completed: prescriptions.filter(p => p.status === 'completed').length,
    cancelled: prescriptions.filter(p => p.status === 'cancelled').length
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Active';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Pill className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos ordonnances...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Pill className="w-6 h-6 text-primary" />
            Mes Ordonnances
          </h1>
          <p className="text-muted-foreground">Consultez et gérez vos prescriptions médicales</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Pill className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Actives</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Terminées</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Annulées</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des ordonnances */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Toutes les ordonnances</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Actives ({stats.active})</TabsTrigger>
                <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {prescriptions.filter(p => p.status === 'active').length === 0 ? (
                  <div className="text-center py-8">
                    <Pill className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucune ordonnance active</p>
                  </div>
                ) : (
                  prescriptions
                    .filter(p => p.status === 'active')
                    .filter(pres => {
                      const searchLower = searchTerm.toLowerCase();
                      return (
                        pres.doctor_name.toLowerCase().includes(searchLower) ||
                        pres.medications.some(med => med.name.toLowerCase().includes(searchLower))
                      );
                    })
                    .map(prescription => (
                      <PrescriptionCard
                        key={prescription.id}
                        prescription={prescription}
                        onSelect={setSelectedPrescription}
                      />
                    ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {filteredPrescriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucune ordonnance trouvée</p>
                  </div>
                ) : (
                  filteredPrescriptions.map(prescription => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      onSelect={setSelectedPrescription}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedPrescription && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPrescription(null)}
        >
          <div 
            className="bg-card rounded-lg border p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails de l'ordonnance</h3>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(selectedPrescription.status)}>
                  {getStatusIcon(selectedPrescription.status)}
                  <span className="ml-1">{getStatusLabel(selectedPrescription.status)}</span>
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date de prescription</p>
                <p className="font-medium">
                  {new Date(selectedPrescription.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Médecin prescripteur</p>
                <p className="font-medium">{selectedPrescription.doctor_name}</p>
              </div>

              {selectedPrescription.pharmacy && (
                <div>
                  <p className="text-sm text-muted-foreground">Pharmacie</p>
                  <p className="font-medium">{selectedPrescription.pharmacy}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-3">Médicaments prescrits</p>
                <div className="space-y-3">
                  {selectedPrescription.medications.map((med, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-muted/30">
                      <h4 className="font-semibold text-foreground mb-2">{med.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Dosage:</span>
                          <span className="ml-2 font-medium">{med.dosage}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fréquence:</span>
                          <span className="ml-2 font-medium">{med.frequency}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <span className="ml-2 font-medium">{med.duration}</span>
                        </div>
                      </div>
                      {med.instructions && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          {med.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedPrescription.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedPrescription(null)}>
                Fermer
              </Button>
              <Button onClick={() => setSendModalOpen(true)}>
                Envoyer à une pharmacie
              </Button>
              <Button onClick={() => generatePrescriptionPDF(selectedPrescription, patientName)}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </div>
        </div>
      )}
      {selectedPrescription && (
        <SendToPharmacyModal
          open={sendModalOpen}
          onOpenChange={setSendModalOpen}
          prescriptionId={selectedPrescription.id}
        />
      )}
    </PatientDashboardLayout>
  );
}

// Composant carte d'ordonnance
function PrescriptionCard({ 
  prescription, 
  onSelect 
}: { 
  prescription: Prescription; 
  onSelect: (pres: Prescription) => void;
}) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Active';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div
      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onSelect(prescription)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={getStatusColor(prescription.status)}>
              {getStatusLabel(prescription.status)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(prescription.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <h4 className="font-semibold text-foreground mb-1">
            {prescription.doctor_name}
          </h4>
          
          {prescription.pharmacy && (
            <p className="text-sm text-muted-foreground mb-2">
              <Building2 className="w-3 h-3 inline mr-1" />
              {prescription.pharmacy}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {prescription.medications.map((med, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {med.name} {med.dosage}
              </Badge>
            ))}
          </div>

          {prescription.notes && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              {prescription.notes}
            </p>
          )}
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
}
