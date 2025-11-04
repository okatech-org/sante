import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download,
  Filter,
  Clock,
  User,
  Package,
  CreditCard,
  Settings,
  AlertCircle
} from "lucide-react";

interface PharmacyLogsTabProps {
  pharmacyId: string;
}

export const PharmacyLogsTab = ({ pharmacyId }: PharmacyLogsTabProps) => {
  const logs = [
    {
      id: '1',
      type: 'dispensation',
      action: 'Dispensation ordonnance ORD-2025-001234',
      user: 'Dr. Patrick OBAME',
      timestamp: '2025-11-03T14:35:00',
      details: 'Patient: MBANI Joseph - 5 médicaments',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: '2',
      type: 'stock',
      action: 'Réception commande fournisseur',
      user: 'Sylvie MOUSSAVOU',
      timestamp: '2025-11-03T13:20:00',
      details: 'UbiPharm - 145 produits - Bon: BC-2025-0456',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: '3',
      type: 'facturation',
      action: 'Soumission dossier CNAMGS',
      user: 'Jean MBADINGA',
      timestamp: '2025-11-03T12:45:00',
      details: 'TP-2025-0125 - Montant: 67,000 FCFA',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: '4',
      type: 'alert',
      action: 'Alerte stock critique',
      user: 'Système',
      timestamp: '2025-11-03T11:30:00',
      details: 'Amlodipine 5mg - Reste 12 boîtes',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: '5',
      type: 'configuration',
      action: 'Modification horaires d\'ouverture',
      user: 'Dr. Marie NZAMBA',
      timestamp: '2025-11-03T10:15:00',
      details: 'Dimanche: 09:00 - 13:00',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      id: '6',
      type: 'personnel',
      action: 'Connexion utilisateur',
      user: 'Dr. Patrick OBAME',
      timestamp: '2025-11-03T08:00:00',
      details: 'IP: 41.77.xxx.xxx',
      icon: User,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dispensation: 'Dispensation',
      stock: 'Stock',
      facturation: 'Facturation',
      alert: 'Alerte',
      configuration: 'Configuration',
      personnel: 'Personnel'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Journal d'Activité
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => {
              const Icon = log.icon;
              return (
                <Card key={log.id} className={`border-l-4 ${log.bgColor.replace('bg-', 'border-l-')}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${log.bgColor}`}>
                        <Icon className={`h-5 w-5 ${log.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{log.action}</p>
                            <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                          </div>
                          <Badge variant="outline">{getTypeLabel(log.type)}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{log.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(log.timestamp).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques des Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Dispensations</p>
              <p className="text-2xl font-bold text-blue-600">287</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Mouvements stock</p>
              <p className="text-2xl font-bold text-green-600">156</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Facturations</p>
              <p className="text-2xl font-bold text-purple-600">342</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Alertes</p>
              <p className="text-2xl font-bold text-orange-600">45</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Configurations</p>
              <p className="text-2xl font-bold text-gray-600">12</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Connexions</p>
              <p className="text-2xl font-bold text-gray-600">534</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
