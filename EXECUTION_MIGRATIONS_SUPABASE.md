# 🚀 Exécution des Migrations dans Supabase

## 📍 Informations du Projet

- **Project ID** : `bolidzesitkkfojdyuyg`
- **URL** : `https://bolidzesitkkfojdyuyg.supabase.co`
- **Dashboard** : [https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg](https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg)

---

## ⚡ Option 1 : Via Supabase Dashboard (RECOMMANDÉ)

### Étapes :

1. **Accédez au SQL Editor**
   ```
   https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/sql
   ```

2. **Exécutez les migrations dans l'ordre**

#### Migration 1 : Tables Multi-Établissements
```sql
-- Copiez le contenu de :
-- supabase/migrations/20251030_multi_establishments.sql
```

#### Migration 2 : Système Invitations
```sql
-- Copiez le contenu de :
-- supabase/migrations/20251030_invitations_requests.sql
```

#### Migration 3 : Activation Complète
```sql
-- Copiez le contenu de :
-- supabase/activate-multi-establishments-complete.sql
```

3. **Vérification**
   - Onglet "Table Editor" pour voir les nouvelles tables
   - Vérifier que `professionals` contient Dr. DJEKI
   - Vérifier que `establishment_staff` a 2 entrées pour DJEKI

---

## 🎯 Option 2 : Script Automatisé

### Installation Supabase CLI
```bash
# Installation globale
npm install -g supabase

# Vérification
supabase --version
```

### Configuration
```bash
# Login (ouvre le navigateur)
supabase login

# Lier au projet
supabase link --project-ref bolidzesitkkfojdyuyg

# Créer le fichier de config
supabase init
```

### Exécution des Migrations
```bash
# Push toutes les migrations
supabase db push

# Ou exécuter un fichier spécifique
supabase db push --file supabase/activate-multi-establishments-complete.sql
```

---

## 💻 Option 3 : Via Lovable Cloud

Si vous utilisez Lovable Cloud :

1. **Accédez à votre projet**
2. **Database > SQL Editor**
3. **Copiez-collez les migrations**
4. **Exécutez dans l'ordre**

---

## 🧪 Test Rapide

### Vérifier l'Installation
```sql
-- Dans SQL Editor, exécutez :
SELECT 
  p.full_name,
  p.email,
  es.role,
  es.position,
  e.name as establishment
FROM professionals p
JOIN establishment_staff es ON es.professional_id = p.id
JOIN establishments e ON e.id = es.establishment_id
WHERE p.email = 'directeur.sogara@sante.ga';
```

### Résultat Attendu
```
Dr. Jules DJEKI | directeur.sogara@sante.ga | director | Directeur Médical | CMST SOGARA
Dr. Jules DJEKI | directeur.sogara@sante.ga | doctor | Médecin Consultant | CMST SOGARA
```

---

## ✅ Validation Complète

### 1. Tables à Vérifier
- [ ] `professionals` - Doit contenir tous les professionnels SOGARA
- [ ] `establishments` - Doit avoir CMST SOGARA + CHU + Clinique
- [ ] `establishment_staff` - Liens professionnels ↔ établissements
- [ ] `establishment_departments` - 11 départements pour SOGARA
- [ ] `establishment_invitations` - Invitation CHU pour Dr. DJEKI
- [ ] `role_permissions` - Permissions par rôle

### 2. Test de Connexion
```
Email    : directeur.sogara@sante.ga
Password : DirecteurSOGARA2024!
```

### 3. Vérifications dans l'App
- [ ] Menu "ÉTABLISSEMENTS" visible
- [ ] Double badge pour Dr. DJEKI
- [ ] Dashboard SOGARA accessible
- [ ] Invitation CHU visible

---

## 🔍 Dépannage

### Erreur : "Table already exists"
→ Les tables existent déjà, exécutez seulement `activate-multi-establishments-complete.sql`

### Erreur : "Permission denied"
→ Utilisez le service_role key, pas l'anon key

### Erreur : "User not found"
→ Vérifiez que les comptes SOGARA existent dans Auth > Users

---

## 📋 Commande Complète pour SQL Editor

Pour une exécution rapide, voici le fichier complet à exécuter :

```sql
-- TOUT EN UN : Copier tout le contenu de
-- supabase/activate-multi-establishments-complete.sql
-- 
-- Ce fichier contient :
-- ✅ Création des tables
-- ✅ Configuration Dr. DJEKI (2 rôles)
-- ✅ Tous les professionnels SOGARA
-- ✅ Établissements de test
-- ✅ Invitations
-- ✅ Modules activés
```

---

## 🎉 Confirmation de Succès

L'activation est réussie quand :

1. **Dans Supabase Dashboard**
   - Table `professionals` : 12+ entrées
   - Table `establishment_staff` : 13+ entrées
   - Table `establishments` : 3+ entrées

2. **Dans l'Application**
   - Dr. DJEKI voit 2 badges
   - Menu "Établissements" présent
   - Dashboard SOGARA accessible

---

*Utilisez votre projet Supabase : `bolidzesitkkfojdyuyg`*
