"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ApiError, authApi, type PublicUser } from "./client";

type AuthState = {
  user: PublicUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
};

type AuthContextValue = AuthState & {
  signup: (input: { email: string; password: string; name?: string }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({ user: null, status: "loading" });
  const accessTokenRef = useRef<string | null>(null);

  const setSession = useCallback((user: PublicUser, accessToken: string) => {
    accessTokenRef.current = accessToken;
    setState({ user, status: "authenticated" });
  }, []);

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    setState({ user: null, status: "unauthenticated" });
  }, []);

  useEffect(() => {
    authApi
      .refresh()
      .then(({ user, accessToken }) => setSession(user, accessToken))
      .catch((err) => {
        if (!(err instanceof ApiError) || err.status !== 401) {
          console.error("refresh failed", err);
        }
        clearSession();
      });
  }, [setSession, clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signup: async (input) => {
        const { user, accessToken } = await authApi.signup(input);
        setSession(user, accessToken);
      },
      login: async (input) => {
        const { user, accessToken } = await authApi.login(input);
        setSession(user, accessToken);
      },
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          clearSession();
        }
      },
      getAccessToken: () => accessTokenRef.current,
    }),
    [state, setSession, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
