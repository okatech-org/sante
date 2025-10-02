import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Video, Eye, X, Plus } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: 'consultation' | 'teleconsultation' | 'exam';
  doctor: string;
  specialty: string;
  location: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: 'Lundi 16 Jan',
    time: '10h30',
    type: 'consultation',
    doctor: 'Dr KOMBILA Pierre',
    specialty: 'Cardiologue',
    location: 'Cabinet Montagne Sainte, Libreville'
  },
  {
    id: '2',
    date: 'Mercredi 18 Jan',
    time: '15h00',
    type: 'teleconsultation',
    doctor: 'Dr NGOMA Marie',
    specialty: 'Généraliste',
    location: 'Téléconsultation en ligne'
  },
  {
    id: '3',
    date: 'Vendredi 20 Jan',
    time: '09h00',
    type: 'exam',
    doctor: 'BIOLAB Libreville',
    specialty: 'Analyses sanguines',
    location: 'Centre Ville, Libreville'
  }
];

export function UpcomingAppointments() {
  const appointments = mockAppointments;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teleconsultation':
        return <Video className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'Consultation';
      case 'teleconsultation':
        return 'Téléconsultation';
      case 'exam':
        return 'Examen';
      default:
        return type;
    }
  };

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4 text-center">Aucun rendez-vous prévu</p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Prendre rendez-vous
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Mes Rendez-vous
            {appointments.length > 0 && (
              <Badge variant="secondary">{appointments.length}</Badge>
            )}
          </CardTitle>
          <Button variant="link" size="sm" asChild>
            <a href="/appointments">Voir tous mes RDV</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="gap-1">
                    {getTypeIcon(apt.type)}
                    {getTypeLabel(apt.type)}
                  </Badge>
                  <span className="font-semibold text-primary">{apt.date}, {apt.time}</span>
                </div>
                <p className="font-medium mb-1">{apt.doctor} - {apt.specialty}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{apt.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 flex-1">
                <Eye className="h-4 w-4" />
                Voir détails
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <X className="h-4 w-4" />
                Annuler
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
