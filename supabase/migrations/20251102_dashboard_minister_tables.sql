-- Migration: Dashboard Ministre - Tables KPIs, Alerts, Decrees, Objectifs, Provinces
-- Date: 2025-11-02
-- Description: Création des tables pour le dashboard ministériel

-- Table KPI (Indicateurs de performance)
CREATE TABLE IF NOT EXISTS public.dashboard_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  valeur DECIMAL(12, 2) NOT NULL,
  delta DECIMAL(6, 2) NOT NULL DEFAULT 0,
  unite VARCHAR(100) NOT NULL,
  periode VARCHAR(50) NOT NULL CHECK (periode IN ('semaine', 'mois', 'annee')),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kpis_periode ON public.dashboard_kpis(periode);
CREATE INDEX idx_kpis_date ON public.dashboard_kpis(date DESC);

-- Table Alerts (Alertes prioritaires)
CREATE TABLE IF NOT EXISTS public.dashboard_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('critique', 'haute', 'moyenne')),
  province VARCHAR(255) NOT NULL,
  statut VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (statut IN ('active', 'resolved')),
  action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_alerts_statut ON public.dashboard_alerts(statut);
CREATE INDEX idx_alerts_severity ON public.dashboard_alerts(severity);
CREATE INDEX idx_alerts_created ON public.dashboard_alerts(created_at DESC);

-- Table Decrets (Décrets ministériels)
CREATE TABLE IF NOT EXISTS public.dashboard_decrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(1000) NOT NULL,
  numero VARCHAR(100) NOT NULL UNIQUE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  statut VARCHAR(50) NOT NULL CHECK (statut IN ('draft', 'signed', 'published')),
  categorie VARCHAR(255) NOT NULL,
  pdf_url TEXT,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_decrets_statut ON public.dashboard_decrets(statut);
CREATE INDEX idx_decrets_date ON public.dashboard_decrets(date DESC);
CREATE INDEX idx_decrets_categorie ON public.dashboard_decrets(categorie);

-- Table Objectifs (Objectifs nationaux)
CREATE TABLE IF NOT EXISTS public.dashboard_objectifs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(500) NOT NULL,
  description TEXT,
  cible DECIMAL(6, 2) NOT NULL,
  progres DECIMAL(6, 2) NOT NULL DEFAULT 0,
  unite VARCHAR(50) NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  province_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_objectifs_deadline ON public.dashboard_objectifs(deadline ASC);
CREATE INDEX idx_objectifs_progres ON public.dashboard_objectifs(progres DESC);

-- Table Provinces (Données provinciales santé)
CREATE TABLE IF NOT EXISTS public.dashboard_provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  population INTEGER NOT NULL,
  structures INTEGER NOT NULL,
  couverture DECIMAL(5, 2) NOT NULL,
  medecins INTEGER NOT NULL,
  infirmiers INTEGER NOT NULL,
  lits INTEGER NOT NULL,
  budget DECIMAL(12, 2) NOT NULL,
  centroid JSONB NOT NULL,
  bounds JSONB NOT NULL,
  needs JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_provinces_nom ON public.dashboard_provinces(nom);
CREATE INDEX idx_provinces_couverture ON public.dashboard_provinces(couverture DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_dashboard_kpis_updated_at BEFORE UPDATE ON public.dashboard_kpis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_decrets_updated_at BEFORE UPDATE ON public.dashboard_decrets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_objectifs_updated_at BEFORE UPDATE ON public.dashboard_objectifs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_provinces_updated_at BEFORE UPDATE ON public.dashboard_provinces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (Row Level Security)
ALTER TABLE public.dashboard_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_decrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_objectifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_provinces ENABLE ROW LEVEL SECURITY;

-- Policies: Accès réservé aux rôles MINISTRE et ADMIN
CREATE POLICY "Ministre/Admin can view KPIs"
  ON public.dashboard_kpis FOR SELECT
  USING (
    auth.jwt() ->> 'user_role' IN ('MINISTRE', 'ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "Ministre/Admin can view Alerts"
  ON public.dashboard_alerts FOR SELECT
  USING (
    auth.jwt() ->> 'user_role' IN ('MINISTRE', 'ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "Ministre/Admin can manage Decrets"
  ON public.dashboard_decrets FOR ALL
  USING (
    auth.jwt() ->> 'user_role' IN ('MINISTRE', 'ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "Ministre/Admin can view Objectifs"
  ON public.dashboard_objectifs FOR SELECT
  USING (
    auth.jwt() ->> 'user_role' IN ('MINISTRE', 'ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "Ministre/Admin can manage Objectifs"
  ON public.dashboard_objectifs FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'user_role' IN ('MINISTRE', 'ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "Ministre/Admin can update Objectifs"
  ON public.dashboard_objectifs FOR UPDATE
  USING (
    auth.jwt() ->> 'user_role' IN ('MINISTRE', 'ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "Ministre/Admin can view Provinces"
  ON public.dashboard_provinces FOR SELECT
  USING (
    auth.jwt() ->> 'user_role' IN ('MINISTRE', 'ADMIN', 'SUPER_ADMIN')
  );

-- Commentaires
COMMENT ON TABLE public.dashboard_kpis IS 'Indicateurs de performance clés pour le dashboard ministre';
COMMENT ON TABLE public.dashboard_alerts IS 'Alertes prioritaires nationales';
COMMENT ON TABLE public.dashboard_decrets IS 'Décrets et documents ministériels';
COMMENT ON TABLE public.dashboard_objectifs IS 'Objectifs nationaux de santé';
COMMENT ON TABLE public.dashboard_provinces IS 'Données de santé par province';

