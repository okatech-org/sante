import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Building2, MapPin } from 'lucide-react';

interface Establishment {
  id: string;
  raison_sociale: string;
  type_etablissement: string;
  ville: string;
  province: string;
  latitude?: number;
  longitude?: number;
}

interface EstablishmentsMapProps {
  establishments: Establishment[];
  onEstablishmentClick?: (establishment: Establishment) => void;
  selectedEstablishmentId?: string;
  height?: string;
}

export default function EstablishmentsMap({ 
  establishments, 
  onEstablishmentClick,
  selectedEstablishmentId,
  height = '500px'
}: EstablishmentsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Charger le token Mapbox depuis Supabase
  useEffect(() => {
    const loadMapboxToken = async () => {
      try {
        // Le token est stocké dans les secrets Supabase
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`, {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMapboxToken(data.token);
        } else {
          // Fallback: utiliser une clé publique temporaire (à remplacer)
          console.warn('Token Mapbox non trouvé, utilisation de la clé par défaut');
          setMapboxToken('pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw');
        }
      } catch (error) {
        console.error('Erreur chargement token Mapbox:', error);
        // Fallback
        setMapboxToken('pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw');
      } finally {
        setIsLoading(false);
      }
    };

    loadMapboxToken();
  }, []);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Centre sur le Gabon
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [11.6094, -0.8037], // Coordonnées du Gabon (Libreville)
      zoom: 6,
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Ajouter le contrôle de géolocalisation
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Ajouter les marqueurs des établissements
  useEffect(() => {
    if (!map.current) return;

    // Nettoyer les marqueurs existants
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filtrer les établissements avec coordonnées
    const establishmentsWithCoords = establishments.filter(
      est => est.latitude && est.longitude
    );

    if (establishmentsWithCoords.length === 0) {
      console.warn('Aucun établissement avec coordonnées géographiques');
      return;
    }

    // Ajouter un marqueur pour chaque établissement
    establishmentsWithCoords.forEach(establishment => {
      if (!establishment.latitude || !establishment.longitude) return;

      // Créer un élément HTML personnalisé pour le marqueur
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div class="relative flex items-center justify-center w-full h-full">
          <div class="${
            selectedEstablishmentId === establishment.id 
              ? 'bg-primary shadow-lg scale-110' 
              : 'bg-blue-600 hover:bg-blue-700'
          } rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18M9 8h1m-1 4h1m4-4h1m-1 4h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
            </svg>
          </div>
        </div>
      `;

      // Créer le marqueur
      const marker = new mapboxgl.Marker(el)
        .setLngLat([establishment.longitude, establishment.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-sm mb-1">${establishment.raison_sociale}</h3>
              <p class="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                ${establishment.ville}, ${establishment.province}
              </p>
              <p class="text-xs bg-gray-100 px-2 py-1 rounded inline-block">${establishment.type_etablissement}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      // Gérer le clic sur le marqueur
      el.addEventListener('click', () => {
        if (onEstablishmentClick) {
          onEstablishmentClick(establishment);
        }
      });

      markers.current.push(marker);
    });

    // Ajuster la vue pour inclure tous les marqueurs
    if (establishmentsWithCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      establishmentsWithCoords.forEach(est => {
        if (est.latitude && est.longitude) {
          bounds.extend([est.longitude, est.latitude]);
        }
      });
      map.current?.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [establishments, selectedEstablishmentId, onEstablishmentClick]);

  if (isLoading) {
    return (
      <div 
        className="w-full rounded-lg bg-muted/20 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Établissements médicaux</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Cliquez sur un marqueur pour voir les détails
        </p>
      </div>
    </div>
  );
}
