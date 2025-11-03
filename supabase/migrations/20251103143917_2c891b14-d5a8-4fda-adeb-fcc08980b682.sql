
-- Migration: Permettre les rôles multiples pour un professionnel dans un établissement
-- Nécessaire pour Dr. DJEKI qui doit être à la fois Directeur ET Médecin au CMST SOGARA

-- 1. Supprimer la contrainte d'unicité actuelle
ALTER TABLE establishment_staff 
DROP CONSTRAINT IF EXISTS establishment_staff_establishment_id_professional_id_key;

-- 2. Ajouter une nouvelle contrainte d'unicité sur 3 colonnes (établissement, professionnel, rôle)
-- Cela permet à un professionnel d'avoir plusieurs rôles différents dans le même établissement
ALTER TABLE establishment_staff 
ADD CONSTRAINT establishment_staff_unique_role 
UNIQUE (establishment_id, professional_id, role_in_establishment);

-- 3. Ajouter le rôle de Médecin Consultant Senior pour Dr. DJEKI
INSERT INTO establishment_staff (
  establishment_id,
  professional_id,
  role_in_establishment,
  job_position,
  department,
  matricule,
  is_admin,
  is_department_head,
  permissions,
  status,
  start_date
)
SELECT 
  e.id as establishment_id,
  p.id as professional_id,
  'doctor' as role_in_establishment,
  'Médecin Consultant Senior' as job_position,
  'Médecine Générale' as department,
  'MED-001' as matricule,
  false as is_admin,
  false as is_department_head,
  ARRAY['consultations', 'prescriptions', 'dossiers_medicaux']::text[] as permissions,
  'active' as status,
  CURRENT_DATE as start_date
FROM professionals p
CROSS JOIN establishments e
WHERE p.email = 'directeur.sogara@sante.ga'
  AND e.raison_sociale = 'CMST SOGARA'
  AND NOT EXISTS (
    SELECT 1 
    FROM establishment_staff es 
    WHERE es.professional_id = p.id 
      AND es.establishment_id = e.id 
      AND es.role_in_establishment = 'doctor'
  );
