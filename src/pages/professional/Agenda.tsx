import { useState } from "react";
import { Calendar, Clock, Video, Users, DollarSign, Stethoscope, Camera, ChevronRight, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentModal } from "@/components/professional/AppointmentModal";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfessionalAgenda() {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const { user } = useAuth();

  const appointments = [
    {
      id: 1,
      time: "08:30",
      patient: "Marie MOUSSAVOU",
      type: "cabinet",
      reason: "Consultation diabète",
      status: "confirmé",
      cnamgs: "GAB123456789"
    },
    {
      id: 2,
      time: "09:30",
      patient: "Jean NZENGUE",
      type: "teleconsultation",
      reason: "Suivi hypertension",
      status: "confirmé",
      cnamgs: "GAB987654321"
    },
    {
      id: 3,
      time: "10:00",
      patient: "Claire OBAME",
      type: "cabinet",
      reason: "Douleurs abdominales",
      status: "en_attente",
      cnamgs: null
    },
    {
      id: 4,
      time: "11:00",
      patient: "Paul MINTSA",
      type: "domicile",
      reason: "Visite post-opératoire",
      status: "confirmé",
      cnamgs: "GAB456789123"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "teleconsultation": return <Video className="h-4 w-4" />;
      case "domicile": return <Home className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmé": return "bg-green-500/10 text-green-500";
      case "en_attente": return "bg-yellow-500/10 text-yellow-500";
      case "annulé": return "bg-red-500/10 text-red-500";
      default: return "bg-muted";
    }
  };

  const fullName = (user?.user_metadata as any)?.full_name || 'Dr. Pierre KOMBILA';
  const profession = (user?.user_metadata as any)?.profession || 'Médecin';
  const specialty = (user?.user_metadata as any)?.specialty || 'Cardiologie';
  const orderNumber = (user?.user_metadata as any)?.order_number || 'Non renseigné';

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header Card avec profil médecin */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-4xl font-bold text-foreground border-4 border-primary/50 shadow-lg">
                    {fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{fullName.toUpperCase()}</h1>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Profession</p>
                      <p className="text-lg font-semibold text-foreground">{profession}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spécialité</p>
                      <p className="text-lg font-semibold text-foreground">{specialty}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Numéro d'ordre</p>
                    <p className="text-lg font-semibold text-foreground">{orderNumber}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl">
                Modifier
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-cyan-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Patients</p>
            <p className="text-3xl font-bold text-foreground mb-1">89</p>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Consultations</p>
            <p className="text-3xl font-bold text-foreground mb-1">156</p>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
              <Video className="w-7 h-7 text-orange-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Téléconsultations</p>
            <p className="text-3xl font-bold text-foreground mb-1">24</p>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-pink-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Revenus</p>
            <p className="text-3xl font-bold text-foreground mb-1">2.5M</p>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group rounded-2xl backdrop-blur-xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/40 border border-border/30 hover:bg-card/60 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-cyan-600/20">
                  <Calendar className="w-8 h-8 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">Mon Agenda</h3>
                  <span className="inline-block px-4 py-1.5 text-sm rounded-full bg-pink-500/20 text-pink-500 border border-pink-500/30 font-medium">
                    8 RDV aujourd'hui
                  </span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="group rounded-2xl backdrop-blur-xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/40 border border-border/30 hover:bg-card/60 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-cyan-600/20">
                  <Users className="w-8 h-8 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">Mes Patients</h3>
                  <span className="inline-block px-4 py-1.5 text-sm rounded-full bg-pink-500/20 text-pink-500 border border-pink-500/30 font-medium">
                    89 patients actifs
                  </span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Prochains Rendez-vous */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Prochains Rendez-vous</h2>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="rounded-2xl backdrop-blur-xl p-5 bg-card/60 border border-border/20 hover:bg-card/80 transition-all cursor-pointer hover:scale-[1.01] shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="flex flex-col items-center justify-center min-w-[70px] rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-3">
                        <Clock className="h-5 w-5 text-primary mb-1" />
                        <span className="font-bold text-sm text-foreground">{apt.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground text-lg">{apt.patient}</h4>
                          <Badge variant="outline" className="flex items-center gap-1 rounded-full">
                            {getTypeIcon(apt.type)}
                            <span className="capitalize text-xs">{apt.type}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{apt.reason}</p>
                        {apt.cnamgs && (
                          <p className="text-xs text-muted-foreground font-mono">CNAMGS: {apt.cnamgs}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(apt.status)} rounded-full px-4`}>
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <AppointmentModal 
          open={showAppointmentModal} 
          onOpenChange={setShowAppointmentModal}
        />
      </div>
    </PatientDashboardLayout>
  );
}
