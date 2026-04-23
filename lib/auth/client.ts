const rawBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
/** When unset, use same-origin `/api` (see `rewrites` in next.config.ts). */
const API_BASE = rawBase ?? "/api";

export type Role = "USER" | "ADMIN";

export type PublicUser = {
  id: string;
  email: string;
  pseudo: string;
  lastName: string;
  firstName: string;
  emailVerified: string | null;
  createdAt: string;
  role: Role;
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

export const request = async <T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<T> => {
  const { accessToken, headers, ...rest } = init;
  const res = await fetch(`${API_BASE}${path}`, {
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

export type TravelEnvironment = "SEA" | "MOUNTAINS" | "VINEYARDS" | "CITY";
export type CuisineStyle = "TRADITION" | "CREATIVITY" | "ECO";
export type TravelStyle =
  | "GASTRONOMIC"
  | "ADVENTURE"
  | "CULTURE"
  | "ROMANCE";
export type TravelPace = "SLOW" | "ROADTRIP";
export type TripDuration =
  | "ONE_NIGHT"
  | "SHORT_BREAK"
  | "ONE_WEEK"
  | "EXTENDED";
export type BudgetTier = "DISCOVERY" | "EXCELLENCE" | "PRESTIGE";

export type UserProfile = {
  id: string;
  userId: string;
  age: number | null;
  environments: TravelEnvironment[];
  cuisines: CuisineStyle[];
  travelStyle: TravelStyle | null;
  travelPace: TravelPace | null;
  tripDuration: TripDuration | null;
  budgetPerNight: number | null;
  budgetTier: BudgetTier | null;
  onboardingCompletedAt: string | null;
};

export type UpdateProfileInput = {
  age?: number;
  environments?: TravelEnvironment[];
  cuisines?: CuisineStyle[];
  travelStyle?: TravelStyle;
  travelPace?: TravelPace;
  tripDuration?: TripDuration;
  budgetPerNight?: number;
  budgetTier?: BudgetTier;
  completed?: boolean;
};

export const profileApi = {
  get: (accessToken: string) =>
    request<{ profile: UserProfile | null }>("/me/profile", { accessToken }),

  update: (input: UpdateProfileInput, accessToken: string) =>
    request<{ profile: UserProfile }>("/me/profile", {
      method: "PUT",
      body: JSON.stringify(input),
      accessToken,
    }),
};

export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  pseudo?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export const userApi = {
  updateMe: (input: UpdateUserInput, accessToken: string) =>
    request<{ user: PublicUser }>("/me", {
      method: "PATCH",
      body: JSON.stringify(input),
      accessToken,
    }),

  changePassword: (input: ChangePasswordInput, accessToken: string) =>
    request<void>("/me/password", {
      method: "POST",
      body: JSON.stringify(input),
      accessToken,
    }),
};

export const authApi = {
  signup: (input: {
    email: string;
    pseudo: string;
    password: string;
    lastName: string;
    firstName: string;
  }) =>
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
