import { MainLayout } from "@/components/layout/MainLayout";
import { InfoCard } from "@/components/common/InfoCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, TestTube, Bell, Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* En-tête */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Bonjour, Jean 👋</h1>
          <p className="text-muted-foreground">Voici un aperçu de votre santé</p>
        </div>

        {/* Alertes */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium text-warning">Rendez-vous à venir</p>
            <p className="text-sm text-muted-foreground mt-1">
              Vous avez un rendez-vous chez Dr. Mbina demain à 14h00
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="btn-mobile-xxl justify-start" variant="outline">
            <Calendar className="mr-2 h-5 w-5" />
            Prendre un rendez-vous
          </Button>
          <Button className="btn-mobile-xxl justify-start" variant="outline">
            <FileText className="mr-2 h-5 w-5" />
            Voir mes ordonnances
          </Button>
          <Button className="btn-mobile-xxl justify-start" variant="outline">
            <TestTube className="mr-2 h-5 w-5" />
            Consulter mes résultats
          </Button>
        </div>

        {/* Cartes d'information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            title="Rendez-vous récents"
            icon={Calendar}
            interactive
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dr. Mbina</p>
                  <p className="text-sm text-muted-foreground">Cardiologue</p>
                </div>
                <StatusBadge status="success">Confirmé</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">15 Février 2025 à 14h00</p>
            </div>
          </InfoCard>

          <InfoCard
            title="Ordonnances actives"
            icon={FileText}
            interactive
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Paracétamol 500mg</p>
                <StatusBadge status="info">Active</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">3 fois par jour pendant 7 jours</p>
            </div>
          </InfoCard>

          <InfoCard
            title="Derniers résultats"
            icon={TestTube}
            interactive
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Analyse sanguine</p>
                <StatusBadge status="success">Normal</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">Reçu le 10 Février 2025</p>
            </div>
          </InfoCard>
        </div>
      </div>
    </MainLayout>
  );
}
