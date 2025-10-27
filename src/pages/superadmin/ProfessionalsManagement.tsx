import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  CheckCircle2,
  Loader2
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
  userRole: string;
  createdAt: string;
}

// Rôles professionnels (excluant 'patient')
const PROFESSIONAL_ROLES = [
  'doctor',
  'specialist',
  'nurse',
  'midwife',
  'physiotherapist',
  'psychologist',
  'ophthalmologist',
  'anesthesiologist',
  'pharmacist',
  'pharmacy',
  'laboratory_technician',
  'radiologist',
  'radiology_center',
  'hospital_admin',
  'clinic_admin',
  'sogara_admin'
];

// Catégories de professionnels par spécialité
const PROFESSIONAL_CATEGORIES = {
  'Médecins Généralistes': ['doctor'],
  'Médecins Spécialistes': ['specialist', 'ophthalmologist', 'anesthesiologist', 'radiologist'],
  'Personnel Paramédical': ['nurse', 'midwife', 'physiotherapist', 'psychologist', 'laboratory_technician'],
  'Pharmaciens': ['pharmacist', 'pharmacy'],
  'Administrateurs Médicaux': ['hospital_admin', 'clinic_admin', 'sogara_admin', 'radiology_center']
};

const SPECIALTIES = [
  'Médecine Générale',
  'Cardiologie',
  'Pédiatrie',
  'Médecine du Travail',
  'Soins Infirmiers',
  'Chirurgie',
  'Gynécologie',
  'Ophtalmologie',
  'ORL',
  'Pharmacie',
  'Anesthésie',
  'Radiologie',
  'Psychologie',
  'Kinésithérapie',
  'Laboratoire',
  'Autre'
];

export default function ProfessionalsManagement() {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setIsLoading(true);
      
      // Charger tous les profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Charger les rôles utilisateurs
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Filtrer seulement les professionnels (excluant 'patient')
      const professionalUsers = rolesData?.filter(r => PROFESSIONAL_ROLES.includes(r.role)) || [];
      
      const professionalProfiles = profiles?.filter(p => {
        // Vérifier que l'utilisateur a un rôle
        const userRoles = rolesData?.filter(r => r.user_id === p.id) || [];
        if (userRoles.length === 0) return false; // Exclure si pas de rôle
        
        // Vérifier que l'utilisateur a au moins un rôle professionnel
        return professionalUsers.some(pu => pu.user_id === p.id);
      }) || [];

      // Transformer les données
      const transformedProfessionals: Professional[] = professionalProfiles.map(profile => {
        const userRole = rolesData?.find(r => r.user_id === profile.id)?.role || 'unknown';
        const nameParts = (profile.full_name || '').split(' ').filter(Boolean);
        const firstName = nameParts.slice(0, -1).join(' ') || '';
        const lastName = nameParts[nameParts.length - 1] || '';

        return {
          id: profile.id,
          firstName,
          lastName,
          email: profile.email || '',
          phone: profile.phone || '',
          specialty: 'Général',
          orderNumber: '',
          status: 'active',
          affiliations: [],
          userRole,
          createdAt: profile.created_at
        };
      });

      setProfessionals(transformedProfessionals);
      
      if (transformedProfessionals.length === 0) {
        toast.info("Aucun professionnel trouvé");
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des professionnels:', error);
      toast.error("Erreur lors du chargement des professionnels");
    } finally {
      setIsLoading(false);
    }
  };

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

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      'doctor': 'Médecin',
      'specialist': 'Spécialiste',
      'nurse': 'Infirmier(ère)',
      'midwife': 'Sage-femme',
      'physiotherapist': 'Kinésithérapeute',
      'psychologist': 'Psychologue',
      'ophthalmologist': 'Ophtalmologue',
      'anesthesiologist': 'Anesthésiste',
      'pharmacist': 'Pharmacien',
      'pharmacy': 'Pharmacie',
      'laboratory_technician': 'Technicien de labo',
      'radiologist': 'Radiologue',
      'radiology_center': 'Centre de radiologie',
      'hospital_admin': 'Admin Hôpital',
      'clinic_admin': 'Admin Clinique',
      'sogara_admin': 'Admin SOGARA'
    };
    return roleLabels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    if (role.includes('admin')) return 'bg-red-100 text-red-800';
    if (role.includes('doctor') || role.includes('specialist')) return 'bg-blue-100 text-blue-800';
    if (role.includes('nurse') || role.includes('midwife')) return 'bg-pink-100 text-pink-800';
    if (role.includes('pharmacist') || role.includes('pharmacy')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des professionnels...</span>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Professionnels de Santé</h1>
          <p className="text-gray-600">
            Consultez et gérez tous les comptes professionnels du système
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Professionnels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-gray-500 mt-1">Vérifiés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-gray-500 mt-1">À valider</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Affiliations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalAffiliations}</div>
              <p className="text-xs text-gray-500 mt-1">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Multi-Affiliés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.multiAffiliation}</div>
              <p className="text-xs text-gray-500 mt-1">Plusieurs établissements</p>
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
                    placeholder="Nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Spécialité</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {SPECIALTIES.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
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
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des professionnels */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Professionnels ({filteredProfessionals.length})
            </h2>
            <Button onClick={loadProfessionals} variant="outline" size="sm">
              Rafraîchir
            </Button>
          </div>

          {filteredProfessionals.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Aucun professionnel trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProfessionals.map((prof) => (
                <Card key={prof.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {prof.firstName} {prof.lastName}
                          </h3>
                          
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge className={`text-xs ${getRoleBadgeColor(prof.userRole)}`}>
                              {getRoleLabel(prof.userRole)}
                            </Badge>
                            {prof.status === 'active' && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Actif
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {prof.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {prof.phone}
                            </span>
                          </div>

                          {prof.affiliations.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Affiliations ({prof.affiliations.length})
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {prof.affiliations.map((aff, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    {aff.establishmentName}
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
