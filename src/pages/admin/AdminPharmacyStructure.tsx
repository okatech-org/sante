import { useEffect, useMemo, useState } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, MapPin, Phone, Search, Shield, Clock, Building2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMedicationsSearch } from "@/hooks/useMedicationsSearch";
import { toast } from "sonner";

type PharmacyRow = {
  id: string;
  code_pharmacie: string;
  nom_commercial: string;
  ville: string;
  province: string;
  quartier: string | null;
  telephone_principal: string | null;
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
  const { data: meds } = useMedicationsSearch(query, 20);
  const medResults = Array.isArray(meds) ? meds : [];

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("pharmacies")
          .select("id, code_pharmacie, nom_commercial, ville, province, quartier, telephone_principal, ouvert_24_7, conventionnement_cnamgs, statut_verification")
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
                {filteredPharmacies.map((p) => (
                  <Card key={p.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{p.nom_commercial}</span>
                        <Badge variant={p.statut_verification === 'verifie' ? 'default' : 'secondary'}>
                          {p.statut_verification}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{p.quartier ? `${p.quartier}, ` : ''}{p.ville} • {p.province}</span>
                      </div>
                      {p.telephone_principal && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{p.telephone_principal}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {p.ouvert_24_7 && (
                          <Badge variant="outline" className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" /> 24/7
                          </Badge>
                        )}
                        {p.conventionnement_cnamgs && (
                          <Badge variant="outline" className="flex items-center gap-1 text-xs">
                            <Shield className="h-3 w-3" /> CNAMGS
                          </Badge>
                        )}
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" size="sm" onClick={() => window.open(`/pharmacies/${p.id}`, '_blank')}>
                          Voir la fiche
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Dépôt Pharmaceutique */}
          <TabsContent value="depot" className="mt-6 space-y-4">
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
                {Array.isArray(meds) ? medResults.length : 0} produits
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medResults.map((m: any) => (
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
                  </CardContent>
                </Card>
              ))}
            </div>
            {query.trim().length < 2 && (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Saisissez au moins 2 caractères pour rechercher des produits pharmaceutiques.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayoutSimple>
  );
}


