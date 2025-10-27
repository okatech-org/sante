import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import {
  UserCheck,
  Stethoscope,
  Building2,
  Shield,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Activity,
  TrendingUp,
  Users,
  Eye,
  Edit,
  CheckCircle2
} from "lucide-react";

// Types
interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  orderNumber: string;
  status: 'active' | 'inactive' | 'pending';
  affiliations: {
    establishmentName: string;
    role: string;
    department?: string;
    isAdmin: boolean;
  }[];
}

// Données mock (réutiliser depuis AdminDemoV2)
const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'pro-001',
    firstName: 'Jean',
    lastName: 'OBAME',
    email: 'dr.obame@sante.ga',
    phone: '+241 01 77 88 99',
    specialty: 'Médecine Générale',
    orderNumber: 'CNOM-GA-2018-0234',
    status: 'active',
    affiliations: [
      { establishmentName: 'CHU d\'Owendo', role: 'Chef de Service', department: 'Médecine Interne', isAdmin: true },
      { establishmentName: 'Polyclinique El Rapha', role: 'Consultant', isAdmin: false },
      { establishmentName: 'Cabinet Glass', role: 'Associé', isAdmin: false }
    ]
  },
  {
    id: 'pro-002',
    firstName: 'Sylvie',
    lastName: 'NGUEMA',
    email: 'dr.nguema@sante.ga',
    phone: '+241 01 76 33 22',
    specialty: 'Cardiologie',
    orderNumber: 'CNOM-GA-2015-0156',
    status: 'active',
    affiliations: [
      { establishmentName: 'Polyclinique El Rapha', role: 'Cardiologue', department: 'Cardiologie', isAdmin: false },
      { establishmentName: 'CHU d\'Owendo', role: 'Vacataire', department: 'Cardiologie', isAdmin: false }
    ]
  },
  {
    id: 'pro-003',
    firstName: 'Jean-Pierre',
    lastName: 'MBENGONO',
    email: 'dr.mbengono@sante.ga',
    phone: '+241 01 55 26 21',
    specialty: 'Médecine du Travail',
    orderNumber: 'CNOM-GA-2019-0445',
    status: 'active',
    affiliations: [
      { establishmentName: 'CMST SOGARA', role: 'Médecin du Travail', department: 'Médecine du Travail', isAdmin: false }
    ]
  },
  {
    id: 'pro-004',
    firstName: 'Pierre',
    lastName: 'MOUSSAVOU',
    email: 'dr.moussavou@sante.ga',
    phone: '+241 01 74 55 88',
    specialty: 'Pédiatrie',
    orderNumber: 'CNOM-GA-2017-0312',
    status: 'active',
    affiliations: [
      { establishmentName: 'CHR de Melen', role: 'Pédiatre', department: 'Pédiatrie', isAdmin: false },
      { establishmentName: 'Clinique Sainte-Marie', role: 'Consultant', isAdmin: false }
    ]
  },
  {
    id: 'pro-005',
    firstName: 'Sophie',
    lastName: 'MBOUMBA',
    email: 'inf.mboumba@sante.ga',
    phone: '+241 01 72 44 55',
    specialty: 'Soins Infirmiers',
    orderNumber: 'ONPG-GA-2020-1234',
    status: 'active',
    affiliations: [
      { establishmentName: 'CHU d\'Owendo', role: 'Infirmière Chef', department: 'Urgences', isAdmin: false },
      { establishmentName: 'Clinique Sainte-Marie', role: 'Infirmière', isAdmin: false }
    ]
  }
];

const SPECIALTIES = [
  'Médecine Générale',
  'Cardiologie',
  'Pédiatrie',
  'Médecine du Travail',
  'Soins Infirmiers',
  'Chirurgie',
  'Gynécologie',
  'Ophtalmologie',
  'ORL'
];

export default function ProfessionalsManagement() {
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const stats = {
    total: professionals.length,
    active: professionals.filter(p => p.status === 'active').length,
    pending: professionals.filter(p => p.status === 'pending').length,
    totalAffiliations: professionals.reduce((acc, p) => acc + p.affiliations.length, 0),
    multiAffiliation: professionals.filter(p => p.affiliations.length > 1).length
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = !searchTerm || 
      `${prof.firstName} ${prof.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || prof.specialty === selectedSpecialty;
    const matchesStatus = selectedStatus === 'all' || prof.status === selectedStatus;
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Gestion des Professionnels de Santé</h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de tous les professionnels avec leurs affiliations multiples
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500">Professionnels</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-700">Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.active}</div>
              <p className="text-xs text-gray-500">Vérifiés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-yellow-700">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
              <p className="text-xs text-gray-500">À valider</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-700">Affiliations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.totalAffiliations}</div>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-700">Multi-Établ.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{stats.multiAffiliation}</div>
              <p className="text-xs text-gray-500">2+ affiliations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les spécialités</SelectItem>
                    {SPECIALTIES.map(spec => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="pending">En Attente</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste */}
        <div className="grid gap-4">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          Dr. {professional.firstName} {professional.lastName}
                        </h3>
                        <Badge className={
                          professional.status === 'active' ? 'bg-green-100 text-green-700' :
                          professional.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {professional.status === 'active' ? 'Actif' :
                           professional.status === 'pending' ? 'En Attente' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{professional.specialty}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {professional.orderNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {professional.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {professional.phone}
                        </span>
                      </div>
                      
                      {/* Affiliations */}
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Affiliations ({professional.affiliations.length})
                        </p>
                        <div className="space-y-2">
                          {professional.affiliations.map((affiliation, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {affiliation.establishmentName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {affiliation.role}
                                  {affiliation.department && ` • ${affiliation.department}`}
                                </p>
                              </div>
                              {affiliation.isAdmin && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">
                Aucun professionnel trouvé
              </h3>
              <p className="text-gray-500 mt-2">
                Essayez de modifier vos critères de recherche
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </SuperAdminLayout>
  );
}
