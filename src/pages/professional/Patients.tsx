import { useState } from "react";
import { Users, Search, Filter, UserPlus, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfessionalPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    {
      id: 1,
      name: "Marie MOUSSAVOU",
      age: 38,
      gender: "F",
      cnamgs: "GAB123456789",
      phone: "+241 06 12 34 56",
      email: "marie.m@email.com",
      lastVisit: "2025-02-01",
      nextVisit: "2025-02-15",
      conditions: ["Diabète Type 2", "Hypertension"],
      status: "suivi_actif"
    },
    {
      id: 2,
      name: "Jean NZENGUE",
      age: 52,
      gender: "M",
      cnamgs: "GAB987654321",
      phone: "+241 06 98 76 54",
      email: "jean.n@email.com",
      lastVisit: "2025-01-28",
      nextVisit: null,
      conditions: ["Hypertension"],
      status: "suivi_actif"
    },
    {
      id: 3,
      name: "Claire OBAME",
      age: 29,
      gender: "F",
      cnamgs: null,
      phone: "+241 06 45 67 89",
      email: "claire.o@email.com",
      lastVisit: "2025-01-15",
      nextVisit: null,
      conditions: [],
      status: "occasionnel"
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "suivi_actif": return "bg-green-500/10 text-green-500";
      case "occasionnel": return "bg-blue-500/10 text-blue-500";
      case "inactif": return "bg-gray-500/10 text-gray-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Patients</h1>
          <p className="text-muted-foreground">Gestion de votre patientèle</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">234</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suivi Actif</p>
                <p className="text-2xl font-bold text-green-500">156</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nouveau ce mois</p>
                <p className="text-2xl font-bold text-blue-500">12</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RDV à venir</p>
                <p className="text-2xl font-bold text-orange-500">28</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, CNAMGS, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="suivi_actif">Suivi actif</TabsTrigger>
              <TabsTrigger value="occasionnel">Occasionnels</TabsTrigger>
              <TabsTrigger value="inactif">Inactifs</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {patients.map((patient) => (
                <Card key={patient.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {patient.name}
                              <span className="text-sm text-muted-foreground font-normal">
                                ({patient.age} ans, {patient.gender})
                              </span>
                            </h4>
                            {patient.cnamgs && (
                              <p className="text-sm text-muted-foreground">CNAMGS: {patient.cnamgs}</p>
                            )}
                          </div>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Dernière visite: {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        {patient.conditions.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {patient.conditions.map((condition, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
