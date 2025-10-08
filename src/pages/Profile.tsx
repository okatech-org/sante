import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { Loader2, User, Mail, Phone, MapPin, Calendar, Save, Lock, Bell, Eye, Shield, Palette, HelpCircle, MessageCircle, Book, Check, AlertCircle, ExternalLink, Video, Sun, Moon } from "lucide-react";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

const profileSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  birth_date: z.string().optional(),
  birth_place: z.string().optional(),
  gender: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  weight_kg: z.string().optional(),
  height_m: z.string().optional(),
  blood_group: z.string().optional(),
  cnamgs_number: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [activeSection, setActiveSection] = useState("account");
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

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const genderValue = watch("gender");
  const bloodGroupValue = watch("blood_group");
  const firstName = watch("first_name");
  const lastName = watch("last_name");
  const currentEmail = watch("email");

  const fullName = (user?.user_metadata as any)?.full_name || user?.email || "Utilisateur";
  const fullNameParts = fullName.split(' ').filter(Boolean);
  const fallbackFirstNames = fullNameParts.slice(0, -1).join(' ') || fullNameParts[0] || "";
  const fallbackLastName = fullNameParts.length > 1 ? fullNameParts[fullNameParts.length - 1] : "";
  const displayFirstName = firstName || fallbackFirstNames;
  const displayLastName = lastName || fallbackLastName;
  const displayFullName = `${displayFirstName} ${displayLastName}`.trim() || fullName;
  const displayEmail = currentEmail || user?.email || "";

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

      console.log("Profile data from DB:", data);
      console.log("User metadata:", user?.user_metadata);

      if (error) throw error;

      if (data) {
        const nameParts = (data.full_name || "").split(' ').filter(Boolean);
        const firstNames = nameParts.slice(0, -1).join(' ');
        const lastNameOnly = nameParts.length > 0 ? nameParts[nameParts.length - 1] : "";
        console.log("Full name from DB:", data.full_name);
        console.log("Parsed -> firstNames:", firstNames, "lastName:", lastNameOnly);
        
        reset({
          first_name: firstNames || "",
          last_name: lastNameOnly || "",
          email: data.email || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          birth_place: data.birth_place || "",
          gender: data.gender || "",
          province: data.province || "",
          city: data.city || "",
          neighborhood: data.neighborhood || "",
          weight_kg: data.weight_kg?.toString() || "",
          height_m: data.height_m?.toString() || "",
          blood_group: data.blood_group || "",
          cnamgs_number: data.cnamgs_number || "",
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
        console.log("No profile data found, using user metadata");
        const metaFull = (user?.user_metadata as any)?.full_name || "";
        const metaParts = metaFull.split(' ').filter(Boolean);
        const metaFirstNames = metaParts.slice(0, -1).join(' ');
        const metaLastName = metaParts.length > 0 ? metaParts[metaParts.length - 1] : "";
        reset({
          first_name: metaFirstNames || (user?.user_metadata as any)?.first_name || "",
          last_name: metaLastName || (user?.user_metadata as any)?.last_name || "",
          email: user?.email || "",
          phone: (user?.user_metadata as any)?.phone || "",
          birth_date: "",
          birth_place: "",
          gender: "",
          province: "",
          city: "",
          neighborhood: "",
          weight_kg: "",
          height_m: "",
          blood_group: "",
          cnamgs_number: "",
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
          birth_place: data.birth_place || null,
          gender: data.gender || null,
          province: data.province || null,
          city: data.city || null,
          neighborhood: data.neighborhood || null,
          weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
          height_m: data.height_m ? parseFloat(data.height_m) : null,
          blood_group: data.blood_group || null,
          cnamgs_number: data.cnamgs_number || null,
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
      
      // Update language and theme if changed
      if (updates.language) {
        setLanguage(updates.language as 'fr' | 'en' | 'es' | 'ar' | 'pt');
      }
      if (updates.theme) {
        setTheme(updates.theme);
      }
      
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
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PatientDashboardLayout>
    );
  }

  const initials = displayFullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <PatientDashboardLayout>
      <div className="space-y-2 sm:space-y-3 w-full">
            {/* Menu secondaire des sections */}
            <div className="w-full overflow-hidden">
              <div className="rounded-lg sm:rounded-xl backdrop-blur-xl p-0.5 sm:p-1 md:p-1.5 bg-card border border-border shadow-lg">
                <nav className="flex gap-0.5 sm:gap-1 md:gap-1.5 overflow-x-auto scrollbar-hide">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-2.5 md:px-3.5 py-1.5 sm:py-2 md:py-2 rounded-md sm:rounded-lg transition-all whitespace-nowrap flex-shrink-0 min-w-[60px] sm:min-w-0 ${
                          isActive ? 'bg-accent text-accent-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground font-medium'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                            isActive ? '' : 'bg-muted'
                          }`}
                          style={isActive ? { backgroundColor: `${section.color}20` } : {}}
                        >
                          <Icon className="w-3 h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" style={{ color: isActive ? section.color : '' }} />
                        </div>
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs tracking-tight truncate max-w-[60px] sm:max-w-[70px] md:max-w-[90px] lg:max-w-none text-center sm:text-left">
                          {section.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="space-y-2 sm:space-y-3">
              {/* Section Compte (Profil + Sécurité) */}
              {activeSection === "account" && (
                <>
                  {/* Avatar et informations principales */}
                  <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-card/95 border border-border/50 shadow-lg hover:shadow-xl transition-all">
                    <h2 className="text-xs sm:text-sm lg:text-base font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4 lg:h-4" style={{ color: '#00d4ff' }} />
                      Photo de profil
                    </h2>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/70 p-[2px] ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                          <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{initials}</span>
                            )}
                          </div>
                        </div>
                        <AvatarUpload
                          currentAvatarUrl={avatarUrl || undefined}
                          onAvatarUpdate={setAvatarUrl}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground truncate">
                            {displayLastName}
                          </h3>
                          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground/80 truncate">
                            {displayFirstName}
                          </h3>
                        </div>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate flex items-center gap-1.5">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          {displayEmail}
                        </p>
                        <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          Membre depuis {new Date().getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire d'informations personnelles */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                      {/* Informations personnelles - Optimisé mobile */}
                      <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 bg-card/95 border border-border/50 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                        <h2 className="text-xs sm:text-sm font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#00d4ff' }} />
                          Informations personnelles
                        </h2>
                        <div className="space-y-2.5 sm:space-y-2 flex-1">
                          <div className="grid grid-cols-3 gap-2 items-stretch">
                            <div className="space-y-1 w-full h-full flex flex-col col-span-1">
                              <Label htmlFor="gender" className="text-muted-foreground text-[10px] sm:text-xs flex items-center gap-1">
                                <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                Genre
                              </Label>
                              <Select 
                                value={genderValue || ""}
                                onValueChange={(value) => setValue("gender", value)}
                              >
                                <SelectTrigger className="bg-muted/50 border-border text-foreground h-9 sm:h-8 text-[11px] sm:text-xs w-full touch-manipulation">
                                  <SelectValue placeholder="Genre" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Homme</SelectItem>
                                  <SelectItem value="female">Femme</SelectItem>
                                  <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1 w-full h-full flex flex-col col-span-2">
                              <Label htmlFor="last_name" className="text-muted-foreground text-[10px] sm:text-xs flex items-center gap-1">
                                <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                Nom *
                              </Label>
                              <Input
                                id="last_name"
                                {...register("last_name")}
                                placeholder="Votre nom"
                                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-9 sm:h-8 text-[11px] sm:text-xs w-full touch-manipulation transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                              {errors.last_name && (
                                <p className="text-[9px] sm:text-[10px] text-destructive animate-in slide-in-from-top-1">{errors.last_name.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="first_name" className="text-muted-foreground text-[10px] sm:text-xs flex items-center gap-1">
                              <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                              Prénom *
                            </Label>
                            <Input
                              id="first_name"
                              {...register("first_name")}
                              placeholder="Votre prénom"
                              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-9 sm:h-8 text-[11px] sm:text-xs w-full touch-manipulation transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            {errors.first_name && (
                              <p className="text-[9px] sm:text-[10px] text-destructive animate-in slide-in-from-top-1">{errors.first_name.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 items-stretch">
                            <div className="space-y-1 w-full h-full flex flex-col">
                              <Label htmlFor="birth_date" className="text-muted-foreground text-[10px] sm:text-xs flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                Date de naissance
                              </Label>
                              <Input
                                id="birth_date"
                                type="date"
                                {...register("birth_date")}
                                className="bg-muted/50 border-border text-foreground h-9 sm:h-8 text-[11px] sm:text-xs w-full touch-manipulation transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>

                            <div className="space-y-1 w-full h-full flex flex-col">
                              <Label htmlFor="birth_place" className="text-muted-foreground text-[10px] sm:text-xs flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                Lieu de naissance
                              </Label>
                              <Input
                                id="birth_place"
                                {...register("birth_place")}
                                placeholder="Selon attestation"
                                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-9 sm:h-8 text-[11px] sm:text-xs w-full touch-manipulation transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                          </div>

                            {/* Informations médicales */}
                            <div className="pt-2 mt-2 border-t border-border">
                              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                                <User className="h-3 w-3 flex-shrink-0" />
                                Informations médicales
                              </h3>
                              
                              <div className="grid grid-cols-3 gap-2 items-stretch">
                                <div className="space-y-1.5 w-full h-full flex flex-col">
                                  <Label htmlFor="weight_kg" className="text-muted-foreground text-xs">
                                    Poids (kg)
                                  </Label>
                                  <Input
                                    id="weight_kg"
                                    type="number"
                                    step="0.1"
                                    {...register("weight_kg")}
                                    placeholder="78"
                                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                                  />
                                </div>

                                <div className="space-y-1.5 w-full h-full flex flex-col">
                                  <Label htmlFor="height_m" className="text-muted-foreground text-xs">
                                    Taille (m)
                                  </Label>
                                  <Input
                                    id="height_m"
                                    type="number"
                                    step="0.01"
                                    {...register("height_m")}
                                    placeholder="1.75"
                                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                                  />
                                </div>

                                <div className="space-y-1.5 w-full h-full flex flex-col">
                                  <Label htmlFor="blood_group" className="text-muted-foreground text-xs">
                                    Groupe
                                  </Label>
                                  <Select 
                                    value={bloodGroupValue || ""}
                                    onValueChange={(value) => setValue("blood_group", value)}
                                  >
                                    <SelectTrigger className="bg-muted border-border text-foreground h-8 text-xs w-full">
                                      <SelectValue placeholder="O+" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="A+">A+</SelectItem>
                                      <SelectItem value="A-">A-</SelectItem>
                                      <SelectItem value="B+">B+</SelectItem>
                                      <SelectItem value="B-">B-</SelectItem>
                                      <SelectItem value="AB+">AB+</SelectItem>
                                      <SelectItem value="AB-">AB-</SelectItem>
                                      <SelectItem value="O+">O+</SelectItem>
                                      <SelectItem value="O-">O-</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>

                      {/* Adresse */}
                      <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 bg-card border border-border shadow-xl h-full flex flex-col">
                        <h2 className="text-sm sm:text-base font-bold text-foreground mb-3 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#0088ff' }} />
                          Adresse
                        </h2>
                        <div className="space-y-2 flex-1">
                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="email" className="text-muted-foreground text-xs flex items-center gap-1.5">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              {...register("email")}
                              placeholder="exemple@email.com"
                              className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                            />
                            {errors.email && (
                              <p className="text-[10px] text-red-400">{errors.email.message}</p>
                            )}
                          </div>

                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="phone" className="text-muted-foreground text-xs flex items-center gap-1.5">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              Téléphone *
                            </Label>
                            <Input
                              id="phone"
                              {...register("phone")}
                              placeholder="+241 XX XX XX XX"
                              className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                            />
                            {errors.phone && (
                              <p className="text-[10px] text-red-400">{errors.phone.message}</p>
                            )}
                          </div>

                            <div className="grid grid-cols-2 gap-2 items-stretch">
                              <div className="space-y-1.5 w-full h-full flex flex-col">
                                <Label htmlFor="province" className="text-muted-foreground text-xs flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  Province
                                </Label>
                                <Input
                                  id="province"
                                  {...register("province")}
                                  placeholder="Ex: Estuaire"
                                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                                />
                              </div>

                              <div className="space-y-1.5 w-full h-full flex flex-col">
                                <Label htmlFor="city" className="text-muted-foreground text-xs">Ville</Label>
                                <Input
                                  id="city"
                                  {...register("city")}
                                  placeholder="Ex: Libreville"
                                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                                />
                              </div>
                            </div>

                          <div className="space-y-1.5 w-full">
                            <Label htmlFor="neighborhood" className="text-muted-foreground text-xs">Quartier</Label>
                            <Input
                              id="neighborhood"
                              {...register("neighborhood")}
                              placeholder="Ex: Nombakele"
                              className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bloc CNAMGS indépendant */}
                    <div className="rounded-xl backdrop-blur-xl p-3 bg-card border border-border shadow-xl mt-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold text-foreground flex items-center gap-2 whitespace-nowrap">
                          <Shield className="w-3.5 h-3.5" style={{ color: '#00d4ff' }} />
                          Assurance CNAMGS
                        </h2>
                        <div className="flex-1">
                          <Input
                            id="cnamgs_number"
                            {...register("cnamgs_number")}
                            placeholder="GA2384567891"
                            className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-8 text-xs w-full"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                          Saisissez votre numéro d'assuré pour faciliter vos remboursements
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button
                        type="submit"
                        disabled={saving || saveSuccess}
                        className={`w-full sm:w-auto px-6 sm:px-8 h-11 sm:h-10 text-sm sm:text-sm font-semibold transition-all touch-manipulation active:scale-95 ${
                          saveSuccess 
                            ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20' 
                            : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20'
                        } text-primary-foreground`}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span className="animate-pulse">Enregistrement...</span>
                          </>
                        ) : saveSuccess ? (
                          <>
                            <Check className="mr-2 h-4 w-4 animate-in zoom-in" />
                            <span>Sauvegardé !</span>
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Enregistrer les modifications</span>
                            <span className="sm:hidden">Enregistrer</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Section Sécurité */}
                  <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-card border border-border shadow-xl mt-3">
                    <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#0088ff' }} />
                      Sécurité
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0088ff]" />
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm">Changer le mot de passe</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">Modifiez votre mot de passe pour sécuriser votre compte</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setPasswordModalOpen(true)}
                          className="w-full sm:w-auto border-border text-foreground hover:bg-accent h-7 sm:h-8 text-[10px] sm:text-xs group"
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
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-card border border-border shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#ffaa00' }} />
                    Notifications
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg flex items-center justify-between hover:bg-accent/50 transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ffaa00] flex-shrink-0" />
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate">Notifications par email</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Recevez des alertes par email pour vos rendez-vous</p>
                      </div>
                      <Switch
                        checked={preferences.notification_email}
                        onCheckedChange={(checked) => updatePreferences({ notification_email: checked })}
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg flex items-center justify-between hover:bg-accent/50 transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0088ff] flex-shrink-0" />
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate">Notifications SMS</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Recevez des rappels par SMS</p>
                      </div>
                      <Switch
                        checked={preferences.notification_sms}
                        onCheckedChange={(checked) => updatePreferences({ notification_sms: checked })}
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg flex items-center justify-between hover:bg-accent/50 transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Bell className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#00d4ff] flex-shrink-0" />
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate">Notifications push</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Notifications instantanées dans le navigateur</p>
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
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-card border border-border shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#ff0088' }} />
                    Confidentialité
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ff0088] flex-shrink-0" />
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm">Visibilité du profil</h3>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">Contrôlez qui peut voir vos informations personnelles</p>
                        <Select 
                          value={preferences.profile_visibility}
                          onValueChange={(value) => updatePreferences({ profile_visibility: value })}
                        >
                          <SelectTrigger className="bg-muted border-border text-foreground h-8 sm:h-9 text-xs sm:text-sm w-full">
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
                          <p className="text-[10px] sm:text-xs text-foreground mt-1">
                            Vos données médicales sont cryptées et accessibles uniquement par vous et les professionnels de santé autorisés. Conformité RGPD garantie.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#ffaa00]" />
                        <h3 className="font-semibold text-foreground text-xs sm:text-sm">Vos droits</h3>
                      </div>
                      <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-1 sm:space-y-1.5 ml-4 sm:ml-5 list-disc">
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
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-card border border-border shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#00d4ff' }} />
                    Préférences
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#00d4ff]" />
                        <h3 className="font-semibold text-foreground text-xs sm:text-sm">Langue de l'application</h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">Sélectionnez votre langue préférée pour l'interface</p>
                      <Select 
                        value={preferences.language}
                        onValueChange={(value) => updatePreferences({ language: value })}
                      >
                        <SelectTrigger className="bg-muted border-border text-foreground h-8 sm:h-9 text-xs sm:text-sm w-full">
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

                    <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg hover:bg-accent/30 transition-all duration-300 group">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-foreground text-xs sm:text-sm">Thème de l'interface</h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-3">Choisissez l'apparence qui vous convient</p>
                      
                      {/* Aperçu visuel des thèmes - Optimisé tactile */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => updatePreferences({ theme: 'light' })}
                          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 touch-manipulation active:scale-95 group/theme ${
                            preferences.theme === 'light' 
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105' 
                              : 'border-border hover:border-primary/50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 flex items-center justify-center shadow-inner group-hover/theme:scale-110 transition-transform">
                              <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-in spin-in-180 duration-500" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-foreground">Clair</span>
                          </div>
                          {preferences.theme === 'light' && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" strokeWidth={3} />
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => updatePreferences({ theme: 'dark' })}
                          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 touch-manipulation active:scale-95 group/theme ${
                            preferences.theme === 'dark' 
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105' 
                              : 'border-border hover:border-primary/50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-inner group-hover/theme:scale-110 transition-transform">
                              <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-in spin-in-180 duration-500" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-foreground">Sombre</span>
                          </div>
                          {preferences.theme === 'dark' && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" strokeWidth={3} />
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => updatePreferences({ theme: 'system' })}
                          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 touch-manipulation active:scale-95 group/theme ${
                            preferences.theme === 'system' 
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105' 
                              : 'border-border hover:border-primary/50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 border border-slate-400 flex items-center justify-center shadow-inner group-hover/theme:scale-110 transition-transform">
                              <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md animate-in spin-in-180 duration-500" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-foreground text-center leading-tight">Auto</span>
                          </div>
                          {preferences.theme === 'system' && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Description animée du thème actif */}
                      <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="text-[10px] sm:text-xs text-foreground text-center leading-relaxed">
                          {preferences.theme === 'light' && (
                            <span className="flex items-center justify-center gap-1.5">
                              <Sun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              Interface lumineuse pour environnements bien éclairés
                            </span>
                          )}
                          {preferences.theme === 'dark' && (
                            <span className="flex items-center justify-center gap-1.5">
                              <Moon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                              Interface sombre pour réduire la fatigue oculaire
                            </span>
                          )}
                          {preferences.theme === 'system' && (
                            <span className="flex items-center justify-center gap-1.5">
                              <Palette className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              S'adapte aux préférences de votre appareil
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-[#ffaa00]/10 border border-[#ffaa00]/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ffaa00] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#ffaa00] text-xs sm:text-sm">Note</h3>
                          <p className="text-[10px] sm:text-xs text-foreground mt-1">
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
                <div className="rounded-xl backdrop-blur-xl p-3 sm:p-4 lg:p-5 bg-card border border-border shadow-xl">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#0088ff' }} />
                    Aide & Support
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <h3 className="font-semibold text-foreground mb-1 text-xs sm:text-sm">Contact Support</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">Besoin d'aide ? Contactez notre équipe</p>
                      <div className="grid gap-1.5 sm:gap-2">
                        <Button 
                          variant="outline" 
                          className="justify-start border-border text-foreground hover:bg-accent h-8 sm:h-9 text-[10px] sm:text-xs group"
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
                          className="justify-start border-border text-foreground hover:bg-accent h-8 sm:h-9 text-[10px] sm:text-xs group"
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
                          className="justify-start border-border text-foreground hover:bg-accent h-8 sm:h-9 text-[10px] sm:text-xs group"
                          onClick={() => navigate('/messages')}
                        >
                          <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">Envoyer un message</span>
                          <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 ml-auto opacity-50 flex-shrink-0" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <h3 className="font-semibold text-foreground mb-1 text-xs sm:text-sm">Questions Fréquentes</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">Consultez notre FAQ</p>
                      <div className="space-y-1.5 sm:space-y-2 text-xs">
                        <button 
                          onClick={() => navigate('/appointments')}
                          className="w-full p-2 sm:p-2.5 bg-muted hover:bg-accent/50 rounded transition-all text-left group"
                        >
                          <p className="text-foreground font-medium group-hover:text-primary transition-colors text-[10px] sm:text-xs">
                            Comment prendre un rendez-vous ?
                          </p>
                          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">
                            Cliquez sur "Mes Rendez-vous" puis "Nouveau rendez-vous"
                          </p>
                        </button>
                        <button 
                          onClick={() => navigate('/reimbursements')}
                          className="w-full p-2 sm:p-2.5 bg-muted hover:bg-accent/50 rounded transition-all text-left group"
                        >
                          <p className="text-foreground font-medium group-hover:text-primary transition-colors text-[10px] sm:text-xs">
                            Comment utiliser la CNAMGS ?
                          </p>
                          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">
                            Présentez votre carte lors de votre consultation
                          </p>
                        </button>
                        <button 
                          onClick={() => navigate('/results')}
                          className="w-full p-2 sm:p-2.5 bg-muted hover:bg-accent/50 rounded transition-all text-left group"
                        >
                          <p className="text-foreground font-medium group-hover:text-primary transition-colors text-[10px] sm:text-xs">
                            Comment accéder à mes résultats ?
                          </p>
                          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">
                            Rendez-vous dans la section "Résultats d'analyses"
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <h3 className="font-semibold text-foreground mb-1 text-xs sm:text-sm">Ressources Utiles</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">Guides et tutoriels</p>
                      <div className="grid gap-1.5 sm:gap-2">
                        <Button 
                          variant="outline" 
                          className="justify-start border-border text-foreground hover:bg-accent h-7 sm:h-8 text-[10px] sm:text-xs group"
                          onClick={() => navigate('/how-it-works')}
                        >
                          <Book className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <span className="truncate">Guide de démarrage</span>
                          <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 ml-auto opacity-50 flex-shrink-0" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start border-border text-foreground hover:bg-accent h-7 sm:h-8 text-[10px] sm:text-xs group"
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
                          <p className="text-[10px] sm:text-xs text-foreground mt-1">Notre équipe est là pour vous aider Lun-Ven 8h-18h</p>
                        </div>
                        <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PatientDashboardLayout>
      );
    }
