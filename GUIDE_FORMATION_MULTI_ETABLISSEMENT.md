# 📚 Guide de Formation - Architecture Multi-Établissement SANTE.GA

## 🎯 Objectifs de Formation

Ce guide permet aux utilisateurs de comprendre et maîtriser :
- Le système multi-établissement
- Le changement de contexte professionnel
- La gestion des consentements patients
- La revendication d'établissements

---

## 👥 Pour les Professionnels de Santé

### 1. Comprendre le Multi-Établissement

#### Qu'est-ce que le multi-établissement ?
Le système multi-établissement permet à un professionnel de santé de travailler dans plusieurs structures tout en gardant les données isolées.

**Avantages :**
- ✅ Un seul compte pour tous vos lieux d'exercice
- ✅ Données cloisonnées par établissement
- ✅ Rôles différents selon l'établissement
- ✅ Horaires et permissions adaptés

#### Exemples pratiques
- **Dr. NGUEMA** travaille :
  - Au CHU Libreville (temps plein, chef de service)
  - À la Clinique El Rapha (consultant, 2 jours/semaine)
  - Dans son cabinet privé (propriétaire, soirs)

### 2. Changer de Contexte d'Établissement

#### Étapes pour changer de contexte :

1. **Localiser le sélecteur** 
   - En haut de votre tableau de bord
   - Icône 🏢 avec le nom de l'établissement actuel

2. **Ouvrir le menu**
   - Cliquez sur le sélecteur
   - Vos établissements s'affichent

3. **Sélectionner l'établissement**
   - Cliquez sur l'établissement souhaité
   - La page se rafraîchit automatiquement

#### Ce qui change selon le contexte :
- 📊 **Données visibles** : Uniquement celles de l'établissement sélectionné
- 👥 **Patients** : Liste filtrée par établissement
- 📅 **Agenda** : Rendez-vous de cet établissement uniquement
- 💊 **Prescriptions** : Historique lié à l'établissement
- 🔐 **Permissions** : Selon votre rôle dans l'établissement

### 3. Revendiquer un Établissement

#### Quand revendiquer ?
- Vous êtes propriétaire/directeur
- L'établissement n'a pas encore d'administrateur
- Vous avez l'autorité légale

#### Processus de revendication :

**Étape 1 : Recherche**
```
Menu → Établissements → Rechercher non revendiqués
Filtres : Province, Ville, Type
```

**Étape 2 : Sélection**
- Vérifiez les informations
- Cliquez sur "Revendiquer"

**Étape 3 : Justification**
- Rôle dans l'établissement
- Documents requis :
  - Lettre officielle
  - Pièce d'identité
  - Preuve d'autorité
  - RCCM (si privé)

**Étape 4 : Validation**
- Délai : 24-48h
- Notification par email
- Accès administrateur si approuvé

### 4. Gérer le Personnel (Administrateurs)

#### Ajouter un collaborateur :

1. **Accéder à la gestion**
   ```
   Contexte établissement → Paramètres → Personnel
   ```

2. **Inviter un professionnel**
   - Email ou numéro d'ordre
   - Définir le rôle
   - Configurer les permissions

3. **Permissions disponibles**
   - `create_consultation` : Créer des consultations
   - `write_prescription` : Rédiger des ordonnances
   - `order_labs` : Demander des examens
   - `admit_patient` : Hospitaliser
   - `manage_staff` : Gérer le personnel
   - `view_finances` : Voir les finances

---

## 🏥 Pour les Patients

### 1. Comprendre le Consentement DMP

#### Qu'est-ce que le DMP ?
Le Dossier Médical Partagé centralise vos informations médicales avec votre consentement.

#### Types de consentement :
- **Lecture seule** : Consultation uniquement
- **Lecture/Écriture** : Consultation et ajout
- **Urgence uniquement** : Accès en cas d'urgence

### 2. Gérer vos Consentements

#### Donner un consentement :

1. **Accéder aux paramètres**
   ```
   Mon compte → Confidentialité → Consentements
   ```

2. **Choisir le bénéficiaire**
   - Un professionnel spécifique
   - Un établissement entier

3. **Définir la portée**
   - ☑️ Consultations
   - ☑️ Prescriptions
   - ☑️ Résultats d'examens
   - ☑️ Imagerie
   - ☑️ Allergies
   - ☑️ Médicaments

4. **Définir la durée**
   - Permanent
   - Temporaire (date d'expiration)

#### Révoquer un consentement :
```
Consentements actifs → Sélectionner → Révoquer
```

### 3. Comprendre l'Isolation des Données

#### Principe de base
Vos données médicales sont **cloisonnées par établissement**.

**Exemple :**
- Consultation au CHU → Visible uniquement au CHU
- Consultation en clinique → Visible uniquement à la clinique
- **SAUF** si vous donnez un consentement de partage

#### Avantages :
- 🔒 Confidentialité renforcée
- 🎯 Contrôle précis des accès
- 📊 Traçabilité complète

---

## 🚀 Cas d'Usage Pratiques

### Scénario 1 : Médecin Multi-Établissement

**Dr. MARTIN** exerce dans 3 structures :

**Matin (8h-12h) - CHU**
1. Se connecte
2. Sélectionne contexte "CHU Libreville"
3. Voit ses 15 patients hospitalisés
4. Fait sa visite, prescrit

**Après-midi (14h-18h) - Clinique**
1. Change contexte → "Clinique El Rapha"
2. Voit ses 8 consultations
3. Reçoit les patients
4. Les données CHU sont invisibles

**Soir (18h-20h) - Cabinet**
1. Change contexte → "Cabinet privé"
2. Consultations privées
3. Gestion administrative (propriétaire)

### Scénario 2 : Patient avec Suivi Multiple

**Mme OBAME** est suivie par :
- Cardiologue au CHU
- Généraliste en clinique
- Pharmacien de quartier

**Gestion des consentements :**
1. Consent complet au cardiologue (suivi principal)
2. Consent limité au généraliste (consultations ponctuelles)
3. Consent prescriptions au pharmacien

### Scénario 3 : Urgence Médicale

**Patient inconscient** aux urgences :

1. **Médecin urgentiste** accède au DMP
2. Mode "urgence" activé
3. Accès aux données critiques :
   - Allergies
   - Médicaments actuels
   - Antécédents majeurs
4. Accès tracé et justifié

---

## 📊 Tableau de Bord selon le Contexte

### Vue Hôpital
```
┌─────────────────────────────────┐
│ 🏥 CHU Libreville               │
│ Chef de Service Cardiologie     │
├─────────────────────────────────┤
│ Patients hospitalisés : 15      │
│ Consultations jour : 8          │
│ Lits disponibles : 3/20         │
│ Personnel présent : 12          │
└─────────────────────────────────┘
```

### Vue Cabinet
```
┌─────────────────────────────────┐
│ 🏢 Cabinet Médical Saint-Michel │
│ Propriétaire                    │
├─────────────────────────────────┤
│ RDV aujourd'hui : 6             │
│ Salle d'attente : 2             │
│ Recettes mois : 450,000 FCFA    │
│ Stock consommables : OK         │
└─────────────────────────────────┘
```

---

## ⚠️ Points d'Attention

### Pour les Professionnels

1. **Toujours vérifier le contexte actuel**
   - Avant de créer une consultation
   - Avant d'accéder aux données
   - Avant de prescrire

2. **Respecter les permissions**
   - Chaque établissement a ses règles
   - Les permissions varient selon le rôle

3. **Documenter les accès**
   - Justifier les accès d'urgence
   - Tracer les consultations inter-établissements

### Pour les Patients

1. **Réviser régulièrement les consentements**
   - Vérifier les accès actifs
   - Révoquer les accès obsolètes

2. **Comprendre la portée**
   - Consentement ≠ accès total
   - Définir précisément les données partagées

---

## 🆘 Support et Assistance

### FAQ Rapide

**Q: Je ne vois pas mes patients dans un établissement**
> R: Vérifiez que vous êtes dans le bon contexte d'établissement

**Q: Comment savoir qui a accès à mon dossier ?**
> R: Mon compte → Confidentialité → Historique des accès

**Q: Puis-je travailler hors ligne ?**
> R: Oui, mais sans changement de contexte. Les données seront synchronisées à la reconnexion.

### Contact Support

- 📧 Email : support@sante.ga
- 📞 Téléphone : +241 01 44 55 66
- 💬 Chat : Disponible dans l'application
- 📍 FAQ complète : [https://sante.ga/aide](https://sante.ga/aide)

---

## 📝 Checklist de Démarrage

### Professionnel - Première Connexion

- [ ] Se connecter avec ses identifiants
- [ ] Vérifier ses établissements associés
- [ ] Tester le changement de contexte
- [ ] Configurer ses préférences par établissement
- [ ] Vérifier ses permissions dans chaque contexte
- [ ] Revendiquer son établissement (si applicable)

### Patient - Configuration Initiale

- [ ] Créer son compte patient
- [ ] Activer son DMP
- [ ] Définir les consentements de base
- [ ] Configurer l'accès d'urgence
- [ ] Ajouter ses contacts d'urgence
- [ ] Vérifier l'historique des accès

---

## 🎓 Formations Disponibles

### Sessions en Ligne
- **Basics** : Introduction au multi-établissement (30 min)
- **Advanced** : Gestion administrative (1h)
- **Security** : Consentements et confidentialité (45 min)

### Webinaires Mensuels
- Premier mardi : Nouveautés de la plateforme
- Troisième jeudi : Questions-Réponses en direct

### Ressources
- [Vidéos tutorielles](https://sante.ga/tutorials)
- [Documentation technique](https://docs.sante.ga)
- [Blog actualités](https://blog.sante.ga)

---

*Ce guide est mis à jour régulièrement. Version 1.0 - Octobre 2024*
