# 📍 ACCÈS AUX PAGES D'ÉTABLISSEMENTS - SANTE.GA

## 🎯 Navigation Mise à Jour

### Nouvelle Architecture : Système de Revendication des Établissements

La page `/superadmin/demo` n'est plus le point d'accès principal. Elle est remplacée par un système complet de **revendication d'établissements non-revendiqués**.

---

## 🚀 ACCÈS PRINCIPAL

### Pour les Utilisateurs (Patients, Professionnels, Administrateurs)

```
URL: http://localhost:8081/establishments/unclaimed
Statut: PUBLIC (aucune authentification requise pour consulter)
Description: Liste complète de tous les établissements de santé du Gabon
```

**Fonctionnalités** :
- 📋 Liste des établissements avec badges de statut
- 🔍 Filtres par : Type, Province, Ville, Statut
- 🔎 Recherche par nom
- 📊 Statistiques globales
- 🛡️ Bouton "Revendiquer" pour établissements non-revendiqués

---

### Pour Revendiquer un Établissement

```
URL: http://localhost:8081/establishments/:id/claim
Statut: AUTHENTIFICATION REQUISE
Description: Processus guidé en 3 étapes pour revendiquer un établissement
```

**Processus** :
1. **Étape 1** : Vérification d'identité (rôle, contacts)
2. **Étape 2** : Upload des documents légaux
3. **Étape 3** : Validation et soumission

---

## 👨‍💼 ACCÈS ADMINISTRATEUR

### Page Super Admin (Menu Établissements)

```
Nouveau lien : /establishments/unclaimed (depuis le menu)
```

**Depuis le dashboard Super Admin** :
- Cliquer sur **"Établissements"** dans le menu gauche
- Redirection vers `/establishments/unclaimed`

---

## 🔗 REDIRECTION AUTOMATIQUE

### Menu SuperAdmin Mis à Jour

```
✅ Établissements  →  /establishments/unclaimed
```

Le clic sur le menu "Établissements" dans le Super Admin redirige maintenant directement vers la liste des établissements.

---

## 📊 BADGES DE STATUT

| Badge | Couleur | Signification |
|-------|---------|---------------|
| ⏳ Non-Revendiqué | Gris | En attente d'administrateur |
| 🔄 Vérification en Cours | Orange | Demande soumise |
| ✅ Vérifié | Vert | Établissement actif et vérifié |
| ❌ Rejeté | Rouge | Demande de revendication refusée |
| ⚠️ Suspendu | Jaune | Compte temporairement désactivé |

---

## 🧪 COMPTES PRÉ-INTÉGRÉS (Legacy)

### Page Démo Historique

```
URL: http://localhost:8081/superadmin/demo
Statut: LEGACY (ancienne architecture)
Description: Affichage des comptes démo multi-établissements
```

---

## 📱 APPLICATIONS MOBILES

### Accès Mobile

```
URL Mobile: https://sante.ga/establishments/unclaimed
```

**Compatible avec tous les navigateurs modernes**

---

**Dernière mise à jour** : 2024-10-28
**Version** : 1.0
**Statut** : Production Ready
