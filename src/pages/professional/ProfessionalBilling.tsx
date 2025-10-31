import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, TrendingUp, FileText, CreditCard,
  Calendar, CheckCircle, Clock, AlertCircle, Download, Activity
} from 'lucide-react';

export default function ProfessionalBilling() {
  const [activeTab, setActiveTab] = useState('overview');

  // Données fictives
  const billingStats = {
    thisMonth: {
      total: 2450000,
      cnamgs: 1680000,
      cnss: 420000,
      private: 350000,
      pending: 180000
    },
    lastMonth: {
      total: 2180000
    },
    invoices: [
      {
        id: 1,
        patient: 'Marie MOUSSAVOU',
        amount: 45000,
        type: 'CNAMGS',
        date: '2025-01-30',
        status: 'paid',
        service: 'Consultation'
      },
      {
        id: 2,
        patient: 'Jean NZENGUE',
        amount: 85000,
        type: 'CNSS',
        date: '2025-01-30',
        status: 'pending',
        service: 'Hospitalisation'
      },
      {
        id: 3,
        patient: 'Pierre OBAME',
        amount: 35000,
        type: 'Privé',
        date: '2025-01-29',
        status: 'paid',
        service: 'Consultation'
      },
      {
        id: 4,
        patient: 'Sophie KOMBILA',
        amount: 120000,
        type: 'CNAMGS',
        date: '2025-01-29',
        status: 'processing',
        service: 'Examens'
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: { label: 'Payé', variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'En attente', variant: 'outline' as const, icon: Clock, color: 'text-orange-600' },
      processing: { label: 'Traitement', variant: 'default' as const, icon: Activity, color: 'text-blue-600' },
      rejected: { label: 'Rejeté', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'CNAMGS': 'bg-blue-100 text-blue-700',
      'CNSS': 'bg-green-100 text-green-700',
      'Privé': 'bg-purple-100 text-purple-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const growth = ((billingStats.thisMonth.total - billingStats.lastMonth.total) / billingStats.lastMonth.total) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            Facturation & CNAMGS
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion financière et remboursements
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <Badge variant={growth > 0 ? 'default' : 'secondary'}>
              {growth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              {growth.toFixed(1)}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Revenu Total</p>
            <p className="text-2xl font-bold">{billingStats.thisMonth.total.toLocaleString('fr-FR')} XAF</p>
            <p className="text-xs text-muted-foreground mt-2">Ce mois</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">CNAMGS</p>
            <p className="text-2xl font-bold">{billingStats.thisMonth.cnamgs.toLocaleString('fr-FR')} XAF</p>
            <p className="text-xs text-muted-foreground mt-2">
              {((billingStats.thisMonth.cnamgs / billingStats.thisMonth.total) * 100).toFixed(0)}% du total
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">CNSS</p>
            <p className="text-2xl font-bold">{billingStats.thisMonth.cnss.toLocaleString('fr-FR')} XAF</p>
            <p className="text-xs text-muted-foreground mt-2">
              {((billingStats.thisMonth.cnss / billingStats.thisMonth.total) * 100).toFixed(0)}% du total
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">En attente</p>
            <p className="text-2xl font-bold">{billingStats.thisMonth.pending.toLocaleString('fr-FR')} XAF</p>
            <p className="text-xs text-muted-foreground mt-2">À recevoir</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="cnamgs">CNAMGS</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Répartition par type de paiement</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CNAMGS</span>
                  <span className="font-semibold">{billingStats.thisMonth.cnamgs.toLocaleString('fr-FR')} XAF</span>
                </div>
                <div className="w-full bg-blue-200 h-2 rounded-full">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(billingStats.thisMonth.cnamgs / billingStats.thisMonth.total) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm">CNSS</span>
                  <span className="font-semibold">{billingStats.thisMonth.cnss.toLocaleString('fr-FR')} XAF</span>
                </div>
                <div className="w-full bg-green-200 h-2 rounded-full">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(billingStats.thisMonth.cnss / billingStats.thisMonth.total) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm">Privé</span>
                  <span className="font-semibold">{billingStats.thisMonth.private.toLocaleString('fr-FR')} XAF</span>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(billingStats.thisMonth.private / billingStats.thisMonth.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Évolution mensuelle</h3>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Graphique à venir</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {billingStats.invoices.map((invoice) => {
            const statusBadge = getStatusBadge(invoice.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <Card key={invoice.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{invoice.patient}</h4>
                      <p className="text-sm text-muted-foreground">{invoice.service}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(invoice.type)}>{invoice.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(invoice.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-xl font-bold">{invoice.amount.toLocaleString('fr-FR')} XAF</p>
                      <Badge variant={statusBadge.variant} className="gap-1 mt-2">
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <Button size="sm">Détails</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="cnamgs">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Remboursements CNAMGS</h3>
            <p className="text-muted-foreground">
              Suivi des remboursements en cours avec la CNAMGS
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium">Dossiers soumis</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium">En traitement</span>
                <Badge variant="default">8</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium">Remboursés</span>
                <Badge variant="secondary">4</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Rapports financiers</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <span>Rapport mensuel - Janvier 2025</span>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Rapport trimestriel - Q4 2024</span>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Rapport annuel - 2024</span>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
