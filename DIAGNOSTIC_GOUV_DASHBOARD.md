# 🔍 DIAGNOSTIC COMPLET — `/gouv/dashboard`

**Date** : 2 novembre 2025  
**Contexte** : Finalisation du dashboard ministre pour déploiement production  
**URL Cible** : `http://localhost:8080/gouv/dashboard`

---

## 📋 ÉTAT DES LIEUX

### ✅ CE QUI FONCTIONNE

1. **UI/UX Complète**
   - ✅ 9 sections implémentées (Vue globale, Décrets, Objectifs, Statistiques, Structures, Conseil, Connaissance, iAsted, Rapports)
   - ✅ Design moderne avec glassmorphism, gradients pastel, dark/light themes
   - ✅ Sidebar rétractable avec avatar ministre
   - ✅ Responsive mobile/tablet/desktop
   - ✅ Espacements optimisés et alignement harmonieux
   - ✅ Cartographies nationales (Couverture, Ressources, Infrastructures)
   - ✅ Analyse provinciale compacte avec modales détaillées

2. **Architecture Technique**
   - ✅ React 18 + TypeScript
   - ✅ Tailwind CSS + Shadcn/ui
   - ✅ React Router configuré
   - ✅ Leaflet pour cartographie
   - ✅ EventBus Node.js prêt
   - ✅ Docker Compose (Postgres, Redis, RabbitMQ)
   - ✅ Prisma ORM configuré
   - ✅ Build Vite optimisé (7.57s)

---

## 🚨 ÉCARTS CRITIQUES À COMBLER

### 🔴 **CRITIQUE 1 : Routing & URL Finale**

**Problème** :
```
❌ Dev actuel    : React sur :3000, Backend sur :8080
✅ Prod attendu  : http://localhost:8080/gouv/dashboard (tout sur :8080)
```

**Impact** : **BLOQUANT** — L'URL finale ne correspond pas à l'exigence

**Solution** :
1. Configurer Vite `base: '/gouv'`
2. Configurer React Router avec `basename="/gouv"`
3. Servir le build React depuis Express sur `/gouv/*`
4. Rediriger `/gouv` → `/gouv/dashboard`

**Fichiers à modifier** :
- `vite.config.ts`
- `src/main.tsx` (BrowserRouter)
- `server/index.js` ou `server/app.js`
- `server/routes/index.js`

---

### 🔴 **CRITIQUE 2 : Endpoints Réels vs Données Simulées**

**Problème** :
```typescript
// Actuellement (données simulées)
const decretsData = [ /* mock data */ ];
const provincesHealthData = [ /* mock data */ ];
const alertsPrioritaires = [ /* mock data */ ];
```

**Impact** : **BLOQUANT** — Aucune donnée réelle, impossible de tester en prod

**Endpoints manquants** :
```
GET  /api/dashboard/kpis                    # Vue globale
GET  /api/dashboard/alerts                  # Alertes prioritaires
GET  /api/dashboard/decrets                 # Liste décrets
POST /api/dashboard/decrets                 # Créer décret
GET  /api/dashboard/objectifs               # Objectifs nationaux
GET  /api/dashboard/statistiques            # Statistiques santé
GET  /api/dashboard/provinces               # Données provinciales
GET  /api/dashboard/structures              # Structures nationales
GET  /api/dashboard/conseil/reunions        # Conseil de Ministres
GET  /api/dashboard/connaissance            # Base de connaissance
POST /api/dashboard/iasted/chat             # iAsted chat
POST /api/dashboard/iasted/generate-pdf     # iAsted génération PDF
```

**Solution** :
1. Implémenter controllers Prisma pour chaque endpoint
2. Brancher `services/api.ts` avec React Query
3. Remplacer les mock data par `useQuery()` / `useMutation()`

**Fichiers à créer/modifier** :
- `server/routes/dashboard.routes.js` (compléter les TODOs)
- `server/controllers/dashboard.controller.js`
- `src/services/api.ts` (brancher endpoints)
- `src/pages/ministry/MinisterDashboard.tsx` (remplacer mock data)

---

### 🟠 **MAJEUR 3 : Typo Bloquante dans Structures.tsx**

**Problème** :
```typescript
// ❌ Erreur dans src/pages/ministry/MinisterDashboard.tsx
const gabon Center = { lat: -0.4162, lng: 9.4673 };
//    ^^^^^
// SyntaxError: Unexpected identifier 'Center'
```

**Impact** : **BLOQUANT** — Empêche le build/run

**Solution** :
```typescript
// ✅ Correction
const gabonCenter = { lat: -0.4162, lng: 9.4673 };
```

---

### 🟠 **MAJEUR 4 : Classes Tailwind Dynamiques Purgées**

**Problème** :
```typescript
// Classes dynamiques non détectées par Tailwind
className={`bg-${stat.color}-500`}  // ❌ Purgé en prod
className={`text-${severity}-600`}  // ❌ Purgé en prod
```

**Impact** : Styles manquants en production

**Solution** :
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'bg-emerald-500', 'bg-sky-500', 'bg-amber-500', 'bg-red-500',
    'text-emerald-600', 'text-sky-600', 'text-amber-600', 'text-red-600',
    'border-emerald-400', 'border-sky-400', 'border-amber-400', 'border-red-400',
    // Ajouter toutes les variantes utilisées dynamiquement
  ],
}
```

**Alternative** : Utiliser un objet de mapping
```typescript
const colorMap = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};
className={colorMap[stat.color]}
```

---

### 🟡 **IMPORTANT 5 : Backend API Routes Esquissées**

**Problème** :
```javascript
// server/routes/dashboard.routes.js
router.get('/kpis', (req, res) => {
  // TODO: Implement KPIs retrieval
  res.json({ todo: 'not implemented' });
});
```

**Impact** : Endpoints présents mais non fonctionnels

**Solution** :
1. Créer schémas Prisma pour :
   - `Decret` (id, titre, date, statut, pdf_url, created_by)
   - `Objectif` (id, nom, cible, progres, deadline, province_id)
   - `Alerte` (id, titre, description, severity, province, date)
   - `Province` (id, nom, population, structures, couverture, medecins)
   - `KPI` (id, nom, valeur, delta, période)

2. Implémenter controllers :
```javascript
// server/controllers/dashboard.controller.js
const getKPIs = async (req, res) => {
  const kpis = await prisma.kPI.findMany({
    where: { periode: req.query.periode || 'mois' },
    orderBy: { date: 'desc' },
    take: 10,
  });
  res.json({ success: true, data: kpis });
};
```

3. Ajouter middlewares :
   - `authMiddleware` (vérifier JWT)
   - `roleMiddleware(['minister'])` (autorisation)
   - `validateRequest` (Joi/Zod)
   - `errorHandler`
   - `requestLogger`

**Fichiers à créer** :
- `prisma/schema.prisma` (ajouter modèles)
- `server/controllers/dashboard.controller.js`
- `server/middlewares/auth.middleware.js`
- `server/middlewares/validate.middleware.js`
- `server/middlewares/error.middleware.js`

---

### 🟡 **IMPORTANT 6 : iAsted — Intégration Anthropic**

**Problème** :
- SDK `@anthropic-ai/sdk` installé mais non configuré
- Pas de clé API `ANTHROPIC_API_KEY` dans `.env`
- Endpoint `/api/dashboard/iasted/*` non implémenté

**Solution** :
1. Ajouter dans `.env` :
```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

2. Créer service :
```javascript
// server/services/iasted.service.js
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const chatWithIAsted = async (messages, context) => {
  const systemPrompt = `Tu es iAsted, l'assistant IA multimodal du Ministre de la Santé du Gabon.
  
Contexte actuel :
- Structures nationales : ${context.structures} établissements
- Population couverte : ${context.couverture}%
- Budget disponible : ${context.budget} FCFA

Réponds en français, de manière précise et concise.`;

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return response.content[0].text;
};

module.exports = { chatWithIAsted };
```

3. Implémenter endpoint :
```javascript
// server/routes/dashboard.routes.js
router.post('/iasted/chat', authMiddleware, async (req, res) => {
  const { messages } = req.body;
  const context = await getDashboardContext(req.user.id);
  const response = await iastedService.chatWithIAsted(messages, context);
  res.json({ success: true, data: { response } });
});
```

---

### 🟢 **OPTIMISATION 7 : Event-Driven Architecture**

**Problème** :
- EventBus Node.js prêt mais non branché
- RabbitMQ dans Docker mais non utilisé en prod
- Aucun event publié actuellement

**Solution** :
1. Brancher EventBus dans les endpoints critiques :
```javascript
// server/controllers/dashboard.controller.js
const createDecret = async (req, res) => {
  const decret = await prisma.decret.create({ data: req.body });
  
  // Publier event
  eventBus.publish('DECRET_CREATED', {
    decretId: decret.id,
    titre: decret.titre,
    createdBy: req.user.id,
    timestamp: new Date(),
  });
  
  res.status(201).json({ success: true, data: decret });
};
```

2. Créer listeners pour notifications :
```javascript
// server/neurons/NotificationNeuron.js
eventBus.subscribe('DECRET_CREATED', async (event) => {
  await sendNotification({
    to: 'cabinet@sante.ga',
    subject: `Nouveau décret: ${event.titre}`,
    type: 'EMAIL',
  });
});
```

3. Events clés à implémenter :
   - `KPI_UPDATED` → Recalculer dashboards
   - `ALERT_CREATED` → Notifier ministre
   - `OBJECTIF_PROGRESS` → Mettre à jour stats
   - `STRUCTURE_CLAIMED` → Workflow validation
   - `PROVINCE_DATA_UPDATED` → Rafraîchir cartographies

---

## 📊 PRIORISATION DES TÂCHES

### 🔥 **PHASE 1 : CRITIQUE (Blockers)** — 4-6h

| #  | Tâche | Temps | Priorité |
|----|-------|-------|----------|
| 1  | Corriger typo `gabonCenter` | 5 min | P0 |
| 2  | Configurer routing `/gouv` (Vite + React Router + Express) | 1h | P0 |
| 3  | Créer schémas Prisma (Decret, Objectif, Alerte, Province, KPI) | 2h | P0 |
| 4  | Implémenter endpoints Dashboard API (GET kpis, alerts, decrets) | 2-3h | P0 |

### ⚡ **PHASE 2 : MAJEUR (Fonctionnalités)** — 6-8h

| #  | Tâche | Temps | Priorité |
|----|-------|-------|----------|
| 5  | Brancher services/api.ts + React Query | 2h | P1 |
| 6  | Remplacer mock data par vrais endpoints | 2h | P1 |
| 7  | Ajouter safelist Tailwind ou color mapping | 30 min | P1 |
| 8  | Implémenter middlewares (auth, validation, errors, logs) | 2h | P1 |
| 9  | Tests E2E des endpoints Dashboard | 1-2h | P1 |

### 🎯 **PHASE 3 : AVANCÉ (iAsted & Events)** — 4-6h

| #  | Tâche | Temps | Priorité |
|----|-------|-------|----------|
| 10 | Configurer Anthropic SDK + iAsted service | 2h | P2 |
| 11 | Implémenter endpoints iAsted (chat, generate-pdf) | 2h | P2 |
| 12 | Brancher EventBus + RabbitMQ en production | 2h | P2 |
| 13 | Créer listeners NotificationNeuron | 1h | P2 |

---

## 🎯 PLAN D'ACTION IMMÉDIAT

### ✅ **ACTION 1** : Corriger la typo `gabonCenter` (5 min)

```typescript
// src/pages/ministry/MinisterDashboard.tsx
- const gabon Center = { lat: -0.4162, lng: 9.4673 };
+ const gabonCenter = { lat: -0.4162, lng: 9.4673 };
```

### ✅ **ACTION 2** : Configurer routing `/gouv` (1h)

**2.1** Modifier `vite.config.ts` :
```typescript
export default defineConfig({
  base: '/gouv',
  // ...
});
```

**2.2** Modifier `src/main.tsx` :
```typescript
<BrowserRouter basename="/gouv">
  <App />
</BrowserRouter>
```

**2.3** Modifier `server/app.js` :
```javascript
// Servir le build React sur /gouv
app.use('/gouv', express.static(path.join(__dirname, '../dist')));

// Fallback pour React Router
app.get('/gouv/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Redirection /gouv → /gouv/dashboard
app.get('/gouv', (req, res) => res.redirect('/gouv/dashboard'));
```

### ✅ **ACTION 3** : Créer schémas Prisma (2h)

```prisma
// prisma/schema.prisma

model Decret {
  id          String   @id @default(cuid())
  titre       String
  numero      String   @unique
  date        DateTime
  statut      String   // "draft", "signed", "published"
  categorie   String   // "Santé publique", "Budget", etc.
  pdfUrl      String?
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Objectif {
  id          String   @id @default(cuid())
  nom         String
  description String?
  cible       Float    // Valeur cible (ex: 95 pour 95%)
  progres     Float    // Progression actuelle
  unite       String   // "%", "nombre", etc.
  deadline    DateTime
  provinceId  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Alerte {
  id          String   @id @default(cuid())
  titre       String
  description String
  severity    String   // "critique", "haute", "moyenne"
  province    String
  statut      String   @default("active") // "active", "resolved"
  action      String?
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
}

model Province {
  id          String   @id @default(cuid())
  nom         String   @unique
  code        String   @unique
  population  Int
  structures  Int
  couverture  Float    // %
  medecins    Int
  infirmiers  Int
  lits        Int
  budget      Float    // FCFA
  centroid    Json     // { lat, lng }
  bounds      Json     // [[south, west], [north, east]]
  needs       Json     // ["Médecins", "Infrastructures", ...]
  updatedAt   DateTime @updatedAt
}

model KPI {
  id          String   @id @default(cuid())
  nom         String
  valeur      Float
  delta       Float    // Variation vs période précédente
  unite       String   // "%", "actes", "Mds FCFA"
  periode     String   // "semaine", "mois", "annee"
  date        DateTime
  createdAt   DateTime @default(now())
}
```

**Exécuter** :
```bash
npx prisma migrate dev --name add_dashboard_models
npx prisma generate
```

### ✅ **ACTION 4** : Implémenter endpoints Dashboard API (2-3h)

**4.1** Créer `server/controllers/dashboard.controller.js` :
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/dashboard/kpis
const getKPIs = async (req, res) => {
  try {
    const { periode = 'mois' } = req.query;
    const kpis = await prisma.kPI.findMany({
      where: { periode },
      orderBy: { date: 'desc' },
      take: 10,
    });
    res.json({ success: true, data: kpis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/dashboard/alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.alerte.findMany({
      where: { statut: 'active' },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/dashboard/decrets
const getDecrets = async (req, res) => {
  try {
    const decrets = await prisma.decret.findMany({
      orderBy: { date: 'desc' },
      take: 20,
    });
    res.json({ success: true, data: decrets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/dashboard/decrets
const createDecret = async (req, res) => {
  try {
    const decret = await prisma.decret.create({
      data: {
        ...req.body,
        createdBy: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: decret });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/dashboard/objectifs
const getObjectifs = async (req, res) => {
  try {
    const objectifs = await prisma.objectif.findMany({
      orderBy: { deadline: 'asc' },
    });
    res.json({ success: true, data: objectifs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/dashboard/provinces
const getProvinces = async (req, res) => {
  try {
    const provinces = await prisma.province.findMany();
    res.json({ success: true, data: provinces });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getKPIs,
  getAlerts,
  getDecrets,
  createDecret,
  getObjectifs,
  getProvinces,
};
```

**4.2** Modifier `server/routes/dashboard.routes.js` :
```javascript
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Protéger toutes les routes
router.use(authMiddleware);

// Routes Dashboard
router.get('/kpis', dashboardController.getKPIs);
router.get('/alerts', dashboardController.getAlerts);
router.get('/decrets', dashboardController.getDecrets);
router.post('/decrets', dashboardController.createDecret);
router.get('/objectifs', dashboardController.getObjectifs);
router.get('/provinces', dashboardController.getProvinces);

module.exports = router;
```

---

## 📈 INDICATEURS DE SUCCÈS

### ✅ Critères d'Acceptance

- [ ] URL `http://localhost:8080/gouv/dashboard` accessible
- [ ] Aucune donnée simulée (100% endpoints réels)
- [ ] Build React servi depuis Express
- [ ] Tous les endpoints `/api/dashboard/*` fonctionnels
- [ ] Authentication JWT opérationnelle
- [ ] iAsted répond aux requêtes chat
- [ ] EventBus publie des events en temps réel
- [ ] 0 erreur console en production
- [ ] Tests E2E passent (100%)
- [ ] Temps de réponse < 200ms (p95)

### 🎯 Métriques Clés

| Métrique | Actuel | Cible |
|----------|--------|-------|
| URL correcte | ❌ :3000 | ✅ :8080/gouv |
| Endpoints réels | 0% | 100% |
| Typos code | 1 | 0 |
| Tests E2E | 0 | 15+ |
| Latence API | N/A | <200ms |
| Events/sec | 0 | 50+ |

---

## 🔧 COMMANDES UTILES

```bash
# Développement
npm run dev              # Vite dev sur :3000
npm run server:dev       # Express dev sur :8080

# Build & Preview
npm run build            # Build React → dist/
npm run preview          # Preview build sur :4173
npm run server:start     # Express prod sur :8080

# Base de données
npx prisma migrate dev   # Créer/appliquer migrations
npx prisma studio        # Interface graphique DB
npx prisma generate      # Générer Prisma Client

# Tests
npm run test             # Jest + React Testing Library
npm run test:e2e         # Playwright E2E

# Docker
docker-compose up -d     # Démarrer services
docker-compose logs -f   # Suivre les logs
docker-compose down      # Arrêter services
```

---

## 📚 RESSOURCES

### Documentation Technique
- [Vite base option](https://vitejs.dev/config/shared-options.html#base)
- [React Router basename](https://reactrouter.com/en/main/router-components/browser-router#basename)
- [Express static](https://expressjs.com/en/starter/static-files.html)
- [Prisma schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Anthropic SDK](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

### Dépendances Clés
```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.28.0",
    "@prisma/client": "^5.20.0",
    "react-router-dom": "^6.26.1",
    "@tanstack/react-query": "^5.55.0",
    "express": "^4.19.2"
  }
}
```

---

## 🎬 CONCLUSION

**Temps total estimé** : 14-20h  
**Priorité absolue** : PHASE 1 (4-6h) pour débloquer la prod  
**Prochaine étape** : Corriger `gabonCenter` et configurer routing `/gouv`

**État actuel** : 🟡 **PRÊT POUR FINALIZATION**  
**Objectif** : 🟢 **PRODUCTION-READY** d'ici 2-3 jours

---

**Voulez-vous que je procède avec la PHASE 1 immédiatement ?**

