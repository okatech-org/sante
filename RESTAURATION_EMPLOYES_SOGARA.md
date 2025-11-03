# 👥 RESTAURATION DES EMPLOYÉS SOGARA - PATIENTS CMST

**Date**: Décembre 2024  
**Établissement**: CMST SOGARA (Centre de Médecine de Santé au Travail)  
**Type**: Restauration des comptes patients pour employés SOGARA

---

## 🎯 OBJECTIF

Restaurer les comptes patients pour les **8 employés SOGARA** ayant droit aux soins au Centre de Médecine de Santé au Travail (CMST) de SOGARA.

Ces employés ne sont **pas** du personnel médical, ce sont des **patients** bénéficiant d'un accès privilégié au CMST SOGARA dans le cadre de la médecine du travail.

---

## 👥 EMPLOYÉS CONCERNÉS

| # | Nom Complet | Email | Poste | Département |
|---|-------------|-------|-------|-------------|
| 1 | Pierrette NOMSI | pierrette.nomsi@sogara.ga | Chef QUALITÉ et CONFORMITÉ | Qualité |
| 2 | Christian AVARO | christian.avaro@sogara.ga | Directeur Général | Direction Générale |
| 3 | Ingride TCHEN | ingride.tchen@sogara.ga | Directrice Financière | Finance |
| 4 | Jean NZENGUE | jean.nzengue@sogara.ga | Chef Production | Production |
| 5 | Marie MOUSSAVOU | marie.moussavou@sogara.ga | Responsable HSE | Hygiène Sécurité Environnement |
| 6 | Paul OBAME | paul.obame@sogara.ga | Chef Maintenance | Maintenance |
| 7 | Alain MOUSSAVOU | alain.moussavou@sogara.ga | Technicien Raffinerie | Production |
| 8 | Sylvie MENGUE | sylvie.mengue@sogara.ga | Assistante RH | Ressources Humaines |

### 🔑 Informations de connexion communes

- **Domaine email**: `@sogara.ga`
- **Mot de passe**: `PatientSOGARA2024!`
- **Rôle**: `patient`
- **URL de connexion**: `/login/patient`

---

## 📋 FICHIER CRÉÉ

**`restore-sogara-employees-patients.sql`**
- Script SQL complet pour restaurer tous les comptes
- Idempotent (peut être exécuté plusieurs fois)
- Crée les comptes dans `auth.users` et `profiles`
- Assigne le rôle `patient` via `user_roles`

---

## 🚀 MÉTHODE D'EXÉCUTION

### Via Supabase Dashboard (RECOMMANDÉ)

1. **Ouvrir Supabase Dashboard**
   - Aller sur https://supabase.com/dashboard
   - Sélectionner le projet SANTE.GA

2. **Ouvrir l'éditeur SQL**
   - Menu latéral → "SQL Editor"
   - Cliquer sur "New query"

3. **Copier-coller le script**
   - Ouvrir `restore-sogara-employees-patients.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL

4. **Exécuter le script**
   - Cliquer sur "Run" ou `Ctrl+Enter` (Win/Linux) / `Cmd+Enter` (Mac)
   - Attendre la fin de l'exécution

5. **Vérifier les résultats**
   - Le script affichera la progression
   - Un tableau récapitulatif s'affichera à la fin

### Résultat attendu

```
🏥 RESTAURATION EMPLOYÉS SOGARA - PATIENTS CMST
════════════════════════════════════════════════════════

1️⃣ Restauration de Pierrette NOMSI...
   ✅ Pierrette NOMSI restaurée (Chef QUALITÉ)

2️⃣ Restauration de Christian AVARO...
   ✅ Christian AVARO restauré (Directeur Général)

3️⃣ Restauration d'Ingride TCHEN...
   ✅ Ingride TCHEN restaurée (Directrice Financière)

4️⃣ Restauration de Jean NZENGUE...
   ✅ Jean NZENGUE restauré (Chef Production)

5️⃣ Restauration de Marie MOUSSAVOU...
   ✅ Marie MOUSSAVOU restaurée (Responsable HSE)

6️⃣ Restauration de Paul OBAME...
   ✅ Paul OBAME restauré (Chef Maintenance)

7️⃣ Restauration d'Alain MOUSSAVOU...
   ✅ Alain MOUSSAVOU restauré (Technicien Raffinerie)

8️⃣ Restauration de Sylvie MENGUE...
   ✅ Sylvie MENGUE restaurée (Assistante RH)

════════════════════════════════════════════════════════
✨ RESTAURATION TERMINÉE AVEC SUCCÈS!
════════════════════════════════════════════════════════

📊 RÉSUMÉ:
   Total employés SOGARA patients: 8

👥 EMPLOYÉS RESTAURÉS:
   1. Pierrette NOMSI - Chef QUALITÉ
   2. Christian AVARO - Directeur Général
   3. Ingride TCHEN - Directrice Financière
   4. Jean NZENGUE - Chef Production
   5. Marie MOUSSAVOU - Responsable HSE
   6. Paul OBAME - Chef Maintenance
   7. Alain MOUSSAVOU - Technicien Raffinerie
   8. Sylvie MENGUE - Assistante RH

🔑 INFORMATIONS DE CONNEXION:
   Email: [prenom.nom]@sogara.ga
   Mot de passe: PatientSOGARA2024!
   URL: /login/patient

💡 CES EMPLOYÉS PEUVENT:
   ✅ Prendre rendez-vous au CMST SOGARA
   ✅ Accéder à leur dossier médical
   ✅ Consulter leurs résultats d'examens
   ✅ Gérer leurs prescriptions
   ✅ Bénéficier du suivi médical du travail
```

---

## ✅ VÉRIFICATION POST-RESTAURATION

### 1. Vérifier dans Supabase

```sql
-- Compter les employés SOGARA patients
SELECT COUNT(*) as "Total Employés SOGARA"
FROM auth.users au
JOIN public.user_roles ur ON ur.user_id = au.id
WHERE au.email LIKE '%@sogara.ga'
  AND au.email NOT LIKE 'directeur.sogara%'
  AND au.email NOT LIKE 'medecin%'
  AND au.email NOT LIKE 'infirmier%'
  AND au.email NOT LIKE 'admin.cmst%'
  AND ur.role = 'patient';
```

**Résultat attendu**: `8`

### 2. Lister tous les employés

```sql
SELECT 
  p.full_name AS "Nom",
  au.email AS "Email",
  (au.raw_user_meta_data->>'employee_position') AS "Poste",
  ur.role AS "Rôle"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
JOIN public.user_roles ur ON ur.user_id = au.id
WHERE au.email LIKE '%@sogara.ga'
  AND au.email NOT LIKE 'directeur.sogara%'
  AND au.email NOT LIKE 'medecin%'
  AND au.email NOT LIKE 'infirmier%'
  AND au.email NOT LIKE 'admin.cmst%'
ORDER BY p.full_name;
```

### 3. Tester la connexion

1. Aller sur http://localhost:8080/login/patient
2. Essayer de se connecter avec un compte :
   - Email : `pierrette.nomsi@sogara.ga`
   - Mot de passe : `PatientSOGARA2024!`
3. Vérifier l'accès au dashboard patient
4. Vérifier les fonctionnalités :
   - Mon profil
   - Dossier médical
   - Rendez-vous
   - Prescriptions

---

## 🏥 DIFFÉRENCE AVEC LE PERSONNEL CMST

### Personnel CMST (Professionnels de santé)

Ces comptes sont **différents** des employés SOGARA patients :

| Nom | Email | Rôle | Type |
|-----|-------|------|------|
| Dr. Jules DJEKI | directeur.sogara@sante.ga | director + doctor | Professionnel |
| Dr. Jean-Paul NZENZE | medecin.cmst@sogara.ga | doctor | Professionnel |
| Marie BOUNDA | infirmiere.cmst@sogara.ga | nurse | Professionnel |
| Paul OKANDZE | admin.cmst@sogara.ga | admin | Professionnel |

### Employés SOGARA (Patients)

Les 8 comptes restaurés sont des **patients** :
- Rôle : `patient`
- Accès : Dashboard patient
- Droits : Prendre RDV, consulter DMP, gérer ordonnances
- **Ne peuvent PAS** accéder aux interfaces professionnelles

---

## 📊 ARCHITECTURE DES COMPTES SOGARA

```
CMST SOGARA
│
├── 👨‍⚕️ PERSONNEL MÉDICAL (Professionnels)
│   ├── Dr. Jules DJEKI (Directeur + Médecin)
│   ├── Dr. Jean-Paul NZENZE (Médecin du Travail)
│   ├── Marie BOUNDA (Infirmière)
│   └── Paul OKANDZE (Administrateur)
│
└── 👥 EMPLOYÉS SOGARA (Patients)
    ├── Pierrette NOMSI (Chef QUALITÉ) ⭐ RESTAURÉ
    ├── Christian AVARO (Directeur Général) ⭐ RESTAURÉ
    ├── Ingride TCHEN (Directrice Financière) ⭐ RESTAURÉ
    ├── Jean NZENGUE (Chef Production) ⭐ RESTAURÉ
    ├── Marie MOUSSAVOU (Responsable HSE) ⭐ RESTAURÉ
    ├── Paul OBAME (Chef Maintenance) ⭐ RESTAURÉ
    ├── Alain MOUSSAVOU (Technicien Raffinerie) ⭐ RESTAURÉ
    └── Sylvie MENGUE (Assistante RH) ⭐ RESTAURÉ
```

---

## 💡 CAS D'USAGE

### Pour les employés SOGARA

1. **Visite médicale annuelle**
   - Prendre RDV avec Dr. NZENZE (Médecin du Travail)
   - Recevoir attestation d'aptitude
   - Consulter les résultats dans le DMP

2. **Urgence au travail**
   - Accéder à l'infirmerie CMST
   - Consultation avec infirmière ou médecin
   - Suivi dans le dossier médical

3. **Suivi maladie professionnelle**
   - Déclaration accident du travail
   - Consultations de suivi
   - Coordination avec CNSS

4. **Prévention et dépistage**
   - Campagnes de vaccination
   - Dépistages périodiques
   - Sensibilisation santé

---

## 🔧 MAINTENANCE

### Ajouter un nouvel employé SOGARA

Pour ajouter un nouvel employé :

1. Dupliquer un bloc existant dans le script
2. Modifier les informations :
   - Email : `nouveau.employe@sogara.ga`
   - Nom complet
   - Date de naissance
   - Téléphone
   - Poste
   - Département
   - Matricule (EMP-SOGARA-00XX)
3. Exécuter le script

### Supprimer un employé

```sql
-- Ne PAS supprimer, désactiver plutôt
UPDATE auth.users
SET email_confirmed_at = NULL,
    updated_at = NOW()
WHERE email = 'employe.a.supprimer@sogara.ga';
```

### Réinitialiser le mot de passe

```sql
UPDATE auth.users
SET encrypted_password = crypt('NouveauMotDePasse', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'employe@sogara.ga';
```

---

## 🔍 DÉPANNAGE

### Problème : "Compte déjà existant"

**Solution** : C'est normal, le script est idempotent
- Il met à jour les comptes existants
- Aucune action supplémentaire nécessaire

### Problème : "Email en conflit"

**Solution** : Vérifier si l'email existe déjà
```sql
SELECT email, id FROM auth.users WHERE email = 'employe@sogara.ga';
```

### Problème : "Impossible de se connecter"

**Solutions** :
1. Vérifier que l'email est confirmé : `email_confirmed_at` NOT NULL
2. Vérifier le mot de passe : `PatientSOGARA2024!`
3. Vérifier le rôle dans `user_roles`
4. Vérifier le profil dans `profiles`

---

## 📞 SUPPORT

Pour toute question ou problème :
1. Vérifier les logs du script
2. Consulter la base de données Supabase
3. Tester la connexion manuellement
4. Vérifier les rôles et permissions

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 1.0

