# 🧪 Guide de Test - Nadège Oyono (Réceptionniste)

## 🎯 Objectif
Valider que Nadège Oyono a une interface de **RÉCEPTIONNISTE** et NON de médecin/directeur.

---

## ⚡ Test Rapide en 5 Étapes

### 1️⃣ Exécuter le Script SQL

```sql
-- Dans Supabase SQL Editor
-- Copier tout le contenu de : create-nadege-oyono-receptionniste.sql
-- Cliquer sur "Run"
```

### 2️⃣ Vérifier le Rôle

```sql
-- Doit retourner 'receptionist' partout
SELECT 
  u.email,
  p.category,
  es.role
FROM auth.users u
JOIN professionals p ON p.user_id = u.id
JOIN establishment_staff es ON es.professional_id = p.id
WHERE u.email = 'nadege.oyono@sogara.ga';
```

### 3️⃣ Se Déconnecter Complètement

```javascript
// Dans la console du navigateur
localStorage.clear();
sessionStorage.clear();
// Fermer tous les onglets
```

### 4️⃣ Se Connecter

```
URL      : http://localhost:8080/login/professional
Email    : nadege.oyono@sogara.ga
Password : Sogara2025!
```

### 5️⃣ Vérifier l'Interface

---

## ✅ Checklist de Validation

### CE QUI DOIT APPARAÎTRE ✅

#### En-tête
- [ ] **Nom** : Nadège Oyono
- [ ] **Badge principal** : "Réceptionniste" (couleur cyan)
- [ ] **Badge secondaire** : "REC-SOGARA-2025-001"
- [ ] **Sous-titre** : "Réception et Accueil"

#### 4 Cards de Stats
- [ ] **Card 1** : Patients aujourd'hui (12)
- [ ] **Card 2** : Rendez-vous (8)
- [ ] **Card 3** : En attente (2)
- [ ] **Card 4** : Enregistrements (15)

#### Planning du Jour
- [ ] Liste des RDV avec heures
- [ ] Nom des patients
- [ ] Nom des médecins assignés
- [ ] Bouton "Nouveau RDV"

#### Actions Rapides (4 boutons)
- [ ] Nouveau RDV (bleu)
- [ ] Patients (vert)
- [ ] Planning (violet)
- [ ] Consultations (orange)

#### Tâches de Réception
- [ ] Section "Accueil"
- [ ] Section "Rendez-vous"
- [ ] Section "Coordination"

---

### CE QUI NE DOIT PAS APPARAÎTRE ❌

#### Sections Médicales
- [ ] ❌ **PAS de section "Diplômes"**
- [ ] ❌ **PAS de "Doctorat en Médecine"**
- [ ] ❌ **PAS de "Spécialisation Médecine Interne"**
- [ ] ❌ **PAS de "Master en Santé Publique"**

#### Formations
- [ ] ❌ **PAS de section "Formations de mise à jour"**
- [ ] ❌ **PAS de "Gestion des Urgences Médicales"**
- [ ] ❌ **PAS de "Télémédecine et E-Santé"**
- [ ] ❌ **PAS de "Management Hospitalier"**

#### Stats Financières
- [ ] ❌ **PAS de "Revenus du mois"**
- [ ] ❌ **PAS de graphiques financiers**
- [ ] ❌ **PAS de "Taux CNAMGS"**

#### Administration
- [ ] ❌ **PAS de "Activité Direction"**
- [ ] ❌ **PAS de "Administration"**
- [ ] ❌ **PAS de "Personnel actif"**
- [ ] ❌ **PAS de "Budget mensuel"**

#### Menu Latéral
- [ ] ❌ **PAS de "DIRECTEUR"**
- [ ] ❌ **PAS de "MÉDECIN"**
- [ ] ❌ **PAS de "Prescriptions"**
- [ ] ❌ **PAS de "Finances"**

---

## 🔍 Capture d'Écran de Référence

### Interface CORRECTE de Réceptionniste

```
┌─────────────────────────────────────────────────────────────┐
│  Nadège Oyono                      [Réceptionniste] [REC-001]│
│  Réception et Accueil              📧 nadege.oyono@sogara.ga │
│  Centre Médical SOGARA             📱 +241 01 55 26 21       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Patients │ │   RDV    │ │ Attente  │ │Enregistr.│       │
│  │    12    │ │    8     │ │    2     │ │    15    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│  Planning du Jour - Tous les rendez-vous                     │
│  09:00 - Marie MOUSSAVOU - Dr. OKEMBA     [Confirmé]        │
│  10:30 - Jean NZENGUE - Dr. NGUEMA        [Confirmé]        │
│  14:00 - Sophie KOMBILA - Dr. MBINA       [En attente]      │
│  15:30 - Pierre OBAME - Dr. MEZUI         [Confirmé]        │
├─────────────────────────────────────────────────────────────┤
│  Actions Rapides:                                            │
│  [Nouveau RDV] [Patients] [Planning] [Consultations]         │
├─────────────────────────────────────────────────────────────┤
│  Tâches de réception:                                        │
│  • Accueil des patients                                      │
│  • Gestion des rendez-vous                                   │
│  • Coordination avec médecins                                │
└─────────────────────────────────────────────────────────────┘
```

### Interface INCORRECTE (à éviter)

```
❌ Diplômes (3 diplômes)
   - Doctorat en Médecine
   - Spécialisation Médecine Interne  
   - Master en Santé Publique

❌ Formations de mise à jour (3 formations)
   - Gestion des Urgences
   - Télémédecine
   - Management Hospitalier
```

---

## 🐛 Si l'Interface est Incorrecte

### Action 1 : Réexécuter le Script

```sql
-- Réexécuter TOUT le script
-- create-nadege-oyono-receptionniste.sql
```

### Action 2 : Forcer le Rôle

```sql
-- Forcer category = 'receptionist'
UPDATE professionals
SET category = 'receptionist'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'nadege.oyono@sogara.ga'
);

-- Forcer role = 'receptionist'
UPDATE establishment_staff
SET role = 'receptionist'
WHERE professional_id IN (
  SELECT id FROM professionals 
  WHERE user_id = (
    SELECT id FROM auth.users 
    WHERE email = 'nadege.oyono@sogara.ga'
  )
);
```

### Action 3 : Vider le Cache et Reconnecter

```javascript
// Console navigateur
localStorage.clear();
location.reload();
```

---

## 📊 Résultat Final Attendu

| Élément | Statut Attendu |
|---------|---------------|
| Interface | Réceptionniste (pas médecin) |
| Diplômes | ❌ Non visibles |
| Formations | ❌ Non visibles |
| Stats financières | ❌ Non visibles |
| Planning RDV | ✅ Visible |
| Actions réception | ✅ Visible |
| Menu prescriptions | ❌ Non visible |
| Badge rôle | "Réceptionniste" |

---

## ✅ Validation Finale

Si tous les points ci-dessus sont validés :
- ✅ L'implémentation est correcte
- ✅ Nadège Oyono a bien une interface de réceptionniste
- ✅ Les permissions sont appropriées

---

**📅 Date du Test** : 31 octobre 2025  
**👤 Compte Testé** : nadege.oyono@sogara.ga  
**💼 Rôle Attendu** : Réceptionniste  
**🏥 Établissement** : Centre Médical SOGARA
