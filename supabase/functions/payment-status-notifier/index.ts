import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { paymentId, oldStatus, newStatus } = await req.json();

    console.log('Processing payment status change:', { paymentId, oldStatus, newStatus });

    // Get payment details
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      throw new Error('Payment not found');
    }

    // Send notification based on status
    let title = '';
    let message = '';
    let type = 'info';

    switch (newStatus) {
      case 'completed':
        title = 'Paiement réussi ✅';
        message = `Votre paiement de ${payment.amount.toLocaleString()} ${payment.currency} a été traité avec succès.`;
        type = 'payment_success';
        break;
      case 'failed':
        title = 'Paiement échoué ❌';
        message = `Le paiement de ${payment.amount.toLocaleString()} ${payment.currency} n'a pas pu être traité. ${payment.error_message || ''}`;
        type = 'payment_failed';
        break;
      case 'processing':
        title = 'Paiement en cours ⏳';
        message = `Votre paiement de ${payment.amount.toLocaleString()} ${payment.currency} est en cours de traitement.`;
        type = 'info';
        break;
      case 'pending':
        if (oldStatus && oldStatus !== 'pending') {
          title = 'Paiement en attente';
          message = `Votre paiement de ${payment.amount.toLocaleString()} ${payment.currency} est en attente de confirmation.`;
          type = 'payment_reminder';
        }
        break;
    }

    if (title && message) {
      const notificationResponse = await supabaseClient.functions.invoke(
        'send-payment-notifications',
        {
          body: {
            userId: payment.patient_id,
            title,
            message,
            type,
            paymentId: payment.id,
            metadata: {
              amount: payment.amount,
              currency: payment.currency,
              paymentMethod: payment.payment_method,
              transactionId: payment.transaction_id
            }
          }
        }
      );

      console.log('Notification sent:', notificationResponse);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in payment-status-notifier:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});