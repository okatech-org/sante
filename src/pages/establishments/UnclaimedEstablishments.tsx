import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Hospital as HospitalIcon,
  Briefcase,
  FlaskConical,
  Pill,
  Info,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";
import { claimService, ClaimStatus, type Establishment } from '@/services/EstablishmentClaimService';

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
  hospital: { label: 'Hôpital', icon: HospitalIcon, color: 'blue' },
  clinic: { label: 'Clinique', icon: Building2, color: 'green' },
  cabinet: { label: 'Cabinet Médical', icon: Briefcase, color: 'purple' },
  pharmacy: { label: 'Pharmacie', icon: Pill, color: 'orange' },
  laboratory: { label: 'Laboratoire', icon: FlaskConical, color: 'pink' }
};

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
          
          {establishment.claim_status === ClaimStatus.UNCLAIMED && (
            <Button 
              onClick={() => onClaim(establishment.id)}
              className="w-full mt-4"
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
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
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
      
      let data: Establishment[] = [];
      
      if (selectedStatus === 'unclaimed') {
        data = await claimService.getUnclaimedEstablishments({
          type: selectedType || undefined,
          province: selectedProvince || undefined,
          search: searchTerm || undefined
        });
      } else {
        // Pour les autres statuts, utiliser une requête directe
        // (à implémenter dans le service)
        data = await claimService.getUnclaimedEstablishments({
          type: selectedType || undefined,
          province: selectedProvince || undefined,
          search: searchTerm || undefined
        });
      }
      
      setEstablishments(data);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
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
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Établissements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Dans la base de données</p>
            </CardContent>
          </Card>
          
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
      <div className="container mx-auto px-4 py-4">
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
                    <SelectItem value="">Tous les types</SelectItem>
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
                    <SelectItem value="">Toutes les provinces</SelectItem>
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
      </div>

      {/* Information importante */}
      <div className="container mx-auto px-4 py-4">
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
      </div>

      {/* Liste des établissements */}
      <div className="container mx-auto px-4 py-6">
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
    </div>
  );
}
