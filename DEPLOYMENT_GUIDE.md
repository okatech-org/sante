# 📋 GUIDE DE DÉPLOIEMENT COMPLET - SANTE.GA

## 🎯 Vue d'ensemble

Ce guide couvre le déploiement de l'application SANTE.GA sur multiple plateformes:
- **Frontend**: Vercel, Netlify, Render, AWS
- **Backend**: Railway, Render, Heroku, AWS
- **Synchronisation avec Lovable**: Pour le développement continu

---

## 📦 Prérequis

```bash
# Node.js 18+
node --version

# NPM/Yarn/Bun
npm --version

# Vérifier les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs réelles dans .env.local
```

---

## 🚀 1. DÉPLOIEMENT FRONTEND ONLY (Recommandé pour Lovable)

### Option A: Vercel (Recommandé pour Lovable)

```bash
# Installation
npm install -g vercel

# Login
vercel login

# Déployer
vercel

# Configuration automatique des env vars via Vercel dashboard:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_API_URL (pointer vers votre backend)
```

**Fichier de configuration**: `vercel.json`

**Avantages**:
✅ Intégration GitHub automatique
✅ Déploiements en preview automatiques
✅ Performance optimale
✅ Edge functions supportées

---

### Option B: Netlify

```bash
# Installation
npm install -g netlify-cli

# Login
netlify login

# Déployer
netlify deploy --prod

# Ou via GitHub:
# 1. Push sur GitHub
# 2. Connecter repo à Netlify dashboard
# 3. Netlify construit et déploie automatiquement
```

**Fichier de configuration**: `netlify.toml`

**Avantages**:
✅ Build gratuit illimité
✅ Serverless functions intégrées
✅ A/B testing intégré
✅ Analytics gratuit

---

### Option C: AWS Amplify

```bash
# Installation
npm install -g @aws-amplify/cli

# Configuration
amplify configure

# Initialiser le projet
amplify init

# Build et déployer
amplify publish
```

---

## 🌐 2. DÉPLOIEMENT FULL-STACK (Frontend + Backend)

### Option A: Render (Meilleure option)

```bash
# 1. Créer un compte sur https://render.com
# 2. Connecter votre repo GitHub
# 3. Créer deux services:

# Service 1: Frontend (Web Service)
Name: sante-ga-frontend
Runtime: Node
Build Command: npm run build
Start Command: npm run preview
Publish directory: dist

# Service 2: Backend (Web Service)
Name: sante-ga-backend
Runtime: Node
Build Command: npm install
Start Command: npm run start
Environment: PORT=3000, NODE_ENV=production
Health Check: /health
```

**Fichier de configuration**: `render.yaml`

---

### Option B: Railway

```bash
# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialiser projet
railway init

# 4. Déployer
railway up

# 5. Configurer variables d'environnement
railway variables
```

**Fichier de configuration**: `railway.json`

---

### Option C: Heroku

```bash
# 1. Installer Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Créer app
heroku create your-app-name

# 4. Configurer buildpacks
heroku buildpacks:add heroku/nodejs

# 5. Pousser le code
git push heroku main

# 6. Configurer variables
heroku config:set VITE_SUPABASE_URL=xxx
heroku config:set PORT=3000
```

---

## 🔄 3. INTÉGRATION AVEC LOVABLE

### Synchronisation des changements

```bash
# Option 1: Cloner depuis Lovable
git clone https://lovable.dev/project/your-project-id
cd your-project

# Option 2: Pousser vers Lovable (depuis Lovable dashboard)
# - Connecter votre repo GitHub
# - Lovable surveille les changements automatiquement

# Option 3: Exporter depuis ce projet
# - Ziper le dossier src/
# - Importer dans Lovable via upload
```

### Workflow de développement continu

```bash
# 1. Développer localement
npm run dev

# 2. Pusher vers GitHub
git add .
git commit -m "Feature: nouveau composant"
git push origin main

# 3. Lovable se synchronise automatiquement
# (si connecté à GitHub)

# 4. Vérifier les déploiements
vercel deploy --prod
# ou
netlify deploy --prod
```

---

## 🔐 4. VARIABLES D'ENVIRONNEMENT PRODUCTION

### Frontend (.env.production)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_API_URL=https://api.sante.ga
```

### Backend (.env.production)

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_super_secure_secret_32_chars_min
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 📊 5. CHECKLIST PRÉ-PRODUCTION

- [ ] Tester localement: `npm run build && npm run preview`
- [ ] Vérifier toutes les variables d'environnement
- [ ] Configurer CORS correctement
- [ ] Mettre à jour les URLs API
- [ ] Tester login/authentification
- [ ] Vérifier les certificats SSL
- [ ] Configurer les backups de base de données
- [ ] Mettre en place la monitoring
- [ ] Documenter les endpoints API
- [ ] Configurer les logs centralisés

---

## 📈 6. MONITORING & LOGS

### Vercel
```
vercel logs [deployment-url]
vercel logs --follow
```

### Netlify
```
netlify logs
```

### Railway
```
railway logs
```

### Render
```
# Accès via dashboard: https://render.com
```

---

## 🐛 7. TROUBLESHOOTING

### Build échoue
```bash
# Nettoyer et reconstruire
rm -rf node_modules dist
npm install
npm run build
```

### Variables d'environnement non détectées
```bash
# Vérifier le nom du fichier
ls -la | grep .env

# Redéployer avec nouvelles variables
vercel env pull .env.local
```

### Backend ne répond pas
```bash
# Vérifier la santé
curl https://api.sante.ga/health

# Consulter les logs
vercel logs --follow
```

---

## 🎨 8. OPTIMISATIONS POUR LOVABLE

Lovable fonctionne mieux avec:
1. **Composants modulaires**: ✅ Vous avez déjà cette structure
2. **TypeScript**: ✅ Configuré
3. **Tailwind CSS**: ✅ Configuré
4. **React Hooks**: ✅ Utilisé partout
5. **Pas de build complexe**: ✅ Vite est léger

---

## 🚀 QUICK START - DÉPLOYER EN 5 MINUTES

### Frontend sur Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
# Ajouter les env vars via dashboard
```

### Backend sur Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## �� Support & Ressources

- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com
- **Railway**: https://docs.railway.app
- **Render**: https://render.com/docs
- **Lovable**: https://lovable.dev
- **Supabase**: https://supabase.com/docs

---

**Dernière mise à jour**: October 2024
**Auteur**: SANTE.GA Team
