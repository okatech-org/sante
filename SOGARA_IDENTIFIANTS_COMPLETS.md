# 🔐 IDENTIFIANTS COMPLETS CMST SOGARA

## ⚡ Méthode Rapide - SQL Direct

1. **Ouvrez** : https://app.supabase.com
2. **Allez dans** : SQL Editor
3. **Copiez et exécutez** le contenu du fichier `SOGARA_SQL_COMPLETE.sql`

---

## 📋 Liste Complète des Comptes (12)

### 👮 ADMINISTRATEURS (2)

| Nom | Email | Mot de passe | Matricule |
|-----|-------|--------------|-----------|
| Jean-Pierre Mbadinga | admin@sogara.com | Admin@SOGARA2024 | ADM-001 |
| Dr. François Obiang | directeur@sogara.com | DirecteurSOGARA2024! | DIR-001 |

### 👨‍⚕️ MÉDECINS (4)

| Nom | Email | Mot de passe | Matricule |
|-----|-------|--------------|-----------|
| Dr. Marie Okemba | dr.okemba@sogara.com | Okemba@2024Med | MED-012 |
| Dr. Paul Nguema | dr.nguema@sogara.com | Nguema@Urgence24 | MED-015 |
| Dr. Léa Mbina | dr.mbina@sogara.com | Mbina@Cardio2024 | MED-018 |
| Dr. Thomas Mezui | dr.mezui@sogara.com | Mezui@Pediatrie24 | MED-022 |

### 👩‍⚕️ INFIRMIERS (3)

| Nom | Email | Mot de passe | Matricule |
|-----|-------|--------------|-----------|
| Sylvie Mba | nurse.mba@sogara.com | MbaSI@2024 | INF-025 |
| Patricia Nze | nurse.nze@sogara.com | NzeUrg@2024 | INF-028 |
| Claire Andeme | nurse.andeme@sogara.com | Andeme@Mat2024 | INF-030 |

### 🔬 AUTRES PROFESSIONNELS (3)

| Nom | Email | Mot de passe | Rôle | Matricule |
|-----|-------|--------------|------|-----------|
| André Moussavou | lab.tech@sogara.com | LabSOGARA@2024 | Technicien Labo | LAB-008 |
| Dr. Lydie Kombila | pharma@sogara.com | PharmaSOGARA@24 | Pharmacien | PHAR-004 |
| Nadège Oyono | accueil@sogara.com | AccueilSOGARA@24 | Réceptionniste | REC-002 |

---

## ✅ Test Rapide

### Page de connexion
```
http://localhost:8080/login/professional
```

### Test Admin
- Email: `admin@sogara.com`
- Password: `Admin@SOGARA2024`

### Test Médecin
- Email: `dr.okemba@sogara.com`
- Password: `Okemba@2024Med`

---

## 🔧 En cas de problème

### 1. Vérifier l'existence du compte
```sql
SELECT * FROM auth.users WHERE email = 'admin@sogara.com';
```

### 2. Créer le compte manuellement
Dans Supabase > Authentication > Users > Add User :
- Saisir email et password
- Cocher "Auto Confirm User"
- Cliquer "Create User"

### 3. Configurer le profil
Après création, exécuter dans SQL Editor :
```sql
-- Remplacer 'EMAIL_DU_COMPTE' par l'email réel
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'EMAIL_DU_COMPTE';
  
  IF v_user_id IS NOT NULL THEN
    -- Créer le profil
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (v_user_id, 'NOM_COMPLET', 'EMAIL_DU_COMPTE')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
    
    -- Assigner le rôle (doctor, medical_staff, laboratory, pharmacy, hospital)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'ROLE_APPROPRIE')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
```

---

## 📍 Accès Rapide

### Gestion SOGARA (Super Admin)
```
http://localhost:8080/admin/establishments/sogara
```

### Page publique SOGARA
```
http://localhost:8080/sogara
```

### Dashboard professionnel (après connexion)
```
http://localhost:8080/dashboard/professional
```
