import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartographyProvider, Coordonnees } from "@/types/cartography";
import { Phone, Navigation, Share2, Clock, MapPin, Mail, AlertCircle, Video, Calendar } from "lucide-react";
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-2xl">{provider.nom}</DialogTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">
                {TYPE_LABELS[provider.type]}
              </Badge>
              {provider.ouvert_24_7 && (
                <Badge className="bg-green-600">Ouvert 24/7</Badge>
              )}
              {provider.conventionnement.cnamgs && (
                <Badge className="bg-blue-600">CNAMGS</Badge>
              )}
              {provider.secteur && (
                <Badge variant="outline">{SECTEUR_LABELS[provider.secteur]}</Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Localisation */}
          <section>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localisation
            </h3>
            <div className="space-y-1 text-sm">
              <p>{provider.adresse_descriptive}</p>
              <p className="text-muted-foreground">{provider.ville}</p>
              {provider.distance && userLocation && (
                <p className="text-primary font-semibold">
                  📏 {formatDistance(provider.distance)} de vous
                </p>
              )}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </h3>
            <div className="space-y-2">
              {provider.telephones.map((tel, index) => (
                <div key={index} className="flex items-center gap-2">
                  <a
                    href={`tel:${tel}`}
                    className="text-primary hover:underline flex-1"
                  >
                    {tel}
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyPhone(tel)}
                  >
                    Copier
                  </Button>
                </div>
              ))}
              {provider.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${provider.email}`}
                    className="text-primary hover:underline"
                  >
                    {provider.email}
                  </a>
                </div>
              )}
              {provider.horaires && (
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{provider.horaires}</p>
                </div>
              )}
            </div>
          </section>

          {/* Services */}
          <section>
            <h3 className="font-semibold mb-2">🏥 Services Offerts</h3>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, index) => (
                <Badge key={index} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
          </section>

          {/* Spécialités */}
          {provider.specialites && provider.specialites.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">👨‍⚕️ Spécialités Médicales</h3>
              <div className="flex flex-wrap gap-2">
                {provider.specialites.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Équipements */}
          {provider.equipements_specialises && provider.equipements_specialises.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">🔬 Équipements Spécialisés</h3>
              <div className="flex flex-wrap gap-2">
                {provider.equipements_specialises.map((equip, index) => (
                  <Badge key={index} className="bg-purple-600">
                    ⚡ {equip}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Conventionnement */}
          <section>
            <h3 className="font-semibold mb-2">💳 Assurances & Conventionnement</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                {provider.conventionnement.cnamgs ? (
                  <span className="text-green-600">✅</span>
                ) : (
                  <span className="text-red-600">❌</span>
                )}
                CNAMGS
              </li>
              <li className="flex items-center gap-2">
                {provider.conventionnement.cnss ? (
                  <span className="text-green-600">✅</span>
                ) : (
                  <span className="text-red-600">❌</span>
                )}
                CNSS
              </li>
              {provider.conventionnement.mutuelles && provider.conventionnement.mutuelles.length > 0 && (
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Mutuelles: {provider.conventionnement.mutuelles.join(', ')}
                </li>
              )}
            </ul>
          </section>

          {/* Notes */}
          {provider.notes && (
            <section>
              <div className="bg-accent p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{provider.notes}</p>
                </div>
              </div>
            </section>
          )}

          {/* Actions selon le type d'établissement */}
          {(provider.type === 'hopital' || provider.type === 'clinique' || 
            provider.type === 'cabinet_medical' || provider.type === 'cabinet_dentaire') && (
            <section>
              <h3 className="font-semibold mb-3">📅 Prendre rendez-vous</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => hasAccount ? navigate(`/appointments/new?provider=${provider.id}&type=physical`) : null}
                  disabled={!hasAccount}
                  className={cn(
                    "flex-1",
                    !hasAccount && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Consultation physique
                </Button>
                <Button
                  onClick={() => hasAccount ? navigate(`/appointments/new?provider=${provider.id}&type=video`) : null}
                  disabled={!hasAccount}
                  variant="secondary"
                  className={cn(
                    "flex-1",
                    !hasAccount && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Visio-consultation
                </Button>
              </div>
              {!hasAccount && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Cet établissement n'est pas encore inscrit sur la plateforme
                </p>
              )}
            </section>
          )}

          {/* Actions générales */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              className="flex-1"
              onClick={() => handleCall(provider.telephones[0])}
            >
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
            {provider.coordonnees && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleDirections}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Itinéraire
              </Button>
            )}
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
