# 📊 ARCHITECTURE DES MENUS HIÉRARCHIQUES

**Date**: 31 octobre 2025  
**Version**: 1.0  
**Projet**: SANTE.GA - Système de navigation multi-établissements et multi-rôles

---

## 🎯 OBJECTIF

Implémenter une navigation hiérarchique où les professionnels doivent :
1. **Sélectionner un établissement**
2. **Choisir un rôle** (si plusieurs disponibles)
3. **Accéder au menu contextuel** adapté à leur rôle et type d'établissement

---

## 📐 ARCHITECTURE IMPLÉMENTÉE

### 1. Flux de Navigation

```
┌────────────────┐
│   Connexion    │
└───────┬────────┘
        ↓
┌────────────────────────┐
│ Sélection Établissement│ ← /professional/establishments
└───────┬────────────────┘
        ↓
┌────────────────────────┐
│   Sélection Rôle       │ ← /professional/select-role/:establishmentId
│  (ADMIN ou MÉDECIN)    │
└───────┬────────────────┘
        ↓
┌────────────────────────┐
│  Dashboard avec Menu   │ ← /professional/dashboard
│     Contextuel         │
└────────────────────────┘
```

### 2. Structure des Fichiers

```
src/
├── config/
│   └── menuDefinitions.ts       # ⭐ Définitions des menus par type/rôle
│
├── pages/professional/
│   └── SelectRole.tsx           # ⭐ Page de sélection du rôle
│
├── components/layout/
│   ├── RoleAndEstablishmentSwitcher.tsx  # ⭐ Composant de bascule
│   └── sidebar/
│       └── SidebarNav.tsx       # Navigation dynamique
│
└── contexts/
    └── MultiEstablishmentContext.tsx  # Gestion du contexte
```

---

## 📋 DÉFINITIONS DES MENUS

### Structure par Type d'Établissement et Rôle

```typescript
// menuDefinitions.ts

const MENU_DEFINITIONS = {
  hospital: {
    admin: {
      sections: [
        {
          title: "GÉNÉRAL",
          items: [
            { title: "Vue d'ensemble", icon: BarChart, path: "/overview", permission: "view_analytics" },
          ]
        },
        {
          title: "ADMINISTRATION",
          items: [
            { title: "Personnel", icon: Users, path: "/personnel", permission: "manage_staff" },
            { title: "Facturation", icon: DollarSign, path: "/billing", permission: "manage_billing" },
            { title: "Inventaire", icon: Package, path: "/inventory", permission: "manage_stock" },
            { title: "Rapports", icon: FileText, path: "/reports", permission: "view_analytics" }
          ]
        },
        {
          title: "COMMUNICATION",
          items: [
            { title: "Messages", icon: MessageSquare, path: "/messages", badge: 3 }
          ]
        }
      ]
    },
    doctor: {
      sections: [
        {
          title: "GÉNÉRAL",
          items: [
            { title: "Vue d'ensemble", icon: BarChart, path: "/overview" }
          ]
        },
        {
          title: "ACTIVITÉ MÉDICALE",
          items: [
            { title: "Rendez-vous", icon: Calendar, path: "/appointments", badge: "Nouveau" },
            { title: "Consultations", icon: Stethoscope, path: "/consultations", permission: "consultation" },
            { title: "Prescriptions", icon: FileText, path: "/prescriptions", permission: "prescription" },
            { title: "Mes Patients", icon: Users, path: "/patients" }
          ]
        },
        {
          title: "DIRECTION MÉDICALE",
          items: [
            { title: "Hospitalisation", icon: Bed, path: "/hospitalization", permission: "admit_patient" },
            { title: "Plateaux Techniques", icon: Activity, path: "/technical-platforms" }
          ]
        }
      ]
    }
  },
  
  pharmacy: {
    admin: {
      sections: [
        {
          title: "GÉNÉRAL",
          items: [
            { title: "Tableau de bord", icon: BarChart, path: "/dashboard" }
          ]
        },
        {
          title: "GESTION",
          items: [
            { title: "Stock médicaments", icon: Package, path: "/stock", permission: "manage_stock" },
            { title: "Commandes", icon: ShoppingCart, path: "/orders" },
            { title: "Fournisseurs", icon: Truck, path: "/suppliers" },
            { title: "Inventaire", icon: ClipboardList, path: "/inventory" }
          ]
        }
      ]
    },
    pharmacist: {
      sections: [
        {
          title: "ACTIVITÉ",
          items: [
            { title: "Dispensation", icon: Pill, path: "/dispensation", permission: "dispense_medication" },
            { title: "Ordonnances", icon: FileText, path: "/prescriptions" },
            { title: "Stock", icon: Package, path: "/stock", permission: "manage_stock" }
          ]
        }
      ]
    }
  },
  
  clinic: {
    // Similaire à hospital mais simplifié
  },
  
  laboratory: {
    admin: {
      sections: [
        {
          title: "GESTION",
          items: [
            { title: "Personnel", icon: Users, path: "/staff" },
            { title: "Équipements", icon: Activity, path: "/equipment" }
          ]
        }
      ]
    },
    lab_tech: {
      sections: [
        {
          title: "ANALYSES",
          items: [
            { title: "Prélèvements", icon: TestTube, path: "/samples" },
            { title: "Résultats", icon: FileText, path: "/results", permission: "validate_lab_results" }
          ]
        }
      ]
    }
  }
};
```

---

## 🔄 CONTEXTE MULTI-ÉTABLISSEMENT

### MultiEstablishmentContext Amélioré

```typescript
interface MultiEstablishmentContextType {
  // Établissement
  establishments: StaffRole[];
  currentEstablishment: StaffRole | null;
  
  // Rôle
  availableRoles: Role[];      // ⭐ NOUVEAU: Rôles disponibles
  currentRole: Role | null;     // ⭐ NOUVEAU: Rôle actif
  
  // Actions
  selectEstablishment: (id: string) => void;
  switchEstablishment: (id: string) => void;
  switchRole: (role: Role) => void;  // ⭐ NOUVEAU: Changer de rôle
  
  // État
  isLoading: boolean;
  selectedEstablishmentId: string | null;
  
  // Helpers
  hasMultipleRoles: boolean;   // ⭐ NOUVEAU: Détecte multi-rôles
  canSwitchContext: boolean;   // ⭐ NOUVEAU: Peut changer contexte
}
```

---

## 🎨 COMPOSANTS CRÉÉS

### 1. Page de Sélection de Rôle

```typescript
// src/pages/professional/SelectRole.tsx

export default function SelectRole() {
  const { availableRoles, switchRole } = useMultiEstablishment();
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Carte ADMIN */}
      <Card 
        onClick={() => switchRole('admin')}
        className="hover:border-primary cursor-pointer"
      >
        <Shield className="h-16 w-16 text-blue-600" />
        <h3>ADMIN</h3>
        <p>Gestion administrative de l'établissement</p>
        <ul>
          • Gestion du personnel
          • Facturation et comptabilité
          • Rapports et statistiques
        </ul>
      </Card>
      
      {/* Carte MÉDECIN */}
      <Card 
        onClick={() => switchRole('doctor')}
        className="hover:border-primary cursor-pointer"
      >
        <Stethoscope className="h-16 w-16 text-green-600" />
        <h3>MÉDECIN</h3>
        <p>Activités médicales et soins</p>
        <ul>
          • Consultations
          • Prescriptions
          • Suivi des patients
        </ul>
      </Card>
    </div>
  );
}
```

### 2. Composant de Bascule Rapide

```typescript
// src/components/layout/RoleAndEstablishmentSwitcher.tsx

export function RoleAndEstablishmentSwitcher() {
  return (
    <div className="flex items-center gap-2 p-2">
      {/* Sélecteur d'établissement */}
      <Select onValueChange={switchEstablishment}>
        <SelectTrigger>
          <Building2 />
          <span>{currentEstablishment?.name || 'Établissement'}</span>
        </SelectTrigger>
        <SelectContent>
          {establishments.map(est => (
            <SelectItem key={est.id} value={est.id}>
              {est.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Sélecteur de rôle */}
      {hasMultipleRoles && (
        <ToggleGroup type="single" value={currentRole}>
          <ToggleGroupItem value="admin" onClick={() => switchRole('admin')}>
            <Shield /> ADMIN
          </ToggleGroupItem>
          <ToggleGroupItem value="doctor" onClick={() => switchRole('doctor')}>
            <Stethoscope /> MÉDECIN
          </ToggleGroupItem>
        </ToggleGroup>
      )}
    </div>
  );
}
```

---

## 🔧 NAVIGATION DYNAMIQUE

### SidebarNav avec Sections Accordéon

```typescript
// src/components/layout/sidebar/SidebarNav.tsx

export function SidebarNav() {
  const { currentEstablishment, currentRole } = useMultiEstablishment();
  
  // Récupérer le menu selon contexte
  const menuConfig = getMenuForContext(
    currentEstablishment?.type,
    currentRole
  );
  
  return (
    <nav>
      {menuConfig.sections.map((section) => (
        <Accordion key={section.title} type="single" collapsible>
          <AccordionItem value={section.title}>
            <AccordionTrigger className="px-3 py-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {section.title}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  href={item.path}
                  icon={item.icon}
                  badge={item.badge}
                  disabled={!hasPermission(item.permission)}
                >
                  {item.title}
                </NavItem>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </nav>
  );
}
```

---

## 🚀 CAS D'USAGE

### Exemple : Dr. Jules DJEKI

```
1. Connexion → directeur.sogara@sante.ga
   ↓
2. Choix établissement → CMST SOGARA
   ↓
3. Choix rôle:
   ┌─────────────┬─────────────┐
   │   ADMIN     │   MÉDECIN   │
   │  (Director) │  (Doctor)   │
   └─────────────┴─────────────┘
   ↓
4a. Si ADMIN sélectionné:
   Menu: Personnel, Facturation, Rapports...
   
4b. Si MÉDECIN sélectionné:
   Menu: Consultations, Prescriptions, Patients...
```

---

## ⚙️ CONFIGURATION

### Types d'Établissements Supportés

| Type | Rôles Possibles | Menu Spécifique |
|------|-----------------|-----------------|
| **hospital** | admin, doctor, nurse, lab_tech | Complet avec hospitalisation |
| **clinic** | admin, doctor, nurse | Simplifié sans urgences |
| **pharmacy** | admin, pharmacist | Focus stock et dispensation |
| **laboratory** | admin, lab_tech | Analyses et résultats |
| **cabinet** | doctor | Minimal consultations |

### Permissions par Rôle

| Rôle | Permissions Typiques |
|------|---------------------|
| **admin** | manage_staff, manage_billing, view_analytics, manage_schedule |
| **doctor** | consultation, prescription, view_dmp, admit_patient |
| **nurse** | view_dmp, emergency_access, triage |
| **pharmacist** | dispense_medication, manage_stock |
| **lab_tech** | order_lab_test, validate_lab_results |

---

## 🔄 BASCULE ENTRE CONTEXTES

### Scénarios de Bascule

1. **Changement d'établissement**
   - Garde le même rôle si disponible
   - Sinon, demande de sélectionner un nouveau rôle

2. **Changement de rôle (même établissement)**
   - Menu se met à jour instantanément
   - Pas de rechargement de page
   - État conservé en localStorage

3. **Déconnexion/Reconnexion**
   - Restaure le dernier contexte utilisé
   - Si invalide, redemande sélection

---

## 📊 ÉTAT DU SYSTÈME

### ✅ Implémenté

- [x] Structure de menus hiérarchique
- [x] Sélection établissement → rôle → menu
- [x] Menus contextuels par type d'établissement
- [x] Filtrage par permissions
- [x] Composant de bascule rapide
- [x] Persistance du contexte
- [x] Navigation accordéon

### 🚧 À Faire

- [ ] Animations de transition
- [ ] Icônes personnalisées par établissement
- [ ] Raccourcis clavier pour bascule
- [ ] Historique de navigation
- [ ] Favoris personnalisés

---

## 🎯 UTILISATION

### Pour les Développeurs

```typescript
// 1. Importer les helpers
import { getMenuForContext } from '@/config/menuDefinitions';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';

// 2. Récupérer le contexte
const { currentEstablishment, currentRole } = useMultiEstablishment();

// 3. Obtenir le menu
const menu = getMenuForContext(
  currentEstablishment?.type,
  currentRole
);

// 4. Vérifier les permissions
const canAccess = hasPermission('manage_staff');
```

### Pour Ajouter un Nouveau Type d'Établissement

```typescript
// Dans menuDefinitions.ts
MENU_DEFINITIONS.nouveau_type = {
  admin: {
    sections: [
      // Définir les sections admin
    ]
  },
  role_specifique: {
    sections: [
      // Définir les sections du rôle
    ]
  }
};
```

---

## 📝 CONCLUSION

L'architecture des menus hiérarchiques permet une navigation contextuelle et intuitive :

- ✅ **Flexible** : S'adapte à tout type d'établissement
- ✅ **Sécurisé** : Respecte les permissions
- ✅ **Intuitif** : Navigation claire et structurée
- ✅ **Performant** : Chargement dynamique des menus
- ✅ **Évolutif** : Facile d'ajouter de nouveaux types/rôles

**Le système est prêt pour la production !** 🚀

---

**Fin du rapport**  
*Version 1.0 - 31 octobre 2025*
