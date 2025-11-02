# 📖 GUIDE MIGRATION — Dashboard Ministre

**Date** : 2 novembre 2025  
**Objectif** : Exécuter les migrations Supabase pour le Dashboard Ministre  
**Durée** : 5-10 minutes

---

## 🎯 MIGRATIONS À EXÉCUTER

### Migration 1 : Tables Dashboard
**Fichier** : `supabase/migrations/20251102_dashboard_minister_tables.sql`

**Crée** :
- ✅ `dashboard_kpis` (Indicateurs de performance)
- ✅ `dashboard_alerts` (Alertes prioritaires)
- ✅ `dashboard_decrets` (Décrets ministériels)
- ✅ `dashboard_objectifs` (Objectifs nationaux)
- ✅ `dashboard_provinces` (Données provinciales)

### Migration 2 : Seed Data
**Fichier** : `supabase/migrations/20251102_dashboard_minister_seed.sql`

**Insère** :
- ✅ 8 KPIs (Population, Établissements, Budget, etc.)
- ✅ 5 Alertes (Rupture insuline, Scanner en panne, etc.)
- ✅ 6 Décrets (Conseil National Santé, Budget 2025, etc.)
- ✅ 6 Objectifs (CSU, Vaccination, Mortalité maternelle, etc.)
- ✅ 9 Provinces (Estuaire, Haut-Ogooué, Nyanga, etc.)

---

## 🚀 MÉTHODE 1 : Supabase Studio (RECOMMANDÉ)

### Étape 1 : Ouvrir Supabase Studio
1. Ouvrir : https://supabase.com/dashboard
2. Sélectionner votre projet SANTE.GA
3. Naviguer vers : **SQL Editor**

### Étape 2 : Exécuter Migration Tables
1. Ouvrir le fichier : `supabase/migrations/20251102_dashboard_minister_tables.sql`
2. Copier tout le contenu
3. Coller dans l'éditeur SQL
4. Cliquer sur **Run** (ou `Ctrl + Enter`)
5. Vérifier : ✅ "Success. No rows returned"

### Étape 3 : Exécuter Seed Data
1. Ouvrir le fichier : `supabase/migrations/20251102_dashboard_minister_seed.sql`
2. Copier tout le contenu
3. Coller dans l'éditeur SQL
4. Cliquer sur **Run**
5. Vérifier : ✅ "Success. X rows affected"

### Étape 4 : Vérifier les données
```sql
-- Compter les KPIs
SELECT COUNT(*) FROM dashboard_kpis;
-- → 8 rows

-- Compter les alertes
SELECT COUNT(*) FROM dashboard_alerts;
-- → 5 rows

-- Compter les décrets
SELECT COUNT(*) FROM dashboard_decrets;
-- → 6 rows

-- Compter les objectifs
SELECT COUNT(*) FROM dashboard_objectifs;
-- → 6 rows

-- Compter les provinces
SELECT COUNT(*) FROM dashboard_provinces;
-- → 9 rows
```

---

## 🖥️ MÉTHODE 2 : CLI Supabase (Si Docker disponible)

```bash
# Démarrer Supabase local
supabase start

# Appliquer migrations
supabase db push

# Ou exécuter fichiers spécifiques
supabase db execute -f supabase/migrations/20251102_dashboard_minister_tables.sql
supabase db execute -f supabase/migrations/20251102_dashboard_minister_seed.sql
```

---

## 🔍 MÉTHODE 3 : Script Node.js (Alternative)

**Note** : Cette méthode nécessite `SUPABASE_SERVICE_ROLE_KEY` dans `.env`

```bash
# Exécuter le script
node scripts/run-dashboard-migrations.js
```

**Limitation** : Nécessite une fonction PostgreSQL `exec_sql` ou découpage du SQL en requêtes individuelles.

---

## ✅ VÉRIFICATION POST-MIGRATION

### Test 1 : Tables créées
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'dashboard_%';
```

**Résultat attendu** :
```
dashboard_kpis
dashboard_alerts
dashboard_decrets
dashboard_objectifs
dashboard_provinces
```

### Test 2 : Données insérées
```sql
-- KPIs
SELECT nom, valeur, delta, unite FROM dashboard_kpis LIMIT 3;

-- Provinces
SELECT nom, code, population, couverture FROM dashboard_provinces;

-- Alertes
SELECT titre, severity, province FROM dashboard_alerts WHERE statut = 'active';
```

### Test 3 : RLS activé
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'dashboard_%';
```

**Résultat attendu** : Toutes les tables avec `rowsecurity = true`

---

## 🧪 TEST API APRÈS MIGRATION

### Test avec curl

```bash
# Terminal 1 : Démarrer le serveur
npm run start

# Terminal 2 : Tester les endpoints
curl http://localhost:8080/api/dashboard/kpis?periode=mois
curl http://localhost:8080/api/dashboard/alerts
curl http://localhost:8080/api/dashboard/decrets
curl http://localhost:8080/api/dashboard/objectifs
curl http://localhost:8080/api/dashboard/provinces
```

**Résultats attendus** :
```json
{
  "success": true,
  "data": [...]
}
```

---

## 🚨 TROUBLESHOOTING

### Erreur : "relation dashboard_kpis does not exist"
**Cause** : Migration tables pas exécutée  
**Solution** : Exécuter `20251102_dashboard_minister_tables.sql` d'abord

### Erreur : "duplicate key value violates unique constraint"
**Cause** : Seed data déjà exécuté  
**Solution** : Normal, les `ON CONFLICT DO NOTHING` empêchent les doublons

### Erreur : "permission denied for table dashboard_kpis"
**Cause** : RLS policies trop restrictives  
**Solution** : Vérifier que votre utilisateur a le rôle MINISTRE/ADMIN

### Erreur : "function exec_sql does not exist"
**Cause** : Script Node.js ne peut pas exécuter SQL direct  
**Solution** : Utiliser Supabase Studio (Méthode 1)

---

## 📋 CHECKLIST FINALE

- [ ] Migration tables exécutée (`20251102_dashboard_minister_tables.sql`)
- [ ] Migration seed exécutée (`20251102_dashboard_minister_seed.sql`)
- [ ] 5 tables créées et visibles dans Supabase
- [ ] Données seed insérées (8 KPIs, 5 Alerts, 6 Decrets, 6 Objectifs, 9 Provinces)
- [ ] RLS policies activées
- [ ] Indexes créés
- [ ] Triggers `updated_at` fonctionnels
- [ ] Tests API réussis (curl)

---

## 🚀 APRÈS LES MIGRATIONS

Une fois les migrations exécutées avec succès :

1. **Redémarrer le serveur** :
```bash
npm run start
```

2. **Tester le dashboard** :
```
http://localhost:8080/gouv/dashboard
```

3. **Vérifier console** :
   - ✅ Aucune erreur 404
   - ✅ Données chargées depuis Supabase
   - ✅ Loading states fonctionnent

4. **Prochaine étape** : PROMPT 5 (Auth JWT)

---

## 📞 AIDE

Si problème avec les migrations :
1. Vérifier que vous êtes connecté à Supabase : `supabase link`
2. Consulter les logs : Supabase Dashboard → Logs
3. Exécuter manuellement via Studio (Méthode 1)
4. Vérifier les credentials dans `.env`

---

**RECOMMANDATION** : Utilisez **Supabase Studio (Méthode 1)** pour une exécution fiable ✅

