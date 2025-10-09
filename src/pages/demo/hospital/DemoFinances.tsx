import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, FileText, Download } from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoFinances() {
  const financialData = {
    daily: 28500000,
    monthly: 645000000,
    pending: {
      cnamgs: 285000000,
      insurance: 78000000
    },
    sources: {
      cnamgs: 65,
      private: 20,
      insurance: 10,
      other: 5
    }
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Finances</h1>
            <p className="text-muted-foreground">Gestion financière de l'établissement</p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Exporter rapport
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recettes du jour</p>
                  <p className="text-2xl font-bold">{(financialData.daily / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground mt-1">FCFA</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recettes du mois</p>
                  <p className="text-2xl font-bold">{(financialData.monthly / 1000000).toFixed(0)}M</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% vs mois dernier
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Impayés CNAMGS</p>
                  <p className="text-2xl font-bold text-orange-600">{(financialData.pending.cnamgs / 1000000).toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground mt-1">FCFA</p>
                </div>
                <FileText className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Autres impayés</p>
                  <p className="text-2xl font-bold text-red-600">{(financialData.pending.insurance / 1000000).toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground mt-1">FCFA</p>
                </div>
                <TrendingDown className="w-10 h-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des sources de revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">CNAMGS</span>
                  <span className="text-sm font-bold">{financialData.sources.cnamgs}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${financialData.sources.cnamgs}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Privé</span>
                  <span className="text-sm font-bold">{financialData.sources.private}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${financialData.sources.private}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Assurances</span>
                  <span className="text-sm font-bold">{financialData.sources.insurance}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${financialData.sources.insurance}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Autres</span>
                  <span className="text-sm font-bold">{financialData.sources.other}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${financialData.sources.other}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factures en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "FACT-2025-001", patient: "MOUSSAVOU Marie", montant: 234000, date: "2025-01-15", type: "CNAMGS" },
                { id: "FACT-2025-002", patient: "OBAME Jean", montant: 456000, date: "2025-01-18", type: "Assurance" },
                { id: "FACT-2025-003", patient: "ELLA Patricia", montant: 178000, date: "2025-01-20", type: "CNAMGS" }
              ].map((facture) => (
                <div key={facture.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{facture.id}</span>
                      <Badge variant="outline">{facture.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{facture.patient}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{facture.montant.toLocaleString()} FCFA</p>
                    <p className="text-xs text-muted-foreground">{facture.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </HospitalDashboardLayout>
  );
}
