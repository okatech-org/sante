import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Plus } from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoPlanning() {
  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Planning</h1>
            <p className="text-muted-foreground">Gestion du planning hospitalier</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau planning
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Équipes programmées</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <Users className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gardes cette semaine</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Événements du mois</p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <Calendar className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier du personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Fonctionnalité de planning en développement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HospitalDashboardLayout>
  );
}
