import { DollarSign, CreditCard, TrendingUp, Clock, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finances & CNAMGS</h1>
          <p className="text-muted-foreground">Gestion financière et facturation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Nouvelle Facture
          </Button>
        </div>
      </div>

      {/* Stats financières */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus Mois</p>
                <p className="text-2xl font-bold">4.8M FCFA</p>
                <p className="text-xs text-green-500">+12% vs mois dernier</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Part CNAMGS</p>
                <p className="text-2xl font-bold">2.9M FCFA</p>
                <p className="text-xs text-muted-foreground">60% du total</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-yellow-500">850K FCFA</p>
                <p className="text-xs text-muted-foreground">Délai: 47j</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux collecte</p>
                <p className="text-2xl font-bold text-green-500">92%</p>
                <p className="text-xs text-green-500">Excellent</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique revenus */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des revenus</CardTitle>
          <CardDescription>Revenus des 6 derniers mois par source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 opacity-50 mr-4" />
            <p>Graphique des revenus - À implémenter avec Recharts</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions Récentes</CardTitle>
            <CardDescription>Paiements reçus aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{transaction.patient}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{transaction.type}</Badge>
                      <span className="text-xs text-muted-foreground">{transaction.invoice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{transaction.amount.toLocaleString()} FCFA</p>
                    <Badge className={getStatusColor(transaction.status)} variant="outline">
                      {getStatusLabel(transaction.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Remboursements CNAMGS */}
        <Card>
          <CardHeader>
            <CardTitle>Remboursements CNAMGS</CardTitle>
            <CardDescription>Suivi des paiements tiers-payant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cnamgsPayments.map((payment) => (
                <div key={payment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{payment.period}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.consultations} consultations
                      </p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-bold">{payment.amount.toLocaleString()} FCFA</p>
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
          </CardContent>
        </Card>
      </div>

      {/* Ventilation des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Ventilation des Paiements</CardTitle>
          <CardDescription>Répartition par mode de paiement ce mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Espèces</p>
                <span className="text-xs text-muted-foreground">30%</span>
              </div>
              <p className="text-2xl font-bold">1.44M FCFA</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">CNAMGS</p>
                <span className="text-xs text-muted-foreground">60%</span>
              </div>
              <p className="text-2xl font-bold">2.88M FCFA</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Mobile Money</p>
                <span className="text-xs text-muted-foreground">10%</span>
              </div>
              <p className="text-2xl font-bold">480K FCFA</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
