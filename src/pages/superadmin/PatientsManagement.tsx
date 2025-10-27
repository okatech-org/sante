import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  FileText,
  Loader2
} from "lucide-react";

// Types
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  nationalId: string;
  status: 'active' | 'inactive';
  establishments: string[];
  mainDoctor?: string;
  insuranceType?: 'CNAMGS' | 'CNSS' | 'Privée' | 'Aucune';
  createdAt: string;
}

export default function PatientsManagement() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les patients au montage
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      
      // Charger tous les profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, birth_date, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Charger les rôles utilisateurs
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Filtrer seulement les patients
      const patientUsers = rolesData?.filter(r => r.role === 'patient').map(r => r.user_id) || [];
      
      console.log('📊 Rôles chargés:', rolesData?.length, 'rôles');
      console.log('👥 Patients identifiés:', patientUsers.length, 'utilisateurs');
      
      // S'assurer que les profils ont bien un rôle 'patient' assigné
      const patientProfiles = profiles?.filter(p => {
        // Vérifier que l'utilisateur a un rôle
        const userRoles = rolesData?.filter(r => r.user_id === p.id) || [];
        if (userRoles.length === 0) {
          console.log('⚠️ Compte sans rôle:', p.email);
          return false; // Exclure si pas de rôle
        }
        
        // Vérifier que l'utilisateur a le rôle 'patient'
        const isPatient = patientUsers.includes(p.id);
        if (!isPatient) {
          const role = userRoles[0]?.role;
          console.log('🚫 Non-patient exclu:', p.email, '(rôle:', role, ')');
        }
        return isPatient;
      }) || [];
      
      console.log('✅ Patients finaux:', patientProfiles.length);

      // Transformer les données
      const transformedPatients: Patient[] = patientProfiles.map(profile => {
        const nameParts = (profile.full_name || '').split(' ').filter(Boolean);
        const firstName = nameParts.slice(0, -1).join(' ') || '';
        const lastName = nameParts[nameParts.length - 1] || '';

        return {
          id: profile.id,
          firstName,
          lastName,
          email: profile.email || '',
          phone: profile.phone || '',
          dateOfBirth: profile.birth_date || null,
          nationalId: '', // À récupérer si disponible dans les données
          status: 'active',
          establishments: [],
          createdAt: profile.created_at
        };
      });

      setPatients(transformedPatients);
      
      if (transformedPatients.length === 0) {
        toast.info("Aucun patient trouvé");
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des patients:', error);
      toast.error("Erreur lors du chargement des patients");
    } finally {
      setIsLoading(false);
    }
  };

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

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des patients...</span>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Patients</h1>
          <p className="text-gray-600">Consultez et gérez tous les comptes patients du système</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Inscrits sur la plateforme</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-gray-500 mt-1">Comptes actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">CNAMGS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.withCNAMGS}</div>
              <p className="text-xs text-gray-500 mt-1">Avec assurance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">CNSS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.withCNSS}</div>
              <p className="text-xs text-gray-500 mt-1">Avec couverture</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Multi-Établ.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.multiEstablishment}</div>
              <p className="text-xs text-gray-500 mt-1">Plusieurs structures</p>
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
                <label className="text-sm font-medium mb-2 block">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Nom, email, ID national..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Assurance</label>
                <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="CNAMGS">CNAMGS</SelectItem>
                    <SelectItem value="CNSS">CNSS</SelectItem>
                    <SelectItem value="Privée">Privée</SelectItem>
                    <SelectItem value="Aucune">Aucune</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des patients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Patients ({filteredPatients.length})
            </h2>
            <Button onClick={loadPatients} variant="outline" size="sm">
              Rafraîchir
            </Button>
          </div>

          {filteredPatients.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Aucun patient trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </Card>
          ) : (
            <div className="space-y-4">
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
                              {patient.nationalId || 'N/A'}
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
                          {patient.establishments.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-medium text-gray-600 mb-1">Établissements</p>
                              <div className="flex flex-wrap gap-1">
                                {patient.establishments.map((est, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {est}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" title="Voir détails">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
