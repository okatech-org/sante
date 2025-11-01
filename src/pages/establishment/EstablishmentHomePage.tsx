// Page d'accueil personnalisée pour un établissement
// SANTE.GA - Plateforme E-Santé Gabon

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { establishmentsService } from "@/services/establishments.service";
import { Establishment } from "@/types/establishment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  Users,
  Bed,
  Activity,
  Heart,
  Calendar,
  AlertCircle,
  CheckCircle,
  Building2,
  Stethoscope,
  Pill,
  TestTube,
  Truck,
  ChevronLeft,
  ExternalLink,
  Navigation,
  Star
} from "lucide-react";

/**
 * Map des URLs personnalisées vers les établissements
 * Note: Le Ministère redirige vers sa propre page, pas vers EstablishmentHomePage
 */
const CUSTOM_URL_MAPPING: Record<string, { id: string; name: string }> = {
  // CHU
  '/chu-libreville': { id: 'est-002', name: 'CHU de Libreville' },
  '/chu-jeanne-ebori': { id: 'est-004', name: 'CHU Mère et Enfant Jeanne Ebori' },
  '/chu-melen': { id: 'est-003', name: 'CHU de Melen' },
  '/chu-angondje': { id: 'est-chu-ang', name: 'CHU d\'Angondjé' },
  
  // CHR
  '/chr-franceville': { id: 'est-chr-001', name: 'CHR de Franceville' },
  '/chr-port-gentil': { id: 'est-chr-002', name: 'CHR de Port-Gentil' },
  '/chr-oyem': { id: 'est-chr-003', name: 'CHR d\'Oyem' },
  '/chr-mouila': { id: 'est-chr-004', name: 'CHR de Mouila' },
  '/chr-tchibanga': { id: 'est-chr-005', name: 'CHR de Tchibanga' },
  '/chr-makokou': { id: 'est-chr-006', name: 'CHR de Makokou' },
  '/chr-koulamoutou': { id: 'est-chr-007', name: 'CHR de Koulamoutou' },
  '/chr-lambarene': { id: 'est-chr-008', name: 'CHR de Lambaréné' },
  '/chr-omboue': { id: 'est-chr-009', name: 'CHR d\'Omboué' },
  
  // Hôpitaux spécialisés
  '/hopital-sino-gabonais': { id: 'est-hsg-001', name: 'Hôpital Sino-Gabonais' },
  '/hia-obo': { id: 'est-hia-001', name: 'Hôpital d\'Instruction des Armées Omar Bongo Ondimba' },
  '/hopital-psychiatrique-melen': { id: 'est-hpm-001', name: 'Hôpital Psychiatrique de Melen' },
  
  // Cliniques privées
  '/clinique-el-rapha': { id: 'est-cer-001', name: 'Clinique El Rapha' },
  '/polyclinique-chambrier': { id: 'est-pch-001', name: 'Polyclinique Chambrier' },
  '/polyclinique-el-rapha-2': { id: 'est-per2-001', name: 'Polyclinique El Rapha 2' },
  '/cm-sabliere': { id: 'est-cms-001', name: 'Centre Médical de la Sablière' },
  '/clinique-littoral': { id: 'est-clt-001', name: 'Clinique du Littoral' },
  '/clinique-estuaire': { id: 'est-ces-001', name: 'Clinique de l\'Estuaire' },
  
  // Centres spécialisés
  '/cts-libreville': { id: 'est-cts-001', name: 'Centre de Transfusion Sanguine' },
  '/icl': { id: 'est-icl-001', name: 'Institut de Cancérologie de Libreville' },
  '/dialyse-libreville': { id: 'est-cdl-001', name: 'Centre de Dialyse de Libreville' },
  
  // Laboratoires
  '/lnsp': { id: 'est-lnsp-001', name: 'Laboratoire National de Santé Publique' },
  '/cermel': { id: 'est-cermel-001', name: 'Centre de Recherches Médicales de Lambaréné' }
};

export default function EstablishmentHomePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [homePageInfo, setHomePageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEstablishmentData();
  }, [id, location.pathname]);

  const loadEstablishmentData = async () => {
    try {
      setLoading(true);
      
      let establishmentId = id;
      let establishmentName = null;
      
      // Vérifier si c'est une URL personnalisée
      const customMapping = CUSTOM_URL_MAPPING[location.pathname];
      if (customMapping) {
        establishmentId = customMapping.id;
        establishmentName = customMapping.name;
      }
      
      if (!establishmentId) {
        setError("Identifiant d'établissement manquant");
        setLoading(false);
        return;
      }
      
      // Charger les données de l'établissement
      const est = await establishmentsService.getEstablishmentById(establishmentId);
      if (!est) {
        // Si pas trouvé par ID, essayer de trouver par nom pour les établissements personnalisés
        if (establishmentName) {
          const allEstablishments = await establishmentsService.getAllEstablishments();
          const foundEst = allEstablishments.find(e => e.name === establishmentName);
          if (foundEst) {
            setEstablishment(foundEst);
            // Charger les infos de page d'accueil
            const homePage = await establishmentsService.getHomePage(foundEst.id, foundEst.name);
            setHomePageInfo(homePage);
            setLoading(false);
            return;
          }
        }
        setError("Établissement non trouvé");
        setLoading(false);
        return;
      }
      
      setEstablishment(est);
      
      // Charger les infos de page d'accueil
      const homePage = await establishmentsService.getHomePage(establishmentId, est.name);
      
      // Pour les URLs personnalisées, toujours autoriser l'affichage
      if (customMapping || homePage?.customUrl) {
        setHomePageInfo(homePage || { hasHomePage: true, customUrl: location.pathname });
      } else if (!homePage || !homePage.hasHomePage) {
        setError("Cet établissement n'a pas de page d'accueil publique");
        setLoading(false);
        return;
      } else {
        setHomePageInfo(homePage);
      }
    } catch (err) {
      console.error("Erreur chargement:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!establishment) return null;

  const isOperational = establishment.status === 'operationnel';
  const hasEmergency = establishment.isEmergencyCenter;
  const occupancyClass = establishment.metrics.occupancyRate > 80 ? 'text-red-500' : 
                         establishment.metrics.occupancyRate > 60 ? 'text-orange-500' : 
                         'text-green-500';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold">
                    {homePageInfo?.customContent?.hero || establishment.name}
                  </h1>
                  <p className="text-white/90">{establishment.fullName || establishment.name}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {establishment.category}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`${isOperational ? 'bg-green-500/20' : 'bg-red-500/20'} text-white border-white/30`}
                >
                  {isOperational ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  {establishment.status}
                </Badge>
                {hasEmergency && (
                  <Badge variant="secondary" className="bg-red-500/20 text-white border-white/30">
                    <Truck className="h-3 w-3 mr-1" />
                    Urgences 24/7
                  </Badge>
                )}
              </div>

              <p className="text-white/90 max-w-3xl">
                {homePageInfo?.customContent?.description || 
                 `Établissement de santé de niveau ${establishment.level} situé à ${establishment.location.city}, ${establishment.location.province}.`}
              </p>
            </div>

            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Services */}
            {homePageInfo?.customContent?.services && homePageInfo.customContent.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Services proposés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {homePageInfo.customContent.services.map((service: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services de l'établissement */}
            {establishment.services && establishment.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Départements et Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {establishment.services.map((service, idx) => (
                      <div key={idx} className="border-l-4 border-primary/20 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600">
                              {service.operationalHours || 'Horaires non spécifiés'}
                            </p>
                          </div>
                          {service.available ? (
                            <Badge variant="secondary" className="bg-green-100">Disponible</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100">Indisponible</Badge>
                          )}
                        </div>
                        {service.staffCount && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <Users className="h-3 w-3" />
                            {service.staffCount} personnels
                          </div>
                        )}
                        {service.waitTime && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            Attente: {service.waitTime}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Indicateurs de performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {establishment.metrics.totalBeds}
                    </div>
                    <p className="text-sm text-gray-600">Lits totaux</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${occupancyClass}`}>
                      {establishment.metrics.occupancyRate}%
                    </div>
                    <p className="text-sm text-gray-600">Taux d'occupation</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {establishment.metrics.consultationsMonthly}
                    </div>
                    <p className="text-sm text-gray-600">Consultations/mois</p>
                  </div>
                  {establishment.metrics.emergenciesMonthly > 0 && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {establishment.metrics.emergenciesMonthly}
                      </div>
                      <p className="text-sm text-gray-600">Urgences/mois</p>
                    </div>
                  )}
                  {establishment.metrics.surgeriesMonthly > 0 && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {establishment.metrics.surgeriesMonthly}
                      </div>
                      <p className="text-sm text-gray-600">Chirurgies/mois</p>
                    </div>
                  )}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold">
                        {establishment.metrics.patientSatisfaction.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personnel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personnel médical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{establishment.staff.doctors}</div>
                    <p className="text-sm text-gray-600">Médecins</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{establishment.staff.specialists}</div>
                    <p className="text-sm text-gray-600">Spécialistes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{establishment.staff.nurses}</div>
                    <p className="text-sm text-gray-600">Infirmiers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{establishment.staff.total}</div>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600">{establishment.location.address}</p>
                    <p className="text-gray-600">{establishment.location.city}, {establishment.location.province}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-600">{establishment.contact.phoneMain}</p>
                    {establishment.contact.phoneEmergency && (
                      <p className="text-red-600">Urgences: {establishment.contact.phoneEmergency}</p>
                    )}
                  </div>
                </div>

                {establishment.contact.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${establishment.contact.email}`} className="text-primary hover:underline">
                        {establishment.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {establishment.contact.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Site web</p>
                      <a href={establishment.contact.website} target="_blank" rel="noopener noreferrer" 
                         className="text-primary hover:underline flex items-center gap-1">
                        Visiter le site
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Équipements disponibles */}
            <Card>
              <CardHeader>
                <CardTitle>Équipements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {establishment.hasPharmacy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Pill className="h-4 w-4 text-green-500" />
                      <span>Pharmacie sur site</span>
                    </div>
                  )}
                  {establishment.hasLaboratory && (
                    <div className="flex items-center gap-2 text-sm">
                      <TestTube className="h-4 w-4 text-blue-500" />
                      <span>Laboratoire d'analyses</span>
                    </div>
                  )}
                  {establishment.hasAmbulance && (
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-red-500" />
                      <span>Service ambulance</span>
                    </div>
                  )}
                  {establishment.isEmergencyCenter && (
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-orange-500" />
                      <span>Centre d'urgences 24/7</span>
                    </div>
                  )}
                  {establishment.isReferralCenter && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-purple-500" />
                      <span>Centre de référence</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Assurances acceptées */}
            {establishment.insuranceAccepted && establishment.insuranceAccepted.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Assurances acceptées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {establishment.insuranceAccepted.map((insurance, idx) => (
                      <Badge key={idx} variant="secondary">
                        {insurance}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Localisation */}
            {establishment.location.coordinates && (
              <Card>
                <CardHeader>
                  <CardTitle>Localisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const { latitude, longitude } = establishment.location.coordinates!;
                      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Ouvrir dans Google Maps
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
