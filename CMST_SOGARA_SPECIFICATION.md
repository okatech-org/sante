# 🏥 Spécification Technique - Centre de Médecine de Santé au Travail (CMST) SOGARA

## 📋 Identification Précise de la Structure

### Informations Officielles
| Champ | Valeur |
|-------|--------|
| **Nom Officiel** | Centre de Médecine de Santé au Travail (CMST) SOGARA |
| **Noms Courants** | Hôpital de SOGARA, Infirmerie SOGARA |
| **Type de Structure** | Service de Santé au Travail d'Entreprise |
| **Entreprise Rattachée** | Société Gabonaise de Raffinage (SOGARA) |
| **Localisation** | Port-Gentil, Gabon |
| **Province** | Ogooué-Maritime |
| **Adresse Physique** | Route de la Sogara, Port-Gentil, Gabon |
| **Zone Géographique** | Zone Port |

### Coordonnées de Contact
| Moyen | Valeur |
|------|--------|
| **GPS** | -0.681398, 8.772557 |
| **Téléphone Principal** | +241 01 55 26 21 |
| **Téléphone Secondaire** | +241 01 55 26 22 / +241 01 55 26 23 |
| **Email** | service.rgc@sogara.com (Suggéré) |
| **Site Web** | https://www.sogara.com |
| **Secteur** | Privé (d'entreprise) |

---

## 🏛️ Nature & Statut Juridique

### Type d'Établissement
Le CMST SOGARA est un **service de santé au travail intégré à l'entreprise**, distinc d'un hôpital ou clinique généraliste.

**Statut** : Service de Santé au Travail d'Entreprise
- ✅ Conventionné CNAMGS pour les consultations réglementaires
- ✅ Soumis à la législation gabonaise sur la médecine du travail
- ✅ Spécialisé dans le suivi médical des employés SOGARA

### Public Cible Principal
- **Employés SOGARA** (permanents + contractuels)
- **Ayants droit** (familles des employés, selon politique interne)
- **Visiteurs externes** : Accès non confirmé publiquement

---

## 👥 Ressources Humaines

### Personnel Clé Identifié

| Rôle | Effectif Estimé | Responsabilités |
|-----|----------------|--------------------|
| Médecin du Travail | 1 | Suivi médical réglementaire, prévention risques |
| Infirmier(ère) d'Entreprise | 1-2 | Soins courants, assistances, urgences |
| Personnel Administratif | 1-2 | Dossiers médicaux, planification, procédures |
| **TOTAL ESTIMÉ** | **3-5 | - |

**Note** : Chiffres basés sur la taille typique d'un CMST en entreprise.

---

## 🏥 Services Offerts

### Services Réglementaires Obligatoires

#### 1. Suivi Médical Réglementaire
```
- Visites médicales d'embauche (obligatoire)
- Visites médicales périodiques (annuelles minimum)
- Visites médicales de reprise (après congé long)
- Visites médicales d'information (selon risques)
- Surveillance du travailleur (dossier actualisé)
```

#### 2. Prévention des Risques Professionnels
```
- Évaluation des postes de travail
- Analyse des risques professionnels
- Conseils à l'entreprise (SOGARA)
- Élaboration fiches de sécurité
- Formation hygiène et sécurité
```

#### 3. Soins de Première Nécessité (Infirmerie)
```
- Soins d'urgence et premiers secours
- Soins de plaies et pansements
- Mesures vitales et observations
- Orientation vers spécialistes externes
```

#### 4. Gestion des Accidents du Travail
```
- Déclaration accidents de travail
- Documentation médicale accidents
- Suivi des maladies professionnelles
- Coordination avec CNSS (Assurance)
```

#### 5. Campagnes de Santé
```
- Campagnes de vaccination (grippe, tétanos, COVID)
- Sensibilisation santé au travail
- Dépistages (maladies chroniques)
- Promotion hygiène occupationnelle
```

### Capacités Installées

| Ressource | Quantité | Statut |
|-----------|----------|--------|
| **Salles de Consultation** | 3 | Active |
| **Lits d'Hospitalisation** | 0 | N/A (Centre médical ≠ Hôpital) |
| **Blocs Opératoires** | 0 | N/A |
| **Service Urgences 24/7** | Non | N/A |
| **Laboratoire** | Non en site | Orientation externe |
| **Imagerie** | Non en site | Orientation externe |

**Note** : CMST = Médecine préventive et curative légère, pas établissement hospitalier.

---

## 🔄 Workflow d'Accès - Employés SOGARA

```
┌─────────────────────────────────────────────────────────┐
│ EMPLOYÉ SOGARA ACCÈDE AU CMST                           │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼──────┐      ┌──────▼────┐
    │ URGENCE  │      │CONSULTATION│
    │(Infirmerie)     │(Médecin/Inf)
    └───┬──────┘      └──────┬────┘
        │                     │
        │             ┌───────┴────────┐
        │             │                │
   ┌────▼────┐   ┌───▼────┐    ┌─────▼───┐
   │Soins    │   │Visite  │    │Prévention│
   │Courants │   │Réglmt. │    │ & Risques│
   └─────────┘   └────────┘    └──────────┘
        │             │              │
        └─────────┬───┴──────────────┘
                  │
        ┌─────────▼──────────┐
        │DOSSIER MÉDICAL     │
        │ACTUALISÉ SOGARA    │
        └────────────────────┘
                  │
        ┌─────────▼──────────────────┐
        │ORIENTATION si NÉCESSAIRE   │
        │- Médecin spécialiste       │
        │- Laboratoire               │
        │- Imagerie                  │
        │- Hospitalisation externe   │
        └────────────────────────────┘
```

---

## 📊 Données Implémentation BD

### Table `establishments` - Champs CMST SOGARA

```json
{
  "id": "[UUID généré]",
  "raison_sociale": "Centre de Médecine de Santé au Travail (CMST) SOGARA",
  "type_etablissement": "centre_medical",
  "secteur": "prive",
  "numero_autorisation": "2024-CMST-SOGARA-001",
  
  "adresse_rue": "Route de la Sogara",
  "adresse_quartier": "Zone Port",
  "ville": "Port-Gentil",
  "province": "Ogooué-Maritime",
  "code_postal": null,
  "latitude": -0.681398,
  "longitude": 8.772557,
  "repere_geographique": "Zone industrielle Port, installations SOGARA",
  
  "telephone_standard": "+241 01 55 26 21",
  "telephone_urgences": "+241 01 55 26 22",
  "email": "sogara.demo@sante.ga",
  "site_web": "https://www.sogara.com",
  "whatsapp_business": null,
  
  "nombre_lits_total": 0,
  "nombre_blocs_operatoires": 0,
  "nombre_salles_consultation": 3,
  "service_urgences_actif": false,
  
  "cnamgs_conventionne": true,
  "cnamgs_numero_convention": "[À obtenir]",
  "cnamgs_tiers_payant_actif": true,
  
  "taux_occupation": null,
  "satisfaction_moyenne": null,
  "nombre_avis": 0,
  
  "statut": "actif",
  "date_inscription": "2024-10-27",
  "created_at": "2024-10-27T...",
  "updated_at": "2024-10-27T..."
}
```

### Table `establishment_services` - Services CMST

```json
[
  {
    "establishment_id": "[UUID CMST]",
    "nom": "Suivi Médical Réglementaire",
    "code": "SUIVI_MED_REGL",
    "responsable_nom": "Dr. Médecin du Travail",
    "actif": true,
    "nombre_lits": 0,
    "nombre_medecins": 1,
    "nombre_infirmiers": 0,
    "horaires": { "lun-ven": "08:00-16:00", "sam": "08:00-12:00", "dim": "fermé" }
  },
  {
    "establishment_id": "[UUID CMST]",
    "nom": "Infirmerie & Soins Courants",
    "code": "INFIRMERIE",
    "responsable_nom": "Infirmier(ère) Principal",
    "actif": true,
    "nombre_lits": 0,
    "nombre_medecins": 0,
    "nombre_infirmiers": 2,
    "horaires": { "lun-ven": "06:00-18:00", "sam": "08:00-12:00", "dim": "fermé" }
  },
  {
    "establishment_id": "[UUID CMST]",
    "nom": "Prévention des Risques Professionnels",
    "code": "PREVENTION",
    "responsable_nom": "Dr. Médecin du Travail",
    "actif": true,
    "nombre_lits": 0,
    "nombre_medecins": 1,
    "nombre_infirmiers": 0,
    "horaires": { "lun-ven": "08:00-12:00 / 14:00-16:00", "sam": "fermé", "dim": "fermé" }
  }
]
```

### Table `establishment_users` - Permissions Admin

```json
{
  "establishment_id": "[UUID CMST]",
  "user_id": "[UUID admin SOGARA]",
  "role": "administrateur",
  "permissions": {
    "manage_staff": true,
    "manage_services": true,
    "manage_equipment": false,
    "manage_finances": true,
    "view_statistics": true,
    "manage_appointments": true,
    "manage_prescriptions": true,
    "manage_medical_records": true,
    "view_workplace_health_reports": true
  },
  "actif": true,
  "created_at": "2024-10-27T...",
  "updated_at": "2024-10-27T..."
}
```

---

## 📱 Interface d'Utilisation

### Pour les Employés SOGARA
- **Accès** : Via portail patient SANTE.GA
- **Fonctionnalités** :
  - Consulter calendrier des visites médicales réglementaires
  - Prendre RDV infirmerie
  - Accéder à son dossier médical (CMST)
  - Recevoir rappels visites périodiques
  - Consulter résultats examens

### Pour le CMST SOGARA (Admin)
- **Accès** : Dashboard établissement `/demo/sogara`
- **Fonctionnalités** :
  - Gérer agenda des consultations
  - Imprimer certificats d'aptitude
  - Générer rapports santé au travail
  - Tracker accidents du travail
  - Planifier campagnes vaccination
  - Exporter données pour CNAMGS/CNSS

---

## 🔐 Spécificités de Sécurité

### Données Sensibles - CMST SOGARA
- ✅ **Dossiers médicaux confidentiels** : Accès limité aux autorisés
- ✅ **Données emploi** : Liaison sécurisée avec RH SOGARA
- ✅ **Attestations aptitude** : Signature électronique requise
- ✅ **Rapports accidents** : Conformité réglementaire (CNSS)

### Conformité Légale
- Législation gabonaise sur médecine du travail
- Respect secret médical
- Protection données personnelles (RGPD-style)
- Obligations reporting CNAMGS/CNSS

---

## 📊 État d'Implémentation

| Composant | Statut | Notes |
|-----------|--------|-------|
| Compte démo CMST | ✅ | Créé avec données correctes |
| Profil établissement BD | ✅ | Type `centre_medical`, 3 salles |
| Route `/demo/sogara` | ✅ | Accessible |
| Services démo | ✅ | Suivi réglementaire, Infirmerie, Prévention |
| **Médecins/Staff** | ⏳ | À ajouter Phase 2 |
| **RDV en ligne** | ⏳ | À impl Phase 3 |
| **Certificats aptitude** | ⏳ | Feature spécialisée |

---

## 🚀 Prochaines Étapes

### Phase 2 : Équipe Médicale CMST (2-3h)
- [ ] Créer compte Médecin du Travail SOGARA
- [ ] Créer comptes Infirmiers SOGARA
- [ ] Configurer horaires services
- [ ] Tester prise RDV

### Phase 3 : RDV Réglementaires (3-4h)
- [ ] Implémentation calendrier réglementaire
- [ ] Notifications rappels visites
- [ ] Génération certificats aptitude
- [ ] Export données CNAMGS

### Phase 5 : Facturation Spécifique CMST
- [ ] Tarifs consultations CNAMGS
- [ ] Gestion tiers-payant SOGARA
- [ ] Rapports financiers CMST

---

**Version** : 1.0  
**Date** : Octobre 2024  
**Statut** : 📝 Spécification Validée - Prête Implémentation
