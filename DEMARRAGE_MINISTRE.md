# 🚀 Démarrage Rapide - Compte Ministre

## ⚡ En 3 Minutes

### 1. Créer le compte en base de données (1 min)

```bash
# Via l'interface Supabase SQL Editor
# Copier-coller le contenu du fichier:
supabase/create-minister-account.sql

# Puis cliquer sur "Run"
```

### 2. Créer le compte Authentication (1 min)

Dans l'interface Supabase:
1. **Authentication** → **Users** → **Add user**
2. Renseigner:
   - Email: `ministre@sante.gouv.ga`
   - Password: `Ministre2025!`
   - Email Confirm: ✅
   - Auto Confirm: ✅
3. **Save**

### 3. Accéder au Dashboard (30 secondes)

```bash
# Démarrer le serveur
npm run dev

# Ouvrir dans le navigateur
http://localhost:8080/gouv/dashboard
```

---

## 🎯 URLs d'Accès

### Principal
```
http://localhost:8080/gouv/dashboard
```

### Alternatifs
```
http://localhost:8080/minister/dashboard
http://localhost:8080/ministre/dashboard
```

---

## 🔑 Identifiants

```
Email:    ministre@sante.gouv.ga
Password: Ministre2025!
```

---

## ✅ Ce qui est Inclus

### 📊 Dashboard Exécutif
- 4 indicateurs clés nationaux
- Alertes prioritaires en temps réel
- Objectifs PNDS 2024-2028
- Performance des 9 provinces

### 📝 Gestion des Décrets
- 4 documents de démonstration
- Workflow complet (brouillon → publié)
- Recherche et filtres
- Statistiques en temps réel

### 🎯 Objectifs Nationaux
- 8 objectifs (politique, économique, sanitaire)
- Progression visuelle
- Filtres par catégorie
- Indicateurs d'état

### 📈 Statistiques
- Indicateurs de santé nationaux
- Recommandations automatiques
- Exports disponibles

---

## 🎨 Ce que vous verrez

### En-tête Personnalisé
```
┌────────────────────────────────────────┐
│ 🛡️  Pr. Adrien MOUGOUGOU              │
│     Ministre de la Santé               │
│     République Gabonaise               │
└────────────────────────────────────────┘
```

### Navigation
```
📊 Vue d'ensemble | 📝 Décrets | 🎯 Objectifs | 📈 Statistiques | 🏥 Structures | 📄 Rapports
```

### Indicateurs
```
👥 1.8M         🏥 238          💼 8.4K         💰 150 Mds
Population      Établissements  Professionnels  Budget FCFA
```

---

## 📚 Documentation Complète

- **Guide de test**: `GUIDE_TEST_MINISTRE.md`
- **Documentation complète**: `MINISTRE_IMPLEMENTATION_COMPLETE.md`
- **Script SQL**: `supabase/create-minister-account.sql`

---

## 🆘 Problème ?

### Le dashboard ne s'affiche pas
1. Vérifier que le serveur est démarré (`npm run dev`)
2. Vérifier l'URL: `http://localhost:8080/gouv/dashboard`
3. Vider le cache du navigateur (Ctrl+Shift+R)

### Erreur de connexion
1. Vérifier que le compte auth est créé dans Supabase
2. Vérifier l'email: `ministre@sante.gouv.ga`
3. Vérifier le mot de passe: `Ministre2025!`

### Données manquantes
1. Vérifier que le script SQL a été exécuté
2. Vérifier dans Supabase Table Editor:
   - Table `profiles`: ligne avec email ministre
   - Table `professionals`: profil lié
   - Table `establishments`: Ministère de la Santé

---

## 🎉 C'est Tout !

Votre compte ministre est prêt à l'emploi avec toutes les fonctionnalités nécessaires pour:
- ✅ Superviser le système de santé national
- ✅ Gérer les décrets et documents officiels
- ✅ Suivre les objectifs stratégiques
- ✅ Analyser les statistiques remontées
- ✅ Piloter la politique de santé

**Bon travail !** 🚀

