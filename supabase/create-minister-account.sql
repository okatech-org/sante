-- ============================================
-- Création du compte Ministre de la Santé
-- Pr. Adrien MOUGOUGOU
-- ============================================

-- 1. Créer le profil du ministre
INSERT INTO profiles (
    id,
    user_id,
    email,
    first_name,
    last_name,
    phone,
    gender,
    profile_type,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    NULL, -- Sera lié après création du compte auth
    'ministre@sante.gouv.ga',
    'Adrien',
    'MOUGOUGOU',
    '+241 01-72-26-61',
    'M',
    'professional',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- 2. Récupérer l'ID du profil créé
DO $$
DECLARE
    ministre_profile_id UUID;
    ministere_establishment_id UUID;
BEGIN
    -- Récupérer l'ID du profil du ministre
    SELECT id INTO ministre_profile_id
    FROM profiles
    WHERE email = 'ministre@sante.gouv.ga';

    -- Vérifier si le ministère de la santé existe déjà dans establishments
    SELECT id INTO ministere_establishment_id
    FROM establishments
    WHERE name = 'Ministère de la Santé'
    LIMIT 1;

    -- Si le ministère n'existe pas, le créer
    IF ministere_establishment_id IS NULL THEN
        INSERT INTO establishments (
            id,
            name,
            type,
            sector,
            province,
            city,
            address,
            phone,
            email,
            website,
            is_operational,
            claim_status,
            latitude,
            longitude,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'Ministère de la Santé',
            'hospital', -- Type générique pour structure administrative
            'public',
            'Estuaire',
            'Libreville',
            'À côté de l''immeuble Alu-Suisse, Libreville, Gabon',
            '+241 01-72-26-61',
            'contact@sante.gouv.ga',
            'https://sante.gouv.ga',
            true,
            'verified',
            0.4162, -- Coordonnées approximatives de Libreville
            9.4673,
            NOW(),
            NOW()
        )
        RETURNING id INTO ministere_establishment_id;
    END IF;

    -- 3. Créer l'entrée professional pour le ministre
    INSERT INTO professionals (
        profile_id,
        profession,
        specialization,
        ordre_number,
        ordre_type,
        ordre_status,
        ordre_expiry_date,
        years_of_experience,
        bio,
        created_at,
        updated_at
    ) VALUES (
        ministre_profile_id,
        'doctor',
        'Administration de la Santé Publique',
        'CNOM-MINISTRE-001',
        'CNOM',
        'active',
        '2030-12-31',
        30,
        'Ministre de la Santé de la République Gabonaise. Professeur en Santé Publique. Responsable de la politique nationale de santé et de la mise en œuvre du Plan National de Développement Sanitaire (PNDS 2024-2028).',
        NOW(),
        NOW()
    ) ON CONFLICT (profile_id) DO UPDATE SET
        specialization = EXCLUDED.specialization,
        bio = EXCLUDED.bio,
        updated_at = NOW();

    -- 4. Associer le ministre au Ministère de la Santé comme administrateur
    INSERT INTO establishment_staff (
        id,
        establishment_id,
        professional_id,
        role,
        role_category,
        permissions,
        schedule_type,
        contract_type,
        status,
        start_date,
        can_manage_staff,
        can_access_all_records,
        can_manage_appointments,
        can_issue_prescriptions,
        can_view_financial_data,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        ministere_establishment_id,
        ministre_profile_id,
        'Ministre de la Santé',
        'administrative',
        ARRAY['all_access', 'manage_users', 'view_statistics', 'manage_establishments', 'issue_decrees', 'view_national_data']::text[],
        'full_time',
        'permanent',
        'active',
        '2024-01-01',
        true,
        true,
        true,
        false, -- Le ministre ne prescrit pas directement
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (establishment_id, professional_id) DO UPDATE SET
        role = EXCLUDED.role,
        permissions = EXCLUDED.permissions,
        can_access_all_records = true,
        can_view_financial_data = true,
        updated_at = NOW();

    -- 5. Log de création
    RAISE NOTICE 'Compte ministre créé avec succès';
    RAISE NOTICE 'Profile ID: %', ministre_profile_id;
    RAISE NOTICE 'Establishment ID: %', ministere_establishment_id;
    RAISE NOTICE 'Email: ministre@sante.gouv.ga';
    RAISE NOTICE 'Mot de passe à définir: Ministre2025!';

END $$;

-- ============================================
-- Vérification des données créées
-- ============================================

-- Afficher les informations du ministre
SELECT 
    p.id as profile_id,
    p.email,
    p.first_name,
    p.last_name,
    p.phone,
    pr.profession,
    pr.specialization,
    e.name as establishment_name,
    es.role,
    es.permissions
FROM profiles p
LEFT JOIN professionals pr ON pr.profile_id = p.id
LEFT JOIN establishment_staff es ON es.professional_id = p.id
LEFT JOIN establishments e ON e.id = es.establishment_id
WHERE p.email = 'ministre@sante.gouv.ga';

-- Note: Le mot de passe doit être défini via l'interface Supabase Auth ou via un script séparé
-- Mot de passe suggéré: Ministre2025!

