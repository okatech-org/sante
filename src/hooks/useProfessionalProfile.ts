import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfessionalProfile {
  id: string;
  user_id: string;
  profession_type: string;
  specialization?: string;
  ordre_number?: string;
  ordre_verified: boolean;
  years_experience?: number;
  diplomas: any[];
  bio?: string;
  consultation_fee?: number;
  created_at: string;
  updated_at: string;
}

interface UseProfessionalProfileReturn {
  profile: ProfessionalProfile | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  refetch: () => Promise<void>;
  createProfile: (profileData: Partial<ProfessionalProfile>) => Promise<boolean>;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Délais en millisecondes

export const useProfessionalProfile = (): UseProfessionalProfileReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const fetchProfile = useCallback(async (attempt: number = 0): Promise<void> => {
    if (!user?.id || !isMountedRef.current) return;

    try {
      setError(null);
      
      // Essayer d'abord professional_profiles avec maybeSingle pour éviter le 406
      let { data, error: profileError } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Si pas de profil trouvé, créer automatiquement un profil professionnel
      if (!data && !profileError) {
        console.log('Aucun profil professionnel trouvé, création automatique...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('professional_profiles')
          .insert({
            user_id: user.id,
            profession_type: 'doctor',
            ordre_verified: false
          })
          .select('*')
          .single();

        if (createError) {
          // Si la création échoue (table n'existe pas), essayer professionals
          console.log('Création dans professional_profiles échouée, tentative avec professionals...');
          
          const { data: professionalData, error: professionalError } = await supabase
            .from('professionals')
            .select('id, user_id, professional_type, numero_ordre, verified, created_at, updated_at')
            .eq('user_id', user.id)
            .maybeSingle();

          if (professionalError) {
            throw professionalError;
          }

          if (professionalData) {
            // Convertir les données de professionals vers le format professional_profiles
            data = {
              id: professionalData.id,
              user_id: professionalData.user_id,
              profession_type: professionalData.professional_type || 'doctor',
              ordre_number: professionalData.numero_ordre,
              ordre_verified: professionalData.verified || false,
              years_experience: null,
              diplomas: [],
              bio: null,
              consultation_fee: null,
              created_at: professionalData.created_at,
              updated_at: professionalData.updated_at
            };
          }
        } else {
          data = newProfile;
        }
      } else if (profileError) {
        throw profileError;
      }

      if (isMountedRef.current) {
        setProfile(data);
        setRetryCount(0);
        setLoading(false);
      }

    } catch (err: any) {
      console.error(`Tentative ${attempt + 1} échouée:`, err);
      
      if (isMountedRef.current) {
        setError(err.message);
        
        // Si c'est la dernière tentative, arrêter
        if (attempt >= MAX_RETRIES - 1) {
          setLoading(false);
          console.error('Nombre maximum de tentatives atteint');
          return;
        }

        // Programmer la prochaine tentative avec backoff exponentiel
        const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        setRetryCount(attempt + 1);
        
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchProfile(attempt + 1);
          }
        }, delay);
      }
    }
  }, [user?.id]);

  const refetch = useCallback(async (): Promise<void> => {
    clearRetryTimeout();
    setRetryCount(0);
    setLoading(true);
    setError(null);
    await fetchProfile(0);
  }, [fetchProfile, clearRetryTimeout]);

  const createProfile = useCallback(async (profileData: Partial<ProfessionalProfile>): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const newProfile = {
        user_id: user.id,
        profession_type: profileData.profession_type || 'doctor',
        specialization: profileData.specialization,
        ordre_number: profileData.ordre_number,
        ordre_verified: profileData.ordre_verified || false,
        years_experience: profileData.years_experience,
        diplomas: profileData.diplomas || [],
        bio: profileData.bio,
        consultation_fee: profileData.consultation_fee,
        ...profileData
      };

      const { data, error } = await supabase
        .from('professional_profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        // Si la table n'existe pas, essayer de créer dans professionals
        if (error.code === 'PGRST116' || error.message.includes('406')) {
          const { data: professionalData, error: professionalError } = await supabase
            .from('professionals')
            .insert({
              user_id: user.id,
              professional_type: newProfile.profession_type,
              numero_ordre: newProfile.ordre_number,
              verified: newProfile.ordre_verified,
              full_name: user.user_metadata?.full_name || 'Professionnel',
              email: user.email || '',
              phone: user.user_metadata?.phone || '',
              status: 'en_validation'
            })
            .select()
            .single();

          if (professionalError) throw professionalError;
          
          if (isMountedRef.current) {
            setProfile({
              id: professionalData.id,
              user_id: professionalData.user_id,
              profession_type: professionalData.professional_type,
              ordre_number: professionalData.numero_ordre,
              ordre_verified: professionalData.verified || false,
              years_experience: null,
              diplomas: [],
              bio: null,
              consultation_fee: null,
              created_at: professionalData.created_at,
              updated_at: professionalData.updated_at
            });
          }
        } else {
          throw error;
        }
      } else {
        if (isMountedRef.current) {
          setProfile(data);
        }
      }

      return true;
    } catch (err: any) {
      console.error('Erreur lors de la création du profil:', err);
      if (isMountedRef.current) {
        setError(err.message);
      }
      return false;
    }
  }, [user?.id, user?.email, user?.user_metadata]);

  // Effet pour charger le profil au montage
  useEffect(() => {
    if (user?.id) {
      fetchProfile(0);
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
      setRetryCount(0);
    }

    return () => {
      clearRetryTimeout();
    };
  }, [user?.id, fetchProfile, clearRetryTimeout]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearRetryTimeout();
    };
  }, [clearRetryTimeout]);

  return {
    profile,
    loading,
    error,
    retryCount,
    refetch,
    createProfile
  };
};

export default useProfessionalProfile;
