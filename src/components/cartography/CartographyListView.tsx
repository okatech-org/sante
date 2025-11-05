import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartographyProvider } from "@/types/cartography";
import { useAuth } from "@/contexts/AuthContext";
import { handleAppointmentRedirect } from "@/utils/appointment-redirect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, Phone, Navigation, Eye, MapPin, Calendar, FileText, Stethoscope } from "lucide-react";
import { formatDistance } from "@/utils/distance";
import { cn } from "@/lib/utils";
import { standardizeAddress } from "@/utils/address-formatter";

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
  const navigate = useNavigate();
  const { user, userRoles } = useAuth();
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

  const getActionButtons = (provider: CartographyProvider) => {
    const hasAccount = provider.has_account ?? false;
    
    switch (provider.type) {
      case 'hopital':
      case 'clinique':
      case 'cabinet_medical':
      case 'cabinet_dentaire':
        return (
          <>
            {provider.telephones && provider.telephones.length > 0 && (
              <Button
                onClick={() => handleCall(provider.telephones[0])}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 h-8 text-xs"
              >
                <Phone className="h-3.5 w-3.5" />
                Appeler
              </Button>
            )}
            <Button
              onClick={() => hasAccount ? handleAppointmentRedirect({ user, userRoles, navigate, establishmentId: provider.id }) : null}
              variant={hasAccount ? "default" : "outline"}
              size="sm"
              disabled={!hasAccount}
              className={cn(
                "flex-1 gap-1.5 h-8 text-xs",
                !hasAccount && "opacity-50 cursor-not-allowed"
              )}
              title={!hasAccount ? "Cet établissement n'est pas encore inscrit sur la plateforme" : "Prendre rendez-vous"}
            >
              <Calendar className="h-3.5 w-3.5" />
              {hasAccount ? "Prendre RDV" : "Non inscrit"}
            </Button>
          </>
        );
      
      case 'pharmacie':
        return (
          <>
            {provider.telephones && provider.telephones.length > 0 && (
              <Button
                onClick={() => handleCall(provider.telephones[0])}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 h-8 text-xs"
              >
                <Phone className="h-3.5 w-3.5" />
                Appeler
              </Button>
            )}
            <Button
              onClick={() => hasAccount ? navigate(`/prescriptions/send?pharmacy=${provider.id}`) : null}
              variant={hasAccount ? "default" : "outline"}
              size="sm"
              disabled={!hasAccount}
              className={cn(
                "flex-1 gap-1.5 h-8 text-xs",
                !hasAccount && "opacity-50 cursor-not-allowed"
              )}
              title={!hasAccount ? "Cette pharmacie n'est pas encore inscrite sur la plateforme" : "Envoyer une ordonnance"}
            >
              <FileText className="h-3.5 w-3.5" />
              {hasAccount ? "Ordonnance" : "Non inscrit"}
            </Button>
          </>
        );
      
      case 'laboratoire':
      case 'imagerie':
        return (
          <>
            {provider.telephones && provider.telephones.length > 0 && (
              <Button
                onClick={() => handleCall(provider.telephones[0])}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 h-8 text-xs"
              >
                <Phone className="h-3.5 w-3.5" />
                Appeler
              </Button>
            )}
            <Button
              onClick={() => hasAccount ? handleAppointmentRedirect({ user, userRoles, navigate, establishmentId: provider.id }) : null}
              variant={hasAccount ? "default" : "outline"}
              size="sm"
              disabled={!hasAccount}
              className={cn(
                "flex-1 gap-1.5 h-8 text-xs",
                !hasAccount && "opacity-50 cursor-not-allowed"
              )}
              title={!hasAccount ? "Cet établissement n'est pas encore inscrit sur la plateforme" : "Réserver un examen"}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              {hasAccount ? "Réserver" : "Non inscrit"}
            </Button>
          </>
        );
      
      default:
        return (
          <>
            {provider.telephones && provider.telephones.length > 0 && (
              <Button
                onClick={() => handleCall(provider.telephones[0])}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 h-8 text-xs"
              >
                <Phone className="h-3.5 w-3.5" />
                Appeler
              </Button>
            )}
          </>
        );
    }
  };

  return (
    <>
      {/* Vue Mobile - Cards */}
      <div className="md:hidden space-y-2">
        {currentProviders.map((provider) => (
          <Card 
            key={provider.id} 
            className="p-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onProviderClick(provider.id)}
          >
            <div className="space-y-2">
              {/* Header avec type et nom */}
              <div className="flex items-start gap-2">
                <div className="text-2xl flex-shrink-0">
                  {TYPE_ICONS[provider.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-0.5">
                    {provider.nom}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {standardizeAddress(provider.adresse_descriptive, provider.ville, provider.province)}
                    </span>
                  </div>
                </div>
                {provider.distance && (
                  <div className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                    {formatDistance(provider.distance)}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1">
                {provider.ouvert_24_7 && (
                  <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-green-600">24/7</Badge>
                )}
                {provider.conventionnement.cnamgs && (
                  <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-blue-600">CNAMGS</Badge>
                )}
                {provider.equipements_specialises?.some(e => 
                  e.includes('IRM') || e.includes('Scanner')
                ) && (
                  <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-purple-600">
                    Imagerie
                  </Badge>
                )}
                {provider.has_account && (
                  <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-emerald-600">
                    ✓ Inscrit
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 pt-1">
                {getActionButtons(provider)}
                {provider.coordonnees && (
                  <Button
                    onClick={() => handleDirections(provider)}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 gap-1.5 h-8 text-xs px-2"
                    title="Voir l'itinéraire"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  onClick={() => onProviderClick(provider.id)}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 gap-1.5 h-8 text-xs px-2"
                  title="Voir les détails"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Vue Desktop - Table */}
      <Card className="w-full hidden md:block">
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
                      {(() => {
                        const formatted = standardizeAddress(provider.adresse_descriptive, provider.ville, provider.province);
                        return formatted.length > 40 ? formatted.substring(0, 40) + '...' : formatted;
                      })()}
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
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={cn(
          "p-3 md:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3",
          "md:rounded-b-lg bg-card"
        )}>
          <div className="text-xs md:text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none"
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 sm:flex-none"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
