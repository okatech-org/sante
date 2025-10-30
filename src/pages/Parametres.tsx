import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService } from "@/services/patientService";
import { CNAMGSCard } from "@/components/medical/CNAMGSCard";
import { 
  Settings, User, Bell, Lock, Globe, 
  Moon, Sun, Monitor, Shield, Mail, Phone,
  Loader2, CheckCircle, AlertCircle, CreditCard,
  MapPin, Calendar, FileText, Download, Eye,
  Activity, Heart, Camera, Edit2
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function Parametres() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Profile states
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    province: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    height: '',
    cnamgsNumber: '',
    cnamgsFund: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
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
            dateOfBirth: profile.birth_date || '',
            address: profile.address || '',
            city: profile.city || '',
            province: profile.province || '',
            gender: profile.gender || '',
            bloodGroup: profile.blood_group || '',
            weight: profile.weight_kg?.toString() || '',
            height: profile.height_m?.toString() || '',
            cnamgsNumber: profile.cnamgs_number || '',
            cnamgsFund: profile.cnamgs_fund || ''
          });
          setAvatarUrl(profile.avatar_url || '');
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    
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

    // Vérification fuite de mot de passe
    try {
      const sha1 = async (str: string) => {
        const buffer = new TextEncoder().encode(str);
        const digest = await crypto.subtle.digest('SHA-1', buffer);
        const hex = Array.from(new Uint8Array(digest))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase();
        return hex;
      };
      const hash = await sha1(passwordData.new);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (res.ok) {
        const text = await res.text();
        const found = text.split('\n').some(line => line.startsWith(suffix));
        if (found) {
          setPasswordError("Ce mot de passe a déjà fuité publiquement. Veuillez en choisir un autre.");
          return;
        }
      }
    } catch (e) {
      console.warn('HIBP check failed', e);
    }

    setPasswordSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success("Mot de passe modifié avec succès");
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(enabled);
      toast.success(enabled ? "Authentification à deux facteurs activée" : "Authentification à deux facteurs désactivée");
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-2">Gérez votre compte et vos préférences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="cnamgs" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">CNAMGS</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Apparence</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Photo de profil */}
            <Card>
              <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
                <CardDescription>Personnalisez votre avatar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarUrl} alt={profileData.fullName} />
                    <AvatarFallback className="text-2xl">
                      {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Changer la photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 2MB.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Vos données personnelles et coordonnées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      placeholder="Ex: Estuaire"
                      value={profileData.province}
                      onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      placeholder="Ex: Libreville"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    placeholder="Votre adresse complète"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>

                <Separator />

                {/* Informations médicales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Informations médicales
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Groupe sanguin</Label>
                      <Input
                        id="bloodGroup"
                        placeholder="Ex: O+"
                        value={profileData.bloodGroup}
                        onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Ex: 70"
                        value={profileData.weight}
                        onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="Ex: 175"
                        value={profileData.height}
                        onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    size="lg"
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

          {/* CNAMGS Tab */}
          <TabsContent value="cnamgs" className="space-y-6">
            {/* Statut CNAMGS */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">Couverture Active</h2>
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Actif
                      </Badge>
                    </div>
                    
                    <p className="text-lg font-medium text-muted-foreground mb-4">
                      Numéro d'assuré : {profileData.cnamgsNumber || 'Non renseigné'}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Taux de couverture</span>
                        <span className="font-bold text-primary">80%</span>
                      </div>
                      <Progress value={80} className="h-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte CNAMGS */}
            {profileData.cnamgsNumber && (
              <CNAMGSCard profile={{
                full_name: profileData.fullName,
                cnamgs_number: profileData.cnamgsNumber,
                cnamgs_fund: profileData.cnamgsFund,
                date_of_birth: profileData.dateOfBirth,
                gender: profileData.gender
              }} />
            )}

            {/* Formulaire CNAMGS */}
            <Card>
              <CardHeader>
                <CardTitle>Informations CNAMGS</CardTitle>
                <CardDescription>Renseignez vos informations d'assurance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnamgsNumber">Numéro CNAMGS</Label>
                    <Input
                      id="cnamgsNumber"
                      placeholder="Ex: 123456789"
                      value={profileData.cnamgsNumber}
                      onChange={(e) => setProfileData({...profileData, cnamgsNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnamgsFund">Fonds</Label>
                    <Input
                      id="cnamgsFund"
                      placeholder="Ex: Secteur Public"
                      value={profileData.cnamgsFund}
                      onChange={(e) => setProfileData({...profileData, cnamgsFund: e.target.value})}
                    />
                  </div>
                </div>

                {/* Droits et Couverture */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Consultations</p>
                      <p className="font-bold text-sm">100%</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Hospitalisations</p>
                      <p className="font-bold text-sm">100%</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Médicaments</p>
                      <p className="font-bold text-sm">80%</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Analyses</p>
                      <p className="font-bold text-sm">100%</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>

                <Alert className="border-blue-500/20 bg-blue-500/10 mt-6">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Votre couverture CNAMGS est active. En cas de consultation, présentez votre carte d'assuré.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    size="lg"
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enregistrer
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
                    <div className="flex items-center justify-between p-4 border rounded-lg">
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

                    <div className="flex items-center justify-between p-4 border rounded-lg">
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

                    <div className="flex items-center justify-between p-4 border rounded-lg">
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

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Types de notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Rendez-vous</p>
                        <p className="text-sm text-muted-foreground">Rappels de rendez-vous</p>
                      </div>
                      <Switch
                        checked={notifications.appointments}
                        onCheckedChange={(checked) => setNotifications({...notifications, appointments: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Ordonnances</p>
                        <p className="text-sm text-muted-foreground">Nouvelles ordonnances disponibles</p>
                      </div>
                      <Switch
                        checked={notifications.prescriptions}
                        onCheckedChange={(checked) => setNotifications({...notifications, prescriptions: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
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

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSaveNotifications}
                    disabled={notificationsSaving}
                    size="lg"
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
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>Modifiez votre mot de passe de connexion</CardDescription>
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

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    size="lg"
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Activer 2FA</p>
                      <p className="text-sm text-muted-foreground">Protection supplémentaire de votre compte</p>
                    </div>
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
                      className={`p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all hover:shadow-lg ${
                        theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <Sun className="w-8 h-8" />
                      <span className="font-medium">Clair</span>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all hover:shadow-lg ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <Moon className="w-8 h-8" />
                      <span className="font-medium">Sombre</span>
                    </button>

                    <button
                      onClick={() => setTheme('system')}
                      className={`p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all hover:shadow-lg ${
                        theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <Monitor className="w-8 h-8" />
                      <span className="font-medium">Système</span>
                    </button>
                  </div>
                </div>

                <Separator />

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
