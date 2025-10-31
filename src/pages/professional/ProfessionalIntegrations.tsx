import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  GitBranch, CheckCircle, AlertCircle, Clock, 
  Shield, Zap, Database, Cloud
} from 'lucide-react';

export default function ProfessionalIntegrations() {
  // Données fictives des intégrations
  const integrations = [
    {
      id: 1,
      name: 'CNAMGS',
      category: 'Assurance Maladie',
      description: 'Système de remboursement CNAMGS',
      status: 'connected',
      lastSync: '2025-01-31 10:30',
      enabled: true,
      icon: Shield
    },
    {
      id: 2,
      name: 'CNSS',
      category: 'Sécurité Sociale',
      description: 'Caisse Nationale de Sécurité Sociale',
      status: 'connected',
      lastSync: '2025-01-31 09:45',
      enabled: true,
      icon: Shield
    },
    {
      id: 3,
      name: 'Laboratoire Central',
      category: 'Analyses Médicales',
      description: 'Partage des résultats d\'analyses',
      status: 'connected',
      lastSync: '2025-01-31 11:00',
      enabled: true,
      icon: Database
    },
    {
      id: 4,
      name: 'Pharmacie SOGARA',
      category: 'Pharmacie',
      description: 'Gestion des stocks et prescriptions',
      status: 'connected',
      lastSync: '2025-01-31 08:30',
      enabled: true,
      icon: Database
    },
    {
      id: 5,
      name: 'WhatsApp Business API',
      category: 'Communication',
      description: 'Notifications patients par WhatsApp',
      status: 'pending',
      lastSync: null,
      enabled: false,
      icon: Zap
    },
    {
      id: 6,
      name: 'SMS Gateway',
      category: 'Communication',
      description: 'Envoi de SMS automatiques',
      status: 'connected',
      lastSync: '2025-01-31 10:00',
      enabled: true,
      icon: Zap
    },
    {
      id: 7,
      name: 'Backup Cloud',
      category: 'Infrastructure',
      description: 'Sauvegarde automatique des données',
      status: 'connected',
      lastSync: '2025-01-31 03:00',
      enabled: true,
      icon: Cloud
    },
    {
      id: 8,
      name: 'Ministère de la Santé',
      category: 'Gouvernement',
      description: 'Rapports épidémiologiques',
      status: 'error',
      lastSync: '2025-01-30 15:00',
      enabled: false,
      icon: Shield
    }
  ];

  const categories = [
    { name: 'Assurance', count: 2, color: 'text-blue-600' },
    { name: 'Communication', count: 2, color: 'text-green-600' },
    { name: 'Infrastructure', count: 1, color: 'text-purple-600' },
    { name: 'Partenaires', count: 3, color: 'text-orange-600' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      connected: { label: 'Connecté', variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'En attente', variant: 'default' as const, icon: Clock, color: 'text-orange-600' },
      error: { label: 'Erreur', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const stats = {
    total: integrations.length,
    active: integrations.filter(i => i.enabled).length,
    connected: integrations.filter(i => i.status === 'connected').length,
    errors: integrations.filter(i => i.status === 'error').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GitBranch className="h-8 w-8 text-primary" />
            Intégrations
          </h1>
          <p className="text-muted-foreground mt-1">
            Systèmes et services connectés
          </p>
        </div>
        <Button className="gap-2">
          <GitBranch className="h-4 w-4" />
          Nouvelle intégration
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <GitBranch className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actives</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <Zap className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Connectées</p>
              <p className="text-2xl font-bold">{stats.connected}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Erreurs</p>
              <p className="text-2xl font-bold">{stats.errors}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Catégories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{category.name}</p>
                <p className={`text-2xl font-bold ${category.color}`}>
                  {category.count}
                </p>
              </div>
              <Badge variant="outline">Services</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Liste des intégrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const statusBadge = getStatusBadge(integration.status);
          const StatusIcon = statusBadge.icon;
          const Icon = integration.icon;
          
          return (
            <Card key={integration.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold">{integration.name}</h3>
                      <Badge variant={statusBadge.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {integration.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                
                <Switch
                  checked={integration.enabled}
                  disabled={integration.status === 'error'}
                />
              </div>
              
              {integration.lastSync && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Dernière synchro : {integration.lastSync}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Configurer
                    </Button>
                    {integration.status === 'connected' && (
                      <Button size="sm" variant="outline">
                        Synchroniser
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {integration.status === 'pending' && (
                <div className="pt-4 border-t">
                  <Button size="sm" className="w-full">
                    Configurer l'intégration
                  </Button>
                </div>
              )}
              
              {integration.status === 'error' && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-red-600 mb-2">
                    Erreur de connexion. Vérifiez la configuration.
                  </p>
                  <Button size="sm" variant="destructive" className="w-full">
                    Résoudre le problème
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
