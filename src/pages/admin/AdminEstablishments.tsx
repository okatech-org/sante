import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Users,
  BedDouble,
  TrendingUp,
  MapPin,
  Shield,
  RefreshCw
} from "lucide-react";
import {
  EstablishmentCategory,
  EstablishmentStatus,
  EstablishmentFilter,
  EstablishmentStatistics,
  Establishment,
  ESTABLISHMENT_SEGMENTS,
  GABON_PROVINCES,
  EstablishmentLevel
} from "@/types/establishment";
import { EstablishmentTable } from "@/components/admin/EstablishmentTable";
import { EstablishmentStatsCards } from "@/components/admin/EstablishmentStatsCards";
import { EstablishmentFormModal } from "@/components/admin/EstablishmentFormModal";
import { EstablishmentDetailModal } from "@/components/admin/EstablishmentDetailModal";
import { EstablishmentFilters } from "@/components/admin/EstablishmentFilters";
import { useEstablishments } from "@/hooks/useEstablishments";
import { establishmentsService } from "@/services/establishments.service";
import { EstablishmentCard } from "@/components/admin/EstablishmentCard";
import { Eye as ViewIcon, Grid, List } from "lucide-react";

const AdminEstablishments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isSuperAdmin, isAdmin } = useOfflineAuth();
  
  // États principaux
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [statistics, setStatistics] = useState<EstablishmentStatistics | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [filter, setFilter] = useState<EstablishmentFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // États UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modaux
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // Hook personnalisé pour les API calls
  const { fetchEstablishments, createEstablishment, updateEstablishment, deleteEstablishment } = useEstablishments();
  
  // Vérification des permissions
  useEffect(() => {
    if (!user || (!isSuperAdmin && !isAdmin)) {
      navigate("/login/admin");
    }
  }, [user, isSuperAdmin, isAdmin, navigate]);

  if (!user || (!isSuperAdmin && !isAdmin)) {
    return null;
  }

  // Chargement initial des données
  useEffect(() => {
    loadEstablishments();
  }, []);

  // Filtrage intelligent
  useEffect(() => {
    applyFilters();
  }, [establishments, filter, searchQuery, selectedSegment]);

  const loadEstablishments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser le service unifié pour obtenir exactement 397 établissements
      const data = await establishmentsService.getAllEstablishments(true);
      setEstablishments(data);
      calculateStatistics(data);
      setSuccess(`${data.length} établissements synchronisés avec la cartographie`);
      setTimeout(() => setSuccess(null), 3000);
      
      toast({
        title: "Synchronisation réussie",
        description: `${data.length} établissements chargés (unifié avec la cartographie)`,
      });
    } catch (err) {
      // Fallback vers les données locales
      const mockData = await fetchMockEstablishments();
      setEstablishments(mockData);
      calculateStatistics(mockData);
      
      toast({
        title: "Mode local",
        description: `${mockData.length} établissements (données locales)`,
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (data: Establishment[]) => {
    const stats: EstablishmentStatistics = {
      totalCount: data.length,
      byCategory: {} as Record<EstablishmentCategory, number>,
      byStatus: {} as Record<EstablishmentStatus, number>,
      byProvince: {},
      byLevel: {} as Record<EstablishmentLevel, number>,
      totalBeds: 0,
      totalDoctors: 0,
      totalNurses: 0,
      totalStaff: 0,
      avgOccupancyRate: 0,
      avgPatientSatisfaction: 0,
      totalConsultationsMonthly: 0,
      totalEmergenciesMonthly: 0,
    };

    data.forEach(est => {
      // Par catégorie
      stats.byCategory[est.category] = (stats.byCategory[est.category] || 0) + 1;
      
      // Par statut
      stats.byStatus[est.status] = (stats.byStatus[est.status] || 0) + 1;
      
      // Par province
      stats.byProvince[est.location.province] = (stats.byProvince[est.location.province] || 0) + 1;
      
      // Par niveau
      stats.byLevel[est.level] = (stats.byLevel[est.level] || 0) + 1;
      
      // Totaux
      stats.totalBeds += est.metrics.totalBeds;
      stats.totalDoctors += est.staff.doctors;
      stats.totalNurses += est.staff.nurses;
      stats.totalStaff += est.staff.total;
      stats.totalConsultationsMonthly += est.metrics.consultationsMonthly;
      stats.totalEmergenciesMonthly += est.metrics.emergenciesMonthly;
    });

    // Moyennes
    if (data.length > 0) {
      stats.avgOccupancyRate = data.reduce((sum, est) => sum + est.metrics.occupancyRate, 0) / data.length;
      stats.avgPatientSatisfaction = data.reduce((sum, est) => sum + est.metrics.patientSatisfaction, 0) / data.length;
    }

    setStatistics(stats);
  };

  const applyFilters = () => {
    let filtered = [...establishments];

    // Filtre par segment
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(est => getEstablishmentSegment(est) === selectedSegment);
    }

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(est => 
        est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.director?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Autres filtres
    if (filter.category?.length) {
      filtered = filtered.filter(est => filter.category?.includes(est.category));
    }
    if (filter.status?.length) {
      filtered = filtered.filter(est => filter.status?.includes(est.status));
    }
    if (filter.level?.length) {
      filtered = filtered.filter(est => filter.level?.includes(est.level));
    }
    if (filter.province?.length) {
      filtered = filtered.filter(est => filter.province?.includes(est.location.province));
    }
    if (filter.hasEmergency !== undefined) {
      filtered = filtered.filter(est => est.isEmergencyCenter === filter.hasEmergency);
    }

    setFilteredEstablishments(filtered);
  };

  const getEstablishmentSegment = (est: Establishment): string => {
    if (est.category === 'gouvernemental') return 'governmental';
    if (est.category === 'universitaire' || est.level === 'regional') return 'tertiaryHospitals';
    if (est.category === 'departemental') return 'secondaryHospitals';
    if (est.category === 'centre_sante' || est.category === 'dispensaire') return 'primaryCare';
    if (est.category === 'prive') return 'privateClinics';
    if (est.category === 'specialise') return 'specializedCenters';
    if (est.category === 'laboratoire' || est.category === 'pharmacie') return 'supportServices';
    return 'primaryCare';
  };

  // Actions CRUD
  const handleCreate = () => {
    setFormMode('create');
    setSelectedEstablishment(null);
    setShowFormModal(true);
  };

  const handleEdit = (establishment: Establishment) => {
    setFormMode('edit');
    setSelectedEstablishment(establishment);
    setShowFormModal(true);
  };

  const handleView = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setShowDetailModal(true);
  };

  const handleDelete = async (establishment: Establishment) => {
    if (!confirm(`Voulez-vous vraiment supprimer ${establishment.name} ?`)) return;

    setLoading(true);
    try {
      await deleteEstablishment(establishment.id);
      setEstablishments(prev => prev.filter(e => e.id !== establishment.id));
      toast({
        title: "Succès",
        description: "Établissement supprimé avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'établissement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (formMode === 'create') {
        const newEstablishment = await createEstablishment(data);
        setEstablishments(prev => [...prev, newEstablishment]);
        toast({
          title: "Succès",
          description: "Établissement créé avec succès",
        });
      } else {
        const updated = await updateEstablishment(selectedEstablishment!.id, data);
        setEstablishments(prev => prev.map(e => e.id === updated.id ? updated : e));
        toast({
          title: "Succès",
          description: "Établissement mis à jour avec succès",
        });
      }
      setShowFormModal(false);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'établissement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = filteredEstablishments.map(est => ({
      Code: est.code,
      Nom: est.name,
      Catégorie: est.category,
      Niveau: est.level,
      Statut: est.status,
      Province: est.location.province,
      Ville: est.location.city,
      Lits: est.metrics.totalBeds,
      Médecins: est.staff.doctors,
      Infirmiers: est.staff.nurses,
      'Taux Occupation': `${est.metrics.occupancyRate}%`,
      'Satisfaction Patients': est.metrics.patientSatisfaction
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'etablissements.csv');
    
    toast({
      title: "Export réussi",
      description: `${filteredEstablishments.length} établissements exportés`,
    });
  };

  const handleRefresh = () => {
    loadEstablishments();
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Gestion des Établissements de Santé
            </h1>
            <p className="text-muted-foreground mt-1">
              Administration et supervision du réseau sanitaire national • {statistics?.totalCount || 0} établissements
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Établissement
            </Button>
          </div>
        </div>
        {/* Messages de statut */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <XCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-semibold">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <CheckCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-semibold">Succès</p>
              <p className="text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Statistiques */}
        {statistics && (
          <EstablishmentStatsCards 
            statistics={statistics} 
            loading={loading}
          />
        )}

        {/* Ministère de la Santé - Carte spéciale */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-700" />
                <div>
                  <CardTitle className="text-xl text-blue-900">
                    Ministère de la Santé publique et de la Population
                  </CardTitle>
                  <p className="text-sm text-blue-700 mt-1">
                    Autorité de Régulation Nationale - Supervision de {statistics?.totalCount || 0} établissements
                  </p>
                </div>
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.location.href = '/gouv/dashboard'}
              >
                Accéder au Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Segmentation et filtres */}
        <Tabs value={selectedSegment} onValueChange={setSelectedSegment} className="space-y-4">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto p-1">
            <TabsTrigger value="all" className="text-xs">
              Tous ({establishments.length})
            </TabsTrigger>
            {Object.entries(ESTABLISHMENT_SEGMENTS).map(([key, segment]) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                <span className="mr-1">{segment.icon}</span>
                {segment.label.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, code, ville, directeur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <EstablishmentFilters
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>

            {/* Description du segment sélectionné */}
            {selectedSegment !== 'all' && ESTABLISHMENT_SEGMENTS[selectedSegment as keyof typeof ESTABLISHMENT_SEGMENTS] && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">
                  {ESTABLISHMENT_SEGMENTS[selectedSegment as keyof typeof ESTABLISHMENT_SEGMENTS].icon}{' '}
                  {ESTABLISHMENT_SEGMENTS[selectedSegment as keyof typeof ESTABLISHMENT_SEGMENTS].label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ESTABLISHMENT_SEGMENTS[selectedSegment as keyof typeof ESTABLISHMENT_SEGMENTS].description}
                </p>
              </div>
            )}

            {/* Affichage des établissements (Grille ou Tableau) */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : viewMode === 'grid' ? (
              // Mode Grille
              filteredEstablishments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEstablishments.map((establishment) => (
                    <EstablishmentCard
                      key={establishment.id}
                      establishment={establishment}
                      onUpdate={(updated) => {
                        setEstablishments(prev => 
                          prev.map(e => e.id === updated.id ? updated : e)
                        );
                        toast({
                          title: "Mise à jour réussie",
                          description: `${updated.name} a été mis à jour`
                        });
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Aucun établissement trouvé
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Aucun établissement ne correspond aux critères de recherche.
                      Essayez de modifier les filtres ou d'ajouter un nouvel établissement.
                    </p>
                    <Button onClick={handleCreate} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un établissement
                    </Button>
                  </CardContent>
                </Card>
              )
            ) : (
              // Mode Tableau
              filteredEstablishments.length > 0 ? (
                <EstablishmentTable
                  establishments={filteredEstablishments}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Aucun établissement trouvé
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Aucun établissement ne correspond aux critères de recherche.
                      Essayez de modifier les filtres ou d'ajouter un nouvel établissement.
                    </p>
                    <Button onClick={handleCreate} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un établissement
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </Tabs>
      </div>

      {/* Modaux */}
      {showFormModal && (
        <EstablishmentFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
          establishment={selectedEstablishment}
          mode={formMode}
          loading={loading}
        />
      )}

      {showDetailModal && selectedEstablishment && (
        <EstablishmentDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          establishment={selectedEstablishment}
          onEdit={() => {
            setShowDetailModal(false);
            handleEdit(selectedEstablishment);
          }}
        />
      )}
    </SuperAdminLayoutSimple>
  );
};

// Fonctions utilitaires
const fetchMockEstablishments = async (): Promise<Establishment[]> => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    {
      id: 'est-gov-001',
      code: 'MSHP-001',
      name: 'Ministère de la Santé',
      fullName: 'Ministère de la Santé publique et de la Population',
      category: 'gouvernemental',
      level: 'national',
      status: 'operationnel',
      managingAuthority: 'République Gabonaise',
      director: 'Dr. Jean-Marie NZAMBA',
      directorContact: 'ministre@sante.gouv.ga',
      location: {
        address: 'À côté de l\'immeuble Alu-Suisse',
        city: 'Libreville',
        province: 'Estuaire',
        coordinates: { latitude: 0.3924, longitude: 9.4537 }
      },
      contact: {
        phoneMain: '+241 01-72-26-61',
        phoneAdmin: '+241 06 47 74 83',
        email: 'contact@sante.gouv.ga',
        website: 'https://sante.gouv.ga'
      },
      metrics: {
        totalBeds: 0,
        occupiedBeds: 0,
        occupancyRate: 0,
        consultationsMonthly: 0,
        surgeriesMonthly: 0,
        emergenciesMonthly: 0,
        patientSatisfaction: 5,
        averageWaitTime: 'N/A',
        averageStayDuration: 'N/A'
      },
      staff: {
        doctors: 0,
        specialists: 0,
        nurses: 0,
        technicians: 0,
        administrative: 150,
        support: 50,
        total: 200
      },
      services: [],
      equipment: [],
      certifications: [{
        id: 'cert-001',
        type: 'autorisation',
        name: 'Autorité de Régulation Nationale',
        issuedBy: 'Gouvernement Gabonais',
        issuedDate: '1995-01-14',
        expiryDate: '2099-12-31',
        status: 'valide'
      }],
      insuranceAccepted: [],
      createdAt: '1995-01-14',
      updatedAt: '2025-11-01',
      isPublic: true,
      isEmergencyCenter: false,
      isReferralCenter: false,
      isTeachingHospital: false,
      hasAmbulance: false,
      hasPharmacy: false,
      hasLaboratory: false,
      hasMortuary: false,
      logoUrl: '/logo-ministere.png'
    },
    {
      id: 'est-002',
      code: 'CHU-LBV-001',
      name: 'CHU de Libreville',
      fullName: 'Centre Hospitalier Universitaire de Libreville',
      category: 'universitaire',
      level: 'national',
      status: 'operationnel',
      managingAuthority: 'Ministère de la Santé',
      director: 'Prof. Dr. Marie OBAME',
      directorContact: 'direction@chul.ga',
      location: {
        address: 'Avenue Bouët',
        city: 'Libreville',
        province: 'Estuaire',
        coordinates: { latitude: 0.3907, longitude: 9.4496 }
      },
      contact: {
        phoneMain: '+241 01-76-30-01',
        phoneEmergency: '+241 01-76-30-00',
        email: 'contact@chul.ga',
        website: 'https://chul.ga'
      },
      metrics: {
        totalBeds: 450,
        occupiedBeds: 351,
        occupancyRate: 78,
        consultationsMonthly: 12500,
        surgeriesMonthly: 850,
        emergenciesMonthly: 3200,
        patientSatisfaction: 4.2,
        averageWaitTime: '2h30',
        averageStayDuration: '5 jours'
      },
      staff: {
        doctors: 125,
        specialists: 85,
        nurses: 420,
        technicians: 95,
        administrative: 120,
        support: 180,
        total: 1025
      },
      services: [
        {
          id: 'srv-001',
          name: 'Urgences',
          category: 'urgence',
          available: true,
          operationalHours: '24/7',
          staffCount: 45,
          waitTime: '1h30'
        },
        {
          id: 'srv-002',
          name: 'Maternité',
          category: 'hospitalisation',
          available: true,
          operationalHours: '24/7',
          staffCount: 35,
          waitTime: '30min'
        }
      ],
      equipment: [
        {
          id: 'eq-001',
          name: 'Scanner',
          category: 'imagerie',
          quantity: 2,
          functional: 2,
          maintenance: 0,
          broken: 0
        },
        {
          id: 'eq-002',
          name: 'IRM',
          category: 'imagerie',
          quantity: 1,
          functional: 1,
          maintenance: 0,
          broken: 0
        }
      ],
      certifications: [
        {
          id: 'cert-002',
          type: 'accreditation',
          name: 'Accréditation Hospitalière',
          issuedBy: 'Ministère de la Santé',
          issuedDate: '2023-01-15',
          expiryDate: '2028-01-15',
          status: 'valide'
        }
      ],
      insuranceAccepted: ['CNAMGS', 'CNSS'],
      createdAt: '1985-06-12',
      updatedAt: '2025-11-01',
      isPublic: true,
      isEmergencyCenter: true,
      isReferralCenter: true,
      isTeachingHospital: true,
      hasAmbulance: true,
      hasPharmacy: true,
      hasLaboratory: true,
      hasMortuary: true
    },
    // Ajoutez plus d'établissements mock ici...
  ];
};

const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default AdminEstablishments;