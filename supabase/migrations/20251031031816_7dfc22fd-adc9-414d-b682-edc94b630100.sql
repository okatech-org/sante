-- Créer la FK correcte vers professionals
ALTER TABLE public.establishment_staff
DROP CONSTRAINT IF EXISTS establishment_staff_professional_id_fkey;

ALTER TABLE public.establishment_staff
ADD CONSTRAINT establishment_staff_professional_id_fkey 
FOREIGN KEY (professional_id) REFERENCES public.professionals(id) ON DELETE CASCADE;