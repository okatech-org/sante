-- Table pour les demandes d'accès au personnel des établissements
CREATE TABLE IF NOT EXISTS public.establishment_staff_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL,
  request_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  UNIQUE(establishment_id, professional_id, status)
);

-- Enable RLS
ALTER TABLE public.establishment_staff_requests ENABLE ROW LEVEL SECURITY;

-- Policies pour establishment_staff_requests
CREATE POLICY "Professionals can create requests"
  ON public.establishment_staff_requests
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals
      WHERE id = establishment_staff_requests.professional_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can view their own requests"
  ON public.establishment_staff_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals
      WHERE id = establishment_staff_requests.professional_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Establishment admins can view requests"
  ON public.establishment_staff_requests
  FOR SELECT
  USING (
    is_establishment_admin(auth.uid(), establishment_id)
  );

CREATE POLICY "Establishment admins can update requests"
  ON public.establishment_staff_requests
  FOR UPDATE
  USING (
    is_establishment_admin(auth.uid(), establishment_id)
  );

CREATE POLICY "Super admins can manage all requests"
  ON public.establishment_staff_requests
  FOR ALL
  USING (
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Index pour améliorer les performances
CREATE INDEX idx_staff_requests_establishment ON public.establishment_staff_requests(establishment_id) WHERE status = 'pending';
CREATE INDEX idx_staff_requests_professional ON public.establishment_staff_requests(professional_id);
CREATE INDEX idx_staff_requests_status ON public.establishment_staff_requests(status);