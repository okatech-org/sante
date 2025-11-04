import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Génère un slug pour les pharmacies en remplaçant les espaces par des underscores
// et en conservant les caractères accentués ainsi que les tirets.
export function pharmacySlugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // enlever les accents
    .trim()
    .replace(/\s+/g, '-') // espaces -> tiret
    .replace(/_/g, '-') // underscores -> tiret
    .replace(/[^a-z0-9-]/g, '') // ASCII uniquement
    .replace(/-+/g, '-'); // compacter les multiples tirets
}

// Restaure le libellé depuis le slug en remplaçant les underscores par des espaces
export function nameFromPharmacySlug(slug: string): string {
  return slug.replace(/[-_]/g, ' ');
}
