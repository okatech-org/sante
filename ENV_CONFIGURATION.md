# 🔐 CONFIGURATION ENVIRONNEMENT — SANTE.GA

**Date** : 2 novembre 2025  
**Fichier** : `.env` (à créer à la racine du projet)

---

## 📋 VARIABLES REQUISES

### 🔵 SUPABASE (OBLIGATOIRE)

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Où trouver ?**
1. https://supabase.com/dashboard → Votre projet
2. Settings → API
3. Copier les 3 clés

---

### 🔒 JWT & SECURITY (OBLIGATOIRE)

```bash
JWT_SECRET=votre-cle-secrete-tres-longue-min-32-caracteres-change-en-production
JWT_EXPIRES_IN=7d
```

**Génération JWT_SECRET** :
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 32
```

---

### 🤖 ANTHROPIC — iAsted (OPTIONNEL)

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

**Obtenir une clé** :
1. Créer un compte : https://console.anthropic.com
2. Billing → Add payment method
3. API Keys → Create key
4. Copier la clé `sk-ant-api03-...`

**Modèles disponibles** :
- `claude-3-5-sonnet-20241022` ✅ Recommandé (meilleur rapport qualité/prix)
- `claude-3-opus-20240229` (Plus puissant, plus cher)
- `claude-3-sonnet-20240229` (Équilibré)
- `claude-3-haiku-20240307` (Rapide, économique)

**Tarification** (nov 2025) :
- Input : ~$3 / 1M tokens
- Output : ~$15 / 1M tokens

**Si non configuré** :
iAsted fonctionnera en **mode fallback** (réponses simulées)

---

### ⚙️ SERVER (OBLIGATOIRE)

```bash
PORT=8080
NODE_ENV=development
```

---

## 📝 EXEMPLE COMPLET `.env`

```bash
# SUPABASE
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDE1NTc1OTk5fQ.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=7d

# ANTHROPIC (Optionnel - décommenter si vous avez une clé)
# ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
# ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# SERVER
PORT=8080
NODE_ENV=development
```

---

## 🚀 DÉMARRAGE

### 1. Créer le fichier `.env`

```bash
cp ENV_CONFIGURATION.md .env
# Ou
touch .env
```

### 2. Remplir les valeurs

Éditer `.env` et remplacer les valeurs par vos vraies clés.

### 3. Vérifier la configuration

```bash
# Tester que les variables sont chargées
node -e "require('dotenv').config(); console.log('Supabase URL:', process.env.VITE_SUPABASE_URL)"
```

---

## ⚠️ SÉCURITÉ

### À NE JAMAIS FAIRE
- ❌ Commiter `.env` dans Git
- ❌ Partager vos clés API
- ❌ Utiliser les mêmes clés en dev/prod
- ❌ Hardcoder les clés dans le code

### À FAIRE
- ✅ Ajouter `.env` dans `.gitignore` (déjà fait)
- ✅ Utiliser `.env.example` comme template
- ✅ Stocker les clés prod dans le système de secrets (Vercel, Railway, etc.)
- ✅ Générer des clés fortes (min 32 caractères)
- ✅ Rotate les clés régulièrement

---

## 🔍 VÉRIFICATION

### Variables Frontend (VITE_*)
Ces variables sont **injectées au build** et accessibles via `import.meta.env.VITE_*`

```bash
# Vérifier qu'elles sont présentes au build
npm run build
# Les valeurs sont remplacées dans le bundle
```

### Variables Backend (toutes)
Chargées au runtime via `dotenv`

```bash
# src/neural/server.js
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.ANTHROPIC_API_KEY); // sk-ant-...
```

---

## 📚 RESSOURCES

### Supabase
- Dashboard : https://supabase.com/dashboard
- Docs : https://supabase.com/docs

### Anthropic
- Console : https://console.anthropic.com
- Docs : https://docs.anthropic.com
- Pricing : https://www.anthropic.com/pricing

### Outils
- Bcrypt generator : https://bcrypt-generator.com/
- JWT debugger : https://jwt.io/
- Random key generator : https://randomkeygen.com/

---

## ✅ CHECKLIST

- [ ] Fichier `.env` créé
- [ ] Variables Supabase remplies
- [ ] JWT_SECRET généré (32+ chars)
- [ ] ANTHROPIC_API_KEY ajouté (si disponible)
- [ ] Variables testées (`node -e "require('dotenv').config(); console.log(...)"`)
- [ ] Serveur démarre sans erreur
- [ ] Frontend build sans erreur

---

**📍 Sans `.env` configuré, l'application ne démarrera pas correctement**

