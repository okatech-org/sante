-- ============================================
-- TABLES RENDEZ-VOUS ET NOTIFICATIONS - SANTE.GA
-- ============================================

-- Table rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Participants
  patient_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  
  -- Détails
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 30, -- minutes
  type VARCHAR(50) NOT NULL, -- 'in_person', 'teleconsultation'
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
  
  -- Motif
  reason TEXT,
  notes TEXT,
  
  -- Tarification
  consultation_price INTEGER,
  cnamgs_coverage INTEGER,
  patient_payment INTEGER,
  
  -- WebRTC (pour téléconsultation)
  room_id VARCHAR(200),
  video_url TEXT,
  
  -- Notifications
  reminder_sent BOOLEAN DEFAULT false,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (professional_id) REFERENCES profiles_professional(id) ON DELETE CASCADE
);

-- Table notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  
  -- Type et contenu
  type VARCHAR(50) NOT NULL, -- 'appointment_reminder', 'prescription_ready', 'result_available', etc.
  title VARCHAR(200),
  message TEXT NOT NULL,
  data JSONB, -- Données additionnelles
  
  -- Canaux
  channel VARCHAR(50)[], -- ['sms', 'email', 'push', 'in_app']
  
  -- Statut
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Priorité
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table historique SMS
CREATE TABLE IF NOT EXISTS sms_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  
  -- Statut
  status VARCHAR(50), -- 'pending', 'sent', 'delivered', 'failed'
  provider VARCHAR(50), -- 'twilio', 'airtel', 'gabon_telecom'
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table historique emails
CREATE TABLE IF NOT EXISTS email_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  to_email VARCHAR(200) NOT NULL,
  subject VARCHAR(500),
  template VARCHAR(100),
  
  -- Statut
  status VARCHAR(50), -- 'pending', 'sent', 'delivered', 'failed'
  provider VARCHAR(50), -- 'sendgrid', 'mailgun', 'aws_ses'
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table push notifications
CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  device_token TEXT NOT NULL,
  
  -- Contenu
  title VARCHAR(200),
  body TEXT,
  data JSONB,
  
  -- Statut
  status VARCHAR(50), -- 'pending', 'sent', 'delivered', 'failed'
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table préférences notifications
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Canaux activés
  sms_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  
  -- Types de notifications
  appointment_reminders BOOLEAN DEFAULT true,
  prescription_updates BOOLEAN DEFAULT true,
  result_notifications BOOLEAN DEFAULT true,
  marketing_communications BOOLEAN DEFAULT false,
  
  -- Horaires préférés
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Index
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

CREATE INDEX idx_sms_history_user ON sms_history(user_id);
CREATE INDEX idx_email_history_user ON email_history(user_id);
CREATE INDEX idx_push_notifications_user ON push_notifications(user_id);

CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);
