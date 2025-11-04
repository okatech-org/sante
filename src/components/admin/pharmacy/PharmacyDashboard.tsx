import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface PharmacyDashboardProps {
  pharmacyId: string;
}

export const PharmacyDashboard = ({ pharmacyId }: PharmacyDashboardProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 text-blue-600" />
              <Badge variant="secondary">Aujourd'hui</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Commandes</p>
            <p className="text-2xl font-bold text-blue-700">12</p>
            <p className="text-xs text-muted-foreground mt-1">+3 vs hier</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <Badge variant="secondary">Aujourd'hui</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Dispensations</p>
            <p className="text-2xl font-bold text-green-700">8</p>
            <p className="text-xs text-muted-foreground mt-1">Taux: 66.7%</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <Badge variant="secondary">Stocks</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Alertes</p>
            <p className="text-2xl font-bold text-orange-700">5</p>
            <p className="text-xs text-muted-foreground mt-1">Stock critique</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <Badge variant="secondary">Aujourd'hui</Badge>
            </div>
            <p className="text-sm text-muted-foreground">CA du jour</p>
            <p className="text-2xl font-bold text-purple-700">245K FCFA</p>
            <p className="text-xs text-muted-foreground mt-1">Objectif: 300K</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: '1',
                type: 'dispensation',
                description: 'Ordonnance ORD-2025-001234 dispensée',
                time: 'Il y a 15 min',
                user: 'Patrick OBAME',
                icon: CheckCircle,
                color: 'text-green-600'
              },
              {
                id: '2',
                type: 'commande',
                description: 'Nouvelle commande en ligne reçue',
                time: 'Il y a 32 min',
                user: 'Système',
                icon: Package,
                color: 'text-blue-600'
              },
              {
                id: '3',
                type: 'stock',
                description: 'Stock Paracétamol 500mg mis à jour',
                time: 'Il y a 45 min',
                user: 'Dr Sylvie NZAMBA',
                icon: Package,
                color: 'text-purple-600'
              },
              {
                id: '4',
                type: 'alert',
                description: 'Alerte stock critique: Amlodipine 5mg',
                time: 'Il y a 1h',
                user: 'Système',
                icon: AlertTriangle,
                color: 'text-orange-600'
              }
            ].map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Ordonnances en Attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'ORD-2025-1245', patient: 'MBANI Joseph', priority: 'Urgent', time: '15 min' },
              { id: 'ORD-2025-1246', patient: 'NZAMBA Claire', priority: 'Normal', time: '45 min' },
              { id: 'ORD-2025-1247', patient: 'OBIANG Marc', priority: 'Normal', time: '1h 20min' },
              { id: 'ORD-2025-1248', patient: 'ESSONO Marie', priority: 'Planifié', time: '2h' }
            ].map((ord) => (
              <div key={ord.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{ord.id}</p>
                  <p className="text-sm text-muted-foreground">{ord.patient}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={ord.priority === 'Urgent' ? 'destructive' : 'secondary'}>
                    {ord.priority}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{ord.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">4.7</p>
              <p className="text-sm text-muted-foreground mt-1">Note moyenne</p>
              <p className="text-xs text-muted-foreground">142 avis</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold text-green-600">94.3%</p>
              <p className="text-sm text-muted-foreground mt-1">Disponibilité</p>
              <p className="text-xs text-muted-foreground">Taux de stock</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold text-blue-600">18 min</p>
              <p className="text-sm text-muted-foreground mt-1">Délai moyen</p>
              <p className="text-xs text-muted-foreground">Préparation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
