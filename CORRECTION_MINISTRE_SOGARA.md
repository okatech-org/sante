# 🔧 Correction : Établissement du Ministre

## 📋 Problème Identifié

Le compte `ministre@sante.gouv.ga` (Pr. Adrien MOUGOUGOU) est actuellement :
- ❌ Lié à **CMST SOGARA** (clinique privée)
- ❌ Configuré comme **réceptionniste**

Il devrait être :
- ✅ Lié au **Ministère de la Santé Publique**
- ✅ Avec le titre **Ministre de la Santé**
- ✅ Rôle administratif de **direction**

---

## ✅ Solutions de Correction

### 🌐 Solution 1 : Via Page Web (RECOMMANDÉ)

**Avantages** : Interface graphique simple + Correction complète automatique

1. **Ouvrez la page** : http://localhost:5173/fix-minister-role

2. **Cliquez sur** : "Corriger le Rôle"

3. **Résultat** : 
   - ✅ Rôle `moderator` ajouté
   - ✅ Profil professionnel créé/mis à jour
   - ✅ Établissement "Ministère de la Santé" créé si nécessaire
   - ✅ Affiliations SOGARA supprimées
   - ✅ Affiliation au Ministère créée
   - ✅ Titre "Ministre de la Santé" assigné

4. **Reconnectez-vous** pour voir les changements

---

### 🗄️ Solution 2 : Via SQL Direct (RAPIDE - 1 minute)

1. **Allez sur** : https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/sql/new

2. **Copiez le fichier** : `fix-minister-establishment.sql` ou ce SQL :

```sql
DO $$
DECLARE
  ministre_user_id UUID;
  ministre_professional_id UUID;
  ministry_establishment_id UUID;
BEGIN
  -- Trouver le ministre
  SELECT id INTO ministre_user_id
  FROM auth.users
  WHERE email = 'ministre@sante.gouv.ga';

  -- Trouver ou créer le Ministère
  SELECT id INTO ministry_establishment_id
  FROM establishments
  WHERE name ILIKE '%ministère%santé%';

  IF ministry_establishment_id IS NULL THEN
    INSERT INTO establishments (
      name, type, sector, address, city, province,
      phone, email, is_verified, status
    ) VALUES (
      'Ministère de la Santé Publique', 'hospital', 'public',
      'À côté de l''immeuble Alu-Suisse', 'Libreville', 'Estuaire',
      '+241 01-72-26-61', 'contact@sante.gouv.ga', true, 'active'
    )
    RETURNING id INTO ministry_establishment_id;
  END IF;

  -- Trouver le profil professionnel
  SELECT id INTO ministre_professional_id
  FROM professionals
  WHERE profile_id = ministre_user_id;

  -- Supprimer les affiliations existantes
  DELETE FROM professional_affiliations
  WHERE professional_id = ministre_professional_id;
  
  DELETE FROM establishment_staff
  WHERE professional_id = ministre_professional_id;

  -- Créer l'affiliation au Ministère
  INSERT INTO professional_affiliations (
    professional_id, establishment_id, role, department,
    service, status, start_date
  ) VALUES (
    ministre_professional_id, ministry_establishment_id,
    'director', 'Administration', 'Direction Générale',
    'approved', CURRENT_DATE
  );

  INSERT INTO establishment_staff (
    establishment_id, professional_id, role, department,
    status, is_establishment_admin, start_date
  ) VALUES (
    ministry_establishment_id, ministre_professional_id,
    'Ministre de la Santé', 'Direction Générale',
    'active', true, CURRENT_DATE
  );

  RAISE NOTICE '✅ Correction terminée!';
END $$;
```

3. **Cliquez sur** : "Run"

---

## 🔍 Vérification

Après la correction, vérifiez dans Supabase :

### Table `establishments`
```sql
SELECT id, name, type, sector, city
FROM establishments
WHERE name ILIKE '%ministère%';
```
**Résultat attendu** :
- Nom : "Ministère de la Santé Publique"
- Type : hospital
- Secteur : public
- Ville : Libreville

### Table `professional_affiliations`
```sql
SELECT 
  pa.role, pa.department, pa.service, pa.status,
  e.name as establishment
FROM professional_affiliations pa
JOIN professionals p ON p.id = pa.professional_id
JOIN auth.users u ON u.id = p.profile_id
JOIN establishments e ON e.id = pa.establishment_id
WHERE u.email = 'ministre@sante.gouv.ga';
```
**Résultat attendu** :
- Établissement : "Ministère de la Santé Publique"
- Rôle : director
- Département : Administration
- Service : Direction Générale
- Statut : approved

### Table `establishment_staff`
```sql
SELECT 
  es.role, es.department, es.status, es.is_establishment_admin,
  e.name as establishment
FROM establishment_staff es
JOIN establishments e ON e.id = es.establishment_id
JOIN professionals p ON p.id = es.professional_id
JOIN auth.users u ON u.id = p.profile_id
WHERE u.email = 'ministre@sante.gouv.ga';
```
**Résultat attendu** :
- Établissement : "Ministère de la Santé Publique"
- Rôle : "Ministre de la Santé"
- Département : Direction Générale
- Admin : true
- Statut : active

---

## 🎯 Après Correction

### Interface attendue après connexion :

```
SANTE.GA
Espace Professionnel

Pr. Adrien MOUGOUGOU ✅ Vérifié
👤 Administration de la Santé
📋 N° Ordre: MIN-001

📧 ministre@sante.gouv.ga
📞 +241 01-72-26-61

ÉTABLISSEMENTS
🏛️ Ministère de la Santé Publique
```

### Dashboard professionnel :
- **Établissement actif** : Ministère de la Santé Publique
- **Titre** : Ministre de la Santé
- **Département** : Direction Générale
- **Permissions** : Administrateur complet

---

## 🐛 Dépannage

### Le ministre voit toujours SOGARA
1. **Déconnectez-vous complètement**
2. **Videz le cache du navigateur** (Ctrl+Shift+Delete)
3. **Reconnectez-vous**

### Les modifications ne sont pas visibles
- Vérifiez que le script SQL s'est exécuté sans erreur
- Vérifiez les tables avec les requêtes de vérification ci-dessus
- Assurez-vous que le `profile_id` correspond bien au `user_id`

### Erreur "professional_id not found"
Le profil professionnel n'existe pas encore. Exécutez d'abord :
```sql
INSERT INTO professionals (profile_id, profession_type, is_verified)
SELECT id, 'doctor', true
FROM auth.users
WHERE email = 'ministre@sante.gouv.ga'
ON CONFLICT DO NOTHING;
```

---

## 📁 Fichiers Créés

```
/Users/okatech/sante/
├── fix-minister-establishment.sql        # 🆕 Script SQL de correction
├── supabase/functions/
│   └── fix-minister-role/
│       └── index.ts                      # ✅ Edge function mise à jour
└── CORRECTION_MINISTRE_SOGARA.md         # 📖 Ce guide
```

---

## ✅ Checklist de Validation

Après avoir appliqué la correction, vérifiez :

- [ ] Le compte existe : `ministre@sante.gouv.ga`
- [ ] L'email est confirmé
- [ ] Le rôle `moderator` est présent dans `user_roles`
- [ ] Le profil professionnel existe dans `professionals`
- [ ] L'établissement "Ministère de la Santé" existe dans `establishments`
- [ ] L'affiliation au Ministère existe dans `professional_affiliations`
- [ ] L'entrée staff existe dans `establishment_staff`
- [ ] SOGARA n'apparaît plus dans les affiliations
- [ ] Le titre affiché est "Ministre de la Santé"
- [ ] L'établissement affiché est "Ministère de la Santé Publique"

---

**🎉 Une fois la correction appliquée, le ministre sera correctement affilié au Ministère de la Santé !**

**🔗 Connexion** : http://localhost:5173/login/professional  
**📧 Email** : ministre@sante.gouv.ga  
**🔒 Mot de passe** : MinistryGab2025!

