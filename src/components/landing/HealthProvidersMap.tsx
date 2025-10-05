import React, { useMemo, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Navigation, MapPin, ZoomIn, ZoomOut, Layers, Maximize2, Search, X, Locate } from "lucide-react";
import providersData from "@/data/cartography-providers.json";
import { CartographyProvider } from "@/types/cartography";
import { toast } from "sonner";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const providers = useMemo(() => {
    return (providersData as CartographyProvider[]).filter(p => p.coordonnees);
  }, []);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: true,
      minZoom: DEFAULT_ZOOM,
      maxZoom: 18,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: false
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

  // Filtrer les providers
  const filteredProviders = useMemo(() => {
    let filtered = providers;
    
    // Filtrer par type
    if (selectedType) {
      filtered = filtered.filter(p => p.type === selectedType);
    }
    
    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(query) ||
        p.ville.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.adresse_descriptive?.toLowerCase().includes(query) ||
        p.specialites?.some(s => s.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [providers, selectedType, searchQuery]);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!mapInstance.current || !markersGroup.current) return;

    markersGroup.current.clearLayers();

    filteredProviders.forEach(provider => {
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
            ${provider.secteur === 'public' ?
              '<span style="background: hsl(var(--secondary)); color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">Public</span>'
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

    if (filteredProviders.length > 0) {
      const bounds = L.latLngBounds(
        filteredProviders
          .filter(p => p.coordonnees)
          .map(p => [p.coordonnees!.lat, p.coordonnees!.lng])
      );
      
      mapInstance.current?.fitBounds(bounds, { padding: [80, 80], maxZoom: 12 });
    }
  }, [filteredProviders]);

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

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        mapInstance.current?.setView(coords, 13);
        
        // Ajouter un marqueur pour la position de l'utilisateur
        if (markersGroup.current) {
          const userMarker = L.marker(coords, {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  background: hsl(var(--primary));
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 10px rgba(0,0,0,0.3);
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })
          });
          userMarker.bindPopup("📍 Votre position");
        }
        
        setIsLocating(false);
        toast.success("Position obtenue avec succès");
      },
      (error) => {
        setIsLocating(false);
        toast.error("Impossible d'obtenir votre position");
        console.error(error);
      }
    );
  };

  const handleLocationSearch = () => {
    if (!locationQuery.trim()) return;
    
    // Rechercher dans les villes des providers
    const locationMatch = providers.find(p => 
      p.ville.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.adresse_descriptive?.toLowerCase().includes(locationQuery.toLowerCase())
    );
    
    if (locationMatch && locationMatch.coordonnees) {
      mapInstance.current?.setView([locationMatch.coordonnees.lat, locationMatch.coordonnees.lng], 12);
      toast.success(`Centré sur ${locationMatch.ville}`);
    } else {
      toast.error("Localisation non trouvée");
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
    { id: 'hopital', label: 'Hôpitaux', icon: '🏥', color: TYPE_COLORS.hopital },
    { id: 'clinique', label: 'Cliniques', icon: '🏨', color: TYPE_COLORS.clinique },
    { id: 'cabinet_medical', label: 'Cabinets', icon: '👨‍⚕️', color: TYPE_COLORS.cabinet_medical },
    { id: 'cabinet_dentaire', label: 'Dentistes', icon: '🦷', color: TYPE_COLORS.cabinet_dentaire },
    { id: 'pharmacie', label: 'Pharmacies', icon: '💊', color: TYPE_COLORS.pharmacie },
    { id: 'laboratoire', label: 'Laboratoires', icon: '🔬', color: TYPE_COLORS.laboratoire },
    { id: 'imagerie', label: 'Imagerie', icon: '📷', color: TYPE_COLORS.imagerie },
  ];

  return (
    <div className="h-[600px] w-full relative">
      {/* Filtres par type - Interface sur toute la largeur */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <div className="bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.6)] border border-border/40 dark:border-white/15 p-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-xs font-bold text-foreground/80 dark:text-foreground/90 flex items-center gap-2 uppercase tracking-wide">
              <Layers className="h-3 w-3" />
              Filtrer par type
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedType === null ? "default" : "outline"}
                onClick={() => setSelectedType(null)}
                className="h-7 px-3 text-xs rounded-lg font-medium"
              >
                Tous
              </Button>
              {types.map((type) => (
                <Button
                  key={type.id}
                  size="sm"
                  variant={selectedType === type.id ? "default" : "outline"}
                  onClick={() => setSelectedType(type.id)}
                  className="h-7 px-3 text-xs rounded-lg flex items-center gap-1.5 font-medium"
                  title={type.label}
                >
                  <span>{type.icon}</span>
                  <span className="hidden sm:inline">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles de zoom - Version compacte et transparente */}
      <div className="absolute top-32 left-4 z-[1000]">
        <div className="bg-white/95 dark:bg-black/70 backdrop-blur-2xl rounded-2xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.9)] border border-border/60 dark:border-white/20 p-2 flex flex-col gap-1 hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] dark:hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.95)] transition-all duration-500">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-8 w-8 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all text-foreground"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-8 w-8 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all text-foreground"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFullscreen}
            className="h-8 w-8 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all text-foreground"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
