import { request } from "../auth/client";

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type PublicFriendUser = {
  id: string;
  email: string;
  pseudo: string;
  firstName: string;
  lastName: string;
  lastSeenAt: string | null;
};

export type FriendListItem = {
  friendshipId: string;
  user: PublicFriendUser;
  status: "ACCEPTED";
  online: boolean;
  sinceAt: string;
};

export type PendingInvitation = {
  friendshipId: string;
  user: PublicFriendUser;
  status: "PENDING";
  createdAt: string;
  direction: "INCOMING" | "OUTGOING";
};

export type InviteFriendInput =
  | { pseudo: string; email?: never }
  | { email: string; pseudo?: never };

export const friendsApi = {
  list: (accessToken: string, q?: string) => {
    const query = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    return request<{ friends: FriendListItem[] }>(`/me/friends${query}`, {
      method: "GET",
      accessToken,
    });
  },

  invitations: (accessToken: string) =>
    request<{ invitations: PendingInvitation[] }>("/me/friends/invitations", {
      method: "GET",
      accessToken,
    }),

  invite: (accessToken: string, input: InviteFriendInput) =>
    request<{ friendship: { id: string; status: FriendshipStatus } }>(
      "/me/friends/invitations",
      {
        method: "POST",
        body: JSON.stringify(input),
        accessToken,
      },
    ),

  respond: (
    accessToken: string,
    friendshipId: string,
    action: "accept" | "decline",
  ) =>
    request<{ friendship: { id: string; status: FriendshipStatus } }>(
      `/me/friends/invitations/${friendshipId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ action }),
        accessToken,
      },
    ),

  remove: (accessToken: string, friendshipId: string) =>
    request<void>(`/me/friends/${friendshipId}`, {
      method: "DELETE",
      accessToken,
    }),

  heartbeat: (accessToken: string) =>
    request<void>("/me/friends/heartbeat", {
      method: "POST",
      accessToken,
    }),
};
