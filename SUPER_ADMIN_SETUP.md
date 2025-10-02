# CRITICAL SECURITY: How to Create the First Super Admin

Pour créer le premier compte Super Admin de SANTE.GA, suivez ces étapes :

## 1. Créer un compte utilisateur

Inscrivez-vous normalement via l'interface web à `/register/patient` avec vos informations.

## 2. Attribuer le rôle super_admin

Une fois votre compte créé, vous devez ajouter manuellement le rôle `super_admin` via la base de données Lovable Cloud.

### Via l'interface Lovable Cloud :

1. Cliquez sur "Manage Cloud" dans l'interface Lovable
2. Allez dans "Database" → "Table Editor" → Table `user_roles`
3. Cliquez sur "Insert" → "Insert row"
4. Remplissez :
   - `user_id` : Votre UUID utilisateur (trouvable dans la table `auth.users`)
   - `role` : Sélectionnez `super_admin`
   - Les autres champs sont optionnels
5. Cliquez sur "Save"

### Via SQL (méthode alternative) :

```sql
-- Remplacez 'votre-email@example.com' par votre email d'inscription
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role
FROM auth.users
WHERE email = 'votre-email@example.com';
```

## 3. Vérification

1. Déconnectez-vous et reconnectez-vous
2. Accédez à `/admin` - vous devriez voir le panneau Super Admin
3. Vous pouvez maintenant créer d'autres administrateurs via l'interface

## 4. Rôles disponibles

- `super_admin` : Accès total au système
- `admin` : Gestion des utilisateurs et modération
- `moderator` : Modération de contenu
- `patient` : Utilisateur patient
- `doctor` : Médecin
- `medical_staff` : Personnel médical (infirmier, sage-femme, etc.)
- `pharmacy` : Pharmacie
- `laboratory` : Laboratoire
- `hospital` : Hôpital/Clinique

## Sécurité

**IMPORTANT** : Ne partagez jamais les accès super_admin. Créez des comptes admin séparés pour chaque administrateur.
