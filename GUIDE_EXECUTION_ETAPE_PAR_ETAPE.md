# 📝 Guide Étape par Étape - Exécution et Déploiement

**Date**: 31 octobre 2025  
**Durée estimée**: 20-30 minutes

---

## 🎯 ÉTAPE 1: EXÉCUTER LE SCRIPT SQL SUPABASE

### Étape 1.1: Ouvrir Supabase

```
🌐 URL: https://supabase.com/dashboard
```

1. Cliquez sur le lien ci-dessus
2. Connectez-vous avec vos identifiants
3. Sélectionnez le projet **SANTE.GA**

### Étape 1.2: Accéder à SQL Editor

```
Menu gauche → SQL Editor
↓
Click: "+ New Query" (ou "SQL Editor")
```

### Étape 1.3: Copier le Script SQL

**Fichier à copier**:
```
/Users/okatech/sante/fix-nadege-oyono-receptionist.sql
```

**Contenu à copier** (voir le fichier pour le script complet)

### Étape 1.4: Coller et Exécuter

```
1. Sélectionner tout le texte du script
2. Coller dans l'éditeur Supabase (Ctrl+V)
3. Cliquer sur "RUN" ou Ctrl+Enter
4. ⏳ Attendre 2-5 secondes
```

### Étape 1.5: Vérifier le Succès ✅

Vous devriez voir:

```
✅ Message de confirmation:
"Correction complète du compte Nadège Oyono terminée"

✅ 4 sections de résultats:
- PROFIL PRINCIPAL (1 ligne)
- PROFIL PROFESSIONNEL (1 ligne)
- AFFECTATION ÉTABLISSEMENT (1 ligne)
- STAFF (1 ligne)
```

**Si vous voyez tout cela** → C'est bon ! ✅ Passez à l'étape 2.

**Si vous voyez une erreur**:
- Vérifier le message d'erreur
- Vérifier que l'utilisateur existe
- Vérifier que l'établissement CMST SOGARA existe
- Consulter la section dépannage

---

## 🚀 ÉTAPE 2: DÉPLOYER SUR LOVABLE

### Étape 2.1: Ouvrir Lovable Dashboard

```
🌐 URL: https://lovable.dev/projects
```

1. Cliquez sur le lien ci-dessus
2. Connectez-vous
3. Sélectionnez le projet **SANTE.GA**

### Étape 2.2: Aller dans Deployments

```
Menu gauche → Deployments
```

### Étape 2.3: Déclencher le Déploiement

**Option A** (Auto-deploy - si configuré):
```
Le code est déjà sur GitHub
→ Attendez le déploiement automatique (5-10 min)
→ Ou cliquez "Deploy Now"
```

**Option B** (Manuel):
```
Cliquer: "Deploy"
↓
Sélectionner branche: "main"
↓
Cliquer: "Deploy Now"
↓
Attendre le build (5-10 minutes)
```

### Étape 2.4: Suivre le Build

```
Vous verrez:
1. "Build started" → En cours
2. "Dependencies installing" → En cours
3. "Building..." → En cours
4. "Deployment successful" → ✅ Fini !
```

**Durée**: 5-10 minutes

---

## ✅ ÉTAPE 3: TESTER LA CONNEXION

### Étape 3.1: Accéder à l'Application

Une fois le déploiement terminé, vous recevrez une URL:

```
🌐 https://votre-app.lovable.app
```

Ouvrez cette URL dans votre navigateur.

### Étape 3.2: Aller sur le Login Professionnel

```
URL: https://votre-app.lovable.app/login/professional
```

Ou cliquez sur "Login Professional" depuis la page d'accueil.

### Étape 3.3: Se Connecter avec Nadège Oyono

Entrez les identifiants:

```
Email: nadege.oyono@sogara.ga
Mot de passe: Sogara2025!
```

Puis cliquez: **"Se connecter"**

### Étape 3.4: Vérifier le Dashboard

Après la connexion, vous devriez voir:

```
✅ Dashboard réceptionniste chargé
✅ Menu professionnel avec options:
   - Gestion des rendez-vous
   - Enregistrement patients
   - File d'attente
   - Statistiques accueil
✅ Établissement: CMST SOGARA
```

---

## 🎉 SUCCÈS !

Si vous êtes arrivé jusqu'ici, **tout fonctionne !** 🎉

### Qu'est-ce qui a été fait:

1. ✅ Compte Nadège Oyono corrigé dans Supabase
   - Rôle: receptionist
   - Affectation: CMST SOGARA
   - Permissions: gestion accueil

2. ✅ Code déployé sur Lovable
   - Interfaces professionnelles ajoutées
   - Dashboard réceptionniste fonctionnel

3. ✅ Test réussi
   - Connexion OK
   - Dashboard accessible
   - Permissions correctes

---

## 🆘 SI QUELQUE CHOSE NE FONCTIONNE PAS

### Problème 1: Le script SQL retourne une erreur

**Message**: "Utilisateur nadege.oyono@sogara.ga non trouvé"

**Solution**:
1. Vérifier que le compte existe dans auth.users
2. Vérifier l'email exact
3. Si le compte n'existe pas, le créer d'abord

**Message**: "Établissement CMST SOGARA non trouvé"

**Solution**:
1. Vérifier dans la table "establishments" que CMST SOGARA existe
2. Vérifier le nom exact
3. Corriger si besoin

### Problème 2: Le déploiement échoue

**Solution**:
1. Vérifier les logs de build Lovable
2. Voir s'il y a des erreurs de compilation
3. Vérifier que tout est bien sur GitHub

### Problème 3: La connexion échoue après déploiement

**Solution**:
1. Vider le cache du navigateur (Ctrl+Shift+Delete)
2. Utiliser une fenêtre de navigation privée
3. Attendre 5 minutes (les caches se mettent à jour)
4. Se reconnecter

### Problème 4: Le dashboard réceptionniste ne s'affiche pas

**Solution**:
1. Actualiser la page (F5 ou Ctrl+R)
2. Forcer l'actualisation (Ctrl+Shift+R)
3. Vérifier la console (F12) pour les erreurs
4. Vérifier que le code est bien déployé

---

## 📞 LOGS ET SUPPORT

### Voir les Logs Supabase

```
https://supabase.com/dashboard
→ Projet SANTE.GA
→ Logs (menu gauche)
→ Voir les erreurs SQL
```

### Voir les Logs Lovable

```
https://lovable.dev/projects
→ Projet SANTE.GA
→ Deployments
→ Cliquer sur le déploiement
→ Voir le build log
```

### Console du Navigateur

```
F12 ou Right-click → Inspect
→ Onglet "Console"
→ Voir les erreurs JavaScript
```

---

## 📋 RÉSUMÉ DES COMMANDES

### Supabase
- **Ouvrir**: https://supabase.com/dashboard
- **Fichier SQL**: fix-nadege-oyono-receptionist.sql
- **Action**: Exécuter le script dans SQL Editor

### Lovable
- **Ouvrir**: https://lovable.dev/projects
- **Action**: Deploy le projet SANTE.GA
- **Attendre**: Build et déploiement (5-10 min)

### Test
- **Email**: nadege.oyono@sogara.ga
- **Mot de passe**: Sogara2025!
- **URL**: https://votre-app.lovable.app/login/professional

---

## ✅ CHECKLIST FINALE

**Phase 1 - SQL Supabase**
- [ ] Supabase ouvert
- [ ] SQL Editor accessible
- [ ] Script copié
- [ ] Script exécuté
- [ ] Confirmation visible

**Phase 2 - Déploiement Lovable**
- [ ] Lovable Dashboard ouvert
- [ ] Déploiement déclenché
- [ ] Build en cours
- [ ] Déploiement succesful

**Phase 3 - Test**
- [ ] App accessible
- [ ] Connexion réussie
- [ ] Dashboard réceptionniste visible
- [ ] Pas d'erreurs

---

**Guide créé**: 31 octobre 2025  
**Dernière mise à jour**: 31 octobre 2025  
**Status**: ✅ Prêt à l'emploi
