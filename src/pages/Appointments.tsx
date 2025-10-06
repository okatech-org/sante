import { useState } from "react";
import { PatientSidebar } from "@/components/layout/PatientSidebar";
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
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl backdrop-blur-xl p-8 bg-[#1a1f2e]/80 border border-white/10">
          <Calendar className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-white">Aucun rendez-vous prévu</h3>
          <p className="text-gray-400 mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingAppointments.map((appointment) => (
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
    );
  };

  const renderPast = () => {
    if (pastAppointments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl backdrop-blur-xl p-8 bg-[#1a1f2e]/80 border border-white/10">
          <Calendar className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-white">Aucun historique</h3>
          <p className="text-gray-400">
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
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl backdrop-blur-xl p-8 bg-[#1a1f2e]/80 border border-white/10">
          <X className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-white">Aucune annulation</h3>
          <p className="text-gray-400">
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
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />
      <main className="flex-1 md:ml-0 pt-20 md:pt-6 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mes Rendez-vous</h1>
                <p className="text-muted-foreground mt-1">Gérez vos consultations médicales</p>
              </div>
              <Button 
                size="default"
                onClick={() => setBookingModalOpen(true)} 
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Plus className="mr-2 h-5 w-5" />
                Nouveau RDV
              </Button>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="px-4 py-2 bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-0">
                <Calendar className="mr-2 h-4 w-4" />
                {upcomingAppointments.length} à venir
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                <Calendar className="mr-2 h-4 w-4" />
                {pastAppointments.length} passés
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-pink-100 text-pink-700 hover:bg-pink-200 border-0">
                <X className="mr-2 h-4 w-4" />
                {cancelledAppointments.length} annulés
              </Badge>
            </div>
          </div>

          {/* Tabs & Filters */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="rounded-2xl bg-card border border-border shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <TabsList className="bg-muted w-full sm:w-auto">
                  <TabsTrigger value="upcoming" className="relative flex-1 sm:flex-none data-[state=active]:bg-background data-[state=active]:text-foreground">
                    À venir
                    {upcomingAppointments.length > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-cyan-500 text-white hover:bg-cyan-600">
                        {upcomingAppointments.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex-1 sm:flex-none data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Passés
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="flex-1 sm:flex-none data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Annulés
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="flex-1 sm:w-[180px] bg-background border-input">
                      <Filter className="h-4 w-4 mr-2" />
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
                    <SelectTrigger className="flex-1 sm:w-[180px] bg-background border-input">
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
        </div>
      </main>
    </div>
  );
}
