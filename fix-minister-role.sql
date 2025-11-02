-- Script pour ajouter le rôle au compte du Ministre
-- À exécuter via le SQL Editor de Supabase

-- 1. Trouver l'ID du ministre
DO $$
DECLARE
  ministre_user_id UUID;
BEGIN
  -- Récupérer l'ID utilisateur du ministre
  SELECT id INTO ministre_user_id
  FROM auth.users
  WHERE email = 'ministre@sante.gouv.ga';

  IF ministre_user_id IS NULL THEN
    RAISE NOTICE 'Utilisateur ministre@sante.gouv.ga non trouvé!';
    RAISE NOTICE 'Créez d''abord le compte via: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users';
  ELSE
    RAISE NOTICE 'Utilisateur trouvé: %', ministre_user_id;

    -- Supprimer les rôles existants (au cas où)
    DELETE FROM user_roles WHERE user_id = ministre_user_id;

    -- Ajouter le rôle 'moderator' (accès professionnel)
    INSERT INTO user_roles (user_id, role)
    VALUES (ministre_user_id, 'moderator')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Créer/Mettre à jour le profil
    INSERT INTO profiles (id, full_name, user_type)
    VALUES (
      ministre_user_id,
      'Pr. Adrien MOUGOUGOU',
      'professional'
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = 'Pr. Adrien MOUGOUGOU',
      user_type = 'professional';

    RAISE NOTICE '✅ Rôle moderator ajouté avec succès!';
    RAISE NOTICE '✅ Profil créé/mis à jour';
    RAISE NOTICE '';
    RAISE NOTICE 'Vous pouvez maintenant vous connecter sur:';
    RAISE NOTICE 'http://localhost:5173/login/professional';
    RAISE NOTICE '';
    RAISE NOTICE 'Email: ministre@sante.gouv.ga';
    RAISE NOTICE 'Mot de passe: MinistryGab2025!';
  END IF;
END $$;

-- Vérifier le résultat
SELECT 
  u.email,
  u.id as user_id,
  u.created_at,
  u.email_confirmed_at,
  array_agg(ur.role) as roles
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'ministre@sante.gouv.ga'
GROUP BY u.id, u.email, u.created_at, u.email_confirmed_at;

