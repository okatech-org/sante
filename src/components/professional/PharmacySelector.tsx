import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Phone, Check } from "lucide-react";
import { toast } from "sonner";

interface Pharmacy {
  id: string;
  raison_sociale: string;
  adresse_rue?: string;
  ville?: string;
  province?: string;
  telephone_standard?: string;
  cnamgs_conventionne: boolean;
}

interface PharmacySelectorProps {
  onSelect: (pharmacyId: string) => void;
  selectedPharmacyId?: string;
}

export function PharmacySelector({ onSelect, selectedPharmacyId }: PharmacySelectorProps) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPharmacies();
  }, [searchQuery]);

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('establishments')
        .select('id, raison_sociale, adresse_rue, ville, province, telephone_standard, cnamgs_conventionne')
        .ilike('raison_sociale', '%pharmacie%')
        .eq('statut', 'actif')
        .order('raison_sociale');

      if (searchQuery) {
        query = query.or(`raison_sociale.ilike.%${searchQuery}%,ville.ilike.%${searchQuery}%,province.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      setPharmacies(data || []);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      toast.error("Erreur lors du chargement des pharmacies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une pharmacie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-center py-4 text-muted-foreground">Chargement...</p>
        ) : pharmacies.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Aucune pharmacie trouvée</p>
        ) : (
          pharmacies.map((pharmacy) => (
            <Card
              key={pharmacy.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPharmacyId === pharmacy.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelect(pharmacy.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {pharmacy.raison_sociale}
                    {selectedPharmacyId === pharmacy.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CardTitle>
                  {pharmacy.cnamgs_conventionne && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      CNAMGS
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                {pharmacy.adresse_rue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {pharmacy.adresse_rue}, {pharmacy.ville}, {pharmacy.province}
                    </span>
                  </div>
                )}
                {pharmacy.telephone_standard && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{pharmacy.telephone_standard}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
