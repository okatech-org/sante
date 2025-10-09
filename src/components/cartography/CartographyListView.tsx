import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartographyProvider } from "@/types/cartography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, Phone, Navigation, Eye } from "lucide-react";
import { formatDistance } from "@/utils/distance";

interface CartographyListViewProps {
  providers: CartographyProvider[];
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onProviderClick: (providerId: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  hopital: "Hôpital",
  clinique: "Clinique",
  cabinet_medical: "Cabinet",
  cabinet_dentaire: "Dentaire",
  pharmacie: "Pharmacie",
  laboratoire: "Labo",
  imagerie: "Imagerie"
};

const TYPE_ICONS: Record<string, string> = {
  hopital: "🏥",
  clinique: "🏨",
  cabinet_medical: "👨‍⚕️",
  cabinet_dentaire: "🦷",
  pharmacie: "💊",
  laboratoire: "🔬",
  imagerie: "📷"
};

export default function CartographyListView({
  providers,
  sortBy,
  onSortChange,
  onProviderClick
}: CartographyListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = providers.slice(startIndex, endIndex);

  const SortButton = ({ field, label }: { field: string; label: string }) => (
    <button
      onClick={() => onSortChange(field)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {label}
      {sortBy === field && <ChevronUp className="h-3 w-3" />}
      {sortBy !== field && <ChevronDown className="h-3 w-3 opacity-30" />}
    </button>
  );

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (provider: CartographyProvider) => {
    if (!provider.coordonnees) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${provider.coordonnees.lat},${provider.coordonnees.lng}&destination_place_id=${encodeURIComponent(provider.nom)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">
          {providers.length} résultat{providers.length > 1 ? 's' : ''}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Type</TableHead>
              <TableHead>
                <SortButton field="nom" label="Nom" />
              </TableHead>
              <TableHead>
                <SortButton field="ville" label="Ville" />
              </TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>
                <SortButton field="distance" label="Distance" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProviders.map((provider) => (
              <TableRow key={provider.id} className="hover:bg-accent/50">
                <TableCell>
                  <div className="text-2xl" title={TYPE_LABELS[provider.type]}>
                    {TYPE_ICONS[provider.type]}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{provider.nom}</div>
                    <div className="flex flex-wrap gap-1">
                      {provider.ouvert_24_7 && (
                        <Badge variant="default" className="text-xs bg-green-600">24/7</Badge>
                      )}
                      {provider.conventionnement.cnamgs && (
                        <Badge variant="default" className="text-xs bg-blue-600">CNAMGS</Badge>
                      )}
                      {provider.equipements_specialises?.some(e => 
                        e.includes('IRM') || e.includes('Scanner')
                      ) && (
                        <Badge variant="default" className="text-xs bg-purple-600">
                          Imagerie
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">{provider.ville}</div>
                  <div className="text-xs text-muted-foreground">
                    {provider.adresse_descriptive?.substring(0, 30) || provider.ville}
                    {provider.adresse_descriptive && provider.adresse_descriptive.length > 30 && '...'}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-xs text-muted-foreground max-w-xs">
                    {provider.services && provider.services.length > 0 ? (
                      <>
                        {provider.services.slice(0, 2).join(', ')}
                        {provider.services.length > 2 && ` +${provider.services.length - 2}`}
                      </>
                    ) : (
                      <span className="text-muted-foreground/50">Non spécifié</span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {provider.telephones && provider.telephones.length > 0 ? (
                      <>
                        <a
                          href={`tel:${provider.telephones[0]}`}
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {provider.telephones[0]}
                        </a>
                        {provider.telephones.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            +{provider.telephones.length - 1} autre{provider.telephones.length > 2 ? 's' : ''}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">Non disponible</span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm font-medium">
                    {formatDistance(provider.distance)}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {provider.coordonnees && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDirections(provider)}
                        title="Itinéraire"
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onProviderClick(provider.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
