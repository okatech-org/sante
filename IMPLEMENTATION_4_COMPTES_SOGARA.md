# ✅ IMPLÉMENTATION DES 4 COMPTES SOGARA

## 🎯 Objectif
Créer 4 comptes utilisateurs prioritaires pour CMST SOGARA dans la base de données Supabase.

## 📋 Comptes à créer

| Nom | Email | Mot de passe | Rôle | Département | Matricule |
|-----|-------|--------------|------|-------------|-----------|
| Jean-Pierre Mbadinga | admin@sogara.com | Admin@SOGARA2024 | Administrateur | Administration | ADM-001 |
| Dr. François Obiang | directeur@sogara.com | DirecteurSOGARA2024! | Administrateur | Direction Médicale | DIR-001 |
| Dr. Marie Okemba | dr.okemba@sogara.com | Okemba@2024Med | Médecin | Médecine Générale | MED-012 |
| Dr. Paul Nguema | dr.nguema@sogara.com | Nguema@Urgence24 | Médecin | Urgences | MED-015 |

---

## 🚀 MÉTHODE 1 : SQL Direct (Recommandé - 2 minutes)

### Étape 1 : Ouvrir Supabase
1. Allez sur : **https://app.supabase.com**
2. Sélectionnez votre projet : **bolidzesitkkfojdyuyg**

### Étape 2 : Exécuter le SQL
1. Cliquez sur **SQL Editor** dans le menu gauche
2. Cliquez sur **New query**
3. Ouvrez le fichier **`create-4-sogara-accounts.sql`**
4. Copiez TOUT le contenu
5. Collez dans l'éditeur SQL
6. Cliquez sur **Run** (ou `Ctrl + Enter`)

### Étape 3 : Vérifier le résultat
Vous devriez voir un tableau avec 4 lignes :

```
👤 Nom Complet          | 📧 Email                  | 🎭 Rôle    | 🆔 Matricule | 🏥 Département       | 📊 Statut
------------------------|---------------------------|------------|--------------|---------------------|----------
Jean-Pierre Mbadinga    | admin@sogara.com          | hospital   | ADM-001      | Administration      | ✅ Actif
Dr. François Obiang     | directeur@sogara.com      | hospital   | DIR-001      | Direction Médicale  | ✅ Actif
Dr. Marie Okemba        | dr.okemba@sogara.com      | doctor     | MED-012      | Médecine Générale   | ✅ Actif
Dr. Paul Nguema         | dr.nguema@sogara.com      | doctor     | MED-015      | Urgences            | ✅ Actif
```

---

## ✅ TESTER LA CONNEXION

### Test 1 : Administrateur
1. Allez sur : **http://localhost:8080/login/professional**
2. Email : `admin@sogara.com`
3. Password : `Admin@SOGARA2024`
4. Cliquez sur **Se connecter**

**Résultat attendu** : 
- ✅ Connexion réussie
- ✅ Redirection vers `/professional/select-establishment`
- ✅ Accès au dashboard professionnel

### Test 2 : Médecin
1. Allez sur : **http://localhost:8080/login/professional**
2. Email : `dr.okemba@sogara.com`
3. Password : `Okemba@2024Med`
4. Cliquez sur **Se connecter**

**Résultat attendu** : 
- ✅ Connexion réussie
- ✅ Redirection vers `/professional/select-establishment`
- ✅ Accès au dashboard professionnel

---

## 🔍 VÉRIFICATION MANUELLE

Si vous voulez vérifier manuellement que les comptes existent :

### Dans Supabase Console
1. **Authentication** > **Users**
2. Vous devriez voir les 4 emails
3. Chaque compte doit avoir :
   - Status : **Confirmed** (✅)
   - Email Confirmed : **Yes**

### Vérification SQL
Exécutez cette requête dans SQL Editor :

```sql
-- Vérifier les comptes SOGARA
SELECT 
  au.email,
  p.full_name,
  ur.role,
  prof.professional_type,
  prof.numero_ordre
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
LEFT JOIN user_roles ur ON ur.user_id = au.id
LEFT JOIN professionals prof ON prof.user_id = au.id
WHERE au.email LIKE '%sogara.com'
ORDER BY au.email;
```

---

## 🛠️ DÉPANNAGE

### Erreur : "Invalid login credentials"
**Cause** : Le compte n'existe pas encore dans Supabase

**Solution** : 
1. Vérifiez que vous avez bien exécuté le SQL complet
2. Allez dans Authentication > Users pour vérifier
3. Si le compte n'apparaît pas, réexécutez le SQL

### Erreur : "Accès refusé - Espace réservé aux professionnels"
**Cause** : Le rôle n'est pas correctement assigné

**Solution** :
```sql
-- Vérifier les rôles
SELECT user_id, role FROM user_roles 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@sogara.com'
);

-- Si aucun rôle, l'assigner
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@sogara.com'),
  'hospital'
);
```

### Erreur : "Cannot read properties of null"
**Cause** : Le profil n'existe pas dans la table `profiles`

**Solution** :
```sql
-- Créer le profil manquant
INSERT INTO profiles (id, full_name, email)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@sogara.com'),
  'Jean-Pierre Mbadinga',
  'admin@sogara.com'
);
```

---

## 📱 PROCHAINES ÉTAPES

Une fois ces 4 comptes fonctionnels :

1. **Testez chaque compte** pour valider la connexion
2. **Créez les 8 autres comptes** avec le même processus
3. **Configurez les permissions** d'établissement si nécessaire
4. **Partagez les identifiants** avec les utilisateurs concernés

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :
1. Vérifiez les logs de Supabase (SQL Editor > Logs)
2. Exécutez le script de test : `node test-sogara-login.js`
3. Consultez le fichier `CREATION_RAPIDE_SOGARA.md`
