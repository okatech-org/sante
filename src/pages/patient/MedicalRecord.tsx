import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService, type MedicalRecord as MedicalRecordType } from "@/services/patientService";
import { generateMedicalRecordPDF } from "@/utils/pdfGenerator";
import { CNAMGSCard } from "@/components/medical/CNAMGSCard";
import { 
  FileHeart, Calendar, User, Building2, Stethoscope, 
  Pill, AlertCircle, FileText, ChevronRight, Loader2,
  Download, Search, Filter, Clock, Activity
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MedicalRecord() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecordType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordType | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  
  const patientName = (user?.user_metadata as any)?.full_name || 'Patient';

  // Charger le profil pour la carte CNAMGS
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      const profile = await patientService.getProfile(user.id);
      setProfileData(profile);
    };
    loadProfile();
  }, [user?.id]);

  useEffect(() => {
    const loadMedicalRecords = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const data = await patientService.getMedicalRecords(user.id);
        setRecords(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement du dossier médical');
      } finally {
        setLoading(false);
      }
    };

    loadMedicalRecords();
  }, [user?.id]);

  // Filtrer les records
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.establishment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || record.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Statistiques
  const stats = {
    total: records.length,
    consultations: records.filter(r => r.type === 'consultation').length,
    urgences: records.filter(r => r.type === 'urgence').length,
    hospitalisations: records.filter(r => r.type === 'hospitalisation').length,
    lastVisit: records[0]?.date
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'consultation': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'urgence': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'hospitalisation': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'chirurgie': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'consultation': return 'Consultation';
      case 'urgence': return 'Urgences';
      case 'hospitalisation': return 'Hospitalisation';
      case 'chirurgie': return 'Chirurgie';
      default: return type;
    }
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de votre dossier médical...</p>
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
            <FileHeart className="w-6 h-6 text-primary" />
            Mon Dossier Médical
          </h1>
          <p className="text-muted-foreground">Historique complet de vos consultations et soins</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total visites</p>
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
                  <p className="text-xs text-muted-foreground">Consultations</p>
                  <p className="text-2xl font-bold">{stats.consultations}</p>
                </div>
                <Stethoscope className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Urgences</p>
                  <p className="text-2xl font-bold">{stats.urgences}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Hospitalisations</p>
                  <p className="text-2xl font-bold">{stats.hospitalisations}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Dernière visite</p>
                  <p className="text-sm font-bold">
                    {stats.lastVisit ? 
                      new Date(stats.lastVisit).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 
                      'Aucune'
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte CNAMGS et Attestation */}
        {profileData && (
          <CNAMGSCard profile={profileData} />
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historique médical</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast.success("Génération de l'historique médical complet PDF...");
                  // TODO: Générer PDF avec tous les records
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par médecin, diagnostic, établissement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">Tous ({records.length})</TabsTrigger>
                  <TabsTrigger value="consultation">Consultations ({stats.consultations})</TabsTrigger>
                  <TabsTrigger value="urgence">Urgences ({stats.urgences})</TabsTrigger>
                  <TabsTrigger value="hospitalisation">Hospitalisations ({stats.hospitalisations})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucun enregistrement trouvé</p>
                </div>
              ) : (
                filteredRecords.map(record => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getTypeColor(record.type)}>
                            {getTypeLabel(record.type)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-foreground mb-1">
                          {record.doctor_name}
                        </h4>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          <Building2 className="w-3 h-3 inline mr-1" />
                          {record.establishment}
                        </p>
                        
                        {record.diagnosis && (
                          <p className="text-sm font-medium text-foreground">
                            Diagnostic : {record.diagnosis}
                          </p>
                        )}
                        
                        {record.symptoms && record.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {record.symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-card rounded-lg border p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails de la consultation</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(selectedRecord.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Médecin</p>
                <p className="font-medium">{selectedRecord.doctor_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Établissement</p>
                <p className="font-medium">{selectedRecord.establishment}</p>
              </div>

              {selectedRecord.diagnosis && (
                <div>
                  <p className="text-sm text-muted-foreground">Diagnostic</p>
                  <p className="font-medium">{selectedRecord.diagnosis}</p>
                </div>
              )}

              {selectedRecord.symptoms && selectedRecord.symptoms.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Symptômes</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.symptoms.map((symptom, idx) => (
                      <Badge key={idx} variant="secondary">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.treatment && (
                <div>
                  <p className="text-sm text-muted-foreground">Traitement</p>
                  <p className="font-medium">{selectedRecord.treatment}</p>
                </div>
              )}

              {selectedRecord.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedRecord.notes}</p>
                </div>
              )}

              {selectedRecord.follow_up_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Prochain rendez-vous</p>
                  <p className="font-medium">
                    {new Date(selectedRecord.follow_up_date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                Fermer
              </Button>
              <Button onClick={() => generateMedicalRecordPDF(selectedRecord, patientName)}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      )}
    </PatientDashboardLayout>
  );
}
