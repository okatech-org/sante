import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Building2, MapPin } from 'lucide-react';

interface HealthProvider {
  id: string;
  nom: string;
  type: string;
  province: string;
  ville: string;
  latitude: number | null;
  longitude: number | null;
  secteur: string | null;
  statut_operationnel: string | null;
}

export const GabonHealthMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [providers, setProviders] = useState<HealthProvider[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    chu: 0,
    chr: 0,
    centres: 0
  });

  useEffect(() => {
    // Charger les établissements de santé
    const loadProviders = async () => {
      const { data, error } = await supabase
        .from('osm_health_providers')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (data && !error) {
        setProviders(data);
        
        // Calculer les statistiques
        const chu = data.filter(p => p.type.toLowerCase().includes('chu')).length;
        const chr = data.filter(p => p.type.toLowerCase().includes('chr')).length;
        const centres = data.filter(p => 
          p.type.toLowerCase().includes('centre') || 
          p.type.toLowerCase().includes('dispensaire')
        ).length;
        
        setStats({
          total: data.length,
          chu,
          chr,
          centres
        });
      }
    };

    loadProviders();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Token Mapbox public (à remplacer par votre propre token)
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY20za2V3aXIzMDFmNDJrcXYyeGxpbTZ0aCJ9.6tL4tTMZKGPiEBxFUJaLmw';

    // Initialiser la carte centrée sur le Gabon
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [11.6094, -0.8037], // Libreville
      zoom: 6,
      pitch: 0
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || providers.length === 0) return;

    map.current.on('load', () => {
      // Ajouter les marqueurs pour chaque établissement
      providers.forEach((provider) => {
        if (provider.latitude && provider.longitude) {
          // Déterminer la couleur selon le type
          let color = '#3b82f6'; // blue
          if (provider.type.toLowerCase().includes('chu')) color = '#ef4444'; // red
          else if (provider.type.toLowerCase().includes('chr')) color = '#f59e0b'; // orange
          else if (provider.type.toLowerCase().includes('clinique')) color = '#10b981'; // green
          
          // Créer un marqueur personnalisé
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.backgroundColor = color;
          el.style.width = '12px';
          el.style.height = '12px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          el.style.cursor = 'pointer';

          // Créer le popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-1">${provider.nom}</h3>
              <p class="text-xs text-gray-600">${provider.type}</p>
              <p class="text-xs text-gray-500">${provider.ville}, ${provider.province}</p>
              ${provider.statut_operationnel ? `
                <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                  provider.statut_operationnel === 'operationnel' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }">
                  ${provider.statut_operationnel}
                </span>
              ` : ''}
            </div>
          `);

          // Ajouter le marqueur à la carte
          new mapboxgl.Marker(el)
            .setLngLat([provider.longitude, provider.latitude])
            .setPopup(popup)
            .addTo(map.current!);
        }
      });
    });
  }, [providers]);

  return (
    <div className="relative">
      {/* Carte */}
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" />
      
      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Réseau de Santé
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow"></div>
            <span>CHU ({stats.chu})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow"></div>
            <span>CHR ({stats.chr})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow"></div>
            <span>Cliniques</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            <span>Centres & Autres</span>
          </div>
          <div className="pt-2 mt-2 border-t">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-semibold">{stats.total} établissements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
