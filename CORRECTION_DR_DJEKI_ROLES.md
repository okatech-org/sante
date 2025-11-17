# 🔧 Correction des Rôles du Dr. Jules DJEKI

## 🐛 Problèmes Identifiés

1. Le compte du **Dr. Jules DJEKI** (`directeur.sogara@sante.ga`) était redirigé vers le menu réceptionniste alors qu'il possède les rôles **"admin"** et **"médecin"**.
2. L'établissement **CMST SOGARA** n'était pas affiché dans la section "ÉTABLISSEMENTS".
3. Le rôle **"Administrateur"** n'était pas visible/accessible.

## ✅ Solutions Implémentées

### 1. Ajout de "admin" dans la Priorité des Rôles

**Fichiers modifiés :**
- `src/components/layout/ProfessionalEstablishmentLayout.tsx`
- `src/contexts/MultiEstablishmentContext.tsx`

**Changement :**
```typescript
// Avant
const rolePriority = ['director', 'doctor', 'pharmacist', 'laborantin', 'nurse', 'receptionist'];

// Après
const rolePriority = ['admin', 'director', 'doctor', 'pharmacist', 'laborantin', 'nurse', 'receptionist'];
```

### 2. Fonction de Mapping des Rôles

Ajout d'une fonction `mapRoleToFrontend()` pour convertir les rôles de la base de données vers les rôles frontend :

```typescript
const mapRoleToFrontend = (dbRole: string): string => {
  const roleLower = (dbRole || '').toLowerCase();
  
  if (roleLower.includes('admin') || roleLower.includes('administrateur') || roleLower.includes('direction')) {
    return 'admin';
  }
  if (roleLower.includes('directeur') || roleLower.includes('director') || roleLower.includes('médecin en chef') || roleLower.includes('chef')) {
    return 'director';
  }
  if (roleLower.includes('médecin') || roleLower.includes('doctor') || roleLower.includes('medecin')) {
    return 'doctor';
  }
  // ... autres mappings
};
```

**Mapping des rôles :**
- "Médecin en Chef" → `director`
- "Administrateur" / "Admin" → `admin`
- "Médecin" → `doctor`
- "Infirmier" → `nurse`
- "Réceptionniste" → `receptionist`

### 3. Priorisation Intelligente

La logique de sélection du rôle par défaut a été améliorée :

```typescript
// Prioriser admin, director ou doctor plutôt que réceptionniste
const preferredRole = sortedRoles.find(r => ['admin', 'director', 'doctor'].includes(r)) 
  || sortedRoles[0] 
  || 'doctor'; // Ne jamais tomber sur 'receptionist' par défaut
```

### 4. Script SQL de Correction Complet

**Fichier créé :** `supabase/fix-dr-djeki-roles.sql`

Ce script :
- ✅ Crée l'établissement **CMST SOGARA** s'il n'existe pas
- ✅ Crée le professional pour le Dr. Jules DJEKI s'il n'existe pas
- ✅ Crée **DEUX entrées** dans `establishment_staff` :
  - **"Médecin en Chef"** avec `is_admin = false`, `is_department_head = true`
  - **"Administrateur"** avec `is_admin = true`, `is_department_head = true`
- ✅ Assigne le rôle `doctor` dans `user_roles`
- ✅ Configure les permissions complètes pour chaque rôle

## 🚀 Étapes de Correction

### 1. Exécuter le Script SQL

```sql
-- Fichier: supabase/fix-dr-djeki-roles.sql
```

**Via Supabase Dashboard :**
1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Copiez-collez le contenu du fichier
4. Cliquez sur **Run**

### 2. Vérification

Le script affichera :
- ✅ User ID
- ✅ Profile ID
- ✅ Professional ID
- ✅ Établissement ID
- ✅ Staff Record ID
- ✅ Rôle dans `establishment_staff`: "Médecin en Chef"
- ✅ Rôle dans `user_roles`: "doctor"

### 3. Test de Connexion

Une fois le script exécuté :

1. **Déconnectez-vous** du compte `directeur.sogara@sante.ga`
2. **Reconnectez-vous** avec :
   - Email : `directeur.sogara@sante.ga`
   - Mot de passe : `DirecteurSOGARA2024!`
3. **Vérifiez** que :
   - Le menu affiché est celui du **Médecin en Chef** (ou Admin/Doctor)
   - Le menu réceptionniste n'est **pas** affiché par défaut
   - Vous pouvez basculer entre les rôles si vous en avez plusieurs

## 📊 Rôles et Permissions

### Rôles dans `establishment_staff`

#### 1. Rôle "Médecin en Chef"
- **Rôle** : "Médecin en Chef"
- **Poste** : "Médecin en Chef"
- **Département** : "Direction Médicale"
- **Admin** : `false`
- **Chef de département** : `true`
- **Permissions** :
  - `consultations`
  - `prescriptions`
  - `dossiers_medicaux`
  - `view_statistics`

#### 2. Rôle "Administrateur"
- **Rôle** : "Administrateur"
- **Poste** : "Administrateur"
- **Département** : "Direction"
- **Admin** : `true`
- **Chef de département** : `true`
- **Permissions** :
  - `all_access`
  - `manage_staff`
  - `view_statistics`
  - `manage_appointments`
  - `issue_prescriptions`
  - `view_financial_data`
  - `manage_establishment`

### Rôle dans `user_roles`
- **Rôle** : `doctor`

### Établissement
- **Nom** : CMST SOGARA
- **Type** : `clinic`
- **Secteur** : `prive`
- **Ville** : Port-Gentil
- **Province** : Ogooué-Maritime

## 🎯 Menu Affiché

Selon le rôle sélectionné :

- **"Administrateur"** (admin) → `DIRECTOR_MENU` (menu complet avec gestion)
- **"Médecin en Chef"** (director) → `DIRECTOR_MENU`
- **"Médecin"** (doctor) → `DOCTOR_MENU`

Le menu réceptionniste ne sera affiché **que si** l'utilisateur a explicitement le rôle "réceptionniste" et **aucun autre rôle** de priorité supérieure.

## 🏥 Affichage de l'Établissement

Après exécution du script, la section **"ÉTABLISSEMENTS"** dans la sidebar affichera :

- ✅ **CMST SOGARA** (établissement actif)
  - **Administrateur** (rôle admin, avec badge "Admin")
  - **Médecin en Chef** (rôle director)

L'utilisateur pourra basculer entre ces deux rôles en cliquant sur l'un ou l'autre dans la sidebar.

## ⚠️ Notes Importantes

1. **Mapping des rôles** : La fonction `mapRoleToFrontend()` convertit automatiquement les rôles de la base de données vers les rôles frontend. Cela permet de gérer les variations de libellés.

2. **Priorité** : L'ordre de priorité est maintenant :
   ```
   admin > director > doctor > pharmacist > laborantin > nurse > receptionist
   ```

3. **Fallback** : Si aucun rôle n'est trouvé, le système utilise `'doctor'` par défaut au lieu de `'receptionist'`.

4. **Multi-rôles** : Si un utilisateur a plusieurs rôles, le système sélectionne automatiquement le rôle de priorité la plus élevée.

## 🔍 Vérification Post-Correction

Exécutez cette requête pour vérifier :

```sql
SELECT 
  u.email,
  p.full_name,
  ur.role as user_role,
  e.name as establishment_name,
  es.role as staff_role,
  es.role_category,
  es.can_manage_staff,
  es.can_access_all_records
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.professionals pr ON pr.profile_id = p.id
LEFT JOIN public.establishment_staff es ON es.professional_id = pr.id
LEFT JOIN public.establishments e ON e.id = es.establishment_id
WHERE u.email = 'directeur.sogara@sante.ga';
```

Vous devriez voir :
- ✅ Un compte dans `auth.users`
- ✅ Un profil dans `public.profiles`
- ✅ Un professional dans `public.professionals`
- ✅ Un rôle `doctor` dans `public.user_roles`
- ✅ L'établissement CMST SOGARA dans `public.establishments`
- ✅ **DEUX** associations dans `establishment_staff` :
  - Une avec `role_in_establishment = 'Médecin en Chef'` et `is_admin = false`
  - Une avec `role_in_establishment = 'Administrateur'` et `is_admin = true`
- ✅ Toutes les permissions activées

