# 🚀 Guide Rapide - Création du Compte Nadège Oyono

## ⚡ Instructions en 3 Étapes

### Étape 1️⃣ : Ouvrir Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez le projet **SANTE.GA** (bolidzesitkkfojdyuyg)

### Étape 2️⃣ : Ouvrir l'Éditeur SQL
1. Dans le menu latéral gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New Query"**

### Étape 3️⃣ : Exécuter le Script
1. Ouvrez le fichier `create-nadege-oyono-receptionniste.sql`
2. Copiez tout le contenu du fichier
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur le bouton **"Run"** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)

---

## ✅ Vérification du Résultat

Après l'exécution, vous devriez voir un tableau avec ces informations :

| Colonne | Valeur |
|---------|--------|
| email | accueil.sogara@sante.ga |
| full_name | Nadège Oyono |
| category | receptionist |
| matricule | REC-002 |
| role | receptionist |
| position | Réceptionniste |
| department | Accueil |
| establishment | Centre Médical de Santé au Travail SOGARA |
| status | active |

---

## 🧪 Test de Connexion

### Connexion au Portail Professionnel
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:8080/login/professional`
3. Entrez les identifiants :
   - **Email** : `accueil.sogara@sante.ga`
   - **Mot de passe** : `AccueilSOGARA@24`
4. Cliquez sur **"Se connecter"**

### Résultat Attendu
- ✅ Connexion réussie
- ✅ Redirection vers le dashboard SOGARA
- ✅ Affichage du nom "Nadège Oyono"
- ✅ Menu avec les options : Rendez-vous, Patients, Consultations

---

## 📋 Informations du Compte

```
┌─────────────────────────────────────────────────┐
│  NADÈGE OYONO - RÉCEPTIONNISTE SOGARA          │
├─────────────────────────────────────────────────┤
│  📧 Email      : accueil.sogara@sante.ga       │
│  🔐 Password   : AccueilSOGARA@24              │
│  👤 Nom        : Nadège Oyono                   │
│  💼 Rôle       : Réceptionniste / Accueil      │
│  🏥 Hôpital    : Centre Médical SOGARA         │
│  🏢 Département: Accueil                        │
│  🔢 Matricule  : REC-002                        │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Permissions du Rôle

### ✅ Permissions Accordées
- **Rendez-vous** : Voir, Ajouter, Modifier
- **Patients** : Voir (lecture seule)
- **Consultations** : Voir (lecture seule)

### ❌ Restrictions
- Pas d'accès à la modification des dossiers médicaux
- Pas d'accès aux prescriptions
- Pas d'accès à la gestion du personnel
- Pas d'accès aux fonctions d'administration

---

## 🐛 Résolution des Problèmes

### Problème 1 : "Email already exists"
**Solution** : L'utilisateur existe déjà. Utilisez la requête SQL suivante pour réinitialiser le mot de passe :
```sql
UPDATE auth.users
SET encrypted_password = crypt('AccueilSOGARA@24', gen_salt('bf'))
WHERE email = 'accueil.sogara@sante.ga';
```

### Problème 2 : "Cannot login"
**Solution** : Vérifiez que l'email est confirmé :
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'accueil.sogara@sante.ga';
```

### Problème 3 : "Access denied to dashboard"
**Solution** : Vérifiez que le profil professionnel et l'affectation existent :
```sql
SELECT 
  u.email,
  p.id as professional_id,
  es.id as staff_id
FROM auth.users u
LEFT JOIN professionals p ON p.user_id = u.id
LEFT JOIN establishment_staff es ON es.professional_id = p.id
WHERE u.email = 'accueil.sogara@sante.ga';
```

---

## 📞 Support

En cas de problème, consultez :
- `IMPLEMENTATION_NADEGE_OYONO_RECEPTIONNISTE.md` - Documentation complète
- `SOGARA_ALL_ACCOUNTS_SUMMARY.md` - Liste de tous les comptes
- Contact Support : admin@sante.ga

---

## 🎉 Félicitations !

Une fois le script exécuté avec succès, le compte de **Nadège Oyono** sera opérationnel et prêt à être utilisé pour la gestion de l'accueil au Centre Médical SOGARA.

---

**📅 Date de création** : 31 octobre 2024  
**✅ Status** : Prêt pour l'implémentation

