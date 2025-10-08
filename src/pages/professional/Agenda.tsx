import { useState } from "react";
import { Calendar, Clock, Video, Home, MapPin, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { AppointmentModal } from "@/components/professional/AppointmentModal";

export default function ProfessionalAgenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda & Rendez-vous</h1>
          <p className="text-muted-foreground">Gérez vos consultations quotidiennes</p>
        </div>
        <Button onClick={() => setShowAppointmentModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau RDV
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-yellow-500">3</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Téléconsultations</p>
                <p className="text-2xl font-bold text-blue-500">5</p>
              </div>
              <Video className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux remplissage</p>
                <p className="text-2xl font-bold text-green-500">85%</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>Sélectionnez une date</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Liste des RDV */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rendez-vous du jour</CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
                <TabsTrigger value="teleconsultation">Téléconsultation</TabsTrigger>
                <TabsTrigger value="domicile">Domicile</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {appointments.map((apt) => (
                  <Card key={apt.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="flex flex-col items-center justify-center min-w-[60px]">
                            <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                            <span className="font-semibold text-sm">{apt.time}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{apt.patient}</h4>
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getTypeIcon(apt.type)}
                                <span className="capitalize">{apt.type}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{apt.reason}</p>
                            {apt.cnamgs && (
                              <p className="text-xs text-muted-foreground">CNAMGS: {apt.cnamgs}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <AppointmentModal 
        open={showAppointmentModal} 
        onOpenChange={setShowAppointmentModal}
      />
    </div>
  );
}
