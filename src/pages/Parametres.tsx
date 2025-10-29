import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService } from "@/services/patientService";
import { 
  Settings, User, Bell, Lock, Globe, 
  Moon, Sun, Monitor, Shield, Mail, Phone,
  Loader2, CheckCircle, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

export default function Parametres() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Profile states
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  
  // Password states
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Notifications states
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    appointments: true,
    prescriptions: true,
    results: true
  });
  const [notificationsSaving, setNotificationsSaving] = useState(false);
  
  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSaving, setTwoFactorSaving] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      setProfileLoading(true);
      try {
        const profile = await patientService.getProfile(user.id);
        if (profile) {
          setProfileData({
            fullName: profile.full_name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            dateOfBirth: profile.date_of_birth || '',
            address: profile.address || ''
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, user?.email]);

  // ========== HANDLERS ==========
  
  const handleSaveProfile = async () => {
    // Validation
    if (!profileData.fullName.trim()) {
      toast.error("Le nom complet est requis");
      return;
    }
    
    if (!profileData.email.trim() || !profileData.email.includes('@')) {
      toast.error("Email invalide");
      return;
    }

    setProfileSaving(true);
    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // await patientService.updateProfile(user.id, profileData);
      
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Reset error
    setPasswordError(null);
    
    // Validation
    if (!passwordData.current) {
      setPasswordError("Mot de passe actuel requis");
      return;
    }
    
    if (passwordData.new.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    setPasswordSaving(true);
    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // TODO: Implémenter avec Supabase
      // await supabase.auth.updateUser({ password: passwordData.new });
      
      toast.success("Mot de passe modifié avec succès");
      
      // Reset form
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      setPasswordError(error.message || "Erreur lors du changement de mot de passe");
      console.error(error);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setNotificationsSaving(true);
    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Préférences de notifications mises à jour");
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setNotificationsSaving(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    setTwoFactorSaving(true);
    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFactorEnabled(enabled);
      
      if (enabled) {
        toast.success("Authentification à deux facteurs activée");
      } else {
        toast.success("Authentification à deux facteurs désactivée");
      }
    } catch (error: any) {
      toast.error("Erreur lors de la configuration 2FA");
      console.error(error);
    } finally {
      setTwoFactorSaving(false);
    }
  };

  if (profileLoading) {
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
            <Settings className="w-6 h-6 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations de profil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input
                      id="fullName"
                      placeholder="Votre nom"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+241 XX XX XX XX"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date de naissance</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    placeholder="Votre adresse"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Canaux de notification</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">SMS</p>
                          <p className="text-sm text-muted-foreground">Recevoir des notifications par SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Notifications push</p>
                          <p className="text-sm text-muted-foreground">Recevoir des notifications dans l'application</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Types de notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rendez-vous</p>
                        <p className="text-sm text-muted-foreground">Rappels de rendez-vous</p>
                      </div>
                      <Switch
                        checked={notifications.appointments}
                        onCheckedChange={(checked) => setNotifications({...notifications, appointments: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Ordonnances</p>
                        <p className="text-sm text-muted-foreground">Nouvelles ordonnances disponibles</p>
                      </div>
                      <Switch
                        checked={notifications.prescriptions}
                        onCheckedChange={(checked) => setNotifications({...notifications, prescriptions: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Résultats d'analyses</p>
                        <p className="text-sm text-muted-foreground">Résultats disponibles</p>
                      </div>
                      <Switch
                        checked={notifications.results}
                        onCheckedChange={(checked) => setNotifications({...notifications, results: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveNotifications}
                    disabled={notificationsSaving}
                  >
                    {notificationsSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enregistrer les préférences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Gérez la sécurité de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Modification...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Changer le mot de passe
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentification à deux facteurs</CardTitle>
                <CardDescription>Ajoutez une couche de sécurité supplémentaire</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activer 2FA</p>
                    <p className="text-sm text-muted-foreground">Protection supplémentaire de votre compte</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {twoFactorSaving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    <Switch 
                      checked={twoFactorEnabled}
                      onCheckedChange={handleToggle2FA}
                      disabled={twoFactorSaving}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Thème</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
                        theme === 'light' ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <Sun className="w-6 h-6" />
                      <span className="text-sm font-medium">Clair</span>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
                        theme === 'dark' ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <Moon className="w-6 h-6" />
                      <span className="text-sm font-medium">Sombre</span>
                    </button>

                    <button
                      onClick={() => setTheme('system')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
                        theme === 'system' ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <Monitor className="w-6 h-6" />
                      <span className="text-sm font-medium">Système</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Langue</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Français</p>
                        <p className="text-sm text-muted-foreground">Langue de l'interface</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Changer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PatientDashboardLayout>
  );
}
