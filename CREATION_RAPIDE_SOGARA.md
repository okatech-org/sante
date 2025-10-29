# 🚀 Création Rapide des Comptes SOGARA (5 minutes)

## ⚡ Étape 1 : Créer les comptes dans Supabase

1. **Ouvrez** : https://app.supabase.com
2. **Connectez-vous** à votre projet
3. **Allez dans** : Authentication > Users
4. **Cliquez** : "Add User" > "Create new user"

### 👮 Créer le compte Admin

- **Email** : `admin@sogara.com`
- **Password** : `Admin@SOGARA2024`
- ✅ **IMPORTANT** : Cochez "Auto Confirm User"
- Cliquez "Create User"

### 👨‍⚕️ Créer le compte Médecin

- **Email** : `dr.okemba@sogara.com`
- **Password** : `Okemba@2024Med`
- ✅ **IMPORTANT** : Cochez "Auto Confirm User"
- Cliquez "Create User"

---

## ⚡ Étape 2 : Configurer les profils et rôles

1. **Allez dans** : SQL Editor
2. **Cliquez** : "New query"
3. **Copiez et exécutez** le SQL ci-dessous :

```sql
-- Configuration du compte Admin SOGARA
DO $$
DECLARE
  v_user_id UUID;
  v_professional_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur admin
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@sogara.com';
  
  IF v_user_id IS NOT NULL THEN
    -- Créer/Mettre à jour le profil
    INSERT INTO public.profiles (id, full_name, email, phone)
    VALUES (v_user_id, 'Jean-Pierre Mbadinga', 'admin@sogara.com', 'ADM-001')
    ON CONFLICT (id) DO UPDATE 
    SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
    
    -- Assigner le rôle hospital
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'hospital')
    ON CONFLICT DO NOTHING;
    
    -- Créer le profil professionnel
    INSERT INTO public.professionals (
      user_id, 
      professional_type, 
      numero_ordre, 
      full_name,
      email,
      phone,
      title,
      status,
      verified
    )
    VALUES (
      v_user_id, 
      'hospital',
      'ADM-001',
      'Jean-Pierre Mbadinga',
      'admin@sogara.com',
      '+241 XX XX XX XX',
      'Administrateur',
      'actif',
      true
    )
    ON CONFLICT (user_id) DO UPDATE 
    SET numero_ordre = EXCLUDED.numero_ordre,
        verified = true,
        status = 'actif';
    
    -- Récupérer l'ID du profil professionnel
    SELECT id INTO v_professional_id FROM public.professionals WHERE user_id = v_user_id;
    
    -- Créer le profil professionnel détaillé
    INSERT INTO public.professional_profiles (
      id,
      user_id,
      profession_type,
      ordre_number,
      ordre_verified
    )
    VALUES (
      v_professional_id,
      v_user_id,
      'hospital',
      'ADM-001',
      true
    )
    ON CONFLICT (user_id) DO UPDATE
    SET ordre_number = EXCLUDED.ordre_number,
        ordre_verified = true;
    
    RAISE NOTICE 'Admin Jean-Pierre Mbadinga configuré avec succès';
  ELSE
    RAISE NOTICE 'Utilisateur admin@sogara.com non trouvé - Créez d''abord le compte dans Authentication';
  END IF;
END $$;

-- Configuration du compte Médecin
DO $$
DECLARE
  v_user_id UUID;
  v_professional_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur médecin
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.okemba@sogara.com';
  
  IF v_user_id IS NOT NULL THEN
    -- Créer/Mettre à jour le profil
    INSERT INTO public.profiles (id, full_name, email, phone)
    VALUES (v_user_id, 'Dr. Marie Okemba', 'dr.okemba@sogara.com', 'MED-012')
    ON CONFLICT (id) DO UPDATE 
    SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
    
    -- Assigner le rôle doctor
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'doctor')
    ON CONFLICT DO NOTHING;
    
    -- Créer le profil professionnel
    INSERT INTO public.professionals (
      user_id, 
      professional_type, 
      numero_ordre, 
      full_name,
      email,
      phone,
      title,
      status,
      verified
    )
    VALUES (
      v_user_id, 
      'doctor',
      'MED-012',
      'Dr. Marie Okemba',
      'dr.okemba@sogara.com',
      '+241 XX XX XX XX',
      'Médecin Généraliste',
      'actif',
      true
    )
    ON CONFLICT (user_id) DO UPDATE 
    SET numero_ordre = EXCLUDED.numero_ordre,
        verified = true,
        status = 'actif';
    
    -- Récupérer l'ID du profil professionnel
    SELECT id INTO v_professional_id FROM public.professionals WHERE user_id = v_user_id;
    
    -- Créer le profil professionnel détaillé
    INSERT INTO public.professional_profiles (
      id,
      user_id,
      profession_type,
      specialization,
      ordre_number,
      ordre_verified
    )
    VALUES (
      v_professional_id,
      v_user_id,
      'doctor',
      'Médecine Générale',
      'MED-012',
      true
    )
    ON CONFLICT (user_id) DO UPDATE
    SET ordre_number = EXCLUDED.ordre_number,
        ordre_verified = true,
        specialization = EXCLUDED.specialization;
    
    RAISE NOTICE 'Médecin Dr. Marie Okemba configuré avec succès';
  ELSE
    RAISE NOTICE 'Utilisateur dr.okemba@sogara.com non trouvé - Créez d''abord le compte dans Authentication';
  END IF;
END $$;

-- Vérification finale
SELECT 
  p.full_name as "Nom",
  au.email as "Email",
  ur.role as "Rôle",
  prof.numero_ordre as "Matricule",
  prof.status as "Statut"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
LEFT JOIN public.professionals prof ON prof.user_id = au.id
WHERE au.email IN ('admin@sogara.com', 'dr.okemba@sogara.com')
ORDER BY au.email;
```

---

## ✅ Étape 3 : Tester la connexion

1. **Ouvrez** : http://localhost:8080/login/professional
2. **Testez le compte Admin** :
   - Email : `admin@sogara.com`
   - Password : `Admin@SOGARA2024`
3. **Testez le compte Médecin** :
   - Email : `dr.okemba@sogara.com`
   - Password : `Okemba@2024Med`

---

## 🎯 En cas de problème

### Vérifier que les comptes existent
```sql
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email IN ('admin@sogara.com', 'dr.okemba@sogara.com');
```

### Vérifier les rôles
```sql
SELECT 
  au.email,
  ur.role
FROM auth.users au
LEFT JOIN user_roles ur ON ur.user_id = au.id
WHERE au.email IN ('admin@sogara.com', 'dr.okemba@sogara.com');
```

### Réinitialiser un mot de passe
```sql
UPDATE auth.users 
SET encrypted_password = crypt('NouveauMotDePasse123!', gen_salt('bf'))
WHERE email = 'admin@sogara.com';
```

---

## 📋 Prochaines étapes

Une fois que ces 2 comptes fonctionnent, vous pourrez créer les 10 autres comptes en utilisant la même méthode ou en exécutant le script SQL complet dans `SOGARA_SQL_COMPLETE.sql`.
