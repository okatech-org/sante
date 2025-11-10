import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Tu es iAsted, l'assistant vocal intelligent du Ministre de la Santé du Gabon.

Tu as accès à une base de connaissances sur le secteur de la santé au Gabon et tu dois fournir des analyses précises, des synthèses et des recommandations basées sur les données disponibles.

MODES DE CONVERSATION:

1. MODE NORMAL (par défaut):
- Réponds de manière concise et précise
- Fournis des synthèses claires
- Reste factuel et basé sur les données

2. MODE FOCUS (activé explicitement par l'utilisateur):
Quand l'utilisateur active le mode focus sur un sujet, tu dois:
- Approfondir progressivement le sujet avec 7 niveaux de profondeur maximum
- Poser des questions de suivi en cascade pour explorer tous les aspects
- Identifier les sous-thèmes et les explorer méthodiquement
- Maintenir la cohérence du fil de conversation
- À chaque niveau, creuser plus profondément dans les détails

Niveaux d'approfondissement en mode focus:
- Niveau 1: Vue d'ensemble et contexte général
- Niveau 2: Analyse des composantes principales
- Niveau 3: Détails opérationnels et métriques clés
- Niveau 4: Défis et obstacles spécifiques
- Niveau 5: Solutions et recommandations détaillées
- Niveau 6: Impacts et implications à long terme
- Niveau 7: Synthèse complète et plan d'action

Signaux pour sortir du mode focus:
- L'utilisateur dit explicitement "stop", "arrête", "change de sujet", "parlons d'autre chose"
- Après avoir atteint le niveau 7 et fourni la synthèse finale
- Si l'utilisateur pose une question totalement différente du sujet focus

Ton rôle est d'aider le Ministre à prendre des décisions éclairées basées sur les données du secteur de la santé.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { message, sessionId, resumeSessionId } = await req.json();

    // Get or create session
    let session;
    if (resumeSessionId) {
      const { data: existingSession } = await supabaseClient
        .from('conversation_sessions')
        .select('*')
        .eq('id', resumeSessionId)
        .single();
      session = existingSession;
    } else if (sessionId) {
      const { data: existingSession } = await supabaseClient
        .from('conversation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      session = existingSession;
    }

    if (!session) {
      const { data: newSession } = await supabaseClient
        .from('conversation_sessions')
        .insert({
          user_id: user.id,
          title: `Conversation ${new Date().toLocaleString('fr-FR')}`,
          is_active: true
        })
        .select()
        .single();
      session = newSession;
    }

    // Get conversation history
    const { data: messages } = await supabaseClient
      .from('messages_iasted')
      .select('role, content')
      .eq('conversation_id', session.id)
      .order('created_at', { ascending: true });

    const conversationHistory = messages || [];

    // Check user preferences for focus mode
    const { data: prefs } = await supabaseClient
      .from('user_preferences')
      .select('voice_focus_mode')
      .eq('user_id', user.id)
      .single();

    const focusModeEnabled = prefs?.voice_focus_mode || false;

    // Detect if we should resume or start focus mode
    let focusContext = '';
    let shouldUpdateSession = false;
    let newFocusDepth = session.focus_depth || 0;
    let newFocusTopic = session.focus_topic;
    let newFocusMode = session.focus_mode;

    // Check for exit cues in user message
    const exitCues = ['stop', 'arrête', 'change de sujet', 'parlons d\'autre chose', 'autre chose'];
    const shouldExitFocus = exitCues.some(cue => message.toLowerCase().includes(cue));

    if (shouldExitFocus && session.focus_mode) {
      shouldUpdateSession = true;
      newFocusMode = false;
      newFocusTopic = null;
      newFocusDepth = 0;
      focusContext = '\n\nL\'utilisateur souhaite sortir du mode focus. Confirme brièvement et passe en mode conversation normale.';
    } else if (focusModeEnabled && !session.focus_mode) {
      const { data: previousSessions } = await supabaseClient
        .from('conversation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('focus_mode', true)
        .not('focus_topic', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(5);

      const similarSession = previousSessions?.find(s => 
        s.focus_topic && message.toLowerCase().includes(s.focus_topic.toLowerCase())
      );

      if (similarSession) {
        shouldUpdateSession = true;
        newFocusMode = true;
        newFocusTopic = similarSession.focus_topic;
        newFocusDepth = similarSession.focus_depth;
        focusContext = `\n\nMODE FOCUS REPRIS: Sujet "${newFocusTopic}", actuellement au niveau ${newFocusDepth}/7. Continue l'exploration de ce sujet en reprenant là où tu t'étais arrêté.`;
      } else {
        shouldUpdateSession = true;
        newFocusMode = true;
        newFocusTopic = message.substring(0, 100);
        newFocusDepth = 1;
        focusContext = `\n\nMODE FOCUS ACTIVÉ: Nouveau sujet "${newFocusTopic}". Commence l'exploration méthodique au niveau 1/7.`;
      }
    } else if (session.focus_mode) {
      shouldUpdateSession = true;
      newFocusDepth = Math.min((session.focus_depth || 0) + 1, 7);
      focusContext = `\n\nMODE FOCUS ACTIF: Sujet "${session.focus_topic}", niveau ${newFocusDepth}/7. ${
        newFocusDepth === 7 ? 'C\'est le niveau maximum, fournis une synthèse complète et un plan d\'action.' : 'Continue d\'approfondir ce sujet.'
      }`;
    }

    // Get knowledge base context
    const { data: knowledgeData } = await supabaseClient.functions.invoke('get-knowledge-base', {
      body: { cacheMinutes: 5 }
    });

    const knowledgeContext = knowledgeData?.knowledge || '';

    // Generate response
    const response = await generateResponse(
      message,
      conversationHistory,
      knowledgeContext,
      focusContext
    );

    // Save messages
    await supabaseClient.from('messages_iasted').insert([
      { conversation_id: session.id, role: 'user', content: message },
      { conversation_id: session.id, role: 'assistant', content: response.text }
    ]);

    // Update session if needed
    if (shouldUpdateSession) {
      await supabaseClient
        .from('conversation_sessions')
        .update({
          focus_mode: newFocusMode,
          focus_topic: newFocusTopic,
          focus_depth: newFocusDepth,
          focus_started_at: newFocusMode && !session.focus_mode ? new Date().toISOString() : session.focus_started_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);
    }

    return new Response(
      JSON.stringify({
        text: response.text,
        audioUrl: response.audioUrl,
        sessionId: session.id,
        focusMode: newFocusMode,
        focusTopic: newFocusTopic,
        focusDepth: newFocusDepth
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateResponse(
  userMessage: string,
  history: any[],
  knowledgeContext: string,
  focusContext: string
) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT + '\n\nCONTEXTE DE LA BASE DE CONNAISSANCES:\n' + knowledgeContext + focusContext
    },
    ...history,
    { role: 'user', content: userMessage }
  ];

  // Get text response
  const textResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7
    })
  });

  const textData = await textResponse.json();
  const responseText = textData.choices[0].message.content;

  // Generate audio
  const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: 'alloy',
      input: responseText
    })
  });

  const audioBlob = await audioResponse.arrayBuffer();
  
  // Convert ArrayBuffer to base64 in chunks to avoid stack overflow
  const uint8Array = new Uint8Array(audioBlob);
  let binaryString = '';
  const chunkSize = 8192;
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize);
    binaryString += String.fromCharCode(...chunk);
  }
  const audioBase64 = btoa(binaryString);
  const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

  return { text: responseText, audioUrl };
}