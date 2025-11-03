import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  UserCheck,
  Heart,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Phone,
  Mail,
  Building2,
  Briefcase,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  UserPlus
} from 'lucide-react';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';

interface Beneficiary {
  id: string;
  matricule: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  bloodGroup: string;
  type: 'employee' | 'family';
  position?: string;
  department?: string;
  hireDate?: string;
  linkedTo?: string; // Pour les membres de famille
  relationship?: string; // Conjoint, Enfant, etc.
  status: 'active' | 'inactive' | 'suspended';
  lastVisit?: string;
  nextVisit?: string;
  medicalStatus: 'fit' | 'pending' | 'restricted' | 'unfit';
}

const mockBeneficiaries: Beneficiary[] = [
  {
    id: '1',
    matricule: 'EMP-SOGARA-0001',
    fullName: 'Christian AVARO',
    email: 'christian.avaro@sogara.ga',
    phone: '+241 07 01 02 03',
    dateOfBirth: '1970-08-12',
    gender: 'M',
    bloodGroup: 'A+',
    type: 'employee',
    position: 'Directeur Général',
    department: 'Direction Générale',
    hireDate: '2015-01-15',
    status: 'active',
    lastVisit: '2024-10-15',
    nextVisit: '2025-10-15',
    medicalStatus: 'fit'
  },
  {
    id: '2',
    matricule: 'FAM-SOGARA-0001-01',
    fullName: 'Marie AVARO',
    email: 'marie.avaro@gmail.com',
    phone: '+241 07 01 02 04',
    dateOfBirth: '1972-05-20',
    gender: 'F',
    bloodGroup: 'O+',
    type: 'family',
    linkedTo: 'Christian AVARO',
    relationship: 'Conjointe',
    status: 'active',
    lastVisit: '2024-09-10',
    medicalStatus: 'fit'
  },
  {
    id: '3',
    matricule: 'FAM-SOGARA-0001-02',
    fullName: 'Sophie AVARO',
    email: 'sophie.avaro@gmail.com',
    phone: '+241 07 01 02 05',
    dateOfBirth: '2005-03-15',
    gender: 'F',
    bloodGroup: 'A+',
    type: 'family',
    linkedTo: 'Christian AVARO',
    relationship: 'Enfant',
    status: 'active',
    lastVisit: '2024-08-22',
    medicalStatus: 'fit'
  },
  {
    id: '4',
    matricule: 'EMP-SOGARA-0002',
    fullName: 'Ingride TCHEN',
    email: 'ingride.tchen@sogara.ga',
    phone: '+241 07 04 05 06',
    dateOfBirth: '1982-03-25',
    gender: 'F',
    bloodGroup: 'B+',
    type: 'employee',
    position: 'Directrice Financière',
    department: 'Finance',
    hireDate: '2017-06-01',
    status: 'active',
    lastVisit: '2024-11-05',
    nextVisit: '2025-11-05',
    medicalStatus: 'fit'
  },
  {
    id: '5',
    matricule: 'EMP-SOGARA-0003',
    fullName: 'Jean NZENGUE',
    email: 'jean.nzengue@sogara.ga',
    phone: '+241 07 11 22 33',
    dateOfBirth: '1978-09-20',
    gender: 'M',
    bloodGroup: 'O-',
    type: 'employee',
    position: 'Chef Production',
    department: 'Production',
    hireDate: '2012-03-10',
    status: 'active',
    lastVisit: '2024-09-30',
    nextVisit: '2025-09-30',
    medicalStatus: 'fit'
  },
  {
    id: '6',
    matricule: 'FAM-SOGARA-0003-01',
    fullName: 'Claire NZENGUE',
    email: 'claire.nzengue@gmail.com',
    phone: '+241 07 11 22 34',
    dateOfBirth: '1980-12-08',
    gender: 'F',
    bloodGroup: 'A+',
    type: 'family',
    linkedTo: 'Jean NZENGUE',
    relationship: 'Conjointe',
    status: 'active',
    lastVisit: '2024-07-15',
    medicalStatus: 'pending'
  },
  {
    id: '7',
    matricule: 'EMP-SOGARA-0004',
    fullName: 'Marie MOUSSAVOU',
    email: 'marie.moussavou@sogara.ga',
    phone: '+241 07 22 33 44',
    dateOfBirth: '1987-06-14',
    gender: 'F',
    bloodGroup: 'AB+',
    type: 'employee',
    position: 'Responsable HSE',
    department: 'Hygiène Sécurité Environnement',
    hireDate: '2018-09-01',
    status: 'active',
    lastVisit: '2024-10-20',
    nextVisit: '2025-10-20',
    medicalStatus: 'fit'
  },
  {
    id: '8',
    matricule: 'EMP-SOGARA-0005',
    fullName: 'Paul OBAME',
    email: 'paul.obame@sogara.ga',
    phone: '+241 07 33 44 55',
    dateOfBirth: '1975-11-08',
    gender: 'M',
    bloodGroup: 'A-',
    type: 'employee',
    position: 'Chef Maintenance',
    department: 'Maintenance',
    hireDate: '2010-01-20',
    status: 'active',
    lastVisit: '2024-08-10',
    nextVisit: '2025-08-10',
    medicalStatus: 'fit'
  },
  {
    id: '9',
    matricule: 'EMP-SOGARA-0006',
    fullName: 'Pierrette NOMSI',
    email: 'pierrette.nomsi@sogara.ga',
    phone: '+241 07 45 67 89',
    dateOfBirth: '1985-04-15',
    gender: 'F',
    bloodGroup: 'O+',
    type: 'employee',
    position: 'Chef QUALITÉ et CONFORMITÉ',
    department: 'Qualité',
    hireDate: '2016-04-12',
    status: 'active',
    lastVisit: '2024-10-18',
    nextVisit: '2025-01-18',
    medicalStatus: 'fit'
  },
  {
    id: '10',
    matricule: 'FAM-SOGARA-0006-01',
    fullName: 'Jean NOMSI',
    email: 'jean.nomsi@gmail.com',
    phone: '+241 07 45 67 90',
    dateOfBirth: '1983-08-25',
    gender: 'M',
    bloodGroup: 'O+',
    type: 'family',
    linkedTo: 'Pierrette NOMSI',
    relationship: 'Conjoint',
    status: 'active',
    lastVisit: '2024-06-12',
    medicalStatus: 'fit'
  },
  {
    id: '11',
    matricule: 'EMP-SOGARA-0007',
    fullName: 'Alain MOUSSAVOU',
    email: 'alain.moussavou@sogara.ga',
    phone: '+241 07 44 55 66',
    dateOfBirth: '1990-02-18',
    gender: 'M',
    bloodGroup: 'B+',
    type: 'employee',
    position: 'Technicien Raffinerie',
    department: 'Production',
    hireDate: '2019-08-15',
    status: 'active',
    lastVisit: '2024-11-10',
    nextVisit: '2025-11-10',
    medicalStatus: 'fit'
  },
  {
    id: '12',
    matricule: 'EMP-SOGARA-0008',
    fullName: 'Sylvie MENGUE',
    email: 'sylvie.mengue@sogara.ga',
    phone: '+241 07 55 66 77',
    dateOfBirth: '1992-07-22',
    gender: 'F',
    bloodGroup: 'O+',
    type: 'employee',
    position: 'Assistante RH',
    department: 'Ressources Humaines',
    hireDate: '2020-02-01',
    status: 'active',
    lastVisit: '2024-09-05',
    nextVisit: '2025-09-05',
    medicalStatus: 'fit'
  }
];

export default function SogaraBeneficiaries() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMedicalStatus, setFilterMedicalStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredBeneficiaries = useMemo(() => {
    return mockBeneficiaries.filter((beneficiary) => {
      const matchesSearch = 
        beneficiary.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.position?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'employees' && beneficiary.type === 'employee') ||
        (activeTab === 'family' && beneficiary.type === 'family');

      const matchesDepartment = 
        filterDepartment === 'all' || 
        beneficiary.department === filterDepartment;

      const matchesStatus = 
        filterStatus === 'all' || 
        beneficiary.status === filterStatus;

      const matchesMedicalStatus = 
        filterMedicalStatus === 'all' || 
        beneficiary.medicalStatus === filterMedicalStatus;

      return matchesSearch && matchesTab && matchesDepartment && matchesStatus && matchesMedicalStatus;
    });
  }, [searchQuery, activeTab, filterDepartment, filterStatus, filterMedicalStatus]);

  const stats = useMemo(() => {
    const employees = mockBeneficiaries.filter(b => b.type === 'employee');
    const family = mockBeneficiaries.filter(b => b.type === 'family');
    const activeEmployees = employees.filter(b => b.status === 'active');
    const pendingVisits = mockBeneficiaries.filter(b => b.medicalStatus === 'pending');

    return {
      total: mockBeneficiaries.length,
      employees: employees.length,
      family: family.length,
      activeEmployees: activeEmployees.length,
      pendingVisits: pendingVisits.length
    };
  }, []);

  const departments = useMemo(() => {
    const depts = new Set(mockBeneficiaries
      .filter(b => b.department)
      .map(b => b.department));
    return Array.from(depts);
  }, []);

  const getMedicalStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      fit: { label: 'Apte', className: 'bg-green-100 text-green-700 border-green-300' },
      pending: { label: 'À revoir', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      restricted: { label: 'Restreint', className: 'bg-orange-100 text-orange-700 border-orange-300' },
      unfit: { label: 'Inapte', className: 'bg-red-100 text-red-700 border-red-300' }
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className} variant="outline">{variant.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      active: { label: 'Actif', className: 'bg-green-100 text-green-700' },
      inactive: { label: 'Inactif', className: 'bg-gray-100 text-gray-700' },
      suspended: { label: 'Suspendu', className: 'bg-red-100 text-red-700' }
    };
    const variant = variants[status] || variants.active;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Patients - Ayants Droit SOGARA
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion des employés SOGARA et de leurs familles bénéficiaires
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {}}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={() => {}}>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un ayant droit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ayants Droit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Employés + Familles
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Employés SOGARA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {stats.employees}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {stats.activeEmployees} actifs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                Membres Familles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">
                {stats.family}
              </div>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                Conjoints & Enfants
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Visites en attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.pendingVisits}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                À planifier
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Aptes au travail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {stats.employees - stats.pendingVisits}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Certificats valides
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recherche et Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, matricule, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept!}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMedicalStatus} onValueChange={setFilterMedicalStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Aptitude" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes aptitudes</SelectItem>
                  <SelectItem value="fit">Apte</SelectItem>
                  <SelectItem value="pending">À revoir</SelectItem>
                  <SelectItem value="restricted">Restreint</SelectItem>
                  <SelectItem value="unfit">Inapte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Table with Tabs */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Liste des Ayants Droit</CardTitle>
                  <CardDescription>
                    {filteredBeneficiaries.length} bénéficiaire(s) trouvé(s)
                  </CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="all">
                    Tous ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger value="employees">
                    Employés ({stats.employees})
                  </TabsTrigger>
                  <TabsTrigger value="family">
                    Familles ({stats.family})
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent>
              <TabsContent value={activeTab} className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matricule</TableHead>
                        <TableHead>Nom Complet</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Poste / Lien</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Aptitude</TableHead>
                        <TableHead>Dernière visite</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBeneficiaries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Aucun bénéficiaire trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBeneficiaries.map((beneficiary) => (
                          <TableRow key={beneficiary.id}>
                            <TableCell className="font-mono text-xs">
                              {beneficiary.matricule}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {beneficiary.type === 'employee' ? (
                                  <Briefcase className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Heart className="h-4 w-4 text-pink-500" />
                                )}
                                <div>
                                  <div className="font-medium">{beneficiary.fullName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {beneficiary.gender === 'M' ? 'Homme' : 'Femme'} • {beneficiary.bloodGroup}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {beneficiary.type === 'employee' ? (
                                <Badge variant="default">Employé</Badge>
                              ) : (
                                <Badge variant="secondary">Famille</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {beneficiary.type === 'employee' ? (
                                <div>
                                  <div className="text-sm font-medium">{beneficiary.position}</div>
                                  <div className="text-xs text-muted-foreground">{beneficiary.department}</div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-sm">{beneficiary.relationship}</div>
                                  <div className="text-xs text-muted-foreground">de {beneficiary.linkedTo}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs">
                                  <Mail className="h-3 w-3" />
                                  {beneficiary.email}
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <Phone className="h-3 w-3" />
                                  {beneficiary.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(beneficiary.status)}
                            </TableCell>
                            <TableCell>
                              {getMedicalStatusBadge(beneficiary.medicalStatus)}
                            </TableCell>
                            <TableCell>
                              {beneficiary.lastVisit ? (
                                <div className="text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    {new Date(beneficiary.lastVisit).toLocaleDateString('fr-FR')}
                                  </div>
                                  {beneficiary.nextVisit && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Prochain: {new Date(beneficiary.nextVisit).toLocaleDateString('fr-FR')}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Jamais</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/patient/${beneficiary.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {}}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}

