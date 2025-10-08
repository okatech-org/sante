import { useState, useEffect } from "react";
import { Pill, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrescriptionModal } from "@/components/professional/PrescriptionModal";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { PrescriptionsStats } from "@/components/professional/PrescriptionsStats";
import { PrescriptionListItem } from "@/components/professional/PrescriptionListItem";

export default function ProfessionalPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  useEffect(() => {
    document.title = "Prescriptions | Espace Professionnel - SANTE.GA";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Gestion des prescriptions électroniques, ordonnances avec QR Code et intégration CNAMGS.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.origin + '/professional/prescriptions');
  }, []);

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

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
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

        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <PrescriptionsStats total={134} active={89} delivered={45} cnamgsRate="78%" />
        </div>

        <Card className="rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
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
                <PrescriptionListItem
                  key={prescription.id}
                  prescription={prescription as any}
                />
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
    </PatientDashboardLayout>
  );
}
