import { useState } from "react";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar, X, Filter, ChevronRight } from "lucide-react";
import { AppointmentCard, Appointment } from "@/components/appointments/AppointmentCard";
import { CancelAppointmentModal } from "@/components/appointments/CancelAppointmentModal";
import { BookingModal } from "@/components/appointments/BookingModal";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: new Date(),
    timeSlot: "10:00 - 10:30",
    type: "consultation",
    status: "upcoming",
    provider: {
      name: "Dr KOMBILA Pierre",
      specialty: "Cardiologue",
    },
    reason: "Contrôle tension artérielle",
    location: "Cabinet Montagne Sainte, Libreville",
    payment: {
      status: "paid",
      amount: 9000,
      method: "mobile-money",
    },
  },
  {
    id: "2",
    date: addDays(new Date(), 5),
    timeSlot: "15:30 - 16:00",
    type: "telemedicine",
    status: "upcoming",
    provider: {
      name: "Dr AFONSO",
      specialty: "Médecin généraliste",
    },
    reason: "Renouvellement ordonnance",
    payment: {
      status: "unpaid",
      amount: 15000,
      method: "on-site",
    },
  },
  {
    id: "3",
    date: addDays(new Date(), 12),
    timeSlot: "09:00 - 09:30",
    type: "exam",
    status: "upcoming",
    provider: {
      name: "BIOLAB Libreville",
      specialty: "Laboratoire d'analyses",
    },
    reason: "Bilan sanguin (Glycémie + Lipidique)",
    location: "Centre-ville, Imm. Sonagar",
    prescribedBy: "Dr KOMBILA Pierre",
    instructions: "À jeun obligatoire (12h)",
    payment: {
      status: "paid",
      amount: 4600,
    },
  },
  {
    id: "4",
    date: new Date(new Date().setDate(10)),
    timeSlot: "10:30 - 11:00",
    type: "consultation",
    status: "past",
    provider: {
      name: "Dr KOMBILA Pierre",
      specialty: "Cardiologie",
    },
    reason: "Consultation",
    payment: {
      status: "paid",
      amount: 9000,
    },
    documents: [
      { type: "report", label: "Compte-rendu" },
      { type: "prescription", label: "Ordonnance disponible" },
    ],
  },
  {
    id: "5",
    date: new Date(new Date().setDate(5)),
    timeSlot: "08:00 - 08:30",
    type: "exam",
    status: "past",
    provider: {
      name: "BIOLAB Libreville",
      specialty: "Bilan sanguin",
    },
    reason: "Bilan sanguin",
    payment: {
      status: "paid",
      amount: 5000,
    },
    documents: [
      { type: "results", label: "Résultats disponibles" },
    ],
  },
  {
    id: "6",
    date: new Date(new Date().setDate(28)),
    timeSlot: "14:00 - 14:30",
    type: "consultation",
    status: "cancelled",
    provider: {
      name: "Dr NGOMA Lise",
      specialty: "Gynécologie",
    },
    reason: "Consultation de routine",
    payment: {
      status: "paid",
      amount: 20000,
    },
    cancellation: {
      date: new Date(new Date().setDate(27)),
      by: "patient",
      refund: 10000,
      refundStatus: "completed",
    },
  },
];

export default function Appointments() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [typeFilter, setTypeFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");

  const upcomingAppointments = mockAppointments.filter((a) => a.status === "upcoming");
  const pastAppointments = mockAppointments.filter((a) => a.status === "past");
  const cancelledAppointments = mockAppointments.filter((a) => a.status === "cancelled");

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason: string, details?: string) => {
    toast.success("Rendez-vous annulé avec succès");
    console.log("Cancellation:", { reason, details });
    setCancelModalOpen(false);
    setSelectedAppointment(null);
  };

  const handlePay = (appointment: Appointment) => {
    toast.info("Redirection vers le paiement...");
    console.log("Payment for:", appointment);
  };

  const handleCall = (appointment: Appointment) => {
    toast.info("Appel en cours...");
    console.log("Calling:", appointment);
  };

  const handleGetDirections = (appointment: Appointment) => {
    toast.info("Ouverture de Google Maps...");
    console.log("Directions to:", appointment);
  };

  const groupByDate = (appointments: Appointment[]) => {
    const groups: { [key: string]: Appointment[] } = {};
    appointments.forEach((apt) => {
      const dateKey = format(new Date(apt.date), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(apt);
    });
    return groups;
  };

  const groupByMonth = (appointments: Appointment[]) => {
    const groups: { [key: string]: Appointment[] } = {};
    appointments.forEach((apt) => {
      const monthKey = format(new Date(apt.date), "MMMM yyyy", { locale: fr });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(apt);
    });
    return groups;
  };

  const renderUpcoming = () => {
    if (upcomingAppointments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-card border border-border p-8">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Aucun rendez-vous prévu</h3>
          <p className="text-muted-foreground mb-6">
            Vous n'avez aucun rendez-vous à venir pour le moment
          </p>
          <Button onClick={() => setBookingModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Trouver un praticien
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Prochain rendez-vous */}
        <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-800 p-6 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">Prochain Rendez-vous</h3>
          </div>
          <AppointmentCard
            appointment={upcomingAppointments[0]}
            onCancel={() => handleCancelAppointment(upcomingAppointments[0])}
            onPay={() => handlePay(upcomingAppointments[0])}
            onCall={() => handleCall(upcomingAppointments[0])}
            onGetDirections={() => handleGetDirections(upcomingAppointments[0])}
          />
        </div>

        {/* Autres rendez-vous */}
        {upcomingAppointments.length > 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Autres rendez-vous à venir</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.slice(1).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={() => handleCancelAppointment(appointment)}
                  onPay={() => handlePay(appointment)}
                  onCall={() => handleCall(appointment)}
                  onGetDirections={() => handleGetDirections(appointment)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPast = () => {
    if (pastAppointments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-card border border-border p-8">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Aucun historique</h3>
          <p className="text-muted-foreground">
            Vous n'avez aucun rendez-vous passé pour le moment
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pastAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            variant="compact"
          />
        ))}
      </div>
    );
  };

  const renderCancelled = () => {
    if (cancelledAppointments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-card border border-border p-8">
          <X className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Aucune annulation</h3>
          <p className="text-muted-foreground">
            Vous n'avez annulé aucun rendez-vous
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cancelledAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            variant="compact"
          />
        ))}
      </div>
    );
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mes Rendez-vous</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gérez vos consultations médicales</p>
            </div>
            <Button 
              size="sm" 
              onClick={() => setBookingModalOpen(true)} 
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sm:inline">Nouveau RDV</span>
            </Button>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Badge variant="outline" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800">
              {upcomingAppointments.length} à venir
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
              {pastAppointments.length} passés
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-800">
              {cancelledAppointments.length} annulés
            </Badge>
          </div>
        </div>

        {/* Tabs & Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <TabsList className="bg-muted w-full sm:w-auto">
                <TabsTrigger value="upcoming" className="relative flex-1 sm:flex-none text-xs sm:text-sm">
                  À venir
                  {upcomingAppointments.length > 0 && (
                    <Badge className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs">
                      {upcomingAppointments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1 sm:flex-none text-xs sm:text-sm">Passés</TabsTrigger>
                <TabsTrigger value="cancelled" className="flex-1 sm:flex-none text-xs sm:text-sm">Annulés</TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="flex-1 sm:w-[150px] lg:w-[180px] bg-background border-input text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="telemedicine">Téléconsultation</SelectItem>
                    <SelectItem value="exam">Examen</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger className="flex-1 sm:w-[150px] lg:w-[180px] bg-background border-input text-xs sm:text-sm">
                    <SelectValue placeholder="Praticien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les praticiens</SelectItem>
                    <SelectItem value="kombila">Dr KOMBILA Pierre</SelectItem>
                    <SelectItem value="afonso">Dr AFONSO</SelectItem>
                    <SelectItem value="biolab">BIOLAB Libreville</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsContent value="upcoming" className="space-y-6">
            {renderUpcoming()}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {renderPast()}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {renderCancelled()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <BookingModal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
      <CancelAppointmentModal
        open={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onConfirm={handleConfirmCancel}
      />
    </PatientDashboardLayout>
  );
}
