import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MedicamentFR {
  cis: number;
  elementPharmaceutique: string;
  formePharmaceutique: string;
  voiesAdministration: string[];
  statusAutorisation: string;
  titulaire?: string;
  composition: Array<{
    denominationSubstance: string;
    dosage: string;
  }>;
  presentation: Array<{
    cip13: number;
    cip7: number;
    libelle: string;
    statusAdministratif: string;
    prix?: number;
    tauxRemboursement?: string;
  }>;
  generiques?: Array<any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('📥 Début de l\'importation depuis API Médicaments FR');

    // Appel à l'API française
    const apiUrl = 'https://medicaments-api.giygas.dev/database';
    console.log(`Appel API: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const medicamentsFR: MedicamentFR[] = Array.isArray(data) ? data : [];
    
    console.log(`📊 Nombre de médicaments reçus: ${medicamentsFR.length}`);

    let imported = 0;
    let errors = 0;

    // Traiter par lots de 100
    const batchSize = 100;
    for (let i = 0; i < medicamentsFR.length; i += batchSize) {
      const batch = medicamentsFR.slice(i, i + batchSize);
      
      const medicamentsToInsert = batch.map(med => {
        const presentation = med.presentation?.[0];
        const composition = med.composition?.[0];
        
        // Extraction du nom commercial (avant la virgule)
        const nomComplet = med.elementPharmaceutique?.trim() || 'Non spécifié';
        const nomCommercial = nomComplet.split(',')[0].trim();
        
        // Conversion EUR → XAF (1 EUR ≈ 656 XAF)
        const tauxConversion = 656;
        const prixEur = presentation?.prix || 0;
        const prixXAF = Math.round(prixEur * tauxConversion);

        return {
          code_cip: presentation?.cip13?.toString() || presentation?.cip7?.toString() || med.cis?.toString(),
          code_atc: null, // Non fourni par l'API FR
          nom_commercial: nomCommercial,
          dci: composition?.denominationSubstance?.trim() || null,
          forme_pharmaceutique: med.formePharmaceutique?.trim() || null,
          dosage: composition?.dosage?.trim() || null,
          conditionnement: presentation?.libelle?.trim() || null,
          voie_administration: med.voiesAdministration?.join(', ') || null,
          classe_therapeutique: null, // À enrichir manuellement
          famille_pharmacologique: null,
          laboratoire_fabricant: med.titulaire?.trim() || null,
          pays_origine: 'France',
          tarif_conventionne_cnamgs: prixXAF > 0 ? prixXAF : null,
          prix_moyen_pharmacie: prixXAF > 0 ? Math.round(prixXAF * 1.15) : null, // +15% marge
          est_generique: med.generiques && med.generiques.length > 0,
          necessite_ordonnance: true, // Par défaut prudent
          substance_controlee: false,
          stupefiant: false,
          statut: med.statusAutorisation?.includes('Autorisation active') ? 'actif' : 'inactif',
        };
      });

      // Insertion par upsert (évite les doublons sur code_cip)
      const { error: insertError } = await supabaseClient
        .from('medicaments')
        .upsert(medicamentsToInsert, { onConflict: 'code_cip', ignoreDuplicates: true });

      if (insertError) {
        console.error(`Erreur insertion batch ${i}-${i + batchSize}:`, insertError);
        errors += batch.length;
      } else {
        imported += batch.length;
        console.log(`✅ Batch ${i / batchSize + 1} importé (${imported} total)`);
      }
    }

    console.log(`✅ Importation terminée: ${imported} importés, ${errors} erreurs`);

    return new Response(
      JSON.stringify({
        success: true,
        imported,
        errors,
        total: medicamentsFR.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Erreur:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
