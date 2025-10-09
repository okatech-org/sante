import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Pill, Search, AlertTriangle, TrendingDown, TrendingUp, 
  Package, ShoppingCart, FileText, Clock, Check, X
} from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoPharmacy() {
  const [searchTerm, setSearchTerm] = useState("");

  const stockAlerts = [
    {
      medicament: "Insuline NPH 100UI/ml",
      categorie: "Antidiabétique",
      stock: 12,
      stockMinimum: 50,
      consommationMoyenne: 4,
      joursRestants: 3,
      criticite: "haute",
      valeurStock: 36000,
      fournisseur: "UbiPharm"
    },
    {
      medicament: "Paracétamol 500mg",
      categorie: "Antalgique",
      stock: 500,
      stockMinimum: 1000,
      consommationMoyenne: 100,
      joursRestants: 5,
      criticite: "moyenne",
      valeurStock: 25000,
      fournisseur: "Pharmacie Centrale"
    },
    {
      medicament: "Morphine 10mg injectable",
      categorie: "Opioïde",
      stock: 8,
      stockMinimum: 30,
      consommationMoyenne: 1,
      joursRestants: 8,
      criticite: "haute",
      valeurStock: 48000,
      fournisseur: "CAMEG"
    },
    {
      medicament: "Amoxicilline 500mg",
      categorie: "Antibiotique",
      stock: 300,
      stockMinimum: 800,
      consommationMoyenne: 80,
      joursRestants: 4,
      criticite: "moyenne",
      valeurStock: 90000,
      fournisseur: "UbiPharm"
    }
  ];

  const activeOrders = [
    {
      id: "CMD-2025-0045",
      fournisseur: "UbiPharm",
      dateCommande: "2025-01-28",
      dateAttendue: "2025-02-03",
      statut: "en_cours",
      articles: 12,
      montant: 4500000,
      urgent: true
    },
    {
      id: "CMD-2025-0046",
      fournisseur: "Pharmacie Centrale",
      dateCommande: "2025-01-29",
      dateAttendue: "2025-02-05",
      statut: "validee",
      articles: 8,
      montant: 2300000,
      urgent: false
    },
    {
      id: "CMD-2025-0047",
      fournisseur: "CAMEG",
      dateCommande: "2025-01-30",
      dateAttendue: "2025-02-04",
      statut: "preparee",
      articles: 5,
      montant: 1800000,
      urgent: true
    }
  ];

  const topMedications = [
    { nom: "Paracétamol 500mg", consommation: 2340, tendance: "stable", valeur: 117000 },
    { nom: "Ibuprofène 400mg", consommation: 1890, tendance: "up", valeur: 189000 },
    { nom: "Amoxicilline 500mg", consommation: 1560, tendance: "down", valeur: 468000 },
    { nom: "Metformine 850mg", consommation: 1234, tendance: "up", valeur: 370200 },
    { nom: "Oméprazole 20mg", consommation: 980, tendance: "stable", valeur: 196000 },
    { nom: "Amlodipine 5mg", consommation: 876, tendance: "up", valeur: 262800 },
    { nom: "Enalapril 10mg", consommation: 745, tendance: "stable", valeur: 223500 },
    { nom: "Ciprofloxacine 500mg", consommation: 623, tendance: "down", valeur: 311500 }
  ];

  const recentMovements = [
    {
      type: "sortie",
      medicament: "Paracétamol 500mg",
      quantite: 100,
      service: "Urgences",
      date: "2025-02-01 09:30",
      demandeur: "Inf. MOUSSAVOU"
    },
    {
      type: "entree",
      medicament: "Insuline Rapide",
      quantite: 50,
      fournisseur: "UbiPharm",
      date: "2025-02-01 08:15",
      recepteur: "Pharm. OBAME"
    },
    {
      type: "sortie",
      medicament: "Morphine 10mg",
      quantite: 2,
      service: "Réanimation",
      date: "2025-02-01 07:45",
      demandeur: "Dr NZENGUE"
    },
    {
      type: "entree",
      medicament: "Amoxicilline 500mg",
      quantite: 200,
      fournisseur: "Pharmacie Centrale",
      date: "2025-01-31 16:30",
      recepteur: "Pharm. ELLA"
    }
  ];

  const getCriticiteBadge = (criticite: string) => {
    if (criticite === "haute") {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Critique</Badge>;
    }
    return <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">Attention</Badge>;
  };

  const getStatutBadge = (statut: string) => {
    const styles = {
      en_cours: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      validee: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
      preparee: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30"
    };
    
    const labels = {
      en_cours: "En cours",
      validee: "Validée",
      preparee: "Préparée"
    };

    return <Badge variant="outline" className={styles[statut as keyof typeof styles]}>{labels[statut as keyof typeof labels]}</Badge>;
  };

  const getTendanceIcon = (tendance: string) => {
    if (tendance === "up") return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (tendance === "down") return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion Pharmacie</h1>
            <p className="text-muted-foreground">CHU Libreville - Pharmacie Centrale</p>
          </div>
          <Button className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Nouvelle Commande
          </Button>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valeur stock</p>
                  <p className="text-2xl font-bold text-foreground">45M FCFA</p>
                  <p className="text-xs text-muted-foreground mt-1">1,234 références</p>
                </div>
                <Package className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertes rupture</p>
                  <p className="text-2xl font-bold text-destructive">4</p>
                  <p className="text-xs text-muted-foreground mt-1">Urgente</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commandes actives</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground mt-1">8.6M FCFA</p>
                </div>
                <ShoppingCart className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sorties aujourd'hui</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-xs text-muted-foreground mt-1">+12% vs hier</p>
                </div>
                <Pill className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un médicament, catégorie, fournisseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtres</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs principales */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Alertes ({stockAlerts.length})</TabsTrigger>
            <TabsTrigger value="orders">Commandes ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="top">Top consommations</TabsTrigger>
            <TabsTrigger value="movements">Mouvements</TabsTrigger>
          </TabsList>

          {/* Alertes de rupture */}
          <TabsContent value="alerts" className="space-y-4">
            {stockAlerts.map((alert, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{alert.medicament}</h3>
                        {getCriticiteBadge(alert.criticite)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.categorie}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Stock actuel</p>
                          <p className="text-xl font-bold text-destructive">{alert.stock}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stock minimum</p>
                          <p className="font-medium text-foreground">{alert.stockMinimum}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conso. moyenne/jour</p>
                          <p className="font-medium text-foreground">{alert.consommationMoyenne}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Jours restants</p>
                          <p className="text-xl font-bold text-destructive">{alert.joursRestants}j</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valeur stock</p>
                          <p className="font-medium text-foreground">{alert.valeurStock.toLocaleString()} FCFA</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Niveau de stock</span>
                          <span className="text-foreground">{Math.round((alert.stock / alert.stockMinimum) * 100)}%</span>
                        </div>
                        <Progress value={(alert.stock / alert.stockMinimum) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Historique
                    </Button>
                    <Button size="sm" className="gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Commander ({alert.fournisseur})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Commandes actives */}
          <TabsContent value="orders" className="space-y-4">
            {activeOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{order.id}</h3>
                        {getStatutBadge(order.statut)}
                        {order.urgent && (
                          <Badge variant="destructive" className="gap-1">
                            <Clock className="w-3 h-3" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Fournisseur</p>
                          <p className="font-medium text-foreground">{order.fournisseur}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Commandé le</p>
                          <p className="font-medium text-foreground">{order.dateCommande}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Livraison prévue</p>
                          <p className="font-medium text-foreground">{order.dateAttendue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Articles</p>
                          <p className="font-medium text-foreground">{order.articles} références</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Montant</p>
                          <p className="font-medium text-foreground">{(order.montant / 1000000).toFixed(1)}M FCFA</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Détails
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Check className="w-4 h-4" />
                        Réceptionner
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Top consommations */}
          <TabsContent value="top" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 des médicaments les plus consommés (30 derniers jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMedications.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-muted-foreground w-8">#{idx + 1}</span>
                        <div>
                          <p className="font-medium text-foreground">{med.nom}</p>
                          <p className="text-sm text-muted-foreground">{med.consommation.toLocaleString()} unités</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-foreground">{med.valeur.toLocaleString()} FCFA</span>
                        {getTendanceIcon(med.tendance)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mouvements récents */}
          <TabsContent value="movements" className="space-y-4">
            {recentMovements.map((movement, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {movement.type === "entree" ? (
                        <div className="p-2 rounded-lg bg-green-500/20">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <TrendingDown className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{movement.medicament}</p>
                        <p className="text-sm text-muted-foreground">
                          {movement.type === "entree" 
                            ? `Réception de ${movement.quantite} unités - ${movement.fournisseur}`
                            : `Sortie de ${movement.quantite} unités vers ${movement.service}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{movement.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {movement.type === "entree" ? movement.recepteur : movement.demandeur}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </HospitalDashboardLayout>
  );
}
