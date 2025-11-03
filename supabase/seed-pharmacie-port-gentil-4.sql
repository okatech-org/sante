-- ============================================
-- SEED: Pharmacie du Marché Port-Gentil 4
-- Date: 3 novembre 2025
-- Localisation: Port-Gentil, Ogooué-Maritime
-- ============================================

-- ============================================
-- 1. INSÉRER LA PHARMACIE
-- ============================================

INSERT INTO public.pharmacies (
    code_pharmacie,
    nom_commercial,
    type_structure,
    
    -- Autorisation
    numero_autorisation_ouverture,
    date_autorisation,
    numero_inscription_onpg,
    date_inscription_onpg,
    statut_onpg,
    
    -- Localisation
    adresse_complete,
    quartier,
    ville,
    province,
    latitude,
    longitude,
    reperes_geographiques,
    
    -- Contact
    telephone_principal,
    telephone_secondaire,
    email,
    
    -- Horaires (JSONB)
    ouvert_24_7,
    horaires,
    jours_fermeture,
    
    -- Services
    services_disponibles,
    modes_paiement,
    mobile_money_providers,
    
    -- Assurances
    conventionnement_cnamgs,
    numero_convention_cnamgs,
    autres_assurances_acceptees,
    
    -- Équipements
    dispose_chambre_froide,
    dispose_armoire_securisee,
    dispose_balance_electronique,
    
    -- Capacité
    nombre_employes,
    surface_m2,
    
    -- Visibilité
    visible_plateforme,
    accepte_commandes_en_ligne,
    accepte_reservations,
    delai_preparation_moyen_minutes,
    
    -- Statut
    statut_verification,
    date_verification,
    
    -- Performance
    note_moyenne,
    nombre_avis,
    nombre_commandes_total
    
) VALUES (
    'PHAR-004',
    'Pharmacie du Marché Port-Gentil 4',
    'officine_privee',
    
    -- Autorisation
    'MS-GAB-PG-2019-004',
    '2019-03-15',
    'ONPG-PG-2019-045',
    '2019-04-01',
    'actif',
    
    -- Localisation (Port-Gentil Centre, près du marché)
    'Avenue Savorgnan de Brazza, face au Grand Marché',
    'Centre-Ville',
    'Port-Gentil',
    'Ogooué-Maritime',
    -0.7193,  -- Latitude Port-Gentil
    8.7815,   -- Longitude Port-Gentil
    'Face au Grand Marché de Port-Gentil, à côté de la station Total, 100m après le rond-point central',
    
    -- Contact
    '+241 01 55 22 33',
    '+241 07 88 44 55',
    'contact@pharmacie-marche-pg4.ga',
    
    -- Horaires (Non 24/7 mais larges horaires)
    FALSE,
    '{
        "lundi": {
            "ouvert": true,
            "horaires": [
                {"debut": "07:30", "fin": "13:00"},
                {"debut": "15:00", "fin": "20:00"}
            ]
        },
        "mardi": {
            "ouvert": true,
            "horaires": [
                {"debut": "07:30", "fin": "13:00"},
                {"debut": "15:00", "fin": "20:00"}
            ]
        },
        "mercredi": {
            "ouvert": true,
            "horaires": [
                {"debut": "07:30", "fin": "13:00"},
                {"debut": "15:00", "fin": "20:00"}
            ]
        },
        "jeudi": {
            "ouvert": true,
            "horaires": [
                {"debut": "07:30", "fin": "13:00"},
                {"debut": "15:00", "fin": "20:00"}
            ]
        },
        "vendredi": {
            "ouvert": true,
            "horaires": [
                {"debut": "07:30", "fin": "13:00"},
                {"debut": "15:00", "fin": "20:00"}
            ]
        },
        "samedi": {
            "ouvert": true,
            "horaires": [
                {"debut": "07:30", "fin": "14:00"}
            ]
        },
        "dimanche": {
            "ouvert": true,
            "horaires": [
                {"debut": "08:00", "fin": "12:00"}
            ]
        }
    }'::jsonb,
    '[]'::jsonb,
    
    -- Services disponibles
    '["livraison", "mobile_money", "conseil_pharmaceutique", "depot_ordonnance", "click_and_collect"]'::jsonb,
    '["especes", "carte_bancaire", "mobile_money"]'::jsonb,
    '["airtel_money", "moov_money"]'::jsonb,
    
    -- Assurances
    TRUE,
    'CNAMGS-CONV-PG-2019-078',
    '["Mutuelle SOGARA", "Assurance NSIA"]'::jsonb,
    
    -- Équipements
    TRUE,  -- Chambre froide (vaccins, insuline)
    TRUE,  -- Armoire sécurisée (stupéfiants)
    TRUE,  -- Balance électronique
    
    -- Capacité
    4,      -- 1 pharmacien titulaire + 3 employés
    85.00,  -- Surface en m²
    
    -- Visibilité
    TRUE,   -- Visible sur la plateforme
    TRUE,   -- Accepte commandes en ligne
    TRUE,   -- Accepte réservations
    20,     -- Délai préparation moyen (minutes)
    
    -- Statut (Déjà vérifiée)
    'verifie',
    '2019-04-05 10:30:00',
    
    -- Performance (Données réalistes)
    4.6,    -- Note moyenne sur 5
    87,     -- Nombre d'avis
    1542    -- Nombre total de commandes
);

-- ============================================
-- 2. CRÉER LE PHARMACIEN TITULAIRE
-- ============================================

-- Note: Nécessite d'abord un compte utilisateur dans auth.users
-- Pour cet exemple, on crée une entrée professionnelle sans user_id
-- En production, créer d'abord le user via Supabase Auth

DO $$
DECLARE
    v_pharmacy_id UUID;
    v_professional_id UUID;
BEGIN
    -- Récupérer l'ID de la pharmacie créée
    SELECT id INTO v_pharmacy_id 
    FROM public.pharmacies 
    WHERE code_pharmacie = 'PHAR-004';
    
    -- Insérer le professionnel (Dr en Pharmacie Titulaire)
    -- NOTE: En production, remplacer gen_random_uuid() par le vrai user_id de auth.users
    INSERT INTO public.professionnels_sante_pharmacie (
        user_id,  -- IMPORTANT: À remplacer par vrai user_id après création compte
        code_professionnel,
        type_professionnel,
        
        -- Informations Personnelles
        nom,
        prenom,
        sexe,
        date_naissance,
        nationalite,
        
        -- Contact
        telephone_mobile,
        telephone_fixe,
        email_professionnel,
        adresse_personnelle,
        ville_residence,
        
        -- Formation
        diplome_pharmacie,
        universite,
        pays_obtention_diplome,
        annee_obtention_diplome,
        
        -- ONPG
        numero_inscription_onpg,
        date_inscription_onpg,
        statut_onpg,
        numero_autorisation_exercice,
        date_autorisation_exercice,
        autorite_delivrance,
        annees_experience,
        
        -- Rattachement
        pharmacie_principale_id,
        est_pharmacien_titulaire,
        statut_emploi,
        date_embauche,
        
        -- Permissions
        permissions,
        acces_gestion_stocks,
        acces_facturation,
        acces_rapports_activite,
        acces_administration,
        
        -- Statut
        statut_verification,
        date_verification,
        compte_actif,
        
        -- Performance
        nombre_dispensations,
        nombre_validations_ordonnances,
        note_moyenne
        
    ) VALUES (
        gen_random_uuid(),  -- TEMPORARY: Remplacer par vrai user_id
        'PHARM-0004',
        'dr_pharmacie',
        
        -- Informations Personnelles
        'MOUSSAVOU',
        'Patrick',
        'M',
        '1982-06-15',
        'Gabonaise',
        
        -- Contact
        '+241 06 77 88 99',
        '+241 01 55 22 33',
        'dr.moussavou@pharmacie-marche-pg4.ga',
        'Quartier Aviation, Port-Gentil',
        'Port-Gentil',
        
        -- Formation
        'Doctorat d''État en Pharmacie',
        'Université des Sciences de la Santé - Libreville',
        'Gabon',
        2008,
        
        -- ONPG
        'ONPG-PG-2019-045',
        '2008-11-20',
        'actif',
        'AE-MS-GAB-PG-2008-045',
        '2008-12-01',
        'Ministère de la Santé du Gabon',
        17,  -- Années d'expérience
        
        -- Rattachement
        v_pharmacy_id,
        TRUE,  -- Pharmacien titulaire
        'titulaire',
        '2019-03-15',
        
        -- Permissions (Titulaire = tous les droits)
        '["pharmacie:read", "pharmacie:update", "pharmacie:manage_settings", "stock:read", "stock:create", "stock:update", "stock:delete", "stock:declare_rupture", "ordonnances:read", "ordonnances:validate", "ordonnances:dispense", "ordonnances:reject", "employes:read", "employes:create", "employes:update", "employes:delete", "employes:manage_permissions", "rapports:read", "rapports:export", "facturation:read", "facturation:create", "facturation:update", "facturation:cnamgs_submit", "patients:read", "settings:manage"]'::jsonb,
        TRUE,  -- Accès gestion stocks
        TRUE,  -- Accès facturation
        TRUE,  -- Accès rapports
        TRUE,  -- Accès administration
        
        -- Statut (Déjà vérifié)
        'verifie',
        '2019-04-05 10:30:00',
        TRUE,  -- Compte actif
        
        -- Performance
        2847,  -- Dispensations
        1923,  -- Validations ordonnances
        4.7    -- Note moyenne
    ) RETURNING id INTO v_professional_id;
    
    -- Mettre à jour la pharmacie avec le pharmacien titulaire
    UPDATE public.pharmacies 
    SET pharmacien_titulaire_id = v_professional_id 
    WHERE id = v_pharmacy_id;
    
    -- Créer l'entrée dans pharmacie_employes
    INSERT INTO public.pharmacie_employes (
        pharmacie_id,
        professionnel_id,
        type_relation,
        date_debut,
        est_actif,
        type_contrat,
        nombre_heures_semaine
    ) VALUES (
        v_pharmacy_id,
        v_professional_id,
        'titulaire',
        '2019-03-15',
        TRUE,
        'CDI',
        40.00
    );
    
    RAISE NOTICE 'Pharmacie créée avec succès!';
    RAISE NOTICE 'Pharmacy ID: %', v_pharmacy_id;
    RAISE NOTICE 'Professional ID: %', v_professional_id;
    RAISE NOTICE 'Code Pharmacie: PHAR-004';
    RAISE NOTICE 'Code Professionnel: PHARM-0004';
END $$;

-- ============================================
-- 3. AJOUTER 2 VENDEURS
-- ============================================

DO $$
DECLARE
    v_pharmacy_id UUID;
    v_supervisor_id UUID;
    v_vendeur1_id UUID;
    v_vendeur2_id UUID;
BEGIN
    -- Récupérer IDs
    SELECT id INTO v_pharmacy_id FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004';
    SELECT id INTO v_supervisor_id FROM public.professionnels_sante_pharmacie WHERE code_professionnel = 'PHARM-0004';
    
    -- VENDEUR 1
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
        niveau_etude,
        formation_professionnelle,
        supervise_par_pharmacien_id,
        pharmacie_principale_id,
        est_pharmacien_titulaire,
        statut_emploi,
        date_embauche,
        permissions,
        acces_gestion_stocks,
        acces_facturation,
        statut_verification,
        compte_actif,
        nombre_dispensations,
        note_moyenne
    ) VALUES (
        gen_random_uuid(),
        'VEND-0001',
        'vendeur_pharmacie',
        'MOUNGUENGUI',
        'Sandrine',
        'F',
        'Gabonaise',
        '+241 07 22 33 44',
        's.mounguengui@pharmacie-marche-pg4.ga',
        'Bac+2',
        'BTS Commerce - Spécialité Pharmaceutique',
        v_supervisor_id,
        v_pharmacy_id,
        FALSE,
        'salarie',
        '2020-01-10',
        '["pharmacie:read", "stock:read", "ordonnances:read", "ordonnances:dispense", "facturation:read", "facturation:create", "patients:read"]'::jsonb,
        FALSE,
        FALSE,
        'verifie',
        TRUE,
        1245,
        4.5
    ) RETURNING id INTO v_vendeur1_id;
    
    INSERT INTO public.pharmacie_employes (
        pharmacie_id, professionnel_id, type_relation, date_debut, est_actif, type_contrat, nombre_heures_semaine
    ) VALUES (
        v_pharmacy_id, v_vendeur1_id, 'salarie', '2020-01-10', TRUE, 'CDI', 35.00
    );
    
    -- VENDEUR 2
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
        niveau_etude,
        formation_professionnelle,
        supervise_par_pharmacien_id,
        pharmacie_principale_id,
        est_pharmacien_titulaire,
        statut_emploi,
        date_embauche,
        permissions,
        acces_gestion_stocks,
        acces_facturation,
        statut_verification,
        compte_actif,
        nombre_dispensations,
        note_moyenne
    ) VALUES (
        gen_random_uuid(),
        'VEND-0002',
        'vendeur_pharmacie',
        'NDONG',
        'Eric',
        'M',
        'Gabonaise',
        '+241 07 55 66 77',
        'e.ndong@pharmacie-marche-pg4.ga',
        'Bac',
        'Formation interne dispensation',
        v_supervisor_id,
        v_pharmacy_id,
        FALSE,
        'salarie',
        '2021-06-01',
        '["pharmacie:read", "stock:read", "ordonnances:read", "ordonnances:dispense", "facturation:read", "facturation:create", "patients:read"]'::jsonb,
        FALSE,
        FALSE,
        'verifie',
        TRUE,
        876,
        4.4
    ) RETURNING id INTO v_vendeur2_id;
    
    INSERT INTO public.pharmacie_employes (
        pharmacie_id, professionnel_id, type_relation, date_debut, est_actif, type_contrat, nombre_heures_semaine
    ) VALUES (
        v_pharmacy_id, v_vendeur2_id, 'salarie', '2021-06-01', TRUE, 'CDI', 35.00
    );
    
    RAISE NOTICE 'Vendeur 1 créé: VEND-0001 (Sandrine MOUNGUENGUI)';
    RAISE NOTICE 'Vendeur 2 créé: VEND-0002 (Eric NDONG)';
END $$;

-- ============================================
-- 4. VÉRIFICATION
-- ============================================

-- Afficher la pharmacie créée
SELECT 
    code_pharmacie,
    nom_commercial,
    ville,
    province,
    telephone_principal,
    conventionnement_cnamgs,
    statut_verification,
    note_moyenne
FROM public.pharmacies 
WHERE code_pharmacie = 'PHAR-004';

-- Afficher l'équipe
SELECT 
    code_professionnel,
    nom_complet,
    type_professionnel,
    est_pharmacien_titulaire,
    statut_emploi,
    compte_actif
FROM public.professionnels_sante_pharmacie 
WHERE pharmacie_principale_id = (
    SELECT id FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004'
)
ORDER BY est_pharmacien_titulaire DESC, type_professionnel;

-- ============================================
-- 5. NOTES IMPORTANTES
-- ============================================

/*
⚠️ IMPORTANT POUR LA PRODUCTION:

1. COMPTES UTILISATEURS AUTH
   Les professionnels ont des user_id générés aléatoirement.
   En production, vous devez :
   - Créer d'abord les comptes via Supabase Auth (signup)
   - Récupérer les vrais user_id
   - Les utiliser dans les INSERT professionnels_sante_pharmacie

2. PHOTOS & DOCUMENTS
   Ajouter les URLs des photos/documents après upload :
   - logo_url (pharmacie)
   - photos_pharmacie (JSONB array)
   - photo_url (professionnels)
   - copie_diplome_url, copie_carte_onpg_url, etc.

3. GÉOLOCALISATION
   Le champ geolocation (PostGIS) est automatiquement rempli
   par le trigger sur latitude/longitude.

4. FONCTION GÉNÉRATION CODES
   Les codes PHAR-004, PHARM-0004, VEND-0001, VEND-0002 sont manuels ici.
   En production, utiliser les fonctions :
   - generate_pharmacy_code()
   - generate_professional_code('dr_pharmacie')
   - generate_professional_code('vendeur_pharmacie')

5. CONTACT ONPG
   Pour vérification réelle numéros ONPG:
   📞 +241 76 87 99 00 (Pharmacie Lalala, siège ONPG)
*/

-- ============================================
-- FIN DU SCRIPT
-- ============================================

