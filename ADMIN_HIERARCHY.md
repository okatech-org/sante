# Hiérarchie des Rôles Administratifs - SANTE.GA

## Vue d'ensemble

Le système SANTE.GA utilise une hiérarchie de rôles claire pour gérer les accès et permissions.

## Rôles et Permissions

### 🔴 Super Admin (`super_admin`)
**Le niveau le plus élevé - Contrôle total du système**

#### Accès complet à :
- ✅ Dashboard Super Admin (`/dashboard/superadmin`)
- ✅ Gestion complète des utilisateurs
- ✅ Création et suppression d'administrateurs
- ✅ Gestion des établissements
- ✅ Gestion des professionnels de santé
- ✅ Système d'audit complet
- ✅ Paramètres système
- ✅ Accès au volet "Projet" (documentation technique complète)
- ✅ Toutes les fonctionnalités admin

#### Menu Super Admin :
1. Dashboard - Vue d'ensemble du système
2. Projet - Documentation et architecture
3. Utilisateurs - Gestion de tous les comptes
4. Approbations - Validation des demandes
5. Établissements - Hôpitaux, cliniques, pharmacies
6. Professionnels - Médecins, personnel médical
7. Audit - Historique et traçabilité
8. Paramètres - Configuration système

#### Responsabilités :
- Supervision complète de la plateforme
- Gestion de la sécurité
- Attribution des rôles administratifs
- Monitoring du système
- Décisions stratégiques

---

### 🟡 Admin (`admin`)
**Gestionnaire du système - Créé par le Super Admin**

#### Accès à :
- ✅ Dashboard Admin (`/dashboard/admin`)
- ✅ Gestion des utilisateurs (lecture/modification)
- ✅ Validation des demandes d'approbation
- ✅ Gestion des établissements
- ✅ Gestion des professionnels
- ✅ Consultation de l'audit
- ❌ **IMPOSSIBLE** de créer d'autres admins
- ❌ **IMPOSSIBLE** de modifier les super admins
- ❌ **IMPOSSIBLE** d'accéder aux paramètres système critiques

#### Menu Admin :
1. Dashboard - Statistiques et activité
2. Utilisateurs - Gestion (sans création d'admin)
3. Approbations - Validation des demandes
4. Établissements - Gestion des structures
5. Professionnels - Gestion du personnel
6. Audit - Consultation uniquement

---

### 🟢 Moderator (`moderator`)
**Modération de contenu et support**

#### Accès à :
- ✅ Modération des messages
- ✅ Gestion des signalements
- ✅ Support utilisateurs
- ❌ Pas d'accès à la gestion système
- ❌ Pas de gestion des utilisateurs

---

### 🔵 Rôles Médicaux
- `doctor` - Médecins
- `medical_staff` - Personnel médical
- `pharmacy` - Pharmacies
- `laboratory` - Laboratoires
- `hospital` - Hôpitaux/Cliniques

---

### ⚪ Patient (`patient`)
**Utilisateur standard**

- Accès à son dossier médical
- Prise de rendez-vous
- Téléconsultation
- Gestion des ordonnances
- Suivi CNAMGS

---

## Hiérarchie des Permissions

```
Super Admin
    ↓ (peut créer)
Admin
    ↓ (peut gérer)
Moderator
    ↓
Rôles Médicaux (Doctor, Medical Staff, etc.)
    ↓
Patient
```

## Comment créer un Admin

**Seul le Super Admin peut créer des admins**

1. Se connecter en tant que Super Admin
2. Aller dans le menu "Utilisateurs"
3. Utiliser la section "Attribuer un rôle administratif"
4. Entrer l'email de l'utilisateur existant
5. Sélectionner le rôle "Administrateur"
6. Confirmer l'attribution

## Routes et Accès

### Super Admin uniquement :
- `/dashboard/superadmin` - Dashboard principal
- `/admin` - Panneau de gestion des rôles
- `/admin/project` - Documentation technique
- `/admin/settings` - Paramètres système

### Admin et Super Admin :
- `/dashboard/admin` - Dashboard admin standard
- `/admin/users` - Gestion des utilisateurs
- `/admin/approvals` - Approbations
- `/admin/establishments` - Établissements
- `/admin/professionals` - Professionnels
- `/admin/audit` - Historique

## Sécurité

### Règles de sécurité :
1. ✅ Le rôle `super_admin` est protégé - impossible à s'auto-attribuer
2. ✅ Seul un super admin peut créer d'autres super admins
3. ✅ Les admins ne peuvent pas élever leurs propres privilèges
4. ✅ Tous les changements de rôles sont audités
5. ✅ Les RLS (Row Level Security) protègent les données sensibles

### Base de données :
- Table `user_roles` - Stockage des rôles
- Fonction `has_role()` - Vérification des permissions
- Fonction `assign_user_role()` - Attribution sécurisée
- Triggers et validations automatiques

## Connexion

### Super Admin :
- URL : `/superadmin`
- Redirection automatique vers `/dashboard/superadmin`

### Admin :
- URL : `/login/patient` ou `/superadmin`
- Redirection automatique vers `/dashboard/admin`

### Patient :
- URL : `/login/patient`
- Redirection vers `/dashboard/patient`

---

## FAQ

**Q: Un admin peut-il devenir super admin ?**
R: Non, seul un super admin existant peut attribuer ce rôle.

**Q: Combien de super admins peut-il y avoir ?**
R: Illimité, mais il est recommandé d'en avoir 2-3 maximum pour des raisons de sécurité.

**Q: Un admin peut-il voir les autres admins ?**
R: Oui, mais il ne peut pas modifier leurs rôles.

**Q: Que se passe-t-il si le super admin supprime son propre rôle ?**
R: C'est bloqué par le système - impossible de supprimer le rôle super_admin.

**Q: Comment récupérer l'accès si tous les super admins sont perdus ?**
R: Suivre les instructions dans `SUPER_ADMIN_SETUP.md` pour créer un nouveau super admin via la base de données.

---

*Document mis à jour le : 2025-10-08*
*Version du système : 1.0.0*
