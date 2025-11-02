-- Extended Seed Data: Dashboard Ministre
-- Date: 2025-11-02
-- Description: Données additionnelles pour démonstration complète

-- KPIs additionnels (périodes variées)
INSERT INTO public.dashboard_kpis (nom, valeur, delta, unite, periode, date) VALUES
  -- Semaine
  ('Consultations urgences', 3245, 7.2, 'actes', 'semaine', NOW() - INTERVAL '7 days'),
  ('Vaccinations enfants', 1856, 12.3, 'doses', 'semaine', NOW() - INTERVAL '7 days'),
  ('Chirurgies programmées', 156, -2.1, 'interventions', 'semaine', NOW() - INTERVAL '7 days'),
  
  -- Année
  ('Budget total exécuté', 150.5, 8.9, 'Mds FCFA', 'annee', NOW()),
  ('Structures rénovées', 23, 15.2, 'bâtiments', 'annee', NOW()),
  ('Formations continues', 456, 22.1, 'participants', 'annee', NOW())
ON CONFLICT DO NOTHING;

-- Décrets additionnels (statuts variés pour filtres démos)
INSERT INTO public.dashboard_decrets (titre, numero, date, statut, categorie, created_by) VALUES
  (
    'Décret portant mise en place du système SANTE.GA',
    'N°007/PR/MSP/2025',
    '2025-07-10',
    'published',
    'Numérique',
    'ministre@sante.ga'
  ),
  (
    'Décret relatif aux normes d''hygiène hospitalière',
    'N°008/PR/MSP/2025',
    '2025-08-05',
    'signed',
    'Normes',
    'ministre@sante.ga'
  ),
  (
    'Décret fixant les tarifs CNAMGS 2026',
    'N°009/PR/MSP/2025',
    '2025-09-12',
    'draft',
    'Budget',
    'ministre@sante.ga'
  ),
  (
    'Décret portant création de 15 nouveaux CSI',
    'N°010/PR/MSP/2025',
    '2025-10-20',
    'published',
    'Infrastructures',
    'ministre@sante.ga'
  )
ON CONFLICT (numero) DO NOTHING;

-- Objectifs additionnels
INSERT INTO public.dashboard_objectifs (nom, description, cible, progres, unite, deadline) VALUES
  (
    'Télémédecine rurale',
    'Déployer la téléconsultation dans 50 centres de santé ruraux',
    50,
    18.0,
    'centres',
    '2026-12-31'
  ),
  (
    'Formation continue personnel',
    'Former 80% du personnel médical aux nouvelles pratiques',
    80,
    52.3,
    '%',
    '2026-06-30'
  ),
  (
    'Équipements plateau technique',
    'Équiper 100% des CHR en scanners et IRM',
    100,
    67.8,
    '%',
    '2027-12-31'
  )
ON CONFLICT DO NOTHING;

-- Alertes additionnelles (provinces variées)
INSERT INTO public.dashboard_alerts (titre, description, severity, province, action) VALUES
  (
    'Épidémie dengue',
    '45 cas confirmés en une semaine, tendance à la hausse',
    'haute',
    'Estuaire',
    'Renforcer surveillance épidémiologique et campagne prévention'
  ),
  (
    'Stock vaccins BCG faible',
    'Stock critique dans 2 provinces, réapprovisionnement urgent',
    'moyenne',
    'Moyen-Ogooué',
    NULL
  )
ON CONFLICT DO NOTHING;

-- KPIs historiques pour graphes tendances
INSERT INTO public.dashboard_kpis (nom, valeur, delta, unite, periode, date) VALUES
  -- Historique population couverte (12 derniers mois)
  ('Population couverte CNAMGS', 1650000, 3.1, 'habitants', 'mois', NOW() - INTERVAL '11 months'),
  ('Population couverte CNAMGS', 1680000, 3.5, 'habitants', 'mois', NOW() - INTERVAL '10 months'),
  ('Population couverte CNAMGS', 1710000, 4.2, 'habitants', 'mois', NOW() - INTERVAL '9 months'),
  ('Population couverte CNAMGS', 1735000, 3.8, 'habitants', 'mois', NOW() - INTERVAL '8 months'),
  ('Population couverte CNAMGS', 1760000, 4.5, 'habitants', 'mois', NOW() - INTERVAL '7 months'),
  ('Population couverte CNAMGS', 1785000, 4.1, 'habitants', 'mois', NOW() - INTERVAL '6 months'),
  
  -- Historique taux couverture (12 derniers mois)
  ('Taux couverture santé', 72.3, 1.2, '%', 'mois', NOW() - INTERVAL '11 months'),
  ('Taux couverture santé', 73.5, 1.5, '%', 'mois', NOW() - INTERVAL '10 months'),
  ('Taux couverture santé', 74.8, 1.8, '%', 'mois', NOW() - INTERVAL '9 months'),
  ('Taux couverture santé', 76.0, 1.6, '%', 'mois', NOW() - INTERVAL '8 months'),
  ('Taux couverture santé', 77.2, 1.9, '%', 'mois', NOW() - INTERVAL '7 months'),
  ('Taux couverture santé', 78.5, 2.1, '%', 'mois', NOW() - INTERVAL '6 months')
ON CONFLICT DO NOTHING;

-- Statistiques complémentaires
INSERT INTO public.dashboard_kpis (nom, valeur, delta, unite, periode, date) VALUES
  ('Taux occupation lits', 68.5, -2.3, '%', 'mois', NOW()),
  ('Temps attente moyen urgences', 45, -8.5, 'minutes', 'mois', NOW()),
  ('Satisfaction patients', 82.3, 3.7, '%', 'mois', NOW()),
  ('Taux disponibilité médicaments', 91.2, 2.8, '%', 'mois', NOW()),
  ('Consultations prénatales', 8934, 5.4, 'actes', 'mois', NOW()),
  ('Accouchements assistés', 3421, 4.1, 'naissances', 'mois', NOW())
ON CONFLICT DO NOTHING;

