import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CartographyProvider, Coordonnees } from "@/types/cartography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Navigation } from "lucide-react";

// Fix pour les icônes par défaut de Leaflet
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
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

interface MapViewProps {
  providers: CartographyProvider[];
  userLocation: Coordonnees | null;
  onMarkerClick: (providerId: string) => void;
}

// Composant pour centrer la carte
function MapCenter({ center }: { center: Coordonnees }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function CartographyMapView({ 
  providers, 
  userLocation,
  onMarkerClick 
}: MapViewProps) {
  const GABON_CENTER: Coordonnees = { lat: 0.4162, lng: 9.4673 };
  const mapCenter = userLocation || GABON_CENTER;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (coords: Coordonnees, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={userLocation ? 12 : 6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && <MapCenter center={userLocation} />}

        {/* Marker de l'utilisateur */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-marker',
              html: `<div style="background-color: #2563EB; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37, 99, 235, 0.5); animation: pulse 2s infinite;"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="text-sm font-semibold">Vous êtes ici</div>
            </Popup>
          </Marker>
        )}

        {/* Markers */}
        {providers
          .filter(p => p.coordonnees)
          .map(provider => (
            <Marker
              key={provider.id}
              position={[provider.coordonnees!.lat, provider.coordonnees!.lng]}
              icon={createColoredIcon(provider.type)}
            >
              <Popup maxWidth={320} className="custom-popup">
                <div className="space-y-2 p-1">
                  <div>
                    <h3 className="font-bold text-base">{provider.nom}</h3>
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
                    {provider.equipements_specialises?.some(e => e.includes('IRM') || e.includes('Scanner')) && (
                      <Badge variant="default" className="text-xs bg-purple-600">Imagerie</Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <p>📍 {provider.adresse_descriptive}</p>
                    <p>📞 {provider.telephones[0]}</p>
                    {provider.distance && (
                      <p className="text-primary font-semibold">
                        📏 {provider.distance} km de vous
                      </p>
                    )}
                  </div>

                  {provider.services.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1">Services:</p>
                      <p className="text-xs text-muted-foreground">
                        {provider.services.slice(0, 3).join(', ')}
                        {provider.services.length > 3 && '...'}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCall(provider.telephones[0])}
                      className="flex-1 text-xs"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Appeler
                    </Button>
                    {provider.coordonnees && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDirections(provider.coordonnees!, provider.nom)}
                        className="flex-1 text-xs"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Itinéraire
                      </Button>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => onMarkerClick(provider.id)}
                  >
                    Voir détails complets →
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
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
