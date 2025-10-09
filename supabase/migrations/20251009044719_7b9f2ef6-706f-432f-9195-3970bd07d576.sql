-- Corriger le rôle du compte CHU Owendo
-- D'abord, supprimer le rôle patient incorrect
DELETE FROM public.user_roles 
WHERE user_id = '03afaf14-184d-4a66-8603-c9ecdd6cd3bb' 
AND role = 'patient';

-- Ajouter le rôle hospital approprié
INSERT INTO public.user_roles (user_id, role)
VALUES ('03afaf14-184d-4a66-8603-c9ecdd6cd3bb', 'hospital')
ON CONFLICT (user_id, role) DO NOTHING;

-- Mettre à jour le profil pour refléter qu'il s'agit d'un établissement
UPDATE public.profiles
SET full_name = 'CHU Owendo'
WHERE id = '03afaf14-184d-4a66-8603-c9ecdd6cd3bb';
