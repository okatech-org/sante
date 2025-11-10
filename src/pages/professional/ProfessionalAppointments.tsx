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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            Agenda & Rendez-vous
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-13">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtres</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Stats Cards - Improved Design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.today}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Confirmés</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Annulés</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Semaine</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.thisWeek}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Ce mois</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.thisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs - Improved Design */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1 h-auto">
            <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-background">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendrier</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-background">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2 data-[state=active]:bg-background">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'list' && (
            <div className="flex items-center gap-2">
              <div className="relative w-64 hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
        </div>

        <TabsContent value="calendar" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendrier mensuel - Enhanced Visual Hierarchy */}
            <Card className="lg:col-span-1 p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 animate-fade-in backdrop-blur-sm bg-card/95">
              <div className="space-y-5">
                <div className="flex items-start justify-between pb-5 border-b-2 border-border">
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-extrabold flex items-center gap-3 text-foreground">
                      <Calendar className="h-7 w-7 text-primary" />
                      Calendrier
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium pl-10">
                      Sélectionnez une date
                    </p>
                  </div>
                  <Badge variant="secondary" className="gap-2 px-4 py-2 font-bold shadow-md text-base">
                    <Clock className="h-4 w-4" />
                    {appointments.length}
                  </Badge>
                </div>
                
                <div className="p-3 rounded-2xl bg-muted/40 transition-all duration-300 hover:bg-muted/50">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    locale={fr}
                    className="rounded-xl border-0 pointer-events-auto w-full [&_button]:transition-all [&_button]:duration-200 [&_.rdp-caption]:text-lg [&_.rdp-caption]:font-bold [&_.rdp-day]:text-base [&_.rdp-day]:font-medium"
                    modifiers={{
                      today: new Date(),
                      hasAppointments: daysWithAppointments
                    }}
                    modifiersClassNames={{
                      today: 'bg-accent text-accent-foreground font-black ring-[3px] ring-accent ring-offset-2 shadow-lg scale-110 text-lg',
                      hasAppointments: 'relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:rounded-full after:bg-primary after:shadow-md font-bold hover:after:scale-125 after:ring-1 after:ring-primary/50'
                    }}
                  />
                </div>

                <div className="space-y-3 pt-5 border-t-2 border-border">
                  <p className="text-sm font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></span>
                    Légende
                    <span className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></span>
                  </p>
                  <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3 text-sm font-semibold group cursor-default hover:translate-x-1 transition-transform duration-200">
                      <div className="w-5 h-5 rounded-full bg-accent ring-[3px] ring-accent ring-offset-2 ring-offset-background shadow-md"></div>
                      <span className="text-foreground/90 group-hover:text-foreground">Aujourd'hui</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold group cursor-default hover:translate-x-1 transition-transform duration-200">
                      <div className="w-5 h-5 rounded-full bg-primary shadow-lg"></div>
                      <span className="text-foreground/90 group-hover:text-foreground">Jour sélectionné</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold group cursor-default hover:translate-x-1 transition-transform duration-200">
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shadow-md bg-background">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      </div>
                      <span className="text-foreground/90 group-hover:text-foreground">Jours avec rendez-vous</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Liste des rendez-vous du jour sélectionné - Enhanced Visual Hierarchy */}
            <Card className="lg:col-span-2 p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 animate-fade-in backdrop-blur-sm bg-card/95">
              <div className="space-y-6">
                <div className="flex items-start justify-between pb-5 border-b-2 border-border">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold capitalize text-foreground">
                      {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2.5 bg-primary/15 px-4 py-2 rounded-full border-2 border-primary/30">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="text-base font-bold text-primary">
                          {selectedDayAppointments.length} rendez-vous
                        </span>
                      </div>
                      {selectedDayAppointments.length > 0 && (
                        <Badge variant="outline" className="gap-1.5 font-semibold px-3 py-1.5 text-sm">
                          {selectedDayAppointments.filter(a => a.status === 'confirmed').length} confirmés
                        </Badge>
                      )}
                    </div>
                  </div>
                  {selectedDayAppointments.length > 0 && (
                    <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-bold">
                      <Plus className="h-5 w-5" />
                      Ajouter
                    </Button>
                  )}
                </div>

                {selectedDayAppointments.length === 0 ? (
                  <div className="text-center py-20 space-y-6 animate-fade-in">
                    <div className="relative mx-auto w-24 h-24">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse"></div>
                      <div className="relative h-full w-full rounded-full bg-muted/40 backdrop-blur-sm flex items-center justify-center border-2 border-border/50">
                        <Calendar className="h-12 w-12 text-muted-foreground/60" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-foreground/80">Aucun rendez-vous ce jour</p>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Votre agenda est libre pour cette journée. Profitez-en pour planifier de nouveaux rendez-vous.
                      </p>
                    </div>
                    <Button className="gap-2 mt-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <Plus className="h-4 w-4" />
                      Créer un rendez-vous
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedDayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((apt, index) => {
                        const statusBadge = getStatusBadge(apt.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                          <div
                            key={apt.id}
                            className={`group relative p-6 rounded-2xl border-l-[6px] transition-all duration-300 cursor-pointer animate-fade-in backdrop-blur-sm ${
                              apt.status === 'confirmed' 
                                ? 'border-l-green-500 bg-gradient-to-r from-green-50/70 via-green-50/30 to-transparent hover:from-green-50 hover:shadow-green-500/20 dark:from-green-950/30 dark:via-green-950/15 dark:hover:from-green-950/40' 
                                : apt.status === 'pending' 
                                ? 'border-l-orange-500 bg-gradient-to-r from-orange-50/70 via-orange-50/30 to-transparent hover:from-orange-50 hover:shadow-orange-500/20 dark:from-orange-950/30 dark:via-orange-950/15 dark:hover:from-orange-950/40'
                                : apt.status === 'cancelled' 
                                ? 'border-l-red-500 bg-gradient-to-r from-red-50/70 via-red-50/30 to-transparent hover:from-red-50 hover:shadow-red-500/20 dark:from-red-950/30 dark:via-red-950/15 dark:hover:from-red-950/40'
                                : 'border-l-gray-500 bg-gradient-to-r from-gray-50/70 via-gray-50/30 to-transparent hover:from-gray-50 hover:shadow-gray-500/20 dark:from-gray-950/30 dark:via-gray-950/15 dark:hover:from-gray-950/40'
                            } hover:shadow-xl hover:scale-[1.02] border-2 border-border/50 hover:border-border`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex-1 space-y-4">
                                {/* En-tête avec heure et statut */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <div className="flex items-center gap-2.5 bg-gradient-to-br from-primary/10 to-primary/5 px-4 py-2 rounded-xl border-2 border-primary/20 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
                                    <Clock className="h-5 w-5 text-primary animate-pulse" />
                                    <span className="font-bold text-lg tracking-tight">{apt.time}</span>
                                    <div className="w-px h-4 bg-border"></div>
                                    <span className="text-sm text-muted-foreground font-medium">
                                      {apt.duration} min
                                    </span>
                                  </div>
                                  <Badge variant={statusBadge.variant} className="gap-2 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                                    <StatusIcon className="h-4 w-4" />
                                    {statusBadge.label}
                                  </Badge>
                                  {apt.isNew && (
                                    <Badge className="bg-gradient-to-r from-primary/15 to-accent/15 text-primary hover:from-primary/25 hover:to-accent/25 px-3 py-1.5 shadow-sm animate-pulse">
                                      ✨ Nouveau
                                    </Badge>
                                  )}
                                </div>

                                {/* Informations patient - HIÉRARCHIE VISUELLE PRINCIPALE */}
                                <div className="space-y-3 py-2">
                                  <h4 className="font-extrabold text-3xl leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                                    {apt.patient}
                                  </h4>
                                  <div className="flex items-center gap-2.5 bg-background/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border-2 border-border/60 w-fit shadow-sm">
                                    <Video className="h-5 w-5 text-primary" />
                                    <span className="text-base font-bold text-foreground/90">{apt.type}</span>
                                  </div>
                                </div>

                                {/* Coordonnées */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex items-center gap-3 text-foreground bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-border/60 hover:border-primary/50 transition-all duration-200 hover:shadow-lg group/contact">
                                    <Phone className="h-5 w-5 shrink-0 text-primary group-hover/contact:scale-110 transition-transform" />
                                    <span className="truncate font-semibold text-base">{apt.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-foreground bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-border/60 hover:border-primary/50 transition-all duration-200 hover:shadow-lg group/location">
                                    <MapPin className="h-5 w-5 shrink-0 text-primary group-hover/location:scale-110 transition-transform" />
                                    <span className="truncate font-semibold text-base">{apt.location}</span>
                                  </div>
                                </div>

                                {/* Notes */}
                                {apt.notes && (
                                  <div className="p-4 bg-gradient-to-br from-muted/70 to-muted/50 backdrop-blur-sm rounded-xl border-2 border-border/60 flex gap-3 hover:shadow-lg transition-all duration-200">
                                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-foreground/90 font-semibold leading-relaxed">{apt.notes}</span>
                                  </div>
                                )}
                              </div>

                              {/* Actions - Enhanced Buttons */}
                              <div className="flex flex-col gap-3 shrink-0">
                                {apt.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="lg" 
                                      className="gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-bold text-base px-6"
                                      onClick={() => handleConfirmAppointment(apt.id)}
                                    >
                                      <CheckCircle className="h-5 w-5" />
                                      <span className="hidden sm:inline">Confirmer</span>
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
                                      onClick={() => openCancelDialog(apt.id)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      <span className="hidden sm:inline">Annuler</span>
                                    </Button>
                                  </>
                                )}
                                {apt.status === 'confirmed' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="gap-2"
                                    >
                                      <User className="h-4 w-4" />
                                      <span className="hidden sm:inline">Détails</span>
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
                                      onClick={() => openCancelDialog(apt.id)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      <span className="hidden sm:inline">Annuler</span>
                                    </Button>
                                  </>
                                )}
                                {apt.status === 'cancelled' && (
                                  <Badge variant="outline" className="gap-1">
                                    <XCircle className="h-3 w-3" />
                                    Annulé
                                  </Badge>
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
          {/* Search - Mobile */}
          <Card className="p-4 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un patient..."
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
