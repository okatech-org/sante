# 🚀 DÉMARRAGE RAPIDE - MODULE MINISTÈRE

## Accès Immédiat

### 1. Démarrer l'Application

```bash
cd /Users/okatech/sante
npm run dev
```

### 2. Accéder au Module

Ouvrez votre navigateur et accédez à :

```
http://localhost:5173/ministry/login
```

### 3. Se Connecter

Utilisez un des comptes de démonstration :

#### Option 1 - Ministre (Accès Complet)
```
Email: ministre@sante.gouv.ga
Mot de passe: admin2025
```

#### Option 2 - Secrétaire Général
```
Email: sg@sante.gouv.ga
Mot de passe: admin2025
```

#### Option 3 - Directeur Général de la Santé
```
Email: dgs@sante.gouv.ga
Mot de passe: admin2025
```

---

## 📍 URLs Disponibles

| Page | URL | Description |
|------|-----|-------------|
| **Login** | `/ministry/login` | Page de connexion |
| **Dashboard** | `/ministry/dashboard` | Tableau de bord principal |
| **Version FR** | `/ministere/connexion` | Page de connexion (FR) |
| **Dashboard FR** | `/ministere/dashboard` | Tableau de bord (FR) |

---

## 🎯 Fonctionnalités Testables

### ✅ Dashboard National

1. **Statistiques en Temps Réel**
   - Population couverte : 1.8M (78%)
   - 238 établissements opérationnels
   - 2,159 médecins actifs
   - 85k consultations/mois

2. **Alertes Prioritaires**
   - Rupture d'insuline (Haut-Ogooué)
   - Scanner en panne (CHR Franceville)
   - Hausse paludisme (Nyanga)

3. **Performance des 9 Provinces**
   - Taux occupation lits
   - Délai moyen RDV
   - Satisfaction patients

4. **Finances**
   - Budget : 150 Mds FCFA
   - Exécution : 65%
   - Économies EVASAN : -2 Mds

### ✅ Navigation par Onglets

Cliquez sur les onglets en haut pour accéder à :

1. **Dashboard** - Vue d'ensemble
2. **Structures** - Annuaire national (à développer)
3. **Programmes** - Programmes nationaux (à développer)
4. **Rapports** - Publications (à développer)
5. **Admin** - Administration (à développer)

---

## 🎨 Points de Vérification

### Design
- [ ] Logo ministère visible
- [ ] Couleurs institutionnelles (bleu #1e40af)
- [ ] Cards avec ombres au hover
- [ ] Badges de statut colorés
- [ ] Responsive mobile/desktop

### Fonctionnalités
- [ ] Login fonctionne
- [ ] Redirection après login
- [ ] Statistiques affichées
- [ ] Alertes visibles
- [ ] Tableau provinces chargé
- [ ] Finances affichées

### UX
- [ ] Navigation intuitive
- [ ] Toast de confirmation login
- [ ] Loading spinner au chargement
- [ ] Aucune erreur console
- [ ] Pas de warnings TypeScript

---

## 🐛 Dépannage

### Erreur "Module not found"

```bash
npm install
```

### Port 5173 déjà utilisé

```bash
# Tuer le processus
lsof -ti:5173 | xargs kill -9

# Relancer
npm run dev
```

### Erreurs TypeScript

```bash
# Nettoyer et rebuilder
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Données de Démonstration

### Statistiques Nationales Mock

```typescript
{
  population_couverte_cnamgs: 1800000,
  taux_couverture: "78%",
  etablissements_operationnels: 238,
  medecins: 2159,
  infirmiers: 15000,
  consultations_mensuelles: 85000,
  teleconsultations: 12500
}
```

### Provinces Couvertes

- Estuaire (capitale Libreville)
- Haut-Ogooué (Franceville)
- Moyen-Ogooué
- Ngounié
- Nyanga
- Ogooué-Ivindo
- Ogooué-Lolo
- Ogooué-Maritime
- Woleu-Ntem

---

## 🔥 Démonstration Rapide (5 min)

### Scénario 1 : Vue Ministre

1. Login avec `ministre@sante.gouv.ga`
2. Observer les 4 cartes statistiques
3. Vérifier les 3-4 alertes actives
4. Consulter le tableau des 9 provinces
5. Voir la carte finances avec budget

### Scénario 2 : Navigation

1. Cliquer sur onglet "Structures"
2. Cliquer sur onglet "Programmes"  
3. Cliquer sur onglet "Rapports"
4. Revenir sur "Dashboard"

### Scénario 3 : Détails PNDS

1. Scroller vers "Objectifs Stratégiques PNDS"
2. Observer les 4 cartes d'indicateurs :
   - Couverture Sanitaire : 78% → 95%
   - Mortalité Maternelle : 316 → <150
   - Mortalité Infantile : 45 → <25
   - Ratio Médecins : 0.8 → 1.5

---

## ✨ Fonctionnalités Avancées (Futures)

Ces fonctionnalités sont prévues mais pas encore implémentées :

- [ ] Annuaire complet établissements avec filtres
- [ ] Programmes nationaux détaillés
- [ ] Publications et rapports téléchargeables
- [ ] Carte Gabon interactive cliquable
- [ ] Graphiques temps réel
- [ ] Notifications push alertes
- [ ] Export Excel/PDF

---

## 📞 Support

**Problème technique ?**
- Vérifiez la console navigateur (F12)
- Consultez `MODULE_MINISTERE_IMPLEMENTATION.md`
- Vérifiez que tous les fichiers sont présents

**Fichiers Clés:**
- `src/pages/ministry/MinistryDashboard.tsx`
- `src/pages/ministry/MinistryLogin.tsx`
- `src/types/ministry.ts`
- `src/hooks/useMinistry.ts`

---

## 🎉 C'est Prêt !

Le module Ministère est **100% fonctionnel** pour démonstration.

**Prochaines étapes :**
1. Connexion API backend réelle
2. Données Supabase
3. Graphiques Chart.js
4. Export rapports PDF
5. Mobile app

---

**Version :** 1.0  
**Date :** 1er novembre 2025  
**Statut :** ✅ OPÉRATIONNEL

