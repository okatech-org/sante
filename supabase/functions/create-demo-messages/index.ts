import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Check if user already has messages
    const { data: existingMessages } = await supabaseAdmin
      .from('messages')
      .select('id')
      .eq('recipient_id', user.id)
      .limit(1);

    if (existingMessages && existingMessages.length > 0) {
      console.log('User already has messages');
      return new Response(
        JSON.stringify({ message: 'Demo messages already exist' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating demo messages for user:', user.id);

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
        is_starred: false,
        allow_reply: true
      },
      {
        recipient_id: user.id,
        sender_name: "CHU de Libreville",
        sender_type: "hospital",
        subject: "Rappel: Rendez-vous demain",
        content: "Bonjour,\n\nCeci est un rappel automatique pour votre rendez-vous prévu demain à 10h30 au service de cardiologie.\n\nMerci de vous présenter 15 minutes avant l'heure prévue.\n\nCe message est envoyé automatiquement, merci de ne pas répondre.",
        attachments: [],
        priority: "high",
        category: "reminder",
        is_read: true,
        is_starred: false,
        allow_reply: false,
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
        allow_reply: true,
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
        allow_reply: true,
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
        allow_reply: true,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Laboratoire Central d'Analyses",
        sender_type: "laboratory",
        subject: "Résultats d'analyses biologiques disponibles",
        content: "Madame, Monsieur,\n\nVos résultats d'analyses biologiques sont maintenant disponibles. Vous trouverez en pièce jointe le rapport complet ainsi qu'un graphique d'évolution par rapport à vos analyses précédentes.\n\nPour toute question, n'hésitez pas à contacter votre médecin traitant.\n\nCe message est automatique, merci de contacter directement le laboratoire au 01 76 XX XX pour toute demande.\n\nCordialement,\nLaboratoire Central",
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
        allow_reply: false,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Dr. Sophie MOUKAGNI",
        sender_type: "doctor",
        subject: "Suivi dermatologique - Photos d'évolution",
        content: "Bonjour,\n\nJe vous envoie les photos de suivi de votre traitement dermatologique. On observe une nette amélioration sur les 3 derniers mois.\n\nContinuez le traitement encore 2 semaines puis revenez me voir.\n\nBien à vous,\nDr. Sophie MOUKAGNI",
        attachments: [
          {
            name: "Photo_J0.jpg",
            type: "image/jpeg",
            size: "1.8 MB",
            url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
            preview: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400"
          },
          {
            name: "Photo_J30.jpg",
            type: "image/jpeg",
            size: "1.9 MB",
            url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
            preview: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400"
          },
          {
            name: "Photo_J60.jpg",
            type: "image/jpeg",
            size: "2.0 MB",
            url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",
            preview: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
          }
        ],
        priority: "normal",
        category: "result",
        is_read: false,
        is_starred: false,
        allow_reply: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Service des Urgences - CHU",
        sender_type: "hospital",
        subject: "🚨 IMPORTANT - Rappel vaccinal obligatoire",
        content: "ALERTE IMPORTANTE\n\nSelon nos dossiers, votre rappel de vaccination contre la fièvre jaune arrive à échéance dans 30 jours. Cette vaccination est obligatoire au Gabon.\n\nMerci de prendre rendez-vous rapidement auprès de votre centre de vaccination.\n\nCe message automatique ne nécessite pas de réponse.\n\nService de Prévention\nCHU de Libreville",
        attachments: [],
        priority: "urgent",
        category: "alert",
        is_read: false,
        is_starred: false,
        allow_reply: false,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        recipient_id: user.id,
        sender_name: "Cabinet Comptable CNAMGS",
        sender_type: "admin",
        subject: "Facture et remboursement",
        content: "Bonjour,\n\nVotre dossier de remboursement a été traité. Vous trouverez ci-joint la facture détaillée et l'attestation de remboursement.\n\nLe montant sera crédité sous 5 jours ouvrés.\n\nCe message est généré automatiquement. Pour toute réclamation, veuillez contacter notre service client.\n\nCordialement,\nService Comptabilité",
        attachments: [
          {
            name: "Facture_Consultation.pdf",
            type: "application/pdf",
            size: "189 KB",
            url: "#"
          },
          {
            name: "Attestation_Remboursement.pdf",
            type: "application/pdf",
            size: "112 KB",
            url: "#"
          }
        ],
        priority: "normal",
        category: "billing",
        is_read: false,
        is_starred: false,
        allow_reply: false,
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('messages')
      .insert(demoMessages)
      .select();

    if (insertError) {
      console.error('Error creating demo messages:', insertError);
      return new Response(
        JSON.stringify({ error: insertError.message, details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Demo messages created successfully:', insertedData?.length);
    return new Response(
      JSON.stringify({ 
        message: 'Demo messages created successfully', 
        count: insertedData?.length || 0,
        messages: insertedData 
      }),
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
