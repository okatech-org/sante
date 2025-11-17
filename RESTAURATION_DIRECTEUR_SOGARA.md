# 🔧 Restauration du Compte Directeur CMST SOGARA

## 📋 Informations du Compte

- **Email** : `directeur.sogara@sante.ga`
- **Mot de passe** : `DirecteurSOGARA2024!`
- **Rôle** : Médecin en Chef
- **Établissement** : CMST SOGARA

## 🚀 Étapes de Restauration

### 1. Exécuter le Script SQL

Exécutez le script SQL dans Supabase :

```sql
-- Fichier: supabase/restore-directeur-sogara-account.sql
```

**Méthode 1 : Via Supabase Dashboard**
1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Copiez-collez le contenu du fichier `supabase/restore-directeur-sogara-account.sql`
4. Cliquez sur **Run**

**Méthode 2 : Via CLI**
```bash
supabase db execute -f supabase/restore-directeur-sogara-account.sql
```

### 2. Vérification

Le script affichera un message de confirmation avec :
- ✅ User ID créé/mis à jour
- ✅ Profil créé/mis à jour
- ✅ Rôle `doctor` assigné
- ✅ Établissement CMST SOGARA associé
- ✅ Rôle "Médecin en Chef" dans `establishment_staff`

### 3. Connexion

Une fois le script exécuté, vous pouvez vous connecter avec :

- **URL** : `/login/professional` ou `/login/sogara`
- **Email** : `directeur.sogara@sante.ga`
- **Mot de passe** : `DirecteurSOGARA2024!`

## 📊 Permissions du Compte

Le compte "Médecin en Chef" dispose des permissions suivantes :

- ✅ **Gestion du personnel** (`can_manage_staff`)
- ✅ **Accès à tous les dossiers** (`can_access_all_records`)
- ✅ **Gestion des rendez-vous** (`can_manage_appointments`)
- ✅ **Émission de prescriptions** (`can_issue_prescriptions`)
- ✅ **Consultation des données financières** (`can_view_financial_data`)

## 🎯 Rôles et Associations

- **Rôle utilisateur** : `doctor` (dans `user_roles`)
- **Rôle établissement** : `Médecin en Chef` (dans `establishment_staff`)
- **Catégorie** : `medical`
- **Type de contrat** : `permanent`
- **Statut** : `active`

## 🔄 Mise à Jour des Traductions

Les traductions ont été mises à jour dans `src/contexts/LanguageContext.tsx` :

- **Français** : "Médecin en Chef"
- **Anglais** : "Chief Medical Officer"
- **Espagnol** : "Médico Jefe"
- **Arabe** : "الطبيب الرئيسي"
- **Portugais** : "Médico Chefe"

## ⚠️ Notes Importantes

1. Le script est **idempotent** : il peut être exécuté plusieurs fois sans créer de doublons
2. Si le compte existe déjà, le mot de passe sera réinitialisé
3. Le profil et les associations seront mis à jour si nécessaire
4. L'établissement CMST SOGARA sera créé s'il n'existe pas déjà

## 🐛 Dépannage

Si vous rencontrez des erreurs :

1. **Vérifiez que l'extension `pgcrypto` est activée** :
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```

2. **Vérifiez les permissions** : Assurez-vous d'avoir les droits d'écriture sur les tables `auth.users`, `public.profiles`, `public.user_roles`, `public.professionals`, `public.establishments`, et `public.establishment_staff`

3. **Vérifiez les contraintes** : Si des erreurs de contraintes apparaissent, vérifiez que les données existantes ne violent pas les règles de l'établissement

## ✅ Vérification Post-Restauration

Exécutez cette requête pour vérifier que tout est correct :

```sql
SELECT 
  u.id as auth_user_id,
  u.email,
  u.email_confirmed_at,
  p.id as profile_id,
  p.full_name,
  ur.role as user_role,
  e.name as establishment_name,
  es.role as staff_role,
  es.role_category,
  es.permissions
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.establishment_staff es ON es.professional_id = p.id
LEFT JOIN public.establishments e ON e.id = es.establishment_id
WHERE u.email = 'directeur.sogara@sante.ga';
```

Vous devriez voir :
- ✅ Un compte dans `auth.users`
- ✅ Un profil dans `public.profiles`
- ✅ Un rôle `doctor` dans `public.user_roles`
- ✅ Une association avec CMST SOGARA dans `establishment_staff`
- ✅ Le rôle "Médecin en Chef" dans `establishment_staff.role`

