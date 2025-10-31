import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  UserCog, Search, Plus, Users, Shield, Stethoscope,
  Activity, Phone, Mail, MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProfessionalStaff() {
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives
  const staff = [
    {
      id: 1,
      name: 'Dr. Marie OKEMBA',
      role: 'doctor',
      roleLabel: 'Médecin',
      department: 'Médecine Générale',
      matricule: 'MED-012',
      phone: '+241 07 12 34 56',
      email: 'dr.okemba.sogara@sante.ga',
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Paul NGUEMA',
      role: 'doctor',
      roleLabel: 'Médecin',
      department: 'Urgences',
      matricule: 'MED-015',
      phone: '+241 07 23 45 67',
      email: 'dr.nguema.sogara@sante.ga',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sylvie MBA',
      role: 'nurse',
      roleLabel: 'Infirmière',
      department: 'Soins Intensifs',
      matricule: 'INF-025',
      phone: '+241 07 34 56 78',
      email: 'nurse.mba.sogara@sante.ga',
      status: 'active'
    },
    {
      id: 4,
      name: 'Jean-Pierre MBADINGA',
      role: 'admin',
      roleLabel: 'Administrateur',
      department: 'Administration',
      matricule: 'ADM-001',
      phone: '+241 07 45 67 89',
      email: 'admin.sogara@sante.ga',
      status: 'active'
    },
    {
      id: 5,
      name: 'André MOUSSAVOU',
      role: 'lab_tech',
      roleLabel: 'Technicien Labo',
      department: 'Laboratoire',
      matricule: 'LAB-008',
      phone: '+241 07 56 78 90',
      email: 'lab.tech.sogara@sante.ga',
      status: 'active'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return Stethoscope;
      case 'nurse':
        return Activity;
      case 'admin':
        return Shield;
      default:
        return UserCog;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      doctor: 'bg-blue-100 text-blue-700',
      nurse: 'bg-green-100 text-green-700',
      admin: 'bg-purple-100 text-purple-700',
      lab_tech: 'bg-orange-100 text-orange-700'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: staff.length,
    doctors: staff.filter(s => s.role === 'doctor').length,
    nurses: staff.filter(s => s.role === 'nurse').length,
    admin: staff.filter(s => s.role === 'admin').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserCog className="h-8 w-8 text-primary" />
            Gestion du Personnel
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez l'équipe du CMST SOGARA
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Personnel</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Médecins</p>
              <p className="text-2xl font-bold">{stats.doctors}</p>
            </div>
            <Stethoscope className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Infirmier(e)s</p>
              <p className="text-2xl font-bold">{stats.nurses}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Administratifs</p>
              <p className="text-2xl font-bold">{stats.admin}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, département ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Liste du personnel */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStaff.map((member) => {
          const RoleIcon = getRoleIcon(member.role);
          
          return (
            <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <RoleIcon className="h-7 w-7 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.roleLabel}
                      </Badge>
                      <Badge variant="outline">{member.matricule}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {member.department}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </div>
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
                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem>Gérer les permissions</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Désactiver
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredStaff.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun membre trouvé</h3>
            <p className="text-muted-foreground">
              Aucun membre du personnel ne correspond à votre recherche
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
