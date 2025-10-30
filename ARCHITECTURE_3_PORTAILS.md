# Architecture avec 3 Portails de Connexion Distincts

## 🎯 Vue d'Ensemble

Système avec **3 points d'entrée distincts** pour une séparation claire des espaces tout en gérant la complexité des rôles multiples.

## 🔐 Les 3 Portails de Connexion

### 1️⃣ **Portal Patient** (`/login/patient`)
- **Pour :** Patients uniquement
- **Accès :** Dossier médical, rendez-vous, ordonnances
- **Redirection après login :** `/dashboard/patient`

### 2️⃣ **Portal Professionnel** (`/login/professional`)
- **Pour :** TOUS les professionnels (médicaux + administratifs)
- **Inclut :**
  - Médecins (généralistes, spécialistes)
  - Personnel médical (infirmiers, sages-femmes)
  - Personnel administratif d'établissement
  - Directeurs d'établissement
  - Pharmaciens, laborantins
- **Gestion :** Multi-établissements avec rôles différents
- **Redirection après login :** 
  - Si 1 établissement → `/dashboard/professional`
  - Si plusieurs → `/select-establishment` puis `/dashboard/professional`

### 3️⃣ **Portal Administration SANTE.GA** (`/login/admin`)
- **Pour :** Super Admin et Admin de la plateforme SANTE.GA
- **Accès :** Gestion globale de la plateforme
- **Redirection après login :** `/admin`

## 📊 Modèle de Données Simplifié

```sql
-- Table des utilisateurs avec type de compte
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('patient', 'professional', 'platform_admin')),
  -- autres champs...
);

-- Affiliations des professionnels aux établissements
CREATE TABLE professional_establishments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  establishment_id UUID REFERENCES establishments(id),
  role TEXT NOT NULL, -- 'medecin', 'directeur', 'admin', 'infirmier', etc.
  is_admin BOOLEAN DEFAULT false, -- Admin de cet établissement
  department TEXT,
  specialization TEXT[],
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, establishment_id, role)
);
```

## 🔄 Flux de Connexion

### Pour les Patients

```mermaid
graph LR
    A[Patient] --> B[/login/patient]
    B --> C[Authentification]
    C --> D[Dashboard Patient]
```

### Pour les Professionnels

```mermaid
graph LR
    A[Professionnel] --> B[/login/professional]
    B --> C[Authentification]
    C --> D{Nombre d'établissements?}
    D -->|1| E[Dashboard avec établissement unique]
    D -->|Plusieurs| F[Page sélection établissement]
    F --> G[Dashboard avec établissement sélectionné]
```

### Pour les Admins Plateforme

```mermaid
graph LR
    A[Admin] --> B[/login/admin]
    B --> C[Authentification]
    C --> D[Dashboard Admin Plateforme]
```

## 💡 Gestion des Cas Complexes

### Cas 1: Médecin Multi-Établissements
**Dr. Dupont** est :
- Médecin traitant au CHU de Libreville
- Directeur médical à la Clinique du Cap
- Consultant au Centre Médical SOGARA

**Solution :**
1. Connexion via `/login/professional`
2. Page de sélection avec ses 3 établissements
3. Switch rapide entre établissements via dropdown dans le header
4. Permissions et accès différents selon l'établissement actif

### Cas 2: Directeur-Médecin
**Dr. Martin** est :
- Directeur du Centre Médical Owendo
- Médecin consultant dans le même centre

**Solution :**
- Un seul compte professionnel
- Deux rôles dans le même établissement
- Interface qui s'adapte selon le contexte (admin vs médical)
- Bouton de bascule entre les vues

### Cas 3: Personnel Administratif
**Mme. Nguema** est :
- Secrétaire médicale au CHU
- Pas de rôle médical

**Solution :**
- Connexion via `/login/professional` (même portail que les médecins)
- Accès limité aux fonctions administratives
- Pas d'accès aux dossiers médicaux détaillés

## 🎨 Pages de Connexion

### 1. Page Login Patient (`/login/patient`)

```typescript
// src/pages/LoginPatient.tsx
export default function LoginPatient() {
  // Interface simplifiée orientée patient
  // Thème avec couleurs douces (bleu ciel, vert santé)
  // Messages orientés "votre santé"
  // Lien vers inscription patient
}
```

### 2. Page Login Professionnel (`/login/professional`)

```typescript
// src/pages/LoginProfessional.tsx
export default function LoginProfessional() {
  // Interface professionnelle
  // Thème médical (bleu médical, blanc)
  // Option de connexion avec établissement pré-sélectionné
  // Lien vers demande d'accès établissement
}
```

### 3. Page Login Admin (`/login/admin`)

```typescript
// src/pages/LoginAdmin.tsx
export default function LoginAdmin() {
  // Interface sécurisée
  // Double authentification recommandée
  // Thème administratif (gris, rouge pour sécurité)
  // Pas de lien d'inscription publique
}
```

## 🔧 Composant de Sélection d'Établissement

```typescript
// src/pages/SelectEstablishment.tsx
interface EstablishmentCard {
  id: string;
  name: string;
  type: string; // CHU, Clinique, Cabinet, etc.
  logo?: string;
  role: string; // Rôle de l'utilisateur dans cet établissement
  isAdmin: boolean;
  lastAccess?: Date;
  patientCount?: number;
  nextAppointments?: number;
}

export function SelectEstablishment() {
  return (
    <div className="container mx-auto p-6">
      <h1>Sélectionnez votre établissement</h1>
      
      {/* Grille des établissements */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {establishments.map(est => (
          <Card 
            key={est.id}
            className="cursor-pointer hover:shadow-lg"
            onClick={() => selectEstablishment(est.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Building2 className="w-8 h-8" />
                {est.isAdmin && <Badge>Admin</Badge>}
              </div>
              <CardTitle>{est.name}</CardTitle>
              <CardDescription>{est.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Votre rôle:</span>
                  <Badge variant="outline">{est.role}</Badge>
                </div>
                {est.lastAccess && (
                  <div className="text-xs text-muted-foreground">
                    Dernier accès: {formatDate(est.lastAccess)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Bouton pour demander accès à un nouvel établissement */}
      <div className="mt-8 text-center">
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Demander l'accès à un établissement
        </Button>
      </div>
    </div>
  );
}
```

## 🔄 Switch d'Établissement dans le Header

```typescript
// src/components/EstablishmentSwitcher.tsx
export function EstablishmentSwitcher() {
  const { currentEstablishment, establishments, switchEstablishment } = useProfessionalAuth();
  
  if (establishments.length <= 1) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{currentEstablishment.name}</span>
          </div>
          <ChevronsUpDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]">
        {establishments.map(est => (
          <DropdownMenuItem
            key={est.id}
            onClick={() => switchEstablishment(est.id)}
            className="flex flex-col items-start"
          >
            <div className="font-medium">{est.name}</div>
            <div className="text-xs text-muted-foreground">
              {est.role} {est.isAdmin && "• Admin"}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un établissement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## 📱 Landing Page avec 3 Entrées

```typescript
// src/pages/Landing.tsx
export function Landing() {
  return (
    <div className="hero-section">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Carte Patient */}
        <Card className="hover:shadow-xl">
          <CardHeader>
            <Heart className="w-12 h-12 text-blue-500" />
            <CardTitle>Espace Patient</CardTitle>
            <CardDescription>
              Gérez votre santé en ligne
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Prendre rendez-vous</li>
              <li>✓ Consulter vos ordonnances</li>
              <li>✓ Accéder à votre dossier médical</li>
            </ul>
            <Button className="w-full mt-4" onClick={() => navigate('/login/patient')}>
              Connexion Patient
            </Button>
          </CardContent>
        </Card>
        
        {/* Carte Professionnel */}
        <Card className="hover:shadow-xl">
          <CardHeader>
            <Stethoscope className="w-12 h-12 text-green-500" />
            <CardTitle>Espace Professionnel</CardTitle>
            <CardDescription>
              Pour tous les professionnels de santé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Gérer vos consultations</li>
              <li>✓ Accéder aux dossiers patients</li>
              <li>✓ Multi-établissements</li>
            </ul>
            <Button className="w-full mt-4" onClick={() => navigate('/login/professional')}>
              Connexion Professionnel
            </Button>
          </CardContent>
        </Card>
        
        {/* Carte Admin */}
        <Card className="hover:shadow-xl">
          <CardHeader>
            <Shield className="w-12 h-12 text-purple-500" />
            <CardTitle>Administration</CardTitle>
            <CardDescription>
              Gestion de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Gérer les établissements</li>
              <li>✓ Superviser les utilisateurs</li>
              <li>✓ Statistiques globales</li>
            </ul>
            <Button className="w-full mt-4" onClick={() => navigate('/login/admin')}>
              Connexion Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## 🔒 Sécurité et Permissions

### Matrice des Accès

| Type de Compte | Accès Patient | Accès Professionnel | Accès Admin | Multi-Établissement |
|---------------|---------------|-------------------|-------------|-------------------|
| Patient | ✅ Son dossier | ❌ | ❌ | ❌ |
| Professionnel | ✅ Patients autorisés | ✅ | ❌ | ✅ |
| Admin Plateforme | ✅ Lecture seule | ✅ Supervision | ✅ | N/A |

### Guards de Routes

```typescript
// src/guards/RouteGuards.tsx
export const PatientGuard = ({ children }) => {
  const { user } = useAuth();
  if (user?.account_type !== 'patient') {
    return <Navigate to="/login/patient" />;
  }
  return children;
};

export const ProfessionalGuard = ({ children }) => {
  const { user, currentEstablishment } = useAuth();
  if (user?.account_type !== 'professional') {
    return <Navigate to="/login/professional" />;
  }
  if (!currentEstablishment) {
    return <Navigate to="/select-establishment" />;
  }
  return children;
};

export const AdminGuard = ({ children }) => {
  const { user } = useAuth();
  if (user?.account_type !== 'platform_admin') {
    return <Navigate to="/login/admin" />;
  }
  return children;
};
```

## 🚀 Avantages de cette Architecture

### 1. **Clarté pour les Utilisateurs**
- Chaque type d'utilisateur sait exactement où se connecter
- Pas de confusion entre les espaces
- URLs mémorables et logiques

### 2. **Flexibilité Professionnelle**
- Un seul compte pour plusieurs établissements
- Switch rapide entre contextes
- Rôles différents selon l'établissement

### 3. **Sécurité Renforcée**
- Séparation claire des espaces
- Permissions granulaires
- Isolation des données par établissement

### 4. **Évolutivité**
- Facile d'ajouter de nouveaux types d'établissements
- Possibilité d'ajouter des sous-rôles
- Architecture modulaire

## 📋 Routes Principales

```typescript
// Routes Patient
/login/patient
/signup/patient
/dashboard/patient
/patient/appointments
/patient/medical-records
/patient/prescriptions

// Routes Professionnel
/login/professional
/signup/professional
/select-establishment
/dashboard/professional
/professional/patients
/professional/consultations
/professional/establishment-settings

// Routes Admin
/login/admin
/admin
/admin/establishments
/admin/users
/admin/statistics

// Routes Établissement (publiques)
/establishments/sogara
/establishments/{id}
```

## 🎯 Cas d'Usage SOGARA

Pour SOGARA spécifiquement :
1. **Personnel CMST** → `/login/professional`
2. Après connexion → Sélection automatique CMST SOGARA si c'est leur seul établissement
3. Dashboard adapté avec logo et couleurs SOGARA
4. Switch possible vers d'autres établissements si le professionnel y travaille aussi

Cette architecture respecte votre demande de **3 types de connexion distincts** tout en gérant efficacement la complexité des rôles multiples et des affiliations multi-établissements.
