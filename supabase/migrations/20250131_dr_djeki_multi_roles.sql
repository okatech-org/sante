-- ============================================
-- Migration: Configuration multi-rôles Dr. Jules DJEKI
-- Date: 2025-01-31
-- Description: Permet au Dr. DJEKI de basculer entre DIRECTEUR et MÉDECIN
-- ============================================

-- 1. Vérifier/Créer le profil professionnel si pas existant
DO $$
DECLARE
    v_user_id UUID;
    v_professional_id UUID;
    v_establishment_id UUID;
BEGIN
    -- Récupérer l'ID utilisateur
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'directeur.sogara@sante.ga';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Utilisateur directeur.sogara@sante.ga non trouvé';
        RETURN;
    END IF;

    -- Récupérer ou créer le profil professionnel
    SELECT id INTO v_professional_id
    FROM public.professionals
    WHERE user_id = v_user_id;
    
    IF v_professional_id IS NULL THEN
        INSERT INTO public.professionals (
            user_id,
            full_name,
            email,
            phone,
            professional_type,
            numero_ordre,
            profession_type,
            specialization,
            verified,
            status
        ) VALUES (
            v_user_id,
            'Dr. Jules DJEKI',
            'directeur.sogara@sante.ga',
            '+241 07 XX XX XX',
            'medecin_generaliste',
            'DIR-001',
            'doctor',
            'Médecine Générale',
            true,
            'actif'
        ) RETURNING id INTO v_professional_id;
    END IF;

    -- Récupérer l'établissement CMST SOGARA
    SELECT id INTO v_establishment_id
    FROM public.establishments
    WHERE name ILIKE '%CMST SOGARA%'
    LIMIT 1;
    
    IF v_establishment_id IS NULL THEN
        -- Créer CMST SOGARA si n'existe pas
        INSERT INTO public.establishments (
            name,
            type,
            city,
            region,
            address,
            phone,
            email,
            is_active,
            is_verified
        ) VALUES (
            'CMST SOGARA',
            'hospital',
            'Port-Gentil',
            'Ogooué-Maritime',
            'Zone SOGARA',
            '011 55 26 21',
            'contact@cmst-sogara.ga',
            true,
            true
        ) RETURNING id INTO v_establishment_id;
    END IF;

    -- Supprimer les anciennes affiliations pour éviter les doublons
    DELETE FROM public.establishment_staff
    WHERE professional_id = v_professional_id
    AND establishment_id = v_establishment_id;

    -- 2. Créer RÔLE 1 : DIRECTEUR (Admin complet)
    INSERT INTO public.establishment_staff (
        establishment_id,
        professional_id,
        role_in_establishment,
        department,
        job_position,
        matricule,
        is_admin,
        is_department_head,
        permissions,
        status,
        start_date
    ) VALUES (
        v_establishment_id,
        v_professional_id,
        'director',
        'Direction Médicale',
        'Directeur Médical',
        'DIR-001',
        true,
        true,
        ARRAY['all']::text[],
        'active',
        '2024-01-01'::date
    );

    -- 3. Créer RÔLE 2 : MÉDECIN (Soins uniquement)
    INSERT INTO public.establishment_staff (
        establishment_id,
        professional_id,
        role_in_establishment,
        department,
        job_position,
        matricule,
        is_admin,
        is_department_head,
        permissions,
        status,
        start_date
    ) VALUES (
        v_establishment_id,
        v_professional_id,
        'doctor',
        'Médecine Générale',
        'Médecin Généraliste',
        'MED-001',
        false,
        false,
        ARRAY['consultation', 'prescription', 'view_dmp', 'edit_dmp']::text[],
        'active',
        '2024-01-01'::date
    );

    RAISE NOTICE 'Configuration multi-rôles terminée pour Dr. DJEKI';
    RAISE NOTICE '- Rôle 1: DIRECTEUR (Admin)';
    RAISE NOTICE '- Rôle 2: MÉDECIN (Soins)';
    
END $$;

-- 4. Créer ou remplacer la fonction RPC pour récupérer les rôles multiples
CREATE OR REPLACE FUNCTION public.get_user_roles_for_establishment(
    _user_id UUID,
    _establishment_id UUID
)
RETURNS TABLE (
    staff_id UUID,
    role_in_establishment TEXT,
    department TEXT,
    job_position TEXT,
    permissions TEXT[],
    is_admin BOOLEAN
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        es.id AS staff_id,
        es.role_in_establishment,
        es.department,
        es.job_position,
        es.permissions,
        es.is_admin
    FROM public.professionals p
    INNER JOIN public.establishment_staff es ON es.professional_id = p.id
    WHERE p.user_id = _user_id
        AND es.establishment_id = _establishment_id
        AND es.status = 'active'
    ORDER BY es.is_admin DESC;
$$;

-- 5. Vérifier le résultat
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.establishment_staff es
    INNER JOIN public.professionals p ON p.id = es.professional_id
    INNER JOIN auth.users u ON u.id = p.user_id
    WHERE u.email = 'directeur.sogara@sante.ga';
    
    RAISE NOTICE 'Dr. DJEKI a maintenant % rôles configurés', v_count;
END $$;

-- Grant des permissions nécessaires
GRANT EXECUTE ON FUNCTION public.get_user_roles_for_establishment TO authenticated;
GRANT SELECT ON public.establishment_staff TO authenticated;
GRANT SELECT ON public.professionals TO authenticated;
GRANT SELECT ON public.establishments TO authenticated;
