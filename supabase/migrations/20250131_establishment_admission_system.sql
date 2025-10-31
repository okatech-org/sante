-- ============================================
-- Migration: Système d'admission bidirectionnel établissements
-- Date: 2025-01-31
-- Description: Demandes professionnel → établissement ET établissement → professionnel
-- ============================================

-- Table pour les demandes d'admission (bidirectionnelles)
CREATE TABLE IF NOT EXISTS public.establishment_admission_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Type de demande
    request_type TEXT NOT NULL CHECK (request_type IN ('professional_to_establishment', 'establishment_to_professional')),
    
    -- Parties impliquées
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
    
    -- Informations de la demande
    requested_role TEXT NOT NULL CHECK (requested_role IN ('doctor', 'nurse', 'pharmacist', 'laborantin', 'receptionist', 'admin', 'director')),
    department TEXT,
    job_position TEXT,
    message TEXT,
    
    -- Statut de la demande
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
    
    -- Qui a initié et qui a validé
    created_by UUID NOT NULL REFERENCES auth.users(id),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Contraintes
    UNIQUE(professional_id, establishment_id, status) WHERE status = 'pending'
);

-- Index pour performance
CREATE INDEX idx_admission_professional ON public.establishment_admission_requests(professional_id, status);
CREATE INDEX idx_admission_establishment ON public.establishment_admission_requests(establishment_id, status);
CREATE INDEX idx_admission_status ON public.establishment_admission_requests(status);
CREATE INDEX idx_admission_type ON public.establishment_admission_requests(request_type);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_admission_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admission_updated_at
    BEFORE UPDATE ON public.establishment_admission_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_admission_updated_at();

-- RLS Policies
ALTER TABLE public.establishment_admission_requests ENABLE ROW LEVEL SECURITY;

-- Les professionnels peuvent voir leurs demandes
CREATE POLICY "Professionnels peuvent voir leurs demandes"
    ON public.establishment_admission_requests
    FOR SELECT
    USING (
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

-- Les professionnels peuvent créer des demandes sortantes
CREATE POLICY "Professionnels peuvent créer demandes sortantes"
    ON public.establishment_admission_requests
    FOR INSERT
    WITH CHECK (
        request_type = 'professional_to_establishment'
        AND professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

-- Les admins d'établissement peuvent voir les demandes de leur établissement
CREATE POLICY "Admins établissement peuvent voir demandes"
    ON public.establishment_admission_requests
    FOR SELECT
    USING (
        establishment_id IN (
            SELECT es.establishment_id 
            FROM public.establishment_staff es
            INNER JOIN public.professionals p ON p.id = es.professional_id
            WHERE p.user_id = auth.uid() AND es.is_admin = true
        )
    );

-- Les admins d'établissement peuvent créer des invitations
CREATE POLICY "Admins établissement peuvent inviter"
    ON public.establishment_admission_requests
    FOR INSERT
    WITH CHECK (
        request_type = 'establishment_to_professional'
        AND establishment_id IN (
            SELECT es.establishment_id 
            FROM public.establishment_staff es
            INNER JOIN public.professionals p ON p.id = es.professional_id
            WHERE p.user_id = auth.uid() AND es.is_admin = true
        )
    );

-- Les admins peuvent mettre à jour les demandes (approuver/rejeter)
CREATE POLICY "Admins peuvent valider demandes"
    ON public.establishment_admission_requests
    FOR UPDATE
    USING (
        establishment_id IN (
            SELECT es.establishment_id 
            FROM public.establishment_staff es
            INNER JOIN public.professionals p ON p.id = es.professional_id
            WHERE p.user_id = auth.uid() AND es.is_admin = true
        )
    );

-- Les professionnels peuvent annuler leurs demandes
CREATE POLICY "Professionnels peuvent annuler"
    ON public.establishment_admission_requests
    FOR UPDATE
    USING (
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
        AND status = 'pending'
    );

-- ============================================
-- Fonction RPC: Créer une demande d'admission
-- ============================================
CREATE OR REPLACE FUNCTION public.create_admission_request(
    p_establishment_id UUID,
    p_requested_role TEXT,
    p_department TEXT DEFAULT NULL,
    p_job_position TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_professional_id UUID;
    v_request_id UUID;
BEGIN
    -- Récupérer l'ID du professionnel
    SELECT id INTO v_professional_id
    FROM public.professionals
    WHERE user_id = auth.uid();
    
    IF v_professional_id IS NULL THEN
        RAISE EXCEPTION 'Profil professionnel non trouvé';
    END IF;
    
    -- Vérifier qu'il n'y a pas déjà une demande en attente
    IF EXISTS (
        SELECT 1 FROM public.establishment_admission_requests
        WHERE professional_id = v_professional_id
        AND establishment_id = p_establishment_id
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'Une demande est déjà en attente pour cet établissement';
    END IF;
    
    -- Vérifier que le professionnel n'est pas déjà membre
    IF EXISTS (
        SELECT 1 FROM public.establishment_staff
        WHERE professional_id = v_professional_id
        AND establishment_id = p_establishment_id
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Vous êtes déjà membre de cet établissement';
    END IF;
    
    -- Créer la demande
    INSERT INTO public.establishment_admission_requests (
        request_type,
        professional_id,
        establishment_id,
        requested_role,
        department,
        job_position,
        message,
        status,
        created_by
    ) VALUES (
        'professional_to_establishment',
        v_professional_id,
        p_establishment_id,
        p_requested_role,
        p_department,
        p_job_position,
        p_message,
        'pending',
        auth.uid()
    )
    RETURNING id INTO v_request_id;
    
    RETURN v_request_id;
END;
$$;

-- ============================================
-- Fonction RPC: Approuver une demande d'admission
-- ============================================
CREATE OR REPLACE FUNCTION public.approve_admission_request(
    p_request_id UUID,
    p_matricule TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_request RECORD;
    v_new_matricule TEXT;
BEGIN
    -- Récupérer la demande
    SELECT * INTO v_request
    FROM public.establishment_admission_requests
    WHERE id = p_request_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Demande non trouvée';
    END IF;
    
    IF v_request.status != 'pending' THEN
        RAISE EXCEPTION 'Cette demande a déjà été traitée';
    END IF;
    
    -- Générer un matricule si non fourni
    IF p_matricule IS NULL THEN
        v_new_matricule := 'STAFF-' || LPAD(NEXTVAL('public.staff_matricule_seq')::TEXT, 6, '0');
    ELSE
        v_new_matricule := p_matricule;
    END IF;
    
    -- Créer l'affiliation dans establishment_staff
    INSERT INTO public.establishment_staff (
        establishment_id,
        professional_id,
        role_in_establishment,
        department,
        job_position,
        matricule,
        is_admin,
        is_department_head,
        permissions,
        status,
        start_date,
        created_by
    ) VALUES (
        v_request.establishment_id,
        v_request.professional_id,
        v_request.requested_role,
        v_request.department,
        v_request.job_position,
        v_new_matricule,
        false,
        false,
        CASE 
            WHEN v_request.requested_role = 'doctor' THEN ARRAY['consultation', 'prescription', 'view_dmp', 'edit_dmp']
            WHEN v_request.requested_role = 'nurse' THEN ARRAY['view_dmp', 'view_patients']
            WHEN v_request.requested_role = 'admin' THEN ARRAY['manage_staff', 'view_finances']
            ELSE ARRAY[]::TEXT[]
        END,
        'active',
        CURRENT_DATE,
        auth.uid()
    );
    
    -- Mettre à jour la demande
    UPDATE public.establishment_admission_requests
    SET 
        status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = now()
    WHERE id = p_request_id;
    
    RETURN true;
END;
$$;

-- ============================================
-- Fonction RPC: Rejeter une demande
-- ============================================
CREATE OR REPLACE FUNCTION public.reject_admission_request(
    p_request_id UUID,
    p_rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.establishment_admission_requests
    SET 
        status = 'rejected',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        rejection_reason = p_rejection_reason
    WHERE id = p_request_id
    AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Demande non trouvée ou déjà traitée';
    END IF;
    
    RETURN true;
END;
$$;

-- ============================================
-- Fonction RPC: Annuler sa demande
-- ============================================
CREATE OR REPLACE FUNCTION public.cancel_admission_request(
    p_request_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_professional_id UUID;
BEGIN
    -- Récupérer l'ID du professionnel
    SELECT id INTO v_professional_id
    FROM public.professionals
    WHERE user_id = auth.uid();
    
    UPDATE public.establishment_admission_requests
    SET status = 'cancelled'
    WHERE id = p_request_id
    AND professional_id = v_professional_id
    AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Demande non trouvée ou vous n''êtes pas autorisé';
    END IF;
    
    RETURN true;
END;
$$;

-- ============================================
-- Fonction RPC: Récupérer les demandes d'un professionnel
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_admission_requests()
RETURNS TABLE (
    request_id UUID,
    request_type TEXT,
    establishment_id UUID,
    establishment_name TEXT,
    establishment_type TEXT,
    establishment_city TEXT,
    requested_role TEXT,
    department TEXT,
    job_position TEXT,
    message TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        ar.id AS request_id,
        ar.request_type,
        ar.establishment_id,
        e.name AS establishment_name,
        e.type AS establishment_type,
        e.city AS establishment_city,
        ar.requested_role,
        ar.department,
        ar.job_position,
        ar.message,
        ar.status,
        ar.created_at,
        ar.expires_at,
        ar.reviewed_at,
        ar.rejection_reason
    FROM public.establishment_admission_requests ar
    INNER JOIN public.establishments e ON e.id = ar.establishment_id
    INNER JOIN public.professionals p ON p.id = ar.professional_id
    WHERE p.user_id = auth.uid()
    ORDER BY ar.created_at DESC;
$$;

-- ============================================
-- Fonction RPC: Récupérer les demandes pour un établissement
-- ============================================
CREATE OR REPLACE FUNCTION public.get_establishment_admission_requests(
    p_establishment_id UUID
)
RETURNS TABLE (
    request_id UUID,
    request_type TEXT,
    professional_id UUID,
    professional_name TEXT,
    professional_email TEXT,
    professional_phone TEXT,
    professional_type TEXT,
    specialization TEXT,
    requested_role TEXT,
    department TEXT,
    job_position TEXT,
    message TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        ar.id AS request_id,
        ar.request_type,
        ar.professional_id,
        p.full_name AS professional_name,
        p.email AS professional_email,
        p.phone AS professional_phone,
        p.professional_type,
        p.specialization,
        ar.requested_role,
        ar.department,
        ar.job_position,
        ar.message,
        ar.status,
        ar.created_at,
        ar.expires_at
    FROM public.establishment_admission_requests ar
    INNER JOIN public.professionals p ON p.id = ar.professional_id
    WHERE ar.establishment_id = p_establishment_id
    AND ar.status = 'pending'
    ORDER BY ar.created_at DESC;
$$;

-- ============================================
-- Fonction RPC: Inviter un professionnel
-- ============================================
CREATE OR REPLACE FUNCTION public.invite_professional_to_establishment(
    p_professional_email TEXT,
    p_establishment_id UUID,
    p_requested_role TEXT,
    p_department TEXT DEFAULT NULL,
    p_job_position TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_professional_id UUID;
    v_request_id UUID;
    v_is_admin BOOLEAN;
BEGIN
    -- Vérifier que l'utilisateur est admin de cet établissement
    SELECT es.is_admin INTO v_is_admin
    FROM public.establishment_staff es
    INNER JOIN public.professionals p ON p.id = es.professional_id
    WHERE p.user_id = auth.uid()
    AND es.establishment_id = p_establishment_id
    AND es.status = 'active';
    
    IF v_is_admin IS NULL OR v_is_admin = false THEN
        RAISE EXCEPTION 'Vous n''êtes pas autorisé à inviter pour cet établissement';
    END IF;
    
    -- Récupérer l'ID du professionnel à inviter
    SELECT id INTO v_professional_id
    FROM public.professionals
    WHERE email = p_professional_email;
    
    IF v_professional_id IS NULL THEN
        RAISE EXCEPTION 'Professionnel non trouvé avec cet email';
    END IF;
    
    -- Vérifier qu'il n'est pas déjà membre
    IF EXISTS (
        SELECT 1 FROM public.establishment_staff
        WHERE professional_id = v_professional_id
        AND establishment_id = p_establishment_id
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Ce professionnel est déjà membre de l''établissement';
    END IF;
    
    -- Vérifier qu'il n'y a pas déjà une invitation en attente
    IF EXISTS (
        SELECT 1 FROM public.establishment_admission_requests
        WHERE professional_id = v_professional_id
        AND establishment_id = p_establishment_id
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'Une invitation est déjà en attente pour ce professionnel';
    END IF;
    
    -- Créer l'invitation
    INSERT INTO public.establishment_admission_requests (
        request_type,
        professional_id,
        establishment_id,
        requested_role,
        department,
        job_position,
        message,
        status,
        created_by
    ) VALUES (
        'establishment_to_professional',
        v_professional_id,
        p_establishment_id,
        p_requested_role,
        p_department,
        p_job_position,
        p_message,
        'pending',
        auth.uid()
    )
    RETURNING id INTO v_request_id;
    
    RETURN v_request_id;
END;
$$;

-- Séquence pour les matricules
CREATE SEQUENCE IF NOT EXISTS public.staff_matricule_seq START 1000;

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.establishment_admission_requests TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admission_request TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_admission_request TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_admission_request TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_admission_request TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_admission_requests TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_establishment_admission_requests TO authenticated;
GRANT EXECUTE ON FUNCTION public.invite_professional_to_establishment TO authenticated;

-- Commentaires
COMMENT ON TABLE public.establishment_admission_requests IS 'Demandes d''admission bidirectionnelles: professionnel ↔ établissement';
COMMENT ON FUNCTION public.create_admission_request IS 'Créer une demande pour rejoindre un établissement';
COMMENT ON FUNCTION public.approve_admission_request IS 'Approuver une demande et créer l''affiliation';
COMMENT ON FUNCTION public.reject_admission_request IS 'Rejeter une demande avec raison';
COMMENT ON FUNCTION public.invite_professional_to_establishment IS 'Inviter un professionnel à rejoindre l''établissement';

