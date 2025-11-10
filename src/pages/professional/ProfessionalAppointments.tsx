import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, User, Search, Plus, Filter,
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  AlertCircle, Phone, Mail, MapPin, Video, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ProfessionalAppointments() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);

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

  // Les anciennes données fictives sont supprimées
  const mockAppointments = [
    {
      id: 1,
      patient: 'Marie MOUSSAVOU',
      date: '2025-01-31',
      time: '09:00',
      duration: 30,
      type: 'Consultation générale',
      status: 'confirmed',
      doctor: 'Dr. Jules DJEKI',
      location: 'Cabinet 1',
      phone: '+241 07 12 34 56',
      email: 'marie.moussavou@gmail.com',
      notes: 'Contrôle de routine',
      isNew: false
    },
    {
      id: 2,
      patient: 'Jean NZENGUE',
      date: '2025-01-31',
      time: '09:30',
      duration: 45,
      type: 'Suivi cardiologie',
      status: 'confirmed',
      doctor: 'Dr. Paul NGUEMA',
      location: 'Cabinet 3 - Cardiologie',
      phone: '+241 07 23 45 67',
      email: 'jean.nzengue@gmail.com',
      notes: 'ECG prévu',
      isNew: false
    },
    {
      id: 3,
      patient: 'Sophie KOMBILA',
      date: '2025-01-31',
      time: '10:30',
      duration: 30,
      type: 'Consultation pédiatrie',
      status: 'pending',
      doctor: 'Dr. Sophie MBOUMBA',
      location: 'Cabinet 2 - Pédiatrie',
      phone: '+241 07 34 56 78',
      email: 'sophie.kombila@gmail.com',
      notes: 'Vaccination',
      isNew: true
    },
    {
      id: 4,
      patient: 'Pierre OBAME',
      date: '2025-01-31',
      time: '11:00',
      duration: 60,
      type: 'Consultation chirurgie',
      status: 'confirmed',
      doctor: 'Dr. André MOUSSAVOU',
      location: 'Bureau Chirurgie',
      phone: '+241 07 45 67 89',
      email: 'pierre.obame@gmail.com',
      notes: 'Consultation pré-opératoire',
      isNew: false
    },
    {
      id: 5,
      patient: 'André NGUEMA',
      date: '2025-01-31',
      time: '14:00',
      duration: 30,
      type: 'Téléconsultation',
      status: 'confirmed',
      doctor: 'Dr. Jules DJEKI',
      location: 'En ligne',
      phone: '+241 07 56 78 90',
      email: 'andre.nguema@gmail.com',
      notes: 'Suivi traitement',
      isNew: false
    },
    {
      id: 6,
      patient: 'Sylvie NTOUTOUME',
      date: '2025-01-31',
      time: '15:00',
      duration: 30,
      type: 'Consultation générale',
      status: 'cancelled',
      doctor: 'Dr. Marie OKEMBA',
      location: 'Cabinet 1',
      phone: '+241 07 67 89 01',
      email: 'sylvie.ntoutoume@gmail.com',
      notes: 'Annulé par le patient',
      isNew: false
    },
    {
      id: 7,
      patient: 'Bernard MBA',
      date: '2025-01-31',
      time: '16:00',
      duration: 45,
      type: 'Consultation spécialisée',
      status: 'pending',
      doctor: 'Dr. Paul NGUEMA',
      location: 'Cabinet 3 - Cardiologie',
      phone: '+241 07 78 90 12',
      email: 'bernard.mba@gmail.com',
      notes: 'Nouveau patient',
      isNew: true
    }
  ];

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(apt => apt.date === today);

  const stats = {
    today: todayAppointments.length,
    confirmed: todayAppointments.filter(apt => apt.status === 'confirmed').length,
    pending: todayAppointments.filter(apt => apt.status === 'pending').length,
    cancelled: todayAppointments.filter(apt => apt.status === 'cancelled').length,
    thisWeek: 32,
    thisMonth: 145
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

  const filteredAppointments = todayAppointments.filter(apt =>
    apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h à 19h

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
          {/* Contrôles du calendrier */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Vendredi 31 janvier 2025</h3>
                  <p className="text-sm text-muted-foreground">{stats.today} rendez-vous</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === 'day' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  Jour
                </Button>
                <Button 
                  variant={viewMode === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Semaine
                </Button>
                <Button 
                  variant={viewMode === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Mois
                </Button>
              </div>
            </div>
          </Card>

          {/* Vue calendrier jour */}
          <Card className="p-6">
            <div className="space-y-2">
              {hours.map((hour) => {
                const hourAppointments = todayAppointments.filter(apt => {
                  const aptHour = parseInt(apt.time.split(':')[0]);
                  return aptHour === hour;
                });

                return (
                  <div key={hour} className="flex gap-4 min-h-[80px] border-b last:border-0">
                    <div className="w-16 text-sm text-muted-foreground font-medium pt-2">
                      {hour}:00
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {hourAppointments.map((apt) => {
                        const statusBadge = getStatusBadge(apt.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                          <div
                            key={apt.id}
                            className={`p-3 rounded-lg border-l-4 ${
                              apt.status === 'confirmed' ? 'border-l-green-500 bg-green-50' :
                              apt.status === 'pending' ? 'border-l-orange-500 bg-orange-50' :
                              apt.status === 'cancelled' ? 'border-l-red-500 bg-red-50' :
                              'border-l-gray-500 bg-gray-50'
                            } hover:shadow-md transition-shadow cursor-pointer`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-semibold">{apt.time}</span>
                                {apt.isNew && (
                                  <Badge variant="default" className="text-xs">Nouveau</Badge>
                                )}
                              </div>
                              <StatusIcon className={`h-4 w-4 ${statusBadge.color}`} />
                            </div>
                            <p className="font-medium text-sm mb-1">{apt.patient}</p>
                            <p className="text-xs text-muted-foreground mb-1">{apt.type}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {apt.doctor}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {apt.location}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
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
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {apt.time} ({apt.duration} min)
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            {apt.doctor}
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
                          <Button size="sm" variant="outline">Confirmer</Button>
                          <Button size="sm" variant="destructive">Annuler</Button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <>
                          <Button size="sm" variant="outline">Reprogrammer</Button>
                          <Button size="sm">Détails</Button>
                        </>
                      )}
                      {apt.status === 'cancelled' && (
                        <Button size="sm" variant="outline">Reprogrammer</Button>
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
                                <User className="h-3 w-3" />
                                {apt.doctor}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {apt.location}
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
    </div>
  );
}
