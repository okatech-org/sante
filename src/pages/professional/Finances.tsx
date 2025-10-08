import { DollarSign, CreditCard, TrendingUp, Clock, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";

export default function ProfessionalFinances() {
  const transactions = [
    {
      id: 1,
      date: "2025-02-01",
      patient: "Marie MOUSSAVOU",
      type: "CNAMGS",
      amount: 20000,
      status: "paid",
      invoice: "FACT-2025-001"
    },
    {
      id: 2,
      date: "2025-02-01",
      patient: "Jean NZENGUE",
      type: "Espèces",
      amount: 25000,
      status: "paid",
      invoice: "FACT-2025-002"
    },
    {
      id: 3,
      date: "2025-02-01",
      patient: "Claire OBAME",
      type: "Mobile Money",
      amount: 15000,
      status: "pending",
      invoice: "FACT-2025-003"
    }
  ];

  const cnamgsPayments = [
    {
      id: 1,
      period: "Janvier 2025",
      amount: 850000,
      consultations: 45,
      status: "pending",
      expected: "2025-03-15"
    },
    {
      id: 2,
      period: "Décembre 2024",
      amount: 920000,
      consultations: 52,
      status: "paid",
      paidDate: "2025-02-10"
    }
  ];

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
            <p className="text-3xl font-bold text-foreground mb-1">4.8M</p>
            <p className="text-xs text-green-500">+12% vs mois dernier</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Part CNAMGS</p>
            <p className="text-3xl font-bold text-foreground mb-1">2.9M</p>
            <p className="text-xs text-muted-foreground">60% du total</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">En attente</p>
            <p className="text-3xl font-bold text-foreground mb-1">850K</p>
            <p className="text-xs text-muted-foreground">Délai: 47j</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Taux collecte</p>
            <p className="text-3xl font-bold text-foreground mb-1">92%</p>
            <p className="text-xs text-green-500">Excellent</p>
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
              <Button variant="outline" className="rounded-xl">
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
                {transactions.map((transaction) => (
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
                ))}
              </div>
            </div>
          </Card>

          {/* Remboursements CNAMGS */}
          <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Remboursements CNAMGS</h3>
              <div className="space-y-3">
                {cnamgsPayments.map((payment) => (
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
                ))}
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
                  <span className="text-xs text-muted-foreground">30%</span>
                </div>
                <p className="text-2xl font-bold text-foreground">1.44M F</p>
              </div>
              <div className="rounded-xl backdrop-blur-xl p-5 bg-card/60 border border-border/20 text-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">CNAMGS</p>
                  <span className="text-xs text-muted-foreground">60%</span>
                </div>
                <p className="text-2xl font-bold text-foreground">2.88M F</p>
              </div>
              <div className="rounded-xl backdrop-blur-xl p-5 bg-card/60 border border-border/20 text-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Mobile Money</p>
                  <span className="text-xs text-muted-foreground">10%</span>
                </div>
                <p className="text-2xl font-bold text-foreground">480K F</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}
