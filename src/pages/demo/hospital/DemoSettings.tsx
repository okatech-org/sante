import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Building2, Users, Bell, Save } from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function DemoSettings() {
  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Configuration de l'établissement</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Building2 className="w-4 h-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'établissement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'établissement</Label>
                  <Input id="name" defaultValue="CHU Owendo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" defaultValue="Centre Hospitalier Universitaire" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" defaultValue="Owendo, Libreville - Gabon" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+241 01 XX XX XX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contact@chu-owendo.ga" />
                </div>

                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="beds">Nombre total de lits</Label>
                  <Input id="beds" type="number" defaultValue="450" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Nombre de salles d'opération</Label>
                  <Input id="rooms" type="number" defaultValue="8" />
                </div>

                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des accès</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Gérez les utilisateurs et leurs permissions pour accéder au système.
                  </p>
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Gérer les utilisateurs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes de rupture de stock</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications pour les ruptures de stock</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Urgences critiques</Label>
                    <p className="text-sm text-muted-foreground">Notifications pour les urgences vitales</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapports quotidiens</Label>
                    <p className="text-sm text-muted-foreground">Recevoir un résumé quotidien par email</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes équipements</Label>
                    <p className="text-sm text-muted-foreground">Notifications de maintenance des équipements</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer les préférences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HospitalDashboardLayout>
  );
}
