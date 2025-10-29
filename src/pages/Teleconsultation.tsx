import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Video, Calendar, Clock, User, Building2,
  Plus, Phone, MessageSquare, Monitor, Info,
  Loader2, CheckCircle, AlertCircle, FileText
} from "lucide-react";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  rating: number;
  consultations: number;
}

interface TeleconsultationBooking {
  type: 'video' | 'audio' | 'chat';
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}

export default function Teleconsultation() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'video' | 'audio' | 'chat'>('video');
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockDoctors: Doctor[] = [
          { 
            id: "doc-001", 
            name: "Dr. Marie OKEMBA", 
            specialty: "Médecine Générale", 
            available: true,
            rating: 4.9,
            consultations: 1250
          },
          { 
            id: "doc-002", 
            name: "Dr. Paul NGUEMA", 
            specialty: "Urgences", 
            available: true,
            rating: 4.8,
            consultations: 980
          },
          { 
            id: "doc-003", 
            name: "Dr. Léa Mbina", 
            specialty: "Cardiologie", 
            available: false,
            rating: 4.9,
            consultations: 1520
          },
          { 
            id: "doc-004", 
            name: "Dr. Thomas Mezui", 
            specialty: "Pédiatrie", 
            available: true,
            rating: 5.0,
            consultations: 1100
          }
        ];
        
        setDoctors(mockDoctors);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des médecins');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const handleOpenBooking = (type: 'video' | 'audio' | 'chat', doctorId?: string) => {
    setBookingType(type);
    if (doctorId) {
      setSelectedDoctor(doctorId);
    }
    setBookingOpen(true);
  };

  const validateBooking = (): string | null => {
    if (!selectedDoctor) return "Veuillez sélectionner un médecin";
    if (!bookingDate) return "Veuillez sélectionner une date";
    if (!bookingTime) return "Veuillez sélectionner une heure";
    if (!reason.trim()) return "Veuillez indiquer le motif de consultation";
    
    // Vérifier que la date n'est pas dans le passé
    const selectedDateTime = new Date(`${bookingDate}T${bookingTime}`);
    if (selectedDateTime < new Date()) {
      return "La date et l'heure doivent être dans le futur";
    }
    
    return null;
  };

  const handleSubmitBooking = async () => {
    // 1. Reset error
    const validationError = validateBooking();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // 2. Show loading
    setSubmitting(true);

    try {
      // 3. Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking: TeleconsultationBooking = {
        type: bookingType,
        doctorId: selectedDoctor,
        date: bookingDate,
        time: bookingTime,
        reason
      };
      
      console.log('Booking created:', booking);
      
      // 4. Success feedback
      toast.success("Réservation confirmée", {
        description: `Votre ${bookingType === 'video' ? 'téléconsultation vidéo' : 
                             bookingType === 'audio' ? 'consultation téléphonique' : 
                             'consultation par chat'} est programmée`
      });
      
      // 5. Reset form
      setBookingOpen(false);
      setSelectedDoctor("");
      setBookingDate("");
      setBookingTime("");
      setReason("");
      
    } catch (error: any) {
      // 6. Error handling
      toast.error("Erreur lors de la réservation", {
        description: error.message || "Veuillez réessayer"
      });
      console.error("Booking failed:", error);
    } finally {
      // 7. Hide loading
      setSubmitting(false);
    }
  };

  const handleStartConsultation = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    if (!doctor.available) {
      toast.error("Ce médecin n'est pas disponible actuellement");
      return;
    }

    toast.success(`Lancement de la consultation avec ${doctor.name}`, {
      description: "Veuillez patienter..."
    });
    
    // TODO: Rediriger vers la salle de consultation
  };

  const getBookingTypeLabel = () => {
    switch(bookingType) {
      case 'video': return 'Consultation Vidéo';
      case 'audio': return 'Appel Audio';
      case 'chat': return 'Chat Médical';
    }
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            Téléconsultation
          </h1>
          <p className="text-muted-foreground">Consultez un médecin en ligne depuis chez vous</p>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Service de téléconsultation disponible</h3>
                <p className="text-sm text-muted-foreground">
                  Prenez rendez-vous avec nos médecins partenaires pour une consultation vidéo sécurisée.
                  Disponible 7j/7 de 7h à 22h.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Consultation Vidéo</h3>
                <p className="text-sm text-muted-foreground">Consultation en face à face par vidéo</p>
                <Button 
                  className="w-full"
                  onClick={() => handleOpenBooking('video')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Réserver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Appel Audio</h3>
                <p className="text-sm text-muted-foreground">Consultation téléphonique</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOpenBooking('audio')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Réserver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Chat Médical</h3>
                <p className="text-sm text-muted-foreground">Discussion par messagerie</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOpenBooking('chat')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Démarrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Médecins disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Médecins disponibles maintenant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          ⭐ {doctor.rating} • {doctor.consultations} consultations
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={doctor.available ? "default" : "secondary"}>
                      {doctor.available ? "Disponible" : "Occupé"}
                    </Badge>
                    {doctor.available && (
                      <Button 
                        size="sm"
                        onClick={() => handleStartConsultation(doctor.id)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Consulter
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comment ça marche */}
        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Calendar, title: "1. Réservez", desc: "Choisissez votre créneau" },
                { icon: Clock, title: "2. Préparez", desc: "10min avant l'heure" },
                { icon: Monitor, title: "3. Connectez", desc: "Rejoignez la consultation" },
                { icon: FileText, title: "4. Recevez", desc: "Ordonnance si nécessaire" }
              ].map((step, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {bookingType === 'video' && <Video className="w-5 h-5" />}
              {bookingType === 'audio' && <Phone className="w-5 h-5" />}
              {bookingType === 'chat' && <MessageSquare className="w-5 h-5" />}
              Réserver - {getBookingTypeLabel()}
            </DialogTitle>
            <DialogDescription>
              Planifiez votre consultation en ligne avec un médecin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Médecin *</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Sélectionnez un médecin" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.filter(d => d.available).map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Heure *</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motif de consultation *</Label>
              <Textarea
                id="reason"
                placeholder="Décrivez brièvement le motif de votre consultation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>

            <Card className="border-blue-500/20 bg-blue-500/10">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Assurez-vous d'avoir une connexion internet stable et un environnement calme.
                    Vous recevrez un lien de connexion par email 10 minutes avant la consultation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setBookingOpen(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitBooking}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Réservation...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientDashboardLayout>
  );
}