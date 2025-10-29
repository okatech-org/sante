import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService, type LabResult } from "@/services/patientService";
import { generateLabResultPDF } from "@/utils/pdfGenerator";
import { 
  Activity, Calendar, Building2, Download, 
  Search, Loader2, ChevronRight, CheckCircle,
  AlertCircle, Clock, FileText, TrendingUp,
  TrendingDown, Minus
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PatientLabResults() {
  const { user } = useAuth();
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  
  const patientName = (user?.user_metadata as any)?.full_name || 'Patient';

  useEffect(() => {
    const loadLabResults = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const data = await patientService.getLabResults(user.id);
        setResults(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des résultats');
      } finally {
        setLoading(false);
      }
    };

    loadLabResults();
  }, [user?.id]);

  // Filtrer les résultats
  const filteredResults = results.filter(result => {
    const searchLower = searchTerm.toLowerCase();
    return (
      result.laboratory.toLowerCase().includes(searchLower) ||
      result.doctor_name?.toLowerCase().includes(searchLower) ||
      result.tests.some(test => test.name.toLowerCase().includes(searchLower))
    );
  });

  // Statistiques
  const stats = {
    total: results.length,
    pending: results.filter(r => r.status === 'pending').length,
    complete: results.filter(r => r.status === 'complete').length,
    abnormal: results.reduce((count, r) => 
      count + r.tests.filter(t => t.status === 'abnormal' || t.status === 'critical').length, 0
    )
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      blood: 'Analyse de sang',
      urine: 'Analyse d\'urine',
      radiology: 'Radiologie',
      scanner: 'Scanner',
      irm: 'IRM',
      other: 'Autre'
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'abnormal': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'abnormal': return <AlertCircle className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos résultats d'analyses...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Résultats d'Analyses
          </h1>
          <p className="text-muted-foreground">Consultez vos résultats de laboratoire et d'imagerie</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{stats.complete}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Valeurs anormales</p>
                  <p className="text-2xl font-bold text-red-600">{stats.abnormal}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des résultats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tous les résultats</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
                <TabsTrigger value="complete">Disponibles ({stats.complete})</TabsTrigger>
                <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucun résultat trouvé</p>
                  </div>
                ) : (
                  filteredResults.map(result => (
                    <LabResultCard
                      key={result.id}
                      result={result}
                      onSelect={setSelectedResult}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="complete" className="space-y-4">
                {filteredResults.filter(r => r.status === 'complete').map(result => (
                  <LabResultCard
                    key={result.id}
                    result={result}
                    onSelect={setSelectedResult}
                  />
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {filteredResults.filter(r => r.status === 'pending').map(result => (
                  <LabResultCard
                    key={result.id}
                    result={result}
                    onSelect={setSelectedResult}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedResult && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResult(null)}
        >
          <div 
            className="bg-card rounded-lg border p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails des résultats</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date de l'analyse</p>
                <p className="font-medium">
                  {new Date(selectedResult.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Laboratoire</p>
                <p className="font-medium">{selectedResult.laboratory}</p>
              </div>

              {selectedResult.doctor_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Médecin prescripteur</p>
                  <p className="font-medium">{selectedResult.doctor_name}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Type d'analyse</p>
                <p className="font-medium">{getTypeLabel(selectedResult.type)}</p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-3">Résultats détaillés</p>
                <div className="space-y-2">
                  {selectedResult.tests.map((test, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 ${
                      test.status === 'critical' ? 'border-red-500 bg-red-500/10' :
                      test.status === 'abnormal' ? 'border-orange-500 bg-orange-500/10' :
                      'bg-muted/30'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{test.name}</h4>
                            <Badge variant="outline" className={getStatusColor(test.status)}>
                              {getStatusIcon(test.status)}
                              <span className="ml-1">
                                {test.status === 'normal' ? 'Normal' :
                                 test.status === 'abnormal' ? 'Anormal' :
                                 test.status === 'critical' ? 'Critique' : 'Inconnu'}
                              </span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                              <span className="text-muted-foreground">Valeur:</span>
                              <span className="ml-2 font-bold">{test.value} {test.unit}</span>
                            </div>
                            {test.normal_range && (
                              <div>
                                <span className="text-muted-foreground">Normale:</span>
                                <span className="ml-2 font-medium">{test.normal_range} {test.unit}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedResult.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedResult.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedResult(null)}>
                Fermer
              </Button>
              <Button onClick={() => generateLabResultPDF(selectedResult, patientName)}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </PatientDashboardLayout>
  );
}

// Composant carte de résultat
function LabResultCard({ 
  result, 
  onSelect 
}: { 
  result: LabResult; 
  onSelect: (result: LabResult) => void;
}) {
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      blood: 'Analyse de sang',
      urine: 'Analyse d\'urine',
      radiology: 'Radiologie',
      scanner: 'Scanner',
      irm: 'IRM',
      other: 'Autre'
    };
    return types[type] || type;
  };

  const hasAbnormal = result.tests.some(t => t.status === 'abnormal' || t.status === 'critical');

  return (
    <div
      className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
        hasAbnormal ? 'border-orange-500/50' : ''
      }`}
      onClick={() => onSelect(result)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              {getTypeLabel(result.type)}
            </Badge>
            {result.status === 'pending' && (
              <Badge variant="outline" className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                <Clock className="w-3 h-3 mr-1" />
                En attente
              </Badge>
            )}
            {hasAbnormal && (
              <Badge variant="outline" className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                <AlertCircle className="w-3 h-3 mr-1" />
                Valeur(s) anormale(s)
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {new Date(result.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <h4 className="font-semibold text-foreground mb-1">
            {result.laboratory}
          </h4>
          
          {result.doctor_name && (
            <p className="text-sm text-muted-foreground mb-2">
              Prescrit par {result.doctor_name}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {result.tests.map((test, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className={`text-xs ${
                  test.status === 'abnormal' ? 'bg-orange-100 text-orange-700' :
                  test.status === 'critical' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}
              >
                {test.name}: {test.value} {test.unit}
              </Badge>
            ))}
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
}
