-- Add ElevenLabs voice configuration columns to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS elevenlabs_voice_id TEXT DEFAULT '9BWtsMINqrJLrRacOk9x',
ADD COLUMN IF NOT EXISTS elevenlabs_model TEXT DEFAULT 'eleven_multilingual_v2';