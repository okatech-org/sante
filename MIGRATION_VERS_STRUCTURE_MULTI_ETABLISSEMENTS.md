# Migration vers la Structure Multi-Établissements SOGARA

## ✅ Modifications effectuées

### 1. **Remplacement du Layout** 
Toutes les pages SOGARA utilisent maintenant `ProfessionalEstablishmentLayout` au lieu de `SogaraDashboardLayout` :

- ✅ `/src/pages/establishments/sogara/admin/SogaraDashboard.tsx`
- ✅ `/src/pages/establishments/sogara/SogaraConsultations.tsx`
- ✅ `/src/pages/establishments/sogara/SogaraStaff.tsx`
- ✅ `/src/pages/establishments/sogara/SogaraTechnical.tsx`
- ✅ `/src/pages/establishments/sogara/SogaraHospitalization.tsx`
- ✅ `/src/pages/establishments/sogara/SogaraWorkMedicine.tsx`
- ✅ `/src/pages/establishments/sogara/SogaraEmployees.tsx`
- ✅ `/src/pages/establishments/sogara/SogaraEmergency.tsx`

### 2. **Script SQL créé**
Un script SQL complet a été créé : `create-sogara-establishment-staff.sql`

Ce script :
- Crée l'établissement SOGARA dans la table `establishments`
- Crée tous les départements (Direction, Admin, Urgences, Cardiologie, etc.)
- Crée les profils professionnels dans la table `professionals`
- Crée les entrées dans `establishment_staff` pour chaque employé
- Configure les permissions appropriées selon le rôle

## 🎯 Nouvelle Structure de Menu

Avec `ProfessionalEstablishmentLayout`, le menu devient automatiquement :

```
📊 Tableau de bord
├── Vue d'ensemble

🏢 Établissements
└── CMST SOGARA
    ├── Administration (si admin)
    │   ├── Personnel
    │   ├── Rapports
    │   └── Paramètres établissement
    │
    └── Activité Médicale (si médecin)
        ├── Consultations
        ├── Rendez-vous
        ├── Prescriptions
        ├── Urgences (selon département)
        └── Mes Patients

⚙️ Paramètres
```

## 📋 Étapes pour activer la nouvelle structure

### Étape 1 : Exécuter le script SQL

Vous devez exécuter le script sur votre base de données Supabase :

**Option A - Via l'interface Supabase :**
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez-collez le contenu de `create-sogara-establishment-staff.sql`
5. Cliquez sur **Run**

**Option B - Via un client Node.js :**
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
const sql = fs.readFileSync('create-sogara-establishment-staff.sql', 'utf8');
supabase.rpc('exec_sql', { sql_query: sql }).then(console.log);
"
```

### Étape 2 : Vérifier les données

Après l'exécution du script, vérifiez que tout s'est bien passé :

```sql
-- Vérifier les établissements
SELECT * FROM establishments WHERE id = 'sogara-cmst-001';

-- Vérifier les départements
SELECT * FROM establishment_departments WHERE establishment_id = 'sogara-cmst-001';

-- Vérifier les professionnels SOGARA
SELECT 
  u.email,
  p.full_name,
  es.role,
  es.position,
  es.status
FROM auth.users u
JOIN professionals p ON p.user_id = u.id
JOIN establishment_staff es ON es.professional_id = p.id
WHERE u.email LIKE '%sogara@sante.ga';
```

### Étape 3 : Tester la connexion

1. Déconnectez-vous si vous êtes connecté
2. Connectez-vous avec un compte SOGARA (ex: `directeur.sogara@sante.ga`)
3. Vous devriez voir le nouveau menu hiérarchique
4. Vérifiez que la navigation fonctionne correctement

## 🎨 Fonctionnalités de la Nouvelle Structure

### Changement de contexte (pour les utilisateurs avec double rôle)

Si un utilisateur a à la fois des permissions administratives et médicales (comme le Directeur), il pourra basculer entre les deux vues via un sélecteur en haut du menu.

### Sélecteur d'établissements

Si un professionnel travaille dans plusieurs établissements, il pourra :
- Voir la liste de tous ses établissements
- Changer d'établissement facilement
- Avoir un menu adapté selon l'établissement sélectionné

### Permissions dynamiques

Le menu s'adapte automatiquement selon :
- Le rôle de l'utilisateur (admin, médecin, infirmier, etc.)
- Son département
- Ses permissions spécifiques
- L'établissement actuel

## 🔧 Configuration des Permissions

Les permissions sont définies dans le script SQL pour chaque rôle :

### Directeur (Dr. DJEKI)
- Toutes les permissions administratives
- Toutes les permissions médicales
- Gestion du personnel
- Accès aux rapports

### Administrateur
- Gestion des RDV
- Gestion du personnel (limité)
- Accès aux rapports

### Médecins
- Consultations
- Prescriptions
- Patients
- Urgences (selon département)

### Infirmiers
- Consultations (lecture seule)
- Patients (lecture seule)
- RDV (lecture seule)

### Autres personnels
- Permissions spécifiques selon leur fonction

## 📊 Avantages de la Nouvelle Structure

1. **Scalabilité** : Facile d'ajouter de nouveaux établissements
2. **Flexibilité** : Menu dynamique selon les permissions
3. **Multi-établissements** : Un professionnel peut travailler dans plusieurs établissements
4. **Sécurité** : Permissions granulaires par module et action
5. **UX améliorée** : Navigation hiérarchique claire

## 🐛 Dépannage

### Problème : "Chargement..." indéfini

**Cause** : Le script SQL n'a pas été exécuté ou a échoué

**Solution** :
1. Vérifiez que le script SQL a été exécuté
2. Vérifiez les logs d'erreur dans Supabase
3. Vérifiez que l'utilisateur existe dans `auth.users`

### Problème : Menu vide

**Cause** : Permissions non définies

**Solution** :
1. Vérifiez que `establishment_staff.permissions` n'est pas null
2. Ré-exécutez le script SQL pour cet utilisateur

### Problème : Erreur 406 sur professionals

**Cause** : Déjà corrigée dans `MultiEstablishmentContext.tsx`

**Solution** : Le code utilise maintenant `.maybeSingle()` au lieu de `.single()`

## 📝 Prochaines Étapes (Optionnel)

1. **Ajouter d'autres établissements** : Dupliquer le pattern SOGARA
2. **Personnaliser les logos** : Ajouter des logos spécifiques par établissement
3. **Ajouter des rôles** : Créer de nouveaux rôles avec permissions custom
4. **Analytics** : Tracker l'utilisation par établissement

## 🎉 Résultat Final

Une fois le script SQL exécuté, les utilisateurs SOGARA auront :

- ✅ Un menu hiérarchique professionnel
- ✅ Une navigation adaptée à leur rôle
- ✅ La possibilité de gérer plusieurs établissements (future extension)
- ✅ Des permissions granulaires
- ✅ Une expérience utilisateur cohérente avec le reste de la plateforme

---

**Note** : Conservez `SogaraDashboardLayout.tsx` pour référence, mais il n'est plus utilisé dans le code actuel.

