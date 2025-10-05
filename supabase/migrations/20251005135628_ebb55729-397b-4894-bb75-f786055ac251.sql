-- Create table for pending profile changes
CREATE TABLE public.profile_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL CHECK (change_type IN ('personal_info', 'medical_info')),
  current_data JSONB NOT NULL,
  requested_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_change_requests ENABLE ROW LEVEL SECURITY;

-- Policies for patients to view their own requests
CREATE POLICY "Users can view their own change requests"
ON public.profile_change_requests
FOR SELECT
USING (user_id = auth.uid());

-- Policies for patients to create requests
CREATE POLICY "Users can create change requests"
ON public.profile_change_requests
FOR INSERT
WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- Policies for medical staff to view all requests
CREATE POLICY "Medical staff can view all change requests"
ON public.profile_change_requests
FOR SELECT
USING (
  has_any_role(auth.uid(), ARRAY['doctor'::app_role, 'medical_staff'::app_role, 'admin'::app_role, 'super_admin'::app_role])
);

-- Policies for medical staff to update requests (approve/reject)
CREATE POLICY "Medical staff can update change requests"
ON public.profile_change_requests
FOR UPDATE
USING (
  has_any_role(auth.uid(), ARRAY['doctor'::app_role, 'medical_staff'::app_role, 'admin'::app_role, 'super_admin'::app_role])
);

-- Add columns to profiles table for medical info
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS height_m NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS blood_group TEXT,
ADD COLUMN IF NOT EXISTS cnamgs_number TEXT;

-- Create trigger to update updated_at
CREATE TRIGGER update_profile_change_requests_updated_at
BEFORE UPDATE ON public.profile_change_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_profile_change_requests_user_id ON public.profile_change_requests(user_id);
CREATE INDEX idx_profile_change_requests_status ON public.profile_change_requests(status);