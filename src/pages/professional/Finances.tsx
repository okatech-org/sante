import { DollarSign, CreditCard, TrendingUp, Clock, Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { useProfessionalFinances } from "@/hooks/useProfessionalFinances";
import { useToast } from "@/hooks/use-toast";

export default function ProfessionalFinances() {
  const { stats, transactions, cnamgsPayments, loading, error } = useProfessionalFinances();
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Vos données financières sont en cours d'export...",
    });
    
    // Generate CSV content
    const csvContent = [
      ["Date", "Patient", "Type", "Montant", "Statut", "Facture"],
      ...transactions.map(t => [
        t.date,
        t.patient,
        t.type,
        t.amount.toString(),
        t.status,
        t.invoice
      ])
    ].map(row => row.join(",")).join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finances-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Vos données ont été exportées avec succès.",
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "paid": return "bg-green-500/10 text-green-500";
      case "pending": return "bg-yellow-500/10 text-yellow-500";
      case "rejected": return "bg-red-500/10 text-red-500";
      default: return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "paid": return "Payé";
      case "pending": return "En attente";
      case "rejected": return "Rejeté";
      default: return status;
    }
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PatientDashboardLayout>
    );
  }

  if (error) {
    return (
      <PatientDashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientDashboardLayout>
    );
  }

  const revenueGrowth = stats.previousMonthRevenue > 0
    ? ((stats.monthRevenue - stats.previousMonthRevenue) / stats.previousMonthRevenue * 100).toFixed(0)
    : "0";

  const cnamgsPercentage = stats.monthRevenue > 0
    ? Math.round((stats.cnamgsRevenue / stats.monthRevenue) * 100)
    : 0;

  const cashPercentage = stats.monthRevenue > 0
    ? Math.round((stats.cashRevenue / stats.monthRevenue) * 100)
    : 0;

  const mobileMoneyPercentage = stats.monthRevenue > 0
    ? Math.round((stats.mobileMoneyRevenue / stats.monthRevenue) * 100)
    : 0;

  // Calculate average payment delay (mock value for now)
  const avgDelay = 47;

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Stats financières */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Revenus Mois</p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {(stats.monthRevenue / 1000000).toFixed(1)}M
            </p>
            <p className={`text-xs ${Number(revenueGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Number(revenueGrowth) >= 0 ? '+' : ''}{revenueGrowth}% vs mois dernier
            </p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Part CNAMGS</p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {(stats.cnamgsRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-muted-foreground">{cnamgsPercentage}% du total</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">En attente</p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {Math.round(stats.pendingAmount / 1000)}K
            </p>
            <p className="text-xs text-muted-foreground">Délai: {avgDelay}j</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Taux collecte</p>
            <p className="text-3xl font-bold text-foreground mb-1">{stats.collectionRate}%</p>
            <p className={`text-xs ${stats.collectionRate >= 85 ? 'text-green-500' : stats.collectionRate >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
              {stats.collectionRate >= 85 ? 'Excellent' : stats.collectionRate >= 70 ? 'Bon' : 'À améliorer'}
            </p>
          </div>
        </div>

        {/* Graphique revenus */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Évolution des revenus</h2>
                <p className="text-sm text-muted-foreground">Revenus des 6 derniers mois</p>
              </div>
              <Button variant="outline" className="rounded-xl" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 opacity-50 mr-4" />
              <p>Graphique des revenus - À implémenter</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions récentes */}
          <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Transactions Récentes</h3>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune transaction récente
                  </p>
                ) : (
                  transactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-xl backdrop-blur-xl p-4 bg-card/60 border border-border/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{transaction.patient}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs rounded-full">{transaction.type}</Badge>
                          <span className="text-xs text-muted-foreground">{transaction.invoice}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{transaction.amount.toLocaleString()} F</p>
                        <Badge className={`${getStatusColor(transaction.status)} rounded-full`} variant="outline">
                          {getStatusLabel(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Remboursements CNAMGS */}
          <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Remboursements CNAMGS</h3>
              <div className="space-y-3">
                {cnamgsPayments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun remboursement CNAMGS
                  </p>
                ) : (
                  cnamgsPayments.map((payment) => (
                  <div key={payment.id} className="rounded-xl backdrop-blur-xl p-4 bg-card/60 border border-border/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{payment.period}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.consultations} consultations
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(payment.status)} rounded-full`}>
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xl font-bold text-foreground">{payment.amount.toLocaleString()} F</p>
                      {payment.status === "pending" ? (
                        <p className="text-xs text-muted-foreground">
                          Attendu: {new Date(payment.expected).toLocaleDateString('fr-FR')}
                        </p>
                      ) : (
                        <p className="text-xs text-green-500">
                          Payé: {new Date(payment.paidDate!).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Ventilation des paiements */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Ventilation des Paiements</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl backdrop-blur-xl p-5 bg-card/60 border border-border/20 text-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Espèces</p>
                  <span className="text-xs text-muted-foreground">{cashPercentage}%</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {(stats.cashRevenue / 1000000).toFixed(2)}M F
                </p>
              </div>
              <div className="rounded-xl backdrop-blur-xl p-5 bg-card/60 border border-border/20 text-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">CNAMGS</p>
                  <span className="text-xs text-muted-foreground">{cnamgsPercentage}%</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {(stats.cnamgsRevenue / 1000000).toFixed(2)}M F
                </p>
              </div>
              <div className="rounded-xl backdrop-blur-xl p-5 bg-card/60 border border-border/20 text-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Mobile Money</p>
                  <span className="text-xs text-muted-foreground">{mobileMoneyPercentage}%</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(stats.mobileMoneyRevenue / 1000)}K F
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}
