-- Réinitialiser le mot de passe du compte ministre
-- Mot de passe: MinistryGab2025!

DO $$
DECLARE
  ministre_user_id UUID;
BEGIN
  -- Récupérer l'ID du ministre
  SELECT id INTO ministre_user_id
  FROM auth.users
  WHERE email = 'ministre@sante.gouv.ga';

  IF ministre_user_id IS NULL THEN
    RAISE EXCEPTION 'Compte ministre introuvable';
  END IF;

  -- Réinitialiser le mot de passe
  -- Le hash est généré pour le mot de passe: MinistryGab2025!
  UPDATE auth.users
  SET 
    encrypted_password = crypt('MinistryGab2025!', gen_salt('bf')),
    updated_at = now()
  WHERE id = ministre_user_id;

  RAISE NOTICE '✅ Mot de passe réinitialisé pour ministre@sante.gouv.ga';
  RAISE NOTICE 'Email: ministre@sante.gouv.ga';
  RAISE NOTICE 'Mot de passe: MinistryGab2025!';
END $$;