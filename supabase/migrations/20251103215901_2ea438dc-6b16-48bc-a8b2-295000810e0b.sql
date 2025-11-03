-- ============================================
-- MIGRATION: SYSTÈME PHARMACIES & PROFESSIONNELS
-- Date: 3 novembre 2025
-- Description: Tables pour la gestion des pharmacies et professionnels pharmaceutiques au Gabon
-- Conformité: ONPG (Ordre National des Pharmaciens du Gabon)
-- ============================================

-- Drop existing simple pharmacies table
DROP TABLE IF EXISTS public.pharmacies CASCADE;

-- ============================================
-- ENABLE POSTGIS (pour géolocalisation)
-- ============================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- TABLE: pharmacies (Établissements)
-- ============================================
CREATE TABLE public.pharmacies (
    -- Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_pharmacie VARCHAR(20) UNIQUE NOT NULL,
    
    -- Informations Établissement
    nom_commercial VARCHAR(255) NOT NULL,
    enseigne VARCHAR(255),
    type_structure VARCHAR(50) NOT NULL CHECK (type_structure IN ('officine_privee', 'officine_publique', 'pharmacie_hospitaliere')),
    numero_autorisation_ouverture VARCHAR(100) UNIQUE,
    date_autorisation DATE,
    
    -- Inscription ONPG
    numero_inscription_onpg VARCHAR(50) UNIQUE,
    date_inscription_onpg DATE,
    statut_onpg VARCHAR(20) DEFAULT 'actif' CHECK (statut_onpg IN ('actif', 'suspendu', 'radie')),
    
    -- Localisation
    adresse_complete TEXT NOT NULL,
    quartier VARCHAR(100),
    ville VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10),
    
    -- Géolocalisation GPS
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geolocation GEOGRAPHY(POINT, 4326),
    
    -- Repères géographiques
    reperes_geographiques TEXT,
    
    -- Contact
    telephone_principal VARCHAR(20) NOT NULL,
    telephone_secondaire VARCHAR(20),
    telephone_urgence VARCHAR(20),
    email VARCHAR(255),
    site_web VARCHAR(255),
    
    -- Horaires
    ouvert_24_7 BOOLEAN DEFAULT FALSE,
    horaires JSONB DEFAULT '{}'::jsonb,
    jours_fermeture JSONB DEFAULT '[]'::jsonb,
    
    -- Services Disponibles
    services_disponibles JSONB DEFAULT '[]'::jsonb,
    
    -- Paiements Acceptés
    modes_paiement JSONB DEFAULT '["especes", "carte_bancaire"]'::jsonb,
    mobile_money_providers JSONB,
    
    -- Assurances Conventionnées
    conventionnement_cnamgs BOOLEAN DEFAULT FALSE,
    numero_convention_cnamgs VARCHAR(50),
    autres_assurances_acceptees JSONB,
    
    -- Équipements
    dispose_chambre_froide BOOLEAN DEFAULT FALSE,
    dispose_armoire_securisee BOOLEAN DEFAULT FALSE,
    dispose_balance_electronique BOOLEAN DEFAULT FALSE,
    
    -- Capacité
    nombre_employes INTEGER DEFAULT 1,
    surface_m2 DECIMAL(10, 2),
    capacite_stockage_medicaments INTEGER,
    
    -- Visibilité Plateforme
    visible_plateforme BOOLEAN DEFAULT TRUE,
    accepte_commandes_en_ligne BOOLEAN DEFAULT TRUE,
    accepte_reservations BOOLEAN DEFAULT TRUE,
    delai_preparation_moyen_minutes INTEGER DEFAULT 15,
    
    -- Images & Médias
    logo_url VARCHAR(500),
    photos_pharmacie JSONB,
    
    -- Statut & Validation
    statut_verification VARCHAR(20) DEFAULT 'en_attente' CHECK (statut_verification IN ('en_attente', 'verifie', 'refuse', 'suspendu')),
    verifie_par_admin UUID,
    date_verification TIMESTAMP,
    motif_refus TEXT,
    
    -- Pharmacien Titulaire
    pharmacien_titulaire_id UUID,
    
    -- Performance
    note_moyenne DECIMAL(3, 2) DEFAULT 0.00,
    nombre_avis INTEGER DEFAULT 0,
    nombre_commandes_total INTEGER DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    
    -- Contraintes
    CONSTRAINT check_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT check_longitude CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT check_note CHECK (note_moyenne >= 0 AND note_moyenne <= 5)
);

-- ============================================
-- TABLE: professionnels_sante_pharmacie
-- ============================================
CREATE TABLE public.professionnels_sante_pharmacie (
    -- Identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    code_professionnel VARCHAR(20) UNIQUE NOT NULL,
    
    -- Type Professionnel
    type_professionnel VARCHAR(50) NOT NULL CHECK (type_professionnel IN ('dr_pharmacie', 'vendeur_pharmacie')),
    
    -- Informations Personnelles
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    nom_complet VARCHAR(255) GENERATED ALWAYS AS (prenom || ' ' || nom) STORED,
    
    sexe VARCHAR(10) CHECK (sexe IN ('M', 'F', 'Autre')),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    nationalite VARCHAR(100) NOT NULL,
    
    -- Contact
    telephone_mobile VARCHAR(20) NOT NULL,
    telephone_fixe VARCHAR(20),
    email_professionnel VARCHAR(255) NOT NULL UNIQUE,
    adresse_personnelle TEXT,
    ville_residence VARCHAR(100),
    
    -- Photo Identité
    photo_url VARCHAR(500),
    
    -- Formation (Dr en Pharmacie)
    diplome_pharmacie VARCHAR(100),
    universite VARCHAR(255),
    pays_obtention_diplome VARCHAR(100),
    annee_obtention_diplome INTEGER,
    specialisation VARCHAR(100) CHECK (specialisation IN ('pharmacie_clinique', 'pharmacie_hospitaliere', 'biologie_medicale', 'pharmacie_industrielle')),
    
    -- Inscription ONPG
    numero_inscription_onpg VARCHAR(50) UNIQUE,
    date_inscription_onpg DATE,
    statut_onpg VARCHAR(20) CHECK (statut_onpg IN ('actif', 'suspendu', 'radie')),
    
    -- Autorisation Exercice
    numero_autorisation_exercice VARCHAR(100),
    date_autorisation_exercice DATE,
    autorite_delivrance VARCHAR(255),
    annees_experience INTEGER,
    
    -- Documents Justificatifs
    copie_diplome_url VARCHAR(500),
    copie_carte_onpg_url VARCHAR(500),
    copie_cni_url VARCHAR(500),
    extrait_casier_judiciaire_url VARCHAR(500),
    certificat_nationalite_url VARCHAR(500),
    
    -- Vendeur Pharmacie
    niveau_etude VARCHAR(100),
    formation_professionnelle VARCHAR(255),
    certificat_formation_url VARCHAR(500),
    supervise_par_pharmacien_id UUID REFERENCES public.professionnels_sante_pharmacie(id),
    
    -- Rattachement Pharmacie
    pharmacie_principale_id UUID REFERENCES public.pharmacies(id),
    est_pharmacien_titulaire BOOLEAN DEFAULT FALSE,
    pharmacies_secondaires JSONB DEFAULT '[]'::jsonb,
    
    statut_emploi VARCHAR(50) NOT NULL CHECK (statut_emploi IN ('titulaire', 'salarie', 'remplacant', 'stagiaire', 'liberal')),
    date_embauche DATE,
    date_fin_contrat DATE,
    
    -- Permissions & Rôles
    permissions JSONB DEFAULT '[]'::jsonb,
    acces_gestion_stocks BOOLEAN DEFAULT FALSE,
    acces_facturation BOOLEAN DEFAULT FALSE,
    acces_rapports_activite BOOLEAN DEFAULT FALSE,
    acces_administration BOOLEAN DEFAULT FALSE,
    
    -- Statut & Validation
    statut_verification VARCHAR(20) DEFAULT 'en_attente' CHECK (statut_verification IN ('en_attente', 'verifie', 'refuse', 'suspendu')),
    verifie_par_admin UUID,
    date_verification TIMESTAMP,
    motif_refus TEXT,
    compte_actif BOOLEAN DEFAULT TRUE,
    date_desactivation TIMESTAMP,
    motif_desactivation TEXT,
    
    -- Performance & Activité
    nombre_dispensations INTEGER DEFAULT 0,
    nombre_validations_ordonnances INTEGER DEFAULT 0,
    note_moyenne DECIMAL(3, 2) DEFAULT 0.00,
    nombre_evaluations INTEGER DEFAULT 0,
    derniere_connexion TIMESTAMP,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID
);

-- ============================================
-- TABLE: pharmacie_employes (Historique)
-- ============================================
CREATE TABLE public.pharmacie_employes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    pharmacie_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    professionnel_id UUID NOT NULL REFERENCES public.professionnels_sante_pharmacie(id) ON DELETE CASCADE,
    
    -- Type Relation
    type_relation VARCHAR(50) NOT NULL CHECK (type_relation IN ('titulaire', 'salarie', 'remplacant', 'stagiaire')),
    
    -- Période
    date_debut DATE NOT NULL,
    date_fin DATE,
    est_actif BOOLEAN DEFAULT TRUE,
    
    -- Détails Contrat
    type_contrat VARCHAR(50) CHECK (type_contrat IN ('CDI', 'CDD', 'Remplacement', 'Stage')),
    nombre_heures_semaine DECIMAL(5, 2),
    salaire_mensuel DECIMAL(12, 2),
    
    -- Permissions Spécifiques
    permissions_specifiques JSONB DEFAULT '[]'::jsonb,
    
    -- Motif Fin
    motif_fin VARCHAR(50) CHECK (motif_fin IN ('demission', 'licenciement', 'fin_contrat', 'retraite', 'mutation')),
    commentaire TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(pharmacie_id, professionnel_id, date_debut)
);

-- ============================================
-- FOREIGN KEY: pharmacien_titulaire_id
-- ============================================
ALTER TABLE public.pharmacies 
ADD CONSTRAINT fk_pharmacies_titulaire 
FOREIGN KEY (pharmacien_titulaire_id) 
REFERENCES public.professionnels_sante_pharmacie(id);

-- ============================================
-- INDEX PERFORMANCE
-- ============================================

CREATE INDEX idx_pharmacies_ville_province ON public.pharmacies(ville, province);
CREATE INDEX idx_pharmacies_ouvert_24_7 ON public.pharmacies(ouvert_24_7) WHERE ouvert_24_7 = TRUE;
CREATE INDEX idx_pharmacies_statut ON public.pharmacies(statut_verification);
CREATE INDEX idx_pharmacies_visible ON public.pharmacies(visible_plateforme) WHERE visible_plateforme = TRUE;
CREATE INDEX idx_pharmacies_cnamgs ON public.pharmacies(conventionnement_cnamgs) WHERE conventionnement_cnamgs = TRUE;
CREATE INDEX idx_pharmacies_geolocation ON public.pharmacies USING GIST(geolocation);

CREATE INDEX idx_prof_pharmacie_type ON public.professionnels_sante_pharmacie(type_professionnel);
CREATE INDEX idx_prof_pharmacie_pharmacie ON public.professionnels_sante_pharmacie(pharmacie_principale_id);
CREATE INDEX idx_prof_pharmacie_statut ON public.professionnels_sante_pharmacie(statut_verification);
CREATE INDEX idx_prof_pharmacie_onpg ON public.professionnels_sante_pharmacie(numero_inscription_onpg);
CREATE INDEX idx_prof_pharmacie_actif ON public.professionnels_sante_pharmacie(compte_actif) WHERE compte_actif = TRUE;
CREATE INDEX idx_prof_pharmacie_user ON public.professionnels_sante_pharmacie(user_id);

CREATE INDEX idx_pharmacie_employes_pharmacie ON public.pharmacie_employes(pharmacie_id);
CREATE INDEX idx_pharmacie_employes_professionnel ON public.pharmacie_employes(professionnel_id);
CREATE INDEX idx_pharmacie_employes_actif ON public.pharmacie_employes(est_actif) WHERE est_actif = TRUE;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pharmacies_updated_at 
    BEFORE UPDATE ON public.pharmacies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionnels_updated_at 
    BEFORE UPDATE ON public.professionnels_sante_pharmacie 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employes_updated_at 
    BEFORE UPDATE ON public.pharmacie_employes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_geolocation()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geolocation = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pharmacies_geolocation 
    BEFORE INSERT OR UPDATE OF latitude, longitude ON public.pharmacies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_geolocation();

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionnels_sante_pharmacie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacie_employes ENABLE ROW LEVEL SECURITY;

-- Pharmacies visibles par tous
CREATE POLICY "Pharmacies visibles par tous"
ON public.pharmacies FOR SELECT
TO public
USING (visible_plateforme = TRUE AND statut_verification = 'verifie');

-- Professionnels visibles par tous si vérifiés
CREATE POLICY "Professionnels vérifiés visibles par tous"
ON public.professionnels_sante_pharmacie FOR SELECT
TO public
USING (statut_verification = 'verifie' AND compte_actif = TRUE);