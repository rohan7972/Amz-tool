import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'viewer';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
        // Store token in localStorage for API requests
        localStorage.setItem('auth_token', token);
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
        localStorage.setItem('auth_token', token);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
        localStorage.removeItem('auth_token');
      },

      clearError: () => {
        set({ error: null });
      },

      setAuth: (user: User, token: string, refreshToken?: string) => {
        console.log('[AUTH STORE] setAuth called');
        console.log('[AUTH STORE] User:', user.email, 'Role:', user.role);
        console.log('[AUTH STORE] Token length:', token?.length);
        console.log('[AUTH STORE] Token first 50 chars:', token?.substring(0, 50));
        
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
        
        localStorage.setItem('auth_token', token);
        console.log('[AUTH STORE] Token saved to localStorage');
        console.log('[AUTH STORE] Verification - stored token:', localStorage.getItem('auth_token')?.substring(0, 50));
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
        localStorage.removeItem('auth_token');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hooks for common auth operations
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    clearError: store.clearError,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    setUser: store.setUser,
    setToken: store.setToken,
    setLoading: store.setLoading,
    setError: store.setError,
    login: store.login,
    logout: store.logout,
    clearError: store.clearError,
  };
};