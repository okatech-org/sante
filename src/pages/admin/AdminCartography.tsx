import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  MapPin, 
  Building2, 
  Activity, 
  Users,
  Download,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminCartography() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    // Logique de synchronisation ici
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const stats = {
    totalProviders: 414,
    hospitals: 52,
    clinics: 128,
    pharmacies: 234,
  };

  return (
    <SuperAdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4">
        {/* Header */}
        <Card className="border-2">
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Map className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Cartographie Santé</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Gérer les données de cartographie des acteurs de santé
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={handleSync} 
                  disabled={isSyncing}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 sm:flex-none"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  Synchroniser
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Total
              </CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.totalProviders}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Hôpitaux
              </CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.hospitals}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs flex items-center gap-1">
                <Users className="h-3 w-3" />
                Cliniques
              </CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.clinics}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Pharmacies
              </CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.pharmacies}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="border-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="w-full grid grid-cols-3 h-auto bg-transparent p-0">
                <TabsTrigger 
                  value="overview" 
                  className="text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger 
                  value="providers" 
                  className="text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Acteurs
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Carte
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-3 sm:space-y-4 mt-0 p-2 sm:p-3">
              <Card className="border shadow-sm">
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-sm sm:text-base">Statistiques par province</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { province: "Estuaire", count: 156 },
                      { province: "Haut-Ogooué", count: 68 },
                      { province: "Moyen-Ogooué", count: 42 },
                      { province: "Ngounié", count: 38 },
                    ].map((item) => (
                      <div key={item.province} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <span className="text-xs sm:text-sm">{item.province}</span>
                        <Badge variant="secondary" className="text-xs">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="providers" className="space-y-3 sm:space-y-4 mt-0 p-2 sm:p-3">
              <Card className="border shadow-sm">
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-sm sm:text-base">Liste des acteurs de santé</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Voir la page "Acteurs de Santé" pour la liste complète
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map" className="space-y-3 sm:space-y-4 mt-0 p-2 sm:p-3">
              <Card className="border shadow-sm">
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-sm sm:text-base">Carte interactive</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                    <Map className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
