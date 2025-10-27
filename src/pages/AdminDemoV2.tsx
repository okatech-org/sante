import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  Users,
  UserCheck,
  Stethoscope,
  User,
  Shield,
  Activity,
  AlertCircle,
  RefreshCw,
  Database,
  Key,
  Copy,
  LogIn,
  Eye,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
  FlaskConical,
  Pill,
  Heart,
  Brain,
  Baby,
  Sparkles,
  CheckCircle2,
  Clock,
  Link2,
  UserPlus,
  Settings,
  FileText,
  TrendingUp
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface Establishment {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'cabinet' | 'pharmacy' | 'laboratory';
  sector: 'public' | 'private' | 'confessional' | 'military';
  city: string;
  province: string;
  email: string;
  phone: string;
  services: string[];
  capacity: {
    beds?: number;
    consultationRooms?: number;
    operatingRooms?: number;
  };
  hasPortal: boolean;
  portalUrl?: string;
  theme?: {
    primaryColor: string;
    logo: string;
  };
  professionals: Professional[];
  patients: Patient[];
  stats: {
    totalProfessionals: number;
    totalPatients: number;
    activeConsultations: number;
    monthlyRevenue: number;
  };
}

interface Professional {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  specialty: string;
  orderNumber?: string;
  affiliations: Affiliation[];
  mainEstablishment?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Patient {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  nationalId?: string;
  establishments: string[];
  mainDoctor?: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

interface Affiliation {
  establishmentId: string;
  establishmentName: string;
  role: string;
  department?: string;
  permissions: string[];
  schedule?: any;
  isAdmin: boolean;
}

// ============================================================================
// DATA - Structures et Utilisateurs de Démonstration
// ============================================================================

const DEMO_ESTABLISHMENTS: Establishment[] = [
  // Hôpitaux Publics
  {
    id: 'chu-owendo',
    name: 'CHU d\'Owendo',
    type: 'hospital',
    sector: 'public',
    city: 'Libreville',
    province: 'Estuaire',
    email: 'chu.owendo@sante.ga',
    phone: '+241 01 79 50 00',
    services: ['Urgences', 'Chirurgie', 'Maternité', 'Pédiatrie', 'Cardiologie', 'Radiologie'],
    capacity: { beds: 450, consultationRooms: 30, operatingRooms: 8 },
    hasPortal: true,
    portalUrl: 'chu-owendo.sante.ga',
    theme: {
      primaryColor: '#1B4F72',
      logo: '/logos/chu-owendo.png'
    },
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 156,
      totalPatients: 12450,
      activeConsultations: 234,
      monthlyRevenue: 285000000
    }
  },
  {
    id: 'chr-melen',
    name: 'Centre Hospitalier Régional de Melen',
    type: 'hospital',
    sector: 'public',
    city: 'Libreville',
    province: 'Estuaire',
    email: 'chr.melen@sante.ga',
    phone: '+241 01 74 23 45',
    services: ['Urgences', 'Médecine Générale', 'Maternité', 'Pédiatrie'],
    capacity: { beds: 200, consultationRooms: 15, operatingRooms: 3 },
    hasPortal: false,
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 67,
      totalPatients: 5670,
      activeConsultations: 89,
      monthlyRevenue: 98000000
    }
  },

  // Cliniques Privées
  {
    id: 'polyclinique-chambrier',
    name: 'Polyclinique El Rapha Dr. Chambrier',
    type: 'clinic',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    email: 'chambrier@sante.ga',
    phone: '+241 01 44 38 38',
    services: ['Consultations Spécialisées', 'Chirurgie', 'Imagerie', 'Laboratoire', 'Urgences 24/7'],
    capacity: { beds: 120, consultationRooms: 20, operatingRooms: 5 },
    hasPortal: true,
    portalUrl: 'chambrier.sante.ga',
    theme: {
      primaryColor: '#2E7D32',
      logo: '/logos/chambrier.png'
    },
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 45,
      totalPatients: 8900,
      activeConsultations: 67,
      monthlyRevenue: 156000000
    }
  },
  {
    id: 'clinique-sainte-marie',
    name: 'Clinique Sainte-Marie',
    type: 'clinic',
    sector: 'confessional',
    city: 'Libreville',
    province: 'Estuaire',
    email: 'sainte.marie@sante.ga',
    phone: '+241 01 76 22 22',
    services: ['Médecine Générale', 'Pédiatrie', 'Gynécologie', 'Petite Chirurgie'],
    capacity: { beds: 50, consultationRooms: 10, operatingRooms: 2 },
    hasPortal: false,
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 23,
      totalPatients: 3450,
      activeConsultations: 34,
      monthlyRevenue: 45000000
    }
  },

  // Cabinets Médicaux
  {
    id: 'cabinet-glass',
    name: 'Cabinet Médical Glass',
    type: 'cabinet',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    email: 'cabinet.glass@sante.ga',
    phone: '+241 01 77 88 99',
    services: ['Médecine Générale', 'Pédiatrie', 'Vaccinations'],
    capacity: { consultationRooms: 3 },
    hasPortal: false,
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 5,
      totalPatients: 890,
      activeConsultations: 12,
      monthlyRevenue: 12000000
    }
  },
  {
    id: 'cabinet-groupe-nkembo',
    name: 'Cabinet de Groupe Nkembo',
    type: 'cabinet',
    sector: 'private',
    city: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    email: 'nkembo@sante.ga',
    phone: '+241 01 55 44 33',
    services: ['Médecine Générale', 'Gynécologie', 'ORL', 'Ophtalmologie'],
    capacity: { consultationRooms: 6 },
    hasPortal: false,
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 8,
      totalPatients: 2100,
      activeConsultations: 28,
      monthlyRevenue: 24000000
    }
  },

  // Centre Spécialisé
  {
    id: 'cmst-sogara',
    name: 'Centre de Médecine de Santé au Travail (CMST) SOGARA',
    type: 'clinic',
    sector: 'private',
    city: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    email: 'cmst.sogara@sante.ga',
    phone: '+241 01 55 26 21',
    services: ['Médecine du Travail', 'Infirmerie', 'Vaccinations', 'Prévention'],
    capacity: { consultationRooms: 4 },
    hasPortal: true,
    portalUrl: 'sogara.sante.ga',
    theme: {
      primaryColor: '#FF6B00',
      logo: '/logos/sogara.png'
    },
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 6,
      totalPatients: 3200,
      activeConsultations: 45,
      monthlyRevenue: 28000000
    }
  },

  // Pharmacies
  {
    id: 'pharmacie-nkembo',
    name: 'Pharmacie Nkembo',
    type: 'pharmacy',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    email: 'pharmacie.nkembo@sante.ga',
    phone: '+241 01 74 55 66',
    services: ['Dispensation', 'Conseil Pharmaceutique', 'Vaccination'],
    capacity: {},
    hasPortal: false,
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 4,
      totalPatients: 0,
      activeConsultations: 0,
      monthlyRevenue: 35000000
    }
  },

  // Laboratoires
  {
    id: 'laboratoire-biolab',
    name: 'Laboratoire BIOLAB',
    type: 'laboratory',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    email: 'biolab@sante.ga',
    phone: '+241 01 72 33 44',
    services: ['Analyses Médicales', 'Prélèvements', 'Tests COVID', 'Bilan Santé'],
    capacity: {},
    hasPortal: false,
    professionals: [],
    patients: [],
    stats: {
      totalProfessionals: 8,
      totalPatients: 0,
      activeConsultations: 0,
      monthlyRevenue: 42000000
    }
  }
];

const DEMO_PROFESSIONALS: Professional[] = [
  // Médecins Multi-Établissements
  {
    id: 'pro-001',
    email: 'dr.obame@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Jean',
    lastName: 'OBAME',
    specialty: 'Médecine Générale',
    orderNumber: 'CNOM-GA-2018-0234',
    status: 'active',
    mainEstablishment: 'chu-owendo',
    affiliations: [
      {
        establishmentId: 'chu-owendo',
        establishmentName: 'CHU d\'Owendo',
        role: 'Chef de Service Médecine Interne',
        department: 'Médecine Interne',
        permissions: ['consultation', 'prescription', 'surgery', 'admin_department'],
        isAdmin: true
      },
      {
        establishmentId: 'polyclinique-chambrier',
        establishmentName: 'Polyclinique El Rapha',
        role: 'Médecin Consultant',
        permissions: ['consultation', 'prescription'],
        isAdmin: false
      },
      {
        establishmentId: 'cabinet-glass',
        establishmentName: 'Cabinet Médical Glass',
        role: 'Médecin Associé',
        permissions: ['consultation', 'prescription', 'billing'],
        isAdmin: false
      }
    ]
  },
  {
    id: 'pro-002',
    email: 'dr.nguema@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Sylvie',
    lastName: 'NGUEMA',
    specialty: 'Cardiologie',
    orderNumber: 'CNOM-GA-2015-0156',
    status: 'active',
    mainEstablishment: 'polyclinique-chambrier',
    affiliations: [
      {
        establishmentId: 'polyclinique-chambrier',
        establishmentName: 'Polyclinique El Rapha',
        role: 'Cardiologue',
        department: 'Cardiologie',
        permissions: ['consultation', 'prescription', 'order_exams', 'surgery'],
        isAdmin: false
      },
      {
        establishmentId: 'chu-owendo',
        establishmentName: 'CHU d\'Owendo',
        role: 'Cardiologue Vacataire',
        department: 'Cardiologie',
        permissions: ['consultation', 'prescription'],
        isAdmin: false
      }
    ]
  },
  {
    id: 'pro-003',
    email: 'dr.mbengono@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Jean-Pierre',
    lastName: 'MBENGONO',
    specialty: 'Médecine du Travail',
    orderNumber: 'CNOM-GA-2019-0445',
    status: 'active',
    mainEstablishment: 'cmst-sogara',
    affiliations: [
      {
        establishmentId: 'cmst-sogara',
        establishmentName: 'CMST SOGARA',
        role: 'Médecin du Travail',
        department: 'Médecine du Travail',
        permissions: ['consultation', 'prescription', 'medical_fitness'],
        isAdmin: false
      }
    ]
  },
  {
    id: 'pro-004',
    email: 'dr.moussavou@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Pierre',
    lastName: 'MOUSSAVOU',
    specialty: 'Pédiatrie',
    orderNumber: 'CNOM-GA-2017-0312',
    status: 'active',
    mainEstablishment: 'chr-melen',
    affiliations: [
      {
        establishmentId: 'chr-melen',
        establishmentName: 'CHR de Melen',
        role: 'Pédiatre',
        department: 'Pédiatrie',
        permissions: ['consultation', 'prescription', 'hospitalization'],
        isAdmin: false
      },
      {
        establishmentId: 'clinique-sainte-marie',
        establishmentName: 'Clinique Sainte-Marie',
        role: 'Pédiatre Consultant',
        permissions: ['consultation', 'prescription'],
        isAdmin: false
      }
    ]
  },

  // Infirmiers
  {
    id: 'pro-005',
    email: 'inf.mboumba@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Sophie',
    lastName: 'MBOUMBA',
    specialty: 'Soins Infirmiers',
    orderNumber: 'ONPG-GA-2020-1234',
    status: 'active',
    mainEstablishment: 'chu-owendo',
    affiliations: [
      {
        establishmentId: 'chu-owendo',
        establishmentName: 'CHU d\'Owendo',
        role: 'Infirmière Chef',
        department: 'Urgences',
        permissions: ['patient_care', 'medication_admin', 'manage_nurses'],
        isAdmin: false
      },
      {
        establishmentId: 'clinique-sainte-marie',
        establishmentName: 'Clinique Sainte-Marie',
        role: 'Infirmière',
        permissions: ['patient_care', 'medication_admin'],
        isAdmin: false
      }
    ]
  },
  {
    id: 'pro-006',
    email: 'inf.ondimba@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Pierre',
    lastName: 'ONDIMBA',
    specialty: 'Soins Infirmiers',
    orderNumber: 'ONPG-GA-2021-2345',
    status: 'active',
    mainEstablishment: 'cmst-sogara',
    affiliations: [
      {
        establishmentId: 'cmst-sogara',
        establishmentName: 'CMST SOGARA',
        role: 'Infirmier',
        permissions: ['patient_care', 'vaccination', 'first_aid'],
        isAdmin: false
      }
    ]
  },

  // Pharmaciens
  {
    id: 'pro-007',
    email: 'pharm.nze@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Marie',
    lastName: 'NZE',
    specialty: 'Pharmacie',
    orderNumber: 'ONPG-GA-2018-0567',
    status: 'active',
    mainEstablishment: 'pharmacie-nkembo',
    affiliations: [
      {
        establishmentId: 'pharmacie-nkembo',
        establishmentName: 'Pharmacie Nkembo',
        role: 'Pharmacien Titulaire',
        permissions: ['dispensation', 'stock_management', 'billing', 'admin'],
        isAdmin: true
      }
    ]
  },

  // Laborantins
  {
    id: 'pro-008',
    email: 'lab.ondo@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Paul',
    lastName: 'ONDO',
    specialty: 'Biologie Médicale',
    orderNumber: 'LAB-GA-2019-0089',
    status: 'active',
    mainEstablishment: 'laboratoire-biolab',
    affiliations: [
      {
        establishmentId: 'laboratoire-biolab',
        establishmentName: 'Laboratoire BIOLAB',
        role: 'Biologiste',
        permissions: ['analysis', 'results_validation', 'report_generation'],
        isAdmin: false
      }
    ]
  }
];

const DEMO_PATIENTS: Patient[] = [
  // Patients Multi-Établissements
  {
    id: 'pat-001',
    email: 'marie.okome@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Marie',
    lastName: 'OKOME',
    dateOfBirth: '1985-06-15',
    nationalId: 'GA123456789',
    status: 'active',
    establishments: ['chu-owendo', 'polyclinique-chambrier', 'cabinet-glass'],
    mainDoctor: 'pro-001'
  },
  {
    id: 'pat-002',
    email: 'alain.moussavou@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Alain',
    lastName: 'MOUSSAVOU',
    dateOfBirth: '1978-03-22',
    nationalId: 'GA987654321',
    status: 'active',
    establishments: ['cmst-sogara', 'chr-melen'],
    mainDoctor: 'pro-003'
  },
  {
    id: 'pat-003',
    email: 'rachel.mvele@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Rachel',
    lastName: 'MVELE',
    dateOfBirth: '1992-11-08',
    nationalId: 'GA456789123',
    status: 'active',
    establishments: ['cmst-sogara', 'clinique-sainte-marie'],
    mainDoctor: 'pro-003'
  },
  {
    id: 'pat-004',
    email: 'yannick.banga@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Yannick',
    lastName: 'BANGA',
    dateOfBirth: '2005-07-30',
    nationalId: 'GA789123456',
    status: 'active',
    establishments: ['chr-melen', 'clinique-sainte-marie'],
    mainDoctor: 'pro-004'
  },
  {
    id: 'pat-005',
    email: 'josephine.ntoutoume@sante.ga',
    password: 'Demo@2024!',
    firstName: 'Joséphine',
    lastName: 'NTOUTOUME',
    dateOfBirth: '1960-01-12',
    nationalId: 'GA321654987',
    status: 'active',
    establishments: ['chu-owendo', 'cabinet-groupe-nkembo'],
    mainDoctor: 'pro-002'
  }
];

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function AdminDemoV2() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [establishments, setEstablishments] = useState(DEMO_ESTABLISHMENTS);
  const [professionals, setProfessionals] = useState(DEMO_PROFESSIONALS);
  const [patients, setPatients] = useState(DEMO_PATIENTS);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [selectedUser, setSelectedUser] = useState<Professional | Patient | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Statistiques globales
  const globalStats = {
    totalEstablishments: establishments.length,
    totalProfessionals: professionals.length,
    totalPatients: patients.length,
    totalAffiliations: professionals.reduce((acc, p) => acc + p.affiliations.length, 0),
    publicEstablishments: establishments.filter(e => e.sector === 'public').length,
    privateEstablishments: establishments.filter(e => e.sector === 'private').length
  };

  // Initialiser les comptes démo
  const initializeDemoAccounts = async () => {
    setIsInitializing(true);
    try {
      // Simuler la création des comptes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Comptes initialisés",
        description: `${establishments.length} structures, ${professionals.length} professionnels et ${patients.length} patients créés`,
      });
      
      setShowPasswordDialog(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser les comptes démo",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Connexion rapide
  const handleQuickLogin = async (email: string, role: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'Demo@2024!'
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: `Connecté en tant que ${email}`,
      });

      // Redirection selon le rôle
      if (role.includes('admin')) {
        navigate('/dashboard/admin');
      } else if (professionals.find(p => p.email === email)) {
        navigate('/dashboard/professional');
      } else {
        navigate('/dashboard/patient');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez que les comptes sont initialisés",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Écosystème Multi-Établissements SANTE.GA
            </h1>
            <p className="text-gray-600 mt-2">
              Architecture réaliste avec affiliations multiples et rôles contextuels
            </p>
          </div>
          <Button
            onClick={initializeDemoAccounts}
            disabled={isInitializing}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-green-600"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Initialisation...
              </>
            ) : (
              <>
                <Database className="mr-2 h-5 w-5" />
                Initialiser l'Écosystème
              </>
            )}
          </Button>
        </div>

        {/* Statistiques Globales */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Établissements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalEstablishments}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Professionnels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalProfessionals}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalPatients}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Affiliations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.totalAffiliations}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Public</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.publicEstablishments}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Privé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats.privateEstablishments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principales */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="establishments" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Structures ({establishments.length})
            </TabsTrigger>
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Professionnels ({professionals.length})
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patients ({patients.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Architecture Multi-Établissements</AlertTitle>
              <AlertDescription>
                Cette architecture reflète la réalité du système de santé gabonais où les professionnels 
                exercent dans plusieurs établissements avec des rôles différents, et les patients sont 
                suivis dans plusieurs structures.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Flux Professionnels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Flux Professionnels
                  </CardTitle>
                  <CardDescription>
                    Exemples d'exercice multi-établissements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-900">Dr. Jean OBAME</p>
                    <div className="mt-2 space-y-1 text-sm text-blue-700">
                      <p>• CHU d'Owendo : Chef de Service (Lun-Mer)</p>
                      <p>• Polyclinique El Rapha : Consultant (Jeu-Ven)</p>
                      <p>• Cabinet Glass : Associé (Samedi)</p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-semibold text-green-900">Sophie MBOUMBA</p>
                    <div className="mt-2 space-y-1 text-sm text-green-700">
                      <p>• CHU d'Owendo : Infirmière Chef Urgences</p>
                      <p>• Clinique Sainte-Marie : Infirmière Vacataire</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flux Patients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Flux Patients
                  </CardTitle>
                  <CardDescription>
                    Parcours de soins multi-établissements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-semibold text-purple-900">Marie OKOME</p>
                    <div className="mt-2 space-y-1 text-sm text-purple-700">
                      <p>• CHU d'Owendo : Suivi cardiologique</p>
                      <p>• Polyclinique El Rapha : Examens spécialisés</p>
                      <p>• Cabinet Glass : Médecin traitant</p>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-semibold text-orange-900">Alain MOUSSAVOU</p>
                    <div className="mt-2 space-y-1 text-sm text-orange-700">
                      <p>• CMST SOGARA : Médecine du travail (employé)</p>
                      <p>• CHR Melen : Urgences et soins généraux</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Établissements */}
          <TabsContent value="establishments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {establishments.map((establishment) => (
                <Card 
                  key={establishment.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedEstablishment(establishment)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {establishment.type === 'hospital' && <Building2 className="w-8 h-8 text-blue-600" />}
                        {establishment.type === 'clinic' && <Building2 className="w-8 h-8 text-green-600" />}
                        {establishment.type === 'cabinet' && <Briefcase className="w-8 h-8 text-purple-600" />}
                        {establishment.type === 'pharmacy' && <Pill className="w-8 h-8 text-orange-600" />}
                        {establishment.type === 'laboratory' && <FlaskConical className="w-8 h-8 text-pink-600" />}
                        <div>
                          <CardTitle className="text-lg">{establishment.name}</CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={establishment.sector === 'public' ? 'default' : 'secondary'}>
                              {establishment.sector}
                            </Badge>
                            {establishment.hasPortal && (
                              <Badge className="bg-green-100 text-green-700">
                                <Globe className="w-3 h-3 mr-1" />
                                Portail dédié
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(establishment.email, 'admin');
                        }}
                      >
                        <LogIn className="w-4 h-4 mr-1" />
                        Admin
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {establishment.city}, {establishment.province}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {establishment.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {establishment.email}
                      </div>
                      
                      {/* Services */}
                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Services</p>
                        <div className="flex flex-wrap gap-1">
                          {establishment.services.slice(0, 3).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {establishment.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{establishment.services.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Professionnels</p>
                          <p className="text-lg font-bold">{establishment.stats.totalProfessionals}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Patients</p>
                          <p className="text-lg font-bold">{establishment.stats.totalPatients}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Professionnels */}
          <TabsContent value="professionals" className="space-y-4">
            <div className="grid gap-4">
              {professionals.map((professional) => (
                <Card key={professional.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            Dr. {professional.firstName} {professional.lastName}
                          </h3>
                          <p className="text-gray-600">{professional.specialty}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              {professional.orderNumber}
                            </Badge>
                            <Badge className="bg-green-100 text-green-700">
                              {professional.status}
                            </Badge>
                          </div>
                          
                          {/* Affiliations */}
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Affiliations ({professional.affiliations.length})
                            </p>
                            <div className="space-y-2">
                              {professional.affiliations.map((affiliation) => (
                                <div 
                                  key={affiliation.establishmentId}
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
                                  <div className="flex gap-2">
                                    {affiliation.isAdmin && (
                                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                                        Admin
                                      </Badge>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleQuickLogin(professional.email, affiliation.role)}
                                    >
                                      <LogIn className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{professional.email}</p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => handleQuickLogin(professional.email, 'professional')}
                        >
                          <LogIn className="w-4 h-4 mr-1" />
                          Connexion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Patients */}
          <TabsContent value="patients" className="space-y-4">
            <div className="grid gap-4">
              {patients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <span className="text-sm text-gray-600">
                              Né(e) le {new Date(patient.dateOfBirth!).toLocaleDateString('fr-FR')}
                            </span>
                            <Badge variant="outline">{patient.nationalId}</Badge>
                          </div>
                          
                          {/* Établissements suivis */}
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Suivi dans {patient.establishments.length} établissement(s)
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {patient.establishments.map((estabId) => {
                                const estab = establishments.find(e => e.id === estabId);
                                return estab ? (
                                  <Badge key={estabId} variant="secondary">
                                    {estab.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                          
                          {/* Médecin traitant */}
                          {patient.mainDoctor && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-500">Médecin traitant</p>
                              <p className="text-sm font-medium">
                                {professionals.find(p => p.id === patient.mainDoctor)?.firstName}{' '}
                                {professionals.find(p => p.id === patient.mainDoctor)?.lastName}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{patient.email}</p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => handleQuickLogin(patient.email, 'patient')}
                        >
                          <LogIn className="w-4 h-4 mr-1" />
                          Connexion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Mot de Passe */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Écosystème Initialisé
              </DialogTitle>
              <DialogDescription>
                Tous les comptes utilisent le même mot de passe pour faciliter les tests
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Mot de passe universel</AlertTitle>
              <AlertDescription>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <code className="text-lg font-bold text-blue-900">Demo@2024!</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText('Demo@2024!');
                      toast({
                        title: "Copié !",
                        description: "Mot de passe copié dans le presse-papiers",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button onClick={() => setShowPasswordDialog(false)}>
                Compris
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
