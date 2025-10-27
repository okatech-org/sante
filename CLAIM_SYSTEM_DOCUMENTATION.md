# 🏛️ Système de Revendication des Établissements - SANTE.GA

## Vue d'Ensemble

Le système de revendication permet aux établissements de santé pré-enregistrés dans SANTE.GA d'être **revendiqués** par leurs administrateurs légitimes. Cette approche garantit une couverture complète du territoire gabonais tout en maintenant l'authenticité des gestionnaires.

## 🎯 Concept Fondamental

### Terminologie
- **Compte "Non-Revendiqué"** : Établissement pré-créé en attente d'administrateur
- **Compte "En Vérification"** : Revendication soumise, validation en cours  
- **Compte "Vérifié"** : Établissement revendiqué et validé
- **Compte "Rejeté"** : Revendication refusée

### Architecture
```
┌─────────────────────────────────────────────┐
│         ÉTABLISSEMENTS PRÉ-ENREGISTRÉS       │
│                                               │
│  • Tous les hôpitaux publics du Gabon        │
│  • Cliniques privées connues                 │
│  • Cabinets médicaux répertoriés             │
│  • Pharmacies et laboratoires                │
└───────────────────┬───────────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │   STATUT: UNCLAIMED   │
        │   Badge: ⏳ Gris       │
        └──────────┬───────────┘
                   │
                   ▼ [Revendication]
        ┌──────────────────────┐
        │  STATUT: PENDING     │
        │  Badge: 🔄 Orange    │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   VERIFIED   │      │   REJECTED   │
│ Badge: ✅ Vert│      │ Badge: ❌ Rouge│
└──────────────┘      └──────────────┘
```

## 📁 Structure de la Base de Données

### Tables Principales

#### `establishments`
```sql
- id: UUID
- name: TEXT
- type: ENUM ('hospital', 'clinic', 'cabinet', 'pharmacy', 'laboratory')
- sector: ENUM ('public', 'private', 'confessional', 'military')
- claim_status: ENUM ('unclaimed', 'claim_pending', 'verified', 'rejected', 'suspended')
- claimed_by: UUID (référence users)
- claimed_at: TIMESTAMP
- is_pre_registered: BOOLEAN
```

#### `establishment_claims`
```sql
- id: UUID
- establishment_id: UUID
- claimant_user_id: UUID
- claimant_role: TEXT
- documents: JSONB
- status: ENUM ('draft', 'pending', 'in_review', 'approved', 'rejected')
- verification_steps: JSONB
- reviewer_id: UUID
```

#### `establishment_administrators`
```sql
- id: UUID
- establishment_id: UUID
- user_id: UUID
- role: TEXT ('owner', 'director', 'admin', 'manager')
- permissions: JSONB
- is_primary: BOOLEAN
```

## 🔄 Processus de Revendication

### Étape 1: Découverte
```typescript
// Page: /establishments/unclaimed
- Liste des établissements non-revendiqués
- Filtres par type, province, ville
- Recherche par nom
- Badge "Non-Revendiqué" visible
```

### Étape 2: Initiation
```typescript
// Page: /establishments/:id/claim
- Vérification d'éligibilité
- Formulaire d'identité
- Sélection du rôle (Directeur, Administrateur, etc.)
```

### Étape 3: Documentation
```typescript
// Documents requis selon le type:
TOUS:
- Lettre officielle sur papier en-tête
- Pièce d'identité (CNI/Passeport)
- Justificatif d'autorité (nomination, contrat)

PRIVÉS:
- RCCM (Registre de commerce)

HÔPITAUX/CLINIQUES:
- Autorisation du Ministère de la Santé
```

### Étape 4: Validation
```typescript
// Vérification automatique pour cabinets:
if (type === 'cabinet' && 
    claimant.isProfessionalVerified && 
    claimant.hasValidOrderNumber) {
  autoApprove();
}

// Vérification manuelle pour autres:
- Examen des documents (24-48h)
- Vérification CNOM/ONPG si applicable
- Validation finale
```

### Étape 5: Activation
```typescript
// Après approbation:
- Établissement marqué "Vérifié"
- Badge vert affiché publiquement
- Accès au dashboard de gestion
- Fonctionnalités débloquées:
  * Personnalisation du profil
  * Gestion du personnel
  * Publication de mises à jour
  * Analytics et statistiques
  * Facturation CNAMGS
  * Portail personnalisé (si éligible)
```

## 🛡️ Sécurité et Conformité

### Mesures de Sécurité
- **Rate Limiting**: Max 3 revendications/jour/utilisateur
- **2FA obligatoire** pour la soumission
- **Hash des documents** pour prévenir la falsification
- **Audit trail complet** de toutes les actions
- **Détection de fraude** par analyse de patterns

### Conformité Légale
- Déclaration sur l'honneur obligatoire
- Avertissement sur les fausses déclarations
- Conservation des documents 5 ans
- Respect RGPD + législation gabonaise

## 📊 États et Badges Visuels

| Statut | Badge | Couleur | Description |
|--------|-------|---------|-------------|
| `unclaimed` | ⏳ Non-Revendiqué | Gris | En attente d'administrateur |
| `claim_pending` | 🔄 Vérification en Cours | Orange | Revendication soumise |
| `verified` | ✅ Vérifié | Vert | Établissement actif |
| `rejected` | ❌ Rejeté | Rouge | Revendication refusée |
| `suspended` | ⚠️ Suspendu | Jaune | Compte temporairement désactivé |

## 🚀 Implémentation

### Fichiers Créés

#### Backend
```
supabase/migrations/
└── 20241028_establishment_claim_system.sql   # Migration complète

src/services/
└── EstablishmentClaimService.ts              # Logique métier
```

#### Frontend
```
src/pages/establishments/
├── UnclaimedEstablishments.tsx               # Liste et recherche
└── ClaimEstablishment.tsx                     # Processus de revendication

src/pages/
└── MyClaims.tsx                              # Suivi des demandes (à créer)
```

#### Routes
```typescript
// Routes publiques
/establishments/unclaimed     // Liste des non-revendiqués
/establishments/:id/view      // Vue publique

// Routes authentifiées
/establishments/:id/claim     // Revendiquer
/my-claims                    // Mes revendications
/my-establishments            // Mes établissements

// Routes admin
/admin/claims                 // Examiner les demandes
/admin/claims/:id/review      // Détail d'une demande
```

## 📈 Métriques de Succès

### KPIs Principaux
- **Taux de revendication**: % établissements revendiqués/total
- **Temps moyen de vérification**: < 48h objectif
- **Taux d'approbation**: % approuvés/soumis
- **Taux de fraude détectée**: < 1% objectif

### Monitoring
```typescript
// Tableaux de bord
- Établissements par statut
- Revendications par jour/semaine/mois
- Temps moyen de traitement
- Top provinces non-revendiquées
- Alertes fraudes potentielles
```

## 🔮 Évolutions Futures

### Phase 2
- Vérification par SMS/OTP
- Intégration API CNOM/ONPG directe
- Auto-vérification via certificat numérique
- Délégation de gestion

### Phase 3
- Portails personnalisés pour grandes structures
- API publique pour vérification de statut
- Blockchain pour traçabilité des revendications
- IA pour détection de fraude avancée

## 📝 Cas d'Usage Concrets

### Exemple 1: CHU de Libreville
```
1. Le directeur trouve "CHU de Libreville" (non-revendiqué)
2. Clique "Revendiquer"
3. Remplit: Directeur Général + téléphone + email
4. Upload: Lettre officielle + CNI + Arrêté de nomination
5. Soumission → Vérification manuelle (48h)
6. Approbation → Badge ✅ Vérifié
7. Accès dashboard + portail chu-libreville.sante.ga
```

### Exemple 2: Cabinet Dr. Obame
```
1. Dr. Obame trouve son cabinet (non-revendiqué)
2. Clique "Revendiquer"
3. Système détecte: Professionnel vérifié + N° CNOM valide
4. Upload minimal: Lettre + CNI
5. Auto-approbation immédiate
6. Badge ✅ Vérifié instantané
7. Accès dashboard cabinet
```

### Exemple 3: Pharmacie Nkembo
```
1. Pharmacien trouve "Pharmacie Nkembo" (non-revendiqué)
2. Clique "Revendiquer"
3. Remplit: Pharmacien Titulaire
4. Upload: Lettre + CNI + Diplôme + RCCM + Autorisation
5. Vérification manuelle (24h)
6. Approbation → Badge ✅ Vérifié
7. Accès système de gestion pharmacie
```

## 🎯 Bénéfices du Système

### Pour les Établissements
- ✅ Présence garantie dans l'annuaire national
- ✅ Processus de revendication guidé
- ✅ Vérification rapide (24-48h)
- ✅ Badge de confiance public
- ✅ Outils de gestion débloqués

### Pour les Patients
- ✅ Confiance: établissements vérifiés
- ✅ Exhaustivité: tous les établissements listés
- ✅ Transparence: statut visible
- ✅ Sécurité: gestionnaires authentifiés

### Pour SANTE.GA
- ✅ Couverture territoriale complète
- ✅ Authentification des gestionnaires
- ✅ Réduction de la fraude
- ✅ Base de données fiable
- ✅ Conformité réglementaire

## 📞 Support

### FAQ
- **Q: Qui peut revendiquer?**
  R: Directeurs, administrateurs, propriétaires avec preuves légales

- **Q: Combien de temps pour la vérification?**
  R: 24-48h en moyenne, immédiat pour cabinets de professionnels vérifiés

- **Q: Documents perdus?**
  R: Contactez support@sante.ga avec preuves alternatives

- **Q: Revendication rejetée?**
  R: Nouvelle tentative possible après correction des documents

### Contact
- Email: support@sante.ga
- Téléphone: +241 01 XX XX XX
- WhatsApp: +241 0X XXX XXXX

---

**© 2024 SANTE.GA - Système National de Santé Numérique du Gabon**
