# 🏗️ Guide d'Architecture Multi-Tenant SANTE.GA

## 📋 Vue d'Ensemble

L'architecture multi-tenant de SANTE.GA est conçue pour gérer la complexité du système de santé gabonais avec ses multiples acteurs et établissements.

### Principes Fondamentaux

1. **Séparation Utilisateurs/Structures** 
   - Un compte unique par personne (patient ou professionnel)
   - Les établissements sont des entités distinctes

2. **Multi-Affectation**
   - Un professionnel peut travailler dans plusieurs établissements
   - Rôles et permissions différents selon l'établissement

3. **Cloisonnement des Données**
   - Isolation stricte par établissement (Row Level Security)
   - Partage contrôlé via consentement patient

4. **Établissements Pré-créés**
   - Tous les établissements du Gabon existent déjà (non-revendiqués)
   - Processus de revendication avec vérification

## 🗂️ Structure des Données

### Tables Principales

#### 1. Gestion des Utilisateurs
- `profiles` - Identité unique par personne
- `patients` - Extension pour les patients (CNAMGS, groupe sanguin, etc.)
- `professionals` - Extension pour les professionnels (ordre, spécialisations, etc.)

#### 2. Gestion des Établissements
- `establishments` - Tous les établissements de santé
- `hospitals` - Données spécifiques aux hôpitaux
- `medical_cabinets` - Données spécifiques aux cabinets
- `pharmacies` - Données spécifiques aux pharmacies
- `laboratories` - Données spécifiques aux laboratoires
- `imaging_centers` - Données spécifiques aux centres d'imagerie

#### 3. Association Personnel-Établissement
- `establishment_staff` - Relation N:N avec rôles et permissions
- `professional_affiliations` - Système legacy de multi-affectation

#### 4. Données Médicales
- `medical_records` - DMP unifié du patient
- `consultations` - Isolées par établissement
- `prescriptions` - Ordonnances électroniques
- `lab_orders` - Examens de laboratoire

#### 5. Gestion du Consentement
- `patient_consents` - Consentements pour accès DMP
- `dmp_access_logs` - Audit trail des accès

## 🔐 Sécurité et Isolation

### Row Level Security (RLS)

```sql
-- Exemple : Les consultations sont visibles uniquement dans l'établissement
CREATE POLICY "Staff can view establishment consultations" ON consultations
FOR SELECT USING (
    establishment_id IN (
        SELECT establishment_id FROM establishment_staff
        WHERE professional_id = auth.uid()
        AND status = 'active'
    )
);
```

### Permissions Granulaires

Chaque affiliation professionnelle peut avoir des permissions spécifiques :
- `create_consultation` - Créer des consultations
- `write_prescription` - Rédiger des ordonnances
- `order_labs` - Prescrire des examens
- `admit_patient` - Admettre des patients
- `access_emergency` - Accès aux urgences
- `manage_staff` - Gérer le personnel

## 🔄 Flux de Travail

### 1. Création de Compte

```javascript
// Patient
await accountService.createAccount({
    email: 'patient@example.com',
    password: 'secure_password',
    profile_type: 'patient',
    profile_data: {
        first_name: 'Jean',
        last_name: 'Dupont',
        date_of_birth: '1990-01-01',
        national_id: 'GAB123456789'
    },
    patient_data: {
        cnamgs_number: 'CNAM123456',
        blood_group: 'O+',
        emergency_contact_name: 'Marie Dupont',
        emergency_contact_phone: '+241 01 23 45 67'
    }
});

// Professionnel
await accountService.createAccount({
    email: 'docteur@example.com',
    password: 'secure_password',
    profile_type: 'professional',
    profile_data: {
        first_name: 'Pierre',
        last_name: 'Martin',
        national_id: 'GAB987654321'
    },
    professional_data: {
        profession_type: 'doctor',
        specializations: ['Cardiologie'],
        ordre_number: 'CNOM2024001',
        ordre_type: 'CNOM',
        years_of_experience: 10
    }
});
```

### 2. Revendication d'Établissement

```javascript
// Rechercher les établissements non revendiqués
const unclaimed = await accountService.searchUnclaimedEstablishments({
    type: 'medical_cabinet',
    city: 'Libreville'
});

// Revendiquer un établissement
await accountService.claimEstablishment(
    professionalId,
    establishmentId,
    {
        role: 'owner',
        documents: {
            official_letter: 'url_to_file',
            identity_proof: 'url_to_file',
            rccm_document: 'url_to_file'
        },
        justification: 'Je suis le propriétaire de ce cabinet médical'
    }
);
```

### 3. Multi-Affectation

```javascript
// Ajouter un professionnel à un établissement
await accountService.addStaffMember(
    establishmentId,
    professionalId,
    {
        role_title: 'Médecin Consultant',
        role_category: 'medical',
        department: 'Cardiologie',
        schedule_type: 'part_time',
        permissions: [
            'create_consultation',
            'write_prescription',
            'order_labs'
        ],
        consultation_fee_standard: 50000,
        consultation_fee_cnamgs: 15000
    },
    adminId
);

// Obtenir tous les établissements d'un professionnel
const establishments = await accountService.getProfessionalEstablishments(professionalId);
// Retourne : [{establishment, role, permissions, department}, ...]
```

### 4. Changement de Contexte

```javascript
// Professionnel change d'établissement actif
const context = await accountService.switchContext(
    professionalId,
    establishmentId
);

// context contient:
{
    establishment: { id, name, type, address },
    role: 'Chef de Service',
    permissions: ['create_consultation', 'write_prescription', 'manage_staff'],
    department: 'Cardiologie'
}
```

### 5. Gestion du Consentement

```javascript
// Patient donne accès à un professionnel
await accountService.managePatientConsent(
    patientId,
    professionalId,
    'professional',
    {
        consent_type: 'read_write',
        access_scope: {
            consultations: true,
            prescriptions: true,
            lab_results: true,
            imaging: false,
            allergies: true,
            medications: true
        },
        expires_at: '2025-12-31',
        granted_via: 'patient_portal'
    }
);

// Patient donne accès à un établissement entier
await accountService.managePatientConsent(
    patientId,
    establishmentId,
    'establishment',
    {
        consent_type: 'emergency_only',
        granted_via: 'in_person'
    }
);
```

### 6. Création de Consultation (avec isolation)

```javascript
// La consultation est automatiquement isolée dans l'établissement
const consultation = await medicalService.createConsultation(
    professionalId,
    establishmentId, // Clé d'isolation
    {
        patient_id: patientId,
        consultation_type: 'in_person',
        chief_complaint: 'Douleur thoracique',
        diagnoses: [{
            icd10_code: 'I20.9',
            description: 'Angine de poitrine',
            type: 'primary'
        }],
        treatment_plan: 'Traitement médicamenteux + suivi',
        follow_up_date: '2024-12-15'
    }
);

// Cette consultation ne sera visible que dans cet établissement
```

## 📊 Cas d'Usage Typiques

### Cas 1 : Médecin Multi-Établissement

Dr. Nguema travaille :
- **CHU Libreville** : Chef de Service Cardiologie (temps plein)
  - Permissions : Toutes
  - Horaires : Lun-Ven 8h-17h
  
- **Clinique El Rapha** : Consultant (temps partiel)
  - Permissions : Consultations et prescriptions
  - Horaires : Sam 9h-13h
  
- **Cabinet Privé** : Propriétaire
  - Permissions : Toutes + gestion administrative
  - Horaires : Mar-Jeu 18h-20h

### Cas 2 : Patient avec DMP Partagé

Mme Obame :
- DMP unifié accessible avec consentement
- Consentements actifs :
  - Dr. Nguema : Accès complet (son cardiologue)
  - CHU Libreville : Accès urgence uniquement
  - Pharmacie du Soleil : Prescriptions uniquement

### Cas 3 : Établissement avec Personnel Mixte

Clinique Moderne :
- 5 médecins permanents
- 3 médecins consultants
- 10 infirmiers
- 2 administrateurs
- Chacun avec des rôles et permissions spécifiques

## 🚀 Déploiement

### Migrations Requises

```bash
# Appliquer les migrations dans l'ordre
npx supabase migration up 20251029_multi_tenant_architecture.sql
npx supabase migration up 20251029_medical_data_tables.sql
npx supabase migration up 20251029_establishment_types.sql
```

### Variables d'Environnement

```env
# Features flags
ENABLE_MULTI_ESTABLISHMENT=true
ENABLE_ESTABLISHMENT_CLAIMING=true
ENABLE_DMP_CONSENT=true
MAX_ESTABLISHMENTS_PER_PROFESSIONAL=10

# Security
ENFORCE_RLS=true
REQUIRE_CONSENT_FOR_DMP=true
AUDIT_ALL_ACCESS=true
```

### Indexes de Performance

```sql
-- Indexes critiques pour les requêtes fréquentes
CREATE INDEX idx_staff_active_establishments 
ON establishment_staff(professional_id, establishment_id) 
WHERE status = 'active';

CREATE INDEX idx_consultations_establishment_date 
ON consultations(establishment_id, consultation_date DESC);

CREATE INDEX idx_active_consents 
ON patient_consents(patient_id, professional_id, establishment_id) 
WHERE is_active = true;
```

## 📈 Monitoring et Métriques

### KPIs à Suivre

1. **Adoption**
   - Nombre d'établissements revendiqués
   - Taux de multi-affectation des professionnels
   - Nombre de consentements actifs

2. **Performance**
   - Temps de changement de contexte
   - Latence des requêtes cross-établissement
   - Taux de cache hit pour les permissions

3. **Sécurité**
   - Tentatives d'accès non autorisés
   - Violations de consentement
   - Audit trail completeness

### Requêtes de Monitoring

```sql
-- Professionnels travaillant dans plusieurs établissements
SELECT 
    p.first_name || ' ' || p.last_name as professional,
    COUNT(DISTINCT es.establishment_id) as nb_establishments,
    ARRAY_AGG(DISTINCT e.name) as establishments
FROM profiles p
JOIN professionals prof ON p.id = prof.profile_id
JOIN establishment_staff es ON prof.id = es.professional_id
JOIN establishments e ON es.establishment_id = e.id
WHERE es.status = 'active'
GROUP BY p.id
HAVING COUNT(DISTINCT es.establishment_id) > 1;

-- Établissements non revendiqués par province
SELECT 
    province,
    establishment_type,
    COUNT(*) as unclaimed_count
FROM establishments
WHERE claim_status = 'unclaimed'
GROUP BY province, establishment_type
ORDER BY province, unclaimed_count DESC;
```

## 🔧 Maintenance

### Tâches Régulières

1. **Hebdomadaire**
   - Revue des revendications en attente
   - Nettoyage des consentements expirés
   - Analyse des logs d'accès suspects

2. **Mensuelle**
   - Audit des permissions
   - Vérification de l'intégrité des affiliations
   - Mise à jour des statistiques d'utilisation

3. **Trimestrielle**
   - Revue de sécurité complète
   - Optimisation des indexes
   - Formation du personnel sur les nouvelles fonctionnalités

## 📚 Ressources

### Documentation Technique
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)

### Standards de Santé
- HL7 FHIR pour l'interopérabilité
- ICD-10 pour les codes diagnostics
- LOINC pour les codes laboratoire

### Conformité
- RGPD pour la protection des données
- Réglementation gabonaise sur les données de santé
- Standards CNAMGS pour la facturation

---

*Ce guide est maintenu par l'équipe technique SANTE.GA*
*Dernière mise à jour : Octobre 2025*
*Version : 1.0.0*
