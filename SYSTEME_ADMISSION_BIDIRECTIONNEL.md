# 🔄 SYSTÈME D'ADMISSION BIDIRECTIONNEL

**Date** : 31 octobre 2025  
**Statut** : ✅ 100% IMPLÉMENTÉ

---

## 🎯 OBJECTIF

Système complet permettant :
1. **Professionnel → Établissement** : Demander à rejoindre un établissement
2. **Établissement → Professionnel** : Inviter un professionnel

**Validation automatique bidirectionnelle** : Quand l'une des parties accepte, l'affiliation est créée automatiquement.

---

## 🔄 FLUX BIDIRECTIONNEL

### Scénario 1 : Professionnel demande à rejoindre
```
1. Dr. MARTIN cherche établissements
2. Trouve "Clinique des Lilas"
3. Clique "Demander à rejoindre"
4. Remplit formulaire (rôle, département, message)
5. Envoie demande

→ Statut: EN ATTENTE ⏳

6. Admin Clinique reçoit la demande
7. Examine le profil du Dr. MARTIN
8. Clique "Approuver"

→ Dr. MARTIN est automatiquement ajouté à establishment_staff ✅
→ Apparaît dans sa liste d'établissements
```

### Scénario 2 : Établissement invite professionnel
```
1. Admin Clinique cherche médecins
2. Trouve Dr. OKEMBA (via email)
3. Clique "Inviter un professionnel"
4. Remplit formulaire (rôle, département, message)
5. Envoie invitation

→ Statut: EN ATTENTE ⏳

6. Dr. OKEMBA reçoit l'invitation
7. Voit dans "Mes demandes" avec badge "Invitation reçue"
8. Clique "Accepter"

→ Dr. OKEMBA est automatiquement ajouté à establishment_staff ✅
→ Apparaît dans sa liste d'établissements
```

---

## 📊 BASE DE DONNÉES

### Table `establishment_admission_requests`

```sql
CREATE TABLE establishment_admission_requests (
    id UUID PRIMARY KEY,
    
    -- Type de demande
    request_type TEXT NOT NULL,  -- 'professional_to_establishment' | 'establishment_to_professional'
    
    -- Parties
    professional_id UUID NOT NULL → professionals(id),
    establishment_id UUID NOT NULL → establishments(id),
    
    -- Informations
    requested_role TEXT NOT NULL,
    department TEXT,
    job_position TEXT,
    message TEXT,
    
    -- Statut
    status TEXT NOT NULL,  -- 'pending' | 'approved' | 'rejected' | 'cancelled'
    
    -- Métadonnées
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,  -- 30 jours par défaut
    
    -- Validation
    created_by UUID → auth.users(id),
    reviewed_by UUID → auth.users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT
);
```

### Index
```sql
- idx_admission_professional (professional_id, status)
- idx_admission_establishment (establishment_id, status)
- idx_admission_status (status)
- idx_admission_type (request_type)
```

### Contraintes
```sql
UNIQUE(professional_id, establishment_id, status) WHERE status = 'pending'
```
→ Empêche les doublons de demandes en attente

---

## 🔐 RLS POLICIES

### Professionnels
```sql
✅ SELECT  - Voir leurs propres demandes
✅ INSERT  - Créer demandes sortantes (pro → établissement)
✅ UPDATE  - Annuler leurs demandes en attente
✅ UPDATE  - Accepter/Refuser invitations reçues
```

### Admins Établissement
```sql
✅ SELECT  - Voir demandes de leur établissement
✅ INSERT  - Créer invitations (établissement → pro)
✅ UPDATE  - Approuver/Rejeter demandes reçues
```

---

## 🛠️ FONCTIONS RPC

### 1. `create_admission_request`
**Usage** : Professionnel demande à rejoindre
```sql
SELECT create_admission_request(
    p_establishment_id := 'uuid-etablissement',
    p_requested_role := 'doctor',
    p_department := 'Médecine Générale',
    p_job_position := 'Médecin Généraliste',
    p_message := 'Je souhaite rejoindre votre équipe...'
);
```

**Vérifications** :
- ✅ Professionnel existe
- ✅ Pas de demande en attente déjà
- ✅ Pas déjà membre de l'établissement

**Retourne** : UUID de la demande

### 2. `approve_admission_request`
**Usage** : Admin approuve une demande
```sql
SELECT approve_admission_request(
    p_request_id := 'uuid-demande',
    p_matricule := 'STAFF-001234'  -- Optionnel, auto-généré si null
);
```

**Actions** :
1. Crée l'affiliation dans `establishment_staff`
2. Assigne permissions selon le rôle
3. Génère matricule si non fourni
4. Met à jour statut → 'approved'

**Permissions assignées automatiquement** :
```typescript
doctor     → ['consultation', 'prescription', 'view_dmp', 'edit_dmp']
nurse      → ['view_dmp', 'view_patients']
admin      → ['manage_staff', 'view_finances']
```

### 3. `reject_admission_request`
**Usage** : Admin rejette une demande
```sql
SELECT reject_admission_request(
    p_request_id := 'uuid-demande',
    p_rejection_reason := 'Profil ne correspond pas...'
);
```

### 4. `cancel_admission_request`
**Usage** : Professionnel annule sa demande
```sql
SELECT cancel_admission_request(
    p_request_id := 'uuid-demande'
);
```

### 5. `get_my_admission_requests`
**Usage** : Professionnel voit toutes ses demandes
```sql
SELECT * FROM get_my_admission_requests();
```

**Retourne** :
- Demandes sortantes (pro → établissement)
- Invitations reçues (établissement → pro)
- Statuts et détails

### 6. `get_establishment_admission_requests`
**Usage** : Admin voit demandes de son établissement
```sql
SELECT * FROM get_establishment_admission_requests(
    p_establishment_id := 'uuid-etablissement'
);
```

**Retourne** :
- Demandes reçues (pro → établissement)
- Invitations envoyées (établissement → pro)
- Profils des professionnels

### 7. `invite_professional_to_establishment`
**Usage** : Admin invite un professionnel
```sql
SELECT invite_professional_to_establishment(
    p_professional_email := 'dr.okemba@gmail.com',
    p_establishment_id := 'uuid-etablissement',
    p_requested_role := 'doctor',
    p_department := 'Cardiologie',
    p_job_position := 'Cardiologue',
    p_message := 'Nous serions ravis...'
);
```

**Vérifications** :
- ✅ Utilisateur est admin de l'établissement
- ✅ Professionnel existe avec cet email
- ✅ Pas déjà membre
- ✅ Pas d'invitation en attente

---

## 💻 INTERFACES UTILISATEUR

### Page 1 : JoinEstablishment.tsx (Professionnel)

#### Fonctionnalités
- **Recherche** d'établissements (nom, ville, type)
- **Grid** des établissements disponibles
- **Card** par établissement avec :
  - Nom + type + ville
  - Adresse + téléphone
  - Bouton "Demander à rejoindre"
- **Formulaire** de demande :
  - Rôle souhaité (select)
  - Département souhaité
  - Poste souhaité
  - Message de motivation
- **Mes demandes** en haut :
  - Liste des demandes en cours
  - Badge statut (En attente/Approuvée/Rejetée)
  - Badge "Invitation reçue" pour invitations
  - Bouton "Accepter"/"Refuser" pour invitations
  - Bouton "Annuler" pour demandes sortantes

#### Route
```typescript
/professional/join-establishment
```

#### Accès
- Sidebar → "+" Rejoindre un établissement

### Page 2 : ManageAdmissions.tsx (Admin)

#### Fonctionnalités
- **2 tabs** :
  - Demandes reçues (pro → établissement)
  - Invitations envoyées (établissement → pro)
- **Stats** :
  - Demandes reçues (count)
  - Invitations envoyées (count)
  - Total en attente
- **Dialog** invitation :
  - Email professionnel
  - Rôle proposé
  - Département
  - Poste
  - Message personnalisé
- **Actions** sur demandes :
  - ✅ Approuver → Création automatique affiliation
  - ❌ Rejeter → Avec raison

#### Route
```typescript
/professional/manage-admissions
```

#### Accès
- Menu DIRECTEUR → ADMINISTRATION → Gestion Admissions

---

## 🎨 UI/UX

### Établissements grisés → SUPPRIMÉS ✅
**Avant** :
```
ÉTABLISSEMENTS
├─ CMST SOGARA (actif)
├─ Etablissement 2 (grisé, disabled)
└─ Etablissement X (grisé, disabled)
```

**Après** :
```
ÉTABLISSEMENTS
├─ CMST SOGARA (actif)
│  ├─ DIRECTEUR
│  └─ MÉDECIN
│
└─ + Rejoindre un établissement (bouton dashed)
```

### Badges Statuts
```
⏳ En attente    - Orange (default)
✅ Approuvée     - Vert (secondary)
❌ Rejetée       - Rouge (destructive)
⭕ Annulée       - Gris (outline)
📨 Invitation    - Bleu (outline) "Invitation reçue"
```

---

## 🔔 NOTIFICATIONS (À implémenter Phase 2)

### Professionnel reçoit
- ✉️ Email : "Votre demande a été approuvée par Clinique X"
- 🔔 Push : "Invitation de CMST SOGARA"

### Admin établissement reçoit
- ✉️ Email : "Nouvelle demande de Dr. MARTIN"
- 🔔 Push : "Dr. OKEMBA a accepté votre invitation"

---

## 🧪 GUIDE DE TEST

### Test 1 : Professionnel demande à rejoindre

```
1. Se connecter : dr.okemba.sogara@sante.ga
2. Sidebar → Clic "+ Rejoindre un établissement"
3. URL : http://localhost:8080/professional/join-establishment
4. Rechercher "CMST" → Voir CMST SOGARA
5. Clic "Demander à rejoindre"
6. Remplir formulaire :
   - Rôle: Médecin
   - Département: Cardiologie
   - Poste: Cardiologue
   - Message: "Je souhaite..."
7. Clic "Envoyer la demande"
8. Voir notification "Demande envoyée !"
9. Voir demande dans "Mes demandes" avec statut "En attente"
```

### Test 2 : Admin approuve demande

```
1. Se connecter : directeur.sogara@sante.ga
2. Menu DIRECTEUR → ADMINISTRATION → Gestion Admissions
3. Onglet "Demandes reçues"
4. Voir demande de Dr. OKEMBA
5. Vérifier informations :
   - Nom, email, spécialité
   - Rôle demandé
   - Message
6. Clic "Approuver"
7. Voir notification "Demande approuvée !"
8. Demande disparaît de la liste
9. Vérifier : Dr. OKEMBA ajouté dans Personnel
```

### Test 3 : Admin invite professionnel

```
1. Rester connecté : directeur.sogara@sante.ga
2. Page Gestion Admissions
3. Clic "Inviter un professionnel"
4. Remplir formulaire :
   - Email: dr.nguema@gmail.com
   - Rôle: Médecin
   - Département: Urgences
   - Poste: Médecin Urgentiste
   - Message: "Nous recherchons..."
5. Clic "Envoyer l'invitation"
6. Voir notification "Invitation envoyée !"
7. Onglet "Invitations envoyées" → Voir invitation
```

### Test 4 : Professionnel reçoit invitation

```
1. Se connecter avec compte Dr. NGUEMA
2. Sidebar → Clic "+ Rejoindre un établissement"
3. Voir section "Mes demandes" en haut
4. Voir invitation avec :
   - Badge "Invitation reçue"
   - Établissement: CMST SOGARA
   - Rôle: Médecin
   - Boutons: Accepter / Refuser
5. Clic "Accepter"
6. Voir notification "Invitation acceptée !"
7. Redirection automatique vers /professional
8. Voir CMST SOGARA dans liste établissements
```

### Test 5 : Annulation de demande

```
1. Professionnel avec demande en attente
2. Page "Rejoindre un établissement"
3. Section "Mes demandes"
4. Clic "Annuler" sur une demande
5. Voir notification "Demande annulée"
6. Demande disparaît
```

### Test 6 : Rejet de demande

```
1. Admin établissement
2. Page Gestion Admissions
3. Demande d'un professionnel
4. Clic "Rejeter"
5. (Optionnel) Entrer raison
6. Demande passe en statut "Rejetée"
7. Professionnel voit raison du rejet
```

---

## 📋 STATUTS DES DEMANDES

| Statut | Description | Qui peut le mettre | Actions possibles |
|--------|-------------|-------------------|-------------------|
| **pending** | En attente de validation | Système (création) | Approuver, Rejeter, Annuler |
| **approved** | Approuvée et affiliation créée | Admin ou Pro (selon type) | Aucune (final) |
| **rejected** | Rejetée par l'admin | Admin établissement | Aucune (final) |
| **cancelled** | Annulée par le demandeur | Professionnel | Aucune (final) |

---

## 🔒 SÉCURITÉ

### Vérifications automatiques

#### Lors de la création
- ✅ Pas de doublon demande en attente
- ✅ Pas déjà membre de l'établissement
- ✅ Professionnel existe (pour invitations)
- ✅ Admin autorisé (pour invitations)

#### Lors de l'approbation
- ✅ Demande existe et en attente
- ✅ Pas de doublon affiliation
- ✅ Génération matricule unique

#### RLS
- ✅ Chaque utilisateur ne voit QUE ses demandes
- ✅ Admins voient SEULEMENT demandes de leurs établissements
- ✅ Impossible de modifier demandes d'autres

---

## 📊 MENU MIS À JOUR

### Menu DIRECTEUR (ADMINISTRATION)
```
ADMINISTRATION (5 pages) ← +1 PAGE
├─ Personnel
├─ Gestion Admissions  ⭐ NOUVEAU
├─ Finances & CNAMGS
├─ Infrastructure
└─ Stocks & Pharmacie
```

### Sidebar (Section ÉTABLISSEMENTS)
```
ÉTABLISSEMENTS
└─ CMST SOGARA
    ├─ DIRECTEUR
    └─ MÉDECIN

+ Rejoindre un établissement  ⭐ NOUVEAU
(Bouton border-dashed)
```

---

## 🚀 PROCHAINES ÉTAPES (Phase 2)

### Notifications
- [ ] Email automatique à la création de demande
- [ ] Email à l'approbation/rejet
- [ ] Notifications push in-app
- [ ] Compteur de demandes en attente (badge)

### Fonctionnalités avancées
- [ ] Upload CV et documents
- [ ] Vérification des diplômes
- [ ] Période d'essai avant validation finale
- [ ] Rating/Évaluation après intégration
- [ ] Recherche avancée d'établissements (carte, filtres)
- [ ] Profil public établissement

---

## ✅ VALIDATION TECHNIQUE

### Database
- ✅ Table créée
- ✅ Indexes optimisés
- ✅ RLS policies sécurisées
- ✅ 7 fonctions RPC
- ✅ Triggers updated_at
- ✅ Contraintes unicité

### Frontend
- ✅ Page JoinEstablishment (340 lignes)
- ✅ Page ManageAdmissions (320 lignes)
- ✅ Routes configurées
- ✅ Bouton sidebar
- ✅ Menu administration
- ✅ Layouts appliqués

### UX
- ✅ Recherche établissements
- ✅ Formulaires clairs
- ✅ Badges statuts
- ✅ Messages toast
- ✅ Chargement états
- ✅ Validation formulaires

---

## 📊 STATISTIQUES

| Élément | Quantité |
|---------|----------|
| **Migration SQL** | 1 fichier (300+ lignes) |
| **Tables créées** | 1 |
| **Fonctions RPC** | 7 |
| **RLS Policies** | 6 |
| **Pages React** | 2 |
| **Routes** | 2 |
| **Total lignes code** | 660+ lignes |

---

## 🎯 RÉSUMÉ

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  ✅ SYSTÈME D'ADMISSION BIDIRECTIONNEL               ║
║                                                        ║
║  Professionnel → Établissement                        ║
║  • Recherche établissements                           ║
║  • Demande à rejoindre                                ║
║  • Suivi demandes                                     ║
║                                                        ║
║  Établissement → Professionnel                        ║
║  • Invitation professionnels                          ║
║  • Approbation demandes                               ║
║  • Gestion complète                                   ║
║                                                        ║
║  Validation automatique                               ║
║  • Création affiliation automatique                   ║
║  • Permissions assignées selon rôle                   ║
║  • Matricule auto-généré                              ║
║                                                        ║
║  Sécurité                                             ║
║  • RLS policies complètes                             ║
║  • Vérifications anti-doublons                        ║
║  • Permissions granulaires                            ║
║                                                        ║
║  Interface                                            ║
║  • 2 pages complètes                                  ║
║  • Formulaires intuitifs                              ║
║  • Badges et statuts clairs                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

**Système d'admission bidirectionnel 100% fonctionnel !** 🎉
