# 🔧 Guide : Corriger le Rôle du Ministre

## 📋 Résumé du Problème

Le compte `ministre@sante.gouv.ga` existe mais n'a pas de rôle professionnel assigné, ce qui empêche la connexion à l'espace professionnel.

**Erreur rencontrée** : "Accès refusé - Cet espace est réservé aux professionnels de santé"

---

## ✅ Solution Créée

J'ai créé **3 solutions** pour corriger ce problème :

### 🌐 Solution 1 : Via Page Web (RECOMMANDÉ)

**Étapes** :

1. Déployez d'abord l'edge function (voir section ci-dessous)
2. Ouvrez : **http://localhost:5173/fix-minister-role**
3. Cliquez sur **"Corriger le Rôle"**
4. Une fois terminé, connectez-vous sur `/login/professional`

**Avantages** :
- ✅ Interface graphique simple
- ✅ Résultat immédiat visible
- ✅ Affiche les identifiants de connexion

---

### 🗄️ Solution 2 : Via SQL Editor

**Étapes** :

1. Allez sur : https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/sql/new

2. Copiez et exécutez le fichier `fix-minister-role.sql` :

```sql
DO $$
DECLARE
  ministre_user_id UUID;
BEGIN
  SELECT id INTO ministre_user_id
  FROM auth.users
  WHERE email = 'ministre@sante.gouv.ga';

  IF ministre_user_id IS NOT NULL THEN
    -- Ajouter le rôle moderator
    INSERT INTO user_roles (user_id, role)
    VALUES (ministre_user_id, 'moderator')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Créer le profil
    INSERT INTO profiles (id, full_name, user_type)
    VALUES (ministre_user_id, 'Pr. Adrien MOUGOUGOU', 'professional')
    ON CONFLICT (id) DO UPDATE SET
      full_name = 'Pr. Adrien MOUGOUGOU',
      user_type = 'professional';

    RAISE NOTICE '✅ Rôle ajouté avec succès!';
  END IF;
END $$;
```

3. Cliquez sur **"Run"**

**Avantages** :
- ✅ Rapide (30 secondes)
- ✅ Ne nécessite pas de déploiement d'edge function

---

### 💻 Solution 3 : Via Script Node.js

**Prérequis** : Service Role Key nécessaire

**Étapes** :

1. Ajoutez la Service Role Key dans `.env.local` :
```bash
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ici
```

2. Exécutez le script :
```bash
node create-minister-now.js
```

---

## 🚀 Déploiement de l'Edge Function

Pour utiliser la **Solution 1** (page web), vous devez déployer l'edge function :

### Option A : Via Supabase CLI

```bash
# Installer Supabase CLI si ce n'est pas déjà fait
npm install -g supabase

# Se connecter
supabase login

# Lier au projet
supabase link --project-ref bolidzesitkkfojdyuyg

# Déployer la fonction
supabase functions deploy fix-minister-role
```

### Option B : Via Dashboard Supabase

1. Allez sur : https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/functions
2. Cliquez sur **"New Function"**
3. Nom : `fix-minister-role`
4. Copiez le code depuis `supabase/functions/fix-minister-role/index.ts`
5. Cliquez sur **"Deploy"**

---

## 🔑 Après Correction

Une fois le rôle corrigé, vous pouvez vous connecter avec :

```
📧 Email: ministre@sante.gouv.ga
🔒 Mot de passe: MinistryGab2025!
🌐 URL: http://localhost:5173/login/professional
```

---

## 📁 Fichiers Créés

```
/Users/okatech/sante/
├── supabase/
│   ├── config.toml                              # ✅ Configuration mise à jour
│   └── functions/
│       └── fix-minister-role/
│           └── index.ts                         # 🆕 Edge function
├── src/
│   ├── App.tsx                                  # ✅ Route ajoutée
│   └── pages/
│       └── FixMinisterRole.tsx                  # 🆕 Page web
├── create-minister-now.js                        # 🆕 Script Node.js
└── fix-minister-role.sql                         # 🆕 Script SQL
```

---

## 🎯 Quelle Solution Choisir ?

| Solution | Rapidité | Complexité | Recommandation |
|----------|----------|------------|----------------|
| **SQL Editor** | ⚡⚡⚡ 30s | ⭐ Facile | ✅ **MEILLEURE** pour correction rapide |
| **Page Web** | ⚡⚡ 2min | ⭐⭐ Moyen | ✅ Bonne avec interface graphique |
| **Script Node** | ⚡ 5min | ⭐⭐⭐ Avancé | ⚠️ Nécessite Service Role Key |

---

## 🐛 Dépannage

### L'edge function ne fonctionne pas
- Vérifiez qu'elle est bien déployée sur Supabase
- Vérifiez que `verify_jwt = false` dans `supabase/config.toml`

### Le rôle n'est toujours pas ajouté
- Vérifiez que le compte existe : https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users
- Vérifiez la table `user_roles` dans l'éditeur de table

### Erreur "Invalid login credentials"
- Le compte n'existe pas encore
- Créez-le via : https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users

---

## ✅ Vérification Finale

Après avoir appliqué la correction, vérifiez dans Supabase :

1. **Table `auth.users`** : 
   - Email : `ministre@sante.gouv.ga`
   - Email confirmé : ✅ Oui

2. **Table `user_roles`** :
   - user_id : (ID du ministre)
   - role : `moderator`

3. **Table `profiles`** :
   - id : (ID du ministre)
   - full_name : `Pr. Adrien MOUGOUGOU`
   - user_type : `professional`

---

**🎉 Une fois corrigé, le ministre pourra se connecter à l'espace professionnel !**

