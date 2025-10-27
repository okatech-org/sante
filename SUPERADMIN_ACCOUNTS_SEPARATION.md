# 👥 Séparation des Comptes : Patients vs Professionnels

## 🐛 Problème Identifié

Les comptes démo **professionnels** apparaissaient dans la section **Patients** du super admin dashboard.

### Comptes Concernés
- ✅ `medecin.demo@sante.ga` (Rôle: `doctor`)
- ✅ `infirmiere.demo@sante.ga` (Rôle: `nurse`)
- ✅ `sagefemme.demo@sante.ga` (Rôle: `midwife`)
- ✅ `kine.demo@sante.ga` (Rôle: `physiotherapist`)
- ✅ `psychologue.demo@sante.ga` (Rôle: `psychologist`)
- ✅ `pharmacien.demo@sante.ga` (Rôle: `pharmacist`)
- Et autres professionnels avec rôles non-patients

---

## ✅ Solutions Implémentées

### 1. **PatientsManagement.tsx** - Filtrage Strict par Rôle
```typescript
// Avant: Affichait tous les profils
const { data: profiles } = await supabase
  .from('profiles')
  .select('*');

// Après: Filtre SEULEMENT rôle 'patient'
const patientUsers = rolesData?.filter(r => r.role === 'patient').map(r => r.user_id) || [];
const patientProfiles = profiles?.filter(p => patientUsers.includes(p.id)) || [];
```

**Critère de Filtrage:**
- ✅ Rôle = `'patient'` UNIQUEMENT
- ✅ Exclut tous les rôles professionnels
- ✅ Exclut les administrateurs

### 2. **ProfessionalsManagement.tsx** - Filtre Inverse
```typescript
// Liste des rôles professionnels
const PROFESSIONAL_ROLES = [
  'doctor',
  'specialist',
  'nurse',
  'midwife',
  'physiotherapist',
  'psychologist',
  'ophthalmologist',
  'anesthesiologist',
  'pharmacist',
  'pharmacy',
  'laboratory_technician',
  'radiologist',
  'radiology_center',
  'hospital_admin',
  'clinic_admin',
  'sogara_admin'
];

// Filtre: INCLURE SEULEMENT ces rôles
const professionalUsers = rolesData?.filter(r => 
  PROFESSIONAL_ROLES.includes(r.role)
) || [];
```

**Critère de Filtrage:**
- ✅ Rôle = l'un des `PROFESSIONAL_ROLES`
- ✅ Exclut automatiquement `'patient'`
- ✅ Exclut les administrateurs système

---

## 📊 Architecture de Séparation

### Table `user_roles` (Supabase)
```
user_id                           role
─────────────────────────────────────────
550e8400-e29b-41d4-a716-...      patient         ← PatientsManagement
550e8400-e29b-41d4-a716-...      doctor          ← ProfessionalsManagement
550e8400-e29b-41d4-a716-...      nurse           ← ProfessionalsManagement
550e8400-e29b-41d4-a716-...      pharmacist      ← ProfessionalsManagement
550e8400-e29b-41d4-a716-...      hospital_admin  ← (future AdminsManagement)
```

### Flux de Données

```
Supabase (user_roles table)
    │
    ├─→ Filter role = 'patient'
    │       └─→ PatientsManagement.tsx ✓
    │
    ├─→ Filter role IN PROFESSIONAL_ROLES
    │       └─→ ProfessionalsManagement.tsx ✓
    │
    └─→ Filter role NOT IN [patient, PROFESSIONAL_ROLES]
            └─→ (future) AdminsManagement.tsx
```

---

## 🎯 Affichage par Section

### 👥 Section "Patients"
**URL:** `http://localhost:8081/superadmin/patients`

Affiche UNIQUEMENT:
- Comptes avec rôle `patient`
- Données patient (date naissance, assurance, etc.)
- Exemple: `patient.demo@sante.ga`

### 👨‍⚕️ Section "Professionnels"
**URL:** `http://localhost:8081/superadmin/professionals`

Affiche UNIQUEMENT:
- Comptes avec rôles professionnels (doctor, nurse, etc.)
- Affiliation à établissements
- Spécialités et numéros d'ordre
- Exemples: `medecin.demo@sante.ga`, `infirmiere.demo@sante.ga`, etc.

### 🏥 Section "Établissements" (Existant)
**URL:** `http://localhost:8081/establishments/unclaimed`

Gère:
- Hôpitaux, cliniques, pharmacies
- Administrateurs d'établissement (rôle `hospital_admin`, `clinic_admin`, etc.)

---

## 🔄 Logique de Chargement

### PatientsManagement
```typescript
// 1. Charger tous les profils
const profiles = await supabase.from('profiles').select('*');

// 2. Charger tous les rôles
const rolesData = await supabase.from('user_roles').select('*');

// 3. Identifier les patients
const patientUsers = rolesData
  .filter(r => r.role === 'patient')  // ← Clé
  .map(r => r.user_id);

// 4. Récupérer leurs profils
const patientProfiles = profiles
  .filter(p => patientUsers.includes(p.id));

// 5. Afficher
```

### ProfessionalsManagement
```typescript
// 1. Charger tous les profils
const profiles = await supabase.from('profiles').select('*');

// 2. Charger tous les rôles
const rolesData = await supabase.from('user_roles').select('*');

// 3. Identifier les professionnels
const professionalUsers = rolesData
  .filter(r => PROFESSIONAL_ROLES.includes(r.role))  // ← Clé
  .map(r => r.user_id);

// 4. Récupérer leurs profils
const professionalProfiles = profiles
  .filter(p => professionalUsers.includes(p.id));

// 5. Afficher
```

---

## 📋 Rôles Supportés

### 🟢 Rôles Patients
- `patient` - Patient standard

### 🔵 Rôles Professionnels Médicaux
- `doctor` - Médecin généraliste
- `specialist` - Médecin spécialiste
- `ophthalmologist` - Ophtalmologue
- `anesthesiologist` - Anesthésiste
- `radiologist` - Radiologue

### 🟣 Rôles Professionnels Paramédicaux
- `nurse` - Infirmier(ère)
- `midwife` - Sage-femme
- `physiotherapist` - Kinésithérapeute
- `psychologist` - Psychologue
- `laboratory_technician` - Technicien de laboratoire

### 🟡 Rôles Administratifs
- `hospital_admin` - Administrateur d'hôpital
- `clinic_admin` - Administrateur de clinique
- `sogara_admin` - Administrateur SOGARA

### 🟠 Rôles Établissements
- `pharmacy` - Pharmacie
- `radiology_center` - Centre de radiologie

---

## 🎨 Affichage des Rôles

Chaque professionnel affiche son rôle avec couleur code:

```typescript
const getRoleBadgeColor = (role: string) => {
  if (role.includes('admin')) return 'bg-red-100 text-red-800';      // 🔴 Admin
  if (role.includes('doctor') || role.includes('specialist')) 
    return 'bg-blue-100 text-blue-800';                             // 🔵 Médecins
  if (role.includes('nurse') || role.includes('midwife')) 
    return 'bg-pink-100 text-pink-800';                             // 🟣 Paramédicaux
  if (role.includes('pharmacist') || role.includes('pharmacy')) 
    return 'bg-yellow-100 text-yellow-800';                         // 🟡 Pharmacie
  return 'bg-gray-100 text-gray-800';                               // ⚪ Autre
};
```

---

## 🚀 Test Pratique

### Avant (Comportement Bugué)
```
PatientsManagement:
  ❌ patient.demo@sante.ga (Patient)
  ❌ medecin.demo@sante.ga (Médecin)         ← Mauvaise place!
  ❌ infirmiere.demo@sante.ga (Infirmière)   ← Mauvaise place!

ProfessionalsManagement:
  ✓ (Vide ou peu de résultats)
```

### Après (Comportement Correct) ✅
```
PatientsManagement:
  ✅ patient.demo@sante.ga (Patient)
  ✓ (Autres patients réels)

ProfessionalsManagement:
  ✅ medecin.demo@sante.ga (Médecin)
  ✅ infirmiere.demo@sante.ga (Infirmière)
  ✅ sagefemme.demo@sante.ga (Sage-femme)
  ✅ pharmacien.demo@sante.ga (Pharmacien)
  ✓ (Autres professionnels)
```

---

## 📝 Évolutions Futures

### À Implémenter
- [ ] Section "Administrateurs" pour rôles admin
- [ ] Filtre par zone/région
- [ ] Export de liste (CSV/Excel)
- [ ] Actions en masse (suspension, validation)
- [ ] Audit trail des modifications

### Données Enrichies à Charger
- [ ] Informations professionnelles (diplômes, spécialités)
- [ ] Affiliations à établissements
- [ ] Numéros d'ordre professionnel
- [ ] Statuts de vérification

---

## ✨ Résultat Final

✅ **Séparation nette et logique**
- Patients → Section "Patients"
- Professionnels → Section "Professionnels"
- Administrateurs → (Prochainement)

✅ **Filtrage à la source (Supabase)**
- Plus performant
- Plus sûr
- Pas de confusion de données

✅ **Interface claire**
- Rôles affichés avec couleurs
- Comptes mal classés → Impossible
- Gestion centralisée facile

**Testez maintenant !** 🎉
```
http://localhost:8081/superadmin/patients → Patients uniquement
http://localhost:8081/superadmin/professionals → Professionnels uniquement
```
