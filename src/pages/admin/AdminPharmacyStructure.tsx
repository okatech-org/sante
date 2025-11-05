import { useEffect, useMemo, useState } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Establishment } from "@/types/establishment";
import { EstablishmentCard } from "@/components/admin/EstablishmentCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MedicamentsList } from "@/components/admin/depot/MedicamentsList";

type PharmacyRow = {
  id: string;
  code_pharmacie: string;
  nom_commercial: string;
  ville: string;
  province: string;
  quartier: string | null;
  adresse_complete: string | null;
  telephone_principal: string | null;
  email: string | null;
  ouvert_24_7: boolean;
  conventionnement_cnamgs: boolean;
  statut_verification: string;
};

export default function AdminPharmacyStructure() {
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<PharmacyRow[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pharmacies");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("pharmacies")
          .select("id, code_pharmacie, nom_commercial, ville, province, quartier, adresse_complete, telephone_principal, email, ouvert_24_7, conventionnement_cnamgs, statut_verification")
          .order("nom_commercial", { ascending: true });
        if (error) throw error;
        setPharmacies((data as any[]) || []);
      } catch (e: any) {
        toast.error("Erreur chargement pharmacies", { description: e.message });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filteredPharmacies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pharmacies;
    return pharmacies.filter(p =>
      p.nom_commercial.toLowerCase().includes(q) ||
      (p.ville || '').toLowerCase().includes(q) ||
      (p.province || '').toLowerCase().includes(q) ||
      (p.code_pharmacie || '').toLowerCase().includes(q)
    );
  }, [pharmacies, search]);

  const paginatedPharmacies = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPharmacies.slice(startIndex, endIndex);
  }, [filteredPharmacies, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPharmacies.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(0);
  }, [search, itemsPerPage]);

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Pill className="h-8 w-8 text-primary" />
              Structure Pharmaceutique
            </h1>
            <p className="text-muted-foreground mt-1">
              Pharmacies du réseau et dépôt pharmaceutique (produits référencés)
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList>
              <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
              <TabsTrigger value="depot">Dépôt Pharmaceutique</TabsTrigger>
            </TabsList>
          </div>

          {/* Onglet Pharmacies */}
          <TabsContent value="pharmacies" className="mt-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une pharmacie (nom, ville, province, code)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Afficher :</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPharmacies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Aucune pharmacie trouvée
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedPharmacies.map((p) => {
                  const est: Establishment = {
                    id: p.id,
                    code: p.code_pharmacie,
                    name: p.nom_commercial,
                    category: 'pharmacie' as any,
                    level: 'local' as any,
                    status: p.statut_verification === 'verifie' ? 'operationnel' as any : 'maintenance' as any,
                    managingAuthority: 'Privé',
                    location: {
                      address: p.adresse_complete || '',
                      city: p.ville,
                      province: p.province,
                      coordinates: undefined,
                    },
                    contact: {
                      phoneMain: p.telephone_principal || '',
                      email: p.email || undefined,
                      website: undefined,
                    },
                    metrics: {
                      totalBeds: 0,
                      occupiedBeds: 0,
                      occupancyRate: 0,
                      consultationsMonthly: 0,
                      surgeriesMonthly: 0,
                      emergenciesMonthly: 0,
                      patientSatisfaction: 4.6,
                      averageWaitTime: '—',
                      averageStayDuration: '—',
                    },
                    staff: {
                      doctors: 0,
                      specialists: 0,
                      nurses: 0,
                      technicians: 0,
                      administrative: 0,
                      support: 0,
                      total: 0,
                    },
                    services: p.ouvert_24_7 || p.conventionnement_cnamgs ? [{ id: 'ph', name: 'Pharmacie', category: 'pharmacie', available: true, staffCount: 0 }] as any : [],
                    equipment: [],
                    certifications: [],
                    insuranceAccepted: [],
                    createdAt: '',
                    updatedAt: '',
                    isPublic: true,
                    isEmergencyCenter: false,
                    isReferralCenter: false,
                    isTeachingHospital: false,
                    hasAmbulance: false,
                    hasPharmacy: true,
                    hasLaboratory: false,
                    hasMortuary: false,
                  };
                  return (
                    <EstablishmentCard
                      key={p.id}
                      establishment={est}
                      segmentKey={'supportServices' as any}
                      onUpdate={(updated) => {
                        // Après gestion via modal, on rafraîchit les pharmacies
                        setPharmacies(prev => prev.map(ph => ph.id === updated.id ? ph : ph));
                      }}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 px-2">
                <p className="text-sm text-muted-foreground">
                  Affichage de {currentPage * itemsPerPage + 1} à {Math.min((currentPage + 1) * itemsPerPage, filteredPharmacies.length)} sur {filteredPharmacies.length} pharmacies
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    Page {currentPage + 1} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
            )}
          </TabsContent>

          {/* Onglet Dépôt Pharmaceutique */}
          <TabsContent value="depot" className="mt-6 space-y-4">
            <MedicamentsList />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayoutSimple>
  );
}


