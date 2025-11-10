import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Payment {
  id: string;
  appointment_id: string | null;
  teleconsultation_id: string | null;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  transaction_id: string | null;
  created_at: string;
  completed_at: string | null;
  payment_details: any;
}

interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: number;
}

export function usePayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is a professional
      const { data: professionalData } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (professionalData) {
        // Professional: get payments for their services
        query = query.eq('professional_id', professionalData.id);
      } else {
        // Patient: get their own payments
        query = query.eq('patient_id', user?.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPayments(data || []);

      // Calculate stats
      const completed = data?.filter(p => p.status === 'completed').length || 0;
      const pending = data?.filter(p => p.status === 'pending').length || 0;
      const failed = data?.filter(p => p.status === 'failed').length || 0;
      const totalAmount = data
        ?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;

      setStats({
        total: data?.length || 0,
        completed,
        pending,
        failed,
        totalAmount
      });

      // Set up realtime subscription
      const channel = supabase
        .channel('payments_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payments',
            filter: professionalData 
              ? `professional_id=eq.${professionalData.id}`
              : `patient_id=eq.${user?.id}`
          },
          () => {
            fetchPayments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };

    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    stats,
    loading,
    error,
    refetch: fetchPayments
  };
}