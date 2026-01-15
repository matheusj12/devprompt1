import React, { createContext, useContext, useState, useEffect } from 'react';

// Check if Supabase is configured
const SUPABASE_CONFIGURED = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company_id: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  name: string;
  owner_id: string;
  logo_url: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  company_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  created_at: string;
}

interface User {
  id: string;
  email: string;
}

interface Session {
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  company: Company | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, companyName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo mode
const mockUser: User = {
  id: 'demo-user-id',
  email: 'demo@devprompts.com',
};

const mockSession: Session = {
  user: mockUser,
};

const mockProfile: Profile = {
  id: 'demo-profile-id',
  user_id: 'demo-user-id',
  email: 'demo@devprompts.com',
  full_name: 'Usuário Demo',
  avatar_url: null,
  company_id: 'demo-company-id',
  is_active: true,
  last_login: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockCompany: Company = {
  id: 'demo-company-id',
  name: 'Empresa Demo',
  owner_id: 'demo-user-id',
  logo_url: null,
  plan: 'pro',
  settings: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockUserRole: UserRole = {
  id: 'demo-role-id',
  user_id: 'demo-user-id',
  company_id: 'demo-company-id',
  role: 'owner',
  created_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, use mock data
    if (!SUPABASE_CONFIGURED) {
      console.log('🎭 Running in DEMO MODE - Supabase not configured');
      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);
      setCompany(mockCompany);
      setUserRole(mockUserRole);
      setLoading(false);
      return;
    }

    // Supabase mode would go here
    // For now, just set loading to false
    setLoading(false);
  }, []);

  const signIn = async (_email: string, _password: string) => {
    if (!SUPABASE_CONFIGURED) {
      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);
      setCompany(mockCompany);
      setUserRole(mockUserRole);
      return { error: null };
    }
    return { error: new Error('Supabase not configured') };
  };

  const signUp = async (_email: string, _password: string, _fullName: string, _companyName?: string) => {
    if (!SUPABASE_CONFIGURED) {
      return { error: null };
    }
    return { error: new Error('Supabase not configured') };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setCompany(null);
    setUserRole(null);
  };

  const resetPassword = async (_email: string) => {
    return { error: null };
  };

  const updateProfile = async (_updates: Partial<Profile>) => {
    return { error: null };
  };

  const refreshProfile = async () => {
    // No-op in demo mode
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        company,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
