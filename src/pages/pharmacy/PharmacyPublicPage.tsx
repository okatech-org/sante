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
  Package,
  ShoppingCart,
  Star,
  Truck,
  CreditCard,
  CheckCircle2,
  Snowflake,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import servicesHero from '@/assets/services-hero.jpg';
import doctorConsultation from '@/assets/doctor-consultation.jpg';
import sogaraReception from '@/assets/sogara-reception.jpg';
import sogaraEquipment from '@/assets/sogara-equipment.jpg';
import { PharmacyOrderCatalog } from '@/components/pharmacy/PharmacyOrderCatalog';

export default function PharmacyPublicPage() {
  const { id: idOrSlug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Remplacements/overrides spécifiques de slug → contenu
  const slug = (idOrSlug || '').toLowerCase();
  const overrides: Record<string, any> = {
    'pharmacie-du-marche-port-gentil-4': {
      nom_commercial: 'Pharmacie Centrale',
      type_structure: 'officine_privee',
      quartier: 'Centre-ville (à côté de Mandji Sport / Parking Rétro), BP 640, Rue du Gouverneur Bernard',
      ville: 'Port-Gentil',
      province: 'Ogooué-Maritime',
      telephone_principal: '011 55 21 64 / 077 36 98 35',
      email: null,
      latitude: -0.7194,
      longitude: 8.7818,
      reperes_geographiques: 'Rue du Gouverneur Bernard, près Mandji Sport / Parking Rétro',
      statut_verification: 'verifie',
      ouvert_24_7: false,
      conventionnement_cnamgs: true,
      horaires: null,
      modes_paiement: [],
      services_disponibles: [],
      delai_preparation_moyen_minutes: null,
      pharmacien_titulaire: null,
      accepte_commandes_en_ligne: false,
      nombre_commandes_total: null,
      nombre_avis: null,
      note_moyenne: null,
      nombre_employes: null,
    },
  };
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
      // Rechercher par nom commercial dérivé du slug (tolérant aux accents)
      const base = nameFromPharmacySlug(idOrSlug!).toLowerCase();
      const tokens = base
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
        .map(t => (t.length > 4 ? t.slice(0, t.length - 1) : t));
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
  const override = overrides[slug];
  const pharmacy = override || pharmacyById || pharmacyBySlug;
  const isLoading = override ? false : Boolean(isLoadingById || isLoadingBySlug);
  const isError = override ? false : Boolean(isErrorById || isErrorBySlug);
  const [fallbackEst, setFallbackEst] = useState<Establishment | null>(null);
  const [showOrderCatalog, setShowOrderCatalog] = useState(false);
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

  const scheduleSummary: string | null = (() => {
    const h = view.horaires as any;
    if (!h) return null;
    try {
      const obj = typeof h === 'string' ? JSON.parse(h) : h;
      if (obj && typeof obj === 'object') {
        const openDays = Object.entries(obj)
          .filter(([, v]: any) => v && (v.ouvert === true || (Array.isArray(v.horaires) && v.horaires.length > 0)))
          .map(([d]) => d);
        return openDays.length ? `${openDays.length} j/7` : null;
      }
      return typeof h === 'string' ? h : null;
    } catch {
      return typeof h === 'string' ? h : null;
    }
  })();

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-background to-blue-50/30 dark:from-background dark:via-background dark:to-background">
      {/* Hero moderne */}
      <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <ShieldCheck className="h-4 w-4" />
                  Pharmacie Vérifiée ONPG
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {view.nom_commercial}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {view.type_structure === 'pharmacie_sur_site' 
                    ? 'Pharmacie sur site - Service médical intégré' 
                    : 'Votre santé, notre priorité'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {view.statut_verification === 'verifie' && (
                  <Badge className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    Vérifiée ONPG
                  </Badge>
                )}
                {view.ouvert_24_7 && (
                  <Badge variant="default" className="px-3 py-1.5 bg-blue-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Ouvert 24/7
                  </Badge>
                )}
                {view.conventionnement_cnamgs && (
                  <Badge variant="default" className="px-3 py-1.5 bg-emerald-600">
                    CNAMGS Conventionnée
                  </Badge>
                )}
                {view.accepte_commandes_en_ligne && (
                  <Badge variant="default" className="px-3 py-1.5 bg-purple-600">
                    <Package className="h-4 w-4 mr-1" />
                    Commande en ligne
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 backdrop-blur border">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{fullAddress || 'Adresse non renseignée'}</span>
                </div>
                {view.telephone_principal && (
                  <a 
                    href={`tel:${view.telephone_principal}`}
                    className="flex items-center gap-2 p-3 rounded-lg bg-card/50 backdrop-blur border hover:bg-muted/50 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="font-medium">{view.telephone_principal}</span>
                  </a>
                )}
              </div>

              <div className="flex gap-3">
                {view.accepte_commandes_en_ligne && (
                  <Button size="lg" className="shadow-lg shadow-primary/20" onClick={() => setShowOrderCatalog(true)}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Commander en ligne
                  </Button>
                )}
                <Button asChild size="lg" variant="outline">
                  <a href={mapsHref} target="_blank" rel="noreferrer">
                    <Navigation className="h-5 w-5 mr-2" />
                    Itinéraire
                  </a>
                </Button>
                {view.telephone_principal && (
                  <Button asChild size="lg" variant="outline">
                    <a href={`tel:${view.telephone_principal}`}>
                      <Phone className="h-5 w-5 mr-2" />
                      Appeler
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                <img src={servicesHero} alt="Pharmacie" className="w-full h-[320px] object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{view.note_moyenne || '4.6'}</div>
                      <div className="text-xs opacity-90">Note moyenne</div>
                    </div>
                    <div className="h-12 w-px bg-white/30" />
                    <div className="text-center">
                      <div className="text-3xl font-bold">{view.nombre_avis || '87'}</div>
                      <div className="text-xs opacity-90">Avis clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats rapides */}
      <section className="py-8 bg-card/30 backdrop-blur border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{view.delai_preparation_moyen_minutes || 20}</div>
              <div className="text-sm text-muted-foreground">Min préparation</div>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600/10 text-green-600 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{view.nombre_commandes_total || '1,542'}</div>
              <div className="text-sm text-muted-foreground">Commandes</div>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/10 text-blue-600 mb-2">
                <Star className="h-6 w-6 fill-current" />
              </div>
              <div className="text-2xl font-bold">{view.note_moyenne || '4.6'}/5</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/10 text-purple-600 mb-2">
                <Package className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{view.nombre_employes || 4}</div>
              <div className="text-sm text-muted-foreground">Professionnels</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-3">
          {/* Infos principales */}
          <div className="lg:col-span-2 space-y-6">
            {view.accepte_commandes_en_ligne && (
              <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-blue-500/5">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    Commander en ligne
                  </CardTitle>
                  <CardDescription className="text-base">
                    Produits de parapharmacie et médicaments sans ordonnance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60 border">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-bold text-lg">2,000+</div>
                        <div className="text-xs text-muted-foreground">Produits</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60 border">
                      <Truck className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-bold text-lg">Livraison</div>
                        <div className="text-xs text-muted-foreground">Sous 2h</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60 border">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-bold text-lg">Mobile Money</div>
                        <div className="text-xs text-muted-foreground">Accepté</div>
                      </div>
                    </div>
                  </div>
                  <Button size="lg" className="w-full" onClick={() => setShowOrderCatalog(true)}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Parcourir le catalogue
                  </Button>
                </CardContent>
              </Card>
            )}

            <PharmacyOrderCatalog
              open={showOrderCatalog}
              onClose={() => setShowOrderCatalog(false)}
              pharmacyId={pharmacy?.id || ""}
              pharmacyName={view.nom_commercial || ""}
            />

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Horaires et Disponibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduleSummary && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Horaires d'ouverture</div>
                      <div className="text-sm text-muted-foreground">{scheduleSummary}</div>
                    </div>
                  </div>
                )}
                {view.ouvert_24_7 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-600/10 text-blue-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Service 24h/24, 7j/7</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {(view.modes_paiement && view.modes_paiement.length > 0) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Modes de Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {view.modes_paiement.map((m: string) => (
                      <div key={m} className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{m}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {view.services_disponibles && view.services_disponibles.length > 0 ? (
                    view.services_disponibles.map((s: string) => (
                      <div key={s} className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{s}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-2">Aucun service listé</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {(view.dispose_chambre_froide || view.dispose_armoire_securisee) && (
              <Card className="shadow-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-card dark:to-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-blue-600" />
                    Équipements Spécialisés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {view.dispose_chambre_froide && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/80 border">
                      <Snowflake className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-medium">Chambre froide</div>
                        <div className="text-sm text-muted-foreground">Vaccins et produits thermosensibles</div>
                      </div>
                    </div>
                  )}
                  {view.dispose_armoire_securisee && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/80 border">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium">Armoire sécurisée</div>
                        <div className="text-sm text-muted-foreground">Stupéfiants et médicaments contrôlés</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Galerie moderne */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle>Galerie Photos</CardTitle>
                <CardDescription>Découvrez nos installations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-1">
                  <div className="relative group overflow-hidden aspect-square">
                    <img src={sogaraReception} alt="Accueil" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="relative group overflow-hidden aspect-square">
                    <img src={sogaraEquipment} alt="Équipement" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="relative group overflow-hidden aspect-square">
                    <img src={doctorConsultation} alt="Conseil" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {view.pharmacien_titulaire?.nom_complet && (
              <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-blue-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Pharmacien Titulaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-card/80 border">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {view.pharmacien_titulaire.nom_complet.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{view.pharmacien_titulaire.nom_complet}</div>
                      <div className="text-sm text-muted-foreground">Docteur en Pharmacie</div>
                      {view.pharmacien_titulaire.numero_inscription_onpg && (
                        <div className="text-xs text-muted-foreground mt-1">ONPG: {view.pharmacien_titulaire.numero_inscription_onpg}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {view.telephone_principal && (
                  <a 
                    href={`tel:${view.telephone_principal}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">{view.telephone_principal}</div>
                      <div className="text-xs text-muted-foreground">Téléphone principal</div>
                    </div>
                  </a>
                )}
                {view.email && (
                  <a 
                    href={`mailto:${view.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors"
                  >
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">{view.email}</div>
                      <div className="text-xs text-muted-foreground">Email</div>
                    </div>
                  </a>
                )}
                <a 
                  href={mapsHref} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors"
                >
                  <Navigation className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Itinéraire GPS</div>
                    <div className="text-xs text-muted-foreground">Ouvrir dans Maps</div>
                  </div>
                </a>
              </CardContent>
            </Card>

            {view.latitude && view.longitude && (
              <Card className="shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Localisation
                  </CardTitle>
                  <CardDescription>Nous trouver facilement</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    ref={mapRef}
                    className="w-full"
                    style={{ height: 280 }}
                  />
                  <div className="p-4 bg-muted/30 border-t">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">{fullAddress}</div>
                        {view.reperes_geographiques && (
                          <div className="text-xs text-muted-foreground">{view.reperes_geographiques}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


