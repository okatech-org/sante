import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinistryReport } from "@/types/ministry";
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Calendar,
  User,
  Lock,
  Unlock
} from "lucide-react";

export const PublicationsReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const mockReports: MinistryReport[] = [
    {
      id: "rep-001",
      titre: "Rapport Annuel de Performance du Système de Santé - 2024",
      type: "annuel",
      categorie: "Performance",
      description: "Analyse complète de la performance du système de santé gabonais en 2024",
      auteur: "Direction Générale de la Santé",
      date_publication: "2025-01-15",
      periode_couverte: {
        debut: "2024-01-01",
        fin: "2024-12-31"
      },
      fichier_url: "/reports/rapport-annuel-2024.pdf",
      fichier_taille: "12.5 MB",
      format: "pdf",
      tags: ["Performance", "Statistiques", "PNDS", "Indicateurs"],
      telechargements: 342,
      confidentialite: "public"
    },
    {
      id: "rep-002",
      titre: "Bulletin Épidémiologique T3 2025",
      type: "trimestriel",
      categorie: "Épidémiologie",
      description: "Surveillance des maladies prioritaires au 3ème trimestre 2025",
      auteur: "Division de la Surveillance Épidémiologique",
      date_publication: "2025-10-05",
      periode_couverte: {
        debut: "2025-07-01",
        fin: "2025-09-30"
      },
      fichier_url: "/reports/bulletin-epi-t3-2025.pdf",
      fichier_taille: "4.2 MB",
      format: "pdf",
      tags: ["Épidémiologie", "Paludisme", "VIH", "Tuberculose", "COVID-19"],
      telechargements: 156,
      confidentialite: "public"
    },
    {
      id: "rep-003",
      titre: "Évaluation du Programme National de Santé Maternelle",
      type: "evaluation_programme",
      categorie: "Programmes",
      description: "Évaluation à mi-parcours du programme de santé maternelle et infantile",
      auteur: "Unité de Coordination PNDS",
      date_publication: "2025-06-20",
      periode_couverte: {
        debut: "2024-01-01",
        fin: "2025-06-30"
      },
      fichier_url: "/reports/eval-sante-maternelle-2025.pdf",
      fichier_taille: "8.7 MB",
      format: "pdf",
      tags: ["Santé Maternelle", "Évaluation", "Indicateurs", "Mortalité"],
      telechargements: 89,
      confidentialite: "restreint"
    },
    {
      id: "rep-004",
      titre: "Statistiques Sanitaires Nationales 2024",
      type: "annuel",
      categorie: "Statistiques",
      description: "Compilation des statistiques sanitaires de tous les établissements du Gabon",
      auteur: "Direction des Statistiques Sanitaires",
      date_publication: "2025-03-10",
      periode_couverte: {
        debut: "2024-01-01",
        fin: "2024-12-31"
      },
      fichier_url: "/reports/stats-nationales-2024.pdf",
      fichier_taille: "15.3 MB",
      format: "pdf",
      tags: ["Statistiques", "Données", "Établissements", "Ressources Humaines"],
      telechargements: 278,
      confidentialite: "public"
    },
    {
      id: "rep-005",
      titre: "Rapport Spécial: Déploiement Télémédecine SANTE.GA",
      type: "special",
      categorie: "Innovation",
      description: "Bilan du déploiement de la plateforme de télémédecine sur le territoire national",
      auteur: "Direction des Systèmes d'Information Sanitaire",
      date_publication: "2025-09-15",
      periode_couverte: {
        debut: "2024-06-01",
        fin: "2025-08-31"
      },
      fichier_url: "/reports/telemedicine-deployment-2025.pdf",
      fichier_taille: "6.8 MB",
      format: "pdf",
      tags: ["Télémédecine", "Innovation", "Digital", "Accès aux soins"],
      telechargements: 432,
      confidentialite: "public"
    },
    {
      id: "rep-006",
      titre: "Rapport Confidentiel: Financement Santé et Arriérés CNAMGS",
      type: "special",
      categorie: "Finances",
      description: "Analyse détaillée du financement de la santé et des arriérés de paiement",
      auteur: "Direction des Affaires Financières",
      date_publication: "2025-07-01",
      periode_couverte: {
        debut: "2023-01-01",
        fin: "2025-06-30"
      },
      fichier_url: "/reports/finances-confidential-2025.pdf",
      fichier_taille: "10.2 MB",
      format: "pdf",
      tags: ["Finances", "CNAMGS", "Budget", "Arriérés"],
      telechargements: 23,
      confidentialite: "confidentiel"
    }
  ];

  const [reports] = useState<MinistryReport[]>(mockReports);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || report.type === selectedType;
    const matchesYear = selectedYear === "all" || 
                       new Date(report.date_publication).getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesType && matchesYear;
  });

  const getTypeColor = (type: MinistryReport['type']) => {
    switch(type) {
      case 'annuel': return 'default';
      case 'trimestriel': return 'secondary';
      case 'special': return 'outline';
      case 'evaluation_programme': return 'default';
      case 'epidemiologique': return 'destructive';
    }
  };

  const getTypeLabel = (type: MinistryReport['type']) => {
    switch(type) {
      case 'annuel': return 'Annuel';
      case 'trimestriel': return 'Trimestriel';
      case 'special': return 'Spécial';
      case 'evaluation_programme': return 'Évaluation Programme';
      case 'epidemiologique': return 'Épidémiologique';
    }
  };

  const getConfidentialityIcon = (level: MinistryReport['confidentialite']) => {
    switch(level) {
      case 'public': return Unlock;
      case 'restreint': return Lock;
      case 'confidentiel': return Lock;
    }
  };

  const getConfidentialityColor = (level: MinistryReport['confidentialite']) => {
    switch(level) {
      case 'public': return 'text-green-600';
      case 'restreint': return 'text-orange-600';
      case 'confidentiel': return 'text-red-600';
    }
  };

  const totalDownloads = reports.reduce((sum, r) => sum + r.telechargements, 0);
  const publicReports = reports.filter(r => r.confidentialite === 'public').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Publications et Rapports
            </CardTitle>
            <Button>
              + Publier un Rapport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Rapports</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{reports.length}</div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Unlock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Publics</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{publicReports}</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Téléchargements</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">{totalDownloads}</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Cette Année</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {reports.filter(r => new Date(r.date_publication).getFullYear() === 2025).length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un rapport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="annuel">Annuel</SelectItem>
                <SelectItem value="trimestriel">Trimestriel</SelectItem>
                <SelectItem value="special">Spécial</SelectItem>
                <SelectItem value="evaluation_programme">Évaluation Programme</SelectItem>
                <SelectItem value="epidemiologique">Épidémiologique</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes années</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun rapport trouvé avec ces critères</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const ConfIcon = getConfidentialityIcon(report.confidentialite);
                const confColor = getConfidentialityColor(report.confidentialite);
                
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold flex-1">{report.titre}</h3>
                              <ConfIcon className={`h-5 w-5 ${confColor} flex-shrink-0 ml-2`} />
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant={getTypeColor(report.type)}>
                                {getTypeLabel(report.type)}
                              </Badge>
                              <Badge variant="outline">{report.categorie}</Badge>
                              <Badge variant="outline" className={confColor}>
                                {report.confidentialite.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">
                              {report.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {report.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{report.auteur}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(report.date_publication).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{report.telechargements} téléchargements</span>
                            </div>
                            <div>
                              <span>Taille: {report.fichier_taille}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Consulter
                            </Button>
                            {report.confidentialite === 'public' && (
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            )}
                            {report.confidentialite !== 'public' && (
                              <Button size="sm" variant="outline" disabled>
                                <Lock className="h-4 w-4 mr-2" />
                                Accès Restreint
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

