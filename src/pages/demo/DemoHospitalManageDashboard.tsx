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
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  User,
  Briefcase
} from "lucide-react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";

interface EstablishmentMember {
  id: string;
  type: "patient" | "professional";
  name: string;
  email: string;
  role: string;
  speciality?: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  affiliation: "cabinet" | "clinique" | "chu" | "cmst" | "multiple";
  otherAffiliations?: string[];
}

export default function DemoHospitalManageDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const hospitalData = {
    name: "CHU Owendo",
    location: "Libreville, Boulevard du Bord de Mer",
    totalMembers: 10,
    activeMembers: 9,
    consultationsThisMonth: 156,
    revenue: 28500000,
    pendingApprovals: 1,
    type: "chu"
  };

  // Médecins pouvant consulter au CHU (réutilisés du système + spécifiques CHU)
  const professionals: EstablishmentMember[] = [
    {
      id: "prof-chu-01",
      type: "professional",
      name: "Dr. Pierre KOMBILA",
      email: "medecin.demo@sante.ga",
      role: "Médecin Généraliste",
      speciality: "Médecine Générale",
      phone: "+241 01 234 568",
      status: "active",
      affiliation: "multiple",
      otherAffiliations: ["Cabinet privé", "Clinique Sainte-Marie"]
    },
    {
      id: "prof-chu-02",
      type: "professional",
      name: "Dr. Sylvie NGUEMA",
      email: "specialiste.demo@sante.ga",
      role: "Cardiologue",
      speciality: "Cardiologie",
      phone: "+241 01 234 569",
      status: "active",
      affiliation: "chu",
      otherAffiliations: []
    },
    {
      id: "prof-chu-03",
      type: "professional",
      name: "Dr. François OVONO",
      email: "anesthesiste.demo@sante.ga",
      role: "Anesthésiste",
      speciality: "Anesthésie",
      phone: "+241 01 234 575",
      status: "active",
      affiliation: "chu",
      otherAffiliations: []
    },
    {
      id: "prof-chu-04",
      type: "professional",
      name: "Sophie MBOUMBA",
      email: "infirmiere.demo@sante.ga",
      role: "Infirmière",
      phone: "+241 01 234 570",
      status: "active",
      affiliation: "multiple",
      otherAffiliations: ["Clinique Sainte-Marie"]
    }
  ];

  // Patients pouvant être soignés au CHU
  const patients: EstablishmentMember[] = [
    {
      id: "pat-chu-01",
      type: "patient",
      name: "Marie OKOME",
      email: "patient.demo@sante.ga",
      role: "Patient",
      phone: "+241 01 234 567",
      status: "active",
      affiliation: "multiple",
      otherAffiliations: ["Cabinet privé", "Clinique Sainte-Marie"]
    },
    {
      id: "pat-chu-02",
      type: "patient",
      name: "Alain MOUSSAVOU",
      email: "patient.sogara.01@sante.ga",
      role: "Employé SOGARA",
      phone: "+241 01 234 588",
      status: "active",
      affiliation: "multiple",
      otherAffiliations: ["CMST SOGARA"]
    },
    {
      id: "pat-chu-03",
      type: "patient",
      name: "Rachel MVELE",
      email: "patient.sogara.02@sante.ga",
      role: "Employée SOGARA",
      phone: "+241 01 234 589",
      status: "active",
      affiliation: "chu",
      otherAffiliations: []
    },
    {
      id: "pat-chu-04",
      type: "patient",
      name: "Yannick BANGA",
      email: "patient.sogara.03@sante.ga",
      role: "Ayant droit",
      phone: "+241 01 234 590",
      status: "active",
      affiliation: "chu",
      otherAffiliations: []
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

  const getAffiliationBadge = (affiliation: string, otherAffiliations?: string[]) => {
    const label = affiliation === "multiple" 
      ? `Plusieurs établissements (${otherAffiliations?.length || 0})`
      : affiliation === "chu" 
      ? "CHU Owendo"
      : affiliation === "clinique"
      ? "Clinique Sainte-Marie"
      : affiliation === "cmst"
      ? "CMST SOGARA"
      : "Cabinet privé";

    return (
      <Badge variant="outline" className="bg-blue-50">
        {label}
      </Badge>
    );
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {hospitalData.name}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {hospitalData.location}
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
              <div className="text-2xl font-bold">{hospitalData.totalMembers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {hospitalData.activeMembers} actifs
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
                {hospitalData.consultationsThisMonth}
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
                {(hospitalData.revenue / 1000000).toFixed(1)}M
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
                {hospitalData.pendingApprovals}
              </div>
              <p className="text-xs text-gray-500 mt-1">Approbations</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900">Architecture Multi-Établissements</p>
            <p className="text-blue-700 mt-1">
              Les médecins et patients peuvent être affiliés à plusieurs établissements. 
              Un médecin peut consulter au CHU, à la clinique et avoir son cabinet. 
              Un patient peut être soigné dans plusieurs lieux.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Professionnels ({professionals.length})
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patients ({patients.length})
            </TabsTrigger>
          </TabsList>

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
                              {prof.status === "active" ? "Actif" : prof.status === "pending" ? "En attente" : "Inactif"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">Affiliation</p>
                            {getAffiliationBadge(prof.affiliation, prof.otherAffiliations)}
                          </div>
                        </div>

                        {prof.otherAffiliations && prof.otherAffiliations.length > 0 && (
                          <div className="mt-3 text-xs">
                            <p className="text-gray-500 mb-1">Autres lieux:</p>
                            <div className="flex flex-wrap gap-2">
                              {prof.otherAffiliations.map((aff) => (
                                <Badge key={aff} variant="secondary" className="text-xs">
                                  {aff}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
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
                              {patient.status === "active" ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">Affiliation</p>
                            {getAffiliationBadge(patient.affiliation, patient.otherAffiliations)}
                          </div>
                        </div>

                        {patient.otherAffiliations && patient.otherAffiliations.length > 0 && (
                          <div className="mt-3 text-xs">
                            <p className="text-gray-500 mb-1">Aussi suivi à:</p>
                            <div className="flex flex-wrap gap-2">
                              {patient.otherAffiliations.map((aff) => (
                                <Badge key={aff} variant="secondary" className="text-xs">
                                  {aff}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
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
