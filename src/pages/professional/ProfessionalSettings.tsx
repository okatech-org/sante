import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, User, Bell, Shield, Globe, 
  Palette, Key, Mail, Phone, Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfessionalSettings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language: appLanguage, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    appointments: true,
    messages: true,
    reports: false
  });

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSaving, setTwoFactorSaving] = useState(false);

  const [prefTheme, setPrefTheme] = useState<'light'|'dark'|'system'>('system');
  const [prefLanguage, setPrefLanguage] = useState<'fr'|'en'>('fr');

  const [pwOpen, setPwOpen] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, phone, notification_email, notification_sms, notification_push, two_factor_enabled, theme, language')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setProfile({
            fullName: data.full_name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
          });
          setNotifications((prev) => ({
            ...prev,
            email: data.notification_email ?? prev.email,
            sms: data.notification_sms ?? prev.sms,
            push: data.notification_push ?? prev.push,
          }));
          setTwoFactorEnabled(Boolean(data.two_factor_enabled));
          setPrefTheme((data.theme as any) || 'system');
          setPrefLanguage((data.language as any) || 'fr');
        }
      } catch (e: any) {
        toast.error('Erreur lors du chargement des paramètres', { description: e.message });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!profile.fullName.trim()) {
      toast.error('Le nom complet est requis');
      return;
    }
    if (!profile.email.trim() || !profile.email.includes('@')) {
      toast.error('Email invalide');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          notification_email: notifications.email,
          notification_sms: notifications.sms,
          notification_push: notifications.push,
          two_factor_enabled: twoFactorEnabled,
          theme: prefTheme,
          language: prefLanguage,
        })
        .eq('id', user.id);
      if (error) throw error;
      setTheme(prefTheme);
      setLanguage(prefLanguage);
      toast.success('Paramètres enregistrés');
    } catch (e: any) {
      toast.error('Sauvegarde impossible', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user?.id) return;
    setTwoFactorSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: enabled })
        .eq('id', user.id);
      if (error) throw error;
      setTwoFactorEnabled(enabled);
      toast.success(enabled ? '2FA activée' : '2FA désactivée');
    } catch (e: any) {
      toast.error('Erreur 2FA', { description: e.message });
    } finally {
      setTwoFactorSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setPwSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Mot de passe modifié');
      setPwOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      toast.error('Échec de modification', { description: e.message });
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-1">
            Configuration de votre espace professionnel
          </p>
        </div>
        <Button variant="outline" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname">Nom complet</Label>
                <Input
                  id="fullname"
                  value={profile.fullName}
                  onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule</Label>
                <Input id="matricule" defaultValue="DIR-001" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Input id="department" defaultValue="Direction Médicale" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="establishment">Établissement</Label>
                <Input id="establishment" defaultValue="CMST SOGARA" disabled />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Rôles et permissions
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Médecin en Chef CMST</p>
                  <p className="text-sm text-muted-foreground">Accès complet à l'administration</p>
                </div>
                <Badge variant="secondary">Actif</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Médecin Généraliste</p>
                  <p className="text-sm text-muted-foreground">Accès aux fonctions médicales</p>
                </div>
                <Badge variant="secondary">Actif</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Préférences de notification
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  disabled={loading || saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications SMS</p>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes par SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  disabled={loading || saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-muted-foreground">Notifications dans l'application</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  disabled={loading || saving}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Types de notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rendez-vous</p>
                  <p className="text-sm text-muted-foreground">Nouveaux RDV et rappels</p>
                </div>
                <Switch
                  checked={notifications.appointments}
                  onCheckedChange={(checked) => setNotifications({...notifications, appointments: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground">Nouveaux messages reçus</p>
                </div>
                <Switch
                  checked={notifications.messages}
                  onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rapports</p>
                  <p className="text-sm text-muted-foreground">Rapports hebdomadaires</p>
                </div>
                <Switch
                  checked={notifications.reports}
                  onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité du compte
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    <p className="font-medium">Mot de passe</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPwOpen(true)}>
                    Modifier
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recommandation: 12+ caractères, chiffres et symboles
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <p className="font-medium">Authentification à deux facteurs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {twoFactorSaving && <span className="text-xs text-muted-foreground">Mise à jour…</span>}
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={handleToggle2FA}
                      disabled={twoFactorSaving || loading}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </p>
              </div>
            </div>
          </Card>

          {/* Change password dialog */}
          <Dialog open={pwOpen} onOpenChange={setPwOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Changer le mot de passe</DialogTitle>
                <DialogDescription>Définissez un nouveau mot de passe pour votre compte.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirmer</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPwOpen(false)}>Annuler</Button>
                <Button onClick={handleChangePassword} disabled={pwSaving}>{pwSaving ? 'Modification…' : 'Modifier'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thème</p>
                  <p className="text-sm text-muted-foreground">Choisir le thème de l'interface</p>
                </div>
                <div className="flex gap-2">
                  <Button variant={prefTheme==='light'?'secondary':'outline'} size="sm" onClick={() => setPrefTheme('light')}>Clair</Button>
                  <Button variant={prefTheme==='dark'?'secondary':'outline'} size="sm" onClick={() => setPrefTheme('dark')}>Sombre</Button>
                  <Button variant={prefTheme==='system'?'secondary':'outline'} size="sm" onClick={() => setPrefTheme('system')}>Auto</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Langue et région
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select value={prefLanguage} onValueChange={(v) => setPrefLanguage(v as any)}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Fuseau horaire</Label>
                <Input value="Africa/Libreville (UTC+1)" disabled />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informations système</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Environnement</span>
                <span className="text-sm font-medium">Production</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Dernière mise à jour</span>
                <span className="text-sm font-medium">31 janvier 2025</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant="secondary">Opérationnel</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Support technique
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Signaler un problème
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
