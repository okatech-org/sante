# 🏗️ Architecture à Deux Serveurs - SANTE.GA

## 🤔 Pourquoi 2 Serveurs ?

Votre application SANTE.GA utilise une **architecture découplée** moderne :

```
┌─────────────────────┐         ┌──────────────────────┐
│   FRONTEND REACT    │  HTTP   │   BACKEND NEURAL     │
│   (Vite Dev Server) │ ◄─────► │   (Express Server)   │
│   Port: 8080        │  Proxy  │   Port: 3000         │
└─────────────────────┘         └──────────────────────┘
        │                               │
        │                               │
    Interface UI            API + IA + Business Logic
    Components React        - AuthNeuron
    Pages                   - PatientNeuron
    Hooks                   - iAsted Service
    Routing                 - Database Access
```

---

## 🎯 Serveur 1 : Frontend React (Port 8080)

### Rôle
- **Serveur de développement Vite**
- Sert l'interface utilisateur React
- Hot Module Replacement (HMR) pour rechargement rapide
- Compile TypeScript/JSX à la volée

### Technologie
- Vite (très rapide ⚡)
- React 18
- Tailwind CSS
- React Router

### Démarrage
```bash
npm run dev
```

### URL
```
http://localhost:8080
```

---

## 🎯 Serveur 2 : Backend Neural (Port 3000)

### Rôle
- **Serveur API Node.js/Express**
- Gestion de la logique métier (Neurons)
- Authentification JWT
- Connexion Supabase
- **Services IA (iAsted, Chat, Transcription)**
- Event Bus pour communication inter-neurones

### Technologie
- Node.js 18+
- Express
- Architecture Neuronale
- Anthropic Claude API
- OpenAI Whisper API

### Démarrage
```bash
npm run start
# ou en mode watch:
npm run neural:dev
```

### URL
```
http://localhost:3000
```

---

## 🔗 Comment ils Communiquent ?

### Le Proxy Vite (Configuration)

Dans `vite.config.ts` :
```typescript
server: {
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Flux de Requête

```
1. Frontend (8080) fait un appel à /api/dashboard/iasted/chat
                    ↓
2. Proxy Vite intercepte et redirige vers http://localhost:3000/api/dashboard/iasted/chat
                    ↓
3. Backend Neural (3000) traite la requête
                    ↓
4. Backend répond avec les données
                    ↓
5. Proxy retourne la réponse au Frontend
                    ↓
6. React affiche les données
```

---

## ✅ SOLUTION : Lancer les 2 Serveurs en Développement Local

### Option 1 : Manuellement (2 Terminaux)

#### Terminal 1 - Backend
```bash
cd /Users/okatech/sante
npm run neural:dev
```
Vous verrez :
```
🚀 Starting SANTE.GA Neural Server...
✅ Server running on port 3000
🧠 Event Bus ready
```

#### Terminal 2 - Frontend
```bash
cd /Users/okatech/sante
npm run dev
```
Vous verrez :
```
VITE v5.4.19  ready in 123 ms

➜  Local:   http://localhost:8080/
➜  Network: use --host to expose
```

---

### Option 2 : Automatiquement (1 Terminal) ⭐ Recommandé

Installez `concurrently` :
```bash
npm install --save-dev concurrently
```

Puis lancez :
```bash
npm run dev:full
```

Vous verrez les 2 serveurs en même temps :
```
[🧠Neural] 🚀 Starting SANTE.GA Neural Server...
[⚛️React] VITE v5.4.19  ready in 123 ms
[🧠Neural] ✅ Server running on port 3000
[⚛️React] ➜  Local:   http://localhost:8080/
```

---

## 🧪 Vérification que Tout Fonctionne

### 1. Backend Neural (Port 3000)
```bash
curl http://localhost:3000/health
```
**Résultat attendu :**
```json
{
  "status": "ok",
  "timestamp": "...",
  "neurons": {
    "authNeuron": "active",
    "patientNeuron": "active"
  }
}
```

### 2. Frontend (Port 8080)
```bash
curl http://localhost:8080
```
**Résultat attendu :**
```html
<!doctype html>
<html lang="en">
...
```

### 3. Proxy Fonctionne (8080 → 3000)
```bash
curl http://localhost:8080/api/health
```
**Résultat attendu :**
```json
{
  "status": "ok",
  ...
}
```
(Même réponse que le port 3000, mais via le proxy 8080)

---

## 🚨 Problèmes Fréquents

### ❌ Erreur : "Failed to fetch" ou "Network Error"

**Cause :** Backend (port 3000) n'est pas démarré

**Solution :**
```bash
# Vérifier si le backend tourne
lsof -i :3000

# Si rien, le démarrer
npm run neural:dev
```

---

### ❌ Erreur : "404 Not Found" pour /api/dashboard/iasted/*

**Cause :** Proxy Vite pas configuré ou backend non démarré

**Solution :**
1. Vérifier `vite.config.ts` contient le proxy
2. Redémarrer le serveur Vite : `npm run dev`
3. S'assurer que le backend tourne : `npm run neural:dev`

---

### ❌ Erreur : "EADDRINUSE" (Port déjà utilisé)

**Cause :** Un processus utilise déjà le port

**Solution :**
```bash
# Port 3000 occupé
lsof -ti :3000 | xargs kill -9

# Port 8080 occupé
lsof -ti :8080 | xargs kill -9
```

---

## 🌐 En Production : Architecture Différente

En production, vous avez plusieurs options :

### Option A : Backend Séparé (Recommandé)

```
Frontend (Lovable/Vercel)     Backend (Render/Railway)
https://sante.lovable.app  →  https://api.sante.ga
       Port: 443 (HTTPS)         Port: 443 (HTTPS)
```

**Configuration :**
```bash
# Variable d'environnement frontend
VITE_API_URL=https://api.sante.ga
```

---

### Option B : Serveur Unique (Monolithe)

Le backend sert aussi le frontend :

```
Server Node.js (Port 3000)
├── /api/*          → Endpoints API
└── /*              → Fichiers statiques React (dist/)
```

**Configuration `src/neural/server.js` :**
```javascript
// Servir les fichiers statiques React
app.use(express.static(path.resolve(__dirname, '../../dist')));

// Fallback pour React Router
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});
```

---

### Option C : Mode Fallback iAsted (Sans Backend)

Si vous ne déployez pas le backend :

```typescript
// Le service iAsted détecte automatiquement
if (!process.env.ANTHROPIC_API_KEY) {
  // Mode simulation/fallback
  return mockResponse();
}
```

---

## 📊 Récapitulatif

| Environnement | Frontend | Backend | Communication |
|---------------|----------|---------|---------------|
| **Développement** | localhost:8080 (Vite) | localhost:3000 (Node) | Proxy Vite |
| **Production A** | Lovable/Vercel | Render/Railway | API URL directe |
| **Production B** | Même serveur | Node.js :3000 | Fichiers statiques |

---

## ✅ Commandes Essentielles

```bash
# Développement complet (2 serveurs automatiques)
npm run dev:full

# Développement séparé
npm run neural:dev  # Terminal 1 - Backend
npm run dev         # Terminal 2 - Frontend

# Build production
npm run build

# Lancer en production (backend + frontend compilé)
npm run start:full

# Tests backend
npm run neural:test

# Vérifier la santé du backend
curl http://localhost:3000/health
```

---

## 🎯 Workflow Recommandé

### Pour le Développement Local

1. **Démarrez les 2 serveurs :**
   ```bash
   npm run dev:full
   ```

2. **Ouvrez votre navigateur :**
   ```
   http://localhost:8080
   ```

3. **Développez :**
   - Frontend : Modifications dans `src/` se rechargent automatiquement (HMR)
   - Backend : Modifications dans `src/neural/` redémarrent auto (nodemon)

4. **Testez iAsted :**
   - Le chat IA fonctionnera car le backend est accessible via le proxy

---

### Pour le Déploiement

1. **Build le frontend :**
   ```bash
   npm run build
   ```

2. **Déployez frontend sur Lovable/Vercel**

3. **Déployez backend sur Render/Railway**

4. **Configurez les variables d'environnement :**
   ```bash
   # Frontend
   VITE_API_URL=https://api.sante.ga
   
   # Backend
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-proj-...
   SUPABASE_URL=https://...
   ```

---

## 🔍 Pourquoi Cette Architecture ?

### ✅ Avantages

1. **Séparation des préoccupations**
   - Frontend : UI/UX
   - Backend : Business logic + IA

2. **Scalabilité indépendante**
   - Scale le frontend (CDN)
   - Scale le backend (instances)

3. **Technos optimales**
   - Vite pour le dev frontend (ultra rapide)
   - Node.js pour le backend (performance + IA)

4. **Déploiement flexible**
   - Frontend → CDN statique
   - Backend → Serveur avec GPU (pour IA)

5. **Sécurité**
   - Clés API jamais exposées au frontend
   - Backend peut valider tous les appels

---

**Date :** 2 novembre 2025  
**Auteur :** Assistant IA  
**Status :** ✅ Architecture Expliquée

