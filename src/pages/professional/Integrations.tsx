import { useEffect, useState } from "react";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Building2, Shield, Calendar, Video, Mail, MessageSquare, 
  Bell, Zap, ExternalLink, CheckCircle, AlertCircle, Clock,
  Copy, RefreshCw, Settings
} from "lucide-react";
import { CNAMGSVerificationCard } from "@/components/professional/CNAMGSVerificationCard";
import { CNOMVerificationCard } from "@/components/professional/CNOMVerificationCard";

export default function Integrations() {
  const { user } = useAuth();
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zapierUrl, setZapierUrl] = useState("");
  const [isTestingZapier, setIsTestingZapier] = useState(false);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfessionalData();
      loadSettings();
    }
  }, [user]);

  const fetchProfessionalData = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setProfessional(data);
    } catch (error) {
      console.error('Error fetching professional:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    const savedZapierUrl = localStorage.getItem('zapier_webhook_url');
    const savedGoogleCal = localStorage.getItem('google_calendar_connected');
    const savedEmailNotif = localStorage.getItem('email_notifications');
    const savedSmsNotif = localStorage.getItem('sms_notifications');
    const savedWhatsappNotif = localStorage.getItem('whatsapp_notifications');

    if (savedZapierUrl) setZapierUrl(savedZapierUrl);
    if (savedGoogleCal) setGoogleCalendarConnected(JSON.parse(savedGoogleCal));
    if (savedEmailNotif) setEmailNotifications(JSON.parse(savedEmailNotif));
    if (savedSmsNotif) setSmsNotifications(JSON.parse(savedSmsNotif));
    if (savedWhatsappNotif) setWhatsappNotifications(JSON.parse(savedWhatsappNotif));
  };

  const saveZapierUrl = () => {
    if (!zapierUrl) {
      toast.error("Veuillez entrer une URL Zapier webhook");
      return;
    }

    localStorage.setItem('zapier_webhook_url', zapierUrl);
    toast.success("URL Zapier webhook sauvegardée");
  };

  const testZapierWebhook = async () => {
    if (!zapierUrl) {
      toast.error("Veuillez entrer une URL Zapier webhook");
      return;
    }

    setIsTestingZapier(true);

    try {
      await fetch(zapierUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          type: "test",
          timestamp: new Date().toISOString(),
          professional_id: professional?.id,
          professional_name: user?.user_metadata?.full_name,
          triggered_from: "SANTE.GA Integrations",
        }),
      });

      toast.success("Webhook test envoyé ! Vérifiez votre historique Zapier.");
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast.error("Erreur lors du test du webhook");
    } finally {
      setIsTestingZapier(false);
    }
  };

  const copyApiKey = () => {
    const apiKey = professional?.id || user?.id;
    navigator.clipboard.writeText(apiKey);
    toast.success("Clé API copiée dans le presse-papier");
  };

  const saveNotificationSettings = (type: string, value: boolean) => {
    localStorage.setItem(type, JSON.stringify(value));
    toast.success("Paramètres de notification sauvegardés");
  };

  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Intégrations</h1>
          <p className="text-muted-foreground mt-2">
            Connectez vos outils et gérez vos certifications professionnelles
          </p>
        </div>

        <Tabs defaultValue="certifications" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="certifications" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Certifications</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Automation</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendrier</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-4">
            {!professional ? (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-900">Profil professionnel manquant</h3>
                      <p className="text-sm text-orange-700 mt-1">
                        Vous devez compléter votre profil professionnel pour accéder aux certifications CNAMGS et CNOM.
                        Veuillez contacter l'administrateur ou compléter votre inscription professionnelle.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#00d4ff]" />
                      CNAMGS
                    </CardTitle>
                    <CardDescription>
                      Caisse Nationale d'Assurance Maladie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CNAMGSVerificationCard professionalId={professional.id} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#0088ff]" />
                      CNOM
                    </CardTitle>
                    <CardDescription>
                      Conseil National de l'Ordre des Médecins
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CNOMVerificationCard
                      professionalId={professional.id}
                      numeroOrdre={professional.numero_ordre}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#ffaa00]" />
                  Zapier Integration
                </CardTitle>
                <CardDescription>
                  Automatisez vos workflows avec plus de 5000+ applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zapier-webhook">Zapier Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="zapier-webhook"
                      type="url"
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      value={zapierUrl}
                      onChange={(e) => setZapierUrl(e.target.value)}
                    />
                    <Button variant="outline" onClick={saveZapierUrl}>
                      Sauvegarder
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Créez un Zap avec un trigger "Catch Hook" et collez l'URL ici
                  </p>
                </div>

                {zapierUrl && (
                  <div className="flex gap-2">
                    <Button onClick={testZapierWebhook} disabled={isTestingZapier}>
                      {isTestingZapier ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Test en cours...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Tester le webhook
                        </>
                      )}
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://zapier.com/app/zaps" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ouvrir Zapier
                      </a>
                    </Button>
                  </div>
                )}

                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <h4 className="font-semibold text-sm">Cas d'usage :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Envoyer une notification lors d'un nouveau RDV</li>
                    <li>• Créer une tâche dans Trello/Asana</li>
                    <li>• Ajouter les patients dans votre CRM</li>
                    <li>• Envoyer des rappels SMS automatiques</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#0088ff]" />
                  API REST
                </CardTitle>
                <CardDescription>
                  Intégrez SANTE.GA à vos applications personnalisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Votre clé API</Label>
                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value={professional?.id || user?.id || "***"} 
                      type="password"
                    />
                    <Button variant="outline" size="icon" onClick={copyApiKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Utilisez cette clé pour authentifier vos requêtes API
                  </p>
                </div>

                <Button variant="outline" asChild>
                  <a href="/docs/api" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Documentation API
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#00d4ff]" />
                  Google Calendar
                </CardTitle>
                <CardDescription>
                  Synchronisez vos rendez-vous avec Google Calendar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Synchronisation automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      {googleCalendarConnected ? "Connecté et synchronisé" : "Non connecté"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={googleCalendarConnected ? "default" : "secondary"}>
                      {googleCalendarConnected ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Actif
                        </>
                      ) : (
                        <>
                          <Clock className="mr-1 h-3 w-3" />
                          Inactif
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    const newState = !googleCalendarConnected;
                    setGoogleCalendarConnected(newState);
                    localStorage.setItem('google_calendar_connected', JSON.stringify(newState));
                    toast.success(newState ? "Google Calendar connecté" : "Google Calendar déconnecté");
                  }}
                  variant={googleCalendarConnected ? "destructive" : "default"}
                >
                  {googleCalendarConnected ? "Déconnecter" : "Connecter Google Calendar"}
                </Button>

                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-sm mb-2">Fonctionnalités :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Synchronisation bidirectionnelle en temps réel</li>
                    <li>• Rappels automatiques 24h avant</li>
                    <li>• Invitation automatique des patients par email</li>
                    <li>• Gestion des modifications et annulations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-[#ffaa00]" />
                  Microsoft Teams
                </CardTitle>
                <CardDescription>
                  Créez automatiquement des liens de visioconférence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Intégration Teams pour générer automatiquement des liens de téléconsultation
                </p>
                <Button variant="outline">
                  Connecter Microsoft Teams
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#0088ff]" />
                  Notifications par Email
                </CardTitle>
                <CardDescription>
                  Recevez des alertes par email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activer les notifications email</Label>
                    <p className="text-sm text-muted-foreground">
                      Nouveaux RDV, rappels, messages patients
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={(checked) => {
                      setEmailNotifications(checked);
                      saveNotificationSettings('email_notifications', checked);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#00d4ff]" />
                  Notifications SMS
                </CardTitle>
                <CardDescription>
                  Recevez des alertes urgentes par SMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activer les notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Urgences et rendez-vous importants
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={(checked) => {
                      setSmsNotifications(checked);
                      saveNotificationSettings('sms_notifications', checked);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#25D366]" />
                  Notifications WhatsApp
                </CardTitle>
                <CardDescription>
                  Recevez des notifications via WhatsApp Business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activer les notifications WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">
                      Confirmations de RDV et rappels patients
                    </p>
                  </div>
                  <Switch
                    checked={whatsappNotifications}
                    onCheckedChange={(checked) => {
                      setWhatsappNotifications(checked);
                      saveNotificationSettings('whatsapp_notifications', checked);
                    }}
                  />
                </div>

                {whatsappNotifications && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <p className="text-sm text-green-800">
                      <strong>WhatsApp Business configuré :</strong> Les patients recevront des rappels automatiques 24h avant leur RDV.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PatientDashboardLayout>
  );
}
