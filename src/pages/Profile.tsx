import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, MapPin, Calendar, Save, Lock, Bell, Eye, Shield, Palette, Home, Video, FileHeart, Pill, Activity, Settings, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import logoSante from "@/assets/logo_sante.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const profileSchema = z.object({
  full_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [activeSection, setActiveSection] = useState("profile");
  const [activeMenu, setActiveMenu] = useState('settings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const fullName = (user?.user_metadata as any)?.full_name || user?.email || "Utilisateur";

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/dashboard/patient', color: '#00d4ff' },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar, badge: '2', path: '/appointments', color: '#0088ff' },
    { id: 'teleconsult', label: 'Téléconsultation', icon: Video, path: '/teleconsultation', color: '#00d4ff' },
    { id: 'dossier', label: 'Dossier Médical', icon: FileHeart, path: '/medical-record', color: '#ffaa00' },
    { id: 'ordonnances', label: 'Mes ordonnances', icon: Pill, badge: '1', path: '/prescriptions', color: '#ff0088' },
    { id: 'resultats', label: 'Résultats d\'analyses', icon: Activity, path: '/results', color: '#0088ff' },
    { id: 'cnamgs', label: 'Droits CNAMGS', icon: Shield, path: '/reimbursements', color: '#00d4ff' },
    { id: 'messages', label: 'Messages', icon: Bell, badge: '3', path: '/support', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/profile', color: '#ff0088' }
  ];

  const settingsSections = [
    { id: "profile", label: "Profil", icon: User, color: "#00d4ff" },
    { id: "security", label: "Sécurité", icon: Lock, color: "#0088ff" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "#ffaa00" },
    { id: "privacy", label: "Confidentialité", icon: Eye, color: "#ff0088" },
    { id: "preferences", label: "Préférences", icon: Palette, color: "#00d4ff" },
  ];

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        reset({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          gender: data.gender || "",
          province: data.province || "",
          city: data.city || "",
          neighborhood: data.neighborhood || "",
        });
        setAvatarUrl(data.avatar_url || "");
      } else {
        reset({
          full_name: (user?.user_metadata as any)?.full_name || user?.email || "",
          email: user?.email || "",
          phone: (user?.user_metadata as any)?.phone || "",
          birth_date: "",
          gender: "",
          province: "",
          city: "",
          neighborhood: "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du profil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          email: data.email || null,
          phone: data.phone,
          birth_date: data.birth_date || null,
          gender: data.gender || null,
          province: data.province || null,
          city: data.city || null,
          neighborhood: data.neighborhood || null,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
          backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
        }} />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" />
        </div>
      </div>
    );
  }

  const initials = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background sombre avec étoiles */}
      <div className="fixed inset-0 bg-[#0f1419] -z-10">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
          backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
        }} />
      </div>

      {/* Container avec sidebar */}
      <div className="relative flex">
        {/* Sidebar Desktop et Tablette */}
        <aside className="hidden md:block w-72 h-screen fixed left-0 top-0 p-3 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-5 bg-[#1a1f2e]/90 border border-white/10 shadow-2xl flex flex-col">
            {/* Logo */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-2xl font-bold text-white">SANTE.GA</h1>
              </div>
              <p className="text-xs text-gray-500">Votre santé à portée de clic</p>
            </div>

            {/* Menu */}
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      if (item.path) navigate(item.path);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? '' : 'bg-white/5'
                        }`}
                        style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                      >
                        <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {fullName.split(' ')[0]}
                    </p>
                    <p className="text-xs text-gray-500">Paramètres</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header avec menu hamburger */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e]/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-bold text-white tracking-tight">SANTE.GA</h1>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#1a1f2e] border-white/10 p-0">
                <div className="h-full flex flex-col p-6">
                  {/* Logo */}
                  <div className="mb-8 mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
                      <h1 className="text-2xl font-bold text-white tracking-tight">SANTE.GA</h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">Votre santé à portée de clic</p>
                  </div>

                  {/* Menu Mobile */}
                  <nav className="space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map(item => {
                      const Icon = item.icon;
                      const isActive = activeMenu === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveMenu(item.id);
                            if (item.path) navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isActive ? '' : 'bg-white/5'
                              }`}
                              style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                            >
                              <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                              style={{ backgroundColor: item.color }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  {/* User Profile Mobile */}
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff] text-lg">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                          <p className="text-xs text-gray-500">Paramètres</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 p-3 lg:p-4 max-w-7xl pt-16 md:pt-4">
          <div className="space-y-3">
            {/* Menu secondaire des sections */}
            <div className="lg:col-span-4">
              <div className="rounded-xl backdrop-blur-xl p-2 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap text-sm ${
                          isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center ${
                            isActive ? '' : 'bg-white/5'
                          }`}
                          style={isActive ? { backgroundColor: `${section.color}20` } : {}}
                        >
                          <Icon className="w-4 h-4" style={{ color: isActive ? section.color : '' }} />
                        </div>
                        <span className="font-medium hidden sm:inline">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="space-y-3">
              {/* Section Profil */}
              {activeSection === "profile" && (
                <>
                  {/* Avatar et informations principales */}
                  <div className="rounded-xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                    <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" style={{ color: '#00d4ff' }} />
                      Photo de profil
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00d4ff] to-[#0088ff] p-1">
                          <div className="w-full h-full rounded-full bg-[#1a1f2e] flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl sm:text-3xl font-bold text-white">{initials}</span>
                            )}
                          </div>
                        </div>
                        <AvatarUpload
                          currentAvatarUrl={avatarUrl || undefined}
                          onAvatarUpdate={setAvatarUrl}
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5">{fullName}</h3>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Membre depuis {new Date().getFullYear()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire d'informations personnelles */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                      <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" style={{ color: '#00d4ff' }} />
                        Informations personnelles
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="full_name" className="text-gray-300 text-sm flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            Nom complet *
                          </Label>
                          <Input
                            id="full_name"
                            {...register("full_name")}
                            placeholder="Votre nom complet"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                          />
                          {errors.full_name && (
                            <p className="text-xs text-red-400">{errors.full_name.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-gray-300 text-sm flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="votre@email.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                          />
                          {errors.email && (
                            <p className="text-xs text-red-400">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-gray-300 text-sm flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            Téléphone *
                          </Label>
                          <Input
                            id="phone"
                            {...register("phone")}
                            placeholder="+241 XX XX XX XX"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-400">{errors.phone.message}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="birth_date" className="text-gray-300 text-sm flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Date de naissance
                          </Label>
                          <Input
                            id="birth_date"
                            type="date"
                            {...register("birth_date")}
                            className="bg-white/5 border-white/10 text-white h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="gender" className="text-gray-300 text-sm">Genre</Label>
                          <Select onValueChange={(value) => setValue("gender", value)}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                              <SelectValue placeholder="Sélectionnez votre genre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Homme</SelectItem>
                              <SelectItem value="female">Femme</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Adresse */}
                    <div className="rounded-xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl mt-3">
                      <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: '#0088ff' }} />
                        Adresse
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="province" className="text-gray-300 text-sm flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            Province
                          </Label>
                          <Input
                            id="province"
                            {...register("province")}
                            placeholder="Ex: Estuaire"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-gray-300 text-sm">Ville</Label>
                          <Input
                            id="city"
                            {...register("city")}
                            placeholder="Ex: Libreville"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <Label htmlFor="neighborhood" className="text-gray-300 text-sm">Quartier</Label>
                          <Input
                            id="neighborhood"
                            {...register("neighborhood")}
                            placeholder="Ex: Nombakele"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-[#00d4ff] to-[#0088ff] hover:from-[#00c4ef] hover:to-[#0078ef] text-white px-6 h-9 text-sm"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {/* Section Sécurité */}
              {activeSection === "security" && (
                <div className="rounded-xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4" style={{ color: '#0088ff' }} />
                    Sécurité
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-1 text-sm">Changer le mot de passe</h3>
                      <p className="text-xs text-gray-400 mb-2">Modifiez votre mot de passe pour sécuriser votre compte</p>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-8 text-xs">
                        Changer le mot de passe
                      </Button>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-1 text-sm">Authentification à deux facteurs</h3>
                      <p className="text-xs text-gray-400 mb-2">Ajoutez une couche de sécurité supplémentaire</p>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-8 text-xs">
                        Activer 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Notifications */}
              {activeSection === "notifications" && (
                <div className="rounded-xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4" style={{ color: '#ffaa00' }} />
                    Notifications
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400">Configuration des notifications à venir...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Confidentialité */}
              {activeSection === "privacy" && (
                <div className="rounded-xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" style={{ color: '#ff0088' }} />
                    Confidentialité
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400">Paramètres de confidentialité à venir...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Préférences */}
              {activeSection === "preferences" && (
                <div className="rounded-xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" style={{ color: '#00d4ff' }} />
                    Préférences
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400">Préférences de l'application à venir...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
