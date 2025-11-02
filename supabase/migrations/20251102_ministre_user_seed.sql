-- Seed: Utilisateur Ministre
-- Date: 2025-11-02
-- Description: Créer le compte ministre@sante.ga pour accès dashboard

-- Note: Le mot de passe doit être hashé avec bcrypt
-- Pour générer le hash, utilisez: bcrypt.hash('votre-mot-de-passe', 10)
-- Exemple avec 'admin123': $2b$10$hash...

-- Créer l'utilisateur ministre (si non existant)
-- IMPORTANT: Remplacer le hash ci-dessous par un hash bcrypt réel

INSERT INTO public.users (
  id,
  email,
  password,
  first_name,
  last_name,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'ministre@sante.ga',
  '$2b$10$YourBcryptHashHere',  -- À remplacer par hash bcrypt réel
  'Adrien',
  'MOUGOUGOU',
  'MINISTRE',
  '+241 01 23 45 67',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Note pour génération du hash bcrypt:
-- En Node.js:
--   const bcrypt = require('bcrypt');
--   const hash = await bcrypt.hash('admin123', 10);
--   console.log(hash);
--
-- Ou utiliser https://bcrypt-generator.com/ avec rounds=10

