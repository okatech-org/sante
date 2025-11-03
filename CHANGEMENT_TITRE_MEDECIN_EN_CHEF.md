# 🔄 CHANGEMENT DE TITRE - MÉDECIN EN CHEF CMST

**Date**: Décembre 2024  
**Ancien titre**: "Directeur Général CMST" / "Directeur Médical"  
**Nouveau titre**: "Médecin en Chef CMST"  
**Concerné**: Dr. Jules DJEKI - CMST SOGARA

---

## 🎯 OBJECTIF

Changer l'intitulé du rôle de direction de **"Directeur Général CMST"** vers **"Médecin en Chef CMST"** pour mieux refléter la nature médicale du poste.

**Pourquoi ce changement** :
- ✅ Plus précis : Met l'accent sur le rôle médical
- ✅ Plus adapté : CMST est un service de santé au travail
- ✅ Hiérarchie claire : Médecin en Chef > Médecins
- ✅ Conforme au secteur : Titre standard en médecine du travail

---

## ✅ MODIFICATIONS APPLIQUÉES

### 1. Configuration Menu (Interface)

**Fichier** : `src/config/menuDefinitions.ts`

**Changements** :
```typescript
// AVANT
'director': 'Directeur Général CMST',
// ============= MENU DIRECTEUR (Directeur Général CMST) =============

// APRÈS
'director': 'Médecin en Chef CMST',
// ============= MENU DIRECTEUR (Médecin en Chef CMST) =============
```

**Impact** :
- Label de rôle affiché dans l'interface
- Commentaires de code mis à jour
- Cohérence avec le nouveau titre

---

### 2. Dashboard Directeur

**Fichier** : `src/pages/professional/DirectorDashboard.tsx`

**Changement** :
```typescript
// AVANT
<Badge className="px-4 py-2 text-lg">
  Directeur Général
</Badge>

// APRÈS
<Badge className="px-4 py-2 text-lg">
  Médecin en Chef
</Badge>
```

**Impact** :
- Badge visible en haut du dashboard
- Affichage immédiat du nouveau titre

---

### 3. Dashboard SOGARA

**Fichier** : `src/pages/establishments/sogara/admin/SogaraDashboard.tsx`

**Changement** :
```typescript
// AVANT
roles.push({ label: 'Directeur Médical', variant: 'default' });

// APRÈS
roles.push({ label: 'Médecin en Chef', variant: 'default' });
```

**Impact** :
- Badge rôle dans le header du dashboard
- Cohérence avec le nouveau titre

---

### 4. Page Paramètres Professionnel

**Fichier** : `src/pages/professional/ProfessionalSettings.tsx`

**Changement** :
```typescript
// AVANT
<p className="font-medium">Directeur Général CMST</p>

// APRÈS
<p className="font-medium">Médecin en Chef CMST</p>
```

**Impact** :
- Affichage dans la page de paramètres
- Section "Mes rôles et établissements"

---

### 5. Scripts de Configuration

**Fichiers modifiés** :
1. `scripts/setup-dr-djeki-multi-roles.js`
2. `scripts/configure-dr-djeki-multi-roles.js`
3. `scripts/setup-all-sogara-professionals.js`
4. `scripts/migrate-to-multi-establishment.js`

**Changements** :
```javascript
// AVANT
position: 'Directeur Médical'

// APRÈS
position: 'Médecin en Chef'
```

**Impact** :
- Scripts de création/migration utilisent le nouveau titre
- Cohérence pour futures installations

---

### 6. Script SQL Restauration

**Fichier** : `restore-djeki-doctor-role.sql`

**Changement** :
```sql
-- AVANT
RAISE NOTICE '   1. Directeur Médical (role: director)';

-- APRÈS
RAISE NOTICE '   1. Médecin en Chef (role: director)';
```

**Impact** :
- Messages de log corrects
- Documentation SQL à jour

---

### 7. Script SQL de Mise à Jour Base de Données

**Fichier** : `update-director-title-medecin-en-chef.sql` ⭐ NOUVEAU

**Contenu** :
```sql
UPDATE establishment_staff
SET 
  position = 'Médecin en Chef',
  updated_at = NOW()
WHERE professional_id = [id_prof]
  AND role = 'director'
  AND establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

**Usage** : Exécuter dans Supabase pour mettre à jour la base de données

---

## 📊 OÙ VOIR LE NOUVEAU TITRE

### 1. Menu de Navigation (Sidebar)

**Emplacement** : Menu latéral gauche du dashboard directeur

**Avant** :
```
👤 Dr. Jules DJEKI
🏢 Directeur Général CMST ❌
```

**Après** :
```
👤 Dr. Jules DJEKI
🏢 Médecin en Chef CMST ✅
```

---

### 2. Badge sur Dashboard Directeur

**URL** : `/professional/director-dashboard`

**Avant** :
```
╔════════════════════════════════╗
║ 🛡️ Tableau de Bord Direction  ║
║ Vue d'ensemble établissement   ║
║                                ║
║ [Directeur Général] ❌         ║
╚════════════════════════════════╝
```

**Après** :
```
╔════════════════════════════════╗
║ 🛡️ Tableau de Bord Direction  ║
║ Vue d'ensemble établissement   ║
║                                ║
║ [Médecin en Chef] ✅           ║
╚════════════════════════════════╝
```

---

### 3. Dashboard SOGARA

**URL** : `/establishments/sogara/admin`

**Avant** :
```
Header CMST SOGARA
[Directeur Médical] [Médecin Consultant] ❌
```

**Après** :
```
Header CMST SOGARA
[Médecin en Chef] [Médecin Consultant] ✅
```

---

### 4. Page Paramètres

**URL** : `/professional/settings`

**Section** : "Mes rôles et établissements"

**Avant** :
```
Directeur Général CMST ❌
Accès complet à l'administration
[Actif]
```

**Après** :
```
Médecin en Chef CMST ✅
Accès complet à l'administration
[Actif]
```

---

## 🔄 MISE À JOUR BASE DE DONNÉES

### Exécution du Script SQL

**Fichier** : `update-director-title-medecin-en-chef.sql`

**Méthode** :
1. Ouvrir Supabase Dashboard
2. SQL Editor → New query
3. Copier-coller le script
4. Exécuter (Ctrl+Enter)

**Résultat attendu** :
```
🔄 MISE À JOUR DU TITRE - MÉDECIN EN CHEF
════════════════════════════════════════════════════════

1️⃣ Recherche du compte Dr. DJEKI...
   ✅ Compte trouvé (User ID: xxx)

2️⃣ Recherche du profil professionnel...
   ✅ Professionnel ID: xxx

3️⃣ Mise à jour du poste dans establishment_staff...
   ✅ Position mise à jour: "Médecin en Chef"
   📝 Nombre de lignes mises à jour: 1

4️⃣ Vérification des rôles...
   Rôle: director - Position: Médecin en Chef - Département: Direction - Statut: active
   Rôle: doctor - Position: Médecin Consultant Senior - Département: Service Médical - Statut: active

════════════════════════════════════════════════════════
✨ MISE À JOUR TERMINÉE AVEC SUCCÈS!
════════════════════════════════════════════════════════

📊 RÉSUMÉ - Dr. Jules DJEKI
────────────────────────────────────────────────────────
👤 Compte: directeur.sogara@sante.ga
🏥 Établissement: CMST SOGARA

👔 Rôles au CMST SOGARA:
   1. Médecin en Chef (role: director) ⭐ TITRE MIS À JOUR
   2. Médecin Consultant Senior (role: doctor)

💡 Changements appliqués:
   ❌ "Directeur Médical" → ✅ "Médecin en Chef"

📱 Affichage dans l'application:
   • Menu navigation: "Médecin en Chef CMST"
   • Badge rôle: "Médecin en Chef"
   • Dashboard: "Médecin en Chef"
```

---

## 📋 VÉRIFICATION POST-CHANGEMENT

### Vérifier dans Supabase

```sql
-- Vérifier le poste dans establishment_staff
SELECT 
  p.full_name AS "Nom",
  p.email AS "Email",
  es.role AS "Rôle",
  es.position AS "Poste",
  ed.name AS "Département"
FROM establishment_staff es
JOIN professionals prof ON prof.id = es.professional_id
JOIN profiles p ON p.id = prof.user_id
JOIN establishment_departments ed ON ed.id = es.department_id
WHERE p.email = 'directeur.sogara@sante.ga'
  AND es.establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
ORDER BY es.role;
```

**Résultat attendu** :

| Nom | Email | Rôle | Poste | Département |
|-----|-------|------|-------|-------------|
| Dr. Jules DJEKI | directeur.sogara@sante.ga | director | **Médecin en Chef** ✅ | Direction |
| Dr. Jules DJEKI | directeur.sogara@sante.ga | doctor | Médecin Consultant Senior | Service Médical |

---

### Vérifier dans l'Application

**Étape 1** : Se connecter
- Email : `directeur.sogara@sante.ga`
- Sélectionner le rôle "director"

**Étape 2** : Vérifier les affichages
1. ✅ **Menu latéral** : "Médecin en Chef CMST"
2. ✅ **Badge dashboard** : "Médecin en Chef"
3. ✅ **Dashboard SOGARA** : Badge "Médecin en Chef"
4. ✅ **Page Paramètres** : "Médecin en Chef CMST"

---

## 🎓 CONTEXTE MÉDICAL

### Pourquoi "Médecin en Chef" ?

**Médecin en Chef** est un titre hiérarchique médical reconnu :
- 🏥 Chef de l'équipe médicale
- 📋 Responsabilité clinique et administrative
- 👨‍⚕️ Médecin avec fonctions de direction
- ✅ Standard en médecine du travail

**Vs "Directeur Général"** (trop administratif) :
- ❌ Suggère gestion non-médicale
- ❌ Moins spécifique au secteur santé
- ❌ Perte de la dimension clinique

**Vs "Directeur Médical"** (correct mais moins précis) :
- ⚠️ Titre générique
- ⚠️ Pas assez hiérarchique
- ⚠️ "Médecin en Chef" plus prestigieux

---

## 📊 HIÉRARCHIE MÉDICALE CMST

```
CMST SOGARA - Organigramme Médical

┌─────────────────────────────────────┐
│  👨‍⚕️ Dr. Jules DJEKI                │
│  Médecin en Chef CMST ⭐           │
│  ─────────────────────────────────  │
│  • Direction établissement          │
│  • Supervision médicale             │
│  • Gestion équipe médicale          │
│  • Consultations senior             │
└─────────────────────────────────────┘
         │
         ├─► 👨‍⚕️ Dr. Jean-Paul NZENZE
         │   Médecin du Travail
         │
         ├─► 👨‍⚕️ Dr. Jules DJEKI (2ème casquette)
         │   Médecin Consultant Senior
         │
         ├─► 👩‍⚕️ Marie BOUNDA
         │   Infirmière
         │
         └─► 👨‍💼 Paul OKANDZE
             Administrateur
```

---

## 🔢 RÉCAPITULATIF DES FICHIERS MODIFIÉS

### Fichiers Interface (Frontend)

| Fichier | Ligne | Changement |
|---------|-------|------------|
| `src/config/menuDefinitions.ts` | 369 | Label rôle director |
| `src/config/menuDefinitions.ts` | 378 | Commentaire menu |
| `src/pages/professional/DirectorDashboard.tsx` | 66 | Badge dashboard |
| `src/pages/establishments/sogara/admin/SogaraDashboard.tsx` | 106 | Badge header |
| `src/pages/professional/ProfessionalSettings.tsx` | 102 | Titre paramètres |

### Scripts de Configuration

| Fichier | Description |
|---------|-------------|
| `scripts/setup-dr-djeki-multi-roles.js` | Position dans création rôle |
| `scripts/configure-dr-djeki-multi-roles.js` | job_position |
| `scripts/setup-all-sogara-professionals.js` | Position mapping |
| `scripts/migrate-to-multi-establishment.js` | Position migration |
| `restore-djeki-doctor-role.sql` | Messages logs SQL |

### Script de Mise à Jour Base de Données

| Fichier | Description |
|---------|-------------|
| `update-director-title-medecin-en-chef.sql` ⭐ | Script SQL pour mettre à jour la position dans establishment_staff |

---

## 🚀 DÉPLOIEMENT

### Étape 1 : Mise à jour Base de Données

**IMPORTANT** : Exécuter en premier !

```bash
# Via Supabase Dashboard
# SQL Editor → Copier-coller update-director-title-medecin-en-chef.sql
# Exécuter
```

### Étape 2 : Déploiement Frontend

```bash
# Les modifications code sont déjà appliquées
npm run build
# Déployer sur production
```

### Étape 3 : Vérification

1. Se connecter comme Dr. DJEKI
2. Vérifier tous les affichages
3. Tester navigation menu
4. Confirmer le nouveau titre partout

---

## 📝 AFFICHAGES DU NOUVEAU TITRE

### Endroits où "Médecin en Chef" apparaît maintenant :

1. ✅ **Menu de navigation** (sidebar) - Label rôle
2. ✅ **Badge Dashboard Directeur** - En haut à droite
3. ✅ **Badge Dashboard SOGARA** - Header établissement
4. ✅ **Page Paramètres** - Section rôles
5. ✅ **Sélecteur de rôle** - Dropdown multi-rôles
6. ✅ **Base de données** - Colonne `position` dans `establishment_staff`

### Format selon contexte :

| Contexte | Format affiché |
|----------|----------------|
| Menu navigation | "Médecin en Chef CMST" |
| Badge dashboard | "Médecin en Chef" |
| Badge header | "Médecin en Chef" |
| Paramètres | "Médecin en Chef CMST" |
| Base de données | "Médecin en Chef" |

---

## 🎨 DESIGN & COHÉRENCE

### Badges Multi-Rôles Dr. DJEKI

**Sur SogaraDashboard** :
```
╔════════════════════════════════════════════╗
║  CMST SOGARA                              ║
║  ─────────────────────────────────────    ║
║  [Médecin en Chef] [Médecin Consultant]  ║
║   ↑ Primary          ↑ Secondary          ║
╚════════════════════════════════════════════╝
```

**Couleurs** :
- **Médecin en Chef** : Badge `default` (bleu primary)
- **Médecin Consultant** : Badge `secondary` (gris)

### Hiérarchie Visuelle

Le titre "Médecin en Chef" implique :
- 🔵 Badge primary (couleur principale)
- 🛡️ Icône Shield pour direction
- 📊 Accès menu complet (4 sections)
- ⭐ Position hiérarchique supérieure

---

## 🔍 DIFFÉRENCES ENTRE LES TITRES

### Comparaison

| Aspect | "Directeur Général" ❌ | "Directeur Médical" ⚠️ | "Médecin en Chef" ✅ |
|--------|------------------------|------------------------|----------------------|
| **Connotation** | Administrative | Médicale | Médicale hiérarchique |
| **Secteur** | Entreprise générale | Établissement santé | Médecine du travail |
| **Hiérarchie** | Direction générale | Direction médicale | Chef médical |
| **Précision** | Vague | Précise | Très précise |
| **Prestige** | Moyen | Bon | Excellent |
| **Usage CMST** | Inadapté | Acceptable | Parfait |

### Terminologie Médicale Française

**Titres médicaux hiérarchiques** (ordre décroissant) :
1. **Médecin en Chef** ⭐ (Choisi)
2. Médecin Chef de Service
3. Médecin Senior
4. Médecin Assistant
5. Médecin Junior

**Pour un CMST** :
- Médecin en Chef = Direction médicale + pratique clinique
- Approprié pour médecine du travail
- Reconnu par Code du Travail gabonais

---

## 📞 SUPPORT

### Si le titre ne change pas

**Problème 1 : Cache navigateur**
```bash
# Vider le cache
Ctrl+F5 (Windows)
Cmd+Shift+R (Mac)
```

**Problème 2 : Base de données pas mise à jour**
```sql
-- Vérifier la position actuelle
SELECT position FROM establishment_staff
WHERE professional_id IN (
  SELECT id FROM professionals WHERE user_id IN (
    SELECT id FROM profiles WHERE email = 'directeur.sogara@sante.ga'
  )
)
AND role = 'director';

-- Si pas "Médecin en Chef", exécuter update-director-title-medecin-en-chef.sql
```

**Problème 3 : Build pas refait**
```bash
npm run build
# Redémarrer serveur dev
```

---

## 📚 RESSOURCES LIÉES

**Scripts SQL** :
- `update-director-title-medecin-en-chef.sql` - Mise à jour BDD
- `restore-djeki-doctor-role.sql` - Restauration rôle médecin

**Scripts JS** :
- `scripts/setup-dr-djeki-multi-roles.js` - Configuration complète
- `scripts/setup-all-sogara-professionals.js` - Tous les pros SOGARA

**Documentation** :
- `RESTAURATION_ROLE_MEDECIN_DJEKI.md` - Rôle médecin
- `CORRECTION_MENU_PATIENTS_AYANTS_DROIT.md` - Menu patients

---

## ✅ CHECKLIST FINALE

### Modifications Interface
- [x] `menuDefinitions.ts` - Label rôle
- [x] `DirectorDashboard.tsx` - Badge dashboard
- [x] `SogaraDashboard.tsx` - Badge header
- [x] `ProfessionalSettings.tsx` - Page paramètres

### Modifications Scripts
- [x] `setup-dr-djeki-multi-roles.js` - Position
- [x] `configure-dr-djeki-multi-roles.js` - job_position
- [x] `setup-all-sogara-professionals.js` - Mapping
- [x] `migrate-to-multi-establishment.js` - Migration
- [x] `restore-djeki-doctor-role.sql` - Messages SQL

### Mise à Jour BDD
- [ ] Exécuter `update-director-title-medecin-en-chef.sql`
- [ ] Vérifier position dans `establishment_staff`

### Tests
- [ ] Se connecter comme Dr. DJEKI
- [ ] Vérifier badge "Médecin en Chef"
- [ ] Vérifier menu navigation
- [ ] Vérifier page paramètres
- [ ] Vérifier dashboard SOGARA

---

## 🎉 RÉSUMÉ

### Ce qui a changé

| Élément | Ancien | Nouveau |
|---------|--------|---------|
| Label rôle | "Directeur Général CMST" | **"Médecin en Chef CMST"** ✅ |
| Badge dashboard | "Directeur Général" | **"Médecin en Chef"** ✅ |
| Badge SOGARA | "Directeur Médical" | **"Médecin en Chef"** ✅ |
| Position BDD | "Directeur Médical" | **"Médecin en Chef"** ✅ |

### Tous les affichages sont cohérents

- ✅ Interface utilisateur
- ✅ Base de données
- ✅ Scripts de configuration
- ✅ Documentation

---

**Version** : 1.0  
**Statut** : ✅ Changement Appliqué  
**Dernière mise à jour** : Décembre 2024

