-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  teleconsultation_id UUID REFERENCES public.teleconsultation_sessions(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XAF' NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'airtel_money')),
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  payment_details JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_reference CHECK (
    (appointment_id IS NOT NULL AND teleconsultation_id IS NULL) OR
    (appointment_id IS NULL AND teleconsultation_id IS NOT NULL)
  )
);

-- Create index for faster queries
CREATE INDEX idx_payments_patient_id ON public.payments(patient_id);
CREATE INDEX idx_payments_professional_id ON public.payments(professional_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_appointment_id ON public.payments(appointment_id);
CREATE INDEX idx_payments_teleconsultation_id ON public.payments(teleconsultation_id);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Professionals can view payments for their services"
  ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals
      WHERE professionals.id = payments.professional_id
      AND professionals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "System can update payments"
  ON public.payments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('card', 'airtel_money')),
  icon TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  config JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for payment_methods (read-only for all authenticated users)
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active payment methods"
  ON public.payment_methods
  FOR SELECT
  USING (is_active = true);

-- Insert default payment methods
INSERT INTO public.payment_methods (name, type, icon, display_order, config) VALUES
  ('Carte Bancaire', 'card', 'CreditCard', 1, '{"demo_mode": true}'::jsonb),
  ('Airtel Money', 'airtel_money', 'Smartphone', 2, '{"demo_mode": true, "provider": "airtel"}'::jsonb);

-- Create function to update payment updated_at
CREATE OR REPLACE FUNCTION public.update_payment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_updated_at();