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
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, MapPin, Calendar, Save, Lock, Bell, Eye, Shield, Palette, Globe, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import logoSante from "@/assets/logo_sante.png";

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

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

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
        // Fallback sur les métadonnées du compte si aucun profil en base
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
      toast.error("Erreur lors du chargement du profil");
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

      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
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

  const fullName = (user?.user_metadata as any)?.full_name || user?.email || "Utilisateur";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const settingsSections = [
    { id: "profile", label: "Profil", icon: User, color: "#00d4ff" },
    { id: "security", label: "Sécurité", icon: Lock, color: "#0088ff" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "#ffaa00" },
    { id: "privacy", label: "Confidentialité", icon: Eye, color: "#ff0088" },
    { id: "preferences", label: "Préférences", icon: Palette, color: "#00d4ff" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] relative overflow-hidden">
      {/* Fond étoilé */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
        backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
      }} />

      {/* Header avec logo et retour */}
      <div className="relative z-10 p-4 sm:p-6 border-b border-white/10 backdrop-blur-xl bg-[#1a1f2e]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard/patient')}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src={logoSante} alt="SANTE.GA" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-white">Paramètres</h1>
                <p className="text-xs text-gray-400">Gérez votre compte</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menu latéral */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl backdrop-blur-xl p-4 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl sticky top-6">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isActive ? '' : 'bg-white/5'
                        }`}
                        style={isActive ? { backgroundColor: `${section.color}20` } : {}}
                      >
                        <Icon className="w-5 h-5" style={{ color: isActive ? section.color : '' }} />
                      </div>
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section Profil */}
            {activeSection === "profile" && (
              <>
                {/* Avatar et informations principales */}
                <div className="rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" style={{ color: '#00d4ff' }} />
                    Photo de profil
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#00d4ff] to-[#0088ff] p-1">
                        <div className="w-full h-full rounded-full bg-[#1a1f2e] flex items-center justify-center overflow-hidden">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl font-bold text-white">{initials}</span>
                          )}
                        </div>
                      </div>
                      <AvatarUpload
                        currentAvatarUrl={avatarUrl || undefined}
                        onAvatarUpdate={setAvatarUrl}
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-white mb-1">{fullName}</h3>
                      <p className="text-gray-400">{user?.email}</p>
                      <p className="text-sm text-gray-500 mt-2">Membre depuis {new Date().getFullYear()}</p>
                    </div>
                  </div>
                </div>

                {/* Formulaire d'informations personnelles */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <User className="w-5 h-5" style={{ color: '#00d4ff' }} />
                      Informations personnelles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-gray-300">
                          <User className="inline h-4 w-4 mr-2" />
                          Nom complet *
                        </Label>
                        <Input
                          id="full_name"
                          {...register("full_name")}
                          placeholder="Votre nom complet"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.full_name && (
                          <p className="text-sm text-red-400">{errors.full_name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          <Mail className="inline h-4 w-4 mr-2" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="votre@email.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-400">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">
                          <Phone className="inline h-4 w-4 mr-2" />
                          Téléphone *
                        </Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          placeholder="+241 XX XX XX XX"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-400">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birth_date" className="text-gray-300">
                          <Calendar className="inline h-4 w-4 mr-2" />
                          Date de naissance
                        </Label>
                        <Input
                          id="birth_date"
                          type="date"
                          {...register("birth_date")}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-gray-300">Genre</Label>
                        <Select onValueChange={(value) => setValue("gender", value)}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
                  <div className="rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl mt-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5" style={{ color: '#0088ff' }} />
                      Adresse
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="province" className="text-gray-300">
                          <MapPin className="inline h-4 w-4 mr-2" />
                          Province
                        </Label>
                        <Input
                          id="province"
                          {...register("province")}
                          placeholder="Ex: Estuaire"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-gray-300">Ville</Label>
                        <Input
                          id="city"
                          {...register("city")}
                          placeholder="Ex: Libreville"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="neighborhood" className="text-gray-300">Quartier</Label>
                        <Input
                          id="neighborhood"
                          {...register("neighborhood")}
                          placeholder="Ex: Nombakele"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-[#00d4ff] to-[#0088ff] hover:from-[#00c4ef] hover:to-[#0078ef] text-white px-8"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
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
              <div className="rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5" style={{ color: '#0088ff' }} />
                  Sécurité
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="font-semibold text-white mb-2">Changer le mot de passe</h3>
                    <p className="text-sm text-gray-400 mb-4">Modifiez votre mot de passe pour sécuriser votre compte</p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Changer le mot de passe
                    </Button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="font-semibold text-white mb-2">Authentification à deux facteurs</h3>
                    <p className="text-sm text-gray-400 mb-4">Ajoutez une couche de sécurité supplémentaire</p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Activer 2FA
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Section Notifications */}
            {activeSection === "notifications" && (
              <div className="rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5" style={{ color: '#ffaa00' }} />
                  Notifications
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">Configuration des notifications à venir...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Section Confidentialité */}
            {activeSection === "privacy" && (
              <div className="rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5" style={{ color: '#ff0088' }} />
                  Confidentialité
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">Paramètres de confidentialité à venir...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Section Préférences */}
            {activeSection === "preferences" && (
              <div className="rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5" style={{ color: '#00d4ff' }} />
                  Préférences
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">Préférences de l'application à venir...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
