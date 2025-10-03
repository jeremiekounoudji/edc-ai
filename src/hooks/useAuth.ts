import { useState, useCallback } from "react";
import { AuthState, User, LoginCredentials, RegisterData } from "@/types/auth";
import { logInfo } from "@/lib/utils/logger";
import { useAuthStore } from "@/store/useAuthStore";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const setLoading = (isLoading: boolean) =>
    setAuthState((prev) => ({ ...prev, isLoading }));

  const setError = (error: string | null) =>
    setAuthState((prev) => ({ ...prev, error }));

  /** 🔹 LOGIN */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      logInfo("Login result", data);
      if (res.ok) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        useAuthStore.getState().setSession(data.session);
        useAuthStore.getState().setUser(data.user);
        return { success: true, message: data.message };
      } else {
        setError(data.error || "Login failed");
        return { success: false, message: data.error || "Login failed" };
      }
    } catch (err) {
      logInfo("Unexpected error during login", { error: err });
      setError("Unexpected error during login");
      return { success: false, message: "Unexpected error during login" };
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔹 REGISTER */
  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      logInfo("Registration result", result);

      if (res.ok && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, message: result.message };
      } else {
        setError(result.error || "Registration failed");
        return {
          success: false,
          message: result.error || "Registration failed",
        };
      }
    } catch (err) {
      setError("Unexpected error during registration");
      return {
        success: false,
        message: "Unexpected error during registration",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔹 LOGOUT */
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthState(initialState);
  }, []);

  /** 🔹 CLEAR ERRORS */
  const clearError = () => setError(null);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
  };
};
