# 🚀 Déploiement Lovable - Guide Rapide

## ✅ Statut : Code Poussé sur GitHub

```
✅ Commit: "🔧 Fix: Corrections React Query + Proxy Vite + iAsted API"
✅ Push: GitHub à jour (ed6c586)
✅ Fichiers: 15 modifiés, 2057 insertions
```

---

## 🎯 OPTION 1: Déploiement Direct Lovable (⚡ Le Plus Rapide)

### Étape 1: Ouvrir Lovable
👉 **Cliquez sur ce lien :**
```
https://lovable.dev/projects/8aea29c7-5091-4941-b0f1-0dc070140f7a
```

### Étape 2: Synchroniser avec GitHub
1. Dans Lovable, cliquez sur **"Sync"** (icône de synchronisation en haut)
2. Lovable va pull les derniers changements depuis GitHub
3. Attendez que la sync soit terminée (quelques secondes)

### Étape 3: Publier
1. Cliquez sur **"Share"** (en haut à droite)
2. Sélectionnez **"Publish"**
3. Lovable déploie automatiquement
4. Vous recevrez l'URL de production : `https://[nom].lovable.app`

### ⏱️ Temps estimé : 2-3 minutes

---

## 🎯 OPTION 2: Déploiement via Vercel (Recommandé pour Production)

### Étape 1: Installer Vercel CLI
```bash
npm install -g vercel
```

### Étape 2: Se Connecter à Vercel
```bash
vercel login
```

### Étape 3: Déployer
```bash
cd /Users/okatech/sante
vercel --prod
```

### Étape 4: Configurer les Variables d'Environnement

Dans le dashboard Vercel (https://vercel.com/dashboard), ajouter :

```bash
VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Pour le backend Neural (optionnel)
VITE_API_URL=https://api.sante.ga
```

### Étape 5: Redéployer pour Appliquer les Variables
```bash
vercel --prod
```

### ⏱️ Temps estimé : 5-7 minutes

---

## 🎯 OPTION 3: Build Local et Upload Manuel

### Si vous préférez un contrôle total :

```bash
# 1. Build production local
npm run build

# 2. Vérifier le build
ls -lh dist/

# 3. Uploader manuellement sur Lovable
# (via l'interface Lovable → Upload Build)
```

---

## 🔑 Variables d'Environnement Requises

⚠️ **Important** : Configurer ces variables dans votre plateforme de déploiement :

### Supabase (REQUIS)
```bash
VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGlkemVzaXRra2ZvamR5dXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTMxMzUsImV4cCI6MjA3NDkyOTEzNX0.bKmwG96ju8nRHLOizeMtp-VleN658wI6CpOkCChgc2A
VITE_SUPABASE_PROJECT_ID=bolidzesitkkfojdyuyg
```

### Backend API (si déployé séparément)
```bash
VITE_API_URL=https://api.sante.ga
```

---

## 🧪 Tests Post-Déploiement

### Checklist à Vérifier

Une fois déployé, tester :

#### ✅ Fonctionnalités de Base
- [ ] Homepage se charge
- [ ] Login fonctionne
- [ ] Dashboard Ministre accessible
- [ ] Images/assets se chargent
- [ ] Responsive mobile OK

#### ✅ Fonctionnalités iAsted (Nouveau)
- [ ] Bouton iAsted visible
- [ ] Chat iAsted fonctionne
- [ ] Génération de rapports OK
- [ ] Génération de décrets OK
- [ ] Transcription vocale OK

#### ✅ API Endpoints
```bash
# Tester le health check (si backend déployé)
curl https://api.sante.ga/health

# Devrait retourner:
# {"status":"ok","timestamp":"..."}
```

#### ✅ Console Navigateur
- Ouvrir DevTools (F12)
- Onglet Console
- ✅ Pas d'erreurs React Query
- ✅ Pas d'erreurs 404 pour iAsted
- ✅ Toutes les données se chargent

---

## 🚨 Troubleshooting Fréquent

### ❌ Erreur: "Failed to Load Resource: 404"

**Cause :** Backend non déployé ou URL incorrecte

**Solution :**
1. Si backend local : Ne pas utiliser les fonctions iAsted en prod
2. Si backend déployé : Vérifier `VITE_API_URL`
3. Alternative : Déployer le backend sur Render/Railway

### ❌ Erreur: "Cannot Connect to Supabase"

**Cause :** Variables d'environnement manquantes

**Solution :**
1. Vérifier que `VITE_SUPABASE_URL` est configuré
2. Vérifier que `VITE_SUPABASE_PUBLISHABLE_KEY` est configuré
3. Redéployer après ajout des variables

### ❌ Page Blanche

**Cause :** Erreur de routing ou build

**Solution :**
1. Ouvrir Console (F12)
2. Lire l'erreur
3. Vérifier que `base: '/'` dans `vite.config.ts`
4. Rebuild : `npm run build`

---

## 📊 URLs Après Déploiement

### Lovable
- **Production :** `https://sante-ga-XXXXX.lovable.app`
- **Preview :** Auto-généré pour chaque commit

### Vercel (si utilisé)
- **Production :** `https://sante-vercel.app`
- **Preview :** `https://sante-git-branch.vercel.app`

---

## 🎉 Déploiement Backend Neural (Optionnel)

Si vous voulez déployer le backend Node.js (pour iAsted API) :

### Option A: Railway
```bash
# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Déployer
railway up
```

### Option B: Render
1. Aller sur https://render.com
2. New → Web Service
3. Connecter GitHub : okatech-org/sante
4. Build Command : `npm install`
5. Start Command : `npm run start`
6. Ajouter variables d'environnement
7. Deploy

---

## 📞 Prochaines Étapes

### Après Déploiement Réussi

1. **Tester** toutes les fonctionnalités
2. **Configurer** un domaine personnalisé (sante.ga)
3. **Activer** les déploiements automatiques
4. **Monitorer** les performances
5. **Partager** l'URL avec l'équipe

### Domaine Personnalisé (Optionnel)

Dans Lovable/Vercel Settings :
1. Domains → Add Domain
2. Entrer : `app.sante.ga`
3. Configurer DNS chez votre registrar :
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com (ou lovable)
   TTL: 3600
   ```

---

## ✅ Résumé des Changements Déployés

### 🔧 Corrections
- ✅ React Query undefined fixés
- ✅ Proxy Vite configuré (port 8080 → 3000)
- ✅ Endpoints iAsted fonctionnels

### 🆕 Nouvelles Fonctionnalités
- ✅ Chat IA avec Anthropic Claude
- ✅ Génération automatique de rapports
- ✅ Génération automatique de décrets
- ✅ Transcription vocale (Whisper)
- ✅ Support multi-AI (Claude, OpenAI, Gemini)

### 📝 Documentation
- ✅ CORRECTIONS_CONSOLE_ERRORS.md
- ✅ FONCTIONS_IASTED_IMPLEMENTEES.md
- ✅ DEPLOIEMENT_LOVABLE_RAPIDE.md (ce fichier)

---

**Date :** 2 novembre 2025  
**Commit :** ed6c586  
**Status :** ✅ Prêt pour déploiement

🚀 **Action Suivante :** Choisissez l'Option 1, 2 ou 3 ci-dessus et déployez !

