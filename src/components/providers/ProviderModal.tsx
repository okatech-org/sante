import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, MapPin, Phone, Mail, Clock, DollarSign, Shield, Calendar, Navigation, Check, X } from "lucide-react";
import { Provider } from "@/lib/providers-data";

interface ProviderModalProps {
  provider: Provider | null;
  open: boolean;
  onClose: () => void;
  onCall?: (phone: string) => void;
  onGetDirections?: (provider: Provider) => void;
  onBookAppointment?: (providerId: string) => void;
}

export const ProviderModal = ({
  provider,
  open,
  onClose,
  onCall,
  onGetDirections,
  onBookAppointment
}: ProviderModalProps) => {
  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Profil du prestataire</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Photo & Infos principales */}
            <div className="flex gap-4 items-start">
              {provider.type === 'medecin' && (
                <Avatar className="h-24 w-24">
                  <AvatarImage src={provider.photo} alt={provider.name} />
                  <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{provider.name}</h3>
                {provider.specialtyLabel && (
                  <p className="text-lg text-muted-foreground">{provider.specialtyLabel}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{provider.rating}/5</span>
                  </div>
                  <span className="text-muted-foreground">({provider.reviewCount} avis)</span>
                </div>
                {provider.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{provider.description}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Coordonnées */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Coordonnées</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{provider.address}</p>
                    <p className="text-sm text-muted-foreground">{provider.city}, {provider.province}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{provider.phone}</p>
                </div>
                {provider.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{provider.email}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Horaires */}
            {provider.schedule && (
              <>
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horaires
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(provider.schedule).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium">{day}</span>
                        <span className="text-muted-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                  {provider.isOpenNow && (
                    <Badge className="mt-3 bg-green-600">Ouvert maintenant</Badge>
                  )}
                </div>
                <Separator />
              </>
            )}

            {/* Tarifs & Assurances */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tarifs & Assurances
              </h4>
              <div className="space-y-3">
                {provider.consultationPrice && (
                  <div className="bg-accent/50 rounded-lg p-3">
                    <p className="font-medium">Consultation: {provider.consultationPrice.toLocaleString()} FCFA</p>
                    {provider.cnamgsPrice && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Tarif conventionné CNAMGS: {provider.cnamgsPrice.toLocaleString()} FCFA
                      </p>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {provider.cnamgsConventioned ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <span>Conventionné CNAMGS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.acceptsCNSS ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <span>Accepte CNSS</span>
                  </div>
                </div>

                {provider.mutuelles && provider.mutuelles.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Mutuelles acceptées:</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.mutuelles.map((mutuelle) => (
                        <Badge key={mutuelle} variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          {mutuelle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {provider.paymentMethods && provider.paymentMethods.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Modes de paiement:</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.paymentMethods.map((method) => (
                        <Badge key={method} variant="secondary">{method}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Équipements & Spécialités */}
            {provider.equipment && provider.equipment.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-lg mb-3">
                    {provider.type === 'medecin' ? 'Équipements disponibles' : 'Services disponibles'}
                  </h4>
                  <ul className="space-y-1">
                    {provider.equipment.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Services en ligne */}
            {(provider.telemedicine || provider.onlineBooking || provider.onlinePayment) && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-lg mb-3">Services en ligne</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.telemedicine && (
                      <Badge variant="secondary">Téléconsultation disponible</Badge>
                    )}
                    {provider.onlineBooking && (
                      <Badge variant="secondary">Prise de RDV en ligne</Badge>
                    )}
                    {provider.onlinePayment && (
                      <Badge variant="secondary">Paiement en ligne</Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Actions sticky */}
        <div className="sticky bottom-0 flex flex-wrap gap-2 pt-4 border-t bg-background">
          <Button variant="outline" onClick={() => onCall?.(provider.phone)}>
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </Button>
          <Button variant="outline" onClick={() => onGetDirections?.(provider)}>
            <Navigation className="h-4 w-4 mr-2" />
            Itinéraire
          </Button>
          {provider.onlineBooking && (
            <Button onClick={() => onBookAppointment?.(provider.id)}>
              <Calendar className="h-4 w-4 mr-2" />
              Prendre RDV
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
