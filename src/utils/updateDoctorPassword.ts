import { supabase } from "@/integrations/supabase/client";

export const updateDoctorPassword = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('update-user-password', {
      body: {
        userId: '22387b61-a53a-4624-8c1d-d17d44015605', // Dr. Pierre KOMBILA
        newPassword: 'Doctor2025!'
      }
    });

    if (error) {
      console.error('Error updating doctor password:', error);
      return { success: false, error };
    }

    console.log('Password updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error calling edge function:', error);
    return { success: false, error };
  }
};
