# 🚀 Exécution SQL Supabase + Déploiement Lovable

**Date**: 31 octobre 2025  
**Objectif**: Correction Nadège Oyono + Déploiement en production

---

## 📋 PHASE 1: EXÉCUTION DU SCRIPT SQL SUPABASE

### ⚙️ Prérequis
- ✅ Accès à Supabase Dashboard
- ✅ Compte admin Supabase configuré
- ✅ Projet SANTE.GA actif

### 🔧 Étapes d'Exécution

#### Étape 1: Accéder à Supabase SQL Editor
1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet **SANTE.GA**
3. Cliquer sur **SQL Editor** (menu gauche)
4. Cliquer sur **New Query** (ou +)

#### Étape 2: Copier le Script SQL

Le script est dans le fichier: `/Users/okatech/sante/fix-nadege-oyono-receptionist.sql`

Voir le contenu complet du script à exécuter dans ce fichier.

#### Étape 3: Coller et Exécuter
1. Coller tout le script dans l'éditeur SQL Supabase
2. Cliquer sur **RUN** (ou Ctrl+Enter)
3. Attendre la completion (2-5 secondes)

#### Étape 4: Vérifier les Résultats

Vous devriez voir le message de confirmation:
```
✅ Correction complète du compte Nadège Oyono terminée
Email: nadege.oyono@sogara.ga
Mot de passe: Sogara2025!
Rôle: receptionist
Établissement: CMST SOGARA
```

Et les 4 sections de vérification doivent retourner des résultats.

### ✅ Succès Script SQL

Si tous les résultats s'affichent correctement, **c'est bon !** ✅

---

## 🚀 PHASE 2: DÉPLOIEMENT SUR LOVABLE

### ⚙️ Prérequis
- ✅ Code sur GitHub (déjà fait ✅)
- ✅ Projet Lovable créé et configuré
- ✅ Connexion GitHub autorisée

### 🔧 Étapes de Déploiement

#### Option A: Auto-Deploy depuis GitHub (RECOMMANDÉ)

Si Lovable est configuré pour auto-deploy:

1. **Accéder au Dashboard Lovable**
   - URL: https://lovable.dev/projects
   - Sélectionner projet SANTE.GA

2. **Vérifier la Configuration**
   - Aller dans **Settings** → **Deployment**
   - Vérifier que GitHub est connecté
   - Vérifier la branche: `main`

3. **Déclencher le Déploiement**
   - Le push sur GitHub déclenche automatiquement le build
   - OU cliquer manuellement sur **Deploy Now**

4. **Monitoring du Déploiement**
   - Aller dans **Deployments**
   - Voir le build en cours
   - Attendre la completion (5-10 minutes)

#### Option B: Déploiement Manuel via Lovable Dashboard

1. **Accéder à Lovable**
   - URL: https://lovable.dev/projects
   - Sélectionner SANTE.GA

2. **Aller dans Deployments**
   - Cliquer sur **Deployments** (menu gauche)

3. **Créer un Nouveau Déploiement**
   - Cliquer sur **Deploy**
   - Sélectionner branche: `main`
   - Cliquer sur **Deploy Now**

4. **Suivre le Build**
   - Voir le log du build
   - Attendre "Deployment successful"

### 📊 Suivi du Déploiement

#### Durée Estimée
- Build: 3-5 minutes
- Déploiement: 2-3 minutes
- Total: 5-10 minutes

---

## ✅ PHASE 3: VÉRIFICATION POST-DÉPLOIEMENT

### Test 1: Accès à l'Application

Vérifier que l'app charge correctement sans erreurs.

### Test 2: Connexion Nadège Oyono

**Identifiants**:
```
Email: nadege.oyono@sogara.ga
Mot de passe: Sogara2025!
```

Tester la connexion sur l'interface professionnel.

### Test 3: Dashboard Réceptionniste

Vérifier que le dashboard réceptionniste s'affiche correctement.

### Test 4: Permissions

Vérifier que Nadège a accès à:
- ✅ Gestion des rendez-vous
- ✅ Enregistrement des patients
- ✅ Consultation des informations patients
- ✅ Gestion de la file d'attente

### Test 5: Console du Navigateur

Vérifier qu'il n'y a pas d'erreurs JavaScript.

---

## 🆘 Dépannage

### Erreur: Script SQL échoue
- Vérifier que l'utilisateur existe
- Vérifier que l'établissement CMST SOGARA existe
- Vérifier les logs d'erreur Supabase

### Erreur: Déploiement échoue
- Vérifier les logs de build Lovable
- Vérifier que tout le code est sur GitHub
- Vérifier les erreurs de compilation

### Erreur: Connexion échoue après déploiement
- Vider le cache du navigateur
- Utiliser une fenêtre privée
- Vérifier les tokens JWT

---

## 📋 Checklist Complète

### Phase 1: SQL Supabase
- [ ] Accéder à Supabase Dashboard
- [ ] Ouvrir SQL Editor
- [ ] Copier le script SQL
- [ ] Exécuter le script
- [ ] Vérifier les résultats

### Phase 2: Déploiement Lovable
- [ ] Accéder à Lovable Dashboard
- [ ] Déclencher le déploiement
- [ ] Suivre le build
- [ ] Attendre "Deployment successful"

### Phase 3: Tests
- [ ] Accès à l'application
- [ ] Connexion Nadège Oyono
- [ ] Dashboard réceptionniste
- [ ] Permissions correctes
- [ ] Pas d'erreurs

---

**Document créé**: 31 octobre 2025  
**Status**: Prêt pour exécution
