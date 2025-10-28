# 🏥 Démonstration Architecture Multi-Établissements SANTE.GA

## 📋 Vue d'ensemble

Cette démonstration présente l'implémentation complète de l'architecture multi-établissements de SANTE.GA, permettant aux professionnels de santé de travailler dans plusieurs établissements avec des rôles et permissions différents.

## 🚀 Accès à la démonstration

### URL de la démonstration
```
http://localhost:8080/demo/multi-establishment
```

### Accès depuis la page d'accueil
1. Allez sur `http://localhost:8080`
2. Faites défiler jusqu'à la section "Services"
3. Cliquez sur la carte "Démonstration Multi-Établissements" (carte bleue)

## 🎯 Fonctionnalités démontrées

### 1. Sélecteur d'établissement
- **Composant** : `EstablishmentSwitcher`
- **Fonctionnalité** : Permet de basculer entre les différents établissements où le professionnel travaille
- **Caractéristiques** :
  - Affichage des informations de l'établissement (nom, ville, province)
  - Indication du rôle dans l'établissement
  - Badge "Admin" pour les administrateurs
  - Statut de l'établissement (actif/inactif)
  - Icônes différenciées selon le type d'établissement

### 2. Dashboard contextuel
- **Composant** : `ContextualDashboard`
- **Fonctionnalité** : Interface adaptée selon l'établissement sélectionné
- **Caractéristiques** :
  - Informations de l'établissement en en-tête
  - Actions rapides selon les permissions
  - Statistiques contextuelles
  - Gestion des permissions par établissement

### 3. Dossier Médical Patient (DMP)
- **Composant** : `MedicalRecordViewer`
- **Fonctionnalité** : Dossier médical agrégé avec consentement granulaire
- **Caractéristiques** :
  - Vue d'ensemble (allergies, antécédents, traitements)
  - Historique des consultations par établissement
  - Prescriptions électroniques
  - Documents médicaux
  - Système de consentement pour l'accès

### 4. Calcul de facturation CNAMGS
- **Composant** : `BillingCalculator`
- **Fonctionnalité** : Calcul automatique des charges CNAMGS
- **Caractéristiques** :
  - Vérification des droits CNAMGS
  - Calcul automatique du reste à charge
  - Gestion du GAP (différence tarif)
  - Ticket modérateur
  - Méthodes de paiement multiples

## 🏗️ Architecture technique

### Contexte d'établissement
```typescript
// EstablishmentContext.tsx
const { 
  currentEstablishment, 
  establishments, 
  switchEstablishment, 
  hasPermission, 
  isAdmin 
} = useEstablishment();
```

### Gestion des permissions
```typescript
// Vérification des permissions
if (hasPermission('consultations')) {
  // Afficher les fonctionnalités de consultation
}

// Vérification du statut admin
if (isAdmin) {
  // Afficher les fonctionnalités d'administration
}
```

### Cloisonnement des données
- Chaque consultation/prescription est liée à un `establishment_id`
- Les données restent isolées par établissement
- Le DMP agrège les données avec consentement patient

## 📊 Données de démonstration

### Patients de test
- **Mme ONDO Marie** (CNAMGS-123456)
- **M. EYANG Paul** (CNAMGS-789012)
- **Mme BOUNDA Alice** (CNAMGS-345678)

### Établissements simulés
- **CHU Owendo** (Hôpital public)
- **Clinique Sainte-Marie** (Clinique privée)
- **Cabinet Médical Glass** (Cabinet privé)

## 🔧 Configuration requise

### Dépendances
```json
{
  "@radix-ui/react-separator": "^1.0.3",
  "@tanstack/react-query": "^5.0.0",
  "lucide-react": "^0.400.0"
}
```

### Variables d'environnement
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## 🎨 Interface utilisateur

### Design system
- **Couleurs** : Palette cohérente avec le thème SANTE.GA
- **Typographie** : Hiérarchie claire des informations
- **Icônes** : Lucide React pour la cohérence
- **Animations** : Transitions fluides et micro-interactions

### Responsive design
- **Mobile** : Interface adaptée pour les petits écrans
- **Tablet** : Grille adaptative
- **Desktop** : Interface complète avec sidebar

## 🔐 Sécurité et permissions

### Règles de sécurité
1. **Cloisonnement strict** : Les données d'un établissement ne sont pas visibles depuis un autre
2. **Permissions granulaires** : Chaque action nécessite une permission spécifique
3. **Consentement patient** : Accès au DMP soumis au consentement
4. **Audit trail** : Toutes les actions sont tracées

### Matrice des permissions
| Action | Patient | Médecin | Infirmier | Admin |
|--------|---------|---------|-----------|-------|
| Voir DMP | ✅ (sien) | ✅ (autorisé) | ✅ (autorisé) | ❌ |
| Créer consultation | ❌ | ✅ | ❌ | ❌ |
| Gérer staff | ❌ | ❌ | ❌ | ✅ |

## 🚀 Prochaines étapes

### Fonctionnalités à implémenter
1. **Analytics temps réel** : Tableaux de bord avec métriques en direct
2. **Notifications push** : Système de notifications contextuelles
3. **Téléconsultations** : Intégration WebRTC
4. **Mobile app** : Application React Native
5. **API externes** : Intégration CNAMGS/CNSS réelle

### Améliorations techniques
1. **Cache Redis** : Optimisation des performances
2. **WebSockets** : Mise à jour temps réel
3. **Tests automatisés** : Couverture de code complète
4. **CI/CD** : Pipeline de déploiement automatisé

## 📞 Support

Pour toute question ou problème :
- **Email** : support@sante.ga
- **Documentation** : [docs.sante.ga](https://docs.sante.ga)
- **GitHub** : [github.com/sante-ga](https://github.com/sante-ga)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Auteur** : Équipe SANTE.GA
