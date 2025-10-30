-- Créer la table establishment_departments
CREATE TABLE IF NOT EXISTS public.establishment_departments (
  id TEXT PRIMARY KEY,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(establishment_id, code)
);

-- Enable RLS
ALTER TABLE public.establishment_departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Departments are viewable by everyone"
  ON public.establishment_departments
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage departments"
  ON public.establishment_departments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.establishment_staff es
      JOIN public.professionals p ON p.id = es.professional_id
      WHERE p.user_id = auth.uid()
        AND es.establishment_id = establishment_departments.establishment_id
        AND es.is_admin = true
    )
  );

CREATE POLICY "Super admins can manage all departments"
  ON public.establishment_departments
  FOR ALL
  USING (has_role(auth.uid(), 'super_admin'));