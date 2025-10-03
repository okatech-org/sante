import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Share2, 
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

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

  const activePrescriptions = mockPrescriptions.filter(p => p.status === "active");
  const expiredPrescriptions = mockPrescriptions.filter(p => p.status === "expired");

  const handleDownload = (id: string) => {
    toast.success(`Téléchargement de l'ordonnance ${id}...`);
  };

  const handleShare = (id: string) => {
    toast.success(`Partage de l'ordonnance ${id}...`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expirée</Badge>;
      case "renewed":
        return <Badge variant="secondary">Renouvelée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "renewed":
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header avec statistiques */}
        <div>
          <h1 className="text-3xl font-bold">Mes Ordonnances</h1>
          <p className="text-muted-foreground mt-2">
            Consultez et gérez vos prescriptions médicales
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ordonnances actives</p>
                <p className="text-2xl font-bold">{activePrescriptions.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expirées</p>
                <p className="text-2xl font-bold">{expiredPrescriptions.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{mockPrescriptions.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par médicament, médecin ou numéro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes ({mockPrescriptions.length})</TabsTrigger>
            <TabsTrigger value="active">Actives ({activePrescriptions.length})</TabsTrigger>
            <TabsTrigger value="expired">Expirées ({expiredPrescriptions.length})</TabsTrigger>
            <TabsTrigger value="renewed">Renouvelées</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4 mt-6">
            {filteredPrescriptions.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune ordonnance trouvée</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Essayez avec d'autres termes de recherche"
                    : "Vous n'avez pas encore d'ordonnances dans cette catégorie"}
                </p>
              </Card>
            ) : (
              filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* En-tête de l'ordonnance */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(prescription.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{prescription.id}</h3>
                          {getStatusBadge(prescription.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {prescription.doctor}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {prescription.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Valide jusqu'au {prescription.validUntil}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShare(prescription.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(prescription.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Liste des médicaments */}
                  <div className="space-y-3 mb-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Médicaments prescrits ({prescription.medications.length})
                    </h4>
                    {prescription.medications.map((med, index) => (
                      <div 
                        key={index} 
                        className="border rounded-lg p-4 bg-accent/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{med.name}</p>
                            <p className="text-sm text-muted-foreground">{med.dosage}</p>
                          </div>
                          <Badge variant="outline">{med.duration}</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Posologie:</span> {med.frequency}</p>
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

                  {/* Notes du médecin */}
                  {prescription.notes && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm">
                        <span className="font-semibold">Note du médecin:</span>{" "}
                        {prescription.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
