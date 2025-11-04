import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Pill, Search, Filter, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrescriptionModal } from "@/components/professional/PrescriptionModal";
import { PrescriptionsStats } from "@/components/professional/PrescriptionsStats";
import { PrescriptionListItem } from "@/components/professional/PrescriptionListItem";
import { usePrescriptions } from "@/hooks/usePrescriptions";

export default function ProfessionalPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const { prescriptions, stats, loading, error } = usePrescriptions();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith("/new")) {
      setShowPrescriptionModal(true);
    }
  }, [location.pathname]);


  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  const filteredPrescriptions = searchQuery
    ? prescriptions.filter(
        (p) =>
          p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : prescriptions;

  return (
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
          <PrescriptionsStats 
            total={stats.total} 
            active={stats.active} 
            delivered={stats.delivered} 
            cnamgsRate={stats.cnamgsRate} 
          />
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
              {filteredPrescriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune prescription trouvée</p>
                </div>
              ) : (
                filteredPrescriptions.map((prescription) => (
                <PrescriptionListItem
                  key={prescription.id}
                  prescription={prescription as any}
                />
                ))
              )}
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
