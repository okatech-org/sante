import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Building2, Database, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const actions = [
  {
    icon: UserPlus,
    label: "Ajouter Utilisateur",
    description: "Créer un nouveau compte"
  },
  {
    icon: Building2,
    label: "Valider Prestataire",
    description: "23 demandes en attente",
    badge: "23"
  },
  {
    icon: Database,
    label: "Export Données",
    description: "CSV/Excel/JSON"
  },
  {
    icon: AlertCircle,
    label: "Voir Alertes",
    description: "3 alertes actives",
    badge: "3",
    badgeColor: "destructive"
  }
];

export function QuickActions() {
  const { toast } = useToast();

  const handleAction = (label: string) => {
    toast({
      title: label,
      description: "Fonctionnalité en développement",
    });
  };

  return (
    <Card className="bg-card/40 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start h-auto py-3 bg-background/30 hover:bg-background/50 border-border/30"
            onClick={() => handleAction(action.label)}
          >
            <div className="flex items-center gap-3 w-full">
              <action.icon className="h-5 w-5 text-foreground" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              {action.badge && (
                <Badge variant={action.badgeColor as any || "secondary"} className="ml-auto">
                  {action.badge}
                </Badge>
              )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
