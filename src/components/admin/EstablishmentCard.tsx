// Carte d'établissement avec actions complètes
// SANTE.GA - Plateforme E-Santé Gabon

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Phone,
  Users,
  Bed,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  MoreHorizontal,
  ExternalLink,
  Settings,
  Eye,
  Home,
  ShieldCheck,
  ShieldOff,
  Star,
  TrendingUp,
  TrendingDown,
  Mail,
  Shield
} from "lucide-react";
import { Establishment, ESTABLISHMENT_SEGMENTS } from "@/types/establishment";
import { EstablishmentManagementModal } from "./EstablishmentManagementModal";
import { EstablishmentHomePageModal } from "./EstablishmentHomePageModal";
import { establishmentsService } from "@/services/establishments.service";
import { pharmacySlugFromName } from "@/lib/utils";

interface EstablishmentCardProps {
  establishment: Establishment;
  onUpdate: (establishment: Establishment) => void;
  onDelete?: (establishment: Establishment) => void;
  segmentKey?: keyof typeof ESTABLISHMENT_SEGMENTS;
}

export const EstablishmentCard = ({
  establishment,
  onUpdate,
  onDelete,
  segmentKey
}: EstablishmentCardProps) => {
  const navigate = useNavigate();
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [showHomePageModal, setShowHomePageModal] = useState(false);
  const [isVerified, setIsVerified] = useState(establishment.status === 'operationnel');
  const [isRejected, setIsRejected] = useState(false);
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
      window.dispatchEvent(new Event('admin:favorite-changed'));
      toast.success(exists ? "Retiré des favoris" : "Ajouté aux favoris");
    } catch {}
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operationnel':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partiel':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'maintenance':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'ferme':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'gouvernemental': 'bg-blue-100 text-blue-800',
      'universitaire': 'bg-purple-100 text-purple-800',
      'regional': 'bg-green-100 text-green-800',
      'departemental': 'bg-teal-100 text-teal-800',
      'prive': 'bg-pink-100 text-pink-800',
      'confessionnel': 'bg-amber-100 text-amber-800',
      'militaire': 'bg-red-100 text-red-800',
      'centre_sante': 'bg-indigo-100 text-indigo-800',
      'dispensaire': 'bg-gray-100 text-gray-800',
      'laboratoire': 'bg-cyan-100 text-cyan-800',
      'pharmacie': 'bg-lime-100 text-lime-800',
      'specialise': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleVerify = () => {
    setIsVerified(true);
    setIsRejected(false);
    toast.success(`${establishment.name} a été vérifié avec succès`);
    
    // Mettre à jour le statut
    const updatedEstablishment = {
      ...establishment,
      status: 'operationnel' as const
    };
    onUpdate(updatedEstablishment);
  };

  const handleReject = () => {
    setIsRejected(true);
    setIsVerified(false);
    toast.error(`${establishment.name} a été rejeté`);
    
    // Mettre à jour le statut
    const updatedEstablishment = {
      ...establishment,
      status: 'ferme' as const
    };
    onUpdate(updatedEstablishment);
  };

  const handleOpenPublicPage = async () => {
    // Si c'est une pharmacie, ouvrir directement la page publique pharmacie
    const nature = getPrimaryNature();
    if (nature?.key === 'pharmacy') {
      const slug = pharmacySlugFromName(establishment.name);
      window.open(`/pharmacies/${slug}`, '_blank');
      return;
    }
    // Sinon, récupérer l'URL personnalisée si elle existe
    const homePageInfo = await establishmentsService.getHomePage(establishment.id, establishment.name);
    const url = homePageInfo?.customUrl || establishmentsService.getEstablishmentHomeUrl(establishment);
    window.open(url, '_blank');
  };

  const occupancyClass = establishment.metrics.occupancyRate > 80 ? 'text-red-500' : 
                         establishment.metrics.occupancyRate > 60 ? 'text-orange-500' : 
                         'text-green-500';

  const occupancyTrend = establishment.metrics.occupancyRate > 70;

  const renderSegmentBadge = () => {
    if (!segmentKey) return null;
    const seg = ESTABLISHMENT_SEGMENTS[segmentKey];
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const cls = colorMap[seg.color] || 'bg-gray-100 text-gray-800 border-gray-200';
    return (
      <Badge variant="outline" className={`gap-1 ${cls}`}>
        <span>{seg.icon}</span>
        <span className="text-[11px] leading-none">{seg.label}</span>
      </Badge>
    );
  };

  const getPrimaryNature = () => {
    const lowerName = (establishment.name || '').toLowerCase();
    const services = (establishment.services || []).map(s => s.category);
    const equipmentCats = (establishment.equipment || []).map(e => e.category);

    // 1) Administrations
    if (segmentKey === 'governmental' || /minist|direction|cnamgs|cnss|dpml|onpg/.test(lowerName)) {
      return { key: 'admin', label: 'Administration', cls: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '🏛️' };
    }

    // 2) Services de Support – ordre de priorité spécifique
    if (
      establishment.category === 'pharmacie' || establishment.hasPharmacy || services.includes('pharmacie' as any) || /pharm|pharma/.test(lowerName)
    ) {
      return { key: 'pharmacy', label: 'Pharmacie', cls: 'bg-lime-100 text-lime-800 border-lime-200', emoji: '💊' };
    }
    if (
      establishment.category === 'laboratoire' || establishment.hasLaboratory || services.includes('laboratoire' as any) || /labo|laborat/.test(lowerName)
    ) {
      return { key: 'laboratory', label: 'Laboratoire', cls: 'bg-cyan-100 text-cyan-800 border-cyan-200', emoji: '🔬' };
    }
    if (
      services.includes('imagerie' as any) || equipmentCats.includes('imagerie' as any) || /(imager|radio|scanner|irm|échograph|echograph)/.test(lowerName)
    ) {
      return { key: 'imaging', label: 'Imagerie médicale', cls: 'bg-indigo-100 text-indigo-800 border-indigo-200', emoji: '🩻' };
    }
    if (/(banque\s*de\s*sang|transfusion|don\s*du\s*sang|ctr\s*transfusion|cts)/.test(lowerName)) {
      return { key: 'blood', label: 'Banque de sang', cls: 'bg-red-100 text-red-800 border-red-200', emoji: '🩸' };
    }

    // 3) Hôpital (CHU/CHR/CHD ou hôpital générique)
    if (segmentKey === 'tertiaryHospitals' || segmentKey === 'secondaryHospitals' || /\b(chu|chr|chd)\b|hosp|hopit|hôpital|hopital/.test(lowerName)) {
      return { key: 'hospital', label: 'Hôpital', cls: 'bg-purple-100 text-purple-800 border-purple-200', emoji: '🏥' };
    }

    // 4) Clinique (y compris polyclinique)
    if (segmentKey === 'privateClinics' || /polyclinique|clinique/.test(lowerName)) {
      return { key: 'clinic', label: 'Clinique', cls: 'bg-orange-100 text-orange-800 border-orange-200', emoji: '🏨' };
    }

    // 5) Soins primaires
    if (/\bcabinet\b/.test(lowerName)) {
      return { key: 'cabinet', label: 'Cabinet médical', cls: 'bg-teal-100 text-teal-800 border-teal-200', emoji: '🩺' };
    }
    if (establishment.category === 'centre_sante' || establishment.category === 'dispensaire' || /centre\s*(m[ée]dical|de\s*sant[é])|sant[é]\s*au\s*travail|\bcmst\b/.test(lowerName)) {
      return { key: 'center', label: 'Centre de santé', cls: 'bg-teal-100 text-teal-800 border-teal-200', emoji: '🏪' };
    }

    // 6) Par défaut: segment label
    if (segmentKey) {
      const seg = ESTABLISHMENT_SEGMENTS[segmentKey];
      const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
        purple: 'bg-purple-100 text-purple-800 border-purple-200',
        green: 'bg-green-100 text-green-800 border-green-200',
        teal: 'bg-teal-100 text-teal-800 border-teal-200',
        orange: 'bg-orange-100 text-orange-800 border-orange-200',
        pink: 'bg-pink-100 text-pink-800 border-pink-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200'
      };
      return { key: 'segment', label: seg.label, cls: colorMap[seg.color] || 'bg-gray-100 text-gray-800 border-gray-200', emoji: seg.icon as string } as any;
    }

    return null;
  };

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(establishment.category).replace('text', 'bg').replace('800', '100')}`}>
                <Building2 className={`h-5 w-5 ${getCategoryColor(establishment.category).replace('bg', 'text').replace('100', '600')}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{establishment.name}</h3>
                  {isVerified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Établissement vérifié</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {isRejected && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <ShieldOff className="h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Établissement rejeté</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-sm text-gray-600">{establishment.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                className={isFavorite ? 'text-yellow-400' : 'text-muted-foreground'}
                onClick={toggleFavorite}
              >
                <Star className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions rapides</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/admin/cartography?highlight=${establishment.id}`)}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Voir sur la carte
                  </DropdownMenuItem>
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(establishment)} className="text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Badges de statut et catégorie */}
          <div className="flex flex-wrap gap-2">
            {(getPrimaryNature()) && (() => { const n = getPrimaryNature()!; return (
              <Badge key={n.key} variant="outline" className={`gap-1 ${n.cls}`}>
                <span>{n.emoji}</span>
                <span className="text-[11px] leading-none">{n.label}</span>
              </Badge>
            ); })()}
            <Badge variant="outline" className="gap-1">
              {getStatusIcon(establishment.status)}
              {establishment.status}
            </Badge>
            {establishment.isEmergencyCenter && (
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3 w-3" />
                Urgences 24/7
              </Badge>
            )}
          </div>

          {/* Informations de localisation */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">{establishment.location.city}, {establishment.location.province}</p>
                <p className="text-gray-500">{establishment.location.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <p>{establishment.contact.phoneMain}</p>
            </div>
            {establishment.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-gray-600">{establishment.contact.email}</p>
              </div>
            )}
          </div>

          {/* Métriques clés */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Capacité</p>
                <p className="font-semibold">{establishment.metrics.totalBeds} lits</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Occupation</p>
                <div className="flex items-center gap-1">
                  <p className={`font-semibold ${occupancyClass}`}>
                    {establishment.metrics.occupancyRate}%
                  </p>
                  {occupancyTrend ? (
                    <TrendingUp className="h-3 w-3 text-red-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Personnel</p>
                <p className="font-semibold">{establishment.staff.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Satisfaction</p>
                <p className="font-semibold">{establishment.metrics.patientSatisfaction.toFixed(1)}/5</p>
              </div>
            </div>
          </div>

          {/* Services disponibles */}
          {(establishment.hasPharmacy || establishment.hasLaboratory || establishment.isReferralCenter) && (
            <div className="flex flex-wrap gap-2 pt-3 border-t">
              {establishment.hasPharmacy && (
                <Badge variant="outline" className="text-xs">
                  💊 Pharmacie
                </Badge>
              )}
              {establishment.hasLaboratory && (
                <Badge variant="outline" className="text-xs">
                  🔬 Laboratoire
                </Badge>
              )}
              {establishment.isReferralCenter && (
                <Badge variant="outline" className="text-xs">
                  🏥 Centre référence
                </Badge>
              )}
              {establishment.isTeachingHospital && (
                <Badge variant="outline" className="text-xs">
                  🎓 CHU
                </Badge>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t">
            {/* Page publique */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenPublicPage}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Page publique
            </Button>

            {/* Gérer l'établissement */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowManagementModal(true)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Gérer
            </Button>

            {/* Rejeter */}
            <Button
              variant={isRejected ? "destructive" : "outline"}
              size="sm"
              onClick={handleReject}
              disabled={isRejected}
              className="w-full"
            >
              <ShieldOff className="h-4 w-4 mr-2" />
              {isRejected ? "Rejeté" : "Rejeter"}
            </Button>

            {/* Vérifier */}
            <Button
              variant={isVerified ? "default" : "outline"}
              size="sm"
              onClick={handleVerify}
              disabled={isVerified}
              className="w-full"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              {isVerified ? "Vérifié" : "Vérifier"}
            </Button>
          </div>

          {/* Bouton configurer page d'accueil */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHomePageModal(true)}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Configurer page d'accueil
          </Button>
        </CardContent>
      </Card>

      {/* Modal de gestion */}
      {showManagementModal && (
        <EstablishmentManagementModal
          isOpen={showManagementModal}
          onClose={() => setShowManagementModal(false)}
          establishment={establishment}
          onSave={(updated) => {
            onUpdate(updated);
            setShowManagementModal(false);
          }}
        />
      )}

      {/* Modal page d'accueil */}
      {showHomePageModal && (
        <EstablishmentHomePageModal
          isOpen={showHomePageModal}
          onClose={() => setShowHomePageModal(false)}
          establishment={establishment}
          onSave={(id, settings) => {
            // Logique de sauvegarde
            toast.success("Page d'accueil configurée");
            setShowHomePageModal(false);
          }}
        />
      )}
    </>
  );
};
