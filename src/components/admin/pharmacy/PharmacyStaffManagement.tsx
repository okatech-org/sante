import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Shield, 
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { PharmacyRoleType, getPharmacyRoleLabel } from "@/types/pharmacy-roles";

interface PharmacyStaffMember {
  id: string;
  name: string;
  role: PharmacyRoleType;
  onpgNumber?: string;
  status: 'actif' | 'suspendu' | 'conge';
  joinDate: string;
  nationality?: string;
}

interface PharmacyStaffManagementProps {
  pharmacyId: string;
}

export const PharmacyStaffManagement = ({ pharmacyId }: PharmacyStaffManagementProps) => {
  // Données simulées - À remplacer par des données réelles de Supabase
  const staff: PharmacyStaffMember[] = [
    {
      id: '1',
      name: 'Dr. Marie NZAMBA',
      role: 'pharmacien_titulaire',
      onpgNumber: 'ONPG-2015-0123',
      status: 'actif',
      joinDate: '2020-01-15',
      nationality: 'Gabonaise'
    },
    {
      id: '2',
      name: 'Dr. Patrick OBAME',
      role: 'pharmacien_adjoint',
      onpgNumber: 'ONPG-2018-0456',
      status: 'actif',
      joinDate: '2021-03-10'
    },
    {
      id: '3',
      name: 'Sylvie MOUSSAVOU',
      role: 'preparateur',
      status: 'actif',
      joinDate: '2019-06-01'
    },
    {
      id: '4',
      name: 'Jean MBADINGA',
      role: 'technicien',
      status: 'actif',
      joinDate: '2022-01-15'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'actif':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'suspendu':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Suspendu</Badge>;
      case 'conge':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />En congé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadgeColor = (role: PharmacyRoleType) => {
    if (role.includes('pharmacien')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (role === 'preparateur') return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion du Personnel Pharmaceutique
            </CardTitle>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Pharmaciens</p>
                <p className="text-2xl font-bold text-blue-700">
                  {staff.filter(s => s.role.includes('pharmacien')).length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Préparateurs</p>
                <p className="text-2xl font-bold text-purple-700">
                  {staff.filter(s => s.role === 'preparateur').length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Techniciens</p>
                <p className="text-2xl font-bold text-gray-700">
                  {staff.filter(s => s.role === 'technicien').length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Personnel Actif</p>
                <p className="text-2xl font-bold text-green-700">
                  {staff.filter(s => s.status === 'actif').length}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {staff.map((member) => (
              <Card key={member.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{member.name}</h4>
                        {getStatusBadge(member.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {getPharmacyRoleLabel(member.role)}
                        </Badge>
                        
                        {member.onpgNumber && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-green-600" />
                            <span className="text-muted-foreground">ONPG: {member.onpgNumber}</span>
                          </div>
                        )}
                        
                        {member.nationality && (
                          <Badge variant="secondary">
                            🇬🇦 {member.nationality}
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Depuis {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Voir le profil
                      </Button>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exigences par Rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2">✅ Pharmacien Titulaire</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Doctorat en Pharmacie</li>
                <li>• Inscription ONPG obligatoire</li>
                <li>• Nationalité gabonaise requise</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">✅ Pharmacien Adjoint</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Doctorat en Pharmacie</li>
                <li>• Inscription ONPG obligatoire</li>
                <li>• Peut remplacer le titulaire</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">✅ Préparateur</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Bac+2 - Brevet Professionnel</li>
                <li>• Assistance au pharmacien</li>
                <li>• Gestion des stocks</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">✅ Technicien</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Formation comptabilité/gestion</li>
                <li>• Gestion administrative</li>
                <li>• Traitement tiers-payant CNAMGS</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
