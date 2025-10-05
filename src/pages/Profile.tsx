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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, MapPin, Calendar, Save, Lock, Bell, Eye, Shield, Palette, Home, Video, FileHeart, Pill, Activity, Settings, Menu, HelpCircle, MessageCircle, Book, Check, AlertCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";
import logoSante from "@/assets/logo_sante.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const profileSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
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
  const [activeSection, setActiveSection] = useState("account");
  const [activeMenu, setActiveMenu] = useState('settings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    notification_email: true,
    notification_sms: false,
    notification_push: true,
    profile_visibility: 'private',
    language: 'fr',
    theme: 'system',
    two_factor_enabled: false,
  });

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
    { id: 'messages', label: 'Messages', icon: Bell, badge: '3', path: '/messages', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/profile', color: '#ff0088' }
  ];

  const settingsSections = [
    { id: "account", label: "Compte", icon: User, color: "#00d4ff" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "#ffaa00" },
    { id: "privacy", label: "Confidentialité", icon: Eye, color: "#ff0088" },
    { id: "preferences", label: "Préférences", icon: Palette, color: "#00d4ff" },
    { id: "support", label: "Aide & Support", icon: HelpCircle, color: "#0088ff" },
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
        const nameParts = data.full_name?.split(' ') || [];
        reset({
          first_name: nameParts[0] || "",
          last_name: nameParts.slice(1).join(' ') || "",
          email: data.email || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          gender: data.gender || "",
          province: data.province || "",
          city: data.city || "",
          neighborhood: data.neighborhood || "",
        });
        setAvatarUrl(data.avatar_url || "");
        setPreferences({
          notification_email: data.notification_email ?? true,
          notification_sms: data.notification_sms ?? false,
          notification_push: data.notification_push ?? true,
          profile_visibility: data.profile_visibility || 'private',
          language: data.language || 'fr',
          theme: data.theme || 'system',
          two_factor_enabled: data.two_factor_enabled ?? false,
        });
      } else {
        reset({
          first_name: (user?.user_metadata as any)?.first_name || "",
          last_name: (user?.user_metadata as any)?.last_name || "",
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
    setSaveSuccess(false);
    try {
      const fullName = `${data.first_name} ${data.last_name}`.trim();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
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

      setSaveSuccess(true);
      toast({
        title: "✓ Succès",
        description: "Votre profil a été mis à jour avec succès"
      });

      // Reset success state after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreferences = async (updates: Partial<typeof preferences>) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user?.id);

      if (error) throw error;

      setPreferences({ ...preferences, ...updates });
      
      toast({
        title: "Succès",
        description: "Préférences mises à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des préférences",
        variant: "destructive",
      });
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
        <main className="flex-1 md:ml-72 p-3 lg:p-4 pt-16 md:pt-4 min-w-0">
          <div className="space-y-3 max-w-6xl mx-auto">
            {/* Menu secondaire des sections */}
            <div className="w-full overflow-hidden">
              <div className="rounded-xl backdrop-blur-xl p-2 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                <nav className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap text-sm flex-shrink-0 ${
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
              {/* Section Compte (Profil + Sécurité) */}
              {activeSection === "account" && (
                <>
                  {/* Avatar et informations principales */}
                  <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                    <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#00d4ff' }} />
                      Photo de profil
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gradient-to-br from-[#00d4ff] to-[#0088ff] p-1">
                          <div className="w-full h-full rounded-full bg-[#1a1f2e] flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{initials}</span>
                            )}
                          </div>
                        </div>
                        <AvatarUpload
                          currentAvatarUrl={avatarUrl || undefined}
                          onAvatarUpdate={setAvatarUrl}
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                        <div className="mb-0.5">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                            {fullName.split(' ').slice(1).join(' ')}
                          </h3>
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                            {fullName.split(' ')[0]}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">{user?.email}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Membre depuis {new Date().getFullYear()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire d'informations personnelles */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                      {/* Informations personnelles */}
                      <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl h-full flex flex-col">
                        <h2 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#00d4ff' }} />
                          Informations personnelles
                        </h2>
                        <div className="space-y-2 flex-1">
                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="first_name" className="text-gray-300 text-xs flex items-center gap-1.5">
                              <User className="h-3 w-3 flex-shrink-0" />
                              Prénom *
                            </Label>
                            <Input
                              id="first_name"
                              {...register("first_name")}
                              placeholder="Votre prénom"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs w-full"
                            />
                            {errors.first_name && (
                              <p className="text-[10px] text-red-400">{errors.first_name.message}</p>
                            )}
                          </div>

                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="last_name" className="text-gray-300 text-xs flex items-center gap-1.5">
                              <User className="h-3 w-3 flex-shrink-0" />
                              Nom *
                            </Label>
                            <Input
                              id="last_name"
                              {...register("last_name")}
                              placeholder="Votre nom"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs w-full"
                            />
                            {errors.last_name && (
                              <p className="text-[10px] text-red-400">{errors.last_name.message}</p>
                            )}
                          </div>

                            <div className="grid grid-cols-2 gap-2 items-stretch">
                              <div className="space-y-1.5 w-full h-full flex flex-col">
                                <Label htmlFor="birth_date" className="text-gray-300 text-xs flex items-center gap-1.5">
                                  <Calendar className="h-3 w-3 flex-shrink-0" />
                                  Date de naissance
                                </Label>
                                <Input
                                  id="birth_date"
                                  type="date"
                                  {...register("birth_date")}
                                  className="bg-white/5 border-white/10 text-white h-8 text-xs w-full"
                                />
                              </div>

                              <div className="space-y-1.5 w-full h-full flex flex-col">
                                <Label htmlFor="gender" className="text-gray-300 text-xs">Genre</Label>
                                <Select onValueChange={(value) => setValue("gender", value)}>
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-full">
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
                      </div>

                      {/* Adresse */}
                      <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-xl h-full flex flex-col">
                        <h2 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#0088ff' }} />
                          Adresse
                        </h2>
                        <div className="space-y-2 flex-1">
                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="contact_email" className="text-gray-300 text-xs flex items-center gap-1.5">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              Email
                            </Label>
                            <Input
                              id="contact_email"
                              type="email"
                              defaultValue="iasted@me.com"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs w-full"
                            />
                          </div>

                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="contact_phone" className="text-gray-300 text-xs flex items-center gap-1.5">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              Téléphone *
                            </Label>
                            <Input
                              id="contact_phone"
                              defaultValue="+24111763101"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs w-full"
                            />
                          </div>

                            <div className="grid grid-cols-2 gap-2 items-stretch">
                              <div className="space-y-1.5 w-full h-full flex flex-col">
                                <Label htmlFor="province" className="text-gray-300 text-xs flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  Province
                                </Label>
                                <Input
                                  id="province"
                                  {...register("province")}
                                  placeholder="Ex: Estuaire"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs w-full"
                                />
                              </div>

                              <div className="space-y-1.5 w-full h-full flex flex-col">
                                <Label htmlFor="city" className="text-gray-300 text-xs">Ville</Label>
                                <Input
                                  id="city"
                                  {...register("city")}
                                  placeholder="Ex: Libreville"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs w-full"
                                />
                              </div>
                            </div>

                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="neighborhood" className="text-gray-300 text-xs">Quartier</Label>
                            <Input
                              id="neighborhood"
                              {...register("neighborhood")}
                              placeholder="Ex: Nombakele"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button
                        type="submit"
                        disabled={saving || saveSuccess}
                        className={`w-full sm:w-auto px-4 sm:px-6 h-8 sm:h-9 text-xs sm:text-sm transition-all ${
                          saveSuccess 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gradient-to-r from-[#00d4ff] to-[#0088ff] hover:from-[#00c4ef] hover:to-[#0078ef]'
                        } text-white`}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                            Enregistrement...
                          </>
                        ) : saveSuccess ? (
                          <>
                            <Check className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Sauvegardé !
                          </>
                        ) : (
                          <>
                            <Save className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Enregistrer les modifications
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Section Sécurité */}
                  <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-[#1a1f2e]/80 border border-white/10 shadow-xl mt-3">
                    <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#0088ff' }} />
                      Sécurité
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                      <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0088ff]" />
                          <h3 className="font-semibold text-white text-xs sm:text-sm">Changer le mot de passe</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Modifiez votre mot de passe pour sécuriser votre compte</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setPasswordModalOpen(true)}
                          className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-7 sm:h-8 text-[10px] sm:text-xs group"
                        >
                          <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform" />
                          Changer le mot de passe
                        </Button>
                      </div>
                      <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ffaa00] flex-shrink-0" />
                              <h3 className="font-semibold text-white text-xs sm:text-sm truncate">Authentification à deux facteurs</h3>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Protection renforcée de votre compte</p>
                          </div>
                          <Switch
                            checked={preferences.two_factor_enabled}
                            onCheckedChange={(checked) => updatePreferences({ two_factor_enabled: checked })}
                            className="flex-shrink-0"
                          />
                        </div>
                        {preferences.two_factor_enabled && (
                          <div className="flex items-center gap-1 mt-2 text-[10px] sm:text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                            <span className="truncate">2FA activé - Votre compte est protégé</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <ChangePasswordModal 
                    open={passwordModalOpen} 
                    onOpenChange={setPasswordModalOpen} 
                  />
                </>
              )}

              {/* Section Notifications */}
              {activeSection === "notifications" && (
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#ffaa00' }} />
                    Notifications
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ffaa00] flex-shrink-0" />
                          <h3 className="font-semibold text-white text-xs sm:text-sm truncate">Notifications par email</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Recevez des alertes par email pour vos rendez-vous</p>
                      </div>
                      <Switch
                        checked={preferences.notification_email}
                        onCheckedChange={(checked) => updatePreferences({ notification_email: checked })}
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0088ff] flex-shrink-0" />
                          <h3 className="font-semibold text-white text-xs sm:text-sm truncate">Notifications SMS</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Recevez des rappels par SMS</p>
                      </div>
                      <Switch
                        checked={preferences.notification_sms}
                        onCheckedChange={(checked) => updatePreferences({ notification_sms: checked })}
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Bell className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#00d4ff] flex-shrink-0" />
                          <h3 className="font-semibold text-white text-xs sm:text-sm truncate">Notifications push</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Notifications instantanées dans le navigateur</p>
                      </div>
                      <Switch
                        checked={preferences.notification_push}
                        onCheckedChange={(checked) => updatePreferences({ notification_push: checked })}
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section Confidentialité */}
              {activeSection === "privacy" && (
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#ff0088' }} />
                    Confidentialité
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                      <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ff0088] flex-shrink-0" />
                          <h3 className="font-semibold text-white text-xs sm:text-sm">Visibilité du profil</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Contrôlez qui peut voir vos informations personnelles</p>
                        <Select 
                          value={preferences.profile_visibility}
                          onValueChange={(value) => updatePreferences({ profile_visibility: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 sm:h-9 text-xs sm:text-sm w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Eye className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">Public - Visible par tous</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">Privé - Visible uniquement par vous</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="friends">
                              <div className="flex items-center gap-2">
                                <Shield className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">Contacts - Visible par vos contacts</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                    <div className="p-2.5 sm:p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-blue-400 text-xs sm:text-sm">Données médicales protégées</h3>
                          <p className="text-[10px] sm:text-xs text-gray-300 mt-1">
                            Vos données médicales sont cryptées et accessibles uniquement par vous et les professionnels de santé autorisés. Conformité RGPD garantie.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ffaa00]" />
                        <h3 className="font-semibold text-white text-xs sm:text-sm">Vos droits</h3>
                      </div>
                      <ul className="text-[10px] sm:text-xs text-gray-400 space-y-1 sm:space-y-1.5 ml-4 sm:ml-5 list-disc">
                        <li>Droit d'accès à vos données personnelles</li>
                        <li>Droit de rectification de vos informations</li>
                        <li>Droit à l'effacement (droit à l'oubli)</li>
                        <li>Droit à la portabilité de vos données</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Préférences */}
              {activeSection === "preferences" && (
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#00d4ff' }} />
                    Préférences
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#00d4ff]" />
                        <h3 className="font-semibold text-white text-xs sm:text-sm">Langue de l'application</h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Sélectionnez votre langue préférée pour l'interface</p>
                      <Select 
                        value={preferences.language}
                        onValueChange={(value) => updatePreferences({ language: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 sm:h-9 text-xs sm:text-sm w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">
                            <div className="flex items-center gap-2">
                              <span>🇫🇷 Français</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="en">
                            <div className="flex items-center gap-2">
                              <span>🇬🇧 English</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ff0088] flex-shrink-0" />
                        <h3 className="font-semibold text-white text-xs sm:text-sm">Thème de l'interface</h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Choisissez l'apparence qui vous convient</p>
                      <Select 
                        value={preferences.theme}
                        onValueChange={(value) => updatePreferences({ theme: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 sm:h-9 text-xs sm:text-sm w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">☀️ Mode Clair</SelectItem>
                          <SelectItem value="dark">🌙 Mode Sombre</SelectItem>
                          <SelectItem value="system">💻 Automatique (Système)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-[#ffaa00]/10 border border-[#ffaa00]/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ffaa00] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#ffaa00] text-xs sm:text-sm">Note</h3>
                          <p className="text-[10px] sm:text-xs text-gray-300 mt-1">
                            Les changements de préférences sont enregistrés automatiquement et prendront effet immédiatement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Aide & Support */}
              {activeSection === "support" && (
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-[#1a1f2e]/80 border border-white/10 shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#0088ff' }} />
                    Aide & Support
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-1 text-xs sm:text-sm">Contact Support</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Besoin d'aide ? Contactez notre équipe</p>
                      <div className="grid gap-1.5 sm:gap-2">
                        <Button 
                          variant="outline" 
                          className="justify-start border-white/20 text-white hover:bg-white/10 h-8 sm:h-9 text-[10px] sm:text-xs group"
                          onClick={() => {
                            navigator.clipboard.writeText('+241 11 23 45 67');
                            toast({
                              title: "✓ Copié",
                              description: "Numéro copié dans le presse-papiers"
                            });
                          }}
                        >
                          <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">+241 11 23 45 67</span>
                          <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 ml-auto opacity-50 flex-shrink-0" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start border-white/20 text-white hover:bg-white/10 h-8 sm:h-9 text-[10px] sm:text-xs group"
                          onClick={() => {
                            window.location.href = 'mailto:support@sante.ga';
                          }}
                        >
                          <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">support@sante.ga</span>
                          <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 ml-auto opacity-50 flex-shrink-0" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start border-white/20 text-white hover:bg-white/10 h-8 sm:h-9 text-[10px] sm:text-xs group"
                          onClick={() => navigate('/messages')}
                        >
                          <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">Envoyer un message</span>
                          <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 ml-auto opacity-50 flex-shrink-0" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-1 text-xs sm:text-sm">Questions Fréquentes</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Consultez notre FAQ</p>
                      <div className="space-y-1.5 sm:space-y-2 text-xs">
                        <button 
                          onClick={() => navigate('/appointments')}
                          className="w-full p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded transition-all text-left group"
                        >
                          <p className="text-white font-medium group-hover:text-[#00d4ff] transition-colors text-[10px] sm:text-xs">
                            Comment prendre un rendez-vous ?
                          </p>
                          <p className="text-gray-400 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">
                            Cliquez sur "Mes Rendez-vous" puis "Nouveau rendez-vous"
                          </p>
                        </button>
                        <button 
                          onClick={() => navigate('/reimbursements')}
                          className="w-full p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded transition-all text-left group"
                        >
                          <p className="text-white font-medium group-hover:text-[#00d4ff] transition-colors text-[10px] sm:text-xs">
                            Comment utiliser la CNAMGS ?
                          </p>
                          <p className="text-gray-400 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">
                            Présentez votre carte lors de votre consultation
                          </p>
                        </button>
                        <button 
                          onClick={() => navigate('/results')}
                          className="w-full p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded transition-all text-left group"
                        >
                          <p className="text-white font-medium group-hover:text-[#00d4ff] transition-colors text-[10px] sm:text-xs">
                            Comment accéder à mes résultats ?
                          </p>
                          <p className="text-gray-400 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">
                            Rendez-vous dans la section "Résultats d'analyses"
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-1 text-xs sm:text-sm">Ressources Utiles</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">Guides et tutoriels</p>
                      <div className="grid gap-1.5 sm:gap-2">
                        <Button 
                          variant="outline" 
                          className="justify-start border-white/20 text-white hover:bg-white/10 h-7 sm:h-8 text-[10px] sm:text-xs group"
                          onClick={() => navigate('/how-it-works')}
                        >
                          <Book className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">Guide de démarrage</span>
                          <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 ml-auto opacity-50 flex-shrink-0" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start border-white/20 text-white hover:bg-white/10 h-7 sm:h-8 text-[10px] sm:text-xs group"
                          onClick={() => navigate('/awareness')}
                        >
                          <Video className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">Tutoriels vidéos</span>
                          <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 ml-auto opacity-50 flex-shrink-0" />
                        </Button>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/messages')}
                      className="w-full p-2.5 sm:p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 hover:border-green-500/30 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <div className="flex-1 text-left min-w-0">
                          <h3 className="font-semibold text-green-400 text-xs sm:text-sm">Chat en direct disponible</h3>
                          <p className="text-[10px] sm:text-xs text-gray-300 mt-1">Notre équipe est là pour vous aider Lun-Ven 8h-18h</p>
                        </div>
                        <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </button>
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
