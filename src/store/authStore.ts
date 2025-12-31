/**
 * Auth Store (Zustand)
 * ====================
 * Global state management for authentication
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AdminUser } from '@/types';
import { verifyToken } from '@/lib/authService';

interface AuthState {
  user: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: AdminUser | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isLoading: true,
      token: null,

      setUser: (user) => set({ user, isAdmin: user?.isAdmin || false }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setToken: (token) => {
        if (token) {
          sessionStorage.setItem('auth_token', token);
        } else {
          sessionStorage.removeItem('auth_token');
        }
        set({ token });
      },

      logout: () => {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth-storage');
        set({ user: null, isAdmin: false, token: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAdmin: state.isAdmin,
        token: state.token,
      }),
    }
  )
);

/**
 * Initialize auth listener
 * Call this once in App.tsx or main.tsx
 */
export const initializeAuthListener = async () => {
  const { user, token, setUser, setIsAdmin, setIsLoading } = useAuthStore.getState();
  
  // Check if we have a persisted user and token
  if (user && token) {
    // Already have user from storage, just set loading false
    // The token will be validated on next API call
    setIsAdmin(user.isAdmin);
    setIsLoading(false);
    return () => {};
  }
  
  // Check sessionStorage directly for token
  const storedToken = sessionStorage.getItem('auth_token');
  if (storedToken) {
    try {
      const { valid, user: verifiedUser } = await verifyToken();
      if (valid && verifiedUser) {
        setUser(verifiedUser);
        setIsAdmin(verifiedUser.isAdmin);
      }
    } catch {
      // Silent fail - token might still work
    }
  }
  
  setIsLoading(false);
  return () => {};
};
