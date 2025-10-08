import { useAuth } from "@/contexts/AuthContext";
import { Shield, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const SuperAdminHeader = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<{
    full_name: string;
    email: string | null;
  } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, email, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfileData({
            full_name: data.full_name,
            email: data.email,
          });
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      }
    };
    loadProfile();
  }, [user?.id]);

  const fullName = profileData?.full_name || 'Super Admin';
  const email = profileData?.email || user?.email || '';

  return (
    <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-8 bg-card/80 border border-border shadow-2xl relative">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0 mx-auto sm:mx-0 relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gradient-to-br from-[#ff0088] to-[#ff0044] p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Photo de profil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-[#ff0088]" />
              )}
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="flex-1 space-y-3 sm:space-y-4">
          {/* Rôle et Nom */}
          <div className="bg-muted/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[#ff0088]" />
              <p className="text-xs sm:text-sm text-[#ff0088] font-bold uppercase tracking-wider">Super Administrateur</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{fullName}</p>
          </div>

          {/* Email */}
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Email</p>
            <p className="text-base sm:text-lg font-semibold text-foreground">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
