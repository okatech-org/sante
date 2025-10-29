import { useState } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign, TrendingUp, CreditCard, FileText, Clock, 
  CheckCircle, AlertCircle, Download, Eye, Send 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminBilling() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const stats = {
    mrr: 1850000, // Monthly Recurring Revenue in XAF
    arr: 22200000, // Annual Recurring Revenue
    activeSubscriptions: 287,
    pendingPayments: 145200000,
    totalRevenue: 2400000,
    cnamgsOutstanding: 89000000,
    conversionRate: 87
  };

  const subscriptionPlans = [
    { id: "1", name: "Basique", price: 50000, establishments: 145, revenue: 7250000 },
    { id: "2", name: "Professionnel", price: 150000, establishments: 98, revenue: 14700000 },
    { id: "3", name: "Enterprise", price: 350000, establishments: 44, revenue: 15400000 }
  ];

  const recentInvoices = [
    {
      id: "INV-2025-001",
      establishment: "CHU de Libreville",
      amount: 350000,
      status: "paid",
      date: "2025-01-28",
      dueDate: "2025-02-28"
    },
    {
      id: "INV-2025-002",
      establishment: "Clinique Mandji",
      amount: 150000,
      status: "pending",
      date: "2025-01-25",
      dueDate: "2025-02-25"
    },
    {
      id: "INV-2025-003",
      establishment: "Pharmacie de la Grâce",
      amount: 50000,
      status: "paid",
      date: "2025-01-20",
      dueDate: "2025-02-20"
    },
    {
      id: "INV-2025-004",
      establishment: "Laboratoire Bio-Santé",
      amount: 150000,
      status: "overdue",
      date: "2024-12-28",
      dueDate: "2025-01-28"
    }
  ];

  const cnamgsPayments = [
    {
      id: "BATCH-2025-001",
      establishments: 234,
      amount: 45000000,
      status: "submitted",
      submittedDate: "2025-01-15",
      expectedDate: "2025-02-15"
    },
    {
      id: "BATCH-2024-012",
      establishments: 223,
      amount: 42000000,
      status: "paid",
      submittedDate: "2024-12-15",
      paidDate: "2025-01-10"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      paid: { label: "Payé", className: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30", icon: CheckCircle },
      pending: { label: "En attente", className: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30", icon: Clock },
      overdue: { label: "En retard", className: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30", icon: AlertCircle },
      submitted: { label: "Soumis", className: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30", icon: Send }
    };
    const variant = variants[status] || variants.pending;
    const Icon = variant.icon;
    return (
      <Badge variant="outline" className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Facturation & Abonnements
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion financière et suivi des paiements
          </p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
              <div className="text-3xl font-bold text-foreground">
                {(stats.mrr / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">XAF / mois</p>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">ARR</CardTitle>
              <div className="text-3xl font-bold text-foreground">
                {(stats.arr / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">XAF / an</p>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
              <div className="text-3xl font-bold text-foreground">
                {(stats.pendingPayments / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">À collecter</p>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Abonnements</CardTitle>
              <div className="text-3xl font-bold text-foreground">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Actifs</p>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
            <TabsTrigger value="cnamgs">CNAMGS</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Plans de souscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Plans d'abonnement</CardTitle>
                  <CardDescription>Répartition par plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscriptionPlans.map(plan => (
                    <div key={plan.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {plan.price.toLocaleString()} XAF/mois
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{plan.establishments}</p>
                          <p className="text-xs text-muted-foreground">clients</p>
                        </div>
                      </div>
                      <Progress value={(plan.establishments / stats.activeSubscriptions) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {(plan.revenue / 1000000).toFixed(2)}M XAF/mois
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Métriques */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques clés</CardTitle>
                  <CardDescription>Performance financière</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Taux de conversion</span>
                      <span className="font-semibold">{stats.conversionRate}%</span>
                    </div>
                    <Progress value={stats.conversionRate} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ARPU (Revenu par user)</span>
                      <span className="font-semibold">
                        {Math.round(stats.mrr / stats.activeSubscriptions).toLocaleString()} XAF
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Churn rate</span>
                      <span className="font-semibold text-green-600">2.3%</span>
                    </div>
                    <Progress value={2.3} className="h-2 [&>div]:bg-green-500" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>Croissance mensuelle: +8.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des abonnements</CardTitle>
                <CardDescription>Suivi des souscriptions actives</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Liste détaillée des abonnements à implémenter...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Factures récentes</CardTitle>
                    <CardDescription>Suivi des paiements établissements</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Facture</TableHead>
                      <TableHead>Établissement</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Échéance</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                        <TableCell>{invoice.establishment}</TableCell>
                        <TableCell className="font-semibold">
                          {invoice.amount.toLocaleString()} XAF
                        </TableCell>
                        <TableCell className="text-sm">{invoice.date}</TableCell>
                        <TableCell className="text-sm">{invoice.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cnamgs">
            <Card>
              <CardHeader>
                <CardTitle>Remboursements CNAMGS</CardTitle>
                <CardDescription>Suivi des paiements tiers-payant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">En attente de remboursement</span>
                      <span className="text-xl font-bold">
                        {(stats.cnamgsOutstanding / 1000000).toFixed(1)}M XAF
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Montant total des créances CNAMGS en cours
                    </p>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Établissements</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date soumission</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cnamgsPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                          <TableCell>{payment.establishments}</TableCell>
                          <TableCell className="font-semibold">
                            {(payment.amount / 1000000).toFixed(2)}M XAF
                          </TableCell>
                          <TableCell className="text-sm">{payment.submittedDate}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayoutSimple>
  );
}

