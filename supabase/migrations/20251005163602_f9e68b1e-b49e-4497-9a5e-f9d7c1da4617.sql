-- Table pour stocker les pharmacies
CREATE TABLE IF NOT EXISTS public.pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours JSONB,
  services TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour suivre les envois d'ordonnances aux pharmacies
CREATE TABLE IF NOT EXISTS public.prescription_pharmacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prescription_id TEXT NOT NULL,
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_pharmacy_requests ENABLE ROW LEVEL SECURITY;

-- Policies pour pharmacies (lecture publique)
CREATE POLICY "Anyone can view pharmacies"
  ON public.pharmacies
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage pharmacies"
  ON public.pharmacies
  FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- Policies pour prescription_pharmacy_requests
CREATE POLICY "Users can view their own pharmacy requests"
  ON public.prescription_pharmacy_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create pharmacy requests"
  ON public.prescription_pharmacy_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pharmacies can view requests sent to them"
  ON public.prescription_pharmacy_requests
  FOR SELECT
  USING (has_role(auth.uid(), 'pharmacy'::app_role));

CREATE POLICY "Pharmacies can update requests sent to them"
  ON public.prescription_pharmacy_requests
  FOR UPDATE
  USING (has_role(auth.uid(), 'pharmacy'::app_role));

-- Trigger pour updated_at
CREATE TRIGGER update_pharmacies_updated_at
  BEFORE UPDATE ON public.pharmacies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescription_pharmacy_requests_updated_at
  BEFORE UPDATE ON public.prescription_pharmacy_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques pharmacies d'exemple
INSERT INTO public.pharmacies (name, address, city, province, phone, latitude, longitude) VALUES
  ('Pharmacie Centrale', 'Boulevard Triomphal', 'Libreville', 'Estuaire', '+241 01 73 45 67', 0.4162, 9.4673),
  ('Pharmacie du Mont-Bouët', 'Avenue de la Liberté', 'Libreville', 'Estuaire', '+241 01 73 45 68', 0.3947, 9.4536),
  ('Pharmacie de l''Aéroport', 'Route de l''Aéroport', 'Libreville', 'Estuaire', '+241 01 73 45 69', 0.4586, 9.4125),
  ('Pharmacie Port-Gentil Centre', 'Avenue Savorgnan de Brazza', 'Port-Gentil', 'Ogooué-Maritime', '+241 01 55 23 45', -0.7193, 8.7815),
  ('Pharmacie Franceville', 'Avenue Omar Bongo', 'Franceville', 'Haut-Ogooué', '+241 01 67 89 12', -1.6332, 13.5830);