import { createClient } from '@supabase/supabase-js';
import Logger from '../core/Logger.js';

const logger = new Logger('Supabase');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('⚠️ Supabase credentials not fully configured (optional for development)');
}

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    logger.debug(`Auth state changed: ${event}`);
  });

  logger.info('✅ Supabase client initialized');
} else {
  logger.warn('⚠️ Supabase not configured - using mock mode');
}

export default supabase;
