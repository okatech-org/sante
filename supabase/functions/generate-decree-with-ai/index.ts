import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context, type, referenceDocuments } = await req.json();
    
    if (!context) {
      return new Response(
        JSON.stringify({ error: "Le contexte est requis" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY n'est pas configurée");
    }

    // Construire le prompt système selon le type de document
    const documentTypePrompts: Record<string, string> = {
      decree: "un Décret ministériel",
      order: "un Arrêté ministériel",
      circular: "une Circulaire ministérielle",
      decision: "une Décision ministérielle",
      note: "une Note de Service"
    };

    const documentType = documentTypePrompts[type] || "un document ministériel";

    let systemPrompt = `Vous êtes un expert en rédaction de documents officiels du Ministère de la Santé de la République Gabonaise.

Votre rôle est de rédiger ${documentType} selon les normes administratives gabonaises.

Structure type d'un décret :
- En-tête avec les visas juridiques ("Vu la Constitution", "Vu la loi n°...", etc.)
- Considérants expliquant les motivations
- Dispositif avec articles numérotés
- Article final sur l'entrée en vigueur
- Mention des destinataires

Règles :
- Ton formel et administratif
- Références juridiques précises
- Articles courts et clairs
- Numérotation cohérente (Article 1er, Article 2, etc.)
- Date et signature en fin de document`;

    // Ajouter le contexte des documents de référence si fournis
    let userPrompt = context;
    if (referenceDocuments && referenceDocuments.length > 0) {
      systemPrompt += `\n\nDocuments de référence fournis :\n${referenceDocuments.join('\n\n---\n\n')}`;
      userPrompt = `En vous basant sur les documents de référence fournis et le contexte suivant, rédigez le document :\n\n${context}`;
    }

    console.log('Génération du document avec l\'IA...', { type, contextLength: context.length, hasReferences: !!referenceDocuments?.length });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur AI gateway:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes dépassée. Veuillez réessayer dans quelques instants." }),
          { 
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédit insuffisant. Veuillez ajouter des crédits à votre espace Lovable AI." }),
          { 
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      throw new Error(`Erreur AI gateway: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("Aucun contenu généré par l'IA");
    }

    console.log('Document généré avec succès');

    return new Response(
      JSON.stringify({ 
        success: true,
        content: generatedContent 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Erreur lors de la génération:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
