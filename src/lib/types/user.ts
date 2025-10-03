export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeMode {
  mode: 'light' | 'dark';
}

export interface ThemeState {
  currentTheme: ThemeMode['mode'];
  isSystemTheme: boolean;
}
