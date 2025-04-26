import { createClient } from './supabase/client';

export type UserRole = 'project_owner' | 'investor' | 'guest';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export const authService = {
  async signIn(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Fetch user's role from profiles table
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      return {
        user: data.user,
        role: profile?.role || 'guest',
      };
    }

    return { user: data.user, role: 'guest' };
  },

  async signUp(email: string, password: string, role: UserRole = 'investor') {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Create profile with role information
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        role: role,
        created_at: new Date().toISOString(),
      });
    }

    return data;
  },

  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return true;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      return null;
    }
    
    // Get role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      role: (profile?.role as UserRole) || 'guest',
    };
  },

  // Check if user has a specific role
  async hasRole(role: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  },
};