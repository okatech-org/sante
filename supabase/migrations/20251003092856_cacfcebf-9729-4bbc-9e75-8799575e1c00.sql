-- Create a secure function for role assignment with built-in validation
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  new_role app_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is super_admin
  IF NOT has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super admins can assign roles';
  END IF;
  
  -- Prevent self-assignment of super_admin role
  IF target_user_id = auth.uid() AND new_role = 'super_admin' THEN
    RAISE EXCEPTION 'Cannot assign super_admin role to yourself';
  END IF;
  
  -- Verify target user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Target user does not exist';
  END IF;
  
  -- Check if role already exists
  IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = target_user_id AND role = new_role) THEN
    RAISE EXCEPTION 'User already has this role';
  END IF;
  
  -- Insert role with audit trail
  INSERT INTO user_roles (user_id, role, created_by)
  VALUES (target_user_id, new_role, auth.uid());
END;
$$;

-- Add RLS policy to prevent self super_admin assignment (defense in depth)
DROP POLICY IF EXISTS "Prevent self super admin assignment" ON user_roles;
CREATE POLICY "Prevent self super admin assignment"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (
  NOT (user_id = auth.uid() AND role = 'super_admin' AND NOT has_role(auth.uid(), 'super_admin'))
);