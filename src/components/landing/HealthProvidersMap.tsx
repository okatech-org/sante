import React, { useMemo, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Navigation, MapPin, ZoomIn, ZoomOut, Layers, Maximize2 } from "lucide-react";
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

// Couleurs par type
const TYPE_COLORS: Record<string, string> = {
  hopital: 'hsl(var(--destructive))',
  clinique: 'hsl(var(--warning))',
  cabinet_medical: 'hsl(var(--primary))',
  cabinet_dentaire: 'hsl(var(--secondary))',
  pharmacie: 'hsl(var(--accent))',
  laboratoire: '#F59E0B',
  imagerie: '#6366F1'
};

// Centre du Gabon
const GABON_CENTER: [number, number] = [0.4162, 9.4673];
const DEFAULT_ZOOM = 6;

export default function HealthProvidersMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const providers = useMemo(() => {
    return (providersData as CartographyProvider[]).filter(p => p.coordonnees);
  }, []);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: true
    }).setView(GABON_CENTER, DEFAULT_ZOOM);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersGroup.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!mapInstance.current || !markersGroup.current) return;

    markersGroup.current.clearLayers();

    const displayedProviders = selectedType 
      ? providers.filter(p => p.type === selectedType)
      : providers;

    displayedProviders.forEach(provider => {
      if (!provider.coordonnees) return;

      const color = TYPE_COLORS[provider.type] || '#6B7280';
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 18px;
            ">
              ${getProviderIcon(provider.type)}
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([provider.coordonnees.lat, provider.coordonnees.lng], {
        icon: customIcon
      });

      const popupContent = `
        <div style="min-width: 240px; padding: 4px;">
          <h3 style="font-weight: 700; margin-bottom: 8px; font-size: 15px; color: hsl(var(--foreground));">
            ${provider.nom}
          </h3>
          <p style="color: hsl(var(--muted-foreground)); font-size: 13px; margin-bottom: 8px; text-transform: capitalize;">
            ${getTypeLabel(provider.type)} • ${provider.ville}
          </p>
          <p style="font-size: 13px; margin-bottom: 8px; display: flex; align-items: start; gap: 6px; color: hsl(var(--foreground));">
            <span style="flex-shrink: 0;">📍</span>
            <span>${provider.adresse_descriptive || provider.ville}</span>
          </p>
          ${provider.telephones[0] ? `
            <p style="font-size: 13px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; color: hsl(var(--foreground));">
              <span>📞</span>
              <a href="tel:${provider.telephones[0]}" style="color: hsl(var(--primary)); text-decoration: none;">
                ${provider.telephones[0]}
              </a>
            </p>
          ` : ''}
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
            ${provider.conventionnement?.cnamgs ? 
              '<span style="background: hsl(var(--primary)); color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">CNAMGS ✓</span>' 
              : ''}
            ${provider.ouvert_24_7 ? 
              '<span style="background: hsl(var(--accent)); color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">24/7</span>' 
              : ''}
          </div>
          <div style="display: flex; gap: 8px;">
            <a 
              href="tel:${provider.telephones[0]}" 
              style="
                flex: 1;
                background: hsl(var(--primary));
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 12px;
                font-weight: 600;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
              "
            >
              📞 Appeler
            </a>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${provider.coordonnees.lat},${provider.coordonnees.lng}" 
              target="_blank"
              rel="noopener noreferrer"
              style="
                flex: 1;
                background: hsl(var(--secondary));
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 12px;
                font-weight: 600;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
              "
            >
              🧭 Itinéraire
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-leaflet-popup'
      });

      markersGroup.current?.addLayer(marker);
    });

    if (displayedProviders.length > 0) {
      const bounds = L.latLngBounds(
        displayedProviders
          .filter(p => p.coordonnees)
          .map(p => [p.coordonnees!.lat, p.coordonnees!.lng])
      );
      
      mapInstance.current?.fitBounds(bounds, { padding: [80, 80], maxZoom: 12 });
    }
  }, [providers, selectedType]);

  const handleZoomIn = () => mapInstance.current?.zoomIn();
  const handleZoomOut = () => mapInstance.current?.zoomOut();
  
  const handleFullscreen = () => {
    if (!mapContainer.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      mapContainer.current.requestFullscreen();
    }
  };

  const getProviderIcon = (type: string): string => {
    const icons: Record<string, string> = {
      hopital: '🏥',
      clinique: '🏨',
      cabinet_medical: '👨‍⚕️',
      cabinet_dentaire: '🦷',
      pharmacie: '💊',
      laboratoire: '🔬',
      imagerie: '📷'
    };
    return icons[type] || '📍';
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      hopital: 'Hôpital',
      clinique: 'Clinique',
      cabinet_medical: 'Cabinet Médical',
      cabinet_dentaire: 'Cabinet Dentaire',
      pharmacie: 'Pharmacie',
      laboratoire: 'Laboratoire',
      imagerie: "Centre d'Imagerie"
    };
    return labels[type] || type;
  };

  const types = [
    { id: 'hopital', label: 'Hôpitaux', icon: '🏥' },
    { id: 'clinique', label: 'Cliniques', icon: '🏨' },
    { id: 'cabinet_medical', label: 'Cabinets', icon: '👨‍⚕️' },
    { id: 'pharmacie', label: 'Pharmacies', icon: '💊' },
  ];

  return (
    <div className="h-[600px] w-full relative">
      {/* Contrôles de zoom */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/80 p-1.5 flex flex-col gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFullscreen}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Filtres par type */}
      <div className="absolute top-4 right-4 z-[1000] hidden md:block">
        <div className="bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/80 p-2 space-y-1.5 min-w-[140px]">
          <Button
            variant={selectedType === null ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start text-sm font-medium"
            onClick={() => setSelectedType(null)}
          >
            <Layers className="h-4 w-4 mr-2" />
            Tous
          </Button>
          {types.map(type => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start text-sm font-medium"
              onClick={() => setSelectedType(type.id)}
            >
              <span className="mr-2">{type.icon}</span>
              <span className="truncate text-xs">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/80 px-4 py-2.5">
          <p className="text-sm font-semibold text-foreground">
            {selectedType 
              ? providers.filter(p => p.type === selectedType).length 
              : providers.length
            } établissements
            {selectedType && ` • ${getTypeLabel(selectedType)}`}
          </p>
        </div>
      </div>

      {/* Container de la carte */}
      <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden" />

      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 8px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3);
        }
        
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
        }

        .custom-leaflet-popup .leaflet-popup-tip {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
        }

        .leaflet-container {
          background: hsl(var(--muted) / 0.3);
        }
      `}</style>
    </div>
  );
}
