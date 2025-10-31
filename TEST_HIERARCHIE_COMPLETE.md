# 🧪 TEST DE LA HIÉRARCHIE COMPLÈTE

**Date** : 31 octobre 2025  
**URL** : http://localhost:8080/professional/

---

## ✅ MODIFICATIONS APPLIQUÉES

### 1. **Structure hiérarchique dans la sidebar** ✅
- CMST SOGARA affiché comme établissement parent
- ADMIN et MÉDECIN en dessous comme rôles cliquables
- Indentation visuelle pour la hiérarchie

### 2. **RoleSwitcher créé** ✅
- Composant dropdown pour changer de rôle
- Affiché en bas de la sidebar (si multi-rôles)
- Icônes et labels pour chaque rôle

### 3. **Migration SQL** ✅
- Script pour configurer Dr. DJEKI avec 2 rôles
- Fonction RPC pour récupérer les rôles

---

## 🎯 INTERFACE ATTENDUE

```
┌──────────────────────────────────────┐
│         SIDEBAR GAUCHE               │
├──────────────────────────────────────┤
│ 🏢 SANTE.GA                          │
│ Espace Professionnel                 │
│                                      │
│ [Avatar] Dr. Jules DJEKI             │
│ Professionnel de santé               │
│──────────────────────────────────────│
│ TABLEAU DE BORD                      │
│ 📊 Vue d'ensemble                    │
│──────────────────────────────────────│
│ ÉTABLISSEMENTS                       │
│                                      │
│ 🏢 CMST SOGARA                       │
│    ├─ 🛡️ ADMIN      ← Cliquer ici  │
│    └─ 🩺 MÉDECIN    ← Ou ici        │
│                                      │
│ 🏢 Etablissement 2 (désactivé)       │
│ 🏢 Etablissement X (désactivé)       │
│──────────────────────────────────────│
│ PARAMÈTRES                           │
│ ⚙️ Paramètres                        │
│──────────────────────────────────────│
│ [Switcher de Rôle ▼]                │
│ 🛡️ Directeur                         │
│ Changer de rôle                      │
│──────────────────────────────────────│
│ 🚪 Déconnexion                       │
└──────────────────────────────────────┘
```

---

## 📋 CHECKLIST DE VALIDATION

### Hiérarchie visuelle
- [ ] CMST SOGARA affiché comme parent
- [ ] ADMIN et MÉDECIN indentés en dessous
- [ ] Icônes distinctes (🛡️ et 🩺)

### Comportement des clics
- [ ] Clic sur ADMIN → Menu DIRECTEUR (5 sections)
- [ ] Clic sur MÉDECIN → Menu DOCTOR (4 sections)
- [ ] Rôle actif surligné en bleu

### Menu accordéon
- [ ] ADMIN : GÉNÉRAL, ACTIVITÉ, DIRECTION, **ADMINISTRATION**, COMMUNICATION
- [ ] MÉDECIN : GÉNÉRAL, ACTIVITÉ, DIRECTION, COMMUNICATION (pas d'ADMINISTRATION)

### Role Switcher
- [ ] Visible en bas de la sidebar
- [ ] Affiche le rôle actuel
- [ ] Menu dropdown avec les 2 rôles
- [ ] Changement instantané

### Persistance
- [ ] Rôle mémorisé après rafraîchissement
- [ ] Pas de rechargement de page lors du switch

---

## 🚀 COMMANDES DE TEST

### 1. Appliquer la migration SQL (optionnel)
```bash
# Si vous avez accès à la base Supabase
psql $DATABASE_URL < supabase/migrations/20250131_dr_djeki_multi_roles.sql

# Ou exécuter dans le SQL Editor de Supabase Dashboard
```

### 2. Tester l'interface
```
1. Ouvrir : http://localhost:8080/professional/
2. Connexion : directeur.sogara@sante.ga / DirecteurSOGARA2024!
3. Vérifier la hiérarchie CMST SOGARA → ADMIN/MÉDECIN
4. Cliquer sur ADMIN → Vérifier 5 sections
5. Cliquer sur MÉDECIN → Vérifier 4 sections
6. Utiliser le Role Switcher en bas
```

---

## 📊 COMPARAISON AVANT/APRÈS

### AVANT (capture d'écran)
- Établissement et rôle sur la même ligne
- "DIRECTEUR" affiché directement
- Pas de hiérarchie visuelle

### APRÈS (implémentation)
- CMST SOGARA comme parent
- ADMIN et MÉDECIN indentés en dessous
- Hiérarchie claire et intuitive
- Role Switcher disponible

---

## 🔍 RÉSOLUTION DE PROBLÈMES

### Si la hiérarchie n'apparaît pas
1. Vider le cache : `Ctrl+Shift+R`
2. Vérifier la console pour les erreurs
3. Relancer `npm run dev`

### Si le Role Switcher ne fonctionne pas
1. Vérifier que `availableRoles` contient 2 rôles
2. Vérifier dans la console : `localStorage.getItem('current_role')`
3. S'assurer que la migration SQL a été appliquée

### Si le menu ne change pas
1. Vérifier que `menuDefinitions.ts` est chargé
2. Vérifier que `getMenuForRole()` retourne le bon menu
3. Rafraîchir la page

---

## ✅ VALIDATION FINALE

Si tout fonctionne :
- ✅ Hiérarchie CMST SOGARA → ADMIN/MÉDECIN
- ✅ Switch instantané entre rôles
- ✅ Menu accordéon contextuel
- ✅ Role Switcher fonctionnel
- ✅ Persistance du choix

**L'architecture hiérarchique multi-rôles est complète !** 🎉
