-- =====================================================
-- MIGRATION: Standardisation emails SOGARA vers @sante.ga
-- =====================================================
-- Cette migration met à jour tous les emails des comptes SOGARA
-- pour utiliser le domaine standardisé @sante.ga
-- =====================================================

-- Fonction pour mettre à jour un email de @sogara.com vers @sante.ga
CREATE OR REPLACE FUNCTION update_sogara_email(
  old_email TEXT,
  new_email TEXT
) RETURNS VOID AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Trouver l'utilisateur avec l'ancien email
  SELECT id INTO user_uuid FROM auth.users WHERE email = old_email;
  
  -- Si l'utilisateur existe, mettre à jour son email partout
  IF user_uuid IS NOT NULL THEN
    -- Mettre à jour auth.users
    UPDATE auth.users 
    SET email = new_email,
        raw_user_meta_data = jsonb_set(
          COALESCE(raw_user_meta_data, '{}'::jsonb),
          '{email}',
          to_jsonb(new_email)
        )
    WHERE id = user_uuid;
    
    -- Mettre à jour public.profiles
    UPDATE public.profiles 
    SET email = new_email 
    WHERE id = user_uuid;
    
    -- Mettre à jour public.professionals si existe
    UPDATE public.professionals 
    SET email = new_email 
    WHERE user_id = user_uuid;
    
    RAISE NOTICE 'Email mis à jour: % -> %', old_email, new_email;
  ELSE
    RAISE NOTICE 'Utilisateur non trouvé pour email: %', old_email;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MISE À JOUR DES 12 COMPTES SOGARA
-- =====================================================

-- 1. Administrateurs (2)
SELECT update_sogara_email('admin@sogara.com', 'admin.sogara@sante.ga');
SELECT update_sogara_email('directeur@sogara.com', 'directeur.sogara@sante.ga');

-- 2. Médecins (4)
SELECT update_sogara_email('dr.okemba@sogara.com', 'dr.okemba.sogara@sante.ga');
SELECT update_sogara_email('dr.nguema@sogara.com', 'dr.nguema.sogara@sante.ga');
SELECT update_sogara_email('dr.mbina@sogara.com', 'dr.mbina.sogara@sante.ga');
SELECT update_sogara_email('dr.mezui@sogara.com', 'dr.mezui.sogara@sante.ga');

-- 3. Infirmiers (3)
SELECT update_sogara_email('nurse.mba@sogara.com', 'nurse.mba.sogara@sante.ga');
SELECT update_sogara_email('nurse.nze@sogara.com', 'nurse.nze.sogara@sante.ga');
SELECT update_sogara_email('nurse.andeme@sogara.com', 'nurse.andeme.sogara@sante.ga');

-- 4. Technicien Laboratoire (1)
SELECT update_sogara_email('lab.tech@sogara.com', 'lab.tech.sogara@sante.ga');

-- 5. Pharmacien (1)
SELECT update_sogara_email('pharma@sogara.com', 'pharma.sogara@sante.ga');

-- 6. Réceptionniste (1)
SELECT update_sogara_email('accueil@sogara.com', 'accueil.sogara@sante.ga');

-- Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS update_sogara_email;

-- =====================================================
-- VÉRIFICATION
-- =====================================================
SELECT 
  p.full_name AS "Nom",
  au.email AS "Nouveau Email",
  ur.role AS "Rôle",
  CASE 
    WHEN au.email LIKE '%@sante.ga' THEN '✅ Migré'
    ELSE '❌ Non migré'
  END AS "Statut Migration"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
WHERE au.email LIKE '%sogara%' OR au.email LIKE '%sante.ga%'
ORDER BY p.full_name;