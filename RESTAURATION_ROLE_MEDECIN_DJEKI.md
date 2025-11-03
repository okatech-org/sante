# 🔧 RESTAURATION RÔLE MÉDECIN - DR. JULES DJEKI

**Date**: Décembre 2024  
**Compte concerné**: directeur.sogara@sante.ga  
**Établissement**: CMST SOGARA

---

## 🎯 OBJECTIF

Restaurer le rôle "Médecin" pour Dr. Jules DJEKI au CMST SOGARA, en plus de son rôle existant de "Directeur Général".

**Configuration cible** :
- ✅ Rôle 1 : **Directeur Médical** (gestion établissement)
- ✅ Rôle 2 : **Médecin Consultant Senior** (consultations médicales) ⭐ À RESTAURER

---

## 📋 FICHIERS CRÉÉS

1. **`restore-djeki-doctor-role.sql`** (✅ RECOMMANDÉ)
   - Script SQL à exécuter directement dans Supabase
   - Pas de dépendances
   - Idempotent (peut être exécuté plusieurs fois)

2. **`restore-djeki-doctor-role.js`** (⚠️ Nécessite SUPABASE_SERVICE_ROLE_KEY)
   - Script Node.js
   - Nécessite la clé de service dans `.env`

---

## 🚀 MÉTHODE 1 : Exécution via Supabase (RECOMMANDÉ)

### Étapes :

1. **Ouvrir Supabase Dashboard**
   - Aller sur https://supabase.com/dashboard
   - Sélectionner votre projet SANTE.GA

2. **Ouvrir l'éditeur SQL**
   - Cliquer sur "SQL Editor" dans le menu latéral
   - Cliquer sur "New query"

3. **Copier-coller le script**
   - Ouvrir le fichier `restore-djeki-doctor-role.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL de Supabase

4. **Exécuter le script**
   - Cliquer sur "Run" ou appuyer sur `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
   - Attendre la fin de l'exécution

5. **Vérifier les résultats**
   - Le script affichera des messages de progression
   - Rechercher le message final : "✨ RESTAURATION TERMINÉE AVEC SUCCÈS!"

### Résultat attendu :
```
🔧 RESTAURATION DU RÔLE MÉDECIN - DR. JULES DJEKI
════════════════════════════════════════════════════════

1️⃣ Recherche du compte Dr. DJEKI...
✅ Compte trouvé (User ID: xxx)

2️⃣ Vérification du profil professionnel...
✅ Profil professionnel existant (ID: xxx)

3️⃣ Vérification des départements...
✅ Départements trouvés
   - Direction (ID: xxx)
   - Médical (ID: xxx)

4️⃣ Vérification des rôles existants...
   Rôle Directeur: ✅ Présent
   Rôle Médecin: ❌ Absent

5️⃣ Restauration du rôle Médecin...
✅ Rôle Médecin restauré avec succès!

════════════════════════════════════════════════════════
✨ RESTAURATION TERMINÉE AVEC SUCCÈS!
════════════════════════════════════════════════════════

📊 RÉSUMÉ - Dr. Jules DJEKI
────────────────────────────────────────────────────────
👤 Compte: directeur.sogara@sante.ga
👨‍⚕️ Professionnel ID: xxx
🏥 Établissement: CMST SOGARA

👔 Rôles au CMST SOGARA:
   1. Directeur Médical (role: director)
   2. Médecin Consultant Senior (role: doctor) ⭐ RESTAURÉ

💡 Dr. DJEKI peut maintenant:
   - Basculer entre les rôles Directeur et Médecin
   - Accéder au menu Directeur pour la gestion
   - Accéder au menu Médecin pour les consultations
```

---

## 🚀 MÉTHODE 2 : Exécution via Node.js (AVANCÉ)

### Prérequis :
- Avoir la clé `SUPABASE_SERVICE_ROLE_KEY` dans le fichier `.env`

### Étapes :

1. **Ajouter la clé de service dans `.env`**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Exécuter le script**
   ```bash
   cd /Users/okatech/sante
   node restore-djeki-doctor-role.js
   ```

3. **Vérifier les résultats**
   - Le script affichera les mêmes messages que la méthode SQL

---

## ✅ VÉRIFICATION POST-RESTAURATION

### Dans Supabase :

1. **Vérifier la table `establishment_staff`**
   ```sql
   SELECT 
     es.role,
     es.position,
     es.status,
     ed.name as department,
     p.full_name
   FROM establishment_staff es
   JOIN professionals p ON p.id = es.professional_id
   JOIN establishment_departments ed ON ed.id = es.department_id
   WHERE p.email = 'directeur.sogara@sante.ga'
     AND es.establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
   ```

   **Résultat attendu** :
   | role | position | department | full_name |
   |------|----------|------------|-----------|
   | director | Directeur Médical | Direction | Dr. Jules DJEKI |
   | doctor | Médecin Consultant Senior | Service Médical | Dr. Jules DJEKI |

### Dans l'application :

1. **Se connecter avec le compte Dr. DJEKI**
   - Email : `directeur.sogara@sante.ga`
   - URL : http://localhost:8080/login/professional

2. **Vérifier le sélecteur de rôle**
   - Après connexion, accéder au dashboard professionnel
   - Vérifier la présence du sélecteur de rôle
   - Confirmer les deux rôles disponibles :
     - 🛡️ **Directeur Général CMST**
     - 👨‍⚕️ **Médecin**

3. **Tester le basculement entre rôles**
   - Cliquer sur le sélecteur de rôle
   - Choisir "Médecin"
   - Vérifier que le menu change pour afficher les options médicales
   - Basculer de nouveau vers "Directeur"
   - Vérifier que le menu change pour afficher les options de direction

---

## 📊 ARCHITECTURE DES RÔLES

```
Dr. Jules DJEKI (directeur.sogara@sante.ga)
│
├─ 🏥 CMST SOGARA
│  │
│  ├─ 🛡️ Rôle 1: Directeur Médical
│  │  ├─ Département: Direction (DIR)
│  │  ├─ Position: Directeur Médical
│  │  ├─ Permissions: Administration complète
│  │  └─ Fonctions:
│  │     ├─ Gestion établissement
│  │     ├─ Gestion personnel
│  │     ├─ Rapports et statistiques
│  │     └─ Configuration
│  │
│  └─ 👨‍⚕️ Rôle 2: Médecin Consultant Senior ⭐
│     ├─ Département: Service Médical (MED)
│     ├─ Position: Médecin Consultant Senior
│     ├─ Permissions: Pratique médicale
│     └─ Fonctions:
│        ├─ Consultations patients
│        ├─ Prescriptions médicales
│        ├─ Dossiers médicaux
│        └─ Rapports médicaux
```

---

## 🔍 DÉPANNAGE

### Problème : "Compte non trouvé"

**Solution** :
1. Vérifier que le compte `directeur.sogara@sante.ga` existe :
   ```sql
   SELECT id, email, full_name FROM profiles 
   WHERE email = 'directeur.sogara@sante.ga';
   ```
2. Si absent, créer le compte d'abord

### Problème : "Département médical absent"

**Solution** :
- Le script crée automatiquement le département si nécessaire
- Si le problème persiste, vérifier l'ID de l'établissement CMST SOGARA

### Problème : "Le rôle Médecin existe déjà"

**Solution** :
- C'est normal ! Le rôle est déjà restauré
- Aucune action supplémentaire nécessaire
- Vérifier dans l'application que le rôle est accessible

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. Vérifier les logs du script (messages d'erreur)
2. Vérifier que l'établissement CMST SOGARA existe
3. Vérifier que les départements sont bien configurés
4. Consulter la documentation multi-établissements

---

**Dernière mise à jour** : Décembre 2024

