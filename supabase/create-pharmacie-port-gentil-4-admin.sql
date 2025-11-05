-- ============================================
-- PROVISION: Compte Pharmacien (admin) – PHAR-004
-- Établissement: Pharmacie du Marché Port-Gentil 4
-- Portée:
--  1) Créer l'utilisateur Auth Supabase (pharmacien titulaire)
--  2) Assigner le rôle applicatif 'pharmacy'
--  3) Lier le professionnel titulaire à l'utilisateur
--  4) Mettre à jour la pharmacie (pharmacien_titulaire_id)
--  5) (Optionnel) Initialiser un stock de base (dépôt) pour PHAR-004
-- ============================================

DO $$
DECLARE
  v_user_id uuid;
  v_existing_user uuid;
  v_pharmacy_id uuid;
  v_professional_id uuid;
  v_professional_exists boolean := false;
  v_email text := 'dr.moussavou@pharmacie-marche-pg4.ga';
  v_full_name text := 'Dr Patrick MOUSSAVOU';
BEGIN
  -- 0) Récupérer l'ID de la pharmacie PHAR-004
  SELECT id INTO v_pharmacy_id
  FROM public.pharmacies
  WHERE code_pharmacie = 'PHAR-004';

  IF v_pharmacy_id IS NULL THEN
    RAISE EXCEPTION 'La pharmacie PHAR-004 est introuvable. Exécutez d\'abord le script de création de la pharmacie.';
  END IF;

  -- 1) Créer l'utilisateur Auth Supabase si absent
  SELECT id INTO v_existing_user FROM auth.users WHERE email = v_email;

  IF v_existing_user IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_email,
      crypt('PharmaPG4@2025!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', v_full_name),
      now(),
      now(),
      '', '', '', ''
    ) RETURNING id INTO v_user_id;

    RAISE NOTICE '✅ Utilisateur créé: %', v_email;
  ELSE
    v_user_id := v_existing_user;
    RAISE NOTICE 'ℹ️ Utilisateur existant: %', v_email;
  END IF;

  -- 2) Assigner le rôle applicatif 'pharmacy' si non présent
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'pharmacy'::app_role
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'pharmacy');
    RAISE NOTICE '✅ Rôle ajouté: pharmacy';
  ELSE
    RAISE NOTICE 'ℹ️ Rôle déjà présent: pharmacy';
  END IF;

  -- 3) Lier/Créer le professionnel titulaire (code PHARM-0004)
  SELECT id, true INTO v_professional_id, v_professional_exists
  FROM public.professionnels_sante_pharmacie
  WHERE code_professionnel = 'PHARM-0004'
  LIMIT 1;

  IF v_professional_exists THEN
    -- Mettre à jour le user_id et flags d'accès
    UPDATE public.professionnels_sante_pharmacie
    SET user_id = v_user_id,
        pharmacie_principale_id = v_pharmacy_id,
        est_pharmacien_titulaire = TRUE,
        statut_emploi = 'titulaire',
        acces_gestion_stocks = TRUE,
        acces_facturation = TRUE,
        acces_rapports_activite = TRUE,
        acces_administration = TRUE,
        statut_verification = 'verifie',
        date_verification = COALESCE(date_verification, now()),
        compte_actif = TRUE
    WHERE id = v_professional_id;
    RAISE NOTICE '✅ Professionnel mis à jour: PHARM-0004 → lié à %', v_email;
  ELSE
    -- Créer le professionnel titulaire s'il n'existe pas
    INSERT INTO public.professionnels_sante_pharmacie (
      user_id,
      code_professionnel,
      type_professionnel,
      nom,
      prenom,
      sexe,
      nationalite,
      telephone_mobile,
      email_professionnel,
      diplome_pharmacie,
      universite,
      pays_obtention_diplome,
      annee_obtention_diplome,
      numero_inscription_onpg,
      date_inscription_onpg,
      statut_onpg,
      numero_autorisation_exercice,
      date_autorisation_exercice,
      autorite_delivrance,
      annees_experience,
      pharmacie_principale_id,
      est_pharmacien_titulaire,
      statut_emploi,
      date_embauche,
      permissions,
      acces_gestion_stocks,
      acces_facturation,
      acces_rapports_activite,
      acces_administration,
      statut_verification,
      date_verification,
      compte_actif
    ) VALUES (
      v_user_id,
      'PHARM-0004',
      'dr_pharmacie',
      'MOUSSAVOU',
      'Patrick',
      'M',
      'Gabonaise',
      '+241 06 77 88 99',
      v_email,
      'Doctorat d''État en Pharmacie',
      'Université des Sciences de la Santé - Libreville',
      'Gabon',
      2008,
      'ONPG-PG-2019-045',
      '2008-11-20',
      'actif',
      'AE-MS-GAB-PG-2008-045',
      '2008-12-01',
      'Ministère de la Santé du Gabon',
      17,
      v_pharmacy_id,
      TRUE,
      'titulaire',
      '2019-03-15',
      '["pharmacie:read","pharmacie:update","pharmacie:manage_settings","stock:read","stock:create","stock:update","stock:delete","stock:declare_rupture","ordonnances:read","ordonnances:validate","ordonnances:dispense","ordonnances:reject","employes:read","employes:create","employes:update","employes:delete","employes:manage_permissions","rapports:read","rapports:export","facturation:read","facturation:create","facturation:update","facturation:cnamgs_submit","patients:read","settings:manage"]'::jsonb,
      TRUE,
      TRUE,
      TRUE,
      TRUE,
      'verifie',
      now(),
      TRUE
    ) RETURNING id INTO v_professional_id;
    RAISE NOTICE '✅ Professionnel créé: PHARM-0004 → lié à %', v_email;
  END IF;

  -- 4) Mettre à jour la pharmacie avec le pharmacien titulaire
  UPDATE public.pharmacies
  SET pharmacien_titulaire_id = v_professional_id
  WHERE id = v_pharmacy_id;
  RAISE NOTICE '✅ Pharmacie mise à jour: pharmacien_titulaire_id = %', v_professional_id;

  -- 5) (Optionnel) Initialiser un stock de base pour PHAR-004
  --    Associe quelques médicaments du dépôt à la pharmacie avec quantités/prix
  PERFORM 1 FROM public.medicaments LIMIT 1;
  IF FOUND THEN
    -- Paracétamol 500mg
    INSERT INTO public.stocks_pharmacie (pharmacie_id, medicament_id, quantite_disponible, seuil_alerte, prix_vente)
    SELECT v_pharmacy_id, m.id, 250, 30, 1500
    FROM public.medicaments m
    WHERE m.nom_commercial = 'PARACETAMOL 500mg'
    ON CONFLICT (pharmacie_id, medicament_id) DO NOTHING;

    -- Amoxicilline 500mg
    INSERT INTO public.stocks_pharmacie (pharmacie_id, medicament_id, quantite_disponible, seuil_alerte, prix_vente)
    SELECT v_pharmacy_id, m.id, 120, 20, 3200
    FROM public.medicaments m
    WHERE m.nom_commercial = 'AMOXICILLINE 500mg'
    ON CONFLICT (pharmacie_id, medicament_id) DO NOTHING;

    -- Ibuprofène 400mg
    INSERT INTO public.stocks_pharmacie (pharmacie_id, medicament_id, quantite_disponible, seuil_alerte, prix_vente)
    SELECT v_pharmacy_id, m.id, 180, 25, 2200
    FROM public.medicaments m
    WHERE m.nom_commercial = 'IBUPROFENE 400mg'
    ON CONFLICT (pharmacie_id, medicament_id) DO NOTHING;

    -- Metformine 850mg
    INSERT INTO public.stocks_pharmacie (pharmacie_id, medicament_id, quantite_disponible, seuil_alerte, prix_vente)
    SELECT v_pharmacy_id, m.id, 90, 15, 4800
    FROM public.medicaments m
    WHERE m.nom_commercial = 'METFORMINE 850mg'
    ON CONFLICT (pharmacie_id, medicament_id) DO NOTHING;

    -- Amlodipine 5mg
    INSERT INTO public.stocks_pharmacie (pharmacie_id, medicament_id, quantite_disponible, seuil_alerte, prix_vente)
    SELECT v_pharmacy_id, m.id, 110, 20, 5100
    FROM public.medicaments m
    WHERE m.nom_commercial = 'AMLODIPINE 5mg'
    ON CONFLICT (pharmacie_id, medicament_id) DO NOTHING;

    RAISE NOTICE '✅ Stocks initiaux renseignés pour PHAR-004';
  ELSE
    RAISE NOTICE 'ℹ️ Table medicaments vide ou absente — saut de l\'initialisation des stocks.';
  END IF;
END $$;

-- Vérifications
SELECT 'Utilisateur' AS type, u.id, u.email
FROM auth.users u
WHERE u.email = 'dr.moussavou@pharmacie-marche-pg4.ga';

SELECT 'Rôles' AS type, r.role
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE u.email = 'dr.moussavou@pharmacie-marche-pg4.ga';

SELECT 'Professionnel' AS type, p.code_professionnel, p.nom_complet, p.est_pharmacien_titulaire
FROM public.professionnels_sante_pharmacie p
WHERE p.code_professionnel = 'PHARM-0004';

SELECT 'Pharmacie' AS type, ph.code_pharmacie, ph.nom_commercial, ph.pharmacien_titulaire_id
FROM public.pharmacies ph
WHERE ph.code_pharmacie = 'PHAR-004';

SELECT 'Stocks' AS type, s.pharmacie_id, m.nom_commercial, s.quantite_disponible, s.prix_vente
FROM public.stocks_pharmacie s
JOIN public.medicaments m ON m.id = s.medicament_id
WHERE s.pharmacie_id = (
  SELECT id FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004'
)
ORDER BY m.nom_commercial;


