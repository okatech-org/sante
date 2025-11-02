# 🎯 README — Dashboard Ministre SANTE.GA

**Version** : 1.0.0  
**Date** : 2 novembre 2025  
**Status** : ✅ **PRODUCTION-READY**

---

## 🚀 DÉMARRAGE RAPIDE (15 minutes)

### 1. Exécuter les migrations Supabase (5 min)

**Via Supabase Studio** :
1. https://supabase.com/dashboard → Votre projet
2. SQL Editor → Nouvelle requête
3. Copier/coller puis Run (dans l'ordre) :
   - `supabase/migrations/20251102_dashboard_minister_tables.sql`
   - `supabase/migrations/20251102_dashboard_minister_seed.sql`

### 2. Créer l'utilisateur ministre (1 min)

```bash
node scripts/create-minister-user.js
```

**Identifiants générés** :
```
Email    : ministre@sante.ga
Password : Ministre2025!
Role     : MINISTRE
```

### 3. Lancer l'application

```bash
npm run build    # Build React
npm run start    # Serveur Express :8080
```

### 4. Accéder au dashboard

```
Login    : http://localhost:8080/gouv/login
Dashboard: http://localhost:8080/gouv/dashboard
```

---

## 📊 FEATURES

### Interface
- ✅ 9 sections (Vue globale, Décrets, Objectifs, Statistiques, Structures, Conseil, Connaissance, iAsted, Rapports)
- ✅ Design moderne glassmorphism
- ✅ Sidebar rétractable
- ✅ Dark/Light theme
- ✅ Responsive (mobile/tablet/desktop)
- ✅ Cartographies nationales (Leaflet)

### Backend
- ✅ 13 endpoints REST `/api/dashboard/*`
- ✅ Auth JWT + RLS Supabase
- ✅ Event Bus integration
- ✅ Logging Winston
- ✅ React Query cache optimisé

---

## 🗂️ ENDPOINTS API

```
GET    /api/dashboard/kpis?periode=mois
GET    /api/dashboard/alerts
GET    /api/dashboard/decrets?status=published
POST   /api/dashboard/decrets
GET    /api/dashboard/objectifs
GET    /api/dashboard/provinces
GET    /api/dashboard/stats
```

**Auth requise** : Bearer token JWT

---

## 📚 DOCUMENTATION COMPLÈTE

1. **`DIAGNOSTIC_GOUV_DASHBOARD.md`** — Analyse des écarts
2. **`PROMPT_PACK_FINALISATION.md`** — 5 prompts structurés
3. **`GUIDE_MIGRATION_DASHBOARD.md`** — Instructions migrations
4. **`FINALISATION_DASHBOARD_MINISTRE_COMPLETE.md`** — Rapport complet
5. **`PROMPT_1_COMPLETE.md`** → **`PROMPT_5_COMPLETE.md`** — Rapports détaillés

---

## 🔧 TROUBLESHOOTING

**404 sur `/gouv/dashboard`**
→ Exécuter `npm run build`

**401 sur API**
→ Se connecter via `/gouv/login`

**Données vides**
→ Exécuter migrations Supabase

**Login échoue**
→ Exécuter `node scripts/create-minister-user.js`

---

## 📞 SUPPORT

Consultez la documentation détaillée dans :
- `FINALISATION_DASHBOARD_MINISTRE_COMPLETE.md`
- `GUIDE_MIGRATION_DASHBOARD.md`

---

**✅ DASHBOARD MINISTRE 100% OPÉRATIONNEL** 🎉

