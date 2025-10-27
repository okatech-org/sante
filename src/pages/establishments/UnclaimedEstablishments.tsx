import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Shield,
  ChevronRight,
  Filter,
  Briefcase,
  FlaskConical,
  Pill,
  Info,
  TrendingUp,
  Users,
  Activity,
  Eye,
  ExternalLink,
  UserCircle,
  Key
} from "lucide-react";
import { claimService, ClaimStatus, type Establishment } from '@/services/EstablishmentClaimService';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { EstablishmentStatsCard, ESTABLISHMENT_STATS } from '@/components/stats/EstablishmentStats';

// Données des provinces du Gabon
const PROVINCES = [
  'Estuaire',
  'Haut-Ogooué',
  'Moyen-Ogooué',
  'Ngounié',
  'Nyanga',
  'Ogooué-Ivindo',
  'Ogooué-Lolo',
  'Ogooué-Maritime',
  'Woleu-Ntem'
];

// Types d'établissements
const ESTABLISHMENT_TYPES = {
  hospital: { label: 'Hôpital', icon: Building2, color: 'blue' },
  clinic: { label: 'Clinique', icon: Building2, color: 'green' },
  cabinet: { label: 'Cabinet Médical', icon: Briefcase, color: 'purple' },
  pharmacy: { label: 'Pharmacie', icon: Pill, color: 'orange' },
  laboratory: { label: 'Laboratoire', icon: FlaskConical, color: 'pink' }
};

// Comptes d'accès démo pour les structures
const DEMO_ACCESS_ACCOUNTS: Record<string, Array<{
  name: string;
  email: string;
  password: string;
  role: string;
  speciality?: string;
}>> = {
  'cmst-sogara': [
    {
      name: 'Dr. Jean-Paul NZENZE',
      email: 'medecin.cmst@sogara.ga',
      password: 'Demo2025!',
      role: 'Médecin du Travail',
      speciality: 'Médecine du Travail'
    },
    {
      name: 'Marie BOUNDA',
      email: 'infirmiere.cmst@sogara.ga',
      password: 'Demo2025!',
      role: 'Infirmière'
    },
    {
      name: 'Paul OKANDZE',
      email: 'admin.cmst@sogara.ga',
      password: 'Demo2025!',
      role: 'Administrateur'
    }
  ]
};

// Données mock (en attendant la migration Supabase)
const DEMO_ESTABLISHMENTS: Partial<Establishment>[] = [
  {
    id: 'chu-libreville',
    name: 'Centre Hospitalier Universitaire de Libreville',
    type: 'hospital',
    sector: 'public',
    city: 'Libreville',
    province: 'Estuaire',
    address: 'Boulevard du Bord de Mer',
    public_contact_phone: '+241 01 XX XX XX',
    services: ['Urgences', 'Chirurgie', 'Maternité', 'Pédiatrie', 'Cardiologie'],
    capacity: { beds: 500, operating_rooms: 10 }
  },
  {
    id: 'chr-melen',
    name: 'Centre Hospitalier Régional de Melen',
    type: 'hospital',
    sector: 'public',
    city: 'Libreville',
    province: 'Estuaire',
    address: 'Quartier Melen',
    public_contact_phone: '+241 01 74 23 45',
    services: ['Urgences', 'Médecine Générale', 'Maternité'],
    capacity: { beds: 200 }
  },
  {
    id: 'polyclinique-chambrier',
    name: 'Polyclinique El Rapha Dr. Chambrier',
    type: 'clinic',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    address: 'Centre-ville',
    public_contact_phone: '+241 01 44 38 38',
    services: ['Consultations Spécialisées', 'Chirurgie', 'Imagerie'],
    capacity: { beds: 120, operating_rooms: 5 }
  },
  {
    id: 'clinique-sainte-marie',
    name: 'Clinique Sainte-Marie',
    type: 'clinic',
    sector: 'confessional',
    city: 'Libreville',
    province: 'Estuaire',
    address: 'Quartier Louis',
    public_contact_phone: '+241 01 76 22 22',
    services: ['Médecine Générale', 'Pédiatrie', 'Gynécologie'],
    capacity: { beds: 50 }
  },
  {
    id: 'cmst-sogara',
    name: 'CMST SOGARA',
    type: 'clinic',
    sector: 'private',
    city: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    address: 'Route de la Sogara',
    public_contact_phone: '+241 01 55 26 21',
    services: ['Médecine du Travail', 'Infirmerie', 'Vaccinations'],
    capacity: { consultation_rooms: 4 }
  },
  {
    id: 'cabinet-glass',
    name: 'Cabinet Médical Glass',
    type: 'cabinet',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    address: 'Quartier Glass',
    public_contact_phone: '+241 01 77 88 99',
    services: ['Médecine Générale', 'Pédiatrie', 'Vaccinations'],
    capacity: { consultation_rooms: 3 }
  },
  {
    id: 'pharmacie-nkembo',
    name: 'Pharmacie Nkembo',
    type: 'pharmacy',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    address: 'Quartier Nkembo',
    public_contact_phone: '+241 01 74 55 66',
    services: ['Dispensation', 'Conseil Pharmaceutique', 'Vaccination']
  },
  {
    id: 'laboratoire-biolab',
    name: 'Laboratoire BIOLAB',
    type: 'laboratory',
    sector: 'private',
    city: 'Libreville',
    province: 'Estuaire',
    address: 'Centre-ville',
    public_contact_phone: '+241 01 72 33 44',
    services: ['Analyses Médicales', 'Prélèvements', 'Tests COVID']
  }
];

// Composant Modal de détails avec visibilité
function EstablishmentDetailModal({ establishment }: { establishment: Establishment }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const accessAccounts = DEMO_ACCESS_ACCOUNTS[establishment.id] || [];
  const hasPublicPage = ['cmst-sogara'].includes(establishment.id);
  
  const handleViewPublicPage = () => {
    navigate(`/establishment/${establishment.id}/public`);
  };
  
  const handleCopyCredentials = (account: any) => {
    const text = `Email: ${account.email}\nMot de passe: ${account.password}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Identifiants copiés",
      description: `Identifiants de ${account.name} copiés dans le presse-papiers`,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-2">
          <Eye className="w-4 h-4 mr-2" />
          Voir les détails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{establishment.name}</DialogTitle>
          <DialogDescription>
            {ESTABLISHMENT_TYPES[establishment.type as keyof typeof ESTABLISHMENT_TYPES]?.label} • {' '}
            {establishment.sector === 'public' ? 'Public' : 'Privé'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informations générales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">
                    {establishment.address}<br />
                    {establishment.city}, {establishment.province}
                  </p>
                </div>
              </div>
              
              {establishment.public_contact_phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">
                      {establishment.public_contact_phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Services */}
          {establishment.services && establishment.services.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Services offerts</h3>
              <div className="flex flex-wrap gap-2">
                {establishment.services.map((service, idx) => (
                  <Badge key={idx} variant="secondary">{service}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Page publique */}
          {hasPublicPage && (
            <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Page d'accueil publique
              </h3>
              <p className="text-sm text-muted-foreground">
                Consultez la page publique de cet établissement pour voir les informations visibles par les patients.
              </p>
              <Button onClick={handleViewPublicPage} className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Voir la page d'accueil
              </Button>
            </div>
          )}
          
          {/* Comptes d'accès */}
          {accessAccounts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                Comptes d'accès démo
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Utilisez ces identifiants pour tester les différents rôles dans cet établissement.
              </p>
              <div className="space-y-3">
                {accessAccounts.map((account, idx) => (
                  <Card key={idx} className="border-2">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold">{account.name}</p>
                          <p className="text-sm text-muted-foreground">{account.role}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <code className="bg-muted px-2 py-0.5 rounded text-xs">
                                {account.email}
                              </code>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Key className="w-3 h-3 text-muted-foreground" />
                              <code className="bg-muted px-2 py-0.5 rounded text-xs">
                                {account.password}
                              </code>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCredentials(account)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2 V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Ces identifiants sont des comptes de démonstration. En production, chaque utilisateur aura ses propres identifiants sécurisés.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour une carte d'établissement
function EstablishmentCard({ 
  establishment, 
  onClaim 
}: { 
  establishment: Establishment;
  onClaim: (id: string) => void;
}) {
  const typeInfo = ESTABLISHMENT_TYPES[establishment.type];
  const Icon = typeInfo.icon;
  
  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.UNCLAIMED:
        return (
          <Badge variant="secondary" className="bg-gray-100">
            <Clock className="w-3 h-3 mr-1" />
            Non-Revendiqué
          </Badge>
        );
      case ClaimStatus.CLAIM_PENDING:
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            <Clock className="w-3 h-3 mr-1" />
            Vérification en Cours
          </Badge>
        );
      case ClaimStatus.VERIFIED:
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Vérifié
          </Badge>
        );
      case ClaimStatus.REJECTED:
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className={`w-12 h-12 rounded-lg bg-${typeInfo.color}-100 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 text-${typeInfo.color}-600`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{establishment.name}</CardTitle>
              <CardDescription className="mt-1">
                {typeInfo.label} • {establishment.sector === 'public' ? 'Public' : 'Privé'}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(establishment.claim_status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{establishment.city}, {establishment.province}</span>
          </div>
          
          {establishment.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{establishment.address}</span>
            </div>
          )}
          
          {establishment.public_contact_phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{establishment.public_contact_phone}</span>
            </div>
          )}
          
          {establishment.public_contact_email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{establishment.public_contact_email}</span>
            </div>
          )}
          
          {establishment.services && establishment.services.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-semibold text-gray-500 mb-2">Services</p>
              <div className="flex flex-wrap gap-1">
                {establishment.services.slice(0, 3).map((service, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {establishment.services.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{establishment.services.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {establishment.capacity && (
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                {establishment.capacity.beds && (
                  <span className="text-gray-600">
                    <span className="font-semibold">{establishment.capacity.beds}</span> lits
                  </span>
                )}
                {establishment.capacity.operating_rooms && (
                  <span className="text-gray-600">
                    <span className="font-semibold">{establishment.capacity.operating_rooms}</span> blocs
                  </span>
                )}
                {establishment.capacity.consultation_rooms && (
                  <span className="text-gray-600">
                    <span className="font-semibold">{establishment.capacity.consultation_rooms}</span> salles
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Bouton Voir les détails */}
          <EstablishmentDetailModal establishment={establishment} />
          
          {establishment.claim_status === ClaimStatus.UNCLAIMED && (
            <Button 
              onClick={() => onClaim(establishment.id)}
              className="w-full mt-2"
              variant="default"
            >
              <Shield className="w-4 h-4 mr-2" />
              Revendiquer cet Établissement
            </Button>
          )}
          
          {establishment.claim_status === ClaimStatus.VERIFIED && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                Établissement vérifié et géré
              </p>
              {establishment.claimed_at && (
                <p className="text-xs text-green-600 mt-1">
                  Depuis le {new Date(establishment.claimed_at).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function UnclaimedEstablishments() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('unclaimed');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Statistiques
  const stats = {
    total: establishments.length,
    unclaimed: establishments.filter(e => e.claim_status === ClaimStatus.UNCLAIMED).length,
    pending: establishments.filter(e => e.claim_status === ClaimStatus.CLAIM_PENDING).length,
    verified: establishments.filter(e => e.claim_status === ClaimStatus.VERIFIED).length
  };

  useEffect(() => {
    loadEstablishments();
  }, [selectedType, selectedProvince, selectedStatus]);

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      
      // Pour l'instant, utiliser des données mockées car la migration n'est pas encore appliquée
      const mockData: Establishment[] = DEMO_ESTABLISHMENTS.map(est => ({
        ...est,
        claim_status: ClaimStatus.UNCLAIMED,
        is_pre_registered: true
      }));
      
      // Appliquer les filtres
      let filteredData = mockData;
      
      if (selectedType && selectedType !== 'all') {
        filteredData = filteredData.filter(e => e.type === selectedType);
      }
      
      if (selectedProvince && selectedProvince !== 'all') {
        filteredData = filteredData.filter(e => e.province === selectedProvince);
      }
      
      if (searchTerm) {
        filteredData = filteredData.filter(e => 
          e.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedStatus !== 'all') {
        filteredData = filteredData.filter(e => e.claim_status === selectedStatus);
      }
      
      setEstablishments(filteredData);
    } catch (error) {
      console.error('Error loading establishments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les établissements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadEstablishments();
  };

  const handleClaim = (establishmentId: string) => {
    navigate(`/establishments/${establishmentId}/claim`);
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Établissements de Santé du Gabon
            </h1>
            <p className="text-gray-600 mt-2">
              Trouvez et revendiquez la gestion de votre établissement de santé
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/my-claims')}
          >
            <Activity className="w-4 h-4 mr-2" />
            Mes Revendications
          </Button>
        </div>

        {/* Statistiques */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Statistiques des établissements</h3>
          <EstablishmentStatsCard variant="default" showTotal={true} columns={4} />
          
          {/* Statuts de revendication */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Non-Revendiqués
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700">{stats.unclaimed}</div>
                <p className="text-xs text-gray-500 mt-1">En attente de gestionnaire</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">
                  En Vérification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                <p className="text-xs text-gray-500 mt-1">Revendications en cours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">
                  Vérifiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                <p className="text-xs text-gray-500 mt-1">Établissements actifs</p>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Filtres et recherche */}
      <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres de Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unclaimed">Non-Revendiqués</SelectItem>
                    <SelectItem value="pending">En Vérification</SelectItem>
                    <SelectItem value="verified">Vérifiés</SelectItem>
                    <SelectItem value="all">Tous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'établissement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.entries(ESTABLISHMENT_TYPES).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les provinces</SelectItem>
                    {PROVINCES.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information importante */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Comment ça marche ?</AlertTitle>
          <AlertDescription>
            <ol className="mt-2 space-y-1 text-sm">
              <li>1. Trouvez votre établissement dans la liste ci-dessous</li>
              <li>2. Cliquez sur "Revendiquer cet Établissement"</li>
              <li>3. Fournissez les documents justificatifs requis</li>
              <li>4. Votre demande sera vérifiée sous 24-48 heures</li>
              <li>5. Une fois approuvé, vous pourrez gérer votre établissement sur SANTE.GA</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Liste des établissements */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : establishments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">
                Aucun établissement trouvé
              </h3>
              <p className="text-gray-500 mt-2">
                Essayez de modifier vos critères de recherche
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {establishments.map((establishment) => (
              <EstablishmentCard
                key={establishment.id}
                establishment={establishment}
                onClaim={handleClaim}
              />
            ))}
        </div>
      )}
      </div>
    </SuperAdminLayout>
  );
}
