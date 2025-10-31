-- ============================================================================
-- CRÉATION DU COMPTE DE NADÈGE OYONO - RÉCEPTIONNISTE CMST SOGARA
-- ============================================================================

-- 1. Récupérer l'ID de l'établissement SOGARA
DO $$
DECLARE
    v_establishment_id UUID;
    v_user_id UUID;
BEGIN
    -- Récupérer ou créer l'établissement SOGARA
    SELECT id INTO v_establishment_id 
    FROM establishments 
    WHERE raison_sociale ILIKE '%SOGARA%' 
        OR raison_sociale ILIKE '%Centre Médical de Santé au Travail%'
    LIMIT 1;

    IF v_establishment_id IS NULL THEN
        INSERT INTO establishments (
            raison_sociale,
            type_etablissement,
            secteur,
            ville,
            province,
            adresse,
            telephone,
            email,
            latitude,
            longitude,
            nombre_lits_total,
            nombre_blocs_operatoires,
            nombre_salles_consultation,
            service_urgences_actif,
            cnamgs_conventionne,
            cnss_conventionne,
            statut,
            description
        ) VALUES (
            'Centre Médical de Santé au Travail SOGARA',
            'centre_medical',
            'prive',
            'Port-Gentil',
            'Ogooué-Maritime',
            'Route de la Sogara',
            '011 55 26 21',
            'cmst@sogara.com',
            -0.681398,
            8.772557,
            200,
            4,
            15,
            true,
            true,
            true,
            'actif',
            'Centre Médical de Santé au Travail au service des employés de SOGARA et leurs ayants droit'
        ) RETURNING id INTO v_establishment_id;
        
        RAISE NOTICE 'Établissement SOGARA créé avec ID: %', v_establishment_id;
    ELSE
        RAISE NOTICE 'Établissement SOGARA trouvé avec ID: %', v_establishment_id;
    END IF;

    -- Générer un UUID pour l'utilisateur
    v_user_id := gen_random_uuid();
    
    -- 2. Créer le profil utilisateur
    INSERT INTO profiles (id, full_name, email, phone, role, created_at, updated_at)
    VALUES (
        v_user_id,
        'Nadège Oyono',
        'accueil.sogara@sante.ga',
        '+241 01 55 26 21',
        'receptionist',
        NOW(),
        NOW()
    )
    ON CONFLICT (email) 
    DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        updated_at = NOW();

    -- Si le profil existait déjà, récupérer son ID
    IF NOT FOUND THEN
        SELECT id INTO v_user_id FROM profiles WHERE email = 'accueil.sogara@sante.ga';
    END IF;

    RAISE NOTICE 'Profil créé/mis à jour avec ID: %', v_user_id;

    -- 3. Assigner le rôle réceptionniste
    INSERT INTO user_roles (user_id, role)
    VALUES (v_user_id, 'receptionist')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Rôle réceptionniste assigné';

    -- 4. Créer le profil professionnel
    INSERT INTO professionals (
        user_id,
        professional_type,
        numero_ordre,
        specialite,
        etablissement,
        ville,
        adresse,
        telephone,
        is_verified,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        'receptionist',
        'REC-002',
        'Accueil et Gestion Administrative',
        'Centre Médical de Santé au Travail SOGARA',
        'Port-Gentil',
        'Route de la Sogara',
        '+241 01 55 26 21',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        professional_type = EXCLUDED.professional_type,
        numero_ordre = EXCLUDED.numero_ordre,
        specialite = EXCLUDED.specialite,
        etablissement = EXCLUDED.etablissement,
        is_verified = EXCLUDED.is_verified,
        updated_at = NOW();

    RAISE NOTICE 'Profil professionnel créé/mis à jour';

    -- 5. Lier à l'établissement SOGARA
    INSERT INTO establishment_users (
        establishment_id,
        user_id,
        role,
        permissions,
        actif,
        created_at
    ) VALUES (
        v_establishment_id,
        v_user_id,
        'receptionniste',
        jsonb_build_object(
            'manage_appointments', true,
            'patient_registration', true,
            'view_analytics', true,
            'manage_reception', true,
            'view_patients', true,
            'manage_waiting_list', true,
            'generate_reports', false,
            'manage_staff', false,
            'manage_billing', false
        ),
        true,
        NOW()
    )
    ON CONFLICT (establishment_id, user_id) 
    DO UPDATE SET
        role = EXCLUDED.role,
        permissions = EXCLUDED.permissions,
        actif = EXCLUDED.actif;

    RAISE NOTICE 'Liaison à l''établissement SOGARA créée';

    -- 6. Créer l'entrée dans establishment_staff (si la table existe)
    BEGIN
        INSERT INTO establishment_staff (
            establishment_id,
            professional_id,
            role_title,
            role_category,
            department,
            service,
            is_department_head,
            is_service_head,
            is_establishment_admin,
            can_manage_staff,
            can_manage_schedules,
            can_view_finances,
            can_approve_orders,
            permissions,
            schedule_type,
            weekly_hours,
            schedule_details,
            accepts_appointments,
            appointment_types,
            contract_type,
            contract_start_date,
            status,
            created_at,
            updated_at
        ) VALUES (
            v_establishment_id,
            v_user_id,
            'Réceptionniste',
            'administrative',
            'Accueil',
            'Réception',
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            ARRAY['manage_appointments', 'patient_registration', 'view_analytics', 'reception', 'appointments'],
            'fixed',
            40,
            jsonb_build_object(
                'monday', jsonb_build_object('start', '08:00', 'end', '17:00', 'break', '12:00-13:00'),
                'tuesday', jsonb_build_object('start', '08:00', 'end', '17:00', 'break', '12:00-13:00'),
                'wednesday', jsonb_build_object('start', '08:00', 'end', '17:00', 'break', '12:00-13:00'),
                'thursday', jsonb_build_object('start', '08:00', 'end', '17:00', 'break', '12:00-13:00'),
                'friday', jsonb_build_object('start', '08:00', 'end', '17:00', 'break', '12:00-13:00'),
                'saturday', jsonb_build_object('start', '08:00', 'end', '12:00'),
                'sunday', null
            ),
            false,
            ARRAY[]::TEXT[],
            'cdi',
            '2024-01-01',
            'active',
            NOW(),
            NOW()
        )
        ON CONFLICT (establishment_id, professional_id) 
        DO UPDATE SET
            role_title = EXCLUDED.role_title,
            role_category = EXCLUDED.role_category,
            department = EXCLUDED.department,
            service = EXCLUDED.service,
            permissions = EXCLUDED.permissions,
            schedule_type = EXCLUDED.schedule_type,
            weekly_hours = EXCLUDED.weekly_hours,
            schedule_details = EXCLUDED.schedule_details,
            status = EXCLUDED.status,
            updated_at = NOW();

        RAISE NOTICE 'Ajoutée au staff de l''établissement';
    EXCEPTION
        WHEN undefined_table THEN
            RAISE NOTICE 'Table establishment_staff n''existe pas - ignorée';
        WHEN OTHERS THEN
            RAISE NOTICE 'Erreur lors de l''ajout au staff: %', SQLERRM;
    END;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ COMPTE CRÉÉ AVEC SUCCÈS!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 INFORMATIONS DU COMPTE:';
    RAISE NOTICE '  👤 Nom complet      : Nadège Oyono';
    RAISE NOTICE '  📧 Email            : accueil.sogara@sante.ga';
    RAISE NOTICE '  💼 Poste            : Réceptionniste';
    RAISE NOTICE '  🏢 Service          : Accueil';
    RAISE NOTICE '  🏥 Établissement    : Centre Médical de Santé au Travail SOGARA';
    RAISE NOTICE '  📱 Téléphone        : +241 01 55 26 21';
    RAISE NOTICE '  🆔 Matricule        : REC-002';
    RAISE NOTICE '  🔒 Rôle système     : receptionist';
    RAISE NOTICE '';
    RAISE NOTICE '📍 ACCÈS ET PERMISSIONS:';
    RAISE NOTICE '  ✅ Gestion des rendez-vous';
    RAISE NOTICE '  ✅ Enregistrement des patients';
    RAISE NOTICE '  ✅ Consultation des statistiques';
    RAISE NOTICE '  ✅ Gestion de la réception';
    RAISE NOTICE '  ✅ Gestion de la liste d''attente';
    RAISE NOTICE '  ✅ Visualisation des patients';
    RAISE NOTICE '  ❌ Gestion du personnel';
    RAISE NOTICE '  ❌ Gestion de la facturation';
    RAISE NOTICE '  ❌ Génération de rapports financiers';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  NOTE IMPORTANTE:';
    RAISE NOTICE '  Le mot de passe doit être configuré via Supabase Auth.';
    RAISE NOTICE '  Utilisez la fonction de réinitialisation de mot de passe';
    RAISE NOTICE '  ou configurez-le via le tableau de bord Supabase.';
    RAISE NOTICE '';
    RAISE NOTICE '💡 PROCHAINES ÉTAPES:';
    RAISE NOTICE '  1. Configurer le mot de passe dans Supabase Auth';
    RAISE NOTICE '  2. Se connecter sur https://sante.ga/login/professional';
    RAISE NOTICE '  3. Accéder au tableau de bord de réception';
    
END $$;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

-- Pour exécuter ce script dans Supabase:
-- 1. Aller sur https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/sql/new
-- 2. Copier-coller ce script
-- 3. Cliquer sur "Run"
-- 4. Configurer le mot de passe pour l'utilisateur dans Supabase Auth
