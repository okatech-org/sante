import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Stethoscope, Search, Plus, Users, Shield, Activity,
  Phone, Mail, MoreVertical, Award
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProfessionalMedicalStaff() {
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives du corps médical
  const medicalStaff = [
    {
      id: 1,
      name: 'Dr. Marie OKEMBA',
      specialty: 'Médecine Générale',
      department: 'Consultations Externes',
      matricule: 'MED-012',
      phone: '+241 07 12 34 56',
      email: 'dr.okemba.sogara@sante.ga',
      status: 'active',
      experience: '12 ans',
      diplomas: ['Doctorat Médecine', 'Spécialisation Médecine Interne']
    },
    {
      id: 2,
      name: 'Dr. Paul NGUEMA',
      specialty: 'Cardiologie',
      department: 'Service Cardiologie',
      matricule: 'MED-015',
      phone: '+241 07 23 45 67',
      email: 'dr.nguema.sogara@sante.ga',
      status: 'active',
      experience: '8 ans',
      diplomas: ['Doctorat Médecine', 'DES Cardiologie']
    },
    {
      id: 3,
      name: 'Dr. Sophie MBOUMBA',
      specialty: 'Pédiatrie',
      department: 'Service Pédiatrie',
      matricule: 'MED-018',
      phone: '+241 07 34 56 78',
      email: 'dr.mboumba.sogara@sante.ga',
      status: 'active',
      experience: '15 ans',
      diplomas: ['Doctorat Médecine', 'Spécialisation Pédiatrie']
    },
    {
      id: 4,
      name: 'Dr. André MOUSSAVOU',
      specialty: 'Chirurgie',
      department: 'Bloc Opératoire',
      matricule: 'MED-021',
      phone: '+241 07 45 67 89',
      email: 'dr.moussavou.sogara@sante.ga',
      status: 'active',
      experience: '10 ans',
      diplomas: ['Doctorat Médecine', 'DES Chirurgie Générale']
    }
  ];

  const filteredStaff = medicalStaff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: medicalStaff.length,
    generalistes: medicalStaff.filter(s => s.specialty === 'Médecine Générale').length,
    specialistes: medicalStaff.filter(s => s.specialty !== 'Médecine Générale').length,
    active: medicalStaff.filter(s => s.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            Corps Médical
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion de l'équipe médicale du CMST SOGARA
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un médecin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Médecins</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Généralistes</p>
              <p className="text-2xl font-bold">{stats.generalistes}</p>
            </div>
            <Stethoscope className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Spécialistes</p>
              <p className="text-2xl font-bold">{stats.specialistes}</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actifs</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, spécialité ou département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Liste du corps médical */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="h-7 w-7 text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <Badge variant="secondary">{member.specialty}</Badge>
                    <Badge variant="outline">{member.matricule}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      {member.department}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      {member.experience} d'expérience
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {member.email}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {member.diplomas.map((diploma, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {diploma}
                      </Badge>
                    ))}
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
                  <DropdownMenuItem>Voir le profil complet</DropdownMenuItem>
                  <DropdownMenuItem>Planning</DropdownMenuItem>
                  <DropdownMenuItem>Statistiques</DropdownMenuItem>
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Désactiver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun médecin trouvé</h3>
            <p className="text-muted-foreground">
              Aucun membre du corps médical ne correspond à votre recherche
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
