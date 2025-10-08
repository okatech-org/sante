import { useState } from "react";
import { Users, Search, Filter, UserPlus, Phone, Mail, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { usePatients } from "@/hooks/usePatients";

export default function ProfessionalPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const { patients, stats, loading, error } = usePatients(searchQuery);


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

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PatientDashboardLayout>
    );
  }

  if (error) {
    return (
      <PatientDashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Total Patients</p>
            <p className="text-3xl font-bold text-foreground mb-1">{stats.total}</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Suivi Actif</p>
            <p className="text-3xl font-bold text-foreground mb-1">{stats.active}</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Nouveau ce mois</p>
            <p className="text-3xl font-bold text-foreground mb-1">{stats.newThisMonth}</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-orange-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">RDV à venir</p>
            <p className="text-3xl font-bold text-foreground mb-1">{stats.upcomingAppointments}</p>
          </div>
        </div>

        {/* Recherche */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, CNAMGS, téléphone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Button variant="outline" className="rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button className="rounded-xl">
                <UserPlus className="mr-2 h-4 w-4" />
                Nouveau Patient
              </Button>
            </div>
          </div>
        </Card>

        {/* Liste Patients */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Liste des Patients</h2>
            <div className="space-y-4">
              {patients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun patient trouvé</p>
                </div>
              ) : (
                patients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="rounded-2xl backdrop-blur-xl p-5 bg-card/60 border border-border/20 hover:bg-card/80 transition-all cursor-pointer hover:scale-[1.01] shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-foreground font-bold">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            {patient.name}
                            <span className="text-sm text-muted-foreground font-normal">
                              ({patient.age} ans, {patient.gender})
                            </span>
                          </h4>
                          {patient.cnamgs && (
                            <p className="text-sm text-muted-foreground font-mono">CNAMGS: {patient.cnamgs}</p>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(patient.status)} rounded-full px-4`}>
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
                            <Badge key={idx} variant="outline" className="text-xs rounded-full">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}
