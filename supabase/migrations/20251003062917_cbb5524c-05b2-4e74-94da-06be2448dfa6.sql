-- Create system_settings table for admin configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('system', 'notifications', 'appointments', 'payments', 'integrations', 'compliance')),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Super admins can view all settings
CREATE POLICY "Super admins can view all settings"
ON public.system_settings
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Super admins can insert settings
CREATE POLICY "Super admins can insert settings"
ON public.system_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Super admins can update settings
CREATE POLICY "Super admins can update settings"
ON public.system_settings
FOR UPDATE
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Super admins can delete settings
CREATE POLICY "Super admins can delete settings"
ON public.system_settings
FOR DELETE
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.system_settings (setting_key, setting_value, category) VALUES
('platform_name', '{"value": "SANTE.GA"}', 'system'),
('platform_description', '{"value": "Plateforme de santé numérique du Gabon"}', 'system'),
('maintenance_mode', '{"enabled": false}', 'system'),
('session_duration', '{"minutes": 60}', 'system'),
('max_login_attempts', '{"count": 5}', 'system'),
('two_factor_auth', '{"required": false}', 'system'),
('password_strength', '{"level": "medium"}', 'system'),
('appointment_default_duration', '{"minutes": 30}', 'appointments'),
('appointment_cancellation_delay', '{"hours": 24}', 'appointments'),
('appointment_booking_min_delay', '{"hours": 2}', 'appointments'),
('appointment_booking_max_delay', '{"days": 30}', 'appointments'),
('max_simultaneous_appointments', '{"count": 3}', 'appointments'),
('mobile_money_enabled', '{"enabled": true}', 'payments'),
('stripe_enabled', '{"enabled": false}', 'payments'),
('onsite_payment_enabled', '{"enabled": true}', 'payments'),
('video_consultation_price', '{"amount": 15000}', 'payments'),
('inperson_consultation_price', '{"amount": 25000}', 'payments'),
('emergency_consultation_price', '{"amount": 35000}', 'payments'),
('platform_commission', '{"percentage": 10}', 'payments'),
('backup_frequency', '{"value": "daily"}', 'compliance'),
('data_retention_days', '{"days": 365}', 'compliance'),
('log_retention_days', '{"days": 90}', 'compliance');