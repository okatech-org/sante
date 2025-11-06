# Restauration du compte Ministre

## Problème
Le compte `ministre@sante.gouv.ga` ne permet plus de se connecter.

## Solution

### 1. Exécuter le script SQL de restauration

Exécutez le fichier `supabase/restore-minister-account.sql` dans votre base de données Supabase :

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Collez le contenu de `supabase/restore-minister-account.sql`
4. Exécutez le script

Ce script va :
- Créer ou mettre à jour le compte dans `auth.users`
- Créer ou mettre à jour le profil dans `public.profiles`
- Assigner le rôle `super_admin` dans `public.user_roles`
- Créer l'établissement "Ministère de la Santé" si nécessaire
- Créer les associations nécessaires

### 2. Identifiants de connexion

Après exécution du script :
- **Email** : `ministre@sante.gouv.ga`
- **Mot de passe** : `Ministre2025!`

### 3. Page de connexion

Utilisez la page `/login/ministry` ou `/ministry/login` pour vous connecter.

### 4. Vérification

Après connexion, vous devriez :
- Voir le dashboard du ministère
- Avoir accès à toutes les fonctionnalités super_admin
- Être associé à l'établissement "Ministère de la Santé"

## Modifications apportées

1. **`src/pages/ministry/LoginMinister.tsx`** :
   - Correction de l'email (de `ministre@sante.ga` à `ministre@sante.gouv.ga`)
   - Migration vers Supabase Auth (au lieu de l'API custom)
   - Amélioration de la gestion des erreurs

2. **`supabase/restore-minister-account.sql`** :
   - Script complet de restauration du compte
   - Création/mise à jour de tous les éléments nécessaires
   - Réinitialisation du mot de passe

## Si le problème persiste

1. Vérifiez que le compte existe dans `auth.users` :
   ```sql
   SELECT id, email, email_confirmed_at 
   FROM auth.users 
   WHERE email = 'ministre@sante.gouv.ga';
   ```

2. Vérifiez que le rôle est assigné :
   ```sql
   SELECT ur.* 
   FROM public.user_roles ur
   JOIN auth.users u ON u.id = ur.user_id
   WHERE u.email = 'ministre@sante.gouv.ga';
   ```

3. Vérifiez que le profil existe :
   ```sql
   SELECT * 
   FROM public.profiles 
   WHERE email = 'ministre@sante.gouv.ga';
   ```

4. Si nécessaire, réinitialisez manuellement le mot de passe via l'interface Supabase Auth.

