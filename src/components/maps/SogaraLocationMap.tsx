import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface SogaraLocationMapProps {
  accessToken?: string;
}

const SogaraLocationMap = ({ accessToken }: SogaraLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !accessToken) return;

    // Initialize map
    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [8.7815, -0.7193], // Port-Gentil, Gabon
      zoom: 14,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Create custom marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.backgroundColor = '#2563eb';
    markerElement.style.border = '3px solid white';
    markerElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    markerElement.style.cursor = 'pointer';
    markerElement.style.display = 'flex';
    markerElement.style.alignItems = 'center';
    markerElement.style.justifyContent = 'center';
    
    // Add icon to marker
    markerElement.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white"/>
      </svg>
    `;

    // Add marker to map
    const marker = new mapboxgl.Marker(markerElement)
      .setLngLat([8.7815, -0.7193])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; color: #1f2937;">CMST SOGARA</h3>
              <p style="color: #6b7280; font-size: 14px;">Route de la Sogara<br/>Port-Gentil, Gabon</p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=-0.7193,8.7815" 
                target="_blank" 
                style="display: inline-block; margin-top: 8px; color: #2563eb; font-size: 14px; text-decoration: none; font-weight: 500;"
              >
                Obtenir l'itinéraire →
              </a>
            </div>
          `)
      )
      .addTo(map.current);

    // Show popup on load
    marker.togglePopup();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">
            Pour afficher la carte, ajoutez votre clé Mapbox publique
          </p>
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Obtenir une clé Mapbox →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default SogaraLocationMap;
