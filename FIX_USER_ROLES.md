# 🔧 Correction : Attribution des Rôles Manquants

## 🐛 Problème Identifié

Les comptes professionnels et établissements apparaissent dans la section "Patients" car **ils n'ont pas de rôle assigné** dans la table `user_roles`.

### Comptes Affectés
```
✅ Marie OKOME (patient.demo@sante.ga) - OK
✅ Gueylord Asted (iasted@me.com) - OK

❌ Clinique Sainte-Marie (clinique.demo@sante.ga) - PAS DE RÔLE
❌ Centre d'Imagerie (radiologie.demo@sante.ga) - PAS DE RÔLE
❌ Dr. Daniel IBINGA (radiologue.demo@sante.ga) - PAS DE RÔLE
❌ Claire NDONG (labo.demo@sante.ga) - PAS DE RÔLE
❌ Jean MOUSSAVOU (pharmacien.demo@sante.ga) - PAS DE RÔLE
❌ Dr. François OVONO (anesthesiste.demo@sante.ga) - PAS DE RÔLE
❌ Dr. Joseph MENGUE (ophtalmo.demo@sante.ga) - PAS DE RÔLE
❌ Alice BOULINGUI (psychologue.demo@sante.ga) - PAS DE RÔLE
❌ Marc MOUNGUENGUI (kine.demo@sante.ga) - PAS DE RÔLE
❌ Grace ONDO (sagefemme.demo@sante.ga) - PAS DE RÔLE
❌ Sophie MBOUMBA (infirmiere.demo@sante.ga) - PAS DE RÔLE
❌ Dr. Sylvie NGUEMA (specialiste.demo@sante.ga) - PAS DE RÔLE
```

---

## ✅ Solutions Implémentées

### 1. **Filtrage Renforcé**
Les deux pages (`PatientsManagement` et `ProfessionalsManagement`) excluent maintenant **explicitement** les comptes sans rôle.

```typescript
// PatientsManagement.tsx
const patientProfiles = profiles?.filter(p => {
  const userRoles = rolesData?.filter(r => r.user_id === p.id) || [];
  if (userRoles.length === 0) return false; // ⛔ Exclure si pas de rôle
  return patientUsers.includes(p.id);
});
```

### 2. **Logs de Débogage**
Console logs pour identifier les comptes problématiques :
- `⚠️ Compte sans rôle: email@example.com`
- `🚫 Non-patient exclu: email@example.com (rôle: doctor)`

---

## 🔧 Correction dans Supabase

### Script SQL à Exécuter

```sql
-- Assigner les rôles manquants aux comptes démo

-- 1. Comptes professionnels
INSERT INTO user_roles (user_id, role)
SELECT id, 'specialist' FROM profiles WHERE email = 'specialiste.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'nurse' FROM profiles WHERE email = 'infirmiere.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'midwife' FROM profiles WHERE email = 'sagefemme.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'physiotherapist' FROM profiles WHERE email = 'kine.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'psychologist' FROM profiles WHERE email = 'psychologue.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'ophthalmologist' FROM profiles WHERE email = 'ophtalmo.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'anesthesiologist' FROM profiles WHERE email = 'anesthesiste.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'pharmacist' FROM profiles WHERE email = 'pharmacien.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'laboratory_technician' FROM profiles WHERE email = 'labo.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'radiologist' FROM profiles WHERE email = 'radiologue.demo@sante.ga'
ON CONFLICT DO NOTHING;

-- 2. Établissements
INSERT INTO user_roles (user_id, role)
SELECT id, 'clinic_admin' FROM profiles WHERE email = 'clinique.demo@sante.ga'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'radiology_center' FROM profiles WHERE email = 'radiologie.demo@sante.ga'
ON CONFLICT DO NOTHING;

-- 3. Vérifier les rôles assignés
SELECT p.email, p.full_name, ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE p.email LIKE '%.demo@sante.ga'
ORDER BY p.email;
```

---

## 🚀 Étapes de Correction

### Option 1 : Via Supabase Dashboard

1. **Allez dans Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   ```

2. **Ouvrez SQL Editor**
   - Cliquez sur "SQL Editor" dans le menu

3. **Copiez-collez le script SQL ci-dessus**

4. **Exécutez le script** (Run)

5. **Vérifiez les résultats**
   ```sql
   SELECT count(*) FROM user_roles;
   ```

### Option 2 : Via Edge Function

Créez une edge function temporaire pour assigner les rôles :

```typescript
// supabase/functions/fix-demo-roles/index.ts
import { createClient } from '@supabase/supabase-js'

const ROLE_MAPPING = {
  'specialiste.demo@sante.ga': 'specialist',
  'infirmiere.demo@sante.ga': 'nurse',
  'sagefemme.demo@sante.ga': 'midwife',
  'kine.demo@sante.ga': 'physiotherapist',
  'psychologue.demo@sante.ga': 'psychologist',
  'ophtalmo.demo@sante.ga': 'ophthalmologist',
  'anesthesiste.demo@sante.ga': 'anesthesiologist',
  'pharmacien.demo@sante.ga': 'pharmacist',
  'labo.demo@sante.ga': 'laboratory_technician',
  'radiologue.demo@sante.ga': 'radiologist',
  'clinique.demo@sante.ga': 'clinic_admin',
  'radiologie.demo@sante.ga': 'radiology_center'
}

serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const results = []
  
  for (const [email, role] of Object.entries(ROLE_MAPPING)) {
    // Trouver l'utilisateur
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    if (profile) {
      // Assigner le rôle
      const { error } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: profile.id, role })
        .onConflict('user_id, role')
        .ignore()
      
      results.push({ email, role, success: !error })
    }
  }
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 📊 Résultat Attendu

### Après Correction

**Section Patients** (`/superadmin/patients`):
```
✅ Gueylord Asted PELLEN-LAKOUMBA (iasted@me.com)
✅ Gueylord asted PELLEN-LAKOUMBA (admin@okatech.fr) - Si rôle patient
✅ Marie OKOME (patient.demo@sante.ga)
```

**Section Professionnels** (`/superadmin/professionals`):
```
✅ Dr. Sylvie NGUEMA (specialiste.demo@sante.ga) 🔵
✅ Sophie MBOUMBA (infirmiere.demo@sante.ga) 🟣
✅ Grace ONDO (sagefemme.demo@sante.ga) 🟣
✅ Marc MOUNGUENGUI (kine.demo@sante.ga) 🟣
✅ Alice BOULINGUI (psychologue.demo@sante.ga) 🟣
✅ Dr. Joseph MENGUE (ophtalmo.demo@sante.ga) 🔵
✅ Dr. François OVONO (anesthesiste.demo@sante.ga) 🔵
✅ Jean MOUSSAVOU (pharmacien.demo@sante.ga) 🟡
✅ Claire NDONG (labo.demo@sante.ga) 🟣
✅ Dr. Daniel IBINGA (radiologue.demo@sante.ga) 🔵
```

**Section Établissements** (future):
```
✅ Clinique Sainte-Marie (clinique.demo@sante.ga) 🔴
✅ Centre d'Imagerie Médicale (radiologie.demo@sante.ga) 🟠
```

---

## 🔍 Vérification Console

Après avoir exécuté le script SQL, rechargez la page `/superadmin/patients` et ouvrez la console (F12) :

```
📊 Rôles chargés: 15 rôles
👥 Patients identifiés: 3 utilisateurs
🚫 Non-patient exclu: specialiste.demo@sante.ga (rôle: specialist)
🚫 Non-patient exclu: infirmiere.demo@sante.ga (rôle: nurse)
🚫 Non-patient exclu: pharmacien.demo@sante.ga (rôle: pharmacist)
... etc ...
✅ Patients finaux: 3
```

---

## ✨ Prochaines Étapes

1. **Exécutez le script SQL** dans Supabase
2. **Rechargez la page** `/superadmin/patients`
3. **Vérifiez la console** pour voir les logs
4. **Testez les deux sections** :
   - Patients : doit avoir 2-3 comptes
   - Professionnels : doit avoir ~10-12 comptes

**Une fois corrigé, tous les comptes seront dans les bonnes sections ! 🎉**

