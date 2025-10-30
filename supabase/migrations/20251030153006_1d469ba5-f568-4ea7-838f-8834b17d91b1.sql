-- Migration complémentaire: Mise à jour des emails @sogara.ga vers @sante.ga
UPDATE auth.users 
SET email = REPLACE(email, '@sogara.ga', '@sante.ga'),
    raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{email}',
      to_jsonb(REPLACE(email, '@sogara.ga', '@sante.ga'))
    )
WHERE email LIKE '%@sogara.ga';

UPDATE public.profiles 
SET email = REPLACE(email, '@sogara.ga', '@sante.ga')
WHERE email LIKE '%@sogara.ga';

UPDATE public.professionals 
SET email = REPLACE(email, '@sogara.ga', '@sante.ga')
WHERE email LIKE '%@sogara.ga';

-- Vérification finale
SELECT 
  p.full_name AS "Nom",
  au.email AS "Email",
  CASE 
    WHEN au.email LIKE '%@sante.ga' THEN '✅'
    ELSE '❌'
  END AS "Statut"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
WHERE au.email LIKE '%sogara%'
ORDER BY p.full_name;