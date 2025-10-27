# 🔐 Scripts d'Administration SANTE.GA

## Configuration initiale

### 1. Créer le fichier .env.local

```bash
cp .env.local.example .env.local
```

Puis éditez `.env.local` avec vos vraies clés:

```env
SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sbp_95bc4523d2fb581aa170face59cf1fb261bca08f
```

**⚠️ CRITIQUE:** Ne JAMAIS commiter `.env.local` dans Git! (déjà dans .gitignore)

### 2. Installer les dépendances

```bash
npm install dotenv @supabase/supabase-js
```

## Scripts disponibles

### Ajouter un Super Admin

```bash
node add-superadmin.js votre-email@example.com
```

Ce script:
1. ✅ Cherche l'utilisateur par email dans auth.users
2. ✅ Vérifie si le rôle existe déjà
3. ✅ Insère le rôle `super_admin` dans user_roles
4. ✅ Confirme le succès

### Vérifier les rôles d'un utilisateur

```bash
node scripts/check-roles.js votre-email@example.com
```

### Lister tous les super admins

```bash
node scripts/list-admins.js
```

## Accès Supabase CLI

### Installation

```bash
npm install -g supabase
```

### Login et link

```bash
# Login
supabase login

# Lier le projet
supabase link --project-ref bolidzesitkkfojdyuyg
```

### Commandes utiles

```bash
# Dump de la DB
supabase db dump -f backup.sql

# Exécuter SQL
supabase db execute --file migration.sql

# Générer types TypeScript
supabase gen types typescript --local > src/types/database.ts

# Logs Edge Functions
supabase functions logs nom-fonction

# Deploy Edge Function
supabase functions deploy nom-fonction
```

## Accès direct PostgreSQL

### Via psql

```bash
psql "postgresql://postgres.bolidzesitkkfojdyuyg:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

### Via Node.js

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Query directe
const { data, error } = await supabase
  .from('user_roles')
  .select('*')
  .eq('role', 'super_admin');
```

## Sécurité

### Service Role Key

- ✅ **Bypass RLS**: Accès total à toutes les tables
- ⚠️ **Dangereuse**: Ne jamais exposer côté client
- 🔒 **Usage**: Scripts admin, migrations, Edge Functions
- 📝 **Stockage**: Uniquement dans .env.local (jamais Git)

### Anon Key

- ✅ **Respecte RLS**: Limitée aux policies
- ✅ **Sûre**: Peut être exposée côté client
- 🔒 **Usage**: Frontend, mobile apps
- 📝 **Stockage**: .env, safe to commit

## Troubleshooting

### Erreur "Variables manquantes"

```bash
# Vérifier que .env.local existe
ls -la .env.local

# Vérifier le contenu
cat .env.local
```

### Erreur "Utilisateur non trouvé"

L'email doit correspondre EXACTEMENT à celui utilisé lors de l'inscription.

```bash
# Lister tous les utilisateurs
node scripts/list-users.js
```

### Erreur "Permission denied"

Vérifiez que vous utilisez bien la SERVICE_ROLE_KEY et pas l'ANON_KEY.

## Package.json manquant

Ajoutez dans `package.json` sous `scripts`:

```json
{
  "scripts": {
    "build:dev": "vite build --mode development"
  }
}
```
