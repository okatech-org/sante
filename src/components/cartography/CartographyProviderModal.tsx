import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CartographyProvider, Coordonnees } from "@/types/cartography";
import { 
  Phone, Navigation, Share2, Clock, MapPin, AlertCircle, Video, Calendar, FileText, 
  ShoppingCart, Package, User, ArrowLeft, CreditCard, Smartphone, Wallet, Loader2, CheckCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDistance } from "@/utils/distance";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { standardizeAddressWithName } from "@/utils/address-formatter";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

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

type BookingStep = 'info' | 'slot' | 'details' | 'payment' | 'confirmation';

export default function CartographyProviderModal({
  provider,
  userLocation,
  onClose
}: CartographyProviderModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // États pour le processus de réservation
  const [bookingStep, setBookingStep] = useState<BookingStep>('info');
  const [appointmentType, setAppointmentType] = useState<'physical' | 'video'>('physical');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<{date: Date; time: string} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'card' | 'onsite'>('onsite');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  // Formulaire de détails patient
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: user?.email || "",
    consultationType: "consultation",
    reason: "",
    notes: ""
  });

  // Charger les informations du profil utilisateur
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur chargement profil:', error);
          return;
        }

        if (profile) {
          setFormData(prev => ({
            ...prev,
            patientName: profile.full_name || prev.patientName,
            patientPhone: profile.phone || prev.patientPhone,
            patientEmail: user.email || prev.patientEmail
          }));
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  // Charger les créneaux disponibles pour une date
  useEffect(() => {
    if (selectedDate && bookingStep === 'slot' && provider) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate, bookingStep, provider]);

  const loadAvailableSlots = async (date: Date) => {
    if (!provider) return;
    
    try {
      const dayOfWeek = date.getDay(); // 0 = dimanche, 6 = samedi
      
      const { data, error } = await supabase
        .from('professional_availability')
        .select('start_time, end_time')
        .eq('professional_id', provider.id)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true);

      if (error) throw error;

      // Générer les créneaux de 30 minutes
      const slots: string[] = [];
      if (data && data.length > 0) {
        for (const availability of data) {
          const start = availability.start_time;
          const end = availability.end_time;
          
          let current = start;
          while (current < end) {
            slots.push(current);
            // Ajouter 30 minutes
            const [hours, minutes] = current.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes + 30;
            const newHours = Math.floor(totalMinutes / 60);
            const newMinutes = totalMinutes % 60;
            current = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:00`;
          }
        }
      }

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Erreur chargement créneaux:', error);
      toast.error("Erreur lors du chargement des disponibilités");
    }
  };
  
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
    const shareText = `${provider.nom}\n${standardizeAddressWithName(provider.adresse_descriptive, provider.ville, provider.province, provider.nom)}\nTél: ${provider.telephones[0]}`;
    
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

  // Handlers pour le système de réservation par étapes
  const handleBookAppointment = (type: 'physical' | 'video') => {
    if (!user) {
      toast.error("Vous devez être connecté pour prendre rendez-vous");
      navigate('/login/patient', { 
        state: { 
          from: `/cartography`,
          message: 'Connectez-vous pour prendre rendez-vous' 
        } 
      });
      return;
    }

    if (!hasAccount) {
      toast.error("Cet établissement n'est pas inscrit sur la plateforme");
      return;
    }

    setAppointmentType(type);
    setBookingStep('slot');
  };


  const handleSlotSelect = (time: string) => {
    if (selectedDate) {
      setSelectedSlot({ date: selectedDate, time });
      setBookingStep('details');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientPhone || !formData.reason) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setBookingStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (!user || !selectedSlot) return;

    setLoading(true);
    try {
      // Créer le rendez-vous dans la base de données
      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        professional_id: provider.id,
        appointment_date: format(selectedSlot.date, 'yyyy-MM-dd'),
        appointment_time: selectedSlot.time,
        duration_minutes: 30,
        status: paymentMethod === 'onsite' ? 'pending' : 'scheduled',
        appointment_type: appointmentType === 'physical' ? 'consultation' : 'teleconsultation',
        reason: formData.reason,
        notes: formData.notes,
        patient_name: formData.patientName,
        patient_phone: formData.patientPhone,
        patient_email: formData.patientEmail
      });

      if (error) throw error;

      setBookingStep('confirmation');
      toast.success("Rendez-vous confirmé avec succès !");
    } catch (error: any) {
      console.error('Erreur:', error);
      if (error.code === '23505') {
        toast.error("Ce créneau n'est plus disponible");
      } else {
        toast.error("Erreur lors de la confirmation du rendez-vous");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (bookingStep === 'slot') setBookingStep('info');
    else if (bookingStep === 'details') setBookingStep('slot');
    else if (bookingStep === 'payment') setBookingStep('details');
  };

  const handleClose = () => {
    setBookingStep('info');
    setSelectedSlot(null);
    setAppointmentType('physical');
    setPaymentMethod('onsite');
    setFormData({
      patientName: "",
      patientPhone: "",
      patientEmail: user?.email || "",
      consultationType: "consultation",
      reason: "",
      notes: ""
    });
    onClose();
  };

  // Rendu selon l'étape
  const renderContent = () => {
    switch (bookingStep) {
      case 'slot':
        return renderSlotSelection();
      case 'details':
        return renderDetailsForm();
      case 'payment':
        return renderPaymentSelection();
      case 'confirmation':
        return renderConfirmation();
      default:
        return renderProviderInfo();
    }
  };

  const renderProviderInfo = () => (
    <>
      {/* Scrollable content */}
      <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh]">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Profil professionnel */}
          {provider.type === 'cabinet_medical' && hasAccount && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-3 sm:p-4 border border-primary/20">
              <Button
                size="sm"
                onClick={() => navigate(`/professional/${provider.id}`)}
                className="w-full gap-2"
                variant="outline"
              >
                <User className="h-3.5 w-3.5" />
                <span className="text-xs">Voir le profil complet</span>
              </Button>
            </div>
          )}

          {/* Actions RDV */}
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
                  onClick={() => handleBookAppointment('physical')}
                  disabled={!hasAccount}
                  className={cn(!hasAccount && "opacity-50")}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Physique</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleBookAppointment('video')}
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

          {/* Actions Pharmacie */}
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
                    "h-auto py-3 px-3 justify-start items-start bg-green-600 hover:bg-green-700",
                    !hasAccount && "opacity-50"
                  )}
                >
                  <FileText className="h-3.5 w-3.5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs leading-tight text-left">
                    <span className="block">Envoyer</span>
                    <span className="block">ordonnance</span>
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => hasAccount ? navigate(`/pharmacy/${provider.id}/medications`) : null}
                  disabled={!hasAccount}
                  className={cn(
                    "h-auto py-3 px-3 justify-start items-start",
                    !hasAccount && "opacity-50"
                  )}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs leading-tight text-left">
                    <span className="block">Commander</span>
                    <span className="block">médicaments</span>
                  </span>
                </Button>
              </div>
              {!hasAccount && (
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  Non inscrit sur la plateforme
                </p>
              )}
            </div>
          )}

          {/* Actions Laboratoire */}
          {(provider.type === 'laboratoire' || provider.type === 'imagerie') && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
              <h3 className="text-sm font-semibold mb-2.5 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                Réserver un examen
              </h3>
              <Button
                size="sm"
                onClick={() => handleBookAppointment('physical')}
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

          {/* Contact & Localisation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Localisation
              </div>
              <p className="text-xs leading-relaxed">
                {standardizeAddressWithName(provider.adresse_descriptive, provider.ville, provider.province, provider.nom)}
              </p>
            </div>

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

          {/* Services & Conventionnement */}
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
    </>
  );

  const renderSlotSelection = () => (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button size="sm" variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">Sélectionnez un créneau</h3>
      </div>
      
      <div className="bg-primary/5 p-3 rounded-lg mb-4">
        <p className="text-sm">
          <strong>Type:</strong> {appointmentType === 'physical' ? 'Consultation physique' : 'Téléconsultation'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Calendrier */}
        <div className="border rounded-lg p-4">
          <p className="text-sm font-semibold mb-3">Choisissez une date</p>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              // Désactiver les dates passées et les dimanches
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || date.getDay() === 0;
            }}
            locale={fr}
            className={cn("pointer-events-auto")}
          />
        </div>

        {/* Créneaux horaires */}
        {selectedDate && (
          <div className="border rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              Créneaux pour le {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
            </p>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSlotSelect(time)}
                    className="justify-center"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {time.substring(0, 5)}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun créneau disponible ce jour
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <form onSubmit={handleDetailsSubmit} className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button size="sm" variant="ghost" onClick={handleBack} type="button">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">Vos informations</h3>
      </div>

      {selectedSlot && (
        <div className="bg-primary/5 p-3 rounded-lg mb-4">
          <p className="text-sm">
            <strong>Créneau:</strong> {format(selectedSlot.date, 'EEEE d MMMM', { locale: fr })} à {selectedSlot.time}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <Label htmlFor="patientName">Nom complet *</Label>
          <Input
            id="patientName"
            required
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            placeholder="Votre nom complet"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="patientPhone">Téléphone *</Label>
            <Input
              id="patientPhone"
              required
              type="tel"
              value={formData.patientPhone}
              onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
              placeholder="+241 XX XX XX XX"
            />
          </div>

          <div>
            <Label htmlFor="patientEmail">Email</Label>
            <Input
              id="patientEmail"
              type="email"
              value={formData.patientEmail}
              onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="reason">Motif de la consultation *</Label>
          <Input
            id="reason"
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Ex: Consultation générale, contrôle..."
          />
        </div>

        <div>
          <Label htmlFor="notes">Informations complémentaires</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Décrivez brièvement vos symptômes (optionnel)"
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Continuer vers le paiement
      </Button>
    </form>
  );

  const renderPaymentSelection = () => (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button size="sm" variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">Mode de paiement</h3>
      </div>

      <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
        <div className="space-y-3">
          {/* Payer sur place */}
          <Label
            htmlFor="onsite"
            className={cn(
              "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
              paymentMethod === 'onsite' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="onsite" id="onsite" className="mt-1" />
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="font-semibold">Payer sur place</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Caution de 2 500 FCFA requise
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Vous payerez le montant total lors de votre visite
              </p>
            </div>
          </Label>

          {/* Airtel Money */}
          <Label
            htmlFor="airtel"
            className={cn(
              "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
              paymentMethod === 'airtel' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="airtel" id="airtel" className="mt-1" />
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-red-600" />
                <span className="font-semibold">Airtel Money</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Paiement mobile instantané
              </p>
            </div>
          </Label>

          {/* Carte bancaire */}
          <Label
            htmlFor="card"
            className={cn(
              "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
              paymentMethod === 'card' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="card" id="card" className="mt-1" />
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Carte bancaire</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Paiement sécurisé par carte
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === 'onsite' && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 dark:text-amber-100">
              Une caution de 2 500 FCFA sera demandée pour confirmer votre réservation. 
              Cette caution sera déduite du montant total lors de votre consultation.
            </p>
          </div>
        </div>
      )}

      <Button 
        onClick={handlePaymentSubmit} 
        className="w-full"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirmer le rendez-vous
      </Button>
    </div>
  );

  const renderConfirmation = () => (
    <div className="p-4 sm:p-6 space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Rendez-vous confirmé !</h3>
        <p className="text-muted-foreground">
          Vous recevrez une confirmation par SMS et email
        </p>
      </div>

      {selectedSlot && (
        <div className="bg-primary/5 p-4 rounded-lg text-left space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-semibold">{provider.nom}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(selectedSlot.date, 'EEEE d MMMM yyyy', { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{selectedSlot.time}</span>
          </div>
          {paymentMethod === 'onsite' && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Wallet className="h-4 w-4 text-amber-600" />
              <span className="text-sm">Paiement sur place (caution: 2 500 FCFA)</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Button onClick={() => navigate('/appointments')} className="w-full">
          Voir mes rendez-vous
        </Button>
        <Button onClick={handleClose} variant="outline" className="w-full">
          Fermer
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={!!provider} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg w-[calc(100%-2rem)] p-0 gap-0 bg-background/95 backdrop-blur-xl border-2 shadow-2xl z-[2147483647] rounded-2xl overflow-hidden">
        {/* Header */}
        {bookingStep === 'info' && (
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

              {provider.distance && userLocation && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary w-fit">
                  <Navigation className="h-3 w-3" />
                  {formatDistance(provider.distance)}
                </div>
              )}
            </DialogHeader>
          </div>
        )}

        {/* Content dynamique selon l'étape */}
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
