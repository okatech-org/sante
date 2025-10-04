import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Navigation, MapPin } from "lucide-react";
import providersData from "@/data/cartography-providers.json";
import { CartographyProvider } from "@/types/cartography";

// Fix pour les icônes Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Icônes colorées par type
const createColoredIcon = (type: string) => {
  const colors: Record<string, string> = {
    hopital: '#E11D48',
    clinique: '#EC4899',
    cabinet_medical: '#3B82F6',
    cabinet_dentaire: '#8B5CF6',
    pharmacie: '#10B981',
    laboratoire: '#F59E0B',
    imagerie: '#6366F1'
  };

  const color = colors[type] || '#6B7280';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function HealthProvidersMap() {
  const GABON_CENTER = { lat: 0.4162, lng: 9.4673 };
  
  const providers = useMemo(() => {
    return (providersData as CartographyProvider[]).filter(p => p.coordonnees);
  }, []);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (coords: { lat: number; lng: number }, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border-2 border-border shadow-xl">
      <MapContainer
        center={[GABON_CENTER.lat, GABON_CENTER.lng]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {providers.map(provider => (
          <Marker
            key={provider.id}
            position={[provider.coordonnees!.lat, provider.coordonnees!.lng]}
            icon={createColoredIcon(provider.type)}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="space-y-2 p-1">
                <div>
                  <h3 className="font-bold text-sm">{provider.nom}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {provider.type.replace('_', ' ')} • {provider.ville}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {provider.ouvert_24_7 && (
                    <Badge variant="default" className="text-xs bg-green-600">24/7</Badge>
                  )}
                  {provider.conventionnement.cnamgs && (
                    <Badge variant="default" className="text-xs bg-blue-600">CNAMGS</Badge>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <p className="flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{provider.adresse_descriptive}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span>{provider.telephones[0]}</span>
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCall(provider.telephones[0])}
                    className="flex-1 text-xs h-7"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Appeler
                  </Button>
                  {provider.coordonnees && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDirections(provider.coordonnees!, provider.nom)}
                      className="flex-1 text-xs h-7"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Itinéraire
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 8px;
        }
      `}</style>
    </div>
  );
}
