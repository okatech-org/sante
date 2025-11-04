import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePharmacy } from '@/hooks/usePharmacy';
import { establishmentsService } from '@/services/establishments.service';
import type { Establishment } from '@/types/establishment';
import { nameFromPharmacySlug } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Navigation,
  User,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import servicesHero from '@/assets/services-hero.jpg';
import doctorConsultation from '@/assets/doctor-consultation.jpg';
import sogaraReception from '@/assets/sogara-reception.jpg';
import sogaraEquipment from '@/assets/sogara-equipment.jpg';

export default function PharmacyPublicPage() {
  const { id: idOrSlug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Redirection 301 (client) des anciens slugs avec underscores vers tirets
  useEffect(() => {
    if (idOrSlug && idOrSlug.includes('_')) {
      const newSlug = idOrSlug.replace(/_/g, '-');
      if (newSlug !== idOrSlug) {
        navigate(`/pharmacies/${newSlug}`, { replace: true });
      }
    }
  }, [idOrSlug, navigate]);
  const isUuid = !!idOrSlug && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(idOrSlug);
  const { data: pharmacyById, isLoading: isLoadingById, isError: isErrorById } = usePharmacy(isUuid ? idOrSlug : undefined);
  const { data: pharmacyBySlug, isLoading: isLoadingBySlug, isError: isErrorBySlug } = useQuery({
    queryKey: ['pharmacyBySlug', idOrSlug],
    enabled: !!idOrSlug && !isUuid,
    queryFn: async () => {
      // Rechercher par nom commercial dérivé du slug (sans dépendre de la colonne slug)
      const base = nameFromPharmacySlug(idOrSlug!).toLowerCase();
      const tokens = base.split(/[^a-z0-9]+/).filter(Boolean);
      const pattern = `%${tokens.join('%')}%`;
      const { data, error } = await supabase
        .from('pharmacies')
        .select(`*, pharmacien_titulaire:professionnels_sante_pharmacie!pharmacien_titulaire_id(id,nom_complet,numero_inscription_onpg,photo_url,type_professionnel)`) 
        .ilike('nom_commercial', pattern)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    }
  });
  const pharmacy = pharmacyById || pharmacyBySlug;
  const isLoading = Boolean(isLoadingById || isLoadingBySlug);
  const isError = Boolean(isErrorById || isErrorBySlug);
  const [fallbackEst, setFallbackEst] = useState<Establishment | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Vue unifiée: utiliser la pharmacie si dispo, sinon adapter l'établissement
  const view = pharmacy || {
    nom_commercial: fallbackEst?.name,
    quartier: fallbackEst?.location.address,
    ville: fallbackEst?.location.city,
    province: fallbackEst?.location.province,
    telephone_principal: fallbackEst?.contact.phoneMain,
    email: fallbackEst?.contact.email,
    latitude: fallbackEst?.location.coordinates?.latitude,
    longitude: fallbackEst?.location.coordinates?.longitude,
    statut_verification: fallbackEst?.status === 'operationnel' ? 'verifie' : 'non_verifie',
    ouvert_24_7: fallbackEst?.isEmergencyCenter,
    conventionnement_cnamgs: fallbackEst?.insuranceAccepted?.includes('CNAMGS') || false,
    horaires: undefined,
    modes_paiement: [] as string[],
    services_disponibles: [] as string[],
    delai_preparation_moyen_minutes: undefined,
    pharmacien_titulaire: null,
    accepte_commandes_en_ligne: false,
  } as any;

  const fullAddress = [view.quartier, view.ville, view.province]
    .filter(Boolean)
    .join(', ');

  const mapsHref = view.latitude && view.longitude
    ? `https://www.google.com/maps?q=${view.latitude},${view.longitude}`
    : `https://www.google.com/maps/search/${encodeURIComponent(`${view.nom_commercial} ${fullAddress}`)}`;

  // Initialize mini map if coordinates present
  useEffect(() => {
    if (!view?.latitude || !view?.longitude) return;
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [view.latitude, view.longitude],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Use circle marker to avoid icon asset issues
    L.circleMarker([view.latitude, view.longitude], {
      radius: 8,
      color: '#0ea5e9',
      weight: 2,
      fillColor: '#38bdf8',
      fillOpacity: 0.8,
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [view?.latitude, view?.longitude]);

  // Charger un fallback depuis les établissements si la pharmacie n'existe pas
  useEffect(() => {
    const loadFallback = async () => {
      if (pharmacy) return;
      if (!idOrSlug) return;
      // 1) Si URL contient un UUID, tenter par ID d'établissement
      if (isUuid) {
        const est = await establishmentsService.getEstablishmentById(idOrSlug);
        if (est && (est.category === 'pharmacie' || /pharm|pharma/i.test(est.name))) {
          setFallbackEst(est);
          return;
        }
      }
      // 2) Sinon, recherche par nom dérivé du slug dans les établissements
      const base = nameFromPharmacySlug(idOrSlug);
      const candidates = await establishmentsService.searchEstablishments(base);
      const match = candidates.find((e) => e.category === 'pharmacie') || candidates.find((e) => /pharm|pharma/i.test(e.name));
      if (match) setFallbackEst(match);
    };
    loadFallback();
  }, [pharmacy, isUuid, idOrSlug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError || (!pharmacy && !fallbackEst)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Pharmacie introuvable</CardTitle>
            <CardDescription>Cette pharmacie n'existe pas ou n'est pas encore publiée.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link to="/pharmacies">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux pharmacies
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero */}
      <section className="pt-16 pb-6 md:pt-20 md:pb-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {view.nom_commercial}
                </h1>
                {view.statut_verification === 'verifie' && (
                  <Badge className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Vérifiée
                  </Badge>
                )}
                {view.ouvert_24_7 && (
                  <Badge variant="outline">24/7</Badge>
                )}
                {view.conventionnement_cnamgs && (
                  <Badge variant="outline">CNAMGS</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {fullAddress || 'Adresse non renseignée'}
                </span>
                {view.telephone_principal && (
                  <a className="flex items-center gap-1 hover:text-foreground" href={`tel:${view.telephone_principal}`}>
                    <Phone className="h-4 w-4" />
                    {view.telephone_principal}
                  </a>
                )}
                {view.email && (
                  <a className="flex items-center gap-1 hover:text-foreground" href={`mailto:${view.email}`}>
                    <Mail className="h-4 w-4" />
                    {view.email}
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button asChild variant="default">
                  <a href={mapsHref} target="_blank" rel="noreferrer">
                    <Navigation className="h-4 w-4 mr-2" />
                    Itinéraire
                  </a>
                </Button>
                {view.telephone_principal && (
                  <Button asChild variant="outline">
                    <a href={`tel:${view.telephone_principal}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border shadow-sm">
              <img src={servicesHero} alt="Pharmacie" className="w-full h-[240px] md:h-[300px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
          {/* Infos principales */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
                <CardDescription>Détails généraux de la pharmacie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{fullAddress || 'Non renseigné'}</span>
                </div>
                {view.horaires && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Horaires: {view.horaires}</span>
                  </div>
                )}
                {view.modes_paiement && view.modes_paiement.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-2">Modes de paiement acceptés</p>
                    <div className="flex flex-wrap gap-2">
                      {view.modes_paiement.map((m: string) => (
                        <Badge key={m} variant="outline">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {view.services_disponibles && view.services_disponibles.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-2">Services disponibles</p>
                    <div className="flex flex-wrap gap-2">
                      {view.services_disponibles.map((s: string) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {view.accepte_commandes_en_ligne && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle>Commandes en ligne</CardTitle>
                  <CardDescription>Cette pharmacie accepte les réservations/commandes en ligne.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button disabled variant="default">Bientôt disponible</Button>
                </CardContent>
              </Card>
            )}

            {/* Stats section */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Préparation</CardTitle>
                  <CardDescription>Temps moyen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {view.delai_preparation_moyen_minutes ? `${view.delai_preparation_moyen_minutes} min` : '—'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Modes de paiement</CardTitle>
                  <CardDescription>Acceptés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Array.isArray(view.modes_paiement) ? view.modes_paiement.length : 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Services</CardTitle>
                  <CardDescription>Disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Array.isArray(view.services_disponibles) ? view.services_disponibles.length : 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services grid */}
            {view.services_disponibles && view.services_disponibles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nos Services</CardTitle>
                  <CardDescription>Prestations proposées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {view.services_disponibles.map((s: string) => (
                      <div key={s} className="p-4 rounded-lg border bg-card/50">
                        {s}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Équipe */}
            <Card>
              <CardHeader>
                <CardTitle>Équipe</CardTitle>
                <CardDescription>Pharmacien titulaire</CardDescription>
              </CardHeader>
              <CardContent>
                {view.pharmacien_titulaire?.nom_complet ? (
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {view.pharmacien_titulaire.nom_complet.charAt(0)}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{view.pharmacien_titulaire.nom_complet}</div>
                      <div className="text-muted-foreground">Pharmacien titulaire</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Non renseigné</span>
                )}
              </CardContent>
            </Card>

            {/* Galerie */}
            <Card>
              <CardHeader>
                <CardTitle>Galerie</CardTitle>
                <CardDescription>Photos de la pharmacie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <img src={sogaraReception} alt="Accueil" className="w-full h-28 object-cover rounded-lg border" />
                  <img src={sogaraEquipment} alt="Équipement" className="w-full h-28 object-cover rounded-lg border" />
                  <img src={doctorConsultation} alt="Conseil" className="w-full h-28 object-cover rounded-lg border" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsable</CardTitle>
                <CardDescription>Pharmacien titulaire</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                {view.pharmacien_titulaire?.nom_complet ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{view.pharmacien_titulaire.nom_complet}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Non renseigné</span>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {view.telephone_principal && (
                  <a className="flex items-center gap-2 hover:text-foreground" href={`tel:${view.telephone_principal}`}>
                    <Phone className="h-4 w-4" />
                    {view.telephone_principal}
                  </a>
                )}
                {view.email && (
                  <a className="flex items-center gap-2 hover:text-foreground" href={`mailto:${view.email}`}>
                    <Mail className="h-4 w-4" />
                    {view.email}
                  </a>
                )}
                <a className="flex items-center gap-2 hover:text-foreground" href={mapsHref} target="_blank" rel="noreferrer">
                  <Navigation className="h-4 w-4" />
                  Ouvrir dans Maps
                </a>
              </CardContent>
            </Card>

            {view.latitude && view.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle>Localisation</CardTitle>
                  <CardDescription>Carte de la pharmacie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    ref={mapRef}
                    className="rounded-lg overflow-hidden border"
                    style={{ height: 220 }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


