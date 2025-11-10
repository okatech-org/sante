import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentNotification {
  userId: string;
  title: string;
  message: string;
  type: 'payment_success' | 'payment_failed' | 'payment_reminder';
  paymentId: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const {
      userId,
      title,
      message,
      type,
      paymentId,
      metadata
    }: PaymentNotification = await req.json();

    console.log('Creating notification:', { userId, title, type, paymentId });

    // Create notification record
    const { data: notification, error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        metadata: { ...metadata, payment_id: paymentId },
        priority: type === 'payment_failed' ? 'high' : 'normal',
        read: false
      })
      .select()
      .single();

    if (notifError) {
      console.error('Error creating notification:', notifError);
      throw notifError;
    }

    console.log('Notification created successfully:', notification.id);

    // In a real implementation, you would send push notifications here
    // For demo, we just log it
    console.log('Push notification would be sent:', {
      userId,
      title,
      message,
      type
    });

    return new Response(
      JSON.stringify({
        success: true,
        notificationId: notification.id,
        message: 'Notification sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-payment-notifications:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});