import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AccueilHDJRdvPage() {
  // Données mock pour les rendez-vous
  const appointments = [
    { id: 1, patient: 'Jean Dupont', time: '09:00', service: 'Consultation générale', status: 'confirmé', phone: '077123456' },
    { id: 2, patient: 'Marie Nzé', time: '09:30', service: 'Cardiologie', status: 'arrivé', phone: '077234567' },
    { id: 3, patient: 'Pierre Mbele', time: '10:00', service: 'Radiologie', status: 'en attente', phone: '077345678' },
    { id: 4, patient: 'Sophie Oyono', time: '10:30', service: 'Pédiatrie', status: 'confirmé', phone: '077456789' },
    { id: 5, patient: 'Paul Obiang', time: '11:00', service: 'Gynécologie', status: 'confirmé', phone: '077567890' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'arrivé': return 'bg-green-500';
      case 'confirmé': return 'bg-blue-500';
      case 'en attente': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rendez-vous du jour</h1>
            <p className="text-muted-foreground">Gestion des rendez-vous de l'Hôpital du Jour</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Nouveau RDV
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Rechercher un rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Rechercher par nom, téléphone ou service..." 
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous programmés</CardTitle>
            <CardDescription>
              {appointments.length} rendez-vous aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div 
                  key={apt.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-semibold text-sm">{apt.time}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{apt.patient}</span>
                        <Badge className={`${getStatusColor(apt.status)} text-white`}>
                          {apt.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {apt.service} • Tel: {apt.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Modifier
                    </Button>
                    <Button size="sm" variant="default">
                      Enregistrer arrivée
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
