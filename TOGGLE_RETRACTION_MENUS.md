# 🔽 TOGGLE RÉTRACTION MENUS DIRECTEUR/MÉDECIN

**Date** : 31 octobre 2025  
**Fonctionnalité** : Rétraction menu accordéon au 2ème clic  
**Statut** : ✅ IMPLÉMENTÉ

---

## 🎯 OBJECTIF

Permettre de **rétracter/afficher** le menu accordéon en cliquant sur DIRECTEUR ou MÉDECIN une 2ème fois.

---

## 🔄 COMPORTEMENT

### Clic 1 : Activation du rôle
```
État initial : Menu caché ou autre rôle actif

Action : Clic sur DIRECTEUR
Résultat :
  • Rôle DIRECTEUR activé
  • Menu accordéon DIRECTEUR s'affiche
  • Icône : ChevronDown ▼
  • Menu visible avec 4 sections
```

### Clic 2 : Rétraction du menu
```
État : DIRECTEUR actif, menu affiché

Action : Clic à nouveau sur DIRECTEUR
Résultat :
  • Rôle DIRECTEUR reste actif
  • Menu accordéon se rétracte (disparaît)
  • Icône : ChevronRight ▶
  • Plus d'espace pour le contenu principal
```

### Clic 3 : Réaffichage du menu
```
État : DIRECTEUR actif, menu caché

Action : Clic sur DIRECTEUR
Résultat :
  • Menu accordéon réapparaît
  • Icône : ChevronDown ▼
  • Retour à l'état normal
```

---

## 🎨 INDICATEURS VISUELS

### Icône dynamique
```
Menu OUVERT  → ChevronDown ▼  (pointe vers le bas)
Menu FERMÉ   → ChevronRight ▶ (pointe vers la droite)
```

### États visuels
```
DIRECTEUR actif + Menu ouvert
├─ Background: bg-primary (cyan)
├─ Texte: text-primary-foreground (blanc)
├─ Icône: ChevronDown ▼
└─ Menu accordéon: VISIBLE (w-64)

DIRECTEUR actif + Menu fermé
├─ Background: bg-primary (cyan)
├─ Texte: text-primary-foreground (blanc)
├─ Icône: ChevronRight ▶
└─ Menu accordéon: CACHÉ
```

---

## 🔧 IMPLÉMENTATION TECHNIQUE

### 1. State ajouté
```typescript
const [isRoleMenuExpanded, setIsRoleMenuExpanded] = useState(true);
```

**Par défaut** : `true` → Menu affiché au chargement

### 2. Logique handleRoleChange modifiée
```typescript
const handleRoleChange = async (newRole: string) => {
  try {
    // Si le rôle est déjà actif, toggle l'expansion du menu
    if (newRole === activeRole) {
      setIsRoleMenuExpanded(!isRoleMenuExpanded);
      return;  // Ne pas changer de rôle, juste toggle menu
    }
    
    // Si on change de rôle, l'activer et ouvrir le menu
    setIsRoleMenuExpanded(true);
    
    // Changer de rôle normalement
    if (switchRole) {
      await switchRole(newRole);
      toast.success(`Rôle changé`);
    }
  } catch (error) {
    toast.error('Erreur');
  }
};
```

### 3. Icône conditionnelle
```typescript
{activeRole === 'director' && (
  isRoleMenuExpanded ? (
    <ChevronDown className="h-4 w-4" />  // Menu ouvert
  ) : (
    <ChevronRight className="h-4 w-4" /> // Menu fermé
  )
)}
```

### 4. Menu accordéon conditionnel
```typescript
// AVANT
{activeRole && (
  <aside>Menu...</aside>
)}

// APRÈS
{activeRole && isRoleMenuExpanded && (
  <aside>Menu...</aside>
)}
```

---

## 📊 FLUX D'UTILISATION

### Scénario A : Navigation normale
```
1. User clique DIRECTEUR
   → Menu DIRECTEUR s'affiche (▼)
   
2. User navigue dans le menu
   → Clique "Statistiques"
   → Page s'affiche
   
3. User clique MÉDECIN
   → Rôle change pour MÉDECIN
   → Menu MÉDECIN s'affiche (▼)
   → Menu DIRECTEUR disparaît
```

### Scénario B : Rétraction pour plus d'espace
```
1. User clique DIRECTEUR
   → Menu DIRECTEUR s'affiche (▼)
   
2. User travaille sur une page
   → Besoin de plus d'espace
   
3. User re-clique DIRECTEUR
   → Menu se rétracte (▶)
   → Plus d'espace pour le contenu
   
4. User veut naviguer ailleurs
   → Re-clique DIRECTEUR
   → Menu réapparaît (▼)
```

### Scénario C : Switch entre rôles
```
1. DIRECTEUR actif, menu fermé (▶)
2. User clique MÉDECIN
   → Rôle change pour MÉDECIN
   → Menu MÉDECIN s'affiche automatiquement (▼)
   → isRoleMenuExpanded = true (reset)
```

---

## 🎯 AVANTAGES

### UX améliorée
- ✅ **Plus d'espace** pour le contenu quand menu caché
- ✅ **Flexibilité** : Utilisateur choisit d'afficher/cacher
- ✅ **Indicateur visuel** clair (ChevronDown/Right)
- ✅ **Transition fluide** automatique
- ✅ **Persistance du rôle** : Rôle reste actif même menu caché

### Cas d'usage
- **Grand écran** : Menu peut rester affiché
- **Petit écran** : Cacher menu pour plus d'espace
- **Focus contenu** : Cacher menu pour se concentrer
- **Navigation rapide** : Afficher menu temporairement

---

## 🧪 GUIDE DE TEST

### Test 1 : Toggle DIRECTEUR
```
1. Se connecter : directeur.sogara@sante.ga
2. Sidebar → Clic DIRECTEUR
3. Vérifier :
   ✓ Menu accordéon s'affiche
   ✓ Icône ChevronDown ▼ visible
   ✓ 4 sections visibles (GÉNÉRAL, DIRECTION, ADMIN, COMM)
   
4. Clic à nouveau sur DIRECTEUR
5. Vérifier :
   ✓ Menu accordéon disparaît
   ✓ Icône ChevronRight ▶ visible
   ✓ Plus d'espace pour le contenu
   ✓ DIRECTEUR reste actif (cyan)
   
6. Clic encore sur DIRECTEUR
7. Vérifier :
   ✓ Menu réapparaît
   ✓ Icône ChevronDown ▼
   ✓ 4 sections visibles
```

### Test 2 : Toggle MÉDECIN
```
1. Clic MÉDECIN (depuis DIRECTEUR)
2. Vérifier :
   ✓ Rôle change pour MÉDECIN
   ✓ Menu MÉDECIN s'affiche automatiquement
   ✓ Icône ChevronDown ▼
   ✓ 2 sections visibles
   
3. Clic à nouveau sur MÉDECIN
4. Vérifier :
   ✓ Menu se rétracte
   ✓ Icône ChevronRight ▶
   ✓ MÉDECIN reste actif
   
5. Clic encore sur MÉDECIN
6. Vérifier :
   ✓ Menu réapparaît
   ✓ Icône ChevronDown ▼
```

### Test 3 : Switch entre rôles avec menu caché
```
1. DIRECTEUR actif, menu rétracté (▶)
2. Clic MÉDECIN
3. Vérifier :
   ✓ Rôle change
   ✓ Menu MÉDECIN s'affiche AUTOMATIQUEMENT (▼)
   ✓ Toast "Rôle changé"
   
4. MÉDECIN actif, clic MÉDECIN pour cacher
5. Menu se rétracte (▶)
6. Clic DIRECTEUR
7. Vérifier :
   ✓ Rôle change
   ✓ Menu DIRECTEUR s'affiche AUTOMATIQUEMENT (▼)
```

### Test 4 : Responsive (mobile)
```
1. Ouvrir menu mobile (burger)
2. Clic DIRECTEUR
3. Menu s'affiche normalement
4. (Comportement identique en mobile)
```

---

## 📊 ÉTATS DU SYSTÈME

### État 1 : Menu ouvert (par défaut)
```
┌────────────┬────────────┬──────────────┐
│  SIDEBAR   │   MENU     │   CONTENU    │
│            │ ACCORDÉON  │              │
│ DIRECTEUR▼ │ • Général  │  Dashboard   │
│            │ • Direction│              │
│            │ • Admin    │              │
│            │ • Comm     │              │
└────────────┴────────────┴──────────────┘
  Largeur:     w-72         w-64          flex-1
```

### État 2 : Menu rétracté
```
┌────────────┬───────────────────────────┐
│  SIDEBAR   │      CONTENU              │
│            │      (Plus d'espace)      │
│ DIRECTEUR▶ │                           │
│            │      Dashboard            │
│            │                           │
│            │                           │
└────────────┴───────────────────────────┘
  Largeur:     w-72                flex-1
                                  (+w-64)
```

---

## 💡 LOGIQUE DÉTAILLÉE

### Cas 1 : Clic sur rôle actif
```javascript
// newRole === activeRole
if (newRole === activeRole) {
  setIsRoleMenuExpanded(!isRoleMenuExpanded);
  // Toggle true ↔ false
  return; // Ne pas changer de rôle
}
```

### Cas 2 : Clic sur autre rôle
```javascript
// newRole !== activeRole
setIsRoleMenuExpanded(true); // Forcer ouverture
await switchRole(newRole);   // Changer de rôle
toast.success('Rôle changé');
```

### Cas 3 : Affichage menu
```javascript
{activeRole && isRoleMenuExpanded && (
  <aside>
    {/* Menu accordéon */}
  </aside>
)}
```

**Conditions** :
- `activeRole` : Un rôle doit être sélectionné
- `isRoleMenuExpanded` : Menu doit être en état expanded

---

## ✅ VALIDATION

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  ✅ TOGGLE RÉTRACTION IMPLÉMENTÉ                      ║
║                                                        ║
║  Fonctionnalité :                                     ║
║  • Clic DIRECTEUR/MÉDECIN → Affiche menu              ║
║  • Clic 2ème fois → Rétracte menu                     ║
║  • Icône change : ▼ ↔ ▶                               ║
║  • Rôle reste actif même menu caché                   ║
║                                                        ║
║  Comportement :                                       ║
║  • State isRoleMenuExpanded (true/false)              ║
║  • Toggle au clic sur rôle actif                      ║
║  • Forcer ouverture au changement de rôle             ║
║  • Menu conditionnel (activeRole && expanded)         ║
║                                                        ║
║  Indicateurs visuels :                                ║
║  • ChevronDown ▼ = Menu ouvert                        ║
║  • ChevronRight ▶ = Menu fermé                        ║
║                                                        ║
║  📏 +20 lignes de code                                ║
║  🎨 UX améliorée                                      ║
║  ⚡ Transition fluide                                 ║
║                                                        ║
║  🌐 http://localhost:8080/professional/               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

**Système de toggle rétraction 100% fonctionnel !** ✅
