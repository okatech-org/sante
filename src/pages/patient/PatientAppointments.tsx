import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService, type Appointment } from "@/services/patientService";
import { BookingModal } from "@/components/appointments/BookingModal";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { 
  Calendar, Clock, MapPin, User, Building2, 
  Plus, Search, Filter, Loader2, ChevronRight,
  AlertCircle, CheckCircle, XCircle, Phone, Mail
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PatientAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setProvider } = useAppointmentStore();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Vérifier si on doit ouvrir le modal de prise de RDV
  useEffect(() => {
    const providerId = searchParams.get('provider');
    if (providerId) {
      // Créer un provider temporaire pour CMST SOGARA
      if (providerId === 'cmst-sogara') {
        setProvider({
          id: 'cmst-sogara',
          name: 'CMST SOGARA',
          avatar: '/logo_sogara.png',
          specialty: 'Centre Médical',
          phone: '+241 01 55 26 21',
          location: 'Port-Gentil',
          address: 'Route de la Sogara, Port-Gentil',
          consultationPrice: 30000,
          cnamgsPrice: 25000,
          cnamgsConventioned: true,
          onlineBooking: true,
          rating: 4.8,
          consultations: 150
        } as any);
        setShowBookingModal(true);
        
        // Nettoyer l'URL
        navigate('/appointments', { replace: true });
      }
      
      // Créer un provider temporaire pour Dr Démo
      if (providerId === 'dr-demo-cabinet-001') {
        setProvider({
          id: 'dr-demo-cabinet-001',
          name: 'Dr. Démo',
          avatar: null,
          specialty: 'Médecine Générale',
          phone: '+241 01 23 45 67',
          location: 'Libreville',
          address: 'Boulevard Triomphal, Louis, 1er Arrondissement',
          consultationPrice: 25000,
          cnamgsPrice: 20000,
          cnamgsConventioned: true,
          onlineBooking: true,
          rating: 5.0,
          consultations: 999
        } as any);
        setShowBookingModal(true);
        
        // Nettoyer l'URL
        navigate('/appointments', { replace: true });
      }
    }
  }, [searchParams, setProvider, navigate]);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const data = await patientService.getAppointments(user.id);
        setAppointments(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [user?.id]);

  // Séparer les rendez-vous futurs et passés
  const now = new Date();
  const upcomingAppointments = appointments.filter(apt => 
    new Date(`${apt.date}T${apt.time}`) > now
  );
  const pastAppointments = appointments.filter(apt => 
    new Date(`${apt.date}T${apt.time}`) <= now
  );

  // Filtrer les rendez-vous
  const filterAppointments = (appointmentsList: Appointment[]) => {
    return appointmentsList.filter(apt => {
      const matchesSearch = 
        apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.establishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'pending': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const success = await patientService.cancelAppointment(appointmentId);
      if (success) {
        toast.success('Rendez-vous annulé avec succès');
        // Mettre à jour l'état local
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: 'cancelled' as const }
              : apt
          )
        );
      } else {
        toast.error('Erreur lors de l\'annulation');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'annulation du rendez-vous');
    }
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos rendez-vous...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Mes Rendez-vous
            </h1>
            <p className="text-muted-foreground">Gérez vos rendez-vous médicaux</p>
          </div>
          <Button onClick={() => setShowBookingModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">À venir</p>
                  <p className="text-2xl font-bold text-green-600">
                    {upcomingAppointments.filter(a => a.status === 'confirmed').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {appointments.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Passés</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {pastAppointments.length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Annulés</p>
                  <p className="text-2xl font-bold text-red-600">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tous les rendez-vous</CardTitle>
              <div className="flex gap-2">
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
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="past">Passés</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {filterAppointments(upcomingAppointments).length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucun rendez-vous à venir</p>
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Prendre rendez-vous
                    </Button>
                  </div>
                ) : (
                  filterAppointments(upcomingAppointments).map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                      onSelect={setSelectedAppointment}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {filterAppointments(pastAppointments).length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucun rendez-vous passé</p>
                  </div>
                ) : (
                  filterAppointments(pastAppointments).map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                      onSelect={setSelectedAppointment}
                      isPast
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modal de prise de rendez-vous */}
      <BookingModal 
        open={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
      />
    </PatientDashboardLayout>
  );
}

// Composant pour afficher une carte de rendez-vous
function AppointmentCard({ 
  appointment, 
  onCancel, 
  onSelect,
  isPast = false 
}: { 
  appointment: Appointment; 
  onCancel: (id: string) => void;
  onSelect: (apt: Appointment) => void;
  isPast?: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'pending': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
        isPast ? 'opacity-75' : ''
      }`}
      onClick={() => onSelect(appointment)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={getStatusColor(appointment.status)}>
              {getStatusLabel(appointment.status)}
            </Badge>
            <Badge variant="outline">
              {appointment.type === 'teleconsultation' ? 'Téléconsultation' : 'Consultation'}
            </Badge>
          </div>
          
          <h4 className="font-semibold text-foreground mb-1">
            {appointment.doctor_name}
          </h4>
          
          <p className="text-sm text-muted-foreground mb-1">
            {appointment.speciality}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {appointment.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {appointment.establishment}
            </span>
          </div>
          
          {appointment.reason && (
            <p className="text-sm mt-2">
              <span className="font-medium">Motif :</span> {appointment.reason}
            </p>
          )}
        </div>
        
        {!isPast && appointment.status === 'confirmed' && (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(appointment.id);
              }}
            >
              Annuler
            </Button>
          </div>
        )}
        
        <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
      </div>
    </div>
  );
}
