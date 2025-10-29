# 📋 RÉSUMÉ COMPLET DES COMPTES SANTE.GA

## 🏥 COMPTE PATIENT - PIERRETTE NOMSI

### Informations de Connexion
- **URL** : `http://localhost:8080/login/patient`
- **Email** : `pierrette.nomsi@gmail.com`
- **Mot de passe** : `Nomsi@Patient2024`
- **ID Patient** : `PAT-001`

### Profil Patient
- **Nom complet** : Pierrette NOMSI
- **Date de naissance** : 15/04/1985
- **Téléphone** : +241 07 45 67 89
- **Ville** : Port-Gentil
- **Groupe sanguin** : O+
- **Allergie** : Pénicilline
- **Condition chronique** : Hypertension légère
- **Traitement actuel** : Amlodipine 5mg - 1x/jour

### Historique Médical (Implémenté)
1. **Consultation Médecin de ville** (15/03/2024)
   - Dr. Jean-Marc OBIANG - Cabinet Médical du Centre
   - Diagnostic : Surmenage professionnel
   - Prescription : Repos, vitamines B12

2. **Radiologie** (20/05/2024)
   - Centre d'Imagerie Médicale de Port-Gentil
   - Dr. Sylvie MENGUE
   - Résultat : Radiographie thoracique normale

3. **Consultations CMST SOGARA** (3 visites)
   - **10/06/2024** : Visite médicale annuelle (Dr. Marie OKEMBA) - Apte
   - **18/09/2024** : Urgences - Migraine (Dr. Paul NGUEMA)
   - **18/10/2024** : Suivi HTA (Dr. Marie OKEMBA) - TA 13/8

4. **Analyses Laboratoire** (10/06/2024)
   - Bilan sanguin complet au Laboratoire CMST SOGARA
   - Hémoglobine : 13.5 g/dL (N)
   - Glycémie : 0.95 g/L (N)
   - Cholestérol : 1.85 g/L (N)
   - Créatinine : 8 mg/L (N)

5. **RDV Futur**
   - 18/01/2025 à 10h00 - Suivi HTA avec Dr. OKEMBA

### Double Compte (Professionnel)
Pierrette NOMSI a aussi un accès professionnel en tant que Chef QUALITÉ chez SOGARA :
- **Email pro** : `p.nomsi@sogara.ga`
- **Département** : Qualité et Conformité
- **Matricule** : EMP-SOGARA-0006

---

## 👥 AUTRES COMPTES PATIENTS

### Christian AVARO
- **Email** : `christian.avaro.perso@gmail.com`
- **Mot de passe** : `Avaro@Patient2024`
- **ID** : PAT-002
- **Groupe sanguin** : A+
- **Double compte** : Directeur Général SOGARA

### Ingride TCHEN
- **Email** : `ingride.tchen@gmail.com`
- **Mot de passe** : `Tchen@Patient2024`
- **ID** : PAT-003
- **Groupe sanguin** : B+
- **Double compte** : Directrice RH SOGARA

---

## 👨‍⚕️ COMPTES PROFESSIONNELS SOGARA (12)

### Administrateurs Établissement
| Nom | Email | Mot de passe | Matricule |
|-----|-------|--------------|-----------|
| Jean-Pierre Mbadinga | admin@sogara.com | Admin@SOGARA2024 | ADM-001 |
| Dr. François Obiang | directeur@sogara.com | DirecteurSOGARA2024! | DIR-001 |

### Médecins
| Nom | Email | Mot de passe | Spécialité |
|-----|-------|--------------|------------|
| Dr. Marie OKEMBA | dr.okemba@sogara.com | Okemba@2024Med | Médecine Générale |
| Dr. Paul NGUEMA | dr.nguema@sogara.com | Nguema@Urgence24 | Urgences |
| Dr. Léa Mbina | dr.mbina@sogara.com | Mbina@Cardio2024 | Cardiologie |
| Dr. Thomas Mezui | dr.mezui@sogara.com | Mezui@Pediatrie24 | Pédiatrie |

### Personnel Médical
| Nom | Email | Mot de passe | Service |
|-----|-------|--------------|---------|
| Sylvie Mba | nurse.mba@sogara.com | MbaSI@2024 | Soins Intensifs |
| Patricia Nze | nurse.nze@sogara.com | NzeUrg@2024 | Urgences |
| Claire Andeme | nurse.andeme@sogara.com | Andeme@Mat2024 | Maternité |

### Autres Services
| Nom | Email | Mot de passe | Service |
|-----|-------|--------------|---------|
| André Moussavou | lab.tech@sogara.com | LabSOGARA@2024 | Laboratoire |
| Dr. Lydie Kombila | pharma@sogara.com | PharmaSOGARA@24 | Pharmacie |
| Nadège Oyono | accueil@sogara.com | AccueilSOGARA@24 | Accueil |

---

## 🛡️ COMPTE SUPER ADMIN

- **Email** : `admin@sante.ga`
- **Mot de passe** : `SuperAdmin@2024!`
- **ID** : ADM-001
- **Accès** : Toutes les fonctionnalités de gestion

---

## 📊 STATISTIQUES GLOBALES

- **Total Comptes** : 16
- **Patients** : 3 (dont 3 avec double compte pro)
- **Professionnels** : 12 (SOGARA)
- **Super Admin** : 1
- **Comptes Actifs** : 16/16

---

## 🔒 ACCÈS SUPER ADMIN - GESTION DES IDENTIFIANTS

### Route
`http://localhost:8080/admin/credentials`

### Fonctionnalités
- ✅ Vue complète de tous les identifiants
- ✅ Masquage/Affichage des mots de passe
- ✅ Copie rapide des identifiants
- ✅ Export CSV sécurisé
- ✅ Recherche et filtrage
- ✅ Historique de connexion
- ✅ Gestion des statuts

### Sécurité
- ⚠️ Accessible uniquement au Super Admin
- 🔐 Données sensibles protégées
- 📋 Logs d'accès et d'export
- 🔑 Mots de passe masqués par défaut

---

## 📝 SCRIPTS SQL

### Création Comptes Patients
```sql
-- Fichier: create-patient-accounts-sogara.sql
-- Crée les comptes patients avec historique médical
-- Exécuter dans Supabase SQL Editor
```

### Création Comptes Professionnels
```sql
-- Fichier: create-sogara-accounts.sql
-- Crée les 12 comptes professionnels SOGARA
-- Exécuter dans Supabase SQL Editor
```

---

## 🚀 TEST RAPIDE

### 1. Test Patient (Pierrette NOMSI)
```
URL: http://localhost:8080/login/patient
Email: pierrette.nomsi@gmail.com
Password: Nomsi@Patient2024
```
→ Accès au dossier médical, historique, RDV

### 2. Test Professionnel (Dr. OKEMBA)
```
URL: http://localhost:8080/login/professional
Email: dr.okemba@sogara.com
Password: Okemba@2024Med
```
→ Accès au dashboard CMST SOGARA

### 3. Test Super Admin
```
URL: http://localhost:8080/login/admin
Email: admin@sante.ga
Password: SuperAdmin@2024!
```
→ Accès à la gestion des identifiants : `/admin/credentials`

---

## 📱 EMPLOYÉS SOGARA (Base RH)

### Direction & Cadres (8 personnes)
1. **Christian AVARO** - Directeur Général
2. **Ingride TCHEN** - Directrice RH
3. **Éric AVARO** - Directeur Communication
4. **Lié Orphé BOURDES** - Chef Division HSSE
5. **Lise Véronique DITSOUGOU** - Chef HSSE Opérationnel
6. **Pierrette NOMSI** - Chef QUALITÉ et CONFORMITÉ
7. **Sylvie KOUMBA** - Responsable Sécurité
8. **Pierre BEKALE** - Technicien Raffinage

→ Accessible sur : `http://localhost:8080/establishments/sogara/admin/employees`

---

## 🔗 LIENS RAPIDES

- **Gestion Identifiants** : `/admin/credentials`
- **Dashboard SOGARA** : `/establishments/sogara/admin`
- **Employés SOGARA** : `/establishments/sogara/admin/employees`
- **Login Patient** : `/login/patient`
- **Login Pro** : `/login/professional`
- **Login Admin** : `/login/admin`

---

**Dernière mise à jour** : 2024-10-29
**Status** : ✅ Tous les comptes sont fonctionnels et prêts
