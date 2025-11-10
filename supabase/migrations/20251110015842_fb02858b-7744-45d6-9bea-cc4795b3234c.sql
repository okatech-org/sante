-- Table des préférences utilisateur pour iAsted
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  voice_focus_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des sessions de conversation iAsted
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT,
  focus_mode BOOLEAN DEFAULT false,
  focus_topic TEXT,
  focus_depth INTEGER DEFAULT 0,
  focus_started_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversation_sessions_user ON conversation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_focus ON conversation_sessions(focus_mode, focus_topic);

-- Table des messages iAsted
CREATE TABLE IF NOT EXISTS messages_iasted (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages_iasted(conversation_id, created_at);

-- Table de la base de connaissances
CREATE TABLE IF NOT EXISTS knowledge_base_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  themes TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  relevance_score NUMERIC DEFAULT 0,
  nb_references INTEGER DEFAULT 1,
  conversations_sources UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_themes ON knowledge_base_entries USING GIN(themes);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_keywords ON knowledge_base_entries USING GIN(keywords);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_iasted ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_entries ENABLE ROW LEVEL SECURITY;

-- Policies pour user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies pour conversation_sessions
CREATE POLICY "Users can view own sessions" ON conversation_sessions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON conversation_sessions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON conversation_sessions 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON conversation_sessions 
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour messages_iasted
CREATE POLICY "Users can view messages from own conversations" ON messages_iasted 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_sessions 
      WHERE conversation_sessions.id = messages_iasted.conversation_id 
      AND conversation_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert messages in own conversations" ON messages_iasted 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_sessions 
      WHERE conversation_sessions.id = messages_iasted.conversation_id 
      AND conversation_sessions.user_id = auth.uid()
    )
  );

-- Policies pour knowledge_base (lecture publique pour les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can view knowledge base" ON knowledge_base_entries 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insérer des données de base de connaissances pour le secteur santé
INSERT INTO knowledge_base_entries (title, content, themes, keywords, relevance_score) VALUES
('Couverture Santé Universelle', 'La Couverture Santé Universelle (CSU) est un objectif majeur du Ministère de la Santé du Gabon. Elle vise à garantir l''accès aux services de santé essentiels pour tous les citoyens sans discrimination. Les indicateurs clés incluent: taux de couverture CNAMGS (actuellement 45%), nombre de centres de santé accessibles (267 structures), disponibilité des médicaments essentiels (78% des structures), personnel de santé par habitant (1 médecin pour 1500 habitants).', 
ARRAY['couverture_universelle', 'cnamgs', 'accessibilite'], 
ARRAY['csu', 'couverture', 'assurance', 'cnamgs', 'accès soins'], 
95),

('Infrastructure Hospitalière', 'Le Gabon compte 9 hôpitaux régionaux, 52 centres médicaux, 206 centres de santé et dispensaires. Les défis majeurs incluent: vétusté des équipements (35% nécessitent remplacement), manque de lits (2.1 lits pour 1000 habitants vs 4.5 recommandé OMS), concentration à Libreville (60% des infrastructures), zones rurales sous-équipées. Programmes en cours: réhabilitation de 15 centres de santé, construction de 3 nouveaux hôpitaux départementaux, programme d''équipement médical (budget 12 milliards FCFA).', 
ARRAY['infrastructure', 'hopitaux', 'equipements'], 
ARRAY['hôpitaux', 'centres de santé', 'équipements', 'lits', 'infrastructure'], 
90),

('Personnel de Santé', 'Effectif actuel: 3200 médecins, 8500 infirmiers, 450 sages-femmes, 1200 pharmaciens. Défis: répartition inégale (70% à Libreville et Port-Gentil), fuite des cerveaux (15% de départs annuels), vieillissement du personnel (âge moyen 48 ans). Mesures: programme de formation continue, amélioration des conditions salariales, bourses d''études (150 étudiants en médecine), recrutement de 500 nouveaux professionnels par an.', 
ARRAY['ressources_humaines', 'formation', 'recrutement'], 
ARRAY['médecins', 'infirmiers', 'personnel', 'formation', 'recrutement'], 
85),

('Programmes de Vaccination', 'Couverture vaccinale: BCG 92%, DTC3 88%, polio 89%, rougeole 85%, fièvre jaune 78%. Objectif OMS: 95% pour toutes les vaccinations. Campagnes en cours: rattrapage rougeole (cible 200000 enfants), introduction vaccin HPV (filles 9-14 ans), vaccination COVID-19 (objectif 70% population). Chaîne du froid: 89% des centres équipés, besoins de réfrigérateurs dans zones reculées.', 
ARRAY['vaccination', 'prevention', 'epidemiologie'], 
ARRAY['vaccins', 'vaccination', 'immunisation', 'couverture', 'campagne'], 
88),

('Budget Santé', 'Budget 2024: 185 milliards FCFA (8.2% du budget national). Répartition: personnel 45%, médicaments 22%, équipements 18%, infrastructure 10%, programmes spéciaux 5%. Défis: insuffisance (OMS recommande 15%), dépenses inefficaces, retards de paiement fournisseurs. Partenaires: OMS (12M USD), Banque Mondiale (25M USD), Fonds Mondial (18M USD), AFD (15M EUR).', 
ARRAY['budget', 'financement', 'depenses'], 
ARRAY['budget', 'financement', 'dépenses', 'investissement', 'partenaires'], 
92);

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour user_preferences
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour conversation_sessions
CREATE TRIGGER update_conversation_sessions_updated_at
    BEFORE UPDATE ON conversation_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour knowledge_base_entries
CREATE TRIGGER update_knowledge_base_entries_updated_at
    BEFORE UPDATE ON knowledge_base_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();