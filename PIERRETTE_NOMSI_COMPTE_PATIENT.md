# 👤 COMPTE PATIENT - PIERRETTE NOMSI

## ✅ INFORMATIONS DE CONNEXION

### Compte Patient Unique
- **Email** : `pierrette.nomsi@gmail.com`
- **Mot de passe** : `Nomsi@Patient2024`
- **Type** : Patient
- **URL Connexion** : `http://localhost:8080/login/patient`

---

## 👔 PROFIL EMPLOYÉ SOGARA

Pierrette NOMSI est **employée SOGARA**, pas professionnelle de santé :
- **Poste** : Chef QUALITÉ et CONFORMITÉ
- **Matricule** : EMP-SOGARA-0006
- **Département** : Qualité
- **Date d'embauche** : 12/04/2016
- **Statut** : Actif

### Avantages
En tant qu'employée SOGARA, elle bénéficie :
- ✅ Accès privilégié au CMST SOGARA
- ✅ Consultations gratuites/tarif préférentiel
- ✅ Examens médicaux périodiques
- ✅ Suivi médical du travail
- ✅ 3 ayants droit couverts

---

## 📋 HISTORIQUE MÉDICAL

### Consultations (4)
1. **15/03/2024** - Dr. Jean-Marc OBIANG (Cabinet Médical du Centre)
   - Diagnostic : Surmenage professionnel
   - Prescription : Repos, vitamines B12

2. **10/06/2024** - Dr. Marie OKEMBA (CMST SOGARA)
   - Visite médicale annuelle
   - Résultat : Apte au travail

3. **18/09/2024** - Dr. Paul NGUEMA (Urgences CMST SOGARA)
   - Diagnostic : Migraine de tension
   - Prescription : Paracétamol 1g, repos

4. **18/10/2024** - Dr. Marie OKEMBA (CMST SOGARA)
   - Suivi hypertension
   - TA : 13/8 (contrôlée)

### Examens Complémentaires
1. **20/05/2024** - Radiographie Thoracique
   - Centre d'Imagerie Médicale de Port-Gentil
   - Dr. Sylvie MENGUE
   - Résultat : Normal

2. **10/06/2024** - Bilan Sanguin Complet
   - Laboratoire CMST SOGARA
   - Résultats :
     - Hémoglobine : 13.5 g/dL ✅
     - Glycémie : 0.95 g/L ✅
     - Cholestérol : 1.85 g/L ✅
     - Créatinine : 8 mg/L ✅

### Informations Médicales
- **Groupe sanguin** : O+
- **Allergies** : Pénicilline
- **Conditions chroniques** : Hypertension légère
- **Traitement actuel** : Amlodipine 5mg - 1x/jour
- **Contact urgence** : Jean NOMSI (Époux) - +241 07 45 67 90

### Prochain RDV
- **Date** : 18/01/2025 à 10h00
- **Médecin** : Dr. Marie OKEMBA
- **Motif** : Suivi hypertension
- **Lieu** : CMST SOGARA

---

## 🔧 CRÉATION DU COMPTE DANS SUPABASE

### ⚠️ MÉTHODE OBLIGATOIRE (2 étapes)

#### Étape 1 : Créer l'utilisateur (Dashboard)
1. Ouvrir **https://app.supabase.com**
2. Aller dans **Authentication > Users**
3. Cliquer **"Add User"**
4. Remplir :
   - Email : `pierrette.nomsi@gmail.com`
   - Password : `Nomsi@Patient2024`
   - ✅ **IMPORTANT** : Cocher "Auto Confirm User"
5. Cliquer **"Create User"**

#### Étape 2 : Configurer le profil et les rôles (SQL)

1. Aller dans **SQL Editor > New Query**
2. Copier et exécuter le script **`create-pierrette-nomsi-accounts.sql`**

Ou copier/coller ce SQL :
```sql
DO $$
DECLARE v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'pierrette.nomsi@gmail.com';
  
  INSERT INTO public.profiles (id, full_name, email, phone, date_of_birth, gender, city)
  VALUES (v_user_id, 'Pierrette NOMSI', 'pierrette.nomsi@gmail.com', 
          '+241 07 45 67 89', '1985-04-15', 'female', 'Port-Gentil')
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT DO NOTHING;
END $$;
```

---

## ✅ TEST

Une fois le compte créé :
1. Aller sur : `http://localhost:8080/login/patient`
2. Email : `pierrette.nomsi@gmail.com`
3. Mot de passe : `Nomsi@Patient2024`
4. Accès à :
   - Dossier médical complet
   - Historique consultations
   - Résultats d'analyses
   - Rendez-vous futurs
   - Ordonnances

---

## 📊 DISTINCTION IMPORTANTE

| Aspect | Pierrette NOMSI |
|--------|----------------|
| **Rôle SOGARA** | Employée (Chef QUALITÉ) ✅ |
| **Professionnelle de santé** | ❌ NON |
| **Compte professionnel** | ❌ Aucun |
| **Compte patient** | ✅ OUI |
| **Accès CMST** | En tant que patiente/employée |
| **Base RH** | Liste employés SOGARA |

Les **8 employés SOGARA** (Direction/Cadres) ne sont pas des professionnels de santé.
Seuls les **12 comptes médicaux** (médecins, infirmiers, etc.) ont accès `/login/professional`.

---

**Fichier SQL** : `create-pierrette-nomsi-accounts.sql`  
**Page Admin** : `http://localhost:8080/admin/credentials` (compte visible sous "Patients")
