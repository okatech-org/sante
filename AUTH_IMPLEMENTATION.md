# 🔐 AuthNeuron - Authentification Multi-Rôles SANTE.GA

## Vue d'ensemble

L'AuthNeuron gère l'authentification complète pour les 8 catégories d'utilisateurs de SANTE.GA avec un système de permissions granulaires.

## 8 Catégories d'utilisateurs

### 1. 👥 Patients
- Role: `patient`
- Permissions: Voir propre DMP, créer RDV, lire prescriptions

### 2. 👨‍⚕️ Professionnels Médicaux
- Doctor Généraliste: `doctor_general`
- Doctor Spécialiste: `doctor_specialist`
- Permissions: Lire/écrire DMP patient, créer prescriptions, gérer RDV

### 3. 🏥 Établissements
- Hospital: `hospital`
- Clinic: `clinic`
- Permissions: Gérer personnel, voir analytics

### 4. 🩺 Professionnels Paramédicaux
- Nurse: `nurse`
- Midwife: `midwife`
- Physiotherapist: `physiotherapist`
- Psychologist: `psychologist`
- Permissions: Lire/écrire observations DMP, gérer RDV

### 5. 💊 Pharmacies
- Pharmacist: `pharmacist`
- Pharmacy: `pharmacy`
- Permissions: Lire prescriptions, dispenser médicaments

### 6. 🔬 Laboratoires
- Lab Technician: `lab_technician`
- Laboratory: `laboratory`
- Permissions: Effectuer examens, écrire résultats

### 7. 📡 Imagerie
- Radiologist: `radiologist`
- Imaging Center: `imaging_center`
- Permissions: Effectuer/valider examens d'imagerie

### 8. ⚙️ Administrateurs
- Admin Establishment: `admin_establishment`
- Super Admin: `super_admin`
- Permissions: Accès complet au système

## Structure des fichiers

```
src/neural/neurons/auth/
├── RoleDefinitions.js          # 8 catégories + permissions
├── PermissionService.js        # Gestion permissions
├── AuthService.js              # Logique auth (register/login/JWT)
└── AuthMiddleware.js           # Middleware Express

src/neural/neurons/
└── AuthNeuron.js               # Neurone principal

src/neural/routes/
└── auth.routes.js              # Routes API

src/neural/database/
└── supabase.js                 # Client Supabase (optionnel)
```

## API Routes

### POST /api/auth/register
Inscription nouvel utilisateur

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@sante.ga",
    "password": "SecurePass123!",
    "role": "patient",
    "profile": {
      "firstName": "Jean",
      "lastName": "Dupont"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_1761552512947_uqo84xseh",
    "email": "patient@sante.ga",
    "role": "patient"
  }
}
```

### POST /api/auth/login
Connexion et obtention JWT

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@sante.ga",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "role": "patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "permissions": [
    "read_own_dmp",
    "create_appointment",
    "read_prescription"
  ]
}
```

### GET /api/auth/me
Récupérer profil utilisateur connecté

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "userId": "user_1761552512947...",
    "email": "patient@sante.ga",
    "role": "patient",
    "permissions": [...]
  }
}
```

### GET /api/auth/verify
Vérifier validité du token JWT

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer <TOKEN>"
```

### POST /api/auth/logout
Déconnexion (optionnel - le JWT s'expire tout seul)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <TOKEN>"
```

### POST /api/auth/password/reset
Demander réinitialisation mot de passe

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{"email": "patient@sante.ga"}'
```

## Système de Permissions

### Permission Checks

```javascript
import PermissionService from './neurons/auth/PermissionService.js';
import { Permissions } from './neurons/auth/RoleDefinitions.js';

// Vérifier une permission
const hasPermission = PermissionService.hasPermission(
  userRole,
  Permissions.READ_PATIENT_DMP
);

// Vérifier toutes les permissions
const hasAll = PermissionService.hasAllPermissions(
  userRole,
  [Permissions.READ_PATIENT_DMP, Permissions.WRITE_PATIENT_DMP]
);

// Vérifier au moins une permission
const hasAny = PermissionService.hasAnyPermission(
  userRole,
  [Permissions.READ_PATIENT_DMP, Permissions.WRITE_PATIENT_DMP]
);
```

### Middleware d'Autorisation

```javascript
import { authenticate, authorize, requirePermission } from './neurons/auth/AuthMiddleware.js';
import { UserRoles, Permissions } from './neurons/auth/RoleDefinitions.js';

// Authentification requise
router.get('/protected', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Rôle spécifique requis
router.get('/doctors-only', authorize(UserRoles.DOCTOR_GENERAL, UserRoles.DOCTOR_SPECIALIST), (req, res) => {
  res.json({ message: 'Doctors only' });
});

// Permission requise
router.get('/read-dmp', requirePermission(Permissions.READ_PATIENT_DMP), (req, res) => {
  res.json({ message: 'DMP access granted' });
});
```

## Tests

Tous les tests passent :

```bash
npm run neural:test
# Test Suites: 3 passed, 3 total
# Tests:       20 passed, 20 total
```

### Tests disponibles

1. **AuthService Tests**
   - Register patient/doctor
   - Login with email
   - Password verification
   - Token generation & verification

2. **PermissionService Tests**
   - Permission checking
   - Role permissions retrieval
   - hasAllPermissions / hasAnyPermission

## JWT Token Format

```javascript
{
  "userId": "user_1761552512947_uqo84xseh",
  "email": "patient@sante.ga",
  "role": "patient",
  "permissions": ["read_own_dmp", "create_appointment", "read_prescription"],
  "iat": 1761552513,           // Issued at
  "exp": 1761638913            // Expires in 24h
}
```

## Variables d'environnement

```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Supabase (optionnel pour développement)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Cas d'usage

### 1. Patient consulte son DMP
```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register -d {...}

# 2. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login -d {...} | jq -r '.token')

# 3. Access DMP (route protégée)
curl -X GET http://localhost:3000/api/patients/me/dmp \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Doctor modifie DMP patient
```bash
# Le doctor obtient un token avec permission WRITE_PATIENT_DMP
# Il peut alors appeler les endpoints protégés
curl -X POST http://localhost:3000/api/patients/:id/dmp \
  -H "Authorization: Bearer $DOCTOR_TOKEN" \
  -d '{...}'
```

### 3. Super Admin gère tout
```bash
# Le super admin a accès à TOUS les endpoints
# Aucune restriction de permission
```

## Sécurité

✅ Mots de passe hashés avec bcrypt (10 salt rounds)  
✅ JWT avec expiration (24h par défaut)  
✅ Secret JWT complexe requis en production  
✅ Middleware d'authentification obligatoire  
✅ Vérification permissions granulaires  
✅ Logging de tous les accès

## Intégration avec Event Bus

L'AuthNeuron émet des événements :

```javascript
// USER_REGISTERED
await this.emit(EventTypes.USER_REGISTERED, {
  user: { ... },
  role: "patient"
});

// USER_LOGIN
await this.emit(EventTypes.USER_LOGIN, {
  user: { ... },
  role: "patient"
});

// EMAIL_SENT (capturer par NotificationNeuron)
await this.emit(EventTypes.EMAIL_SENT, {
  to: "patient@sante.ga",
  template: "welcome"
});
```

## Prochaines étapes

1. **PatientNeuron** : Gestion profils patients + DMP
2. **ProfessionalNeuron** : Gestion médecins + calendrier
3. **AppointmentNeuron** : RDV + notifications
4. **NotificationNeuron** : Email/SMS/Push
5. **Déploiement Docker** : Production ready
