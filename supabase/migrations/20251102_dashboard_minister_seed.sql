-- Seed Data: Dashboard Ministre
-- Date: 2025-11-02
-- Description: Données de test pour le dashboard ministériel

-- KPIs (Indicateurs de performance)
INSERT INTO public.dashboard_kpis (nom, valeur, delta, unite, periode, date) VALUES
  ('Population couverte CNAMGS', 1800000, 5.2, 'habitants', 'mois', NOW()),
  ('Établissements opérationnels', 238, 2.3, 'structures', 'mois', NOW()),
  ('Professionnels actifs', 8432, -0.6, 'personnes', 'mois', NOW()),
  ('Budget exécuté', 65, 3.1, '%', 'mois', NOW()),
  ('Consultations mensuelles', 15234, 4.7, 'actes', 'mois', NOW()),
  ('Taux couverture santé', 78.5, 2.1, '%', 'mois', NOW()),
  ('Budget engagé', 198.2, 3.8, 'Mds FCFA', 'mois', NOW()),
  ('Ratio médecins/habitants', 0.8, -1.2, 'pour 1000', 'mois', NOW())
ON CONFLICT DO NOTHING;

-- Alerts (Alertes prioritaires)
INSERT INTO public.dashboard_alerts (titre, description, severity, province, action) VALUES
  (
    'Rupture d''insuline',
    'Stocks critiques signalés dans 3 structures publiques de la province',
    'critique',
    'Haut-Ogooué',
    'Déployer le plan d''urgence et activer le corridor logistique CNAMGS'
  ),
  (
    'Scanner en panne – CHR Franceville',
    'Plateau technique indisponible depuis 72h, patients redirigés vers Libreville',
    'haute',
    'Haut-Ogooué',
    'Mission de maintenance urgente planifiée pour le 5 novembre'
  ),
  (
    'Hausse cas paludisme',
    '+15% de cas signalés sur la dernière semaine dans les zones rurales',
    'moyenne',
    'Nyanga',
    NULL
  ),
  (
    'Pénurie de médecins spécialistes',
    'Ratio critique de 0,3 médecin pour 1000 habitants',
    'haute',
    'Ogooué-Ivindo',
    'Lancer un appel à recrutement international'
  ),
  (
    'Infrastructure vétuste',
    '5 centres de santé nécessitent rénovation urgente',
    'moyenne',
    'Ngounié',
    NULL
  )
ON CONFLICT DO NOTHING;

-- Decrets (Décrets ministériels)
INSERT INTO public.dashboard_decrets (titre, numero, date, statut, categorie, created_by) VALUES
  (
    'Décret portant création du Conseil National de la Santé',
    'N°001/PR/MSP/2025',
    '2025-01-15',
    'published',
    'Santé publique',
    'ministre@sante.ga'
  ),
  (
    'Décret relatif au budget santé 2025',
    'N°002/PR/MSP/2025',
    '2025-02-01',
    'signed',
    'Budget',
    'ministre@sante.ga'
  ),
  (
    'Décret portant organisation du système de santé primaire',
    'N°003/PR/MSP/2025',
    '2025-03-10',
    'published',
    'Organisation',
    'ministre@sante.ga'
  ),
  (
    'Décret fixant les normes de construction des centres de santé',
    'N°004/PR/MSP/2025',
    '2025-04-05',
    'signed',
    'Infrastructures',
    'ministre@sante.ga'
  ),
  (
    'Décret portant création de la plateforme SANTE.GA',
    'N°005/PR/MSP/2025',
    '2025-05-20',
    'draft',
    'Numérique',
    'ministre@sante.ga'
  ),
  (
    'Décret relatif à la télémédecine au Gabon',
    'N°006/PR/MSP/2025',
    '2025-06-15',
    'draft',
    'Numérique',
    'ministre@sante.ga'
  )
ON CONFLICT (numero) DO NOTHING;

-- Objectifs (Objectifs nationaux de santé)
INSERT INTO public.dashboard_objectifs (nom, description, cible, progres, unite, deadline) VALUES
  (
    'Couverture Santé Universelle',
    'Atteindre 95% de couverture nationale CNAMGS d''ici fin 2028',
    95,
    78.5,
    '%',
    '2028-12-31'
  ),
  (
    'Vaccination infantile complète',
    'Couvrir 100% des enfants de moins de 5 ans avec le schéma vaccinal complet',
    100,
    87.3,
    '%',
    '2026-12-31'
  ),
  (
    'Réduction mortalité maternelle',
    'Réduire le taux de mortalité maternelle à moins de 150 pour 100 000 naissances',
    150,
    68.2,
    'pour 100k',
    '2027-12-31'
  ),
  (
    'Accès aux soins primaires',
    'Garantir un centre de santé à moins de 5km pour 90% de la population',
    90,
    72.5,
    '%',
    '2026-06-30'
  ),
  (
    'Digitalisation du système de santé',
    'Connecter 100% des établissements publics à la plateforme SANTE.GA',
    100,
    45.8,
    '%',
    '2027-12-31'
  ),
  (
    'Disponibilité médicaments essentiels',
    'Assurer 95% de disponibilité des médicaments essentiels en permanence',
    95,
    81.4,
    '%',
    '2025-12-31'
  )
ON CONFLICT DO NOTHING;

-- Provinces (Données provinciales)
INSERT INTO public.dashboard_provinces (nom, code, population, structures, couverture, medecins, infirmiers, lits, budget, centroid, bounds, needs) VALUES
  (
    'Estuaire',
    'ES',
    812000,
    124,
    89.5,
    456,
    1234,
    2890,
    45.2,
    '{"lat": 0.4162, "lng": 9.4673}'::jsonb,
    '[[0.1, 9.2], [0.7, 9.7]]'::jsonb,
    '["Spécialistes", "Équipements modernes"]'::jsonb
  ),
  (
    'Haut-Ogooué',
    'HO',
    115000,
    32,
    72.3,
    45,
    178,
    520,
    12.8,
    '{"lat": -1.2167, "lng": 13.5667}'::jsonb,
    '[[-2.0, 12.8], [-0.5, 14.2]]'::jsonb,
    '["Médecins", "Médicaments", "Infrastructures"]'::jsonb
  ),
  (
    'Moyen-Ogooué',
    'MO',
    69000,
    18,
    65.8,
    23,
    89,
    245,
    6.5,
    '{"lat": -0.7, "lng": 10.4}'::jsonb,
    '[[-1.2, 10.0], [-0.2, 10.8]]'::jsonb,
    '["Personnel", "Ambulances", "Laboratoires"]'::jsonb
  ),
  (
    'Ngounié',
    'NG',
    98000,
    25,
    68.2,
    31,
    124,
    385,
    8.9,
    '{"lat": -1.5, "lng": 10.9}'::jsonb,
    '[[-2.0, 10.5], [-1.0, 11.3]]'::jsonb,
    '["Médecins", "Infrastructures"]'::jsonb
  ),
  (
    'Nyanga',
    'NY',
    52000,
    14,
    62.1,
    18,
    67,
    178,
    5.2,
    '{"lat": -2.9, "lng": 11.0}'::jsonb,
    '[[-3.5, 10.5], [-2.3, 11.5]]'::jsonb,
    '["Médecins", "Routes d''accès", "Électricité"]'::jsonb
  ),
  (
    'Ogooué-Ivindo',
    'OI',
    63000,
    19,
    64.5,
    21,
    82,
    215,
    6.8,
    '{"lat": 0.7, "lng": 13.2}'::jsonb,
    '[[0.2, 12.5], [1.2, 13.9]]'::jsonb,
    '["Personnel médical", "Ambulances", "Médicaments"]'::jsonb
  ),
  (
    'Ogooué-Lolo',
    'OL',
    65000,
    17,
    66.3,
    24,
    95,
    228,
    7.1,
    '{"lat": -0.8, "lng": 12.7}'::jsonb,
    '[[-1.3, 12.2], [-0.3, 13.2]]'::jsonb,
    '["Spécialistes", "Laboratoires"]'::jsonb
  ),
  (
    'Ogooué-Maritime',
    'OM',
    157000,
    45,
    82.7,
    89,
    312,
    845,
    18.5,
    '{"lat": -1.0, "lng": 9.8}'::jsonb,
    '[[-1.8, 9.0], [-0.2, 10.6]]'::jsonb,
    '["Équipements", "Personnel spécialisé"]'::jsonb
  ),
  (
    'Woleu-Ntem',
    'WN',
    154000,
    41,
    75.8,
    78,
    267,
    692,
    16.3,
    '{"lat": 2.0, "lng": 11.5}'::jsonb,
    '[[1.2, 10.8], [2.8, 12.2]]'::jsonb,
    '["Médecins", "Infrastructures", "Médicaments"]'::jsonb
  )
ON CONFLICT (nom) DO NOTHING;

-- Grants (permissions)
GRANT SELECT ON public.dashboard_kpis TO authenticated;
GRANT SELECT ON public.dashboard_alerts TO authenticated;
GRANT ALL ON public.dashboard_decrets TO authenticated;
GRANT ALL ON public.dashboard_objectifs TO authenticated;
GRANT SELECT ON public.dashboard_provinces TO authenticated;

