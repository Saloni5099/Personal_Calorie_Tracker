import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/authApi.js";
import {
  ApiError,
  clearStoredToken,
  setStoredToken,
} from "../api/client.js";

const AuthContext = createContext(null);
const TOKEN_KEY_CHECK = "pct_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY_CHECK));
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const stored = localStorage.getItem(TOKEN_KEY_CHECK);

      if (!stored) {
        if (!cancelled) {
          setInitializing(false);
        }
        return;
      }

      try {
        const response = await authApi.getMe(stored);
        if (!cancelled) {
          setToken(stored);
          setUser(response.data.user);
        }
      } catch (error) {
        if (!cancelled) {
          clearStoredToken();
          setToken(null);
          setUser(null);
        }
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error(error);
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login({ email, password });
    const nextToken = response.data.token;
    const nextUser = response.data.user;

    setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);

    return nextUser;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    await authApi.register({ name, email, password });
    return login(email, password);
  }, [login]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      initializing,
      login,
      register,
      logout,
    }),
    [user, token, initializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
