import { useState } from "react";
import { useMedicaments, useClassesTherapeutiques, useMedicamentStats } from "@/hooks/useMedicaments";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Pill, Package, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const MedicamentsList = () => {
  const [search, setSearch] = useState("");
  const [classeFilter, setClasseFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data: statsData } = useMedicamentStats();
  const { data: classes } = useClassesTherapeutiques();
  const { data, isLoading, error } = useMedicaments({
    limit,
    offset: page * limit,
    search: search || undefined,
    classe_therapeutique: classeFilter || undefined,
  });

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return `${price.toLocaleString("fr-FR")} FCFA`;
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Erreur de chargement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Impossible de charger les médicaments"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Médicaments référencés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.actifs || 0}</div>
            <p className="text-xs text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Génériques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.generiques || 0}</div>
            <p className="text-xs text-muted-foreground">Médicaments génériques</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Sur ordonnance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.avec_ordonnance || 0}</div>
            <p className="text-xs text-muted-foreground">Nécessitent prescription</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher des médicaments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, DCI ou code CIP..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={classeFilter}
              onValueChange={(value) => {
                setClasseFilter(value);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Classe thérapeutique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les classes</SelectItem>
                {classes?.map((classe) => (
                  <SelectItem key={classe} value={classe}>
                    {classe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des médicaments */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des médicaments ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data?.medicaments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Aucun médicament trouvé</p>
              <p className="text-sm text-muted-foreground mt-2">
                Essayez d'ajuster vos filtres de recherche
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom commercial</TableHead>
                    <TableHead>DCI</TableHead>
                    <TableHead>Forme</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Tarif CNAMGS</TableHead>
                    <TableHead>Prix moyen</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.medicaments.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-medium">
                        {med.nom_commercial || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {med.dci || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {med.forme_pharmaceutique || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {med.dosage || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {med.classe_therapeutique || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatPrice(med.tarif_conventionne_cnamgs)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatPrice(med.prix_moyen_pharmacie)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {med.est_generique && (
                            <Badge variant="secondary" className="text-xs">
                              Générique
                            </Badge>
                          )}
                          {med.necessite_ordonnance && (
                            <Badge variant="outline" className="text-xs">
                              Ord.
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page + 1} sur {Math.ceil((data?.total || 0) / limit)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil((data?.total || 0) / limit) - 1}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
