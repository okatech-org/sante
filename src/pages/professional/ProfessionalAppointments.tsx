import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, Clock, User, Search, Plus, Filter,
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  AlertCircle, Phone, Mail, MapPin, Video, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProfessionalAppointments() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Charger l'ID du professionnel et les rendez-vous
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      try {
        // Récupérer l'ID du professionnel
        const { data: professional, error: profError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profError) throw profError;
        
        if (!professional) {
          toast.error("Profil professionnel non trouvé");
          return;
        }

        setProfessionalId(professional.id);

        // Charger les rendez-vous
        const { data: appointmentsData, error: aptsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('professional_id', professional.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (aptsError) throw aptsError;

        // Transformer les données pour correspondre au format attendu
        const transformedData = (appointmentsData || []).map(apt => ({
          id: apt.id,
          patient: apt.patient_name || 'Patient inconnu',
          date: apt.appointment_date,
          time: apt.appointment_time,
          duration: apt.duration_minutes || 30,
          type: apt.appointment_type === 'teleconsultation' ? 'Téléconsultation' : 'Consultation générale',
          status: apt.status === 'scheduled' ? 'confirmed' : apt.status,
          location: 'Cabinet médical',
          phone: apt.patient_phone || '',
          email: apt.patient_email || '',
          notes: apt.reason || apt.notes || '',
          isNew: false
        }));

        setAppointments(transformedData);
      } catch (error: any) {
        console.error('Erreur chargement données:', error);
        toast.error('Erreur lors du chargement des rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Fonction pour confirmer un rendez-vous
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId);

      if (error) throw error;

      // Mettre à jour l'état local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'confirmed' }
            : apt
        )
      );

      toast.success("Rendez-vous confirmé avec succès");
    } catch (error: any) {
      console.error('Erreur confirmation:', error);
      toast.error("Erreur lors de la confirmation du rendez-vous");
    }
  };

  // Fonction pour annuler un rendez-vous
  const handleCancelAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancelled_by: user?.id
        })
        .eq('id', selectedAppointmentId);

      if (error) throw error;

      // Mettre à jour l'état local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointmentId 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );

      toast.success("Rendez-vous annulé avec succès");
      setCancelDialogOpen(false);
      setSelectedAppointmentId(null);
    } catch (error: any) {
      console.error('Erreur annulation:', error);
      toast.error("Erreur lors de l'annulation du rendez-vous");
    }
  };

  const openCancelDialog = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setCancelDialogOpen(true);
  };

  // Récupérer les rendez-vous du jour sélectionné
  const selectedDayAppointments = appointments.filter(apt => 
    isSameDay(new Date(apt.date), selectedDate)
  );

  // Trouver tous les jours qui ont des rendez-vous
  const daysWithAppointments = appointments.map(apt => new Date(apt.date));

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(apt => apt.date === today);

  // Calculer les statistiques réelles
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
  });

  const stats = {
    today: todayAppointments.length,
    confirmed: todayAppointments.filter(apt => apt.status === 'confirmed').length,
    pending: todayAppointments.filter(apt => apt.status === 'pending').length,
    cancelled: todayAppointments.filter(apt => apt.status === 'cancelled').length,
    thisWeek: appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      return aptDate >= weekStart && aptDate < weekEnd;
    }).length,
    thisMonth: monthAppointments.length
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      confirmed: { label: 'Confirmé', variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'En attente', variant: 'default' as const, icon: AlertCircle, color: 'text-orange-600' },
      cancelled: { label: 'Annulé', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      completed: { label: 'Terminé', variant: 'outline' as const, icon: CheckCircle, color: 'text-gray-600' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getTypeColor = (type: string) => {
    if (type.includes('Téléconsultation')) return 'bg-purple-100 text-purple-700';
    if (type.includes('Urgence')) return 'bg-red-100 text-red-700';
    if (type.includes('Suivi')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Agenda & Rendez-vous
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des rendez-vous du CMST SOGARA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              <p className="text-2xl font-bold">{stats.today}</p>
            </div>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Confirmés</p>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Annulés</p>
              <p className="text-2xl font-bold">{stats.cancelled}</p>
            </div>
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
              <p className="text-2xl font-bold">{stats.thisWeek}</p>
            </div>
            <Calendar className="h-6 w-6 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
            </div>
            <Calendar className="h-6 w-6 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendrier mensuel */}
            <Card className="lg:col-span-1 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Calendrier</h3>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez une date pour voir les rendez-vous
                  </p>
                </div>
                
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={fr}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    hasAppointments: daysWithAppointments
                  }}
                  modifiersClassNames={{
                    hasAppointments: 'bg-primary/10 font-bold text-primary'
                  }}
                />

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded bg-primary/10 border border-primary/20"></div>
                    <span className="text-muted-foreground">Jours avec RDV</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <span className="text-muted-foreground">Jour sélectionné</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Liste des rendez-vous du jour sélectionné */}
            <Card className="lg:col-span-2 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDayAppointments.length} rendez-vous
                  </p>
                </div>

                {selectedDayAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun rendez-vous ce jour</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((apt) => {
                        const statusBadge = getStatusBadge(apt.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                          <div
                            key={apt.id}
                            className={`p-4 rounded-lg border-l-4 ${
                              apt.status === 'confirmed' ? 'border-l-green-500 bg-green-50/50' :
                              apt.status === 'pending' ? 'border-l-orange-500 bg-orange-50/50' :
                              apt.status === 'cancelled' ? 'border-l-red-500 bg-red-50/50' :
                              'border-l-gray-500 bg-gray-50/50'
                            } hover:shadow-md transition-shadow`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-semibold">{apt.time}</span>
                                    <span className="text-sm text-muted-foreground">
                                      ({apt.duration} min)
                                    </span>
                                  </div>
                                  <Badge variant={statusBadge.variant} className="gap-1">
                                    <StatusIcon className="h-3 w-3" />
                                    {statusBadge.label}
                                  </Badge>
                                  {apt.isNew && (
                                    <Badge variant="default">Nouveau</Badge>
                                  )}
                                </div>

                                <h4 className="font-semibold mb-1">{apt.patient}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{apt.type}</p>

                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {apt.phone}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {apt.location}
                                  </div>
                                </div>

                                {apt.notes && (
                                  <div className="mt-2 p-2 bg-background/50 rounded text-sm">
                                    <FileText className="h-3 w-3 inline mr-1" />
                                    {apt.notes}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2 ml-4">
                                {apt.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleConfirmAppointment(apt.id)}
                                    >
                                      Confirmer
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => openCancelDialog(apt.id)}
                                    >
                                      Annuler
                                    </Button>
                                  </>
                                )}
                                {apt.status === 'confirmed' && (
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => openCancelDialog(apt.id)}
                                  >
                                    Annuler
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par patient, médecin ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Liste des RDV */}
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const statusBadge = getStatusBadge(apt.status);
              const StatusIcon = statusBadge.icon;

              return (
                <Card key={apt.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{apt.patient}</h3>
                          <Badge variant={statusBadge.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {statusBadge.label}
                          </Badge>
                          <Badge className={getTypeColor(apt.type)}>
                            {apt.type}
                          </Badge>
                          {apt.isNew && (
                            <Badge variant="default">Nouveau</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {apt.time} ({apt.duration} min)
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {apt.location}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {apt.phone}
                          </div>
                        </div>

                        {apt.notes && (
                          <div className="mt-3 p-2 bg-muted/30 rounded text-sm">
                            <FileText className="h-3 w-3 inline mr-1" />
                            {apt.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleConfirmAppointment(apt.id)}
                          >
                            Confirmer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => openCancelDialog(apt.id)}
                          >
                            Annuler
                          </Button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => openCancelDialog(apt.id)}
                          >
                            Annuler
                          </Button>
                          <Button size="sm">Détails</Button>
                        </>
                      )}
                      {apt.status === 'cancelled' && (
                        <Button size="sm" variant="outline" disabled>
                          Annulé
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Timeline du jour</h3>
            <div className="relative">
              {/* Timeline vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-6">
                {todayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((apt, index) => {
                  const statusBadge = getStatusBadge(apt.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <div key={apt.id} className="flex gap-4 relative">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                        apt.status === 'confirmed' ? 'bg-green-100' :
                        apt.status === 'pending' ? 'bg-orange-100' :
                        'bg-red-100'
                      }`}>
                        <StatusIcon className={`h-6 w-6 ${statusBadge.color}`} />
                      </div>
                      
                      <Card className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{apt.time}</span>
                              <Badge variant="outline">{apt.duration} min</Badge>
                            </div>
                             <h4 className="font-semibold">{apt.patient}</h4>
                            <p className="text-sm text-muted-foreground">{apt.type}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {apt.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {apt.phone}
                              </span>
                            </div>
                          </div>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmation d'annulation */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne peut pas être annulée.
              Le patient sera notifié de l'annulation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelAppointment}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
