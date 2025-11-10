import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePayments } from "@/hooks/usePayments";
import { 
  CreditCard, 
  Smartphone, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Download,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfessionalPayments() {
  const { payments, stats, loading } = usePayments();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'airtel_money':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Carte bancaire';
      case 'airtel_money':
        return 'Airtel Money';
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Complété
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            En attente
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="mr-1 h-3 w-3" />
            En cours
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Échoué
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Transaction ID', 'Montant', 'Devise', 'Méthode', 'Statut'].join(','),
      ...filteredPayments.map(p => [
        format(new Date(p.created_at), 'dd/MM/yyyy HH:mm'),
        p.transaction_id || '-',
        p.amount,
        p.currency,
        getPaymentMethodLabel(p.payment_method),
        p.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `paiements_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos transactions
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAmount.toLocaleString()} XAF</div>
            <p className="text-xs text-muted-foreground">
              {stats.total} transaction{stats.total > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complétés</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Paiements réussis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              À traiter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échoués</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">
              Paiements refusés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
          <CardDescription>
            Consultez l'historique complet de vos paiements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID ou montant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="processing">En cours</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments List */}
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune transaction trouvée
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <Card key={payment.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-full bg-primary/10">
                        {getPaymentMethodIcon(payment.payment_method)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {payment.transaction_id || 'Transaction'}
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{getPaymentMethodLabel(payment.payment_method)}</span>
                          <span>•</span>
                          <span>
                            {format(new Date(payment.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                          </span>
                          {payment.completed_at && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">
                                Complété le {format(new Date(payment.completed_at), "d MMM HH:mm", { locale: fr })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}