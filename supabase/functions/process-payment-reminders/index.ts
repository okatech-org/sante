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

    console.log('Processing payment reminders...');

    // Get pending payments that need reminders
    const { data: reminders, error: remindersError } = await supabaseClient
      .from('payment_reminders')
      .select(`
        *,
        payments:payment_id (
          id,
          patient_id,
          amount,
          currency,
          payment_method,
          status,
          created_at
        )
      `)
      .lte('next_reminder_at', new Date().toISOString())
      .eq('payments.status', 'pending')
      .limit(50);

    if (remindersError) {
      console.error('Error fetching reminders:', remindersError);
      throw remindersError;
    }

    console.log(`Found ${reminders?.length || 0} reminders to process`);

    const results = [];

    for (const reminder of reminders || []) {
      const payment = reminder.payments;
      if (!payment) continue;

      try {
        // Send reminder notification
        const notificationResponse = await supabaseClient.functions.invoke(
          'send-payment-notifications',
          {
            body: {
              userId: payment.patient_id,
              title: 'Rappel de paiement',
              message: `Vous avez un paiement en attente de ${payment.amount.toLocaleString()} ${payment.currency}. Veuillez finaliser votre paiement.`,
              type: 'payment_reminder',
              paymentId: payment.id,
              metadata: {
                amount: payment.amount,
                currency: payment.currency,
                paymentMethod: payment.payment_method,
                reminderCount: reminder.reminder_count + 1
              }
            }
          }
        );

        // Update reminder record
        const nextReminderInterval = Math.min(
          24 * (reminder.reminder_count + 1),
          72
        ); // Max 72 hours between reminders
        
        const { error: updateError } = await supabaseClient
          .from('payment_reminders')
          .update({
            reminder_count: reminder.reminder_count + 1,
            last_reminder_sent_at: new Date().toISOString(),
            next_reminder_at: new Date(Date.now() + nextReminderInterval * 60 * 60 * 1000).toISOString()
          })
          .eq('id', reminder.id);

        if (updateError) {
          console.error('Error updating reminder:', updateError);
        } else {
          results.push({
            paymentId: payment.id,
            success: true,
            reminderCount: reminder.reminder_count + 1
          });
        }

      } catch (error: any) {
        console.error(`Error processing reminder for payment ${payment.id}:`, error);
        results.push({
          paymentId: payment.id,
          success: false,
          error: error.message
        });
      }
    }

    console.log('Reminder processing complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in process-payment-reminders:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});