import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/types/ministry";
import { AlertTriangle, XCircle, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertsPanelProps {
  alerts: {
    ruptures_medicaments: Alert[];
    equipements_panne: Alert[];
    epidemies_signalees: Alert[];
    evasan_hebdomadaires: number;
  };
}

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const allAlerts = [
    ...alerts.ruptures_medicaments,
    ...alerts.equipements_panne,
    ...alerts.epidemies_signalees
  ].sort((a, b) => {
    const priorityOrder = { critique: 0, haute: 1, moyenne: 2, basse: 3 };
    return priorityOrder[a.niveau_priorite] - priorityOrder[b.niveau_priorite];
  }).slice(0, 5);

  const getAlertIcon = (type: Alert['type']) => {
    switch(type) {
      case 'rupture_medicament': return AlertTriangle;
      case 'equipement_panne': return XCircle;
      case 'epidemie': return Activity;
      default: return AlertTriangle;
    }
  };

  const getPriorityColor = (priority: Alert['niveau_priorite']) => {
    switch(priority) {
      case 'critique': return 'destructive';
      case 'haute': return 'destructive';
      case 'moyenne': return 'warning';
      case 'basse': return 'secondary';
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch(type) {
      case 'rupture_medicament': return 'Rupture Médicament';
      case 'equipement_panne': return 'Équipement en Panne';
      case 'epidemie': return 'Épidémie';
      default: return 'Autre';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Alertes Prioritaires</CardTitle>
          <Badge variant="destructive">{allAlerts.length} Actives</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {allAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune alerte active
          </p>
        ) : (
          allAlerts.filter(alert => alert && alert.id).map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Icon className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getPriorityColor(alert.niveau_priorite)} className="text-xs">
                      {alert.niveau_priorite.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {getTypeLabel(alert.type)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{alert.titre}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.province} • {new Date(alert.date_signalement).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Traiter
                </Button>
              </div>
            );
          })
        )}
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">EVASAN Hebdomadaires</span>
            </div>
            <Badge variant="outline">{alerts.evasan_hebdomadaires}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Objectif: Réduction via télémédecine
          </p>
        </div>

        <Button className="w-full" variant="outline">
          Voir Toutes les Alertes
        </Button>
      </CardContent>
    </Card>
  );
};

