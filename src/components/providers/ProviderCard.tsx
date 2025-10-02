import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Phone, Calendar, Info, Navigation, Clock, Shield, Video } from "lucide-react";
import { Provider } from "@/lib/providers-data";

interface ProviderCardProps {
  provider: Provider;
  onViewProfile: (provider: Provider) => void;
  onCall?: (phone: string) => void;
  onBookAppointment?: (providerId: string) => void;
  onGetDirections?: (provider: Provider) => void;
}

export const ProviderCard = ({
  provider,
  onViewProfile,
  onCall,
  onBookAppointment,
  onGetDirections
}: ProviderCardProps) => {
  const renderDoctorCard = () => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={provider.photo} alt={provider.name} />
            <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{provider.name}</h3>
            <p className="text-muted-foreground">{provider.specialtyLabel}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{provider.rating}/5</span>
              <span className="text-muted-foreground text-sm">({provider.reviewCount} avis)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p>{provider.address}</p>
              <p className="text-muted-foreground">{provider.city} - {provider.distance} km</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {provider.cnamgsConventioned && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              CNAMGS
            </Badge>
          )}
          {provider.availableToday && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Disponible aujourd'hui
            </Badge>
          )}
          {provider.telemedicine && (
            <Badge variant="secondary" className="gap-1">
              <Video className="h-3 w-3" />
              Téléconsultation
            </Badge>
          )}
        </div>

        {provider.consultationPrice && (
          <div className="bg-accent/50 rounded-lg p-3 mb-4 text-sm">
            <p className="font-medium">💰 Consultation: {provider.consultationPrice?.toLocaleString()} FCFA</p>
            {provider.cnamgsPrice && (
              <p className="text-muted-foreground">Avec CNAMGS 80%: ~{provider.cnamgsPrice?.toLocaleString()} FCFA</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onCall?.(provider.phone)}>
            <Phone className="h-4 w-4 mr-1" />
            Appeler
          </Button>
          {provider.onlineBooking && (
            <Button size="sm" onClick={() => onBookAppointment?.(provider.id)}>
              <Calendar className="h-4 w-4 mr-1" />
              Prendre RDV
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onViewProfile(provider)}>
            <Info className="h-4 w-4 mr-1" />
            Voir profil
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPharmacyCard = () => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="mb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                💊 {provider.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{provider.rating}/5</span>
                <span className="text-muted-foreground text-sm">({provider.reviewCount} avis)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p>{provider.address}</p>
              <p className="text-muted-foreground">{provider.distance} m de vous</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {provider.isOpen24h && (
            <Badge className="gap-1 bg-green-600">
              <Clock className="h-3 w-3" />
              OUVERT 24h/24
            </Badge>
          )}
          {provider.cnamgsConventioned && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              CNAMGS
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onCall?.(provider.phone)}>
            <Phone className="h-4 w-4 mr-1" />
            {provider.phone}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onGetDirections?.(provider)}>
            <Navigation className="h-4 w-4 mr-1" />
            Itinéraire
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onViewProfile(provider)}>
            <Info className="h-4 w-4 mr-1" />
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderHospitalCard = () => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            🏥 {provider.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{provider.rating}/5</span>
            <span className="text-muted-foreground text-sm">({provider.reviewCount} avis)</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p>{provider.address}</p>
              <p className="text-muted-foreground">{provider.distance} km de vous</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {provider.hasImaging && (
            <Badge variant="secondary">🩻 IRM & Scanner</Badge>
          )}
          {provider.hasLaboratory && (
            <Badge variant="secondary">🧪 Laboratoire</Badge>
          )}
          {provider.hasEmergency && (
            <Badge className="bg-red-600">🚑 Urgences 24/7</Badge>
          )}
          {provider.cnamgsConventioned && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              CNAMGS
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onCall?.(provider.phone)}>
            <Phone className="h-4 w-4 mr-1" />
            {provider.phone}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onGetDirections?.(provider)}>
            <Navigation className="h-4 w-4 mr-1" />
            Itinéraire
          </Button>
          {provider.onlineBooking && (
            <Button size="sm" onClick={() => onBookAppointment?.(provider.id)}>
              <Calendar className="h-4 w-4 mr-1" />
              Prendre RDV
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onViewProfile(provider)}>
            <Info className="h-4 w-4 mr-1" />
            Plus d'infos
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderLaboratoryCard = () => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            🧪 {provider.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{provider.rating}/5</span>
            <span className="text-muted-foreground text-sm">({provider.reviewCount} avis)</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p>{provider.address}</p>
              <p className="text-muted-foreground">{provider.distance} km de vous</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {provider.cnamgsConventioned && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              CNAMGS
            </Badge>
          )}
          {provider.onlineBooking && (
            <Badge variant="secondary">RDV en ligne</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onCall?.(provider.phone)}>
            <Phone className="h-4 w-4 mr-1" />
            Appeler
          </Button>
          <Button size="sm" variant="outline" onClick={() => onGetDirections?.(provider)}>
            <Navigation className="h-4 w-4 mr-1" />
            Itinéraire
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onViewProfile(provider)}>
            <Info className="h-4 w-4 mr-1" />
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  switch (provider.type) {
    case 'medecin':
      return renderDoctorCard();
    case 'pharmacie':
      return renderPharmacyCard();
    case 'hopital':
      return renderHospitalCard();
    case 'laboratoire':
      return renderLaboratoryCard();
    default:
      return renderDoctorCard();
  }
};
