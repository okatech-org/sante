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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 bg-background border-2 shadow-2xl z-[100] data-[state=open]:slide-in-from-bottom-full">
        {/* En-tête collant */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b p-4 sm:p-5">
          <DialogHeader className="space-y-2.5">
            <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight pr-8">
              {provider.nom}
            </DialogTitle>
            
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="text-xs font-medium">
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
              {provider.conventionnement.cnss && (
                <Badge className="bg-cyan-600 text-xs">CNSS</Badge>
              )}
              {provider.distance && userLocation && (
                <Badge variant="outline" className="text-xs font-semibold">
                  <Navigation className="h-3 w-3 mr-1" />
                  {formatDistance(provider.distance)}
                </Badge>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)]">
          <div className="p-4 sm:p-5 space-y-4">
            {/* Actions RDV - Pour établissements médicaux */}
            {(provider.type === 'hopital' || provider.type === 'clinique' || 
              provider.type === 'cabinet_medical' || provider.type === 'cabinet_dentaire') && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Prendre rendez-vous
                </h3>
                {hasAccount ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => navigate(`/appointments/new?provider=${provider.id}&type=physical`)}
                      className="h-11"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Physique</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/appointments/new?provider=${provider.id}&type=video`)}
                      className="h-11"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Visio</span>
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Non inscrit sur la plateforme</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions Pharmacie - Pour pharmacies */}
            {provider.type === 'pharmacie' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Services disponibles
                </h3>
                {hasAccount ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button
                      onClick={() => navigate(`/prescriptions?pharmacy=${provider.id}`)}
                      className="h-auto py-3 px-3 flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                    >
                      <FileText className="h-5 w-5 mb-1.5" />
                      <span className="text-xs font-medium text-center leading-tight">Envoyer<br/>ordonnance</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/pharmacy/${provider.id}/advice`)}
                      className="h-auto py-3 px-3 flex-col items-center justify-center"
                    >
                      <Phone className="h-5 w-5 mb-1.5" />
                      <span className="text-xs font-medium text-center leading-tight">Conseil<br/>pharmacie</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/pharmacy/${provider.id}/medications`)}
                      className="h-auto py-3 px-3 flex-col items-center justify-center"
                    >
                      <ShoppingCart className="h-5 w-5 mb-1.5" />
                      <span className="text-xs font-medium text-center leading-tight">Commander<br/>médicaments</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/pharmacy/${provider.id}/parapharmacy`)}
                      className="h-auto py-3 px-3 flex-col items-center justify-center"
                    >
                      <Package className="h-5 w-5 mb-1.5" />
                      <span className="text-xs font-medium text-center leading-tight">Parapharmacie</span>
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Non inscrit sur la plateforme</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions Laboratoire - Pour laboratoires */}
            {(provider.type === 'laboratoire' || provider.type === 'imagerie') && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Réserver un examen
                </h3>
                {hasAccount ? (
                  <Button
                    onClick={() => navigate(`/appointments/new?provider=${provider.id}&type=exam`)}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Prendre rendez-vous</span>
                  </Button>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Non inscrit sur la plateforme</p>
                  </div>
                )}
              </div>
            )}

            {/* Contact & Localisation - Design amélioré */}
            <div className="space-y-3">
              {/* Localisation */}
              <div className="bg-muted/40 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold mb-1">Localisation</h4>
                    <p className="text-sm leading-relaxed">{provider.adresse_descriptive}</p>
                    <p className="text-xs text-muted-foreground mt-1">{provider.ville}, {provider.province}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-muted/40 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="text-sm font-semibold">Contact</h4>
                    {provider.telephones.slice(0, 2).map((tel, index) => (
                      <a
                        key={index}
                        href={`tel:${tel}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {tel}
                      </a>
                    ))}
                    {provider.horaires && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        <Clock className="h-3.5 w-3.5" />
                        {provider.horaires}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Conventionnement */}
            {provider.services.length > 0 && (
              <div className="bg-muted/40 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Services & Conventionnement
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.services.slice(0, 6).map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2.5 py-1">
                      {service}
                    </Badge>
                  ))}
                  {provider.services.length > 6 && (
                    <Badge variant="secondary" className="text-xs px-2.5 py-1">
                      +{provider.services.length - 6} autres
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm pt-2 border-t">
                  <span className="font-semibold">💳 Conventionnement:</span>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      {provider.conventionnement.cnamgs ? "✅" : "❌"}
                      <span className="font-medium">CNAMGS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {provider.conventionnement.cnss ? "✅" : "❌"}
                      <span className="font-medium">CNSS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Spécialités */}
            {provider.specialites && provider.specialites.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Spécialités
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.specialites.map((spec, index) => (
                    <Badge key={index} className="text-xs px-2.5 py-1 bg-primary/90">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Équipements */}
            {provider.equipements_specialises && provider.equipements_specialises.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Équipements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.equipements_specialises.map((equip, index) => (
                    <Badge key={index} className="text-xs px-2.5 py-1 bg-purple-600">
                      ⚡ {equip}
                    </Badge>
                  ))}
                </div>
              </div>
            )}


            {/* Notes */}
            {provider.notes && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">{provider.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions collantes en bas */}
        <div className="sticky bottom-0 z-10 bg-background border-t p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => handleCall(provider.telephones[0])}
              className="h-12 gap-2"
              size="lg"
            >
              <Phone className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Appeler</span>
            </Button>
            {provider.coordonnees && (
              <Button
                variant="secondary"
                onClick={handleDirections}
                className="h-12 gap-2"
                size="lg"
              >
                <Navigation className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">Itinéraire</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="h-12 gap-2"
              size="lg"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Partager</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
