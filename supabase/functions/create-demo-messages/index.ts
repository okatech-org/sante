import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has messages
    const { data: existingMessages } = await supabaseClient
      .from('messages')
      .select('id')
      .eq('recipient_id', user.id)
      .limit(1);

    if (existingMessages && existingMessages.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Demo messages already exist' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const demoMessages = [
      {
        recipient_id: user.id,
        sender_name: "Dr. Jean ONDO",
        sender_type: "doctor",
        subject: "Résultats de vos analyses sanguines",
        content: "Bonjour,\n\nVos résultats d'analyses sanguines sont maintenant disponibles. Les valeurs sont dans les normes. Je reste à votre disposition pour toute question.\n\nCordialement,\nDr. Jean ONDO",
        attachments: [{
          name: "Analyses_Sanguines_2025.pdf",
          type: "application/pdf",
          size: "245 KB",
          url: "#"
        }],
        priority: "normal",
        category: "result",
        is_read: false,
        is_starred: false
      },
      {
        recipient_id: user.id,
        sender_name: "CHU de Libreville",
        sender_type: "hospital",
        subject: "Rappel: Rendez-vous demain",
        content: "Bonjour,\n\nCeci est un rappel pour votre rendez-vous prévu demain à 10h30 au service de cardiologie.\n\nMerci de vous présenter 15 minutes avant l'heure prévue.",
        attachments: [],
        priority: "high",
        category: "reminder",
        is_read: true,
        is_starred: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Pharmacie Centrale",
        sender_type: "pharmacy",
        subject: "Votre ordonnance est prête",
        content: "Bonjour,\n\nVotre ordonnance du Dr. ONDO est prête et disponible pour retrait. Vous pouvez passer à la pharmacie pendant nos heures d'ouverture.\n\nCordialement,\nPharmacie Centrale",
        attachments: [{
          name: "Facture_Pharmacie.pdf",
          type: "application/pdf",
          size: "128 KB",
          url: "#"
        }],
        priority: "normal",
        category: "prescription",
        is_read: false,
        is_starred: false,
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Dr. Marie AKENDENGUE",
        sender_type: "doctor",
        subject: "Résultats de votre radiographie pulmonaire",
        content: "Bonjour,\n\nVotre radiographie pulmonaire a été analysée. Les clichés montrent une amélioration significative. Continuez le traitement comme prescrit.\n\nBien cordialement,\nDr. Marie AKENDENGUE",
        attachments: [
          {
            name: "Radio_Thorax_15012025.jpg",
            type: "image/jpeg",
            size: "2.3 MB",
            url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
            preview: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400"
          },
          {
            name: "Compte_Rendu_Radio.pdf",
            type: "application/pdf",
            size: "156 KB",
            url: "#"
          }
        ],
        priority: "normal",
        category: "result",
        is_read: false,
        is_starred: false,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Clinique de Kinésithérapie",
        sender_type: "hospital",
        subject: "Exercices de rééducation - Tutoriel vidéo",
        content: "Bonjour,\n\nComme convenu lors de votre dernière séance, voici le tutoriel vidéo des exercices à pratiquer chez vous. Visionnez attentivement la vidéo et suivez le programme joint.\n\nN'hésitez pas à me contacter si vous avez des questions.\n\nCordialement,\nL'équipe de kinésithérapie",
        attachments: [
          {
            name: "Exercices_Kine_Tutorial.mp4",
            type: "video/mp4",
            size: "45.8 MB",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
            duration: "12:34"
          },
          {
            name: "Programme_Exercices.pdf",
            type: "application/pdf",
            size: "892 KB",
            url: "#"
          }
        ],
        priority: "normal",
        category: "reminder",
        is_read: false,
        is_starred: false,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Laboratoire Central d'Analyses",
        sender_type: "laboratory",
        subject: "Résultats d'analyses biologiques disponibles",
        content: "Madame, Monsieur,\n\nVos résultats d'analyses biologiques sont maintenant disponibles. Vous trouverez en pièce jointe le rapport complet ainsi qu'un graphique d'évolution par rapport à vos analyses précédentes.\n\nPour toute question, n'hésitez pas à contacter votre médecin traitant.\n\nCordialement,\nLaboratoire Central",
        attachments: [
          {
            name: "Resultats_Analyses_Completes.pdf",
            type: "application/pdf",
            size: "456 KB",
            url: "#"
          },
          {
            name: "Graphique_Evolution.png",
            type: "image/png",
            size: "890 KB",
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
          }
        ],
        priority: "high",
        category: "result",
        is_read: false,
        is_starred: false,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Service des Urgences - CHU",
        sender_type: "hospital",
        subject: "🚨 IMPORTANT - Rappel vaccinal obligatoire",
        content: "ALERTE IMPORTANTE\n\nSelon nos dossiers, votre rappel de vaccination contre la fièvre jaune arrive à échéance dans 30 jours. Cette vaccination est obligatoire au Gabon.\n\nMerci de prendre rendez-vous rapidement auprès de votre centre de vaccination.\n\nService de Prévention\nCHU de Libreville",
        attachments: [],
        priority: "urgent",
        category: "alert",
        is_read: false,
        is_starred: false,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { error: insertError } = await supabaseClient
      .from('messages')
      .insert(demoMessages);

    if (insertError) {
      console.error('Error creating demo messages:', insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Demo messages created successfully', count: demoMessages.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
