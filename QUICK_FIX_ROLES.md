# ⚡ Correction Rapide : Assigner les Rôles Démo

## 🎯 Problème
Les comptes professionnels apparaissent encore dans `/superadmin/patients` car **ils n'ont pas de rôle assigné** dans la table `user_roles`.

---

## ✅ Solution 1 : Via l'Interface Web (RECOMMANDÉ)

### Étape 1 : Allez sur la page
```
http://localhost:8081/superadmin/fix-roles
```

### Étape 2 : Cliquez sur le bouton
**"Corriger les Rôles Démo"**

### Étape 3 : Attendez les résultats
Vous verrez en temps réel :
- ✅ Rôle assigné avec succès
- ✅ Rôle déjà présent
- ❌ Erreur (si le profil n'existe pas)

### Étape 4 : Vérifiez
Rechargez :
- `http://localhost:8081/superadmin/patients` → Seulement 2-3 patients
- `http://localhost:8081/superadmin/professionals` → 12 professionnels groupés

---

## ✅ Solution 2 : Via SQL (Si la page ne fonctionne pas)

### Étape 1 : Allez dans Supabase Dashboard
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

### Étape 2 : Ouvrez SQL Editor
Cliquez sur "SQL Editor" dans le menu

### Étape 3 : Copiez-collez ce script
```sql
-- Assigner les rôles aux comptes démo
INSERT INTO user_roles (user_id, role)
SELECT id, 'specialist' FROM profiles WHERE email = 'specialiste.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'nurse' FROM profiles WHERE email = 'infirmiere.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'midwife' FROM profiles WHERE email = 'sagefemme.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'physiotherapist' FROM profiles WHERE email = 'kine.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'psychologist' FROM profiles WHERE email = 'psychologue.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'ophthalmologist' FROM profiles WHERE email = 'ophtalmo.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'anesthesiologist' FROM profiles WHERE email = 'anesthesiste.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'pharmacist' FROM profiles WHERE email = 'pharmacien.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'laboratory_technician' FROM profiles WHERE email = 'labo.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'radiologist' FROM profiles WHERE email = 'radiologue.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'clinic_admin' FROM profiles WHERE email = 'clinique.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'radiology_center' FROM profiles WHERE email = 'radiologie.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'doctor' FROM profiles WHERE email = 'medecin.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'patient' FROM profiles WHERE email = 'patient.demo@sante.ga'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Étape 4 : Cliquez sur "Run"

### Étape 5 : Vérifiez avec cette requête
```sql
SELECT 
  p.email, 
  p.full_name, 
  ur.role,
  CASE 
    WHEN ur.role IS NULL THEN '❌ PAS DE RÔLE'
    WHEN ur.role = 'patient' THEN '✅ PATIENT'
    ELSE '✅ PROFESSIONNEL'
  END as status
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE p.email LIKE '%.demo@sante.ga'
ORDER BY p.email;
```

**Résultat Attendu :**
```
anesthesiste.demo@sante.ga | Dr. François OVONO    | anesthesiologist      | ✅ PROFESSIONNEL
clinique.demo@sante.ga     | Clinique Sainte-Marie | clinic_admin          | ✅ PROFESSIONNEL
infirmiere.demo@sante.ga   | Sophie MBOUMBA        | nurse                 | ✅ PROFESSIONNEL
kine.demo@sante.ga         | Marc MOUNGUENGUI      | physiotherapist       | ✅ PROFESSIONNEL
labo.demo@sante.ga         | Claire NDONG          | laboratory_technician | ✅ PROFESSIONNEL
medecin.demo@sante.ga      | Dr. Pierre KOMBILA    | doctor                | ✅ PROFESSIONNEL
ophtalmo.demo@sante.ga     | Dr. Joseph MENGUE     | ophthalmologist       | ✅ PROFESSIONNEL
patient.demo@sante.ga      | Marie OKOME           | patient               | ✅ PATIENT
pharmacien.demo@sante.ga   | Jean MOUSSAVOU        | pharmacist            | ✅ PROFESSIONNEL
psychologue.demo@sante.ga  | Alice BOULINGUI       | psychologist          | ✅ PROFESSIONNEL
radiologie.demo@sante.ga   | Centre d'Imagerie     | radiology_center      | ✅ PROFESSIONNEL
radiologue.demo@sante.ga   | Dr. Daniel IBINGA     | radiologist           | ✅ PROFESSIONNEL
sagefemme.demo@sante.ga    | Grace ONDO            | midwife               | ✅ PROFESSIONNEL
specialiste.demo@sante.ga  | Dr. Sylvie NGUEMA     | specialist            | ✅ PROFESSIONNEL
```

---

## 🔍 Vérification Console

Après avoir exécuté le script, ouvrez la console (F12) sur `/superadmin/patients` :

```
📊 Rôles chargés: 14 rôles
👥 Patients identifiés: 1 utilisateurs

🚫 Non-patient exclu: anesthesiste.demo@sante.ga (rôle: anesthesiologist)
🚫 Non-patient exclu: clinique.demo@sante.ga (rôle: clinic_admin)
🚫 Non-patient exclu: infirmiere.demo@sante.ga (rôle: nurse)
🚫 Non-patient exclu: kine.demo@sante.ga (rôle: physiotherapist)
🚫 Non-patient exclu: labo.demo@sante.ga (rôle: laboratory_technician)
🚫 Non-patient exclu: medecin.demo@sante.ga (rôle: doctor)
🚫 Non-patient exclu: ophtalmo.demo@sante.ga (rôle: ophthalmologist)
🚫 Non-patient exclu: pharmacien.demo@sante.ga (rôle: pharmacist)
🚫 Non-patient exclu: psychologue.demo@sante.ga (rôle: psychologist)
🚫 Non-patient exclu: radiologie.demo@sante.ga (rôle: radiology_center)
🚫 Non-patient exclu: radiologue.demo@sante.ga (rôle: radiologist)
🚫 Non-patient exclu: sagefemme.demo@sante.ga (rôle: midwife)
🚫 Non-patient exclu: specialiste.demo@sante.ga (rôle: specialist)

✅ Patients finaux: 1
```

---

## 📊 Résultat Final

### Section Patients (`/superadmin/patients`)
```
✅ Marie OKOME (patient.demo@sante.ga)
✅ Gueylord Asted PELLEN-LAKOUMBA (iasted@me.com)
✅ Gueylord asted PELLEN-LAKOUMBA (admin@okatech.fr) - si rôle patient
```

### Section Professionnels (`/superadmin/professionals`)

#### 🔵 Médecins Généralistes (1)
```
✅ Dr. Pierre KOMBILA (medecin.demo@sante.ga)
```

#### 🔵 Médecins Spécialistes (4)
```
✅ Dr. Sylvie NGUEMA (specialiste.demo@sante.ga)
✅ Dr. Joseph MENGUE (ophtalmo.demo@sante.ga)
✅ Dr. François OVONO (anesthesiste.demo@sante.ga)
✅ Dr. Daniel IBINGA (radiologue.demo@sante.ga)
```

#### 🟣 Personnel Paramédical (5)
```
✅ Sophie MBOUMBA (infirmiere.demo@sante.ga)
✅ Grace ONDO (sagefemme.demo@sante.ga)
✅ Marc MOUNGUENGUI (kine.demo@sante.ga)
✅ Alice BOULINGUI (psychologue.demo@sante.ga)
✅ Claire NDONG (labo.demo@sante.ga)
```

#### 🟡 Pharmaciens (1)
```
✅ Jean MOUSSAVOU (pharmacien.demo@sante.ga)
```

#### 🔴 Administrateurs Médicaux (2)
```
✅ Clinique Sainte-Marie (clinique.demo@sante.ga)
✅ Centre d'Imagerie Médicale (radiologie.demo@sante.ga)
```

---

## ⚡ ACTION IMMÉDIATE

**Choisissez UNE des deux options :**

### Option A (Recommandé) :
1. Allez sur `http://localhost:8081/superadmin/fix-roles`
2. Cliquez sur le bouton
3. Attendez les résultats
4. Rechargez les pages

### Option B (Si Option A ne fonctionne pas) :
1. Copiez le script SQL ci-dessus
2. Allez dans Supabase Dashboard > SQL Editor
3. Collez et exécutez
4. Vérifiez avec la requête de vérification
5. Rechargez les pages

---

**⏱️ Temps estimé : 2 minutes**

**Après ça, TOUS vos comptes seront dans les bonnes sections ! 🎉**

