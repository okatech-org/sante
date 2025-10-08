import { useState } from "react";
import { Pill, Search, Filter, QrCode, Download, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrescriptionModal } from "@/components/professional/PrescriptionModal";

export default function ProfessionalPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const prescriptions = [
    {
      id: "PRES-2025-0001",
      date: "2025-02-01",
      patient: "Marie MOUSSAVOU",
      medications: [
        { name: "Metformine 500mg", dosage: "1cp x2/j", duration: "30j" },
        { name: "Insuline Lantus", dosage: "20UI le soir", duration: "30j" }
      ],
      status: "active",
      cnamgs: "GAB123456789",
      pharmacy: "Pharmacie de la Grâce"
    },
    {
      id: "PRES-2025-0002",
      date: "2025-02-01",
      patient: "Jean NZENGUE",
      medications: [
        { name: "Amlodipine 5mg", dosage: "1cp/j", duration: "90j" },
        { name: "Atorvastatine 20mg", dosage: "1cp le soir", duration: "90j" }
      ],
      status: "active",
      cnamgs: "GAB987654321",
      pharmacy: null
    },
    {
      id: "PRES-2025-0003",
      date: "2025-01-30",
      patient: "Claire OBAME",
      medications: [
        { name: "Oméprazole 20mg", dosage: "1cp/j à jeun", duration: "28j" }
      ],
      status: "delivered",
      cnamgs: null,
      pharmacy: "Pharmacie du Soleil"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "bg-green-500/10 text-green-500";
      case "delivered": return "bg-blue-500/10 text-blue-500";
      case "expired": return "bg-gray-500/10 text-gray-500";
      default: return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "active": return "Active";
      case "delivered": return "Délivrée";
      case "expired": return "Expirée";
      default: return status;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions Électroniques</h1>
          <p className="text-muted-foreground">Gestion des ordonnances avec QR Code</p>
        </div>
        <Button onClick={() => setShowPrescriptionModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Ordonnance
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ce mois</p>
                <p className="text-2xl font-bold">134</p>
              </div>
              <Pill className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actives</p>
                <p className="text-2xl font-bold text-green-500">89</p>
              </div>
              <Pill className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Délivrées</p>
                <p className="text-2xl font-bold text-blue-500">45</p>
              </div>
              <QrCode className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux CNAMGS</p>
                <p className="text-2xl font-bold text-orange-500">78%</p>
              </div>
              <Download className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par patient, médicament, n° ordonnance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="active">Actives</TabsTrigger>
              <TabsTrigger value="delivered">Délivrées</TabsTrigger>
              <TabsTrigger value="expired">Expirées</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center min-w-[100px]">
                          <QrCode className="h-8 w-8 text-primary mb-2" />
                          <span className="text-xs font-mono">{prescription.id}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(prescription.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{prescription.patient}</h4>
                            <Badge className={getStatusColor(prescription.status)}>
                              {getStatusLabel(prescription.status)}
                            </Badge>
                            {prescription.cnamgs && (
                              <Badge variant="outline">CNAMGS</Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 mb-2">
                            {prescription.medications.map((med, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  {med.dosage} • {med.duration}
                                </span>
                              </div>
                            ))}
                          </div>

                          {prescription.pharmacy && (
                            <p className="text-xs text-muted-foreground">
                              Pharmacie: {prescription.pharmacy}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <QrCode className="h-4 w-4 mr-2" />
                          QR Code
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        {!prescription.pharmacy && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PrescriptionModal 
        open={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
      />
    </div>
  );
}
