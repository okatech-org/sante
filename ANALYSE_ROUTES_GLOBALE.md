# 📋 ANALYSE GLOBALE DES ROUTES - SANTE.GA

**Date**: Décembre 2024  
**Architecture**: Neural Event-Driven avec Express.js (Backend) + React Router (Frontend)

---

## 🎯 VUE D'ENSEMBLE

L'application SANTE.GA utilise une architecture hybride :
- **Backend**: API REST Express.js avec architecture neuronale (EventBus)
- **Frontend**: Single Page Application (SPA) React avec React Router
- **Authentification**: JWT avec système de rôles et permissions granulaires
- **Séparation**: Routes API (`/api/*`) vs Routes Frontend (SPA)

---

## 🗂️ ARCHITECTURE DES ROUTES BACKEND

### 1. Routes d'Authentification (`/api/auth`)

**Fichier**: `src/neural/routes/auth.routes.js`

| Méthode | Route | Authentification | Description |
|---------|-------|-------------------|-------------|
| `POST` | `/api/auth/register` | ❌ Publique | Inscription utilisateur (email/phone + password + role) |
| `POST` | `/api/auth/login` | ❌ Publique | Connexion (email/phone + password) → retourne JWT |
| `POST` | `/api/auth/logout` | ✅ Requise | Déconnexion (invalide le token) |
| `POST` | `/api/auth/password/reset` | ❌ Publique | Demande de réinitialisation de mot de passe |
| `GET` | `/api/auth/me` | ✅ Requise | Récupère le profil utilisateur connecté |
| `GET` | `/api/auth/verify` | ✅ Requise | Vérifie la validité du token JWT |
| `GET` | `/api/auth/refresh` | ✅ Requise | Rafraîchit le token JWT |

**Logique**:
- Utilise `AuthNeuron` pour la logique métier
- Validation des champs requis (email/phone, password, role)
- Génération de tokens JWT avec permissions incluses
- Émission d'événements via EventBus (`PASSWORD_RESET_REQUESTED`)

---

### 2. Routes Patients (`/api/patients`)

**Fichier**: `src/neural/routes/patient.routes.js`

| Méthode | Route | Authentification | Description |
|---------|-------|-------------------|-------------|
| `GET` | `/api/patients/me` | ✅ Requise | Profil patient du user connecté |
| `PUT` | `/api/patients/me` | ✅ Requise | Mise à jour du profil patient |
| `POST` | `/api/patients/me/verify-insurance` | ✅ Requise | Vérification assurances (CNAMGS/CNSS) |
| `GET` | `/api/patients/me/dmp` | ✅ Requise | DMP complet du patient |
| `GET` | `/api/patients/:id/dmp` | ✅ Requise | DMP d'un patient (accès contrôlé) |
| `POST` | `/api/patients/me/medical-history` | ✅ Requise | Ajout historique médical |
| `POST` | `/api/patients/me/vaccinations` | ✅ Requise | Ajout vaccination |
| `POST` | `/api/patients/me/consultations` | ✅ Requise | Ajout consultation |
| `POST` | `/api/patients/me/consents` | ✅ Requise | Accord de consentement |

**Logique**:
- Préfixe automatique `patient_{userId}` pour les IDs
- Contrôle d'accès au DMP (patient peut voir son DMP, professionnels selon permissions)
- Utilise `PatientNeuron` pour toutes les opérations
- Gestion des assurances (CNAMGS/CNSS) via `InsuranceService`

---

### 3. Routes Professionnels (`/api/professionals`)

**Fichier**: `src/neural/routes/professional.routes.js`

| Méthode | Route | Authentification | Description |
|---------|-------|-------------------|-------------|
| `GET` | `/api/professionals/search` | ❌ Publique | Recherche professionnels (filters: specialty, city, teleconsultation, verified) |
| `GET` | `/api/professionals/:professionalId` | ❌ Publique | Profil public d'un professionnel |
| `GET` | `/api/professionals/:professionalId/schedule` | ❌ Publique | Planning/disponibilités |
| `PUT` | `/api/professionals/:professionalId/schedule` | ✅ + Rôle | Modification planning (doctors uniquement) |
| `PUT` | `/api/professionals/me` | ✅ + Rôle | Mise à jour profil pro (doctors uniquement) |

**Logique**:
- Recherche publique avec filtres optionnels
- Planning accessible publiquement pour la réservation
- Modification réservée aux médecins (`doctor_general`, `doctor_specialist`)
- Utilise `ProfessionalNeuron` pour les opérations

---

### 4. Routes Rendez-vous (`/api/appointments`)

**Fichier**: `src/neural/routes/appointment.routes.js`

| Méthode | Route | Authentification | Description |
|---------|-------|-------------------|-------------|
| `POST` | `/api/appointments` | ✅ Requise | Création d'un RDV (patient ou pro) |
| `GET` | `/api/appointments/me` | ✅ Requise | Liste des RDV (filtrée par rôle) |
| `GET` | `/api/appointments/:appointmentId` | ✅ Requise | Détails d'un RDV |
| `POST` | `/api/appointments/:appointmentId/confirm` | ✅ + Rôle | Confirmation RDV (doctors uniquement) |
| `POST` | `/api/appointments/:appointmentId/cancel` | ✅ Requise | Annulation RDV |

**Logique**:
- Route `/me` adaptative : patient → `PatientAppointments`, pro → `ProfessionalAppointments`
- Filtres: `status`, `upcoming`
- Utilise `AppointmentNeuron` avec gestion d'état
- Émission d'événements pour notifications

---

### 5. Routes Notifications (`/api/notifications`)

**Fichier**: `src/neural/routes/notification.routes.js`

| Méthode | Route | Authentification | Description |
|---------|-------|-------------------|-------------|
| `GET` | `/api/notifications` | ✅ Requise | Liste notifications (limit: 20 par défaut) |
| `PUT` | `/api/notifications/:notificationId/read` | ✅ Requise | Marquer notification comme lue |

**Logique**:
- Notifications liées à `userId` (via token JWT)
- Pagination via paramètre `limit`
- Utilise `NotificationNeuron` pour gestion multi-canaux (SMS, Email, Push)

---

### 6. Routes Dashboard (`/api/dashboard`)

**Fichier**: `src/neural/routes/dashboard.routes.js`

| Méthode | Route | Authentification | Description |
|---------|-------|-------------------|-------------|
| `GET` | `/api/dashboard/kpis` | ✅ + Rôle | KPIs (Ministre/Admin/SuperAdmin) |
| `GET` | `/api/dashboard/alerts` | ✅ + Rôle | Alertes actives |
| `GET` | `/api/dashboard/decrets` | ✅ + Rôle | Liste décrets (filtre: status) |
| `POST` | `/api/dashboard/decrets` | ✅ + Rôle | Création décret |
| `PATCH` | `/api/dashboard/decrets/:id` | ✅ + Rôle | Modification décret |
| `DELETE` | `/api/dashboard/decrets/:id` | ✅ + Rôle | Suppression décret |
| `GET` | `/api/dashboard/objectifs` | ✅ + Rôle | Objectifs (filtre: category) |
| `POST` | `/api/dashboard/objectifs` | ✅ + Rôle | Création objectif |
| `PATCH` | `/api/dashboard/objectifs/:id` | ✅ + Rôle | Modification objectif |
| `GET` | `/api/dashboard/provinces` | ✅ + Rôle | Liste provinces |
| `GET` | `/api/dashboard/provinces/:id` | ✅ + Rôle | Détails province |
| `PATCH` | `/api/dashboard/provinces/:id` | ✅ + Rôle | Modification province |
| `GET` | `/api/dashboard/stats` | ✅ + Rôle | Statistiques agrégées |

**Logique**:
- Accès réservé: `MINISTRE`, `ADMIN`, `SUPER_ADMIN`
- Direct Supabase (pas de neuron dédié)
- Émission d'événements EventBus pour chaque mutation
- KPIs avec paramètre `periode` (mois/jour/année)

---

### 7. Routes Système

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/health` | Health check + statut neurones |
| `GET` | `/metrics/eventbus` | Métriques EventBus |
| `GET` | `/events/history` | Historique événements (limit, type) |

**Logique**:
- `/health` retourne l'état de tous les neurones
- Métriques EventBus pour monitoring
- Historique des événements pour debugging

---

### 8. Routes Frontend (SPA)

**Route spéciale**: `/gouv/*`  
- Serve les fichiers statiques React depuis `dist/`
- Fallback vers `index.html` pour React Router (SPA)

---

## 🌐 ARCHITECTURE DES ROUTES FRONTEND

### Fichiers de Routage
- `src/App.tsx` - Routes principales (version simplifiée)
- `src/AppMain.tsx` - Routes complètes avec toutes les pages

---

### 1. Routes Publiques (Sans authentification)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `Index` | Page d'accueil |
| `/landing` | `Landing` | Landing page |
| `/about` | `About` | À propos |
| `/services` | `Services` | Services proposés |
| `/how-it-works` | `HowItWorks` | Fonctionnement |
| `/awareness` | `Awareness` | Sensibilisation |
| `/for-professionals` | `ForProfessionals` | Espace professionnels |
| `/cartography` | `Cartography` | Cartographie publique |

---

### 2. Routes d'Authentification

| Route | Composant | Description |
|-------|-----------|-------------|
| `/login` | `Login` | Connexion générale |
| `/login/patient` | `LoginPatient` | Connexion patient |
| `/login/professional` | `LoginProfessional` | Connexion professionnel |
| `/login/pro` | `LoginProfessional` | Alias connexion pro |
| `/login/admin` | `SuperAdminLogin` | Connexion admin |
| `/login/superadmin` | `SuperAdminLogin` | Connexion super-admin |
| `/register` | `Register` | Inscription générale |
| `/register/patient` | `RegisterPatient` | Inscription patient |
| `/register/professional` | `RegisterProfessional` | Inscription professionnel |

---

### 3. Routes Dashboard par Rôle

#### Patient
| Route | Composant | Description |
|-------|-----------|-------------|
| `/dashboard/patient` | `DashboardPatient` | Dashboard patient |

#### Professionnel
| Route | Composant | Layout | Description |
|-------|-----------|--------|-------------|
| `/professional` | `ProfessionalHub` | `ProfessionalEstablishmentLayout` | Hub professionnel |
| `/professional/dashboard` | `ProfessionalHub` | `ProfessionalEstablishmentLayout` | Dashboard pro |
| `/professional/director-dashboard` | `DirectorDashboard` | `ProfessionalEstablishmentLayout` | Dashboard directeur |
| `/professional/doctor-dashboard` | `DoctorDashboard` | `ProfessionalEstablishmentLayout` | Dashboard médecin |
| `/professional/select-establishment` | `SelectEstablishment` | - | Sélection établissement |
| `/professional/select-role/:establishmentId` | `SelectRole` | - | Sélection rôle |
| `/professional/establishments` | `EstablishmentsManager` | - | Gestion établissements |

#### Modules Professionnels (Accueil)
| Route | Composant | Description |
|-------|-----------|-------------|
| `/professional/accueil-hdj` | `AccueilHDJPage` | Accueil Hôpital de Jour |
| `/professional/accueil-hdj/rdv` | `AccueilHDJRdvPage` | RDV HDJ |
| `/professional/accueil-hdj/files-attente` | `AccueilHDJFilesAttentePage` | Files d'attente HDJ |
| `/professional/accueil-hdj/dossiers` | `AccueilHDJDossiersPage` | Dossiers HDJ |
| `/professional/accueil-urgences` | `AccueilUrgencesPage` | Accueil Urgences |
| `/professional/accueil-urgences/triage` | `AccueilUrgencesTriagePage` | Triage urgences |
| `/professional/accueil-urgences/dossiers` | `AccueilUrgencesDossiersPage` | Dossiers urgences |
| `/professional/accueil-hospitalisation` | `AccueilHospitalisationDashboardPage` | Dashboard hospitalisation |
| `/professional/accueil-hospitalisation/admissions` | `AccueilHospitalisationAdmissionsPage` | Admissions |
| `/professional/accueil-hospitalisation/chambres` | `AccueilHospitalisationChambresPage` | Gestion chambres |
| `/professional/accueil-hospitalisation/sorties` | `AccueilHospitalisationSortiesPage` | Sorties |

#### Modules Professionnels (Fonctionnels)
| Route | Composant | Layout | Description |
|-------|-----------|--------|-------------|
| `/professional/consultations` | `ProfessionalConsultations` | `ProfessionalEstablishmentLayout` | Consultations |
| `/professional/hospitalization` | `ProfessionalHospitalization` | `ProfessionalEstablishmentLayout` | Hospitalisation |
| `/professional/technical` | `ProfessionalTechnicalPlatforms` | `ProfessionalEstablishmentLayout` | Plateformes techniques |
| `/professional/statistics` | `ProfessionalStatistics` | `ProfessionalEstablishmentLayout` | Statistiques |
| `/professional/messages` | `ProfessionalMessages` | `ProfessionalEstablishmentLayout` | Messages |
| `/professional/staff` | `ProfessionalStaff` | `ProfessionalEstablishmentLayout` | Personnel |
| `/professional/billing` | `ProfessionalBilling` | `ProfessionalEstablishmentLayout` | Facturation |
| `/professional/inventory` | `ProfessionalInventory` | `ProfessionalEstablishmentLayout` | Inventaire |
| `/professional/reports` | `ProfessionalReports` | `ProfessionalEstablishmentLayout` | Rapports |
| `/professional/medical-staff` | `ProfessionalMedicalStaff` | `ProfessionalEstablishmentLayout` | Personnel médical |
| `/professional/services` | `ProfessionalServices` | `ProfessionalEstablishmentLayout` | Services |
| `/professional/protocols` | `ProfessionalProtocols` | `ProfessionalEstablishmentLayout` | Protocoles |
| `/professional/infrastructure` | `ProfessionalInfrastructure` | `ProfessionalEstablishmentLayout` | Infrastructure |
| `/professional/settings` | `ProfessionalSettings` | `ProfessionalEstablishmentLayout` | Paramètres |
| `/professional/teleconsultations` | `ProfessionalTeleconsultations` | `ProfessionalEstablishmentLayout` | Téléconsultations |
| `/professional/patients` | `ProfessionalPatients` | `ProfessionalEstablishmentLayout` | Patients |
| `/professional/appointments` | `ProfessionalAppointments` | `ProfessionalEstablishmentLayout` | Rendez-vous |

---

### 4. Routes Services Patient

| Route | Composant | Description |
|-------|-----------|-------------|
| `/medical-record` | `MedicalRecord` | Dossier médical |
| `/appointments` | `Appointments` | Mes rendez-vous |
| `/prescriptions` | `Prescriptions` | Prescriptions |
| `/results` | `Results` | Résultats examens |
| `/reimbursements` | `Reimbursements` | Remboursements |
| `/teleconsultation` | `Teleconsultation` | Téléconsultation |
| `/messages` | `Messages` | Messages |
| `/parametres` | `Parametres` | Paramètres |

---

### 5. Routes Administration

| Route | Composant | Description |
|-------|-----------|-------------|
| `/admin` | `AdminDashboard` | Dashboard admin |
| `/dashboard/admin` | `AdminDashboard` | Alias dashboard admin |
| `/admin/users` | `AdminUsers` | Gestion utilisateurs |
| `/admin/health-actors` | `AdminHealthActors` | Acteurs santé |
| `/admin/approvals` | `AdminApprovals` | Approbations |
| `/admin/establishments` | `AdminEstablishments` | Gestion établissements |
| `/admin/cartography` | `AdminCartography` | Cartographie admin |
| `/admin/billing` | `AdminBilling` | Facturation |
| `/admin/api` | `AdminAPI` | Gestion API |
| `/admin/security` | `AdminSecurity` | Sécurité |
| `/admin/support` | `AdminSupport` | Support |
| `/admin/analytics` | `AdminAnalytics` | Analytics |
| `/admin/system` | `AdminSystem` | Système |
| `/admin/credentials` | `AdminCredentials` | Identifiants |

---

### 6. Routes Ministère de la Santé

#### Routes Publiques
| Route | Composant | Description |
|-------|-----------|-------------|
| `/ministry` | `MinistryPublic` | Page publique ministère |
| `/Ministry` | `MinistryPublic` | Alias (case-sensitive) |
| `/ministry/public` | `MinistryPublic` | Page publique |
| `/ministry/test` | `MinistryTest` | Page de test |
| `/ministere` | `MinistryPublic` | Alias français |
| `/Ministere` | `MinistryPublic` | Alias (case-sensitive) |

#### Routes Protégées
| Route | Composant | Description |
|-------|-----------|-------------|
| `/ministry/dashboard` | `MinistryDashboard` | Dashboard ministère |
| `/ministry/login` | `MinistryLogin` | Connexion ministère |
| `/ministere/dashboard` | `MinistryDashboard` | Alias dashboard |
| `/ministere/connexion` | `MinistryLogin` | Alias connexion |
| `/gouv/dashboard` | `MinisterDashboard` | Dashboard ministre |
| `/minister/dashboard` | `MinisterDashboard` | Dashboard ministre |
| `/ministre/dashboard` | `MinisterDashboard` | Dashboard ministre |

---

### 7. Routes Établissements

#### Route Générique
| Route | Composant | Description |
|-------|-----------|-------------|
| `/establishment/:id` | `EstablishmentHomePage` | Page d'accueil établissement |
| `/etablissement/:id` | `EstablishmentHomePage` | Alias français |

#### Routes Spécialisées SOGARA
| Route | Composant | Description |
|-------|-----------|-------------|
| `/sogara` | `Sogara` / `SogaraPublic` | Page publique SOGARA |
| `/establishments/sogara/admin` | `SogaraDashboard` | Dashboard SOGARA admin |
| (Routes SOGARA dédiées dans AppMain) | - | Pages spécialisées SOGARA |

#### Routes CHU (Centres Hospitaliers Universitaires)
| Route | Composant |
|-------|-----------|
| `/chu-libreville` | `EstablishmentHomePage` |
| `/chu-jeanne-ebori` | `EstablishmentHomePage` |
| `/chu-melen` | `EstablishmentHomePage` |
| `/chu-angondje` | `EstablishmentHomePage` |

#### Routes CHR (Centres Hospitaliers Régionaux)
| Route | Composant |
|-------|-----------|
| `/chr-franceville` | `EstablishmentHomePage` |
| `/chr-port-gentil` | `EstablishmentHomePage` |
| `/chr-oyem` | `EstablishmentHomePage` |
| `/chr-mouila` | `EstablishmentHomePage` |
| `/chr-tchibanga` | `EstablishmentHomePage` |
| `/chr-makokou` | `EstablishmentHomePage` |
| `/chr-koulamoutou` | `EstablishmentHomePage` |
| `/chr-lambarene` | `EstablishmentHomePage` |
| `/chr-omboue` | `EstablishmentHomePage` |

#### Routes Hôpitaux Spécialisés
| Route | Composant |
|-------|-----------|
| `/hopital-sino-gabonais` | `EstablishmentHomePage` |
| `/hia-obo` | `EstablishmentHomePage` |
| `/hopital-psychiatrique-melen` | `EstablishmentHomePage` |
| `/ch-nkembo` | `EstablishmentHomePage` |

#### Routes Cliniques/Polycliniques
| Route | Composant |
|-------|-----------|
| `/clinique-el-rapha` | `EstablishmentHomePage` |
| `/polyclinique-chambrier` | `EstablishmentHomePage` |
| `/polyclinique-el-rapha-2` | `EstablishmentHomePage` |
| `/cm-sabliere` | `EstablishmentHomePage` |
| `/clinique-littoral` | `EstablishmentHomePage` |
| `/clinique-estuaire` | `EstablishmentHomePage` |

#### Routes Centres Spécialisés
| Route | Composant |
|-------|-----------|
| `/cts-libreville` | `EstablishmentHomePage` |
| `/icl` | `EstablishmentHomePage` |
| `/dialyse-libreville` | `EstablishmentHomePage` |
| `/cnr` | `EstablishmentHomePage` |

#### Routes Laboratoires/Recherche
| Route | Composant |
|-------|-----------|
| `/lnsp` | `EstablishmentHomePage` |
| `/cermel` | `EstablishmentHomePage` |
| `/iele` | `EstablishmentHomePage` |

---

### 8. Routes Support

| Route | Composant | Description |
|-------|-----------|-------------|
| `/support` | `Support` | Page de support |

---

### 9. Routes Démonstration

| Route | Composant | Description |
|-------|-----------|-------------|
| `/demo/doctor` | `DemoDoctorDashboard` | Dashboard médecin démo |

---

### 10. Routes Initialisation (Dev/Admin)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/initialize-users` | `InitializeUsers` | Initialisation utilisateurs |
| `/fix-minister-role` | `FixMinisterRole` | Correction rôle ministre |

---

## 🔐 SYSTÈME D'AUTHENTIFICATION & AUTORISATION

### Middleware d'Authentification

**Fichier**: `src/neural/neurons/auth/AuthMiddleware.js`

1. **`authenticate`**: Vérifie la présence et validité du token JWT
   - Headers: `Authorization: Bearer <token>`
   - Décode le token et ajoute `req.user`
   - Retourne 401 si token invalide/absent

2. **`authorize(...roles)`**: Vérifie que l'utilisateur a un des rôles requis
   - Utilise `req.user.role`
   - Retourne 403 si rôle non autorisé

3. **`requirePermission(...permissions)`**: Vérifie les permissions granulaires
   - Utilise `PermissionService.hasAllPermissions()`
   - Retourne 403 si permissions insuffisantes

4. **`optionalAuth`**: Authentification optionnelle
   - N'échoue pas si token absent
   - Ajoute `req.user` si token valide

### Rôles Utilisateur

8 catégories principales (définies dans `RoleDefinitions.js`):
- `PATIENT`
- `DOCTOR_GENERAL`
- `DOCTOR_SPECIALIST`
- `PHARMACIST`
- `LABORATORY_TECHNICIAN`
- `NURSE`
- `ADMIN`
- `MINISTRE` (Ministre de la Santé)
- `SUPER_ADMIN`

---

## 📊 FLUX DE ROUTAGE GLOBAL

```
CLIENT (Browser)
    │
    ├─ Frontend Routes (React Router)
    │   ├─ Routes Publiques (/about, /services, etc.)
    │   ├─ Routes Auth (/login, /register)
    │   ├─ Routes Dashboard (/dashboard/patient, /professional/dashboard)
    │   ├─ Routes Admin (/admin/*)
    │   └─ Routes Établissements (/establishment/:id, /sogara, etc.)
    │
    └─ API Calls (via neuralApi.ts)
        │
        └─ Backend Routes (Express.js)
            ├─ /api/auth → AuthNeuron
            ├─ /api/patients → PatientNeuron
            ├─ /api/professionals → ProfessionalNeuron
            ├─ /api/appointments → AppointmentNeuron
            ├─ /api/notifications → NotificationNeuron
            └─ /api/dashboard → Supabase direct
                │
                └─ Middleware Chain
                    ├─ authenticate (JWT validation)
                    ├─ authorize (role check)
                    └─ requirePermission (granular permissions)
                        │
                        └─ Neurons (Business Logic)
                            └─ EventBus (Event-Driven Communication)
```

---

## 🎨 SCHÉMA VISUEL DES ROUTES

```
┌─────────────────────────────────────────────────────────────────┐
│                    SANTE.GA - ROUTES GLOBALES                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (SPA)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PUBLIC ROUTES          AUTH ROUTES         DASHBOARD ROUTES   │
│  ├─ /                    ├─ /login            ├─ /dashboard/    │
│  ├─ /about               ├─ /register         │   patient       │
│  ├─ /services            └─ /login/*          ├─ /professional/ │
│  ├─ /cartography         └─ /register/*      │   dashboard      │
│  └─ /ministry/public                         └─ /admin          │
│                                                 │                │
│  ESTABLISHMENT ROUTES    MINISTRY ROUTES      │                │
│  ├─ /establishment/:id   ├─ /ministry         │                │
│  ├─ /sogara              ├─ /gouv/dashboard   │                │
│  ├─ /chu-*               └─ /minister/*       │                │
│  ├─ /chr-*                                    │                │
│  └─ /clinique-*                               │                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API (Express)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /api/auth              /api/patients        /api/professionals │
│  ├─ POST /register      ├─ GET /me           ├─ GET /search     │
│  ├─ POST /login         ├─ PUT /me           ├─ GET /:id        │
│  ├─ GET /me             ├─ GET /me/dmp       └─ GET /:id/       │
│  └─ POST /logout        └─ POST /me/...            schedule     │
│                                                                 │
│  /api/appointments      /api/notifications  /api/dashboard     │
│  ├─ POST /               ├─ GET /            ├─ GET /kpis       │
│  ├─ GET /me              └─ PUT /:id/read   ├─ GET /alerts     │
│  ├─ POST /:id/confirm                       ├─ GET /decrets    │
│  └─ POST /:id/cancel                        └─ GET /stats      │
│                                                                 │
│  SYSTEM ROUTES                                                 │
│  ├─ GET /health                                               │
│  ├─ GET /metrics/eventbus                                     │
│  └─ GET /events/history                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Middleware Chain
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  authenticate ──► authorize ──► requirePermission             │
│       │                │                   │                     │
│       │                │                   │                     │
│       ▼                ▼                   ▼                     │
│    JWT Check      Role Check        Permission Check            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Validated Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEURAL LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AuthNeuron      PatientNeuron    ProfessionalNeuron           │
│  ├─ register      ├─ getProfile    ├─ searchProfessionals      │
│  ├─ login         ├─ updateProfile  ├─ getProfile               │
│  └─ logout        ├─ getFullDMP    └─ setSchedule              │
│                   └─ verifyInsurances                           │
│                                                                 │
│  AppointmentNeuron    NotificationNeuron    EventBus            │
│  ├─ createAppointment ├─ getNotifications  ├─ publish()         │
│  ├─ getAppointments  └─ markAsRead        ├─ subscribe()      │
│  └─ cancelAppointment                     └─ emit()            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Data Operations
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Supabase PostgreSQL                                            │
│  ├─ users, profiles                                             │
│  ├─ appointments, notifications                                 │
│  ├─ medical_records, dmp                                        │
│  └─ dashboard_kpis, dashboard_provinces                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 PATTERNS DE ROUTAGE

### 1. Pattern RESTful
- **GET**: Lecture de données
- **POST**: Création de ressources
- **PUT**: Mise à jour complète
- **PATCH**: Mise à jour partielle
- **DELETE**: Suppression

### 2. Pattern `/me` pour ressources utilisateur
- `/api/patients/me` → Ressource de l'utilisateur connecté
- `/api/appointments/me` → RDV de l'utilisateur connecté
- Simplifie l'accès aux données personnelles

### 3. Pattern de Filtrage
- Query parameters: `?status=pending&upcoming=true`
- Utilisé dans: `/api/appointments/me?status=confirmed`
- Utilisé dans: `/api/professionals/search?specialty=cardio&city=Libreville`

### 4. Pattern Hiérarchique pour Établissements
- Route générique: `/establishment/:id`
- Routes spécialisées: `/sogara`, `/chu-libreville`
- Toutes résolvent vers `EstablishmentHomePage` avec contexte

### 5. Pattern de Layout Wrapper
- Routes professionnelles: `ProfessionalEstablishmentLayout`
- Permet sidebar, navigation commune
- Appliqué via `<Route element={<Layout><Component /></Layout>}>`

---

## 🚨 GESTION D'ERREURS

### Codes HTTP Standards
- **200**: Succès
- **201**: Création réussie
- **400**: Requête invalide (validation)
- **401**: Non authentifié (token manquant/invalide)
- **403**: Non autorisé (rôle/permissions insuffisants)
- **404**: Ressource non trouvée
- **500**: Erreur serveur

### Format de Réponse Erreur
```json
{
  "error": "Message d'erreur",
  "message": "Détails supplémentaires" // Optionnel
}
```

### Format de Réponse Succès
```json
{
  "success": true,
  "data": { ... } // ou "user", "appointment", etc.
}
```

---

## 📝 NOTES IMPORTANTES

1. **Séparation Frontend/Backend**: Le frontend est une SPA servie via `/gouv/*` avec fallback vers `index.html` pour React Router.

2. **Authentification**: Toutes les routes API (sauf publiques) nécessitent un token JWT dans `Authorization: Bearer <token>`.

3. **Rôles Multiples**: Un utilisateur peut avoir plusieurs rôles (ex: médecin + directeur d'établissement). Le token contient les rôles actifs.

4. **Event-Driven**: Les mutations importantes (création RDV, modifications DMP) déclenchent des événements via EventBus pour notifications asynchrones.

5. **Routes Dynamiques**: Certaines routes utilisent des paramètres dynamiques (`:id`, `:professionalId`, `:appointmentId`) extraits via `req.params`.

6. **Middleware Chain**: L'ordre des middlewares est critique: `authenticate` → `authorize` → `requirePermission` → handler.

---

## 🔍 POINTS D'AMÉLIORATION POTENTIELS

1. **Versioning API**: Ajouter `/api/v1/...` pour future évolution
2. **Rate Limiting**: Ajouter rate limiting sur routes publiques (`/api/auth/login`, `/api/professionals/search`)
3. **Validation**: Centraliser la validation avec Joi ou Zod
4. **Documentation**: Générer documentation OpenAPI/Swagger automatique
5. **Caching**: Ajouter cache pour routes fréquentes (`/api/professionals/search`)
6. **Pagination**: Standardiser pagination sur toutes les routes listes

---

**Document généré le**: Décembre 2024  
**Version**: 1.0

