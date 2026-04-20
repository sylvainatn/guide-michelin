const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  emailVerified: string | null;
  createdAt: string;
};

export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

const request = async <T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<T> => {
  const { accessToken, headers, ...rest } = init;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = body.error ?? {};
    throw new ApiError(
      res.status,
      err.code ?? "unknown_error",
      err.message ?? res.statusText,
      err.details,
    );
  }

  return body as T;
};

export const authApi = {
  signup: (input: { email: string; password: string; name?: string }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  login: (input: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  refresh: () =>
    request<AuthResponse>("/auth/refresh", { method: "POST" }),

  logout: () => request<void>("/auth/logout", { method: "POST" }),

  me: (accessToken: string) =>
    request<{ user: PublicUser }>("/auth/me", { accessToken }),
};
