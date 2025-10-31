import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, Search, AlertTriangle, CheckCircle, TrendingDown,
  Pill, Syringe, Bandage, Plus
} from 'lucide-react';

export default function ProfessionalInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('medications');

  // Données fictives
  const inventory = {
    medications: [
      {
        id: 1,
        name: 'Paracétamol 500mg',
        category: 'Analgésique',
        stock: 245,
        minStock: 100,
        unit: 'boîtes',
        expiryDate: '2025-12-31',
        status: 'ok'
      },
      {
        id: 2,
        name: 'Amoxicilline 1g',
        category: 'Antibiotique',
        stock: 45,
        minStock: 50,
        unit: 'boîtes',
        expiryDate: '2025-08-15',
        status: 'low'
      },
      {
        id: 3,
        name: 'Ibuprofène 400mg',
        category: 'Anti-inflammatoire',
        stock: 12,
        minStock: 50,
        unit: 'boîtes',
        expiryDate: '2025-06-30',
        status: 'critical'
      }
    ],
    equipment: [
      {
        id: 4,
        name: 'Seringues 5ml',
        category: 'Consommable',
        stock: 500,
        minStock: 200,
        unit: 'unités',
        status: 'ok'
      },
      {
        id: 5,
        name: 'Gants stériles (paire)',
        category: 'Protection',
        stock: 150,
        minStock: 100,
        unit: 'boîtes',
        status: 'ok'
      },
      {
        id: 6,
        name: 'Compresses stériles',
        category: 'Pansements',
        stock: 35,
        minStock: 50,
        unit: 'paquets',
        status: 'low'
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ok: { label: 'Stock OK', variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-600' },
      low: { label: 'Stock bas', variant: 'default' as const, icon: AlertTriangle, color: 'text-orange-600' },
      critical: { label: 'Critique', variant: 'destructive' as const, icon: TrendingDown, color: 'text-red-600' }
    };
    return badges[status as keyof typeof badges] || badges.ok;
  };

  const getStockColor = (stock: number, minStock: number) => {
    const percentage = (stock / minStock) * 100;
    if (percentage < 25) return 'bg-red-200';
    if (percentage < 50) return 'bg-orange-200';
    return 'bg-green-200';
  };

  const getStockBarColor = (stock: number, minStock: number) => {
    const percentage = (stock / minStock) * 100;
    if (percentage < 25) return 'bg-red-600';
    if (percentage < 50) return 'bg-orange-600';
    return 'bg-green-600';
  };

  const stats = {
    total: inventory.medications.length + inventory.equipment.length,
    ok: [...inventory.medications, ...inventory.equipment].filter(i => i.status === 'ok').length,
    low: [...inventory.medications, ...inventory.equipment].filter(i => i.status === 'low').length,
    critical: [...inventory.medications, ...inventory.equipment].filter(i => i.status === 'critical').length
  };

  const renderInventoryList = (items: any[]) => (
    <div className="space-y-4">
      {items.map((item) => {
        const statusBadge = getStatusBadge(item.status);
        const StatusIcon = statusBadge.icon;
        const stockPercentage = (item.stock / item.minStock) * 100;
        
        return (
          <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge variant={statusBadge.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusBadge.label}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{item.category}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock actuel</span>
                    <span className="font-medium">{item.stock} {item.unit}</span>
                  </div>
                  
                  <div className={`w-full h-2 rounded-full ${getStockColor(item.stock, item.minStock)}`}>
                    <div 
                      className={`h-2 rounded-full ${getStockBarColor(item.stock, item.minStock)}`}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stock minimum: {item.minStock} {item.unit}</span>
                    {item.expiryDate && (
                      <span>Expire: {new Date(item.expiryDate).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <Button size="sm" variant="outline">
                Commander
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Gestion des Stocks
          </h1>
          <p className="text-muted-foreground mt-1">
            Inventaire et commandes
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle commande
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Articles</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Stock OK</p>
              <p className="text-2xl font-bold text-green-700">{stats.ok}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Stock bas</p>
              <p className="text-2xl font-bold text-orange-700">{stats.low}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Critique</p>
              <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="medications" className="gap-2">
            <Pill className="h-4 w-4" />
            Médicaments
          </TabsTrigger>
          <TabsTrigger value="equipment" className="gap-2">
            <Syringe className="h-4 w-4" />
            Matériel médical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-6">
          {renderInventoryList(inventory.medications)}
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          {renderInventoryList(inventory.equipment)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
