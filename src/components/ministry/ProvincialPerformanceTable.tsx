import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProvincialPerformance } from "@/types/ministry";
import { MapPin, Star } from "lucide-react";

interface ProvincialPerformanceTableProps {
  performance: ProvincialPerformance[];
}

export const ProvincialPerformanceTable = ({ performance }: ProvincialPerformanceTableProps) => {
  const getOccupationColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const getSatisfactionBadge = (score: number) => {
    if (score >= 4.5) return 'default';
    if (score >= 4.0) return 'secondary';
    if (score >= 3.5) return 'outline';
    return 'destructive';
  };

  if (!performance || performance.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Performance Provinciale</CardTitle>
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucune donnée disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Performance Provinciale</CardTitle>
          <MapPin className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Province</TableHead>
                <TableHead className="text-center">Taux Occupation</TableHead>
                <TableHead className="text-center">Délai Moyen RDV</TableHead>
                <TableHead className="text-center">Satisfaction</TableHead>
                <TableHead className="text-right">Établissements</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performance.map((prov) => (
                <TableRow key={prov.province}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {prov.province}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${getOccupationColor(prov.taux_occupation_lits || 0)}`}>
                      {prov.taux_occupation_lits || 0}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{prov.delai_moyen_rdv || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{(prov.satisfaction_patients || 0).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">/5</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {prov.etablissements_actifs || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Total Établissements</p>
            <p className="text-xl font-bold text-blue-600">
              {performance.reduce((sum, p) => sum + (p.etablissements_actifs || 0), 0)}
            </p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Professionnels</p>
            <p className="text-xl font-bold text-green-600">
              {performance.reduce((sum, p) => sum + (p.professionnels_total || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Population Couverte</p>
            <p className="text-xl font-bold text-purple-600">
              {(performance.reduce((sum, p) => sum + (p.population_couverte || 0), 0) / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

