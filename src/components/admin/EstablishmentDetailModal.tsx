import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Establishment } from "@/types/establishment";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  BedDouble,
  Activity,
  Clock,
  Shield,
  Edit,
  Printer,
  Share2,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Star,
  TrendingUp,
  Calendar
} from "lucide-react";
import { PharmacyRolesTab } from "./PharmacyRolesTab";

interface EstablishmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishment: Establishment;
  onEdit?: () => void;
}

export const EstablishmentDetailModal = ({
  isOpen,
  onClose,
  establishment,
  onEdit
}: EstablishmentDetailModalProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_establishment_favorites');
      const ids = raw ? JSON.parse(raw) : [];
      setIsFavorite(Array.isArray(ids) ? ids.includes(establishment.id) : false);
    } catch {}
  }, [establishment.id]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('admin_establishment_favorites');
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const exists = ids.includes(establishment.id);
      const next = exists ? ids.filter(id => id !== establishment.id) : [...ids, establishment.id];
      localStorage.setItem('admin_establishment_favorites', JSON.stringify(next));
      setIsFavorite(!exists);
      toast.success(exists ? "Retiré des favoris" : "Ajouté aux favoris");
    } catch {}
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operationnel': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partiel': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'maintenance': return <Clock className="h-5 w-5 text-blue-600" />;
      default: return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const formatCategory = (category: string) => {
    const labels: Record<string, string> = {
      'gouvernemental': 'Gouvernemental',
      'universitaire': 'Centre Hospitalier Universitaire',
      'regional': 'Centre Hospitalier Régional',
      'departemental': 'Centre Hospitalier Départemental',
      'militaire': 'Hôpital Militaire',
      'prive': 'Établissement Privé',
      'confessionnel': 'Établissement Confessionnel',
      'centre_sante': 'Centre de Santé',
      'dispensaire': 'Dispensaire',
      'laboratoire': 'Laboratoire',
      'pharmacie': 'Pharmacie',
      'specialise': 'Centre Spécialisé'
    };
    return labels[category] || category;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: establishment.name,
        text: `Informations sur ${establishment.name}`,
        url: window.location.href
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {establishment.logoUrl ? (
                <img 
                  src={establishment.logoUrl} 
                  alt={establishment.name}
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <DialogTitle className="text-2xl">
                  {establishment.name}
                </DialogTitle>
                <DialogDescription className="text-base mt-1">
                  {establishment.fullName || "Informations de l'établissement"}
                </DialogDescription>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusIcon(establishment.status)}
                  <Badge variant={establishment.status === 'operationnel' ? 'default' : 'secondary'}>
                    {establishment.status}
                  </Badge>
                  <Badge variant="outline">
                    {formatCategory(establishment.category)}
                  </Badge>
                  <Badge variant="outline">
                    Niveau {establishment.level}
                  </Badge>
                </div>
              </div>
            </div>
            <button
              onClick={toggleFavorite}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`p-2 rounded hover:bg-muted/60 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-muted-foreground'}`}
            >
              <Star className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className={`grid w-full ${establishment.category === 'pharmacie' ? 'grid-cols-7' : 'grid-cols-6'}`}>
            <TabsTrigger value="overview">Général</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="capacity">Capacités</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            {establishment.category === 'pharmacie' && (
              <TabsTrigger value="roles">Rôles</TabsTrigger>
            )}
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Code établissement</p>
                  <p className="font-medium">{establishment.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Autorité de tutelle</p>
                  <p className="font-medium">{establishment.managingAuthority}</p>
                </div>
                {establishment.director && (
                  <div>
                    <p className="text-sm text-muted-foreground">Directeur</p>
                    <p className="font-medium">{establishment.director}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Type d'établissement</p>
                  <p className="font-medium">
                    {establishment.isPublic ? 'Public' : 'Privé'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de création</p>
                  <p className="font-medium">
                    {new Date(establishment.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                  <p className="font-medium">
                    {new Date(establishment.updatedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Localisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{establishment.location.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {establishment.location.city}, {establishment.location.province}
                      {establishment.location.postalCode && ` - ${establishment.location.postalCode}`}
                    </p>
                  </div>
                </div>
                {establishment.location.coordinates && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      GPS: {establishment.location.coordinates.latitude}, {establishment.location.coordinates.longitude}
                    </p>
                  </div>
                )}
                {establishment.location.accessInfo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Instructions d'accès</p>
                    <p className="text-sm">{establishment.location.accessInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {establishment.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certifications et Autorisations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {establishment.certifications.map(cert => (
                      <div key={cert.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Délivré par {cert.issuedBy} le {new Date(cert.issuedDate).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expire le {new Date(cert.expiryDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant={cert.status === 'valide' ? 'default' : 'destructive'}>
                          {cert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{establishment.contact.phoneMain}</p>
                    <p className="text-sm text-muted-foreground">Téléphone principal</p>
                  </div>
                </div>
                
                {establishment.contact.phoneEmergency && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium">{establishment.contact.phoneEmergency}</p>
                      <p className="text-sm text-muted-foreground">Urgences</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{establishment.contact.email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                
                {establishment.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <a 
                        href={establishment.contact.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {establishment.contact.website}
                      </a>
                      <p className="text-sm text-muted-foreground">Site web</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capacity" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Capacité en lits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <BedDouble className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{establishment.metrics.totalBeds}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Occupés: {establishment.metrics.occupiedBeds}</p>
                    <p>Taux: {establishment.metrics.occupancyRate}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Personnel médical
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">
                      {establishment.staff.doctors + establishment.staff.nurses}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Médecins: {establishment.staff.doctors}</p>
                    <p>Infirmiers: {establishment.staff.nurses}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Personnel total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{establishment.staff.total}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Admin: {establishment.staff.administrative}</p>
                    <p>Support: {establishment.staff.support}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Répartition du Personnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Médecins</p>
                    <p className="text-xl font-bold">{establishment.staff.doctors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spécialistes</p>
                    <p className="text-xl font-bold">{establishment.staff.specialists}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Infirmiers</p>
                    <p className="text-xl font-bold">{establishment.staff.nurses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Techniciens</p>
                    <p className="text-xl font-bold">{establishment.staff.technicians}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Administratif</p>
                    <p className="text-xl font-bold">{establishment.staff.administrative}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Support</p>
                    <p className="text-xl font-bold">{establishment.staff.support}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Services Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {establishment.services.map(service => (
                    <div key={service.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{service.name}</p>
                        <Badge 
                          variant={service.available ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {service.available ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {service.operationalHours && (
                          <p>Horaires: {service.operationalHours}</p>
                        )}
                        <p>Personnel: {service.staffCount}</p>
                        {service.waitTime && (
                          <p>Attente: {service.waitTime}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {establishment.insuranceAccepted.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Assurances acceptées</p>
                    <div className="flex gap-2">
                      {establishment.insuranceAccepted.map(insurance => (
                        <Badge key={insurance} variant="outline">
                          {insurance}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Services spéciaux</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {establishment.isEmergencyCenter && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Service d'urgence 24/7</span>
                      </div>
                    )}
                    {establishment.isReferralCenter && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Centre de référence</span>
                      </div>
                    )}
                    {establishment.isTeachingHospital && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Hôpital universitaire</span>
                      </div>
                    )}
                    {establishment.hasAmbulance && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Ambulance disponible</span>
                      </div>
                    )}
                    {establishment.hasPharmacy && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Pharmacie sur site</span>
                      </div>
                    )}
                    {establishment.hasLaboratory && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Laboratoire d'analyses</span>
                      </div>
                    )}
                    {establishment.hasMortuary && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Morgue</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {establishment.category === 'pharmacie' && (
            <TabsContent value="roles" className="space-y-4">
              <PharmacyRolesTab />
            </TabsContent>
          )}

          <TabsContent value="equipment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Équipements Majeurs</CardTitle>
              </CardHeader>
              <CardContent>
                {establishment.equipment.length > 0 ? (
                  <div className="space-y-4">
                    {establishment.equipment.map(equip => (
                      <div key={equip.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{equip.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Catégorie: {equip.category}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Total: {equip.quantity}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Fonctionnels</p>
                            <p className="font-medium text-green-600">{equip.functional}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">En maintenance</p>
                            <p className="font-medium text-orange-600">{equip.maintenance}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">En panne</p>
                            <p className="font-medium text-red-600">{equip.broken}</p>
                          </div>
                        </div>
                        
                        {(equip.lastMaintenance || equip.nextMaintenance) && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            {equip.lastMaintenance && (
                              <p>Dernière maintenance: {new Date(equip.lastMaintenance).toLocaleDateString('fr-FR')}</p>
                            )}
                            {equip.nextMaintenance && (
                              <p>Prochaine maintenance: {new Date(equip.nextMaintenance).toLocaleDateString('fr-FR')}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Aucun équipement enregistré
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Consultations/mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <span className="text-2xl font-bold">
                      {establishment.metrics.consultationsMonthly.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Urgences/mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <Activity className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">
                      {establishment.metrics.emergenciesMonthly.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Chirurgies/mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">
                      {establishment.metrics.surgeriesMonthly.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicateurs de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Satisfaction patients</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">
                      {establishment.metrics.patientSatisfaction.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">/5.0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Temps d'attente moyen</span>
                  </div>
                  <span className="text-xl font-bold">
                    {establishment.metrics.averageWaitTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Durée moyenne séjour</span>
                  </div>
                  <span className="text-xl font-bold">
                    {establishment.metrics.averageStayDuration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Taux d'occupation lits</span>
                  </div>
                  <span className="text-xl font-bold">
                    {establishment.metrics.occupancyRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {establishment.finance && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations Financières</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budget annuel</p>
                      <p className="font-medium">{establishment.finance.annualBudget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Taux d'exécution</p>
                      <p className="font-medium">{establishment.finance.executionRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenus CNAMGS</p>
                      <p className="font-medium">{establishment.finance.cnamgsRevenue}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenus CNSS</p>
                      <p className="font-medium">{establishment.finance.cnssRevenue}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenus privés</p>
                      <p className="font-medium">{establishment.finance.privateRevenue}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Coûts opérationnels</p>
                      <p className="font-medium">{establishment.finance.operatingCosts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
          
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
