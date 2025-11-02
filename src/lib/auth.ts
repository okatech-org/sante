import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database['public']['Enums']['app_role'];

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  fullName: string;
}

export const authService = {
  async signUp(email: string, password: string, userData: {
    fullName: string;
    phone: string;
    birthDate?: Date;
    gender?: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phone,
          birth_date: userData.birthDate?.toISOString(),
          gender: userData.gender,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(identifier: string, password: string) {
    // Normaliser les entrées
    const id = (identifier || '').trim();
    const pwd = (password || '').trim();
    const isEmail = id.includes('@');
    
    if (isEmail) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: id.toLowerCase(),
        password: pwd,
      });
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: id,
        password: pwd,
      });
      if (error) throw error;
      return data;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getUserRoles(userId: string): Promise<AppRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) throw error;
    return (data?.map(r => r.role) || []) as AppRole[];
  },

  async hasRole(userId: string, role: AppRole) {
    const { data, error } = await supabase
      .rpc('has_role', {
        _user_id: userId,
        _role: role
      });
    
    if (error) throw error;
    return data;
  },

  async hasAnyRole(userId: string, roles: AppRole[]) {
    const { data, error } = await supabase
      .rpc('has_any_role', {
        _user_id: userId,
        _roles: roles
      });
    
    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
