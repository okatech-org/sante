-- ============================================
-- MIGRATION: DMP & FACTURATION SANTE.GA
-- Date: 2025-01-15
-- Description: Dossier Médical Patient et système de facturation
-- ============================================

-- 1. DOSSIER MÉDICAL PATIENT (DMP)
-- ============================================

-- Table principale du DMP
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Informations médicales
  allergies JSONB DEFAULT '[]'::jsonb,
  antecedents JSONB DEFAULT '[]'::jsonb,
  current_medications JSONB DEFAULT '[]'::jsonb,
  
  -- Documents médicaux
  documents JSONB DEFAULT '[]'::jsonb, -- Ordonnances, résultats, imagerie
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte unique : un DMP par patient
  UNIQUE(patient_id)
);

-- Index pour performance
CREATE INDEX idx_medical_records_patient ON public.medical_records(patient_id);
CREATE INDEX idx_medical_records_updated ON public.medical_records(updated_at);

-- Table des consentements DMP
CREATE TABLE IF NOT EXISTS public.dmp_access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  
  -- Niveau d'accès
  access_level TEXT NOT NULL CHECK (access_level IN ('read_only', 'read_write', 'full')),
  
  -- Dates
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_dmp_permissions_patient ON public.dmp_access_permissions(patient_id);
CREATE INDEX idx_dmp_permissions_professional ON public.dmp_access_permissions(professional_id);
CREATE INDEX idx_dmp_permissions_establishment ON public.dmp_access_permissions(establishment_id);
CREATE INDEX idx_dmp_permissions_active ON public.dmp_access_permissions(is_active);

-- 2. SYSTÈME DE FACTURATION
-- ============================================

-- Table des factures
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  
  -- Références
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.consultations(id),
  prescription_id UUID REFERENCES public.electronic_prescriptions(id),
  
  -- Montants (en FCFA)
  montant_total INTEGER NOT NULL,
  tarif_conventionne_cnamgs INTEGER,
  prise_en_charge_cnamgs INTEGER,
  gap INTEGER DEFAULT 0, -- Différence tarif conventionné
  ticket_moderateur INTEGER DEFAULT 0,
  reste_a_charge_patient INTEGER NOT NULL,
  
  -- Statut facture
  statut TEXT NOT NULL DEFAULT 'pending' CHECK (statut IN (
    'pending', 'paid_patient', 'awaiting_cnamgs', 'paid_cnamgs', 'cancelled', 'refunded'
  )),
  
  -- CNAMGS
  cnamgs_batch_id TEXT,
  cnamgs_payment_date TIMESTAMP WITH TIME ZONE,
  cnamgs_reference TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_invoices_patient ON public.invoices(patient_id);
CREATE INDEX idx_invoices_establishment ON public.invoices(establishment_id);
CREATE INDEX idx_invoices_statut ON public.invoices(statut);
CREATE INDEX idx_invoices_created ON public.invoices(created_at);

-- Table des paiements
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  -- Montant
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'XAF',
  
  -- Méthode de paiement
  payment_method TEXT NOT NULL CHECK (payment_method IN (
    'cash', 'card', 'mobile_money', 'cnamgs_tiers_payant', 'bank_transfer'
  )),
  operator TEXT, -- 'airtel_money', 'moov_money', 'orange_money'
  transaction_ref TEXT,
  
  -- Statut
  statut TEXT NOT NULL DEFAULT 'pending' CHECK (statut IN (
    'pending', 'completed', 'failed', 'refunded', 'cancelled'
  )),
  
  -- Dates
  payment_date TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_payments_invoice ON public.payments(invoice_id);
CREATE INDEX idx_payments_method ON public.payments(payment_method);
CREATE INDEX idx_payments_statut ON public.payments(statut);

-- 3. ANALYTICS & MÉTRIQUES
-- ============================================

-- Table des événements analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Type d'événement
  event_type TEXT NOT NULL, -- 'consultation_completed', 'prescription_sent', etc.
  
  -- Contexte
  establishment_id UUID REFERENCES public.establishments(id),
  establishment_type TEXT,
  province TEXT,
  
  -- Données anonymisées
  anonymized_patient_demographics JSONB, -- {"age_range": "30-40", "gender": "F"}
  medical_data_anonymized JSONB, -- {"diagnosis_icd10": "I10", "treatment_duration": "30"}
  
  -- Métadonnées
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_establishment ON public.analytics_events(establishment_id);
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp);

-- Table des métriques temps réel
CREATE TABLE IF NOT EXISTS public.real_time_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id),
  
  -- Métrique
  metric_name TEXT NOT NULL, -- 'occupation_rate', 'urgences_count', etc.
  metric_value NUMERIC NOT NULL,
  
  -- Métadonnées
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_metrics_establishment ON public.real_time_metrics(establishment_id);
CREATE INDEX idx_metrics_name ON public.real_time_metrics(metric_name);
CREATE INDEX idx_metrics_timestamp ON public.real_time_metrics(timestamp);

-- 4. FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour générer numéro de facture
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Format: INV-YYYYMMDD-XXXX
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 13) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-%';
  
  new_number := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer reste à charge CNAMGS
CREATE OR REPLACE FUNCTION calculate_cnamgs_charges(
  p_montant_total INTEGER,
  p_taux_cnamgs NUMERIC DEFAULT 0.8,
  p_tarif_conventionne INTEGER DEFAULT NULL
)
RETURNS TABLE(
  tarif_conventionne INTEGER,
  prise_en_charge INTEGER,
  gap INTEGER,
  ticket_moderateur INTEGER,
  reste_a_charge INTEGER
) AS $$
DECLARE
  v_tarif_conventionne INTEGER;
  v_prise_en_charge INTEGER;
  v_gap INTEGER;
  v_ticket_moderateur INTEGER;
  v_reste_a_charge INTEGER;
BEGIN
  -- Utiliser le tarif conventionné fourni ou le montant total
  v_tarif_conventionne := COALESCE(p_tarif_conventionne, p_montant_total);
  
  -- Calculer la prise en charge CNAMGS
  v_prise_en_charge := ROUND(v_tarif_conventionne * p_taux_cnamgs);
  
  -- Calculer le GAP (différence tarif conventionné)
  v_gap := p_montant_total - v_tarif_conventionne;
  
  -- Calculer le ticket modérateur (20% du tarif conventionné)
  v_ticket_moderateur := ROUND(v_tarif_conventionne * (1 - p_taux_cnamgs));
  
  -- Calculer le reste à charge total
  v_reste_a_charge := v_gap + v_ticket_moderateur;
  
  RETURN QUERY SELECT
    v_tarif_conventionne,
    v_prise_en_charge,
    v_gap,
    v_ticket_moderateur,
    v_reste_a_charge;
END;
$$ LANGUAGE plpgsql;

-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dmp_access_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_metrics ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour medical_records
CREATE POLICY "Patients can view their own medical records"
ON public.medical_records FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Professionals can view medical records with permission"
ON public.medical_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.dmp_access_permissions dap
    WHERE dap.patient_id = medical_records.patient_id
    AND dap.professional_id = (
      SELECT id FROM public.professionals WHERE user_id = auth.uid()
    )
    AND dap.is_active = true
    AND (dap.expires_at IS NULL OR dap.expires_at > NOW())
  )
);

-- Politiques RLS pour dmp_access_permissions
CREATE POLICY "Patients can manage their own DMP permissions"
ON public.dmp_access_permissions FOR ALL
USING (auth.uid() = patient_id);

CREATE POLICY "Professionals can view their DMP permissions"
ON public.dmp_access_permissions FOR SELECT
USING (
  professional_id = (SELECT id FROM public.professionals WHERE user_id = auth.uid())
);

-- Politiques RLS pour invoices
CREATE POLICY "Patients can view their own invoices"
ON public.invoices FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Establishment staff can view establishment invoices"
ON public.invoices FOR SELECT
USING (
  establishment_id IN (
    SELECT establishment_id FROM public.establishment_staff
    WHERE professional_id = (SELECT id FROM public.professionals WHERE user_id = auth.uid())
    AND is_admin = true
  )
);

-- Politiques RLS pour payments
CREATE POLICY "Users can view payments for their invoices"
ON public.payments FOR SELECT
USING (
  invoice_id IN (
    SELECT id FROM public.invoices WHERE patient_id = auth.uid()
  )
  OR
  invoice_id IN (
    SELECT i.id FROM public.invoices i
    JOIN public.establishment_staff es ON i.establishment_id = es.establishment_id
    WHERE es.professional_id = (SELECT id FROM public.professionals WHERE user_id = auth.uid())
    AND es.is_admin = true
  )
);

-- 6. TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- ============================================

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables
CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dmp_permissions_updated_at
  BEFORE UPDATE ON public.dmp_access_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. DONNÉES DE TEST
-- ============================================

-- Insérer des métriques de test
INSERT INTO public.real_time_metrics (establishment_id, metric_name, metric_value)
SELECT 
  id,
  'occupation_rate',
  ROUND(RANDOM() * 100, 2)
FROM public.establishments
LIMIT 5;

-- 8. COMMENTAIRES ET DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.medical_records IS 'Dossier Médical Patient centralisé - Vue agrégée de toutes les données médicales';
COMMENT ON TABLE public.dmp_access_permissions IS 'Consentements pour accès au DMP - Contrôle granulaire des permissions';
COMMENT ON TABLE public.invoices IS 'Factures patients - Calcul automatique CNAMGS et reste à charge';
COMMENT ON TABLE public.payments IS 'Paiements - Support Mobile Money et tiers-payant CNAMGS';
COMMENT ON TABLE public.analytics_events IS 'Événements analytics - Big Data anonymisé pour intelligence santé';
COMMENT ON TABLE public.real_time_metrics IS 'Métriques temps réel - Dashboard opérationnel établissements';

COMMENT ON FUNCTION generate_invoice_number() IS 'Génère un numéro de facture unique au format INV-YYYYMMDD-XXXX';
COMMENT ON FUNCTION calculate_cnamgs_charges(INTEGER, NUMERIC, INTEGER) IS 'Calcule automatiquement les charges CNAMGS et reste à charge patient';
