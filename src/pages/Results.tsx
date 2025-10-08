import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { 
  TestTube, 
  Download, 
  Share2, 
  Calendar, 
  User, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { toast } from "sonner";

interface ResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low";
}

interface MedicalResult {
  id: string;
  type: "blood" | "urine" | "imaging" | "biopsy" | "other";
  title: string;
  date: string;
  laboratory: string;
  doctor: string;
  status: "pending" | "available" | "viewed";
  category: string;
  urgent: boolean;
  results?: ResultItem[];
  conclusion?: string;
  recommendations?: string;
  imageUrl?: string;
}

const mockResults: MedicalResult[] = [
  {
    id: "RES-2024-012",
    type: "blood",
    title: "Bilan lipidique complet",
    date: "18/12/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Ondo",
    status: "available",
    category: "Analyses de sang",
    urgent: false,
    results: [
      { parameter: "Cholestérol total", value: "2.10", unit: "g/L", referenceRange: "< 2.0", status: "high" },
      { parameter: "HDL (bon cholestérol)", value: "0.55", unit: "g/L", referenceRange: "> 0.40", status: "normal" },
      { parameter: "LDL (mauvais cholestérol)", value: "1.35", unit: "g/L", referenceRange: "< 1.60", status: "normal" },
      { parameter: "Triglycérides", value: "1.20", unit: "g/L", referenceRange: "< 1.50", status: "normal" }
    ],
    conclusion: "Légère hypercholestérolémie. Cholestérol total légèrement élevé.",
    recommendations: "Surveillance diététique. Privilégier les acides gras insaturés. Contrôle dans 3 mois."
  },
  {
    id: "RES-2024-011",
    type: "blood",
    title: "Glycémie à jeun + HbA1c",
    date: "15/12/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Nzamba",
    status: "available",
    category: "Analyses de sang",
    urgent: false,
    results: [
      { parameter: "Glycémie à jeun", value: "1.15", unit: "g/L", referenceRange: "0.70 - 1.10", status: "high" },
      { parameter: "HbA1c", value: "6.2", unit: "%", referenceRange: "< 5.7", status: "high" }
    ],
    conclusion: "Hyperglycémie modérée. HbA1c limite supérieure.",
    recommendations: "Ajustement du traitement antidiabétique. Contrôle strict de l'alimentation. RDV médecin traitant."
  },
  {
    id: "RES-2024-010",
    type: "imaging",
    title: "Radiographie thoracique",
    date: "10/12/2024",
    laboratory: "Centre d'Imagerie Médicale",
    doctor: "Dr. Chambrier",
    status: "viewed",
    category: "Imagerie",
    urgent: false,
    conclusion: "Radiographie thoracique normale. Pas d'anomalie détectée. Champs pulmonaires clairs. Silhouette cardiaque normale.",
    recommendations: "Aucun suivi particulier nécessaire."
  },
  {
    id: "RES-2024-009",
    type: "blood",
    title: "NFS (Numération Formule Sanguine)",
    date: "05/12/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Nzamba",
    status: "viewed",
    category: "Analyses de sang",
    urgent: false,
    results: [
      { parameter: "Globules rouges", value: "4.8", unit: "M/mm³", referenceRange: "4.5 - 5.5", status: "normal" },
      { parameter: "Hémoglobine", value: "14.2", unit: "g/dL", referenceRange: "13.0 - 17.0", status: "normal" },
      { parameter: "Hématocrite", value: "42", unit: "%", referenceRange: "40 - 50", status: "normal" },
      { parameter: "Globules blancs", value: "7.2", unit: "K/mm³", referenceRange: "4.0 - 10.0", status: "normal" },
      { parameter: "Plaquettes", value: "250", unit: "K/mm³", referenceRange: "150 - 400", status: "normal" }
    ],
    conclusion: "NFS normale. Tous les paramètres dans les normes.",
    recommendations: "Aucune action requise."
  },
  {
    id: "RES-2024-008",
    type: "urine",
    title: "Analyse d'urine complète",
    date: "28/11/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Nzamba",
    status: "viewed",
    category: "Analyses d'urine",
    urgent: false,
    results: [
      { parameter: "pH", value: "6.0", unit: "", referenceRange: "5.0 - 7.0", status: "normal" },
      { parameter: "Protéines", value: "Négatif", unit: "", referenceRange: "Négatif", status: "normal" },
      { parameter: "Glucose", value: "Négatif", unit: "", referenceRange: "Négatif", status: "normal" },
      { parameter: "Leucocytes", value: "Négatif", unit: "", referenceRange: "Négatif", status: "normal" }
    ],
    conclusion: "Analyse d'urine normale. Absence d'infection urinaire.",
    recommendations: "Pas de suivi nécessaire."
  },
  {
    id: "RES-2024-007",
    type: "blood",
    title: "Bilan hépatique",
    date: "20/11/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Ondo",
    status: "pending",
    category: "Analyses de sang",
    urgent: true
  }
];

export default function Results() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedResult, setSelectedResult] = useState<MedicalResult | null>(null);

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.laboratory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = 
      selectedTab === "all" ||
      result.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  const availableResults = mockResults.filter(r => r.status === "available");
  const pendingResults = mockResults.filter(r => r.status === "pending");

  const handleDownload = (id: string) => {
    toast.success(`Téléchargement du résultat ${id}...`);
  };

  const handleShare = (id: string) => {
    toast.success(`Partage du résultat ${id}...`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success text-success-foreground">Disponible</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">En attente</Badge>;
      case "viewed":
        return <Badge variant="outline">Consulté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; className: string }> = {
      blood: { label: "Sang", className: "bg-destructive text-destructive-foreground" },
      urine: { label: "Urine", className: "bg-warning text-warning-foreground" },
      imaging: { label: "Imagerie", className: "bg-secondary text-secondary-foreground" },
      biopsy: { label: "Biopsie", className: "bg-accent text-accent-foreground" },
      other: { label: "Autre", className: "bg-muted text-muted-foreground" }
    };
    
    const typeInfo = types[type] || types.other;
    return <Badge className={typeInfo.className}>{typeInfo.label}</Badge>;
  };

  const getResultIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "high":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "low":
        return <TrendingDown className="h-4 w-4 text-secondary" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-8 bg-card/80 border border-border shadow-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mes Résultats d'Analyses</h1>
          <p className="text-muted-foreground mt-2">
            Consultez vos résultats d'examens médicaux et biologiques
          </p>
        </div>

              {/* Statistiques rapides */}
              <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Résultats disponibles</p>
                      <p className="text-2xl font-bold text-foreground">{availableResults.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">En attente</p>
                      <p className="text-2xl font-bold text-foreground">{pendingResults.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <TestTube className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-foreground">{mockResults.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par type, laboratoire ou numéro..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border">
                  <TabsList className="grid w-full grid-cols-4 bg-muted">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Tous ({mockResults.length})</TabsTrigger>
                    <TabsTrigger value="available" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Disponibles ({availableResults.length})</TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-warning/20 data-[state=active]:text-warning">En attente ({pendingResults.length})</TabsTrigger>
                    <TabsTrigger value="viewed" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">Consultés</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={selectedTab} className="space-y-4 mt-6">
                  {filteredResults.length === 0 ? (
                    <div className="rounded-xl backdrop-blur-xl p-12 text-center bg-card/80 border border-border">
                      <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Aucun résultat trouvé</h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? "Essayez avec d'autres termes de recherche"
                          : "Vous n'avez pas encore de résultats dans cette catégorie"}
                      </p>
                    </div>
                  ) : (
                    filteredResults.map((result) => (
                      <div key={result.id} className="rounded-xl backdrop-blur-xl p-6 bg-card/80 border border-border hover:bg-card/90 transition-all shadow-xl">
                        {/* En-tête */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              {result.type === "blood" && <TestTube className="h-6 w-6 text-primary" />}
                              {result.type === "imaging" && <Activity className="h-6 w-6 text-primary" />}
                              {result.type === "urine" && <TestTube className="h-6 w-6 text-primary" />}
                              {!["blood", "imaging", "urine"].includes(result.type) && <FileText className="h-6 w-6 text-primary" />}
                            </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-foreground">{result.title}</h3>
                              {getStatusBadge(result.status)}
                              {getTypeBadge(result.type)}
                              {result.urgent && (
                                <Badge variant="destructive" className="animate-pulse">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {result.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <TestTube className="h-4 w-4" />
                                {result.laboratory}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                Prescrit par {result.doctor}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShare(result.id)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(result.id)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Résultats disponibles */}
                      {result.status !== "pending" && (
                        <div className="space-y-3">
                          {result.results && result.results.length > 0 && (
                            <div className="border border-border rounded-lg p-4 bg-muted">
                              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Paramètres analysés
                              </h4>
                              <div className="space-y-2">
                                {result.results.map((item, index) => (
                                  <div 
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded bg-card/50"
                                  >
                                    <div className="flex items-center gap-2">
                                      {getResultIcon(item.status)}
                                      <span className="font-medium text-foreground">{item.parameter}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className={
                                        item.status === "high" ? "text-destructive font-semibold" :
                                        item.status === "low" ? "text-secondary font-semibold" :
                                        "text-foreground"
                                      }>
                                        {item.value} {item.unit}
                                      </span>
                                      <span className="text-muted-foreground">
                                        Norme: {item.referenceRange}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Conclusion */}
                          {result.conclusion && (
                            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">Conclusion:</span>{" "}
                                {result.conclusion}
                              </p>
                            </div>
                          )}

                          {/* Recommandations */}
                          {result.recommendations && (
                            <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-foreground">Recommandations:</span>{" "}
                                  {result.recommendations}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Bouton voir détails */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                                onClick={() => setSelectedResult(result)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails complets
                              </Button>
                            </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{result.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold">ID:</span> {result.id}
                              </div>
                              <div>
                                <span className="font-semibold">Date:</span> {result.date}
                              </div>
                              <div>
                                <span className="font-semibold">Laboratoire:</span> {result.laboratory}
                              </div>
                              <div>
                                <span className="font-semibold">Médecin:</span> {result.doctor}
                              </div>
                            </div>
                            {result.results && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">Résultats détaillés</h4>
                                <div className="space-y-2">
                                  {result.results.map((item, index) => (
                                    <div key={index} className="p-3 bg-accent rounded-lg">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium">{item.parameter}</span>
                                        {getResultIcon(item.status)}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Valeur: <span className="font-semibold text-foreground">{item.value} {item.unit}</span>
                                        {" | "}
                                        Norme: {item.referenceRange}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {result.conclusion && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Conclusion</h4>
                                <p className="text-sm">{result.conclusion}</p>
                              </div>
                            )}
                            {result.recommendations && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Recommandations</h4>
                                <p className="text-sm">{result.recommendations}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Message en attente */}
                  {result.status === "pending" && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                      <p className="font-semibold text-white">Résultat en cours de traitement</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Vous recevrez une notification dès que les résultats seront disponibles
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PatientDashboardLayout>
  );
}
