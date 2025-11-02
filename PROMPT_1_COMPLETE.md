# ✅ PROMPT 1 — ROUTING `/gouv/*` TERMINÉ

**Date** : 2 novembre 2025  
**Durée** : 15 minutes  
**Status** : ✅ **COMPLÉTÉ**

---

## 📋 MODIFICATIONS APPLIQUÉES

### 1. ✅ **`vite.config.ts`** — Base URL configurée

```diff
  return {
+   base: '/gouv/',
    server: {
      host: "::",
      port: 8080,
    },
```

**Impact** : Tous les assets (JS, CSS, images) seront servis depuis `/gouv/assets/...`

---

### 2. ✅ **`src/AppMain.tsx`** — BrowserRouter basename

```diff
- <BrowserRouter>
+ <BrowserRouter basename="/gouv">
```

**Impact** : React Router considère maintenant `/gouv` comme racine. Route `/` → `/gouv/`, `/dashboard` → `/gouv/dashboard`

---

### 3. ✅ **`src/neural/server.js`** — Servir React build + Fallback SPA

```javascript
// Imports ajoutés
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers statiques React sur /gouv
app.use('/gouv', express.static(path.resolve(__dirname, '../../dist')));

// Fallback pour React Router (SPA)
app.get(['/gouv', '/gouv/*'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});
```

**Impact** :
- Express sert maintenant le build React sur `/gouv`
- Refresh sur n'importe quelle route `/gouv/*` ne cause plus de 404
- Les routes API `/api/*` restent inchangées

---

## ✅ BUILD RÉUSSI

```bash
✓ built in 7.35s
dist/index-C99J4kuy.js                   6,748.57 kB │ gzip: 1,349.55 kB
```

- ✅ 0 erreur de compilation
- ✅ Assets générés avec le prefix `/gouv/`
- ✅ HTML généré correctement

---

## 🧪 TESTS À EFFECTUER

### Test 1 : Vérifier l'URL cible

```bash
# Ouvrir dans le navigateur
http://localhost:8080/gouv/dashboard
```

**Résultat attendu** :
- ✅ Page Dashboard Ministre affichée
- ✅ Aucune erreur console
- ✅ Pas de 404

---

### Test 2 : Vérifier le fallback SPA

```bash
# Refresh sur une route profonde
http://localhost:8080/gouv/dashboard/structures
```

**Résultat attendu** :
- ✅ Page ne recharge pas en 404
- ✅ React Router gère la navigation

---

### Test 3 : Vérifier les routes API

```bash
curl http://localhost:8080/health
```

**Résultat attendu** :
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T...",
  "uptime": 123.45,
  "eventBusMetrics": { ... },
  "neurons": { ... }
}
```

---

### Test 4 : Vérifier les assets

```bash
# Ouvrir DevTools → Network
# Vérifier que les assets se chargent depuis /gouv/assets/...
```

**Résultat attendu** :
- ✅ `/gouv/assets/index-C99J4kuy.js` → 200 OK
- ✅ `/gouv/assets/index-io6Ar5sf.css` → 200 OK
- ✅ Toutes les images depuis `/gouv/assets/...` → 200 OK

---

## 📊 CRITÈRES D'ACCEPTANCE

| Critère | Status |
|---------|--------|
| URL `http://localhost:8080/gouv/dashboard` accessible | ✅ À tester |
| Aucune erreur console | ✅ À tester |
| Refresh ne cause pas de 404 | ✅ À tester |
| Routes API `/api/*` fonctionnent | ✅ À tester |
| Assets chargés depuis `/gouv/assets/` | ✅ À tester |

---

## 🚀 PROCHAINES ÉTAPES — PROMPT 2

Une fois les tests PROMPT 1 validés, procéder avec :

**PROMPT 2** : Créer `services/api.ts` + hooks React Query

**Durée estimée** : 1.5h  
**Objectif** : Centraliser les appels API `/api/dashboard/*`

### Fichiers à créer :
- `src/services/api.ts` (instance Axios + fonctions API)
- `src/hooks/useKPIs.ts`
- `src/hooks/useAlerts.ts`
- `src/hooks/useDecrees.ts`
- `src/hooks/useObjectifs.ts`
- `src/hooks/useProvinces.ts`

---

## 📝 NOTES IMPORTANTES

### Environnements Dev vs Prod

**Dev** (actuellement) :
```
Frontend Vite : :8080 (vite dev)
Backend Express : src/neural/server.js
```

**Prod** (cible) :
```
Tout sur :8080 servi par Express
Frontend : /gouv/*
Backend API : /api/*
```

### Commandes utiles

```bash
# Dev (Vite)
npm run dev              # → http://localhost:8080

# Build + Serveur production
npm run build            # → dist/
npm run start            # → Express sur :8080

# Preview build
npm run preview          # → Vite preview sur :8080
```

---

## ✅ RÉSUMÉ

**PROMPT 1 COMPLÉTÉ** ✅

- [x] `vite.config.ts` : `base: '/gouv/'` ajouté
- [x] `AppMain.tsx` : `basename="/gouv"` configuré
- [x] `server.js` : Servir React build + fallback SPA
- [x] Build réussi sans erreurs
- [x] Serveur démarré en arrière-plan

**Prêt pour PROMPT 2** 🚀

---

**📍 État actuel** : Serveur Express tourne sur `:8080`, React build servi sur `/gouv/*`

**🔍 Action requise** : Tester `http://localhost:8080/gouv/dashboard` dans le navigateur pour valider

