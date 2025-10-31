import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Video, Search, Calendar, Clock, User, 
  PhoneCall, Camera, Mic, Monitor, Plus
} from 'lucide-react';

export default function ProfessionalTeleconsultations() {
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives
  const teleconsultations = [
    {
      id: 1,
      patient: 'Marie MOUSSAVOU',
      date: '2025-01-31',
      time: '14:00',
      duration: '30 min',
      status: 'scheduled',
      type: 'Consultation de suivi',
      platform: 'Zoom'
    },
    {
      id: 2,
      patient: 'Jean NZENGUE',
      date: '2025-01-31',
      time: '15:30',
      duration: '45 min',
      status: 'scheduled',
      type: 'Première consultation',
      platform: 'WhatsApp'
    },
    {
      id: 3,
      patient: 'Sophie KOMBILA',
      date: '2025-01-30',
      time: '10:00',
      duration: '25 min',
      status: 'completed',
      type: 'Renouvellement ordonnance',
      platform: 'Teams'
    },
    {
      id: 4,
      patient: 'Pierre OBAME',
      date: '2025-01-30',
      time: '11:30',
      duration: '35 min',
      status: 'completed',
      type: 'Consultation de contrôle',
      platform: 'Zoom'
    },
    {
      id: 5,
      patient: 'André NGUEMA',
      date: '2025-01-29',
      time: '16:00',
      duration: '15 min',
      status: 'missed',
      type: 'Consultation urgente',
      platform: 'WhatsApp'
    }
  ];

  const stats = {
    today: teleconsultations.filter(t => t.date === '2025-01-31').length,
    scheduled: teleconsultations.filter(t => t.status === 'scheduled').length,
    completed: teleconsultations.filter(t => t.status === 'completed').length,
    thisWeek: 8
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: { label: 'Planifiée', variant: 'default' as const, color: 'text-blue-600' },
      completed: { label: 'Terminée', variant: 'secondary' as const, color: 'text-green-600' },
      in_progress: { label: 'En cours', variant: 'default' as const, color: 'text-orange-600' },
      missed: { label: 'Manquée', variant: 'destructive' as const, color: 'text-red-600' }
    };
    return badges[status as keyof typeof badges] || badges.scheduled;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'zoom':
        return Monitor;
      case 'whatsapp':
        return PhoneCall;
      case 'teams':
        return Video;
      default:
        return Video;
    }
  };

  const filteredConsultations = teleconsultations.filter(t =>
    t.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            Téléconsultations
          </h1>
          <p className="text-muted-foreground mt-1">
            Consultations à distance et visioconférences
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle téléconsultation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aujourd'hui</p>
              <p className="text-2xl font-bold">{stats.today}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Planifiées</p>
              <p className="text-2xl font-bold">{stats.scheduled}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Terminées</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <Video className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cette semaine</p>
              <p className="text-2xl font-bold">{stats.thisWeek}</p>
            </div>
            <PhoneCall className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Prochaine téléconsultation */}
      {stats.scheduled > 0 && (
        <Card className="p-6 border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Video className="h-5 w-5" />
                Prochaine téléconsultation
              </h3>
              <p className="font-medium">Marie MOUSSAVOU</p>
              <p className="text-sm text-muted-foreground">Consultation de suivi</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Aujourd'hui
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  14:00
                </span>
                <Badge variant="outline">Zoom</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Préparer
              </Button>
              <Button className="gap-2">
                <Video className="h-4 w-4" />
                Démarrer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par patient ou type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Liste des téléconsultations */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => {
          const statusBadge = getStatusBadge(consultation.status);
          const PlatformIcon = getPlatformIcon(consultation.platform);
          
          return (
            <Card key={consultation.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{consultation.patient}</h3>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <PlatformIcon className="h-3 w-3" />
                        {consultation.platform}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {consultation.type}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(consultation.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        {consultation.duration}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {consultation.status === 'scheduled' && (
                    <>
                      <Button variant="outline" size="sm">
                        Reprogrammer
                      </Button>
                      <Button size="sm" className="gap-1">
                        <Video className="h-4 w-4" />
                        Rejoindre
                      </Button>
                    </>
                  )}
                  {consultation.status === 'completed' && (
                    <>
                      <Button variant="outline" size="sm">
                        Compte-rendu
                      </Button>
                      <Button variant="outline" size="sm">
                        Enregistrement
                      </Button>
                    </>
                  )}
                  {consultation.status === 'missed' && (
                    <Button size="sm">
                      Recontacter
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredConsultations.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune téléconsultation trouvée</h3>
            <p className="text-muted-foreground">
              Aucune téléconsultation ne correspond à votre recherche
            </p>
          </div>
        </Card>
      )}

      {/* Guide rapide */}
      <Card className="p-6 bg-muted/20">
        <h3 className="text-lg font-semibold mb-4">Configuration requise</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Caméra</p>
              <p className="text-sm text-muted-foreground">Webcam HD recommandée</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mic className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Microphone</p>
              <p className="text-sm text-muted-foreground">Casque avec micro intégré</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Monitor className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Connexion</p>
              <p className="text-sm text-muted-foreground">Internet haut débit stable</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
