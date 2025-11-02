# ✅ PROMPT 2 — SERVICES API + REACT QUERY TERMINÉ

**Date** : 2 novembre 2025  
**Durée** : 10 minutes  
**Status** : ✅ **COMPLÉTÉ**

---

## 📋 FICHIERS CRÉÉS

### 1. ✅ **`src/services/api.ts`** — Service API centralisé

**Contenu** :
- ✅ Instance Axios configurée (`baseURL: '/api'`, `timeout: 10000`)
- ✅ Intercepteur JWT (Authorization header automatique)
- ✅ Intercepteur d'erreurs (redirection 401 → `/gouv/login`)
- ✅ Types TypeScript complets :
  - `KPI`
  - `Alert`
  - `Decree`
  - `Objectif`
  - `Province`
  - `APIResponse<T>`

**Fonctions API** :
```typescript
dashboardApi.getKPIs(periode?)
dashboardApi.getAlerts()
dashboardApi.getDecrees(params?)
dashboardApi.createDecree(decree)
dashboardApi.updateDecree(id, decree)
dashboardApi.deleteDecree(id)
dashboardApi.getObjectifs(params?)
dashboardApi.createObjectif(objectif)
dashboardApi.updateObjectif(id, objectif)
dashboardApi.getProvinces()
dashboardApi.getProvince(id)
dashboardApi.updateProvince(id, province)
dashboardApi.getStats(periode?)
```

---

### 2. ✅ **`src/hooks/useKPIs.ts`** — Hook KPIs

```typescript
const { data, isLoading, error, refetch } = useKPIs(periode);
```

**Configuration** :
- `staleTime: 60000` (1 minute)
- `refetchOnWindowFocus: false`
- Query key: `['kpis', periode]`

---

### 3. ✅ **`src/hooks/useAlerts.ts`** — Hook Alerts

```typescript
const { data, isLoading, error } = useAlerts();
```

**Configuration** :
- `staleTime: 30000` (30 secondes)
- `refetchInterval: 60000` (refetch auto chaque minute)
- `refetchOnWindowFocus: true`
- Query key: `['alerts']`

---

### 4. ✅ **`src/hooks/useDecrees.ts`** — Hook Decrees + Mutations

```typescript
// Query
const { data, isLoading, error } = useDecrees({ status: 'published' });

// Mutations
const createMutation = useCreateDecree();
const updateMutation = useUpdateDecree();
const deleteMutation = useDeleteDecree();

// Usage
createMutation.mutate({ titre: '...', numero: '...' });
updateMutation.mutate({ id: '123', decree: { statut: 'signed' } });
deleteMutation.mutate('123');
```

**Configuration** :
- `staleTime: 120000` (2 minutes)
- `refetchOnWindowFocus: false`
- Query key: `['decrees', params]`
- Auto-invalidation après mutations

---

### 5. ✅ **`src/hooks/useObjectifs.ts`** — Hook Objectifs + Mutations

```typescript
// Query
const { data, isLoading, error } = useObjectifs({ category: 'Santé' });

// Mutations
const createMutation = useCreateObjectif();
const updateMutation = useUpdateObjectif();

// Usage
createMutation.mutate({ nom: '...', cible: 95 });
updateMutation.mutate({ id: '123', objectif: { progres: 80 } });
```

**Configuration** :
- `staleTime: 300000` (5 minutes)
- `refetchOnWindowFocus: false`
- Query key: `['objectifs', params]`
- Auto-invalidation après mutations

---

### 6. ✅ **`src/hooks/useProvinces.ts`** — Hook Provinces + Mutation

```typescript
// Query all
const { data, isLoading, error } = useProvinces();

// Query one
const { data: province } = useProvince('province-id');

// Mutation
const updateMutation = useUpdateProvince();
updateMutation.mutate({ id: '123', province: { couverture: 85 } });
```

**Configuration** :
- `staleTime: 600000` (10 minutes)
- `refetchOnWindowFocus: false`
- Query key: `['provinces']` / `['provinces', id]`
- Auto-invalidation après mutation

---

## ✅ VÉRIFICATIONS

### Linter
```bash
✓ 0 erreur ESLint
✓ 0 warning TypeScript
✓ Tous les types sont correctement définis
```

### Structure
```
src/
├── services/
│   └── api.ts           ✅ 177 lignes
└── hooks/
    ├── useKPIs.ts       ✅ 10 lignes
    ├── useAlerts.ts     ✅ 11 lignes
    ├── useDecrees.ts    ✅ 47 lignes
    ├── useObjectifs.ts  ✅ 35 lignes
    └── useProvinces.ts  ✅ 30 lignes
```

---

## 🎯 CRITÈRES D'ACCEPTANCE

| Critère | Status |
|---------|--------|
| Instance Axios créée avec intercepteurs | ✅ |
| Types TypeScript complets | ✅ |
| 5 hooks React Query créés | ✅ |
| Mutations avec invalidation cache | ✅ |
| 0 erreur de compilation | ✅ |
| Stale times configurés | ✅ |

---

## 📊 FEATURES IMPLÉMENTÉES

### Gestion du Cache
- ✅ **Stale times** optimisés par type de données :
  - Alerts : 30s (temps réel)
  - KPIs : 1 min
  - Decrees : 2 min
  - Objectifs : 5 min
  - Provinces : 10 min (données stables)

### Auto-refresh
- ✅ Alerts refetch automatiquement chaque minute
- ✅ Refresh manuel via `refetch()`

### Mutations Intelligentes
- ✅ Invalidation automatique du cache après mutation
- ✅ Types TypeScript complets pour les payloads
- ✅ Gestion d'erreurs intégrée

### Sécurité
- ✅ JWT automatique sur toutes les requêtes
- ✅ Redirection auto sur 401
- ✅ Token stocké dans localStorage

---

## 🚀 UTILISATION DANS LES COMPOSANTS

### Exemple : Vue Globale (KPIs + Alerts)

```typescript
import { useKPIs } from '@/hooks/useKPIs';
import { useAlerts } from '@/hooks/useAlerts';

function DashboardMinister() {
  const { data: kpis, isLoading: kpisLoading } = useKPIs('mois');
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  if (kpisLoading || alertsLoading) return <LoadingSpinner />;

  return (
    <div>
      <KPIsSection data={kpis} />
      <AlertsSection data={alerts} />
    </div>
  );
}
```

### Exemple : Création de Décret

```typescript
import { useCreateDecree } from '@/hooks/useDecrees';
import { toast } from 'sonner';

function CreateDecretForm() {
  const createMutation = useCreateDecree();

  const handleSubmit = async (formData) => {
    try {
      await createMutation.mutateAsync({
        titre: formData.titre,
        numero: formData.numero,
        date: formData.date,
        statut: 'draft',
        categorie: formData.categorie,
      });
      toast.success('Décret créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Création...' : 'Créer'}
      </button>
    </form>
  );
}
```

---

## 📚 DOCUMENTATION API

### Endpoints attendus (Backend)

```
GET    /api/dashboard/kpis?periode=mois
GET    /api/dashboard/alerts
GET    /api/dashboard/decrets?status=published
POST   /api/dashboard/decrets
PATCH  /api/dashboard/decrets/:id
DELETE /api/dashboard/decrets/:id
GET    /api/dashboard/objectifs?category=Santé
POST   /api/dashboard/objectifs
PATCH  /api/dashboard/objectifs/:id
GET    /api/dashboard/provinces
GET    /api/dashboard/provinces/:id
PATCH  /api/dashboard/provinces/:id
GET    /api/dashboard/stats?periode=mois
```

### Format de réponse attendu

```typescript
{
  "success": true,
  "data": T[],  // ou T pour les GET by ID
  "error"?: string
}
```

---

## 🚧 PROCHAINES ÉTAPES — PROMPT 3

**Objectif** : Brancher les composants existants sur l'API

**Cibles** :
- `src/pages/ministry/MinisterDashboard.tsx`
  - Section **Vue globale** → `useKPIs` + `useAlerts`
  - Section **Décrets** → `useDecrees` + `useCreateDecree`
  - Section **Objectifs** → `useObjectifs`
  - Section **Statistiques** → `useKPIs`
  - Section **Structures** → `useProvinces`

**Durée estimée** : 1.5h

---

## 🎉 RÉSUMÉ PROMPT 2

**PROMPT 2 COMPLÉTÉ** ✅

- [x] `src/services/api.ts` créé (177 lignes)
- [x] 5 hooks React Query créés
- [x] Types TypeScript complets
- [x] Mutations avec invalidation cache
- [x] 0 erreur de compilation
- [x] Stale times optimisés

**Prêt pour PROMPT 3** 🚀

---

**📍 État actuel** : Services API + Hooks prêts, composants utilisent encore mock data

**🔍 Action suivante** : Brancher `MinisterDashboard.tsx` sur les nouveaux hooks

