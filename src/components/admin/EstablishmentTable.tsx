import { useState } from "react";
import { Establishment } from "@/types/establishment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from "lucide-react";

interface EstablishmentTableProps {
  establishments: Establishment[];
  onEdit: (establishment: Establishment) => void;
  onView: (establishment: Establishment) => void;
  onDelete: (establishment: Establishment) => void;
}

export const EstablishmentTable = ({
  establishments,
  onEdit,
  onView,
  onDelete
}: EstablishmentTableProps) => {
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEstablishments = [...establishments].sort((a, b) => {
    const aVal = getFieldValue(a, sortField);
    const bVal = getFieldValue(b, sortField);
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getFieldValue = (est: Establishment, field: string): any => {
    switch (field) {
      case 'name': return est.name;
      case 'category': return est.category;
      case 'status': return est.status;
      case 'province': return est.location.province;
      case 'beds': return est.metrics.totalBeds;
      case 'occupancy': return est.metrics.occupancyRate;
      default: return est.name;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operationnel': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partiel': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operationnel': return 'success';
      case 'partiel': return 'warning';
      case 'maintenance': return 'secondary';
      default: return 'destructive';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'gouvernemental': return 'default';
      case 'universitaire': return 'default';
      case 'regional': return 'secondary';
      case 'prive': return 'outline';
      default: return 'secondary';
    }
  };

  const formatCategory = (category: string) => {
    const labels: Record<string, string> = {
      'gouvernemental': 'Gouvernemental',
      'universitaire': 'CHU',
      'regional': 'CHR',
      'departemental': 'CHD',
      'militaire': 'Militaire',
      'prive': 'Privé',
      'confessionnel': 'Confessionnel',
      'centre_sante': 'Centre Santé',
      'dispensaire': 'Dispensaire',
      'laboratoire': 'Laboratoire',
      'pharmacie': 'Pharmacie',
      'specialise': 'Spécialisé'
    };
    return labels[category] || category;
  };

  if (establishments.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-muted-foreground">Aucun établissement trouvé</p>
        <p className="text-sm text-muted-foreground mt-1">
          Essayez de modifier vos filtres de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('name')}
            >
              Établissement
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('category')}
            >
              Catégorie
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('status')}
            >
              Statut
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('province')}
            >
              Localisation
            </TableHead>
            <TableHead className="text-center">Capacité</TableHead>
            <TableHead className="text-center">Personnel</TableHead>
            <TableHead className="text-center">Services</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEstablishments.map((establishment, index) => (
            <TableRow key={establishment.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-xs text-muted-foreground">
                {index + 1}
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="font-medium">{establishment.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Code: {establishment.code}
                  </div>
                  {establishment.director && (
                    <div className="text-xs text-muted-foreground">
                      Dir: {establishment.director}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant={getCategoryBadgeColor(establishment.category)}>
                  {formatCategory(establishment.category)}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  Niveau {establishment.level}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  {getStatusIcon(establishment.status)}
                  <Badge variant={getStatusColor(establishment.status) as any} className="text-xs">
                    {establishment.status}
                  </Badge>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-start gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm">{establishment.location.city}</div>
                    <div className="text-xs text-muted-foreground">
                      {establishment.location.province}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div>
                  <div className="font-medium">{establishment.metrics.totalBeds}</div>
                  <div className="text-xs text-muted-foreground">
                    lits ({establishment.metrics.occupancyRate}%)
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div>
                  <div className="text-xs">
                    <span className="font-medium">{establishment.staff.doctors}</span> méd.
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{establishment.staff.nurses}</span> inf.
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {establishment.isEmergencyCenter && (
                    <Badge variant="outline" className="text-xs">Urgences</Badge>
                  )}
                  {establishment.hasPharmacy && (
                    <Badge variant="outline" className="text-xs">Pharmacie</Badge>
                  )}
                  {establishment.hasLaboratory && (
                    <Badge variant="outline" className="text-xs">Labo</Badge>
                  )}
                  {establishment.services.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      +{establishment.services.length}
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(establishment)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(establishment)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(establishment)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
