// @ts-nocheck
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Phone, Mail, Send, Loader2, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  distance?: number;
}

interface SendToPharmacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescriptionId: string;
}

export function SendToPharmacyModal({ open, onOpenChange, prescriptionId }: SendToPharmacyModalProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadPharmacies();
    }
  }, [open]);

  const loadPharmacies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*');

      if (error) throw error;
      const mapped = (data || []).map((row: any) => {
        const latitude = row.latitude ?? row.lat ?? null;
        const longitude = row.longitude ?? row.lng ?? null;
        return {
          id: row.id,
          name: row.name ?? row.nom_commercial ?? row.raison_sociale ?? 'Pharmacie',
          address: row.address ?? row.adresse_complete ?? row.adresse ?? '',
          city: row.city ?? row.ville ?? row.commune ?? '',
          province: row.province ?? row.province_region ?? row.region ?? '',
          phone: row.phone ?? row.telephone_principal ?? row.telephone ?? row.tel ?? null,
          email: row.email ?? row.email_contact ?? null,
          latitude: latitude !== null ? Number(latitude) : null,
          longitude: longitude !== null ? Number(longitude) : null,
        } as Pharmacy;
      });
      mapped.sort((a: Pharmacy, b: Pharmacy) => a.name.localeCompare(b.name));
      setPharmacies(mapped);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      toast.error('Erreur lors du chargement des pharmacies');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          loadNearbyFromServer(location).catch(() => calculateDistances(location));
          setLocationLoading(false);
          toast.success('Position détectée');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Impossible de détecter votre position');
          setLocationLoading(false);
        }
      );
    } else {
      toast.error('La géolocalisation n\'est pas supportée');
      setLocationLoading(false);
    }
  };

  const loadNearbyFromServer = async (location: { lat: number; lng: number }) => {
    try {
      const { data, error } = await supabase.rpc('search_pharmacies_nearby', {
        p_latitude: location.lat,
        p_longitude: location.lng,
        p_radius_km: 10,
      });
      if (error) throw error;
      const mapped = (data || []).map((row: any) => {
        const latitude = row.latitude ?? row.lat ?? null;
        const longitude = row.longitude ?? row.lng ?? null;
        const pharmacy: Pharmacy = {
          id: row.id,
          name: row.name ?? row.nom_commercial ?? row.raison_sociale ?? 'Pharmacie',
          address: row.address ?? row.adresse_complete ?? row.adresse ?? '',
          city: row.city ?? row.ville ?? row.commune ?? '',
          province: row.province ?? row.province_region ?? row.region ?? '',
          phone: row.phone ?? row.telephone_principal ?? row.telephone ?? row.tel ?? null,
          email: row.email ?? row.email_contact ?? null,
          latitude: latitude !== null ? Number(latitude) : null,
          longitude: longitude !== null ? Number(longitude) : null,
          distance: row.distance_km ?? row.distance ?? undefined,
        };
        return pharmacy;
      });
      mapped.sort((a: Pharmacy, b: Pharmacy) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      setPharmacies(mapped);
    } catch (e) {
      throw e;
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateDistances = (location: { lat: number; lng: number }) => {
    const pharmaciesWithDistance = pharmacies.map(pharmacy => {
      if (pharmacy.latitude && pharmacy.longitude) {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          pharmacy.latitude,
          pharmacy.longitude
        );
        return { ...pharmacy, distance };
      }
      return pharmacy;
    });
    
    pharmaciesWithDistance.sort((a, b) => {
      if (a.distance && b.distance) return a.distance - b.distance;
      if (a.distance) return -1;
      if (b.distance) return 1;
      return 0;
    });
    
    setPharmacies(pharmaciesWithDistance);
  };

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendToPharmacy = async () => {
    if (!selectedPharmacy || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('prescription_pharmacy_requests')
        .insert({
          user_id: user.id,
          prescription_id: prescriptionId,
          pharmacy_id: selectedPharmacy.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(`Ordonnance envoyée à ${selectedPharmacy.name}`);
      onOpenChange(false);
      setSelectedPharmacy(null);
    } catch (error) {
      console.error('Error sending prescription:', error);
      toast.error('Erreur lors de l\'envoi de l\'ordonnance');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a1f2e] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Envoyer à une pharmacie</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a1f2e]/50 border border-white/10">
            <TabsTrigger value="search">Rechercher</TabsTrigger>
            <TabsTrigger value="nearby">À proximité</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une pharmacie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" />
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPharmacies.map((pharmacy) => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    selected={selectedPharmacy?.id === pharmacy.id}
                    onSelect={() => setSelectedPharmacy(pharmacy)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nearby" className="space-y-4">
            <Button
              onClick={getUserLocation}
              disabled={locationLoading}
              className="w-full bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-white"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              Détecter ma position
            </Button>

            {userLocation && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPharmacies.map((pharmacy) => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    selected={selectedPharmacy?.id === pharmacy.id}
                    onSelect={() => setSelectedPharmacy(pharmacy)}
                    showDistance
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedPharmacy && (
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setSelectedPharmacy(null)}
              className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSendToPharmacy}
              disabled={sending}
              className="flex-1 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-white"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Envoyer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  selected: boolean;
  onSelect: () => void;
  showDistance?: boolean;
}

function PharmacyCard({ pharmacy, selected, onSelect, showDistance }: PharmacyCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        selected
          ? 'border-[#00d4ff] bg-[#00d4ff]/10'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1">{pharmacy.name}</h3>
          <div className="space-y-1 text-sm text-gray-400">
            <div className="flex items-start gap-1">
              <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span className="break-words">{pharmacy.address}, {pharmacy.city}</span>
            </div>
            {pharmacy.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <span>{pharmacy.phone}</span>
              </div>
            )}
            {pharmacy.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{pharmacy.email}</span>
              </div>
            )}
          </div>
        </div>
        {showDistance && pharmacy.distance && (
          <Badge className="ml-2 flex-shrink-0 bg-[#00d4ff]/20 text-[#00d4ff]">
            {pharmacy.distance.toFixed(1)} km
          </Badge>
        )}
      </div>
    </div>
  );
}
