-- ============================================
-- 🚀 SCRIPT RAPIDE - Pharmacie Port-Gentil 4
-- Copier-coller dans Supabase SQL Editor et EXÉCUTER
-- ============================================

-- Vérifier d'abord si la pharmacie existe déjà
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004') THEN
        RAISE NOTICE '✅ La pharmacie PHAR-004 existe déjà !';
        RAISE NOTICE 'ID: %', (SELECT id FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004');
    ELSE
        RAISE NOTICE '❌ La pharmacie PHAR-004 n''existe pas encore. Création en cours...';
    END IF;
END $$;

-- Créer la pharmacie si elle n'existe pas
INSERT INTO public.pharmacies (
    code_pharmacie,
    nom_commercial,
    type_structure,
    adresse_complete,
    quartier,
    ville,
    province,
    latitude,
    longitude,
    reperes_geographiques,
    telephone_principal,
    telephone_secondaire,
    email,
    ouvert_24_7,
    horaires,
    services_disponibles,
    modes_paiement,
    mobile_money_providers,
    conventionnement_cnamgs,
    numero_convention_cnamgs,
    dispose_chambre_froide,
    dispose_armoire_securisee,
    dispose_balance_electronique,
    nombre_employes,
    surface_m2,
    visible_plateforme,
    accepte_commandes_en_ligne,
    accepte_reservations,
    delai_preparation_moyen_minutes,
    statut_verification,
    note_moyenne,
    nombre_avis,
    nombre_commandes_total
) VALUES (
    'PHAR-004',
    'Pharmacie du Marché Port-Gentil 4',
    'officine_privee',
    'Avenue Savorgnan de Brazza, face au Grand Marché',
    'Centre-Ville',
    'Port-Gentil',
    'Ogooué-Maritime',
    -0.7193,
    8.7815,
    'Face au Grand Marché de Port-Gentil, à côté de la station Total',
    '+241 01 55 22 33',
    '+241 07 88 44 55',
    'contact@pharmacie-marche-pg4.ga',
    FALSE,
    '{
        "lundi": {"ouvert": true, "horaires": [{"debut": "07:30", "fin": "13:00"}, {"debut": "15:00", "fin": "20:00"}]},
        "mardi": {"ouvert": true, "horaires": [{"debut": "07:30", "fin": "13:00"}, {"debut": "15:00", "fin": "20:00"}]},
        "mercredi": {"ouvert": true, "horaires": [{"debut": "07:30", "fin": "13:00"}, {"debut": "15:00", "fin": "20:00"}]},
        "jeudi": {"ouvert": true, "horaires": [{"debut": "07:30", "fin": "13:00"}, {"debut": "15:00", "fin": "20:00"}]},
        "vendredi": {"ouvert": true, "horaires": [{"debut": "07:30", "fin": "13:00"}, {"debut": "15:00", "fin": "20:00"}]},
        "samedi": {"ouvert": true, "horaires": [{"debut": "07:30", "fin": "14:00"}]},
        "dimanche": {"ouvert": true, "horaires": [{"debut": "08:00", "fin": "12:00"}]}
    }'::jsonb,
    '["livraison", "mobile_money", "conseil_pharmaceutique", "depot_ordonnance", "click_and_collect"]'::jsonb,
    '["especes", "carte_bancaire", "mobile_money"]'::jsonb,
    '["airtel_money", "moov_money"]'::jsonb,
    TRUE,
    'CNAMGS-CONV-PG-2019-078',
    TRUE,
    TRUE,
    TRUE,
    4,
    85.00,
    TRUE,
    TRUE,
    TRUE,
    20,
    'verifie',
    4.6,
    87,
    1542
)
ON CONFLICT (code_pharmacie) DO NOTHING;

-- Afficher le résultat
SELECT 
    '✅ PHARMACIE CRÉÉE !' as status,
    id,
    code_pharmacie,
    nom_commercial,
    ville,
    province,
    telephone_principal,
    statut_verification,
    visible_plateforme,
    note_moyenne
FROM public.pharmacies 
WHERE code_pharmacie = 'PHAR-004';

-- Afficher les infos pour accès
SELECT 
    '📍 Localisation' as info,
    adresse_complete,
    quartier,
    CONCAT('GPS: ', latitude, ', ', longitude) as coordonnees
FROM public.pharmacies 
WHERE code_pharmacie = 'PHAR-004';

