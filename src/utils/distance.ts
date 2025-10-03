import { Coordonnees } from "@/types/cartography";

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calcule la distance entre deux points GPS en utilisant la formule de Haversine
 * @param coord1 Première coordonnée
 * @param coord2 Seconde coordonnée
 * @returns Distance en kilomètres arrondie à 1 décimale
 */
export const calculateDistance = (coord1: Coordonnees, coord2: Coordonnees): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(1));
};

/**
 * Formate une distance pour l'affichage
 * @param distance Distance en km
 * @returns Distance formatée avec unité
 */
export const formatDistance = (distance: number | null | undefined): string => {
  if (!distance) return "-";
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
};
