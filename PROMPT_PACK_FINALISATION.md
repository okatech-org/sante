# 📦 PROMPT PACK — Finalisation Dashboard Ministre

**Date** : 2 novembre 2025  
**Objectif** : 5 prompts séquentiels pour finaliser `/gouv/dashboard`  
**Durée estimée** : 8-12h (tous prompts)

---

## 🎯 VUE D'ENSEMBLE

| # | Prompt | Durée | Priorité | Status |
|---|--------|-------|----------|--------|
| 1 | Routing prod `/gouv/*` | 1h | P0 🔥 | ⏳ En cours |
| 2 | Services API + React Query | 1.5h | P0 🔥 | ⏸️ Attente |
| 3 | Brancher composants | 1.5h | P0 🔥 | ⏸️ Attente |
| 4 | Backend REST + Prisma | 3-4h | P1 ⚡ | ⏸️ Attente |
| 5 | Auth JWT + Guards | 2h | P1 ⚡ | ⏸️ Attente |

---

## 📋 PROMPT 1 — Routing prod : servir React sur :8080/gouv/*

### 🎯 Objectif
Builder le frontend avec `base: '/gouv/'` et le servir depuis Express (backend) pour atteindre `http://localhost:8080/gouv/dashboard`.

### 📦 Contexte
- **Stack** : Vite/React/TS/Tailwind
- **Backend** : Express sur port 8080
- **Proxy dev** : `/api` déjà configuré
- **Neural server** : `src/neural/server.js`

### ✅ À produire

#### 1.1 — `vite.config.ts` : ajouter base

```typescript
// vite.config.ts
export default defineConfig({
  base: '/gouv/',
  // ... reste de la config
});
```

#### 1.2 — `src/main.tsx` : configurer BrowserRouter

```typescript
// src/main.tsx
<BrowserRouter basename="/gouv">
  <App />
</BrowserRouter>
```

#### 1.3 — `src/neural/server.js` : servir React build

```javascript
// src/neural/server.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers statiques React
app.use('/gouv', express.static(path.resolve(__dirname, '../../dist')));

// Fallback pour React Router (SPA)
app.get(['/gouv', '/gouv/*'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});

// Conserver les routes API existantes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
```

### ✅ Critères d'acceptance

- [ ] `npm run build` génère `dist/` avec `base: '/gouv/'`
- [ ] `GET http://localhost:8080/gouv/dashboard` affiche la Vue Globale
- [ ] Pas de 404, pas d'erreur console
- [ ] Les appels `/api/dashboard/*` continuent de fonctionner
- [ ] Refresh sur `/gouv/dashboard` ne cause pas de 404

### 🧪 Tests

```bash
# Build
npm run build

# Démarrer le serveur
npm run start

# Vérifier
curl http://localhost:8080/gouv/dashboard  # → HTML React
curl http://localhost:8080/health          # → {"status":"ok"}
```

---

## 📋 PROMPT 2 — Front: créer services/api.ts + hooks React Query

### 🎯 Objectif
Centraliser les appels API `/api/dashboard/*` avec **React Query v5** + **Axios**.

### 📦 Contexte
- React Query déjà installé : `@tanstack/react-query: ^5.90.5`
- Axios installé : `axios: ^1.13.1`

### ✅ À produire

#### 2.1 — `src/services/api.ts` : instance Axios centralisée

```typescript
// src/services/api.ts
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur d'erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/gouv/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface KPI {
  id: string;
  nom: string;
  valeur: number;
  delta: number;
  unite: string;
  periode: string;
  date: string;
}

export interface Alert {
  id: string;
  titre: string;
  description: string;
  severity: 'critique' | 'haute' | 'moyenne';
  province: string;
  statut: string;
  action?: string;
  createdAt: string;
}

export interface Decree {
  id: string;
  titre: string;
  numero: string;
  date: string;
  statut: 'draft' | 'signed' | 'published';
  categorie: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface Objectif {
  id: string;
  nom: string;
  description?: string;
  cible: number;
  progres: number;
  unite: string;
  deadline: string;
  provinceId?: string;
}

export interface Province {
  id: string;
  nom: string;
  code: string;
  population: number;
  structures: number;
  couverture: number;
  medecins: number;
  infirmiers: number;
  lits: number;
  budget: number;
  centroid: { lat: number; lng: number };
  needs: string[];
}

// Fonctions API Dashboard
export const dashboardApi = {
  // KPIs
  getKPIs: async (periode?: string): Promise<KPI[]> => {
    const { data } = await api.get('/dashboard/kpis', { params: { periode } });
    return data.data;
  },

  // Alerts
  getAlerts: async (): Promise<Alert[]> => {
    const { data } = await api.get('/dashboard/alerts');
    return data.data;
  },

  // Decrees
  getDecrees: async (params?: { status?: string }): Promise<Decree[]> => {
    const { data } = await api.get('/dashboard/decrets', { params });
    return data.data;
  },

  createDecree: async (decree: Partial<Decree>): Promise<Decree> => {
    const { data } = await api.post('/dashboard/decrets', decree);
    return data.data;
  },

  // Objectifs
  getObjectifs: async (params?: { category?: string }): Promise<Objectif[]> => {
    const { data } = await api.get('/dashboard/objectifs', { params });
    return data.data;
  },

  // Provinces
  getProvinces: async (): Promise<Province[]> => {
    const { data } = await api.get('/dashboard/provinces');
    return data.data;
  },
};

export default api;
```

#### 2.2 — Hooks React Query

**`src/hooks/useKPIs.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const useKPIs = (periode?: string) => {
  return useQuery({
    queryKey: ['kpis', periode],
    queryFn: () => dashboardApi.getKPIs(periode),
    staleTime: 60000, // 1 minute
  });
};
```

**`src/hooks/useAlerts.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => dashboardApi.getAlerts(),
    staleTime: 30000, // 30 secondes
  });
};
```

**`src/hooks/useDecrees.ts`**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi, Decree } from '@/services/api';

export const useDecrees = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ['decrees', params],
    queryFn: () => dashboardApi.getDecrees(params),
    staleTime: 120000, // 2 minutes
  });
};

export const useCreateDecree = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (decree: Partial<Decree>) => dashboardApi.createDecree(decree),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decrees'] });
    },
  });
};
```

**`src/hooks/useObjectifs.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const useObjectifs = (params?: { category?: string }) => {
  return useQuery({
    queryKey: ['objectifs', params],
    queryFn: () => dashboardApi.getObjectifs(params),
    staleTime: 300000, // 5 minutes
  });
};
```

**`src/hooks/useProvinces.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => dashboardApi.getProvinces(),
    staleTime: 600000, // 10 minutes
  });
};
```

### ✅ Critères d'acceptance

- [ ] `src/services/api.ts` créé avec instance Axios + intercepteurs
- [ ] 5 hooks React Query créés et exportés
- [ ] Types TypeScript définis pour toutes les entités
- [ ] Aucune erreur de compilation TypeScript

---

## 📋 PROMPT 3 — Brancher les composants existants sur l'API

### 🎯 Objectif
Remplacer les `fetch` mockés dans les composants par les hooks du Prompt 2.

### 📦 Cibles
- `src/pages/ministry/MinisterDashboard.tsx` (sections Vue globale, Décrets, Objectifs, Statistiques, Structures)

### ✅ À produire

#### 3.1 — Vue Globale : utiliser `useKPIs` + `useAlerts`

```typescript
// src/pages/ministry/MinisterDashboard.tsx
import { useKPIs } from '@/hooks/useKPIs';
import { useAlerts } from '@/hooks/useAlerts';

// Dans le composant
const { data: kpis, isLoading: kpisLoading, error: kpisError } = useKPIs(usagePeriod);
const { data: alerts, isLoading: alertsLoading } = useAlerts();

// Remplacer les mock data
const overviewStats = useMemo(() => {
  if (!kpis || kpis.length === 0) return [];
  
  return kpis.slice(0, 4).map(kpi => ({
    id: kpi.id,
    label: kpi.nom,
    value: kpi.valeur.toLocaleString(),
    delta: `${kpi.delta >= 0 ? '+' : ''}${kpi.delta.toFixed(1)}%`,
    caption: kpi.unite,
    trend: kpi.delta >= 0 ? 'up' : 'down',
    // ... mapping des icônes
  }));
}, [kpis]);

const alertsPrioritaires = alerts || [];
```

#### 3.2 — Section Décrets : utiliser `useDecrees`

```typescript
import { useDecrees, useCreateDecree } from '@/hooks/useDecrees';

const { data: decrets, isLoading: decretsLoading, refetch: refetchDecrets } = useDecrees();
const createDecreeMutation = useCreateDecree();

const handleCreateDecret = async (newDecret: Partial<Decree>) => {
  try {
    await createDecreeMutation.mutateAsync(newDecret);
    toast.success('Décret créé avec succès');
  } catch (error) {
    toast.error('Erreur lors de la création du décret');
  }
};
```

#### 3.3 — Section Objectifs : utiliser `useObjectifs`

```typescript
import { useObjectifs } from '@/hooks/useObjectifs';

const { data: objectifs, isLoading: objectifsLoading } = useObjectifs();

const nationalObjectives = useMemo(() => {
  if (!objectifs) return [];
  return objectifs.map(obj => ({
    id: obj.id,
    label: obj.nom,
    detail: obj.description || '',
    progress: `${obj.progres}%`,
  }));
}, [objectifs]);
```

#### 3.4 — Section Statistiques : utiliser `useKPIs`

```typescript
const { data: statsKPIs } = useKPIs('mois');

// Mapper les KPIs aux cartes statistiques
const statistiquesCards = useMemo(() => {
  if (!statsKPIs) return [];
  return statsKPIs.map(kpi => ({
    title: kpi.nom,
    value: kpi.valeur,
    delta: kpi.delta,
    unite: kpi.unite,
  }));
}, [statsKPIs]);
```

#### 3.5 — Section Structures : utiliser `useProvinces`

```typescript
import { useProvinces } from '@/hooks/useProvinces';

const { 
  data: provincesDataAPI, 
  isLoading: provincesLoading, 
  error: provincesError,
  refetch: refetchProvinces 
} = useProvinces();

// Remplacer provincesHealthData par provincesDataAPI
const provincesData = provincesDataAPI || [];
```

### ✅ Critères d'acceptance

- [ ] Plus de mock data dans les 5 sections
- [ ] Tous les composants utilisent les hooks React Query
- [ ] Loading states affichés pendant les requêtes
- [ ] Erreurs gérées avec des messages appropriés
- [ ] Page Vue Globale reflète les données de la base

---

## 📋 PROMPT 4 — Backend: routes REST complètes + Prisma

### 🎯 Objectif
Implémenter toutes les routes `/api/dashboard/*` avec Prisma.

### 📦 Contexte
- Prisma installé : `@prisma/client: ^5.20.0`
- Base PostgreSQL via Supabase
- EventBus déjà configuré

### ✅ À produire

#### 4.1 — Schéma Prisma complet

```prisma
// prisma/schema.prisma

model KPI {
  id        String   @id @default(cuid())
  nom       String
  valeur    Float
  delta     Float
  unite     String
  periode   String   // "semaine", "mois", "annee"
  date      DateTime
  createdAt DateTime @default(now())
}

model Alert {
  id          String    @id @default(cuid())
  titre       String
  description String
  severity    String    // "critique", "haute", "moyenne"
  province    String
  statut      String    @default("active")
  action      String?
  createdAt   DateTime  @default(now())
  resolvedAt  DateTime?
}

model Decree {
  id        String   @id @default(cuid())
  titre     String
  numero    String   @unique
  date      DateTime
  statut    String   // "draft", "signed", "published"
  categorie String
  pdfUrl    String?
  createdBy String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Objectif {
  id          String   @id @default(cuid())
  nom         String
  description String?
  cible       Float
  progres     Float
  unite       String
  deadline    DateTime
  provinceId  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Province {
  id         String   @id @default(cuid())
  nom        String   @unique
  code       String   @unique
  population Int
  structures Int
  couverture Float
  medecins   Int
  infirmiers Int
  lits       Int
  budget     Float
  centroid   Json     // { lat, lng }
  bounds     Json     // [[south, west], [north, east]]
  needs      Json     // ["Médecins", "Infrastructures", ...]
  updatedAt  DateTime @updatedAt
}
```

#### 4.2 — Routes Dashboard

```javascript
// src/neural/routes/dashboard.routes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import eventBus from '../core/EventBus.js';
import Logger from '../core/Logger.js';

const router = express.Router();
const prisma = new PrismaClient();
const logger = new Logger('DashboardRoutes');

// GET /api/dashboard/kpis
router.get('/kpis', async (req, res) => {
  try {
    const { periode = 'mois' } = req.query;
    const kpis = await prisma.kPI.findMany({
      where: { periode },
      orderBy: { date: 'desc' },
      take: 10,
    });
    res.json({ success: true, data: kpis });
  } catch (error) {
    logger.error('Error fetching KPIs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/dashboard/alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { statut: 'active' },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: alerts });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/dashboard/decrets
router.get('/decrets', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { statut: status } : {};
    const decrets = await prisma.decree.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 20,
    });
    res.json({ success: true, data: decrets });
  } catch (error) {
    logger.error('Error fetching decrets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/dashboard/decrets
router.post('/decrets', async (req, res) => {
  try {
    const decret = await prisma.decree.create({
      data: {
        ...req.body,
        createdBy: req.user?.id || 'system',
      },
    });
    
    // Publier event
    eventBus.publish('DECRET_CREATED', {
      decretId: decret.id,
      titre: decret.titre,
      createdBy: decret.createdBy,
      timestamp: new Date(),
    });
    
    res.status(201).json({ success: true, data: decret });
  } catch (error) {
    logger.error('Error creating decret:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/dashboard/objectifs
router.get('/objectifs', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { nom: { contains: category } } : {};
    const objectifs = await prisma.objectif.findMany({
      where,
      orderBy: { deadline: 'asc' },
    });
    res.json({ success: true, data: objectifs });
  } catch (error) {
    logger.error('Error fetching objectifs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/dashboard/provinces
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await prisma.province.findMany();
    res.json({ success: true, data: provinces });
  } catch (error) {
    logger.error('Error fetching provinces:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

#### 4.3 — Intégrer dans server.js

```javascript
// src/neural/server.js
import dashboardRoutes from './routes/dashboard.routes.js';

// Ajouter après les autres routes
app.use('/api/dashboard', dashboardRoutes);
```

#### 4.4 — Seed data

```javascript
// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // KPIs
  await prisma.kPI.createMany({
    data: [
      { nom: 'Consultations', valeur: 15234, delta: 5.2, unite: 'actes', periode: 'mois', date: new Date() },
      { nom: 'Taux couverture', valeur: 78.5, delta: 2.1, unite: '%', periode: 'mois', date: new Date() },
      { nom: 'Budget engagé', valeur: 198.2, delta: 3.8, unite: 'Mds FCFA', periode: 'mois', date: new Date() },
    ],
  });

  // Alerts
  await prisma.alert.createMany({
    data: [
      {
        titre: 'Pénurie de médecins',
        description: 'Ratio médecins/habitants critique',
        severity: 'critique',
        province: 'Estuaire',
        action: 'Recrutement urgent',
      },
      {
        titre: 'Infrastructures dégradées',
        description: '3 centres de santé nécessitent rénovation',
        severity: 'haute',
        province: 'Haut-Ogooué',
      },
    ],
  });

  // Decrees
  await prisma.decree.createMany({
    data: [
      {
        titre: 'Décret portant création du Conseil National de la Santé',
        numero: 'N°001/PR/2025',
        date: new Date('2025-01-15'),
        statut: 'published',
        categorie: 'Santé publique',
        createdBy: 'ministre@sante.ga',
      },
      {
        titre: 'Décret relatif au budget santé 2025',
        numero: 'N°002/PR/2025',
        date: new Date('2025-02-01'),
        statut: 'signed',
        categorie: 'Budget',
        createdBy: 'ministre@sante.ga',
      },
    ],
  });

  // Objectifs
  await prisma.objectif.createMany({
    data: [
      {
        nom: 'Couverture Santé Universelle',
        description: 'Atteindre 95% de couverture nationale',
        cible: 95,
        progres: 78.5,
        unite: '%',
        deadline: new Date('2028-12-31'),
      },
      {
        nom: 'Vaccination infantile',
        description: 'Couvrir 100% des enfants <5 ans',
        cible: 100,
        progres: 87.3,
        unite: '%',
        deadline: new Date('2026-12-31'),
      },
    ],
  });

  // Provinces
  await prisma.province.createMany({
    data: [
      {
        nom: 'Estuaire',
        code: 'ES',
        population: 812000,
        structures: 124,
        couverture: 89.5,
        medecins: 456,
        infirmiers: 1234,
        lits: 2890,
        budget: 45.2,
        centroid: JSON.stringify({ lat: 0.4162, lng: 9.4673 }),
        bounds: JSON.stringify([[0.1, 9.2], [0.7, 9.7]]),
        needs: JSON.stringify(['Spécialistes', 'Équipements']),
      },
      // ... autres provinces
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### ✅ Critères d'acceptance

- [ ] Schéma Prisma créé et migré
- [ ] Seed data exécuté avec succès
- [ ] Tous les endpoints `/api/dashboard/*` fonctionnels
- [ ] Events EventBus publiés lors des mutations
- [ ] Erreurs normalisées (400/422/500)
- [ ] Tests manuels passent (Postman/curl)

---

## 📋 PROMPT 5 — Auth minimal (JWT) + guard des routes

### 🎯 Objectif
Protéger `/api/dashboard/*` via JWT avec l'utilisateur seed `ministre@sante.ga`.

### 📦 Contexte
- JWT & bcrypt déjà dans `package.json`
- Seed crée l'utilisateur ministre

### ✅ À produire

#### 5.1 — Middleware d'authentification

```javascript
// src/neural/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import Logger from '../core/Logger.js';

const logger = new Logger('AuthMiddleware');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Token manquant ou invalide',
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error.message);
    return res.status(403).json({
      success: false,
      error: 'Token expiré ou invalide',
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé pour ce rôle',
      });
    }

    next();
  };
};
```

#### 5.2 — Routes d'authentification

```javascript
// src/neural/routes/auth.routes.js (modifier pour ajouter login)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect',
      });
    }

    // Générer le token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la connexion',
    });
  }
});
```

#### 5.3 — Protéger les routes Dashboard

```javascript
// src/neural/server.js
import { authenticateJWT, requireRole } from './middleware/auth.middleware.js';

// Routes publiques
app.use('/api/auth', authRoutes);
app.get('/health', ...);

// Routes protégées
app.use('/api/dashboard', authenticateJWT, requireRole(['MINISTRE', 'ADMIN']), dashboardRoutes);
app.use('/api/patients', authenticateJWT, patientRoutes);
app.use('/api/professionals', authenticateJWT, professionalRoutes);
app.use('/api/appointments', authenticateJWT, appointmentRoutes);
app.use('/api/notifications', authenticateJWT, notificationRoutes);
```

#### 5.4 — Frontend : Hook useAuth + Zustand

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

```typescript
// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, logout, token, user } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axios.post('/api/auth/login', credentials);
      return data.data;
    },
    onSuccess: ({ token, user }) => {
      setAuth(token, user);
      navigate('/gouv/dashboard');
    },
  });

  const logoutUser = () => {
    logout();
    navigate('/gouv/login');
  };

  return {
    login: loginMutation.mutate,
    logout: logoutUser,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    token,
    user,
    isAuthenticated: !!token,
  };
};
```

#### 5.5 — Intercepteur Axios mis à jour

```typescript
// src/services/api.ts (mise à jour)
import { useAuthStore } from '@/stores/authStore';

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/gouv/login';
    }
    return Promise.reject(error);
  }
);
```

#### 5.6 — Page de Login

```typescript
// src/pages/ministry/Login.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';

export default function Login() {
  const [email, setEmail] = useState('ministre@sante.ga');
  const [password, setPassword] = useState('admin123');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">SANTE.GA</h1>
          <p className="text-sm text-slate-500">Ministère de la Santé</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ministre@sante.ga"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              Email ou mot de passe incorrect
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
```

#### 5.7 — Seed utilisateur ministre

```javascript
// prisma/seed.js (ajouter)
import bcrypt from 'bcrypt';

async function main() {
  // ... (seed précédent)

  // Utilisateur ministre
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'ministre@sante.ga' },
    update: {},
    create: {
      email: 'ministre@sante.ga',
      password: hashedPassword,
      firstName: 'Adrien',
      lastName: 'MOUGOUGOU',
      role: 'MINISTRE',
    },
  });
}
```

### ✅ Critères d'acceptance

- [ ] Middleware `authenticateJWT` créé et testé
- [ ] Route `POST /api/auth/login` fonctionnelle
- [ ] Toutes les routes `/api/dashboard/*` protégées
- [ ] Appels non authentifiés reçoivent 401/403
- [ ] Login avec `ministre@sante.ga` / `admin123` fonctionne
- [ ] Token stocké et envoyé automatiquement
- [ ] Refresh de page ne déconnecte pas l'utilisateur

---

## 🎯 SÉQUENCE D'EXÉCUTION

```bash
# PROMPT 1 : Routing
npm run build
npm run start
# Vérifier http://localhost:8080/gouv/dashboard

# PROMPT 2 : Services API
# Créer les fichiers api.ts + hooks
# Pas de tests à ce stade

# PROMPT 3 : Brancher composants
# Modifier MinisterDashboard.tsx
npm run build
# Vérifier que les composants chargent (même si API vide)

# PROMPT 4 : Backend
npx prisma migrate dev --name add_dashboard_models
npx prisma generate
node prisma/seed.js
npm run start
# Tester les endpoints avec curl/Postman

# PROMPT 5 : Auth
npx prisma migrate dev --name add_user_model
node prisma/seed.js
npm run start
# Tester login + appels protégés
```

---

## ✅ CHECKLIST FINALE

### Fonctionnel
- [ ] URL `http://localhost:8080/gouv/dashboard` accessible
- [ ] Login ministre fonctionne
- [ ] 5 sections affichent des données réelles
- [ ] Loading states visibles
- [ ] Erreurs gérées avec toasts
- [ ] Refresh page ne cause pas de 404

### Technique
- [ ] 0 erreur console
- [ ] 0 warning React
- [ ] Build réussi sans erreurs
- [ ] Toutes les routes API répondent
- [ ] JWT valide et expire correctement
- [ ] Events EventBus loggés

### Performance
- [ ] Temps de réponse API < 200ms
- [ ] Bundle size raisonnable
- [ ] Pas de memory leaks
- [ ] React Query cache efficace

---

**🚀 PRÊT À DÉMARRER PROMPT 1**

