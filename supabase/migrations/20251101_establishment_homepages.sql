-- Migration pour ajouter la gestion des pages d'accueil personnalisées des établissements
-- Date: 2025-11-01

-- Créer la table pour les paramètres de pages d'accueil
CREATE TABLE IF NOT EXISTS establishment_homepages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_id TEXT NOT NULL UNIQUE,
  has_homepage BOOLEAN DEFAULT false,
  custom_content JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_establishment_homepages_establishment_id ON establishment_homepages(establishment_id);
CREATE INDEX idx_establishment_homepages_has_homepage ON establishment_homepages(has_homepage);

-- Commentaires
COMMENT ON TABLE establishment_homepages IS 'Configuration des pages d''accueil personnalisées pour les établissements';
COMMENT ON COLUMN establishment_homepages.establishment_id IS 'ID unique de l''établissement';
COMMENT ON COLUMN establishment_homepages.has_homepage IS 'Indique si l''établissement a une page d''accueil active';
COMMENT ON COLUMN establishment_homepages.custom_content IS 'Contenu personnalisé (hero, description, services, images)';

-- Créer une table de synchronisation pour unifier les établissements
CREATE TABLE IF NOT EXISTS establishments_sync (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'operationnel',
  province TEXT,
  city TEXT,
  coordinates JSONB,
  phone_main TEXT,
  phone_emergency TEXT,
  email TEXT,
  website TEXT,
  total_beds INTEGER DEFAULT 0,
  total_staff INTEGER DEFAULT 0,
  is_emergency_center BOOLEAN DEFAULT false,
  has_pharmacy BOOLEAN DEFAULT false,
  has_laboratory BOOLEAN DEFAULT false,
  has_homepage BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'manual'
);

-- Index pour la synchronisation
CREATE INDEX idx_establishments_sync_code ON establishments_sync(code);
CREATE INDEX idx_establishments_sync_name ON establishments_sync(name);
CREATE INDEX idx_establishments_sync_province ON establishments_sync(province);
CREATE INDEX idx_establishments_sync_category ON establishments_sync(category);
CREATE INDEX idx_establishments_sync_status ON establishments_sync(status);

-- Fonction trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_establishment_homepages_updated_at BEFORE UPDATE
  ON establishment_homepages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_establishments_sync_updated_at BEFORE UPDATE
  ON establishments_sync FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initialiser avec quelques établissements majeurs ayant des pages d'accueil
INSERT INTO establishment_homepages (establishment_id, has_homepage, custom_content) 
VALUES 
  ('est-gov-001', true, '{"hero": "Ministère de la Santé publique et de la Population", "description": "Autorité de régulation et supervision du système de santé gabonais"}'),
  ('est-002', true, '{"hero": "Centre Hospitalier Universitaire de Libreville", "description": "Excellence médicale et formation des professionnels de santé"}'),
  ('est-003', true, '{"hero": "CHU de Melen", "description": "Soins de qualité et innovation médicale"}'),
  ('est-004', true, '{"hero": "CHU Jeanne Ebori", "description": "Centre de référence en gynécologie-obstétrique"}')
ON CONFLICT (establishment_id) DO NOTHING;

-- RLS (Row Level Security)
ALTER TABLE establishment_homepages ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments_sync ENABLE ROW LEVEL SECURITY;

-- Politique pour les super admins uniquement
CREATE POLICY "Super admins can manage homepage settings" ON establishment_homepages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Politique pour la lecture publique des établissements avec page d'accueil
CREATE POLICY "Public can read establishments with homepage" ON establishments_sync
  FOR SELECT
  USING (has_homepage = true);

-- Politique pour les admins
CREATE POLICY "Admins can manage establishments sync" ON establishments_sync
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Vue pour faciliter l'accès aux établissements avec page d'accueil
CREATE OR REPLACE VIEW establishments_with_homepage AS
SELECT 
  es.*,
  eh.custom_content,
  eh.updated_at as homepage_updated_at
FROM establishments_sync es
LEFT JOIN establishment_homepages eh ON es.id = eh.establishment_id
WHERE eh.has_homepage = true;

-- Grant permissions
GRANT SELECT ON establishments_with_homepage TO anon, authenticated;
GRANT ALL ON establishment_homepages TO authenticated;
GRANT ALL ON establishments_sync TO authenticated;
