# 🏥 Comptes CMST SOGARA - Guide d'Accès

## 📋 Vue d'Ensemble

Ce document liste tous les comptes d'accès au système SANTE.GA pour le Centre Médical de Santé au Travail (CMST) SOGARA.

---

## 🌐 Pages d'Accès

### 1. **Page Publique SOGARA**
- **URL**: `http://localhost:8081/sogara`
- **Accès**: Public (sans connexion)
- **Contenu**: 
  - Présentation de l'établissement
  - Services disponibles
  - Équipe médicale
  - Horaires et contact
  - Bouton "Personnel SOGARA" pour se connecter

### 2. **Pages de Connexion Personnel**

#### Option A : Page dédiée SOGARA
- **URL**: `http://localhost:8081/login/sogara`
- **Accès**: Personnel SOGARA uniquement
- **Redirection après connexion**: `/establishments/sogara/admin`

#### Option B : Page Professionnels générale ✅ **RECOMMANDÉ**
- **URL**: `http://localhost:8081/login/pro` ou `http://localhost:8081/login/professional`
- **Accès**: TOUS les professionnels (incluant SOGARA)
- **Redirection après connexion**: `/establishments/sogara/admin` pour SOGARA
- **Avantage**: Fonctionne avec TOUS les comptes SOGARA listés ci-dessous

### 3. **Dashboard Admin SOGARA**
- **URL**: `http://localhost:8081/establishments/sogara/admin`
- **Accès**: Administrateurs et Personnel SOGARA
- **Modules disponibles**:
  - Dashboard principal
  - Urgences (`/establishments/sogara/admin/emergency`)
  - Consultations (`/establishments/sogara/admin/consultations`)
  - Employés (`/establishments/sogara/admin/employees`)

### 4. **Page de Gestion Super Admin**
- **URL**: `http://localhost:8081/admin/establishments/sogara`
- **Accès**: Super Admin SANTE.GA uniquement
- **Fonctionnalités**:
  - Vue d'ensemble de l'établissement
  - Gestion des utilisateurs
  - **Comptes & Accès** (liste complète des identifiants)
  - Configuration système
  - Facturation
  - Logs & Audit

---

## 👥 Comptes Utilisateurs SOGARA

### 🛡️ **Administrateurs** (2 comptes)

#### 1. Jean-Pierre Mbadinga
- **Email**: `admin@sogara.com`
- **Mot de passe**: `Admin@SOGARA2024`
- **Rôle**: Administrateur
- **Département**: Administration
- **Matricule**: ADM-001
- **Statut**: ✅ Actif
- **Accès**: Dashboard admin complet

#### 2. Dr. François Obiang
- **Email**: `directeur@sogara.com`
- **Mot de passe**: `DirecteurSOGARA2024!`
- **Rôle**: Administrateur
- **Département**: Direction Médicale
- **Matricule**: DIR-001
- **Statut**: ✅ Actif
- **Accès**: Dashboard admin complet

---

### 🩺 **Médecins** (4 comptes)

#### 3. Dr. Marie Okemba
- **Email**: `dr.okemba@sogara.com`
- **Mot de passe**: `Okemba@2024Med`
- **Rôle**: Médecin
- **Département**: Médecine Générale
- **Matricule**: MED-012
- **Statut**: ✅ Actif

#### 4. Dr. Paul Nguema
- **Email**: `dr.nguema@sogara.com`
- **Mot de passe**: `Nguema@Urgence24`
- **Rôle**: Médecin
- **Département**: Urgences
- **Matricule**: MED-015
- **Statut**: ✅ Actif

#### 5. Dr. Léa Mbina
- **Email**: `dr.mbina@sogara.com`
- **Mot de passe**: `Mbina@Cardio2024`
- **Rôle**: Médecin
- **Département**: Cardiologie
- **Matricule**: MED-018
- **Statut**: ✅ Actif

#### 6. Dr. Thomas Mezui
- **Email**: `dr.mezui@sogara.com`
- **Mot de passe**: `Mezui@Pediatrie24`
- **Rôle**: Médecin
- **Département**: Pédiatrie
- **Matricule**: MED-022
- **Statut**: ✅ Actif

---

### 💉 **Infirmiers** (3 comptes)

#### 7. Sylvie Mba
- **Email**: `nurse.mba@sogara.com`
- **Mot de passe**: `MbaSI@2024`
- **Rôle**: Infirmier(e)
- **Département**: Soins Intensifs
- **Matricule**: INF-025
- **Statut**: ✅ Actif

#### 8. Patricia Nze
- **Email**: `nurse.nze@sogara.com`
- **Mot de passe**: `NzeUrg@2024`
- **Rôle**: Infirmier(e)
- **Département**: Urgences
- **Matricule**: INF-028
- **Statut**: ✅ Actif

#### 9. Claire Andeme
- **Email**: `nurse.andeme@sogara.com`
- **Mot de passe**: `Andeme@Mat2024`
- **Rôle**: Infirmier(e)
- **Département**: Maternité
- **Matricule**: INF-030
- **Statut**: ✅ Actif

---

### 🧪 **Technicien de Laboratoire** (1 compte)

#### 10. André Moussavou
- **Email**: `lab.tech@sogara.com`
- **Mot de passe**: `LabSOGARA@2024`
- **Rôle**: Technicien Laboratoire
- **Département**: Laboratoire
- **Matricule**: LAB-008
- **Statut**: ✅ Actif

---

### 💊 **Pharmacien** (1 compte)

#### 11. Dr. Lydie Kombila
- **Email**: `pharma@sogara.com`
- **Mot de passe**: `PharmaSOGARA@24`
- **Rôle**: Pharmacien
- **Département**: Pharmacie
- **Matricule**: PHAR-004
- **Statut**: ✅ Actif

---

### 📝 **Réceptionniste** (1 compte)

#### 12. Nadège Oyono
- **Email**: `accueil@sogara.com`
- **Mot de passe**: `AccueilSOGARA@24`
- **Rôle**: Réceptionniste
- **Département**: Accueil
- **Matricule**: REC-002
- **Statut**: ✅ Actif

---

## 🔐 Compte Super Admin SANTE.GA

### Super Admin
- **Email**: `superadmin@sante.ga`
- **Mot de passe**: `Asted1982*`
- **Rôle**: Super Administrateur
- **Accès**: 
  - Toute la plateforme SANTE.GA
  - Page de gestion SOGARA (`/admin/establishments/sogara`)
  - Visualisation de tous les comptes SOGARA

---

## 📊 Statistiques SOGARA

- **Total comptes**: 12
- **Administrateurs**: 2
- **Médecins**: 4
- **Infirmiers**: 3
- **Autres professionnels**: 3
- **Employés SOGARA**: 1,250
- **Ayants droit**: 420
- **Capacité**: 85 lits

---

## 🚀 Comment se Connecter

### Pour le Personnel SOGARA :

#### ✅ **Méthode Recommandée** (via page professionnels)
1. **Accéder directement** : `http://localhost:8081/login/pro`
2. **Entrer vos identifiants** (email et mot de passe listés ci-dessus)
3. **Accès automatique** au dashboard SOGARA

#### Alternative (via page dédiée SOGARA)
1. **Accéder à la page publique** : `http://localhost:8081/sogara`
2. **Cliquer sur** : "Personnel SOGARA" (bouton en haut à droite)
3. **Ou accéder directement** : `http://localhost:8081/login/sogara`
4. **Entrer vos identifiants** (email et mot de passe ci-dessus)
5. **Accès automatique** au dashboard selon votre rôle

### Pour le Super Admin :

1. **Accéder** : `http://localhost:8081/login/superadmin`
2. **Email** : `superadmin@sante.ga`
3. **Mot de passe** : `Asted1982*`
4. **Pour gérer SOGARA** : Aller sur `/admin/establishments` → Cliquer sur SOGARA → "Gérer l'établissement"

---

## ⚠️ Sécurité

**IMPORTANT** : Ces identifiants sont pour l'environnement de développement uniquement. 

En production :
- Tous les mots de passe doivent être hashés
- Authentification via Supabase Auth
- 2FA recommandé pour les administrateurs
- Audit complet des connexions
- Rotation régulière des mots de passe

---

## 📞 Support

Pour toute question concernant les accès :
- **Email** : service.rgc@sogara.com
- **Téléphone** : 011 55 26 21

---

**Dernière mise à jour** : 20 Janvier 2024
**Version** : 1.0
**Environnement** : Développement (Offline Mode)

