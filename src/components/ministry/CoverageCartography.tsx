import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

interface ProvinceHealthData {
  id: string;
  province: string;
  population: number;
  coverageRate: number;
  [key: string]: any;
}

interface CoverageCartographyProps {
  provincesData: ProvinceHealthData[];
  selectedProvince: ProvinceHealthData | null;
  onSelectProvince: (province: ProvinceHealthData) => void;
}

const GABON_CENTER: [number, number] = [-0.8037, 11.6094];
const DEFAULT_ZOOM = 6;

const PROVINCE_COORDINATES: Record<string, [number, number]> = {
  "Estuaire": [0.4162, 9.4673],
  "Haut-Ogooué": [-1.6333, 13.5833],
  "Ogooué-Maritime": [-0.7193, 8.7815],
  "Woleu-Ntem": [1.5994, 11.5794],
  "Ngounié": [-1.8667, 11.0167],
  "Nyanga": [-2.9333, 11.0167],
  "Ogooué-Ivindo": [0.5667, 12.8667],
  "Ogooué-Lolo": [-0.9833, 12.6667],
  "Moyen-Ogooué": [-0.7000, 10.2333],
};

const getCoverageColor = (coverage: number): string => {
  if (coverage >= 80) return "#10b981";
  if (coverage >= 60) return "#f59e0b";
  return "#ef4444";
};

const CoverageCartography = ({ provincesData, selectedProvince, onSelectProvince }: CoverageCartographyProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 5,
      maxZoom: 10,
    }).setView(GABON_CENTER, DEFAULT_ZOOM);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !provincesData.length) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    provincesData.forEach((province) => {
      const coords = PROVINCE_COORDINATES[province.province];
      if (!coords) return;

      const color = getCoverageColor(province.coverageRate);
      const isSelected = selectedProvince?.id === province.id;
      const radius = isSelected ? 25 : 18;

      const marker = L.circleMarker(coords, {
        radius,
        fillColor: color,
        color: "#fff",
        weight: isSelected ? 4 : 2,
        opacity: 1,
        fillOpacity: isSelected ? 0.9 : 0.7,
      }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="font-size: 14px;">${province.province}</strong>
          <div style="margin-top: 6px; font-size: 12px;">
            <div style="margin: 4px 0;">
              <strong>Couverture:</strong> ${province.coverageRate.toFixed(1)}%
            </div>
            <div style="margin: 4px 0;">
              <strong>Population:</strong> ${province.population.toLocaleString("fr-FR")}
            </div>
            <div style="margin: 4px 0;">
              <strong>Couverts:</strong> ${Math.round((province.population * province.coverageRate) / 100).toLocaleString("fr-FR")} personnes
            </div>
          </div>
        </div>
      `);

      marker.on("click", () => {
        onSelectProvince(province);
      });

      markersRef.current.push(marker);
    });
  }, [provincesData, selectedProvince, onSelectProvince]);

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default CoverageCartography;

