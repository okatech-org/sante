import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CartographyProvider, Coordonnees } from "@/types/cartography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Navigation } from "lucide-react";
import { useTheme } from "next-themes";

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

// Icônes colorées par type - Utilisation des tokens du design system
const createColoredIcon = (type: string, isDark: boolean) => {
  const lightColors: Record<string, string> = {
    hopital: 'hsl(338, 80%, 57%)', // accent
    clinique: 'hsl(338, 80%, 67%)', // accent variant
    cabinet_medical: 'hsl(202, 100%, 50%)', // secondary
    cabinet_dentaire: 'hsl(173, 78%, 45%)', // primary
    pharmacie: 'hsl(173, 78%, 50%)', // success
    laboratoire: 'hsl(41, 100%, 50%)', // warning
    imagerie: 'hsl(202, 100%, 60%)' // secondary variant
  };

  const darkColors: Record<string, string> = {
    hopital: 'hsl(338, 80%, 62%)', // accent dark
    clinique: 'hsl(338, 80%, 72%)', // accent variant dark
    cabinet_medical: 'hsl(202, 100%, 55%)', // secondary dark
    cabinet_dentaire: 'hsl(173, 78%, 50%)', // primary dark
    pharmacie: 'hsl(173, 78%, 50%)', // success dark
    laboratoire: 'hsl(41, 100%, 55%)', // warning dark
    imagerie: 'hsl(202, 100%, 65%)' // secondary variant dark
  };

  const colors = isDark ? darkColors : lightColors;
  const color = colors[type] || (isDark ? 'hsl(215, 20%, 65%)' : 'hsl(215, 16%, 47%)');
  const borderColor = isDark ? 'hsl(210, 30%, 10%)' : 'hsl(0, 0%, 100%)';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid ${borderColor}; box-shadow: 0 2px 12px ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)'};"></div>`,
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
    if (map) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center.lat, center.lng, map]);
  
  return null;
}

export default function CartographyMapView({ 
  providers, 
  userLocation,
  onMarkerClick 
}: MapViewProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
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
    <div className="h-full w-full rounded-lg overflow-hidden border shadow-lg">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={userLocation ? 12 : 6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={isDark 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {userLocation && <MapCenter center={userLocation} />}

        {/* Marker de l'utilisateur */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-marker',
              html: `<div style="background-color: hsl(173, 78%, ${isDark ? '50%' : '45%'}); width: 20px; height: 20px; border-radius: 50%; border: 3px solid ${isDark ? 'hsl(210, 30%, 10%)' : 'hsl(0, 0%, 100%)'}; box-shadow: 0 0 16px hsl(173, 78%, ${isDark ? '50%' : '45%'}, 0.6); animation: pulse 2s infinite;"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup className="custom-popup">
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
              icon={createColoredIcon(provider.type, isDark)}
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
                      <Badge className="text-xs bg-success text-success-foreground">24/7</Badge>
                    )}
                    {provider.conventionnement.cnamgs && (
                      <Badge className="text-xs bg-secondary text-secondary-foreground">CNAMGS</Badge>
                    )}
                    {provider.equipements_specialises?.some(e => e.includes('IRM') || e.includes('Scanner')) && (
                      <Badge className="text-xs bg-accent text-accent-foreground">Imagerie</Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <p>📍 {provider.adresse_descriptive}</p>
                    {provider.telephones && provider.telephones.length > 0 && (
                      <p>📞 {provider.telephones[0]}</p>
                    )}
                    {provider.distance && (
                      <p className="text-primary font-semibold">
                        📏 {provider.distance} km de vous
                      </p>
                    )}
                  </div>

                  {provider.services && provider.services.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1">Services:</p>
                      <p className="text-xs text-muted-foreground">
                        {provider.services.slice(0, 3).join(', ')}
                        {provider.services.length > 3 && '...'}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {provider.telephones && provider.telephones.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCall(provider.telephones[0])}
                        className="flex-1 text-xs"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Appeler
                      </Button>
                    )}
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
          background-color: ${isDark ? 'hsl(210, 30%, 10%)' : 'hsl(0, 0%, 100%)'};
          color: ${isDark ? 'hsl(210, 40%, 98%)' : 'hsl(210, 20%, 15%)'};
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 4px 20px ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)'};
          border: 1px solid ${isDark ? 'hsl(210, 30%, 18%)' : 'hsl(214, 32%, 91%)'};
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 12px;
        }

        .custom-popup .leaflet-popup-tip {
          background-color: ${isDark ? 'hsl(210, 30%, 10%)' : 'hsl(0, 0%, 100%)'};
          border: 1px solid ${isDark ? 'hsl(210, 30%, 18%)' : 'hsl(214, 32%, 91%)'};
        }

        .leaflet-container {
          background-color: ${isDark ? 'hsl(210, 30%, 8%)' : 'hsl(0, 0%, 98%)'};
        }

        .leaflet-control-zoom a {
          background-color: ${isDark ? 'hsl(210, 30%, 10%)' : 'hsl(0, 0%, 100%)'} !important;
          color: ${isDark ? 'hsl(210, 40%, 98%)' : 'hsl(210, 20%, 15%)'} !important;
          border-color: ${isDark ? 'hsl(210, 30%, 18%)' : 'hsl(214, 32%, 91%)'} !important;
        }

        .leaflet-control-zoom a:hover {
          background-color: ${isDark ? 'hsl(210, 30%, 15%)' : 'hsl(210, 40%, 96%)'} !important;
        }

        .leaflet-control-attribution {
          background-color: ${isDark ? 'rgba(16, 22, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)'} !important;
          color: ${isDark ? 'hsl(215, 20%, 65%)' : 'hsl(215, 16%, 47%)'} !important;
        }

        .leaflet-control-attribution a {
          color: ${isDark ? 'hsl(173, 78%, 50%)' : 'hsl(173, 78%, 45%)'} !important;
        }
      `}</style>
    </div>
  );
}
