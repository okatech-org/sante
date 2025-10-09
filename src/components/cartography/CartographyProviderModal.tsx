import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartographyProvider, Coordonnees } from "@/types/cartography";
import { Phone, Navigation, Share2, Clock, MapPin, Mail, AlertCircle, Video, Calendar, FileText, ShoppingCart, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDistance } from "@/utils/distance";
import { toast } from "sonner";

interface CartographyProviderModalProps {
  provider: CartographyProvider | null;
  userLocation: Coordonnees | null;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  hopital: "Hôpital",
  clinique: "Clinique",
  cabinet_medical: "Cabinet Médical",
  cabinet_dentaire: "Cabinet Dentaire",
  pharmacie: "Pharmacie",
  laboratoire: "Laboratoire",
  imagerie: "Centre d'Imagerie"
};

const SECTEUR_LABELS: Record<string, string> = {
  public: "Public",
  prive: "Privé",
  parapublic: "Parapublic",
  confessionnel: "Confessionnel",
  ong: "ONG",
  militaire: "Militaire"
};

export default function CartographyProviderModal({
  provider,
  userLocation,
  onClose
}: CartographyProviderModalProps) {
  const navigate = useNavigate();
  
  if (!provider) return null;
  
  const hasAccount = provider.has_account ?? false;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = () => {
    if (!provider.coordonnees) {
      toast.error("Coordonnées GPS non disponibles");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${provider.coordonnees.lat},${provider.coordonnees.lng}&destination_place_id=${encodeURIComponent(provider.nom)}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const shareText = `${provider.nom}\n${provider.ville}, ${provider.adresse_descriptive}\nTél: ${provider.telephones[0]}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: provider.nom,
          text: shareText,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Informations copiées dans le presse-papiers");
      } catch {
        toast.error("Impossible de copier");
      }
    }
  };

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Numéro copié");
    } catch {
      toast.error("Impossible de copier");
    }
  };

  return (
    <Dialog open={!!provider} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 gap-0 bg-background/95 backdrop-blur-xl border-2 shadow-2xl">
        {/* Header compact avec gradient */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-lg sm:text-xl font-bold leading-tight pr-8">
                {provider.nom}
              </DialogTitle>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {TYPE_LABELS[provider.type]}
              </Badge>
              {hasAccount && (
                <Badge className="bg-green-600 text-xs">✓ Inscrit</Badge>
              )}
              {provider.ouvert_24_7 && (
                <Badge className="bg-purple-600 text-xs">24/7</Badge>
              )}
              {provider.conventionnement.cnamgs && (
                <Badge className="bg-blue-600 text-xs">CNAMGS</Badge>
              )}
            </div>

            {/* Distance badge */}
            {provider.distance && userLocation && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary w-fit">
                <Navigation className="h-3 w-3" />
                {formatDistance(provider.distance)}
              </div>
            )}
          </DialogHeader>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh]">
          <div className="p-4 sm:p-5 space-y-4">
            {/* Actions RDV - Pour établissements médicaux */}
            {(provider.type === 'hopital' || provider.type === 'clinique' || 
              provider.type === 'cabinet_medical' || provider.type === 'cabinet_dentaire') && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-3 sm:p-4 border border-primary/20">
                <h3 className="text-sm font-semibold mb-2.5 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Prendre rendez-vous
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => hasAccount ? navigate(`/appointments/new?provider=${provider.id}&type=physical`) : null}
                    disabled={!hasAccount}
                    className={cn(!hasAccount && "opacity-50")}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Physique</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => hasAccount ? navigate(`/appointments/new?provider=${provider.id}&type=video`) : null}
                    disabled={!hasAccount}
                    className={cn(!hasAccount && "opacity-50")}
                  >
                    <Video className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Visio</span>
                  </Button>
                </div>
                {!hasAccount && (
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Non inscrit sur la plateforme
                  </p>
                )}
              </div>
            )}

            {/* Actions Pharmacie - Pour pharmacies */}
            {provider.type === 'pharmacie' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-3 sm:p-4 border border-green-200 dark:border-green-800">
                <h3 className="text-sm font-semibold mb-2.5 flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Services disponibles
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => hasAccount ? navigate(`/prescriptions?pharmacy=${provider.id}`) : null}
                    disabled={!hasAccount}
                    className={cn(
                      "justify-start bg-green-600 hover:bg-green-700 h-auto py-2 px-2",
                      !hasAccount && "opacity-50"
                    )}
                  >
                    <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="text-[10px] leading-tight">Envoyer ordonnance</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => hasAccount ? navigate(`/pharmacy/${provider.id}/advice`) : null}
                    disabled={!hasAccount}
                    className={cn(
                      "justify-start h-auto py-2 px-2",
                      !hasAccount && "opacity-50"
                    )}
                  >
                    <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="text-[10px] leading-tight">Conseil pharmacie</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => hasAccount ? navigate(`/pharmacy/${provider.id}/medications`) : null}
                    disabled={!hasAccount}
                    className={cn(
                      "justify-start h-auto py-2 px-2",
                      !hasAccount && "opacity-50"
                    )}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="text-[10px] leading-tight">Commander médicaments</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => hasAccount ? navigate(`/pharmacy/${provider.id}/parapharmacy`) : null}
                    disabled={!hasAccount}
                    className={cn(
                      "justify-start h-auto py-2 px-2",
                      !hasAccount && "opacity-50"
                    )}
                  >
                    <Package className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="text-[10px] leading-tight">Parapharmacie</span>
                  </Button>
                </div>
                {!hasAccount && (
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Non inscrit sur la plateforme
                  </p>
                )}
              </div>
            )}

            {/* Actions Laboratoire - Pour laboratoires */}
            {(provider.type === 'laboratoire' || provider.type === 'imagerie') && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="text-sm font-semibold mb-2.5 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Réserver un examen
                </h3>
                <Button
                  size="sm"
                  onClick={() => hasAccount ? navigate(`/appointments/new?provider=${provider.id}&type=exam`) : null}
                  disabled={!hasAccount}
                  className={cn(
                    "w-full bg-purple-600 hover:bg-purple-700",
                    !hasAccount && "opacity-50"
                  )}
                >
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  <span className="text-xs">Prendre rendez-vous</span>
                </Button>
                {!hasAccount && (
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Non inscrit sur la plateforme
                  </p>
                )}
              </div>
            )}

            {/* Contact & Localisation - Grid compact */}
            <div className="grid grid-cols-2 gap-3">
              {/* Localisation */}
              <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Localisation
                </div>
                <p className="text-xs leading-relaxed">{provider.adresse_descriptive}</p>
                <p className="text-xs text-muted-foreground">{provider.ville}, {provider.province}</p>
              </div>

              {/* Contact */}
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Contact
                </div>
                {provider.telephones.slice(0, 2).map((tel, index) => (
                  <a
                    key={index}
                    href={`tel:${tel}`}
                    className="flex items-center gap-2 text-xs text-primary hover:underline"
                  >
                    <Phone className="h-3 w-3" />
                    {tel}
                  </a>
                ))}
                {provider.horaires && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <Clock className="h-3 w-3" />
                    {provider.horaires}
                  </div>
                )}
              </div>
            </div>

            {/* Services & Conventionnement - Bloc compact */}
            {provider.services.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Services & Conventionnement
                  </h3>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                    {provider.services.slice(0, 4).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-[10px] px-2 py-0.5 whitespace-nowrap">
                        {service}
                      </Badge>
                    ))}
                    {provider.services.length > 4 && (
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 whitespace-nowrap">
                        +{provider.services.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs pt-1 border-t border-border/50">
                  <span className="font-semibold">💳</span>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      {provider.conventionnement.cnamgs ? "✅" : "❌"}
                      <span>CNAMGS</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {provider.conventionnement.cnss ? "✅" : "❌"}
                      <span>CNSS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Spécialités */}
            {provider.specialites && provider.specialites.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Spécialités
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {provider.specialites.map((spec, index) => (
                    <Badge key={index} className="text-[10px] px-2 py-0.5 bg-primary/80">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Équipements */}
            {provider.equipements_specialises && provider.equipements_specialises.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Équipements
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {provider.equipements_specialises.map((equip, index) => (
                    <Badge key={index} className="text-[10px] px-2 py-0.5 bg-purple-600">
                      ⚡ {equip}
                    </Badge>
                  ))}
                </div>
              </div>
            )}


            {/* Notes */}
            {provider.notes && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                  <p className="text-[10px] leading-tight text-amber-900 dark:text-amber-100">{provider.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom actions */}
        <div className="border-t bg-background/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              onClick={() => handleCall(provider.telephones[0])}
              className="gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Appeler</span>
            </Button>
            {provider.coordonnees && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDirections}
                className="gap-1.5"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Itinéraire</span>
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleShare}
              className="gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Partager</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
