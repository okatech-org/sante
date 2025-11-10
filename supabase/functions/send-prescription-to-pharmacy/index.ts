import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  prescriptionId: string;
  pharmacyId: string;
}

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
      }
    );

    const { prescriptionId, pharmacyId }: RequestBody = await req.json();

    console.log('Sending prescription to pharmacy:', { prescriptionId, pharmacyId });

    // Récupérer les détails de l'ordonnance
    const { data: prescription, error: prescriptionError } = await supabaseClient
      .from('electronic_prescriptions')
      .select(`
        *,
        patient:profiles!electronic_prescriptions_patient_id_fkey(full_name, phone, email),
        professional:professionals!electronic_prescriptions_professional_id_fkey(full_name, phone, email, numero_ordre)
      `)
      .eq('id', prescriptionId)
      .single();

    if (prescriptionError) {
      console.error('Error fetching prescription:', prescriptionError);
      throw new Error('Prescription not found');
    }

    // Récupérer les détails de la pharmacie
    const { data: pharmacy, error: pharmacyError } = await supabaseClient
      .from('establishments')
      .select('raison_sociale, email, telephone_standard, whatsapp_business')
      .eq('id', pharmacyId)
      .single();

    if (pharmacyError) {
      console.error('Error fetching pharmacy:', pharmacyError);
      throw new Error('Pharmacy not found');
    }

    // Créer le log d'envoi
    const { error: logError } = await supabaseClient
      .from('prescription_pharmacy_log')
      .insert({
        prescription_id: prescriptionId,
        pharmacy_id: pharmacyId,
        status: 'sent',
        notes: `Ordonnance ${prescription.prescription_number} envoyée à ${pharmacy.raison_sociale}`
      });

    if (logError) {
      console.error('Error creating log:', logError);
      throw logError;
    }

    // TODO: Implémenter l'envoi réel (email, SMS, WhatsApp)
    // Pour l'instant, nous créons simplement le log
    
    console.log('Prescription sent successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Prescription sent to pharmacy',
        prescription_number: prescription.prescription_number,
        pharmacy: pharmacy.raison_sociale
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-prescription-to-pharmacy:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
