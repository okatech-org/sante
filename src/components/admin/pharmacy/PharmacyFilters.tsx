import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { StatutVerification } from '@/types/pharmacy';

interface PharmacyFiltersProps {
  filters: {
    search?: string;
    ville?: string;
    province?: string;
    statut_verification?: StatutVerification;
  };
  onFiltersChange: (filters: any) => void;
}

const PROVINCES = [
  'Estuaire',
  'Haut-Ogooué',
  'Moyen-Ogooué',
  'Ngounié',
  'Nyanga',
  'Ogooué-Ivindo',
  'Ogooué-Lolo',
  'Ogooué-Maritime',
  'Woleu-Ntem',
];

const VILLES = [
  'Libreville',
  'Port-Gentil',
  'Franceville',
  'Oyem',
  'Moanda',
  'Mouila',
  'Lambaréné',
  'Tchibanga',
  'Koulamoutou',
  'Makokou',
];

export function PharmacyFilters({ filters, onFiltersChange }: PharmacyFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une pharmacie..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.province || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, province: value === 'all' ? '' : value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Province" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les provinces</SelectItem>
          {PROVINCES.map((province) => (
            <SelectItem key={province} value={province}>
              {province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.ville || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, ville: value === 'all' ? '' : value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Ville" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les villes</SelectItem>
          {VILLES.map((ville) => (
            <SelectItem key={ville} value={ville}>
              {ville}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
