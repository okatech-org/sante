-- Professionals need to view and manage their own appointments
-- Create SELECT policy for professionals on appointments
CREATE POLICY "Professionnels peuvent voir leurs rendez-vous"
ON public.appointments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.professionals p
    WHERE p.id::text = appointments.professional_id
      AND p.user_id = auth.uid()
  )
);

-- Create UPDATE policy for professionals to confirm/cancel their own appointments
CREATE POLICY "Professionnels peuvent mettre à jour leurs rendez-vous"
ON public.appointments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.professionals p
    WHERE p.id::text = appointments.professional_id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.professionals p
    WHERE p.id::text = appointments.professional_id
      AND p.user_id = auth.uid()
  )
);
