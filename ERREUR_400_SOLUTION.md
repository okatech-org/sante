# 🔧 Solution pour l'erreur 400 d'authentification

## 🎯 Problème identifié

L'erreur `400 Bad Request` sur `/auth/v1/token` indique que vous essayez de vous connecter avec des identifiants incorrects ou inexistants.

## ✅ Compte Patient de Test Disponible

Un compte patient existe déjà dans votre base de données :

```
Email: pierrette.nomsi@gmail.com
Mot de passe: Nomsi@Patient2024
```

### 🔗 URL de connexion
- **Espace Patient**: http://localhost:5173/login/patient

## 📋 Instructions pour tester

### 1. Démarrer l'application (si ce n'est pas déjà fait)

```bash
npm run dev
```

### 2. Se connecter avec le compte patient

1. Ouvrez votre navigateur sur: http://localhost:5173/login/patient
2. Entrez:
   - **Email**: `pierrette.nomsi@gmail.com`
   - **Mot de passe**: `Nomsi@Patient2024`
3. Cliquez sur "Se connecter"

### 3. Si l'erreur 400 persiste

Cela peut signifier:

#### A. Le compte n'est pas confirmé par email
- Vérifiez votre boîte email (pierrette.nomsi@gmail.com)
- Cherchez un email de confirmation de Supabase
- Cliquez sur le lien de confirmation

#### B. Le compte n'existe pas vraiment
Recréez-le en exécutant:

```bash
node create-pierrette-patient.js
```

#### C. Problème de configuration Supabase

Vérifiez que:
1. ✅ Supabase est bien configuré (`.env` contient les bonnes clés)
2. ✅ La confirmation par email est désactivée (pour le développement)
3. ✅ Les politiques RLS permettent la création de comptes

## 🔍 Diagnostic avancé

### Vérifier l'état de la base de données

```bash
node check-users.js
```

### Créer d'autres comptes de test

#### Compte Super Admin
```bash
node add-superadmin.js votre-email@example.com
```

#### Comptes SOGARA
```bash
node add-sogara-users.js
```

## 🐛 Désactiver la confirmation par email (développement)

Pour le développement local, vous pouvez désactiver la confirmation par email dans Supabase:

1. Allez sur https://supabase.com/dashboard
2. Ouvrez votre projet
3. Allez dans **Authentication** > **Providers** > **Email**
4. Décochez "**Enable email confirmations**"
5. Sauvegardez

## 📝 Message d'erreur exact

```
bolidzesitkkfojdyuyg.supabase.co/auth/v1/token?grant_type=password:1
Failed to load resource: the server responded with a status of 400 ()
```

Cette erreur signifie que Supabase rejette les identifiants fournis. Les causes les plus courantes sont:

1. ❌ **Email ou mot de passe incorrect**
2. ❌ **Compte non confirmé**
3. ❌ **Utilisateur n'existant pas**
4. ❌ **Compte désactivé**

## 🆘 Besoin d'aide ?

Si le problème persiste:

1. Ouvrez la console du navigateur (F12)
2. Regardez l'onglet **Network**
3. Cherchez la requête vers `/auth/v1/token`
4. Vérifiez les détails de l'erreur
5. Partagez le message d'erreur complet

---

💡 **Astuce**: Pour le développement, créez toujours vos comptes avec la confirmation email désactivée dans Supabase.

