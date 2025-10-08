import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { SuperAdminHeader } from "@/components/superadmin/SuperAdminHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, RotateCcw, Settings, Bell, Calendar, CreditCard, Database, Shield } from "lucide-react";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  category: string;
  updated_at: string;
}

export default function AdminSettings() {
  const { user, userRoles, isLoading } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*");

      if (error) throw error;

      const settingsMap: Record<string, any> = {};
      data?.forEach((setting: SystemSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });

      setSettings(settingsMap);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any, category: string) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          setting_key: key,
          setting_value: value,
          category: category,
          updated_by: user?.id,
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));

      toast({
        title: "Succès",
        description: "Paramètre mis à jour",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userRoles.includes("super_admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <SuperAdminHeader />
        
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paramètres système</h1>
            <p className="text-muted-foreground">
              Configuration avancée de la plateforme SANTE.GA
            </p>
          </div>
        </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            Système
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Rendez-vous
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Database className="h-4 w-4 mr-2" />
            Intégrations
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Conformité
          </TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration générale</CardTitle>
              <CardDescription>Paramètres de base de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform_name">Nom de la plateforme</Label>
                <Input
                  id="platform_name"
                  value={settings.platform_name?.value || ""}
                  onChange={(e) => updateSetting("platform_name", { value: e.target.value }, "system")}
                  placeholder="SANTE.GA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform_description">Description</Label>
                <Textarea
                  id="platform_description"
                  value={settings.platform_description?.value || ""}
                  onChange={(e) => updateSetting("platform_description", { value: e.target.value }, "system")}
                  placeholder="Description de la plateforme"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Désactiver temporairement l'accès à la plateforme
                  </p>
                </div>
                <Switch
                  checked={settings.maintenance_mode?.enabled || false}
                  onCheckedChange={(checked) => updateSetting("maintenance_mode", { enabled: checked }, "system")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Paramètres de sécurité et d'authentification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session_duration">Durée de session (minutes)</Label>
                <Input
                  id="session_duration"
                  type="number"
                  value={settings.session_duration?.minutes || 60}
                  onChange={(e) => updateSetting("session_duration", { minutes: parseInt(e.target.value) }, "system")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_login_attempts">Tentatives de connexion max</Label>
                <Input
                  id="max_login_attempts"
                  type="number"
                  value={settings.max_login_attempts?.count || 5}
                  onChange={(e) => updateSetting("max_login_attempts", { count: parseInt(e.target.value) }, "system")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à 2 facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Rendre obligatoire la validation en 2 étapes
                  </p>
                </div>
                <Switch
                  checked={settings.two_factor_auth?.required || false}
                  onCheckedChange={(checked) => updateSetting("two_factor_auth", { required: checked }, "system")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_strength">Force du mot de passe</Label>
                <Select
                  value={settings.password_strength?.level || "medium"}
                  onValueChange={(value) => updateSetting("password_strength", { level: value }, "system")}
                >
                  <SelectTrigger id="password_strength">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weak">Faible</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="strong">Fort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Email</CardTitle>
              <CardDescription>Paramètres SMTP et templates d'emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_server">Serveur SMTP</Label>
                <Input
                  id="smtp_server"
                  placeholder="smtp.example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp_port">Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    placeholder="587"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_sender">Email expéditeur</Label>
                  <Input
                    id="smtp_sender"
                    type="email"
                    placeholder="noreply@sante.ga"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration SMS</CardTitle>
              <CardDescription>Paramètres du fournisseur SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms_provider">Fournisseur SMS</Label>
                <Select>
                  <SelectTrigger id="sms_provider">
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="africastalking">Africa's Talking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms_api_key">Clé API</Label>
                <Input
                  id="sms_api_key"
                  type="password"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms_sender">Numéro expéditeur</Label>
                <Input
                  id="sms_sender"
                  placeholder="+241 XX XXX XXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Settings */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des rendez-vous</CardTitle>
              <CardDescription>Paramètres de gestion des consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appointment_duration">Durée par défaut (minutes)</Label>
                <Select
                  value={String(settings.appointment_default_duration?.minutes || 30)}
                  onValueChange={(value) => updateSetting("appointment_default_duration", { minutes: parseInt(value) }, "appointments")}
                >
                  <SelectTrigger id="appointment_duration">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation_delay">Délai d'annulation (heures)</Label>
                <Input
                  id="cancellation_delay"
                  type="number"
                  value={settings.appointment_cancellation_delay?.hours || 24}
                  onChange={(e) => updateSetting("appointment_cancellation_delay", { hours: parseInt(e.target.value) }, "appointments")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="booking_min">Réservation min (heures)</Label>
                  <Input
                    id="booking_min"
                    type="number"
                    value={settings.appointment_booking_min_delay?.hours || 2}
                    onChange={(e) => updateSetting("appointment_booking_min_delay", { hours: parseInt(e.target.value) }, "appointments")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booking_max">Réservation max (jours)</Label>
                  <Input
                    id="booking_max"
                    type="number"
                    value={settings.appointment_booking_max_delay?.days || 30}
                    onChange={(e) => updateSetting("appointment_booking_max_delay", { days: parseInt(e.target.value) }, "appointments")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_appointments">Rendez-vous simultanés max</Label>
                <Input
                  id="max_appointments"
                  type="number"
                  value={settings.max_simultaneous_appointments?.count || 3}
                  onChange={(e) => updateSetting("max_simultaneous_appointments", { count: parseInt(e.target.value) }, "appointments")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Settings */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moyens de paiement</CardTitle>
              <CardDescription>Activation des méthodes de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mobile Money</Label>
                  <p className="text-sm text-muted-foreground">
                    Airtel Money, Moov Money
                  </p>
                </div>
                <Switch
                  checked={settings.mobile_money_enabled?.enabled || false}
                  onCheckedChange={(checked) => updateSetting("mobile_money_enabled", { enabled: checked }, "payments")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Carte bancaire (Stripe)</Label>
                  <p className="text-sm text-muted-foreground">
                    Paiements par carte via Stripe
                  </p>
                </div>
                <Switch
                  checked={settings.stripe_enabled?.enabled || false}
                  onCheckedChange={(checked) => updateSetting("stripe_enabled", { enabled: checked }, "payments")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Paiement en établissement</Label>
                  <p className="text-sm text-muted-foreground">
                    Paiement sur place après consultation
                  </p>
                </div>
                <Switch
                  checked={settings.onsite_payment_enabled?.enabled || false}
                  onCheckedChange={(checked) => updateSetting("onsite_payment_enabled", { enabled: checked }, "payments")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
              <CardDescription>Prix des consultations (FCFA)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video_price">Consultation vidéo</Label>
                <Input
                  id="video_price"
                  type="number"
                  value={settings.video_consultation_price?.amount || 15000}
                  onChange={(e) => updateSetting("video_consultation_price", { amount: parseInt(e.target.value) }, "payments")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inperson_price">Consultation en présentiel</Label>
                <Input
                  id="inperson_price"
                  type="number"
                  value={settings.inperson_consultation_price?.amount || 25000}
                  onChange={(e) => updateSetting("inperson_consultation_price", { amount: parseInt(e.target.value) }, "payments")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_price">Consultation urgence</Label>
                <Input
                  id="emergency_price"
                  type="number"
                  value={settings.emergency_consultation_price?.amount || 35000}
                  onChange={(e) => updateSetting("emergency_consultation_price", { amount: parseInt(e.target.value) }, "payments")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission">Commission plateforme (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.platform_commission?.percentage || 10}
                  onChange={(e) => updateSetting("platform_commission", { percentage: parseInt(e.target.value) }, "payments")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Externes</CardTitle>
              <CardDescription>Configuration des intégrations avec les services externes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cnamgs_api">CNAMGS (Assurance)</Label>
                <Input
                  id="cnamgs_api"
                  placeholder="URL de l'API CNAMGS"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="health_ministry_api">Ministère de la Santé</Label>
                <Input
                  id="health_ministry_api"
                  placeholder="URL de l'API du Ministère"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pharmacies_api">Réseau de pharmacies</Label>
                <Input
                  id="pharmacies_api"
                  placeholder="URL de l'API pharmacies"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="labs_api">Laboratoires partenaires</Label>
                <Input
                  id="labs_api"
                  placeholder="URL de l'API laboratoires"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Outils de suivi et d'analyse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google_analytics">Google Analytics ID</Label>
                <Input
                  id="google_analytics"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Settings */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sauvegarde</CardTitle>
              <CardDescription>Gestion des sauvegardes automatiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup_frequency">Fréquence de sauvegarde</Label>
                <Select
                  value={settings.backup_frequency?.value || "daily"}
                  onValueChange={(value) => updateSetting("backup_frequency", { value }, "compliance")}
                >
                  <SelectTrigger id="backup_frequency">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention_days">Rétention des données (jours)</Label>
                <Input
                  id="retention_days"
                  type="number"
                  value={settings.data_retention_days?.days || 365}
                  onChange={(e) => updateSetting("data_retention_days", { days: parseInt(e.target.value) }, "compliance")}
                />
              </div>

              <Button variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Sauvegarder maintenant
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conformité RGPD</CardTitle>
              <CardDescription>Paramètres de conformité et confidentialité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="log_retention">Durée de conservation des logs (jours)</Label>
                <Input
                  id="log_retention"
                  type="number"
                  value={settings.log_retention_days?.days || 90}
                  onChange={(e) => updateSetting("log_retention_days", { days: parseInt(e.target.value) }, "compliance")}
                />
              </div>

              <div className="space-y-2">
                <Label>Documents légaux</Label>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Politique de confidentialité
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Conditions générales d'utilisation
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Exporter les données utilisateur
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      </div>
    </SuperAdminLayout>
  );
}
