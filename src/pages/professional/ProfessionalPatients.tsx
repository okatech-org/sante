import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, Search, Plus, User, Phone, Mail,
  Calendar, FileText, Activity, MoreVertical, Loader2, AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePatients } from '@/hooks/usePatients';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfessionalPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const { patients, stats, loading, error } = usePatients(searchTerm);

  const filteredPatients = patients;

  const getInsuranceBadge = (insurance: string | null) => {
    const badges = {
      'CNAMGS': 'bg-blue-100 text-blue-700',
      'CNSS': 'bg-green-100 text-green-700',
      'Privé': 'bg-purple-100 text-purple-700'
    };
    return badges[(insurance || 'Privé') as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Patients
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion de votre patientèle
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau patient
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actifs</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nouveaux</p>
              <p className="text-2xl font-bold">{stats.newThisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
            </div>
            <User className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">RDV à venir</p>
              <p className="text-2xl font-bold">{stats.upcomingAppointments}</p>
              <p className="text-xs text-muted-foreground mt-1">Planifiés</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, matricule ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Liste des patients */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      {patient.cnamgs && (
                        <Badge variant="outline">CNAMGS: {patient.cnamgs}</Badge>
                      )}
                      <Badge className={getInsuranceBadge(patient.cnamgs ? 'CNAMGS' : 'Privé')}>
                        {patient.cnamgs ? 'CNAMGS' : 'Privé'}
                      </Badge>
                      {patient.status === 'suivi_actif' && (
                        <Badge variant="secondary">Actif</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-muted-foreground mb-1">Contact</p>
                        <p className="font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </p>
                      </div>
                      {patient.lastVisit && (
                        <div>
                          <p className="text-muted-foreground mb-1">Dernière visite</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                      {patient.nextVisit && (
                        <div>
                          <p className="text-muted-foreground mb-1">Prochain RDV</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(patient.nextVisit).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                      {patient.conditions && patient.conditions.length > 0 && (
                        <div>
                          <p className="text-muted-foreground mb-1">Conditions</p>
                          <p className="font-medium text-xs">{patient.conditions.join(', ')}</p>
                        </div>
                      )}
                    </div>
                    
                    {patient.email && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {patient.email}
                        </p>
                      </div>
                    )}
                  </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Voir le dossier médical</DropdownMenuItem>
                  <DropdownMenuItem>Nouvelle consultation</DropdownMenuItem>
                  <DropdownMenuItem>Prendre RDV</DropdownMenuItem>
                  <DropdownMenuItem>Historique</DropdownMenuItem>
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun patient trouvé</h3>
            <p className="text-muted-foreground">
              Aucun patient ne correspond à votre recherche
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
