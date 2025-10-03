// /stores/useAuthStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage,  } from 'zustand/middleware';

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// Define your user shape
type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  session: any | null; // supabase session object
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  logout: () => void;
};

// Persist the store so it survives refresh
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setSession: (session) =>
        set({
          session,
        }),

      logout: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // key in localStorage
      storage: createJSONStorage<StateStorage>(() =>
        typeof window !== 'undefined' ? localStorage : memoryStorage
      ),
    }
  )
);
