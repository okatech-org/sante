-- Ajouter les colonnes pour la signature numérique et l'envoi aux pharmacies dans electronic_prescriptions
ALTER TABLE electronic_prescriptions 
ADD COLUMN IF NOT EXISTS digital_signature TEXT,
ADD COLUMN IF NOT EXISTS signature_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS qr_code_data TEXT,
ADD COLUMN IF NOT EXISTS sent_to_pharmacy BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pharmacy_id UUID REFERENCES establishments(id),
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'received', 'dispensed', 'cancelled'));

-- Table pour l'historique d'envoi aux pharmacies
CREATE TABLE IF NOT EXISTS prescription_pharmacy_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES electronic_prescriptions(id) ON DELETE CASCADE,
  pharmacy_id UUID NOT NULL REFERENCES establishments(id),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'received', 'rejected', 'dispensed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_prescription_pharmacy_log_prescription ON prescription_pharmacy_log(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescription_pharmacy_log_pharmacy ON prescription_pharmacy_log(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_electronic_prescriptions_pharmacy ON electronic_prescriptions(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_electronic_prescriptions_delivery_status ON electronic_prescriptions(delivery_status);

-- RLS pour prescription_pharmacy_log
ALTER TABLE prescription_pharmacy_log ENABLE ROW LEVEL SECURITY;

-- Les professionnels peuvent voir l'historique de leurs prescriptions
CREATE POLICY "Professionals can view their prescription logs"
ON prescription_pharmacy_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM electronic_prescriptions ep
    INNER JOIN professionals pr ON ep.professional_id = pr.id
    WHERE ep.id = prescription_pharmacy_log.prescription_id
    AND pr.user_id = auth.uid()
  )
);

-- Les pharmacies peuvent voir les logs qui les concernent
CREATE POLICY "Pharmacies can view their prescription logs"
ON prescription_pharmacy_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM establishments e
    INNER JOIN establishment_staff es ON e.id = es.establishment_id
    INNER JOIN professionals pr ON es.professional_id = pr.id
    WHERE e.id = prescription_pharmacy_log.pharmacy_id
    AND pr.user_id = auth.uid()
  )
);

-- Les pharmacies peuvent mettre à jour le statut
CREATE POLICY "Pharmacies can update prescription logs"
ON prescription_pharmacy_log FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM establishments e
    INNER JOIN establishment_staff es ON e.id = es.establishment_id
    INNER JOIN professionals pr ON es.professional_id = pr.id
    WHERE e.id = prescription_pharmacy_log.pharmacy_id
    AND pr.user_id = auth.uid()
  )
);

-- Fonction pour générer le QR code data
CREATE OR REPLACE FUNCTION generate_prescription_qr_data(prescription_id UUID)
RETURNS TEXT AS $$
DECLARE
  qr_data TEXT;
BEGIN
  SELECT json_build_object(
    'id', id,
    'number', prescription_number,
    'patient_id', patient_id,
    'professional_id', professional_id,
    'created_at', created_at,
    'signature', digital_signature
  )::TEXT INTO qr_data
  FROM electronic_prescriptions
  WHERE id = prescription_id;
  
  RETURN qr_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;