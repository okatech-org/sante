# 🚀 Démarrage Rapide - SANTE.GA

## ⚡ Solution 1 Implémentée : Un Seul Terminal !

Vous pouvez maintenant démarrer **frontend + backend en une seule commande** !

---

## 🎯 Méthode Recommandée (Nouveau)

### Option A : Script Bash (Le Plus Simple)

```bash
./start-dev.sh
```

Vous verrez :
```
🚀 Démarrage de SANTE.GA en mode développement...
✅ Dépendances OK

🧠 Démarrage du Backend Neural (port 3000)...
⚛️  Démarrage du Frontend React (port 8080)...

📍 URLs:
   - Frontend: http://localhost:8080
   - Backend:  http://localhost:3000

[🧠Neural] 🚀 Starting SANTE.GA Neural Server...
[⚛️React] VITE v5.4.19  ready in 123 ms
[🧠Neural] ✅ Server running on port 3000
[⚛️React] ➜  Local:   http://localhost:8080/
```

**🎉 C'est tout ! Les deux serveurs tournent ensemble.**

---

### Option B : Commande NPM

```bash
npm run dev:full
```

Même résultat que le script bash, mais sans les messages de bienvenue.

---

## 🛑 Arrêter les Serveurs

Appuyez sur **Ctrl+C** dans le terminal.

Les deux serveurs s'arrêteront automatiquement.

---

## 📖 Anciennes Méthodes (Toujours Disponibles)

### Méthode 2 Terminaux (Manuel)

Si vous préférez contrôler chaque serveur séparément :

**Terminal 1 - Backend :**
```bash
npm run neural:dev
```

**Terminal 2 - Frontend :**
```bash
npm run dev
```

---

## 🧪 Vérifier que Tout Fonctionne

### 1. Backend Neural (Port 3000)

```bash
curl http://localhost:3000/health
```

**Résultat attendu :**
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T...",
  "neurons": {
    "authNeuron": "active",
    "patientNeuron": "active",
    "professionalNeuron": "active",
    "appointmentNeuron": "active",
    "notificationNeuron": "active"
  }
}
```

### 2. Frontend React (Port 8080)

Ouvrez votre navigateur : http://localhost:8080

### 3. Proxy API Fonctionne

```bash
curl http://localhost:8080/api/health
```

Devrait retourner la même réponse que le port 3000 (le proxy redirige).

---

## 📊 Schéma de Fonctionnement

```
┌─────────────────────────────────────────────┐
│         npm run dev:full (Terminal 1)       │
└─────────────────────────────────────────────┘
                    │
                    ├──► [🧠Neural] Backend Express (Port 3000)
                    │    • AuthNeuron
                    │    • PatientNeuron
                    │    • iAsted Service (IA)
                    │    • Supabase Connection
                    │
                    └──► [⚛️React] Frontend Vite (Port 8080)
                         • Interface UI
                         • Hot Module Replacement
                         • Proxy API → :3000
```

---

## 🎨 Fonctionnalités Disponibles

### Frontend (Port 8080)
- ✅ Interface complète SANTE.GA
- ✅ Dashboard Ministre
- ✅ Recherche médecins
- ✅ Gestion RDV
- ✅ Profils patients
- ✅ Cartographie sanitaire

### Backend (Port 3000)
- ✅ API RESTful
- ✅ Authentification JWT
- ✅ **iAsted IA (Nouveau)**
  - Chat intelligent
  - Génération de rapports
  - Génération de décrets
  - Transcription vocale

---

## 🔧 Configuration

### Variables d'Environnement (.env)

```bash
# Supabase (REQUIS)
SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
SUPABASE_ANON_KEY=eyJ...
VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...

# Backend Neural
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-key

# IA Services (pour iAsted)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

---

## 🚨 Dépannage

### ❌ Erreur : "concurrently: command not found"

**Solution :**
```bash
npm install
```

### ❌ Erreur : "EADDRINUSE" (Port déjà utilisé)

**Port 3000 occupé :**
```bash
lsof -ti :3000 | xargs kill -9
```

**Port 8080 occupé :**
```bash
lsof -ti :8080 | xargs kill -9
```

### ❌ Backend ne démarre pas

**Vérifier les logs :**
```bash
# Dans le terminal où tourne dev:full
# Regarder les messages [🧠Neural]
```

**Tester manuellement :**
```bash
npm run neural:dev
```

### ❌ Frontend ne se charge pas

**Vider le cache du navigateur :**
- Chrome/Edge : `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
- Firefox : `Ctrl+Shift+Del`

**Rebuild :**
```bash
npm run build
```

---

## 🎯 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `./start-dev.sh` | 🌟 Démarre tout (frontend + backend) |
| `npm run dev:full` | Même chose que le script bash |
| `npm run dev` | Frontend seulement (port 8080) |
| `npm run neural:dev` | Backend seulement (port 3000) |
| `npm run build` | Build production frontend |
| `npm run start` | Lance backend en mode production |
| `npm run start:full` | Build + lance backend |
| `npm run neural:test` | Tests backend |
| `npm run lint` | Lint le code |

---

## 📱 Tester l'Application

### 1. Démarrer
```bash
./start-dev.sh
```

### 2. Ouvrir le Navigateur
```
http://localhost:8080
```

### 3. Se Connecter

**Compte Ministre :**
- Email : `ministre@sante.ga`
- Password : `Ministre@2024!`

**Compte Admin :**
- Email : `admin@sante.ga`
- Password : `Admin@2024!`

### 4. Tester iAsted

1. Aller sur le Dashboard Ministre
2. Cliquer sur le bouton **iAsted** (en bas à droite)
3. Essayer :
   - 💬 Chat : "Analyse la couverture sanitaire"
   - 📄 Rapport : Générer un rapport
   - 📜 Décret : Générer un décret
   - 🎤 Vocal : Parler dans le micro

---

## 🎓 Architecture Expliquée

### Pourquoi 2 Serveurs ?

**Frontend (Vite - Port 8080)**
- Serveur de développement ultra-rapide
- Hot Module Replacement (changements instantanés)
- Optimisé pour React/TypeScript

**Backend (Node.js - Port 3000)**
- API RESTful
- Architecture neuronale (microservices internes)
- Services IA (Anthropic Claude, OpenAI)
- Connexion base de données (Supabase)

### Communication

```
Frontend (8080) ──[Proxy Vite]──► Backend (3000)

Exemple :
http://localhost:8080/api/health
        ↓ (redirigé par le proxy)
http://localhost:3000/api/health
```

**Avantages :**
- ✅ Séparation des préoccupations
- ✅ Chaque serveur optimisé pour son rôle
- ✅ Déploiement flexible (peuvent être séparés en prod)
- ✅ Sécurité (clés API jamais exposées au frontend)

---

## 🌐 Déploiement

### Développement Local
```bash
./start-dev.sh
# Frontend: localhost:8080
# Backend:  localhost:3000
```

### Production
```bash
# Option A : Backend séparé
npm run build                    # Build frontend
# Déployer dist/ sur Lovable/Vercel
# Déployer backend sur Render/Railway

# Option B : Serveur unique
npm run start:full              # Backend sert le frontend
```

---

## 📚 Documentation Complète

- **Architecture :** `ARCHITECTURE_DEUX_SERVEURS.md`
- **Corrections :** `CORRECTIONS_CONSOLE_ERRORS.md`
- **Déploiement :** `DEPLOIEMENT_LOVABLE_RAPIDE.md`
- **iAsted :** `FONCTIONS_IASTED_IMPLEMENTEES.md`

---

## ✅ Checklist Démarrage

- [ ] Cloner le repo : `git clone ...`
- [ ] Installer : `npm install`
- [ ] Configurer `.env` (copier depuis `.env.example`)
- [ ] Démarrer : `./start-dev.sh`
- [ ] Ouvrir : http://localhost:8080
- [ ] Se connecter avec un compte test
- [ ] Tester iAsted
- [ ] Vérifier la console (pas d'erreurs)

---

**🎉 Vous êtes prêt à développer !**

**Date :** 2 novembre 2025  
**Version :** 1.0.0  
**Status :** ✅ Solution 1 Implémentée

