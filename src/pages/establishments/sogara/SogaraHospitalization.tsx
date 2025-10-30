import { ProfessionalEstablishmentLayout } from "@/components/layout/ProfessionalEstablishmentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bed, Users, TrendingUp, Clock, Plus, Building2
} from "lucide-react";

export default function SogaraHospitalization() {
  const stats = {
    totalBeds: 85,
    occupiedBeds: 58,
    availableBeds: 27,
    occupancyRate: 68,
    patientsToday: 58,
    averageStay: 4.2
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bed className="w-8 h-8 text-primary" />
              Hospitalisation
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion des lits et des patients hospitalisés
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle admission
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lits totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBeds}</div>
              <p className="text-xs text-muted-foreground mt-1">Capacité totale</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lits occupés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.occupiedBeds}</div>
              <p className="text-xs text-muted-foreground mt-1">Patients hospitalisés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lits disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.availableBeds}</div>
              <p className="text-xs text-muted-foreground mt-1">Immédiatement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux d'occupation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
              <Badge className="mt-1 bg-green-500/20 text-green-700 border-green-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Normal
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Services d'hospitalisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Médecine générale", beds: 30, occupied: 22 },
                { name: "Chirurgie", beds: 25, occupied: 18 },
                { name: "Maternité", beds: 20, occupied: 12 },
                { name: "Soins intensifs", beds: 10, occupied: 6 }
              ].map((service, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <Badge variant="outline">{service.occupied}/{service.beds}</Badge>
                    </div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(service.occupied / service.beds) * 100}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}

