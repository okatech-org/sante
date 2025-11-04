import { useEffect, useMemo, useState } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, MapPin, Phone, Search, Shield, Clock, Building2, Package, RefreshCw, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMedicationsSearch } from "@/hooks/useMedicationsSearch";
import { toast } from "sonner";
import { Establishment } from "@/types/establishment";
import { EstablishmentCard } from "@/components/admin/EstablishmentCard";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MedicationDetailModal } from "@/components/admin/pharmacy/MedicationDetailModal";

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

  // Dépôt pharmaceutique (produits)
  const [query, setQuery] = useState("");
  const [searchLimit, setSearchLimit] = useState<number>(20);
  const { data: meds } = useMedicationsSearch(query, searchLimit);
  const medResults = Array.isArray(meds) ? meds : [];
  const [initialMeds, setInitialMeds] = useState<any[]>([]);
  const [loadingMeds, setLoadingMeds] = useState<boolean>(false);
  const [initialOffset, setInitialOffset] = useState<number>(0);
  const initialPageSize = 30;
  const [selectedForme, setSelectedForme] = useState<string>("");
  const [ordonnanceOnly, setOrdonnanceOnly] = useState<boolean>(false);
  const [genericOnly, setGenericOnly] = useState<boolean>(false);
  const [classeQuery, setClasseQuery] = useState<string>("");
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [searchExtraById, setSearchExtraById] = useState<Record<string, { est_generique: boolean | null; classe_therapeutique: string | null }>>({});

  // Chargement initial d'un échantillon de produits (sans recherche)
  useEffect(() => {
    const loadInitial = async () => {
      setLoadingMeds(true);
      try {
        const { data, error } = await supabase
          .from('medicaments')
          .select('id, nom_commercial, dci, forme_pharmaceutique, dosage, tarif_conventionne_cnamgs, prix_moyen_pharmacie, necessite_ordonnance, est_generique, classe_therapeutique, image_url')
          .order('nom_commercial', { ascending: true })
          .range(initialOffset, initialOffset + initialPageSize - 1);
        if (error) throw error;
        setInitialMeds(prev => initialOffset === 0 ? (Array.isArray(data) ? data : []) : [...prev, ...((Array.isArray(data) ? data : []))]);
      } catch (e: any) {
        toast.error('Erreur chargement dépôt pharmaceutique', { description: e.message });
      } finally {
        setLoadingMeds(false);
      }
    };
    loadInitial();
  }, [initialOffset]);

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

  // Enrichir les résultats de recherche si des filtres nécessitent des champs supplémentaires
  useEffect(() => {
    const needExtras = genericOnly || (classeQuery.trim().length > 0);
    if (!needExtras || medResults.length === 0) return;
    const missingIds = medResults
      .map((m: any) => m.id)
      .filter((id: string) => !searchExtraById[id]);
    if (missingIds.length === 0) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('medicaments')
          .select('id, est_generique, classe_therapeutique')
          .in('id', missingIds);
        if (error) throw error;
        const map: Record<string, { est_generique: boolean | null; classe_therapeutique: string | null }> = {};
        (data || []).forEach((row: any) => {
          map[row.id] = { est_generique: row.est_generique, classe_therapeutique: row.classe_therapeutique };
        });
        setSearchExtraById(prev => ({ ...prev, ...map }));
      } catch {
        // silencieux
      }
    })();
  }, [genericOnly, classeQuery, medResults]);

  const allFormes = useMemo(() => {
    const src = (query.trim().length >= 2 ? medResults : initialMeds) as any[];
    const set = new Set<string>();
    src.forEach(m => { if (m.forme_pharmaceutique) set.add(m.forme_pharmaceutique); });
    return Array.from(set).sort();
  }, [medResults, initialMeds, query]);

  const displayedMeds = useMemo(() => {
    const base = (query.trim().length >= 2 ? medResults.map((m: any) => ({ ...m, ...searchExtraById[m.id] })) : initialMeds) as any[];
    return base.filter((m: any) => {
      if (selectedForme && m.forme_pharmaceutique !== selectedForme) return false;
      if (ordonnanceOnly && !m.necessite_ordonnance) return false;
      if (genericOnly && !m.est_generique) return false;
      if (classeQuery && !(m.classe_therapeutique || '').toLowerCase().includes(classeQuery.toLowerCase())) return false;
      return true;
    });
  }, [medResults, initialMeds, searchExtraById, selectedForme, ordonnanceOnly, genericOnly, classeQuery, query]);

  const handleResetFilters = () => {
    setSelectedForme("");
    setOrdonnanceOnly(false);
    setGenericOnly(false);
    setClasseQuery("");
  };

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
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une pharmacie (nom, ville, province, code)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPharmacies.map((p) => {
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
            )}
          </TabsContent>

          {/* Onglet Dépôt Pharmaceutique */}
          <TabsContent value="depot" className="mt-6 space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit (ex: paracétamol, amoxicilline, ibuprofène...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Badge variant="secondary" className="hidden md:inline-flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {displayedMeds.length} produits
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedForme} onValueChange={setSelectedForme}>
                    <SelectTrigger className="w-[220px]"><SelectValue placeholder="Toutes les formes" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les formes</SelectItem>
                      {allFormes.map(f => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sur ordonnance</span>
                  <Switch checked={ordonnanceOnly} onCheckedChange={setOrdonnanceOnly} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Génériques</span>
                  <Switch checked={genericOnly} onCheckedChange={setGenericOnly} />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Classe thérapeutique"
                    value={classeQuery}
                    onChange={(e) => setClasseQuery(e.target.value)}
                    className="w-[240px]"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Réinitialiser
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedMeds.map((m: any) => (
                <Card key={m.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {m.dci || m.nom_commercial}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {m.nom_commercial && (
                      <div className="text-muted-foreground">Nom commercial: {m.nom_commercial}</div>
                    )}
                    <div className="text-muted-foreground">Forme: {m.forme_pharmaceutique || 'NC'}</div>
                    {m.dosage && <div className="text-muted-foreground">Dosage: {m.dosage}</div>}
                    <div className="font-semibold">
                      {m.prix_moyen_pharmacie ? `${m.prix_moyen_pharmacie.toLocaleString()} FCFA` : 'Prix: NC'}
                    </div>
                    {m.necessite_ordonnance && (
                      <Badge variant="secondary" className="text-xs">Sur ordonnance</Badge>
                    )}
                    <div className="pt-2">
                      <Button variant="outline" size="sm" onClick={() => { setDetailId(m.id); setDetailOpen(true); }}>Voir détails</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {query.trim().length < 2 && !loadingMeds && initialMeds.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Aucun produit disponible dans le dépôt.
                </CardContent>
              </Card>
            )}
            {loadingMeds && (
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div className="flex justify-center pt-2">
              {query.trim().length >= 2 ? (
                <Button variant="outline" size="sm" onClick={() => setSearchLimit(prev => prev + 20)}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Voir plus
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setInitialOffset(prev => prev + initialPageSize)} disabled={loadingMeds}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Voir plus
                </Button>
              )}
            </div>

            <MedicationDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} medId={detailId} />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayoutSimple>
  );
}


