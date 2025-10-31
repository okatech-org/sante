import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ClipboardList, Search, Plus, FileText, 
  Shield, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';

export default function ProfessionalProtocols() {
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives des protocoles
  const protocols = [
    {
      id: 1,
      title: 'Protocole de prise en charge COVID-19',
      category: 'Maladies Infectieuses',
      version: '3.2',
      lastUpdate: '2025-01-15',
      status: 'active',
      priority: 'high',
      author: 'Dr. Marie OKEMBA',
      department: 'Direction Médicale'
    },
    {
      id: 2,
      title: 'Protocole d\'urgence AVC',
      category: 'Urgences Médicales',
      version: '2.1',
      lastUpdate: '2025-01-10',
      status: 'active',
      priority: 'critical',
      author: 'Dr. Paul NGUEMA',
      department: 'Service Urgences'
    },
    {
      id: 3,
      title: 'Protocole anesthésie générale',
      category: 'Chirurgie',
      version: '4.0',
      lastUpdate: '2024-12-20',
      status: 'active',
      priority: 'high',
      author: 'Dr. André MOUSSAVOU',
      department: 'Bloc Opératoire'
    },
    {
      id: 4,
      title: 'Protocole de suivi diabétique',
      category: 'Maladies Chroniques',
      version: '2.5',
      lastUpdate: '2024-11-30',
      status: 'active',
      priority: 'normal',
      author: 'Dr. Sophie MBOUMBA',
      department: 'Médecine Interne'
    },
    {
      id: 5,
      title: 'Protocole hygiène hospitalière',
      category: 'Prévention',
      version: '5.0',
      lastUpdate: '2024-10-15',
      status: 'revision',
      priority: 'high',
      author: 'Commission Hygiène',
      department: 'Direction'
    }
  ];

  const categories = [
    { name: 'Maladies Infectieuses', count: 8, color: 'bg-red-100 text-red-700' },
    { name: 'Urgences Médicales', count: 12, color: 'bg-orange-100 text-orange-700' },
    { name: 'Chirurgie', count: 15, color: 'bg-blue-100 text-blue-700' },
    { name: 'Maladies Chroniques', count: 10, color: 'bg-green-100 text-green-700' },
    { name: 'Prévention', count: 5, color: 'bg-purple-100 text-purple-700' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: 'Actif', variant: 'secondary' as const, icon: CheckCircle },
      revision: { label: 'En révision', variant: 'default' as const, icon: Clock },
      draft: { label: 'Brouillon', variant: 'outline' as const, icon: FileText }
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'text-red-600 bg-red-50',
      high: 'text-orange-600 bg-orange-50',
      normal: 'text-blue-600 bg-blue-50',
      low: 'text-gray-600 bg-gray-50'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const filteredProtocols = protocols.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            Protocoles
          </h1>
          <p className="text-muted-foreground mt-1">
            Protocoles médicaux et procédures standardisées
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau protocole
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Protocoles</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actifs</p>
              <p className="text-2xl font-bold">38</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En révision</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critiques</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Catégories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
            >
              <Badge className={`mb-2 ${category.color}`}>
                {category.count} protocoles
              </Badge>
              <p className="text-sm font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un protocole..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Liste des protocoles */}
      <div className="space-y-4">
        {filteredProtocols.map((protocol) => {
          const statusBadge = getStatusBadge(protocol.status);
          const StatusIcon = statusBadge.icon;
          
          return (
            <Card key={protocol.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{protocol.title}</h3>
                    <Badge variant={statusBadge.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {statusBadge.label}
                    </Badge>
                    <Badge className={`${getPriorityColor(protocol.priority)}`}>
                      {protocol.priority === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {protocol.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-muted-foreground mb-1">Catégorie</p>
                      <p className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {protocol.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Version</p>
                      <p className="font-medium">v{protocol.version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Dernière mise à jour</p>
                      <p className="font-medium">
                        {new Date(protocol.lastUpdate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Auteur</p>
                      <p className="font-medium">{protocol.author}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Consulter
                  </Button>
                  <Button size="sm">
                    Télécharger
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredProtocols.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun protocole trouvé</h3>
            <p className="text-muted-foreground">
              Aucun protocole ne correspond à votre recherche
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
