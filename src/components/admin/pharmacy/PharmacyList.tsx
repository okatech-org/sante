import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Shield, Eye } from 'lucide-react';
import type { Pharmacie } from '@/types/pharmacy';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PharmacyListProps {
  pharmacies: Pharmacie[];
  onPharmacyClick: (pharmacy: Pharmacie) => void;
}

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800' },
  verifie: { label: 'Vérifiée', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
  refuse: { label: 'Refusée', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
  suspendu: { label: 'Suspendue', variant: 'outline' as const, color: 'bg-yellow-100 text-yellow-800' },
};

export function PharmacyList({ pharmacies, onPharmacyClick }: PharmacyListProps) {
  if (pharmacies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune pharmacie trouvée</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Pharmacie</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Créée le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pharmacies.map((pharmacy) => {
            const statusConfig = STATUS_CONFIG[pharmacy.statut_verification];
            return (
              <TableRow key={pharmacy.id} className="hover:bg-muted/50">
                <TableCell>
                  <span className="font-mono text-sm">{pharmacy.code_pharmacie}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{pharmacy.nom_commercial}</p>
                    {pharmacy.enseigne && (
                      <p className="text-sm text-muted-foreground">{pharmacy.enseigne}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p>{pharmacy.ville}</p>
                      <p className="text-muted-foreground">{pharmacy.province}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{pharmacy.telephone_principal}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pharmacy.ouvert_24_7 && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        24/7
                      </Badge>
                    )}
                    {pharmacy.conventionnement_cnamgs && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        CNAMGS
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(pharmacy.created_at), 'dd MMM yyyy', { locale: fr })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPharmacyClick(pharmacy)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Détails
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
