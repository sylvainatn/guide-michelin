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
  signup: (input: { email: string; password: string; lastName: string; firstName: string }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({ user: null, status: "loading" });
  const accessTokenRef = useRef<string | null>(null);
  const bootstrappedRef = useRef(false);

  const setSession = useCallback((user: PublicUser, accessToken: string) => {
    accessTokenRef.current = accessToken;
    setState({ user, status: "authenticated" });
  }, []);

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    setState({ user: null, status: "unauthenticated" });
  }, []);

  useEffect(() => {
    // Guard against React Strict Mode's double-invocation in dev:
    // /auth/refresh rotates the refresh token, so a second concurrent call
    // with the now-stale cookie would 401 and wipe the session.
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    authApi
      .refresh()
      .then(({ user, accessToken }) => setSession(user, accessToken))
      .catch((err) => {
        if (err instanceof ApiError) {
          console.warn(
            `[auth] refresh failed: status=${err.status} code=${err.code}`,
          );
        } else if (err instanceof TypeError) {
          console.warn("[auth] refresh unreachable (API down?):", err.message);
        } else {
          console.error("[auth] refresh unexpected error", err);
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
