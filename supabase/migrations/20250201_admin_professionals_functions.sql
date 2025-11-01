-- ============================================
-- Migration: Fonctions RPC admin pour professionnels
-- Date: 2025-02-01
-- Description: Fonctions pour admin_get_professionals_with_profiles
-- ============================================

-- Fonction RPC pour récupérer tous les professionnels avec leurs profils
CREATE OR REPLACE FUNCTION public.admin_get_professionals_with_profiles()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    professional_type TEXT,
    specialization TEXT,
    numero_ordre TEXT,
    verified BOOLEAN,
    status TEXT,
    created_at TIMESTAMPTZ,
    profile_full_name TEXT,
    profile_email TEXT,
    profile_phone TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        p.id,
        p.user_id,
        p.full_name,
        p.email,
        p.phone,
        p.professional_type,
        p.specialization,
        p.numero_ordre,
        p.verified,
        p.status,
        p.created_at,
        pr.full_name AS profile_full_name,
        pr.email AS profile_email,
        pr.phone AS profile_phone
    FROM public.professionals p
    LEFT JOIN public.profiles pr ON pr.id = p.user_id
    ORDER BY p.created_at DESC;
$$;

-- Créer la table professional_profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    specialization TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id),
    UNIQUE(professional_id)
);

-- RLS pour professional_profiles
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own professional profile"
    ON public.professional_profiles
    FOR SELECT
    USING (user_id = auth.uid());

-- Policy: Les utilisateurs peuvent insérer leur profil
CREATE POLICY "Users can insert own professional profile"
    ON public.professional_profiles
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Policy: Les utilisateurs peuvent mettre à jour leur profil
CREATE POLICY "Users can update own professional profile"
    ON public.professional_profiles
    FOR UPDATE
    USING (user_id = auth.uid());

-- Grant permissions
GRANT SELECT ON public.professional_profiles TO authenticated;
GRANT INSERT ON public.professional_profiles TO authenticated;
GRANT UPDATE ON public.professional_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_professionals_with_profiles TO authenticated;

-- Commentaires
COMMENT ON FUNCTION public.admin_get_professionals_with_profiles IS 'Récupère tous les professionnels avec leurs profils pour l''administration';
COMMENT ON TABLE public.professional_profiles IS 'Profils étendus des professionnels de santé';

