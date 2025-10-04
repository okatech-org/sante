import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

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
        .single();

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
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const initials = user?.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground mt-1">Gérez vos informations personnelles</p>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
              <CardDescription>Votre avatar sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    La gestion des avatars sera disponible prochainement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations de base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">
                      <User className="inline h-4 w-4 mr-2" />
                      Nom complet *
                    </Label>
                    <Input
                      id="full_name"
                      {...register("full_name")}
                      placeholder="Votre nom complet"
                    />
                    {errors.full_name && (
                      <p className="text-sm text-destructive">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+241 XX XX XX XX"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_date">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Date de naissance
                    </Label>
                    <Input
                      id="birth_date"
                      type="date"
                      {...register("birth_date")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre</Label>
                    <Select onValueChange={(value) => setValue("gender", value)}>
                      <SelectTrigger>
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
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Adresse</CardTitle>
                <CardDescription>Vos informations de localisation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Province
                    </Label>
                    <Input
                      id="province"
                      {...register("province")}
                      placeholder="Ex: Estuaire"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Ex: Libreville"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="neighborhood">Quartier</Label>
                    <Input
                      id="neighborhood"
                      {...register("neighborhood")}
                      placeholder="Ex: Nombakele"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
