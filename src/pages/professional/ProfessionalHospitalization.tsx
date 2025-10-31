import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2, Search, Bed, Activity, AlertCircle,
  Plus, Users, Calendar, ClipboardList
} from 'lucide-react';

export default function ProfessionalHospitalization() {
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives pour la démo
  const hospitalizedPatients = [
    {
      id: 1,
      patient: 'Marie MOUSSAVOU',
      room: 'Chambre 101',
      service: 'Médecine Générale',
      admissionDate: '2025-01-28',
      diagnosis: 'Pneumonie',
      status: 'stable',
      doctor: 'Dr. DJEKI'
    },
    {
      id: 2,
      patient: 'Jean NZENGUE',
      room: 'Chambre 205',
      service: 'Cardiologie',
      admissionDate: '2025-01-30',
      diagnosis: 'Insuffisance cardiaque',
      status: 'surveillance',
      doctor: 'Dr. OKEMBA'
    },
    {
      id: 3,
      patient: 'Pierre OBAME',
      room: 'Chambre 103',
      service: 'Chirurgie',
      admissionDate: '2025-01-29',
      diagnosis: 'Post-opératoire appendicite',
      status: 'recovery',
      doctor: 'Dr. NGUEMA'
    }
  ];

  const stats = {
    total: 24,
    stable: 18,
    surveillance: 4,
    critical: 2
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      stable: { label: 'Stable', variant: 'secondary' as const, color: 'text-green-600' },
      surveillance: { label: 'Surveillance', variant: 'default' as const, color: 'text-orange-600' },
      recovery: { label: 'Convalescence', variant: 'outline' as const, color: 'text-blue-600' },
      critical: { label: 'Critique', variant: 'destructive' as const, color: 'text-red-600' }
    };
    return badges[status as keyof typeof badges] || badges.stable;
  };

  const filteredPatients = hospitalizedPatients.filter(p =>
    p.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Hospitalisation
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des patients hospitalisés
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle admission
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patients hospitalisés</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Bed className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">État stable</p>
              <p className="text-2xl font-bold text-green-700">{stats.stable}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Surveillance</p>
              <p className="text-2xl font-bold text-orange-700">{stats.surveillance}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">État critique</p>
              <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un patient, une chambre ou un diagnostic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Liste des patients hospitalisés */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.map((patient) => {
          const statusBadge = getStatusBadge(patient.status);
          
          return (
            <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{patient.patient}</h3>
                      <Badge variant={statusBadge.variant} className="mt-1">
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm ml-15">
                    <div>
                      <p className="text-muted-foreground mb-1">Chambre</p>
                      <p className="font-medium flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        {patient.room}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Service</p>
                      <p className="font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {patient.service}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Admission</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(patient.admissionDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Diagnostic</p>
                      <p className="font-medium flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        {patient.diagnosis}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Médecin référent</p>
                      <p className="font-medium">
                        {patient.doctor}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Dossier
                  </Button>
                  <Button size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun patient trouvé</h3>
            <p className="text-muted-foreground">
              Aucun patient hospitalisé ne correspond à votre recherche
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
