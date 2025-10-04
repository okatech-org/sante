
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, Mail, MessageSquare, Calendar as CalendarIcon, MapPin, Clock, FileText, ArrowRight, Navigation } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect } from "react";

export default function AppointmentConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    provider,
    consultationType,
    selectedDate,
    selectedTimeSlot,
    reason,
    totalToPay
  } = useAppointmentStore();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-background py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Animation de confirmation */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-scale-in">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Rendez-vous confirmé !</h1>
            <p className="text-muted-foreground text-lg">
              Votre rendez-vous a été enregistré avec succès
            </p>
            <Badge variant="outline" className="mt-2">
              N° de confirmation: {id}
            </Badge>
          </div>

          {/* Récapitulatif complet */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">👨‍⚕️</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{provider?.name}</h2>
                  <p className="text-lg text-muted-foreground">{provider?.specialtyLabel}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                  <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p className="font-semibold">{selectedTimeSlot}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu</p>
                    <p className="font-semibold">
                      {consultationType === 'cabinet' ? provider?.address : 'Téléconsultation'}
                    </p>
                    {consultationType === 'cabinet' && (
                      <p className="text-sm text-muted-foreground">{provider?.city}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Motif</p>
                    <p className="font-semibold line-clamp-2">{reason}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Montant payé :</span>
                  <span className="text-xl font-bold text-green-600">{totalToPay.toLocaleString()} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions disponibles */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Actions disponibles</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start h-auto py-4">
                  <Download className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Télécharger PDF</p>
                    <p className="text-xs text-muted-foreground">Confirmation imprimable</p>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-4">
                  <Mail className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Recevoir par email</p>
                    <p className="text-xs text-muted-foreground">Envoi immédiat</p>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-4">
                  <MessageSquare className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Recevoir par SMS</p>
                    <p className="text-xs text-muted-foreground">Sur votre mobile</p>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-4">
                  <CalendarIcon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Ajouter au calendrier</p>
                    <p className="text-xs text-muted-foreground">Google / iCal</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prochaines étapes */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Prochaines étapes</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Confirmation envoyée par SMS</p>
                    <p className="text-sm text-muted-foreground">Reçu immédiatement</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Rappel 24h avant</p>
                    <p className="text-sm text-muted-foreground">Notification SMS automatique</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Rappel 1h avant</p>
                    <p className="text-sm text-muted-foreground">Notification sur l'application</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {consultationType === 'cabinet' ? 'Itinéraire vers le cabinet' : 'Lien de téléconsultation'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {consultationType === 'cabinet' 
                        ? 'Accessible le jour du rendez-vous'
                        : 'Lien envoyé 10 minutes avant'
                      }
                    </p>
                    {consultationType === 'cabinet' && (
                      <Button variant="link" className="h-auto p-0 mt-1 text-sm">
                        <Navigation className="h-3 w-3 mr-1" />
                        Voir l'itinéraire maintenant
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons de navigation */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              ← Retour à l'accueil
            </Button>
            <Button
              onClick={() => navigate('/appointments')}
              className="flex-1"
            >
              Voir mes rendez-vous
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
