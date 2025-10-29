# 🚀 SANTE.GA - GUIDE DE DÉMARRAGE RAPIDE

Bienvenue! Vous êtes prêt à déployer votre application. Voici un guide simplifié.

---

## ⚡ 5 MINUTES POUR DÉPLOYER

### 1️⃣ Sur Vercel (Frontend)

```bash
# Installation
npm install -g vercel

# Login et déployer
vercel login
vercel --prod

# ✅ Votre app est en ligne!
# URL: https://sante-ga.vercel.app
```

### 2️⃣ Sur Railway (Full-Stack)

```bash
# Installation
npm install -g @railway/cli

# Login et déployer
railway login
railway init
railway up

# ✅ Frontend + Backend live!
```

### 3️⃣ Avec Lovable (Recommandé)

```
1. Aller sur https://lovable.dev
2. New Project > Import from GitHub
3. Sélectionner: okatech-org/sante
4. Lovable configure automatiquement
5. Settings > Deployments > Vercel
6. Déploiement auto à chaque changement!
```

---

## 📋 AVANT DE COMMENCER

### Créer les comptes (2 minutes)

- [ ] **Vercel** → https://vercel.com (gratuit)
- [ ] **Supabase** → https://supabase.com (gratuit pour dev)
- [ ] **Railway** → https://railway.app (optionnel, $5+/mois)
- [ ] **Lovable** → https://lovable.dev (optionnel)

### Préparer les variables d'environnement

```bash
# Copier le modèle
cp .env.example .env.local

# Remplir avec vos valeurs Supabase:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

## 🎯 VOTRE PREMIER DÉPLOIEMENT

### Étape 1: Build Localement

```bash
# Vérifier que tout fonctionne
npm install
npm run build
npm run preview
```

### Étape 2: Pousser vers GitHub

```bash
git add .
git commit -m "Prêt pour le déploiement"
git push origin main
```

### Étape 3: Déployer

**Option A - Vercel (Recommandé pour commencer)**

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option B - Lovable (Développement continu)**

```
1. https://lovable.dev
2. Cliquer "New Project"
3. "Import from GitHub"
4. Sélectionner votre repo
5. Lovable s'occupe de tout!
```

---

## 📂 FICHIERS IMPORTANTS

```
DEPLOYMENT_GUIDE.md        ← Guide complet (lire après)
LOVABLE_INTEGRATION.md     ← Comment utiliser Lovable
DEPLOYMENT_SUMMARY.md      ← Résumé avec checklist
deploy.sh                  ← Script interactif
.env.example               ← Modèle de variables
vercel.json                ← Config Vercel
netlify.toml               ← Config Netlify
railway.json               ← Config Railway
render.yaml                ← Config Render
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT

### Avant le Déploiement
- [ ] Code testé localement (`npm run build` réussit)
- [ ] Variables d'environnement configurées
- [ ] Compte créé sur la plateforme (Vercel/Railway/etc)
- [ ] GitHub repo à jour (`git push`)

### Configuration
- [ ] Connecter le repo à la plateforme
- [ ] Ajouter les env vars sur le dashboard
- [ ] Valider la connexion Supabase
- [ ] Tester le déploiement initial

### Après le Déploiement
- [ ] App accéssible en ligne
- [ ] API répond (tester `/health`)
- [ ] Authentification fonctionne
- [ ] Base de données connectée
- [ ] Images chargent correctement

---

## 🆘 PROBLÈMES COURANTS

### Le build échoue?
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Les variables d'env ne chargent pas?
```bash
# Vérifier le préfixe (doit être VITE_)
VITE_SUPABASE_URL ✅
SUPABASE_URL ❌

# Redéployer avec les env vars configurées
```

### Érreur "port already in use"?
```bash
# Vérifier quel processus utilise le port
lsof -i :3000
# Arrêter le processus
kill -9 [PID]
```

---

## 📚 DOCUMENTATION COMPLÈTE

Lire après votre premier déploiement:

1. **DEPLOYMENT_GUIDE.md** - Guide complet (7 sections)
2. **LOVABLE_INTEGRATION.md** - Intégration Lovable
3. **DEPLOYMENT_SUMMARY.md** - Résumé avec référence

---

## 🎨 AVEC LOVABLE

Une fois déployé, vous pouvez:

```
✅ Générer du code AI-assisted
   "Créer une page dashboard"

✅ Modifier l'interface en temps réel
   Les changements déploient automatiquement!

✅ Collaborer en équipe
   Lovable synchronise avec GitHub

✅ Tester sur mobile
   Preview responsive intégré
```

---

## 🔗 LIENS RAPIDES

- **Lovable**: https://lovable.dev
- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com
- **GitHub**: https://github.com/okatech-org/sante

---

## 🚀 COMMANDES UTILES

```bash
# Développement
npm run dev                    # Dev server local
npm run neural:dev             # Backend Node local

# Production
npm run build                  # Build pour production
npm run preview                # Tester le build

# Déploiement
./deploy.sh                    # Script interactif
vercel --prod                  # Déployer Vercel
railway up                     # Déployer Railway

# Nettoyage
rm -rf node_modules dist
npm install
```

---

## 💡 CONSEILS

1. **Commencez avec Vercel** - C'est le plus facile
2. **Utilisez Lovable pour le développement** - Plus rapide avec l'AI
3. **Connectez GitHub** - Déploiement automatique
4. **Monitorez les logs** - `vercel logs --follow`
5. **Testez en prod** - Avant de passer à la production réelle

---

## 🎉 C'EST PARTI!

Vous êtes prêt à déployer! 

**Prochaine étape**: Créer un compte Vercel et lancer votre premier déploiement.

```bash
npm install -g vercel
vercel login
vercel --prod
```

Questions? Consultez DEPLOYMENT_GUIDE.md ou posez sur GitHub Issues.

---

**Version**: 1.0
**Créé**: October 2024
**Temps de lecture**: 5 minutes
