# 🧪 Guide de Test - Implémentation SOGARA

## 📌 Prérequis

- Serveur dev lancé : `npm run dev`
- Accès super-admin pour la gestion démo
- Compte Supabase actif avec données de test

---

## 🚀 Scénario de Test Complet

### 1️⃣ Initialiser les Comptes Démo

```bash
# 1. Démarrer le serveur
npm run dev

# 2. Naviguer vers :
# http://localhost:8080/superadmin/demo
#    ou
# http://localhost:8080/admin/demo
```

**Actions** :
1. Cliquer le bouton **"Initialiser"**
2. Attendre confirmation "Comptes démo initialisés"
3. Un dialog affiche les mots de passe générés

---

### 2️⃣ Tester les Redirections des Comptes Démo

#### Test A : Patient → `/dashboard/patient`
1. **Compte** : Marie OKOME (Patient)
2. **Email** : `patient.demo@sante.ga`
3. **Mot de passe** : `demo123` (ou regarder dans le dialog)
4. **Action** : Cliquer "Connexion rapide" (icône ▶)
5. **Résultat Attendu** : ✅ Redirigé vers `/dashboard/patient`
   - Affiche le dashboard patient (profil, RDV, DMP)
   - URL de la barre d'adresse : `http://localhost:8080/dashboard/patient`

**✅ Test Passed** si :
- Dashboard patient visible
- Pas de redirection vers hôpital
- Pas de message d'erreur

---

#### Test B : CHU Owendo → `/demo/hospital`
1. **Compte** : CHU Owendo (Hospital Admin)
2. **Email** : `hopital.demo@sante.ga`
3. **Action** : Cliquer "Connexion rapide"
4. **Résultat Attendu** : ✅ Redirigé vers `/demo/hospital`
   - Affiche dashboard hôpital (lits, services, urgences)
   - URL : `http://localhost:8080/demo/hospital`

---

#### Test C : Clinique Sainte-Marie → `/demo/clinic`
1. **Compte** : Clinique Sainte-Marie (Clinic Admin)
2. **Email** : `clinique.demo@sante.ga`
3. **Action** : Cliquer "Connexion rapide"
4. **Résultat Attendu** : ✅ Redirigé vers `/demo/clinic`
   - Affiche dashboard clinique
   - URL : `http://localhost:8080/demo/clinic`

---

#### Test D : Hôpital de SOGARA → `/demo/sogara` ⭐ NOUVEAU
1. **Compte** : Hôpital de SOGARA (SOGARA Admin)
2. **Email** : `sogara.demo@sante.ga`
3. **Action** : Cliquer "Connexion rapide"
4. **Résultat Attendu** : ✅ Redirigé vers `/demo/sogara`
   - Affiche dashboard SOGARA
   - URL : `http://localhost:8080/demo/sogara`
   - **Infos à vérifier** :
     - Nom : "Hôpital de SOGARA (Port-Gentil)" ✓
     - Type : "Hôpital privé" ✓
     - Localisation : Port-Gentil, Ogooué-Maritime ✓
     - GPS : -0.681398, 8.772557 ✓
     - Lits : 200 ✓
     - Services : Urgences, Maternité, etc. ✓

---

### 3️⃣ Vérifier le Profil Établissement en BD

**Action** : Connexion à Supabase console

```sql
-- Vérifier que SOGARA existe
SELECT id, raison_sociale, ville, province, latitude, longitude, secteur
FROM public.establishments
WHERE raison_sociale LIKE '%SOGARA%';
```

**Résultat Attendu** :
```
id           | raison_sociale      | ville       | province            | latitude  | longitude | secteur
-------------|---------------------|-------------|---------------------|-----------|-----------|--------
[UUID]       | Hôpital de SOGARA   | Port-Gentil | Ogooué-Maritime     | -0.681398 | 8.772557  | prive
```

---

```sql
-- Vérifier les permissions admin
SELECT user_id, role, permissions, actif
FROM public.establishment_users
WHERE establishment_id = (
  SELECT id FROM public.establishments
  WHERE raison_sociale LIKE '%SOGARA%'
);
```

**Résultat Attendu** :
```
user_id         | role            | permissions                                     | actif
----------------|-----------------|------------------------------------------------|-------
[UUID sagara]   | administrateur  | {"manage_staff":true, ...}                     | true
```

---

### 4️⃣ Test d'Interface

#### Sur le Dashboard SOGARA
1. **Header** : Affiche "Hôpital de SOGARA" (Port-Gentil) ✓
2. **Onglets** : Overview, Admissions, Urgences, Pharmacie, etc. ✓
3. **Statistiques** :
   - Lits : 200 total, X occupés
   - Blocs : 4 opératoires
   - Urgences : Stats temps réel
4. **Services** : List des services avec horaires ✓

#### Navigation
- Peut cliquer sur les sous-pages (Urgences, Finances, Patients) ✓
- Peut charger données sans erreur ✓

---

## 🔧 Cas de Test Avancés

### Edge Case 1 : Créer Plusieurs Fois les Comptes

**Scénario** :
1. Cliquer "Initialiser" → crée comptes
2. Attendre quelques secondes
3. Cliquer "Initialiser" à nouveau

**Résultat Attendu** :
- ✅ Les comptes existants sont mis à jour (pas d'erreur duplicate)
- ✅ Les établissements ne sont pas en double
- ✅ Message : "Comptes démo mis à jour"

---

### Edge Case 2 : Oublié mot de passe

**Scénario** :
1. Note : `sogara.demo@sante.ga`
2. Clique "Initialiser" → copie le mot de passe du dialog
3. Cliquer "Actualiser" (ou attendre)
4. Cliquer "Initialiser" à nouveau → affiche nouveaux mots de passe

**Résultat Attendu** :
- ✅ Les mots de passe sont régénérés
- ✅ Ancien mot de passe ne fonctionne plus (nouveau mdp = seul valide)
- ✅ Peut se reconnecter avec nouveau mot de passe

---

## ✅ Checklist de Validation

### Avant Correction
- [ ] Patient redirigé vers `/demo/hospital` ❌ (BUG)

### Après Correction
- [x] Patient redirigé vers `/dashboard/patient` ✅
- [x] Hospital redirigé vers `/demo/hospital` ✅
- [x] Clinic redirigé vers `/demo/clinic` ✅
- [x] SOGARA redirigé vers `/demo/sogara` ✅ **NOUVEAU**
- [x] Compte SOGARA visible dans liste démo ✅
- [x] Établissement SOGARA créé en BD ✅
- [x] Dashboard SOGARA affiche correct infos ✅
- [x] Build réussie (no errors) ✅
- [x] Pas de lint errors ✅

---

## 🐛 Debugging

### Si Patient ne va pas au bon endroit
1. Vérifier `handleQuickLogin` dans `AdminDemo.tsx`
2. Vérifier case `patient` existe (ligne ~549)
3. Vérifier `navigate('/dashboard/patient')` est appelé
4. Vérifier l'URL dans la barre d'adresse

### Si SOGARA ne se redirige pas
1. Vérifier compte `sogara.demo@sante.ga` existe dans AdminDemo.tsx
2. Vérifier role = `sogara_admin`
3. Vérifier case `sogara_admin` dans switch (ligne ~600)
4. Vérifier route `/demo/sogara` existe dans App.tsx
5. Vérifier pas d'erreur dans console navigateur

### Si Établissement SOGARA ne se crée pas en BD
1. Vérifier Supabase function `create-demo-accounts` est à jour
2. Vérifier role `sogara_admin` géré dans la fonction
3. Regarder les logs Supabase (Logs > Functions)
4. Vérifier les permissions de la fonction

---

## 📞 Support

Pour un problème ou question :
1. Vérifier checklist de validation ✅
2. Regarder les logs console (F12 > Console)
3. Vérifier les logs Supabase
4. Créer issue avec :
   - ❌ Comportement observé
   - ✅ Comportement attendu
   - 🔍 Étapes pour reproduire
   - 📸 Screenshot si applicable

---

**Dernière mise à jour** : Octobre 2024
**Version testée** : 1.0
**Status** : ✅ READY FOR TESTING
