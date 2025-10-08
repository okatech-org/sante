import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Heart, Activity, Pill, Download, Share2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConsultationDetailsModal } from "@/components/medical/ConsultationDetailsModal";
import { HealthBooklet } from "@/components/medical/HealthBooklet";
import { VaccinationBooklet } from "@/components/medical/VaccinationBooklet";
import { CNAMGSCard } from "@/components/medical/CNAMGSCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";

interface MedicalHistory {
  id: string;
  condition_name: string;
  diagnosed_date: string | null;
  status: string;
  notes: string | null;
}

interface Treatment {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  status: string;
  start_date: string;
  end_date: string | null;
}

interface Consultation {
  id: string;
  consultation_date: string;
  consultation_type: string;
  doctor_name: string;
  reason: string;
  diagnosis: string | null;
  notes: string | null;
  documents: any;
}

export default function MedicalRecord() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      loadMedicalData();
    }
  }, [user?.id]);

  const loadMedicalData = async () => {
    try {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      
      if (profileData) setProfile(profileData);

      const { data: historyData, error: historyError } = await supabase
        .from('medical_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('diagnosed_date', { ascending: false });

      if (historyError) throw historyError;
      setMedicalHistory(historyData || []);

      const { data: treatmentsData, error: treatmentsError } = await supabase
        .from('treatments')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .order('start_date', { ascending: false });

      if (treatmentsError) throw treatmentsError;
      setTreatments(treatmentsData || []);

      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user!.id)
        .order('consultation_date', { ascending: false });

      if (consultationsError) throw consultationsError;
      setConsultations(consultationsData || []);

    } catch (error) {
      console.error('Error loading medical data:', error);
      toast.error("Erreur lors du chargement des données médicales");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Actif</Badge>;
      case 'chronic':
        return <Badge>Chronique</Badge>;
      case 'resolved':
        return <Badge variant="outline">Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setModalOpen(true);
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mon Dossier Médical</h1>
                <p className="text-muted-foreground mt-2">
                  Accédez à l'historique complet de votre parcours de santé
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="text-2xl font-bold text-foreground">{profile?.full_name || 'N/A'}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Consultations</p>
                    <p className="text-2xl font-bold text-foreground">{consultations.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Antécédents</p>
                    <p className="text-2xl font-bold text-foreground">{medicalHistory.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Carnets numériques */}
            <div className="space-y-6">
              <HealthBooklet 
                profile={profile}
                medicalHistory={medicalHistory}
                treatments={treatments}
                consultations={consultations}
              />
              
            <div className="grid gap-6 md:grid-cols-2">
                <VaccinationBooklet profile={profile} />
                <CNAMGSCard profile={profile} />
              </div>
            </div>

                <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold text-foreground">Antécédents Médicaux</h2>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {medicalHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun antécédent médical enregistré
                    </p>
                  ) : (
                    medicalHistory.map((item) => (
                      <div key={item.id} className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.condition_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.diagnosed_date
                              ? `Diagnostiqué le ${format(new Date(item.diagnosed_date), "dd/MM/yyyy", { locale: fr })}`
                              : 'Date inconnue'}
                          </p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="h-5 w-5 text-secondary" />
                  <h2 className="text-xl font-semibold text-foreground">Traitements en Cours</h2>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {treatments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun traitement en cours
                    </p>
                  ) : (
                    treatments.map((treatment) => (
                      <div key={treatment.id} className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{treatment.medication_name} {treatment.dosage}</p>
                          <p className="text-sm text-muted-foreground">{treatment.frequency}</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">Actif</Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-warning" />
                <h2 className="text-xl font-semibold text-foreground">Historique des Consultations</h2>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-4">
                {consultations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucune consultation enregistrée
                  </p>
                ) : (
                  consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {format(new Date(consultation.consultation_date), "dd/MM/yyyy", { locale: fr })}
                          </span>
                          <Badge variant="outline">
                            {consultation.consultation_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{consultation.doctor_name}</p>
                        <p className="text-sm mt-1 text-foreground/80">{consultation.reason}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewConsultation(consultation)}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}
      </div>

      <ConsultationDetailsModal
        consultation={selectedConsultation}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </PatientDashboardLayout>
  );
}
