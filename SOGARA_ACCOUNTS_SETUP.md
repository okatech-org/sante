# 🏥 GUIDE DE CRÉATION DES COMPTES CMST SOGARA

## 📋 12 Comptes à Créer

### Administrateurs (2)
- Jean-Pierre Mbadinga - admin@sogara.com / Admin@SOGARA2024
- Dr. François Obiang - directeur@sogara.com / DirecteurSOGARA2024!

### Médecins (4)
- Dr. Marie Okemba - dr.okemba@sogara.com / Okemba@2024Med
- Dr. Paul Nguema - dr.nguema@sogara.com / Nguema@Urgence24
- Dr. Léa Mbina - dr.mbina@sogara.com / Mbina@Cardio2024
- Dr. Thomas Mezui - dr.mezui@sogara.com / Mezui@Pediatrie24

### Infirmiers (3)
- Sylvie Mba - nurse.mba@sogara.com / MbaSI@2024
- Patricia Nze - nurse.nze@sogara.com / NzeUrg@2024
- Claire Andeme - nurse.andeme@sogara.com / Andeme@Mat2024

### Autres (3)
- André Moussavou - lab.tech@sogara.com / LabSOGARA@2024
- Dr. Lydie Kombila - pharma@sogara.com / PharmaSOGARA@24
- Nadège Oyono - accueil@sogara.com / AccueilSOGARA@24

## 🚀 Méthode 1 : Via Supabase Console (Recommandé)

1. **Ouvrir la console Supabase**
   - Aller sur https://app.supabase.com
   - Se connecter à votre projet

2. **Accéder au SQL Editor**
   - Dans le menu gauche, cliquer sur "SQL Editor"
   - Cliquer sur "New query"

3. **Exécuter le script SQL**
   - Copier tout le contenu du fichier `supabase/create-sogara-accounts.sql`
   - Coller dans l'éditeur
   - Cliquer sur "Run"

4. **Vérifier les résultats**
   - Le script affichera un tableau avec tous les comptes créés
   - Vérifier qu'il y a bien 12 lignes

## 🛠️ Méthode 2 : Via Script JavaScript

1. **Obtenir l'URL de votre projet**
   - Dans Supabase Console > Settings > API
   - Copier l'URL (format: https://xxxxx.supabase.co)

2. **Modifier le script**
   ```bash
   # Ouvrir le fichier
   code create-sogara-accounts-direct.js
   
   # Remplacer la ligne 6:
   const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
   # Par votre vraie URL
   ```

3. **Exécuter**
   ```bash
   node create-sogara-accounts-direct.js
   ```

## ✅ Test de Connexion

1. **Accéder à la page de connexion**
   ```
   http://localhost:8080/login/professional
   ```

2. **Tester avec un compte admin**
   - Email: admin@sogara.com
   - Password: Admin@SOGARA2024

3. **Tester avec un compte médecin**
   - Email: dr.okemba@sogara.com
   - Password: Okemba@2024Med

## 🔍 Vérification dans la Base de Données

```sql
-- Voir tous les comptes SOGARA
SELECT 
  p.full_name,
  au.email,
  ur.role,
  p.phone as matricule
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
WHERE au.email LIKE '%sogara.com%'
ORDER BY au.email;
```

## ⚠️ Dépannage

### Si la connexion échoue :

1. **Vérifier que le compte existe**
   - Aller dans Supabase Console > Authentication > Users
   - Chercher l'email

2. **Réinitialiser le mot de passe**
   ```sql
   -- Dans SQL Editor
   UPDATE auth.users 
   SET encrypted_password = crypt('NouveauMotDePasse123!', gen_salt('bf'))
   WHERE email = 'email@sogara.com';
   ```

3. **Vérifier le rôle**
   ```sql
   SELECT * FROM user_roles 
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'email@sogara.com');
   ```

## 📱 Accès aux Fonctionnalités

### Pour les Administrateurs (admin@sogara.com, directeur@sogara.com)
- ✅ Dashboard professionnel
- ✅ Gestion de l'établissement
- ✅ Vue des statistiques
- ✅ Gestion du personnel

### Pour les Médecins (dr.*.sogara.com)
- ✅ Dashboard professionnel
- ✅ Gestion des patients
- ✅ Consultations
- ✅ Prescriptions

### Pour le Personnel Médical
- ✅ Dashboard professionnel
- ✅ Accès selon leur fonction
- ✅ Gestion des tâches quotidiennes
