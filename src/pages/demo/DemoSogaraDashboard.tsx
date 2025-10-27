import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  Building2,
  Activity,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  User,
  Briefcase,
  Phone,
  Mail
} from "lucide-react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";

interface CMSTMember {
  id: string;
  type: "patient" | "professional";
  name: string;
  email: string;
  role: string;
  speciality?: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  joinedDate: string;
  consultations?: number;
}

export default function DemoSogaraDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Données du CMST SOGARA
  const sogaraData = {
    name: "Centre de Médecine de Santé au Travail (CMST) SOGARA",
    location: "Port-Gentil, Route de la Sogara",
    totalMembers: 13,
    activeMembers: 12,
    consultationsThisMonth: 24,
    revenue: 2850000,
    pendingApprovals: 0
  };

  // Professionnels assignés au CMST SOGARA
  const professionals: CMSTMember[] = [
    {
      id: "prof-cmst-01",
      type: "professional",
      name: "Dr. Jean-Paul NZENZE",
      email: "medecin.cmst@sogara.ga",
      role: "Médecin du Travail",
      speciality: "Médecine du Travail",
      phone: "+241 06 XX XX XX",
      status: "active",
      joinedDate: "2025-01-13",
      consultations: 0
    },
    {
      id: "prof-cmst-02",
      type: "professional",
      name: "Marie BOUNDA",
      email: "infirmiere.cmst@sogara.ga",
      role: "Infirmière",
      phone: "+241 06 XX XX XX",
      status: "active",
      joinedDate: "2025-01-13",
      consultations: 0
    },
    {
      id: "prof-cmst-03",
      type: "professional",
      name: "Paul OKANDZE",
      email: "admin.cmst@sogara.ga",
      role: "Administrateur",
      phone: "+241 06 XX XX XX",
      status: "active",
      joinedDate: "2025-01-13",
      consultations: 0
    },
    {
      id: "prof-01",
      type: "professional",
      name: "Dr. Jean-Pierre MBENGONO",
      email: "dr.travail.sogara@sante.ga",
      role: "Médecin du Travail",
      speciality: "Médecine du Travail",
      phone: "+241 01 55 26 21",
      status: "active",
      joinedDate: "2024-10-27",
      consultations: 12
    },
    {
      id: "prof-02",
      type: "professional",
      name: "Dr. Pierre KOMBILA",
      email: "medecin.demo@sante.ga",
      role: "Médecin Généraliste",
      speciality: "Médecine Générale",
      phone: "+241 01 234 568",
      status: "active",
      joinedDate: "2024-10-20",
      consultations: 8
    },
    {
      id: "prof-03",
      type: "professional",
      name: "Pierre ONDIMBA",
      email: "infirmier.sogara@sante.ga",
      role: "Infirmier",
      phone: "+241 01 55 26 22",
      status: "active",
      joinedDate: "2024-10-27",
      consultations: 4
    },
    {
      id: "prof-04",
      type: "professional",
      name: "Sophie MBOUMBA",
      email: "infirmiere.demo@sante.ga",
      role: "Infirmière",
      phone: "+241 01 234 570",
      status: "pending",
      joinedDate: "2024-10-25",
      consultations: 0
    }
  ];

  // Patients assignés au CMST SOGARA
  const patients: CMSTMember[] = [
    {
      id: "pat-01",
      type: "patient",
      name: "Alain MOUSSAVOU",
      email: "patient.sogara.01@sante.ga",
      role: "Employé SOGARA",
      phone: "+241 01 234 588",
      status: "active",
      joinedDate: "2024-10-27"
    },
    {
      id: "pat-02",
      type: "patient",
      name: "Rachel MVELE",
      email: "patient.sogara.02@sante.ga",
      role: "Employée SOGARA",
      phone: "+241 01 234 589",
      status: "active",
      joinedDate: "2024-10-27"
    },
    {
      id: "pat-03",
      type: "patient",
      name: "Yannick BANGA",
      email: "patient.sogara.03@sante.ga",
      role: "Ayant droit SOGARA",
      phone: "+241 01 234 590",
      status: "active",
      joinedDate: "2024-10-27"
    },
    {
      id: "pat-04",
      type: "patient",
      name: "Marie OKOME",
      email: "patient.demo@sante.ga",
      role: "Patient General",
      phone: "+241 01 234 567",
      status: "active",
      joinedDate: "2024-10-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "inactive":
        return <EyeOff className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {sogaraData.name}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {sogaraData.location}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            <Button size="sm" className="bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter Membre
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Membres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sogaraData.totalMembers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {sogaraData.activeMembers} actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sogaraData.consultationsThisMonth}
              </div>
              <p className="text-xs text-gray-500 mt-1">Ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Revenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(sogaraData.revenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-500 mt-1">FCFA</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                En Attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {sogaraData.pendingApprovals}
              </div>
              <p className="text-xs text-gray-500 mt-1">Approbations</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Vue d'ensemble
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Écosystème CMST SOGARA</CardTitle>
                <CardDescription>
                  Gestion complète des professionnels et patients du centre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      Professionnels
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Médecins:</span> 3
                      </p>
                      <p>
                        <span className="font-medium">Infirmiers:</span> 2
                      </p>
                      <p>
                        <span className="font-medium">Administrateurs:</span> 1
                      </p>
                      <p className="text-gray-500">
                        Total: 7 professionnels assignés
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-green-600" />
                      Patients
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Employés SOGARA:</span> 3
                      </p>
                      <p>
                        <span className="font-medium">Patients généraux:</span> 1
                      </p>
                      <p className="text-gray-500">
                        Total: 4 patients assignés
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900">
                      Architecture Écosystème
                    </p>
                    <p className="text-blue-700 mt-1">
                      Les comptes assignés au CMST SOGARA incluent à la fois des
                      comptes démo spécifiques SOGARA et des comptes existants du
                      système général réaffectés pour les tests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-4">
            <div className="grid gap-4">
              {professionals.map((prof) => (
                <Card key={prof.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-100 rounded-full p-3">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {prof.name}
                            </h3>
                            <p className="text-sm text-gray-600">{prof.role}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-gray-900 break-all">
                              {prof.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Téléphone</p>
                            <p className="font-medium text-gray-900">
                              {prof.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Statut</p>
                            <Badge className={`mt-1 ${getStatusColor(prof.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(prof.status)}
                                {prof.status === "active"
                                  ? "Actif"
                                  : prof.status === "pending"
                                  ? "En attente"
                                  : "Inactif"}
                              </span>
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">Consultations</p>
                            <p className="font-medium text-gray-900">
                              {prof.consultations || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4">
            <div className="grid gap-4">
              {patients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-green-100 rounded-full p-3">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {patient.role}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-gray-900 break-all">
                              {patient.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Téléphone</p>
                            <p className="font-medium text-gray-900">
                              {patient.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Statut</p>
                            <Badge className={`mt-1 ${getStatusColor(patient.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(patient.status)}
                                {patient.status === "active"
                                  ? "Actif"
                                  : patient.status === "pending"
                                  ? "En attente"
                                  : "Inactif"}
                              </span>
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">Adhésion</p>
                            <p className="font-medium text-gray-900">
                              {new Date(patient.joinedDate).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
