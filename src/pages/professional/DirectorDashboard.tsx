import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Shield, Building2, Users, Activity, 
  DollarSign, FileText, TrendingUp, Award,
  Heart, Briefcase, Search, Eye, Calendar,
  Mail, Phone, UserCheck
} from 'lucide-react';

const mockBeneficiaries = [
  { id: '1', matricule: 'EMP-SOGARA-0001', fullName: 'Christian AVARO', type: 'employee', position: 'Directeur Général', department: 'Direction', email: 'christian.avaro@sogara.ga', phone: '+241 07 01 02 03', medicalStatus: 'fit', lastVisit: '2024-10-15' },
  { id: '2', matricule: 'FAM-SOGARA-0001-01', fullName: 'Marie AVARO', type: 'family', linkedTo: 'Christian AVARO', relationship: 'Conjointe', email: 'marie.avaro@gmail.com', phone: '+241 07 01 02 04', medicalStatus: 'fit', lastVisit: '2024-09-10' },
  { id: '3', matricule: 'FAM-SOGARA-0001-02', fullName: 'Sophie AVARO', type: 'family', linkedTo: 'Christian AVARO', relationship: 'Enfant', email: 'sophie.avaro@gmail.com', phone: '+241 07 01 02 05', medicalStatus: 'fit', lastVisit: '2024-08-22' },
  { id: '4', matricule: 'EMP-SOGARA-0002', fullName: 'Ingride TCHEN', type: 'employee', position: 'Directrice Financière', department: 'Finance', email: 'ingride.tchen@sogara.ga', phone: '+241 07 04 05 06', medicalStatus: 'fit', lastVisit: '2024-11-05' },
  { id: '5', matricule: 'EMP-SOGARA-0003', fullName: 'Jean NZENGUE', type: 'employee', position: 'Chef Production', department: 'Production', email: 'jean.nzengue@sogara.ga', phone: '+241 07 11 22 33', medicalStatus: 'fit', lastVisit: '2024-09-30' },
  { id: '6', matricule: 'FAM-SOGARA-0003-01', fullName: 'Claire NZENGUE', type: 'family', linkedTo: 'Jean NZENGUE', relationship: 'Conjointe', email: 'claire.nzengue@gmail.com', phone: '+241 07 11 22 34', medicalStatus: 'pending', lastVisit: '2024-07-15' },
  { id: '7', matricule: 'EMP-SOGARA-0004', fullName: 'Marie MOUSSAVOU', type: 'employee', position: 'Responsable HSE', department: 'HSE', email: 'marie.moussavou@sogara.ga', phone: '+241 07 22 33 44', medicalStatus: 'fit', lastVisit: '2024-10-20' },
  { id: '8', matricule: 'EMP-SOGARA-0005', fullName: 'Paul OBAME', type: 'employee', position: 'Chef Maintenance', department: 'Maintenance', email: 'paul.obame@sogara.ga', phone: '+241 07 33 44 55', medicalStatus: 'fit', lastVisit: '2024-08-10' },
  { id: '9', matricule: 'EMP-SOGARA-0006', fullName: 'Pierrette NOMSI', type: 'employee', position: 'Chef QUALITÉ', department: 'Qualité', email: 'pierrette.nomsi@sogara.ga', phone: '+241 07 45 67 89', medicalStatus: 'fit', lastVisit: '2024-10-18' },
  { id: '10', matricule: 'FAM-SOGARA-0006-01', fullName: 'Jean NOMSI', type: 'family', linkedTo: 'Pierrette NOMSI', relationship: 'Conjoint', email: 'jean.nomsi@gmail.com', phone: '+241 07 45 67 90', medicalStatus: 'fit', lastVisit: '2024-06-12' },
  { id: '11', matricule: 'EMP-SOGARA-0007', fullName: 'Alain MOUSSAVOU', type: 'employee', position: 'Technicien Raffinerie', department: 'Production', email: 'alain.moussavou@sogara.ga', phone: '+241 07 44 55 66', medicalStatus: 'fit', lastVisit: '2024-11-10' },
  { id: '12', matricule: 'EMP-SOGARA-0008', fullName: 'Sylvie MENGUE', type: 'employee', position: 'Assistante RH', department: 'RH', email: 'sylvie.mengue@sogara.ga', phone: '+241 07 55 66 77', medicalStatus: 'fit', lastVisit: '2024-09-05' }
];

export default function DirectorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredBeneficiaries = mockBeneficiaries.filter(b => {
    const matchesSearch = b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.matricule.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'employees' && b.type === 'employee') ||
      (activeTab === 'family' && b.type === 'family');
    return matchesSearch && matchesTab;
  });

  const employeesCount = mockBeneficiaries.filter(b => b.type === 'employee').length;
  const familyCount = mockBeneficiaries.filter(b => b.type === 'family').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Tableau de Bord Direction
          </h1>
        <p className="text-muted-foreground mt-1">
            Vue d'ensemble de l'établissement
        </p>
      </div>
        <Badge className="px-4 py-2 text-lg">
          Médecin en Chef
              </Badge>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Personnel</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ayants Droit</p>
              <p className="text-2xl font-bold">1,250</p>
              <p className="text-xs text-cyan-600 mt-1">Employés SOGARA</p>
            </div>
            <Users className="h-8 w-8 text-cyan-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patients/Mois</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
              <p className="text-2xl font-bold">250M</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux occupation</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* VOLET PATIENTS / AYANTS DROIT */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Patients / Ayants Droit SOGARA
              </CardTitle>
              <CardDescription>
                Employés SOGARA et leurs familles bénéficiaires de soins au CMST
              </CardDescription>
            </div>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {employeesCount}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Employés SOGARA</p>
            </div>
            <div className="text-center p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                  {familyCount}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Membres Familles</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {mockBeneficiaries.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Total Ayants Droit</p>
            </div>
          </div>

          {/* Recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un ayant droit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">
                Tous ({mockBeneficiaries.length})
              </TabsTrigger>
              <TabsTrigger value="employees">
                Employés ({employeesCount})
              </TabsTrigger>
              <TabsTrigger value="family">
                Familles ({familyCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Poste / Lien</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut Médical</TableHead>
                      <TableHead>Dernière Visite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBeneficiaries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Aucun ayant droit trouvé
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
                              <span className="font-medium">{beneficiary.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {beneficiary.type === 'employee' ? (
                              <Badge className="bg-blue-100 text-blue-700">Employé</Badge>
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
                                <span className="truncate max-w-[150px]">{beneficiary.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Phone className="h-3 w-3" />
                                {beneficiary.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {beneficiary.medicalStatus === 'fit' ? (
                              <Badge className="bg-green-100 text-green-700 border-green-300" variant="outline">
                                Apte
                              </Badge>
                            ) : beneficiary.medicalStatus === 'pending' ? (
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300" variant="outline">
                                À revoir
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700" variant="outline">
                                Non défini
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {beneficiary.lastVisit ? (
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {new Date(beneficiary.lastVisit).toLocaleDateString('fr-FR')}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Jamais</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}