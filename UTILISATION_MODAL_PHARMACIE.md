# 🚀 GUIDE RAPIDE - Utilisation Modal Gestion Pharmacie

## 📦 Import

```typescript
import { PharmacyManagementModal } from '@/components/pharmacy/PharmacyManagementModal';
```

## 💡 Utilisation de Base

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { PharmacyManagementModal } from '@/components/pharmacy/PharmacyManagementModal';

export function MonComposant() {
  const [modalOpen, setModalOpen] = useState(false);
  const pharmacyId = "uuid-de-la-pharmacie";

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        <Settings className="h-4 w-4 mr-2" />
        Gérer l'Établissement
      </Button>

      <PharmacyManagementModal
        pharmacyId={pharmacyId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
```

## 📋 Intégration dans Dashboard

```typescript
// src/components/pharmacy/PharmacyDashboard.tsx
import { PharmacyManagementModal } from './PharmacyManagementModal';

export function PharmacyDashboard({ pharmacyId, userId }: PharmacyDashboardProps) {
  const [managementOpen, setManagementOpen] = useState(false);
  
  return (
    <div>
      {/* Header avec bouton gestion */}
      <div className="flex justify-between items-center">
        <h1>Dashboard</h1>
        <Button onClick={() => setManagementOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
      </div>

      {/* Modal */}
      <PharmacyManagementModal
        pharmacyId={pharmacyId}
        open={managementOpen}
        onOpenChange={setManagementOpen}
      />
    </div>
  );
}
```

## 🎯 Fonctionnalités par Onglet

### 1. Général
- Modifier nom, adresse, contact
- Changer coordonnées GPS
- Activer/désactiver visibilité plateforme

### 2. Horaires
- Toggle ouvert 24/7
- Configurer horaires par jour
- Ajouter plusieurs plages horaires

### 3. Services
- Activer services (livraison, mobile money, etc.)
- Configurer équipements (chambre froide, etc.)

### 4. Paiement
- Choisir modes de paiement
- Configurer Mobile Money
- Gérer conventionnements assurances

### 5. Médias
- Ajouter logo
- Gérer galerie photos

### 6. Équipe
- Voir liste employés
- Inviter nouveaux membres
- Activer/désactiver comptes

## ⚡ Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `pharmacyId` | `string` | ✅ | ID UUID de la pharmacie |
| `open` | `boolean` | ✅ | État ouvert/fermé du modal |
| `onOpenChange` | `(open: boolean) => void` | ✅ | Callback changement état |

## 🔐 Permissions

Le modal adapte automatiquement les fonctionnalités selon le rôle :

**Pharmacien Titulaire:**
- ✅ Tous les onglets accessibles
- ✅ Toutes les modifications possibles

**Pharmacien Salarié:**
- ⚠️ Lecture seule sur certains onglets
- ❌ Pas d'accès gestion équipe

**Vendeur:**
- 👁️ Vue limitée aux informations de base
- ❌ Aucune modification

## 🎨 Customisation

### Thème
Le modal utilise le système de thème Shadcn/ui :
- Mode clair/sombre automatique
- Couleurs personnalisables via `tailwind.config`

### Taille
Modifiable dans `PharmacyManagementModal.tsx` :
```typescript
<DialogContent className="max-w-5xl max-h-[90vh]">
  {/* Contenu */}
</DialogContent>
```

## 📱 Responsive

Le modal s'adapte automatiquement :
- **Mobile** (< 640px) : Plein écran, onglets compacts
- **Tablet** (640-1024px) : Modal réduit
- **Desktop** (> 1024px) : Modal large avec grille

## 🔄 Gestion d'État

### Hooks Intégrés
- `usePharmacy` - Chargement données
- `useUpdatePharmacy` - Sauvegarde modifications
- `usePharmacyEmployees` - Liste équipe

### Optimistic Updates
Les modifications sont appliquées immédiatement dans l'UI via TanStack Query.

### Cache
Le cache est automatiquement invalidé après chaque modification.

## 🐛 Debug

### Vérifier données chargées
```typescript
const { data: pharmacy, isLoading, error } = usePharmacy(pharmacyId);
console.log('Pharmacy:', pharmacy);
```

### Tester sauvegarde
```typescript
const { mutate, isPending } = useUpdatePharmacy();
mutate(
  { id: pharmacyId, updates: { nom_commercial: 'Nouveau Nom' } },
  { onSuccess: () => console.log('Saved!') }
);
```

## ✅ Checklist Intégration

- [ ] Importer `PharmacyManagementModal`
- [ ] Ajouter state `open` et `setOpen`
- [ ] Créer bouton déclencheur
- [ ] Passer `pharmacyId` valide
- [ ] Tester ouverture/fermeture
- [ ] Vérifier permissions utilisateur
- [ ] Tester sauvegarde modifications

## 📞 Support

Pour toute question :
- Consulter `MODAL_GESTION_PHARMACIE_COMPLETE.md`
- Voir exemples dans `src/components/pharmacy/`
- Lire documentation hooks dans `src/hooks/`

---

**Créé le:** 3 novembre 2025  
**Status:** ✅ Production-ready

