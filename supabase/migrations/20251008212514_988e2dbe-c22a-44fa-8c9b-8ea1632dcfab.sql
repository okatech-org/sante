-- Corriger la fonction generate_prescription_number avec search_path sécurisé
DROP FUNCTION IF EXISTS generate_prescription_number();

CREATE OR REPLACE FUNCTION generate_prescription_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  prefix TEXT;
BEGIN
  prefix := 'RX' || TO_CHAR(NOW(), 'YYYYMM');
  
  SELECT prefix || LPAD(COALESCE(MAX(CAST(SUBSTRING(prescription_number FROM 9) AS INTEGER)), 0) + 1, 6, '0')
  INTO new_number
  FROM public.electronic_prescriptions
  WHERE prescription_number LIKE prefix || '%';
  
  RETURN new_number;
END;
$$;