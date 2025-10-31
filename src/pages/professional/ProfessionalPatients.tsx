import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, Search, Plus, User, Phone, Mail,
  Calendar, FileText, Activity, MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProfessionalPatients() {
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives des patients
  const patients = [
    {
      id: 1,
      name: 'Marie MOUSSAVOU',
      matricule: 'PAT-2025-001',
      age: 35,
      gender: 'F',
      phone: '+241 07 12 34 56',
      email: 'marie.moussavou@gmail.com',
      lastVisit: '2025-01-28',
      consultations: 12,
      status: 'active',
      insurance: 'CNAMGS'
    },
    {
      id: 2,
      name: 'Jean NZENGUE',
      matricule: 'PAT-2025-002',
      age: 42,
      gender: 'M',
      phone: '+241 07 23 45 67',
      email: 'jean.nzengue@gmail.com',
      lastVisit: '2025-01-30',
      consultations: 8,
      status: 'active',
      insurance: 'CNSS'
    },
    {
      id: 3,
      name: 'Sophie KOMBILA',
      matricule: 'PAT-2025-003',
      age: 28,
      gender: 'F',
      phone: '+241 07 34 56 78',
      email: 'sophie.kombila@gmail.com',
      lastVisit: '2025-01-25',
      consultations: 5,
      status: 'active',
      insurance: 'Privé'
    },
    {
      id: 4,
      name: 'Pierre OBAME',
      matricule: 'PAT-2025-004',
      age: 55,
      gender: 'M',
      phone: '+241 07 45 67 89',
      email: 'pierre.obame@gmail.com',
      lastVisit: '2025-01-15',
      consultations: 23,
      status: 'active',
      insurance: 'CNAMGS'
    },
    {
      id: 5,
      name: 'André NGUEMA',
      matricule: 'PAT-2025-005',
      age: 60,
      gender: 'M',
      phone: '+241 07 56 78 90',
      email: 'andre.nguema@gmail.com',
      lastVisit: '2024-12-20',
      consultations: 30,
      status: 'inactive',
      insurance: 'CNSS'
    }
  ];

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    new: 2,
    thisMonth: 12
  };

  const getInsuranceBadge = (insurance: string) => {
    const badges = {
      'CNAMGS': 'bg-blue-100 text-blue-700',
      'CNSS': 'bg-green-100 text-green-700',
      'Privé': 'bg-purple-100 text-purple-700'
    };
    return badges[insurance as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
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
              <p className="text-2xl font-bold">{stats.new}</p>
              <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
            </div>
            <User className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consultations</p>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
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
                    <Badge variant="outline">{patient.matricule}</Badge>
                    <Badge className={getInsuranceBadge(patient.insurance)}>
                      {patient.insurance}
                    </Badge>
                    {patient.status === 'active' && (
                      <Badge variant="secondary">Actif</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-muted-foreground mb-1">Âge</p>
                      <p className="font-medium">{patient.age} ans ({patient.gender})</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Téléphone</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patient.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Dernière visite</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Consultations</p>
                      <p className="font-medium flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {patient.consultations}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {patient.email}
                    </p>
                  </div>
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
