import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import {
  Users,
  User,
  Building2,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Eye,
  Edit,
  FileText
} from "lucide-react";

// Types
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationalId: string;
  status: 'active' | 'inactive';
  establishments: string[];
  mainDoctor?: string;
  insuranceType?: 'CNAMGS' | 'CNSS' | 'Privée' | 'Aucune';
}

// Données mock
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    firstName: 'Marie',
    lastName: 'OKOME',
    email: 'marie.okome@sante.ga',
    phone: '+241 06 12 34 56',
    dateOfBirth: '1985-06-15',
    nationalId: 'GA123456789',
    status: 'active',
    establishments: ['CHU d\'Owendo', 'Polyclinique El Rapha', 'Cabinet Glass'],
    mainDoctor: 'Dr. Jean OBAME',
    insuranceType: 'CNAMGS'
  },
  {
    id: 'pat-002',
    firstName: 'Alain',
    lastName: 'MOUSSAVOU',
    email: 'alain.moussavou@sante.ga',
    phone: '+241 06 23 45 67',
    dateOfBirth: '1978-03-22',
    nationalId: 'GA987654321',
    status: 'active',
    establishments: ['CMST SOGARA', 'CHR Melen'],
    mainDoctor: 'Dr. Jean-Pierre MBENGONO',
    insuranceType: 'CNSS'
  },
  {
    id: 'pat-003',
    firstName: 'Rachel',
    lastName: 'MVELE',
    email: 'rachel.mvele@sante.ga',
    phone: '+241 06 34 56 78',
    dateOfBirth: '1992-11-08',
    nationalId: 'GA456789123',
    status: 'active',
    establishments: ['CMST SOGARA', 'Clinique Sainte-Marie'],
    mainDoctor: 'Dr. Jean-Pierre MBENGONO',
    insuranceType: 'CNSS'
  },
  {
    id: 'pat-004',
    firstName: 'Yannick',
    lastName: 'BANGA',
    email: 'yannick.banga@sante.ga',
    phone: '+241 06 45 67 89',
    dateOfBirth: '2005-07-30',
    nationalId: 'GA789123456',
    status: 'active',
    establishments: ['CHR Melen', 'Clinique Sainte-Marie'],
    mainDoctor: 'Dr. Pierre MOUSSAVOU',
    insuranceType: 'CNAMGS'
  },
  {
    id: 'pat-005',
    firstName: 'Joséphine',
    lastName: 'NTOUTOUME',
    email: 'josephine.ntoutoume@sante.ga',
    phone: '+241 06 56 78 90',
    dateOfBirth: '1960-01-12',
    nationalId: 'GA321654987',
    status: 'active',
    establishments: ['CHU d\'Owendo'],
    mainDoctor: 'Dr. Sylvie NGUEMA',
    insuranceType: 'CNAMGS'
  }
];

export default function PatientsManagement() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    withCNAMGS: patients.filter(p => p.insuranceType === 'CNAMGS').length,
    withCNSS: patients.filter(p => p.insuranceType === 'CNSS').length,
    multiEstablishment: patients.filter(p => p.establishments.length > 1).length
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = !searchTerm || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nationalId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesInsurance = selectedInsurance === 'all' || patient.insuranceType === selectedInsurance;
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    
    return matchesSearch && matchesInsurance && matchesStatus;
  });

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Gestion des Patients</h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de tous les patients et leurs parcours de soins
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500">Inscrits</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-700">Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.active}</div>
              <p className="text-xs text-gray-500">Profils actifs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-700">CNAMGS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.withCNAMGS}</div>
              <p className="text-xs text-gray-500">Assurés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-700">CNSS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{stats.withCNSS}</div>
              <p className="text-xs text-gray-500">Salariés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-700">Multi-Établ.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{stats.multiEstablishment}</div>
              <p className="text-xs text-gray-500">2+ établ.</p>
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
                  placeholder="Rechercher par nom, email ou CNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les assurances</SelectItem>
                    <SelectItem value="CNAMGS">CNAMGS</SelectItem>
                    <SelectItem value="CNSS">CNSS</SelectItem>
                    <SelectItem value="Privée">Privée</SelectItem>
                    <SelectItem value="Aucune">Aucune</SelectItem>
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
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des patients */}
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {calculateAge(patient.dateOfBirth)} ans
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {patient.nationalId}
                        </span>
                        {patient.insuranceType && (
                          <Badge variant="outline" className="text-xs">
                            {patient.insuranceType}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </span>
                      </div>
                      
                      {/* Établissements */}
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Suivi dans {patient.establishments.length} établissement(s)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {patient.establishments.map((estab, idx) => (
                            <Badge key={idx} variant="secondary">
                              <Building2 className="w-3 h-3 mr-1" />
                              {estab}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {patient.mainDoctor && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500">Médecin traitant</p>
                          <p className="text-sm font-medium">{patient.mainDoctor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">
                Aucun patient trouvé
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
