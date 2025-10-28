import { useState, useEffect } from "react";
import { Video, Clock, Users, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { TeleconsultationsStats } from "@/components/professional/TeleconsultationsStats";
import { useTeleconsultations } from "@/hooks/useTeleconsultations";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export default function ProfessionalTeleconsultations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startingSession, setStartingSession] = useState(false);
  const [joiningSession, setJoiningSession] = useState<string | null>(null);
  
  const {
    loading,
    error,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
    stats,
    refetch
  } = useTeleconsultations();

  useEffect(() => {
    document.title = "Téléconsultations | Espace Professionnel - SANTE.GA";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Téléconsultations à distance via WebRTC, gestion des sessions vidéo et suivi patients.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.origin + '/professional/teleconsultations');
  }, []);

  const handleStartNewSession = async () => {
    try {
      setStartingSession(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: professional } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!professional) throw new Error("Profil professionnel non trouvé");

      const { data: session, error: sessionError } = await supabase
        .from('teleconsultation_sessions')
        .insert({
          professional_id: professional.id,
          patient_id: user.id,
          session_type: 'video',
          status: 'waiting',
          scheduled_time: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Session créée",
        description: "Salle d'attente virtuelle ouverte"
      });

      navigate(`/professional/teleconsultation/${session.id}`);
    } catch (err) {
      console.error('Error starting session:', err);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la session",
        variant: "destructive"
      });
    } finally {
      setStartingSession(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      setJoiningSession(sessionId);
      
      const { error: updateError } = await supabase
        .from('teleconsultation_sessions')
        .update({ 
          status: 'in_progress',
          start_time: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      navigate(`/professional/teleconsultation/${sessionId}`);
    } catch (err) {
      console.error('Error joining session:', err);
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre la session",
        variant: "destructive"
      });
    } finally {
      setJoiningSession(null);
    }
  };

  const handleViewDetails = (sessionId: string) => {
    navigate(`/professional/teleconsultation/${sessionId}`);
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Téléconsultations</h1>
            <p className="text-muted-foreground">Consultations à distance via WebRTC</p>
          </div>
          <Button onClick={handleStartNewSession} disabled={startingSession}>
            {startingSession ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Video className="mr-2 h-4 w-4" />
            )}
            Démarrer une session
          </Button>
        </div>

        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <TeleconsultationsStats 
            today={stats.today} 
            month={stats.month} 
            avgDuration={stats.avgDuration} 
            satisfaction={stats.satisfaction} 
          />
        </div>

        <Card className="border-primary/50 rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Salle d'attente virtuelle
            </CardTitle>
            <CardDescription>Patients en attente de connexion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun patient en attente actuellement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
          <CardHeader>
            <CardTitle>Mes téléconsultations</CardTitle>
            <CardDescription>Historique et consultations à venir</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">À venir ({upcomingSessions.length})</TabsTrigger>
                <TabsTrigger value="completed">Terminées ({completedSessions.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Annulées ({cancelledSessions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-3 mt-4">
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune téléconsultation à venir</p>
                  </div>
                ) : (
                  upcomingSessions.map((session) => {
                    const scheduledDate = new Date(session.scheduled_time);
                    return (
                      <div key={session.id} className="p-4 rounded-xl bg-card/80 border border-border shadow-sm hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 flex-1">
                            <div className="flex flex-col items-center justify-center min-w-[80px]">
                              <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                              <span className="font-semibold text-sm">
                                {scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {scheduledDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">
                                  {session.patient?.full_name || 'Patient'}
                                </h4>
                                <Badge variant="outline">
                                  <Video className="h-3 w-3 mr-1" />
                                  {session.session_type === 'video' ? 'Vidéo' : 'Audio'}
                                </Badge>
                                <Badge variant={session.status === 'waiting' ? 'default' : 'secondary'}>
                                  {session.status === 'waiting' ? 'En attente' : 'Planifiée'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {session.notes || 'Téléconsultation'}
                              </p>
                              {session.patient?.cnamgs_number && (
                                <p className="text-xs text-muted-foreground">
                                  CNAMGS: {session.patient.cnamgs_number}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleJoinSession(session.id)}
                            disabled={joiningSession === session.id}
                          >
                            {joiningSession === session.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Video className="mr-2 h-4 w-4" />
                            )}
                            Rejoindre
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3 mt-4">
                {completedSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune téléconsultation terminée</p>
                  </div>
                ) : (
                  completedSessions.map((session) => {
                    const scheduledDate = new Date(session.scheduled_time);
                    return (
                      <div 
                        key={session.id} 
                        className="p-4 rounded-xl bg-card/80 border border-border shadow-sm hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(session.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 flex-1">
                            <div className="flex flex-col items-center justify-center min-w-[80px]">
                              <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
                              <span className="font-semibold text-sm">
                                {scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {scheduledDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">
                                  {session.patient?.full_name || 'Patient'}
                                </h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {session.notes || 'Téléconsultation terminée'}
                              </p>
                              {session.duration_minutes && (
                                <p className="text-xs text-muted-foreground">
                                  Durée: {session.duration_minutes} min
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => handleViewDetails(session.id)}>
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="space-y-3 mt-4">
                {cancelledSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune téléconsultation annulée</p>
                  </div>
                ) : (
                  cancelledSessions.map((session) => {
                    const scheduledDate = new Date(session.scheduled_time);
                    return (
                      <div key={session.id} className="p-4 rounded-xl bg-card/80 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center min-w-[80px]">
                            <XCircle className="h-4 w-4 text-destructive mb-1" />
                            <span className="font-semibold text-sm">
                              {scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {scheduledDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                              {session.patient?.full_name || 'Patient'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {session.notes || 'Consultation annulée'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}
