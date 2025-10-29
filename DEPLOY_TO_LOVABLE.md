# 🚀 Déploiement sur Lovable - SANTE.GA

## ✅ Statut Actuel

- ✅ GitHub repository à jour
- ✅ Projet Lovable déjà connecté
- ✅ URL Lovable : https://lovable.dev/projects/8aea29c7-5091-4941-b0f1-0dc070140f7a

## 🎯 Options de Déploiement

### Option 1: Déploiement Direct depuis Lovable (Recommandé)

1. **Ouvrir votre projet Lovable** :
   ```
   https://lovable.dev/projects/8aea29c7-5091-4941-b0f1-0dc070140f7a
   ```

2. **Cliquer sur "Share" (en haut à droite)**

3. **Sélectionner "Publish"**

4. **Lovable déploie automatiquement** :
   - Build optimisé
   - CDN global
   - HTTPS automatique
   - URL générée : `https://[nom-projet].lovable.app`

### Option 2: Déploiement via Vercel (depuis Lovable)

1. **Dans Lovable, aller à Settings**

2. **Aller à "Deployments"**

3. **Cliquer "Connect Vercel"**

4. **Autoriser Lovable à accéder à Vercel**

5. **Configurer** :
   - Repository : okatech-org/sante
   - Branch : main
   - Build command : `npm run build`
   - Output directory : `dist`

6. **Variables d'environnement** (dans Vercel) :
   ```
   VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
   ```

7. **Deploy** - Lovable push automatiquement vers Vercel

### Option 3: Déploiement via Netlify

1. **Dans Lovable Settings → Deployments**

2. **Connect Netlify**

3. **Configuration** :
   - Build command : `npm run build`
   - Publish directory : `dist`

4. **Environment Variables** :
   ```
   VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
   ```

5. **Deploy automatique activé**

## 🔄 Synchronisation Automatique

Votre projet est configuré pour la synchronisation bidirectionnelle :

```
Lovable Editor
      ↕
    GitHub
      ↕
Local Development
```

### Activer la Sync Auto

1. **Dans Lovable → Settings → Git Integration**

2. **Vérifier** :
   - ✅ Connected to GitHub
   - ✅ Repository : okatech-org/sante
   - ✅ Branch : main
   - ✅ Auto-sync enabled

3. **Maintenant** :
   - Modifications dans Lovable → Auto push vers GitHub
   - Push sur GitHub → Lovable se met à jour automatiquement

## 🌐 URLs de l'Application

Après déploiement, vous aurez :

### Production
- **Lovable App** : `https://sante-ga.lovable.app` (ou similaire)
- **Vercel** : `https://sante.vercel.app` (si connecté)
- **Netlify** : `https://sante-ga.netlify.app` (si connecté)

### Preview
- **Branch Previews** : Chaque push crée un preview URL
- **PR Previews** : Chaque Pull Request a son URL de test

## 🔧 Configuration Post-Déploiement

### 1. Variables d'Environnement

Assurez-vous que ces variables sont configurées dans votre plateforme de déploiement :

```bash
# REQUIS
VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...

# OPTIONNEL
VITE_API_URL=https://api.sante.ga
VITE_MONITORING_ENDPOINT=https://monitoring.sante.ga
```

### 2. Domaine Personnalisé (Optionnel)

#### Dans Lovable

1. **Settings → Domains**
2. **Click "Connect Domain"**
3. **Entrer** : `sante.ga` ou `app.sante.ga`
4. **Suivre les instructions DNS**

#### Dans Vercel

1. **Project Settings → Domains**
2. **Add** : `sante.ga`
3. **Configurer les DNS** :
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### 3. SSL/HTTPS

- **Lovable** : SSL automatique ✅
- **Vercel** : SSL automatique ✅
- **Netlify** : SSL automatique ✅

## 🧪 Tester le Déploiement

Après déploiement, vérifier :

### Checklist de Test

- [ ] **Homepage** charge correctement
- [ ] **Login** fonctionne
- [ ] **Supabase** connexion OK
- [ ] **Images/Assets** se chargent
- [ ] **Routes** fonctionnent (pas de 404)
- [ ] **Mobile** responsive
- [ ] **Performance** acceptable (Lighthouse > 80)

### Test Rapide

```bash
# 1. Ouvrir l'URL de production
https://[votre-url].lovable.app

# 2. Tester login
Email: test@sogara.com
Password: Test@2024!

# 3. Vérifier la console navigateur
# (F12 → Console)
# Pas d'erreurs critiques

# 4. Tester sur mobile
# (Mode responsive dans DevTools)
```

## 🔍 Monitoring Post-Déploiement

### Lovable Analytics

1. **Dans Lovable → Analytics**
2. Voir :
   - Nombre de visiteurs
   - Pages vues
   - Temps de chargement
   - Erreurs

### Vercel Analytics (si utilisé)

1. **Vercel Dashboard → Analytics**
2. Monitoring :
   - Performance metrics
   - Real User Monitoring
   - Error tracking

### Supabase Logs

1. **Supabase Dashboard → Logs**
2. Surveiller :
   - Auth requests
   - Database queries
   - API errors

## 🚨 Troubleshooting

### Erreur: "Build Failed"

**Cause** : Erreur de build

**Solution** :
```bash
# Tester localement
npm run build

# Si ça échoue, corriger les erreurs
# Puis push
git add .
git commit -m "Fix build errors"
git push
```

### Erreur: "Environment Variables Not Set"

**Cause** : Variables manquantes

**Solution** :
1. Lovable Settings → Environment Variables
2. Ajouter toutes les vars de `.env.local`
3. Redéployer

### Erreur: "Cannot Connect to Supabase"

**Cause** : URL ou Key incorrecte

**Solution** :
1. Vérifier `VITE_SUPABASE_URL`
2. Vérifier `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Tester localement : `node check-env.js`

### Page Blanche Après Déploiement

**Cause** : Routing issue ou build error

**Solution** :
1. Check browser console (F12)
2. Vérifier `netlify.toml` ou `vercel.json`
3. S'assurer que SPA routing est configuré

## 📊 Métriques de Performance

### Objectifs

- **Lighthouse Score** : > 90
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3.5s
- **Bundle Size** : < 300KB gzipped

### Optimisations Automatiques (Lovable)

- ✅ Code splitting
- ✅ Image optimization
- ✅ CDN global
- ✅ Brotli compression
- ✅ HTTP/2 push

## 🎉 Déploiement Réussi!

Une fois déployé, vous pouvez :

1. **Partager l'URL** avec votre équipe
2. **Connecter un domaine** personnalisé
3. **Configurer CI/CD** pour déploiements automatiques
4. **Monitorer** les performances et erreurs
5. **Itérer** rapidement via Lovable

## 📞 Support

- **Lovable Docs** : https://lovable.dev/docs
- **Lovable Discord** : https://discord.gg/lovable
- **GitHub Issues** : https://github.com/okatech-org/sante/issues

## 🔗 Liens Utiles

- **Projet Lovable** : https://lovable.dev/projects/8aea29c7-5091-4941-b0f1-0dc070140f7a
- **GitHub Repo** : https://github.com/okatech-org/sante
- **Supabase Project** : https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg

---

**Dernière mise à jour** : October 29, 2024
**Status** : ✅ Ready to Deploy

