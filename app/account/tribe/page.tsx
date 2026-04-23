"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  BellIcon,
  PlusIcon,
  SearchIcon,
  UserPlusIcon,
} from "@/components/atoms/icons";
import { MutedText } from "@/components/atoms/MutedText";
import { useAuth } from "@/lib/auth/context";
import {
  friendsApi,
  type FriendListItem,
  type PendingInvitation,
} from "@/lib/friends/client";
import { ApiError } from "@/lib/auth/client";

const AVATAR_COLORS = [
  "bg-[#c0012c]",
  "bg-[#3b82f6]",
  "bg-[#22c55e]",
  "bg-[#d4a020]",
  "bg-[#8b5cf6]",
  "bg-[#ec4899]",
  "bg-[#06b6d4]",
  "bg-[#f97316]",
];

const colorForUserId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const displayShortName = (firstName: string, lastName: string) => {
  const initial = lastName?.[0] ? `${lastName[0]}.` : "";
  return `${firstName} ${initial}`.trim();
};

const initialOf = (firstName: string, pseudo: string) =>
  (firstName?.[0] ?? pseudo?.[0] ?? "?").toUpperCase();

export default function TribePage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();

  const [friends, setFriends] = useState<FriendListItem[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const [friendsRes, invitationsRes] = await Promise.all([
        friendsApi.list(token),
        friendsApi.invitations(token),
      ]);
      setFriends(friendsRes.friends);
      setInvitations(invitationsRes.invitations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  // Initial load + heartbeat setup
  useEffect(() => {
    if (status !== "authenticated") return;
    void refresh();

    const token = getAccessToken();
    if (!token) return;

    friendsApi.heartbeat(token).catch(() => {});
    const heartbeatInterval = setInterval(() => {
      const t = getAccessToken();
      if (t) friendsApi.heartbeat(t).catch(() => {});
    }, 60_000);

    const presenceInterval = setInterval(() => {
      void refresh();
    }, 30_000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(presenceInterval);
    };
  }, [status, getAccessToken, refresh]);

  const filteredFriends = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => {
      const full = `${f.user.firstName} ${f.user.lastName}`.toLowerCase();
      return (
        f.user.email.toLowerCase().includes(q) ||
        f.user.pseudo.toLowerCase().includes(q) ||
        full.includes(q)
      );
    });
  }, [friends, searchQuery]);

  const onlineFriends = filteredFriends.filter((f) => f.online);

  const incomingInvitations = invitations.filter(
    (i) => i.direction === "INCOMING",
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRespond = async (
    friendshipId: string,
    action: "accept" | "decline",
  ) => {
    const token = getAccessToken();
    if (!token) return;
    setInvitations((prev) =>
      prev.filter((i) => i.friendshipId !== friendshipId),
    );
    try {
      await friendsApi.respond(token, friendshipId, action);
      showToast(action === "accept" ? "Ami ajouté !" : "Invitation refusée");
      await refresh();
    } catch (err) {
      console.error(err);
      showToast("Une erreur est survenue");
      await refresh();
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setInviteError("Merci de saisir une adresse e-mail valide.");
      return;
    }

    setInviteSubmitting(true);
    setInviteError(null);
    try {
      await friendsApi.invite(token, { email });
      setInviteEmail("");
      setInviteOpen(false);
      showToast("Invitation envoyée !");
      await refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setInviteError(err.message);
      } else {
        setInviteError("Une erreur est survenue.");
      }
    } finally {
      setInviteSubmitting(false);
    }
  };

  if (status !== "authenticated" || !user) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans text-[#1a1a1a] w-full max-w-[390px] mx-auto shadow-[0_0_40px_rgba(0,0,0,0.05)] border-x border-[#f0f0f0]">
      {/* Top Nav */}
      <div className="flex flex-col gap-4 px-6 pt-12 pb-6 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="w-9 h-9 bg-[#fdf0f2] rounded-xl flex items-center justify-center text-[#c0012c] transition-colors"
          >
            <ArrowLeftIcon className="w-[18px] h-[18px]" />
          </Link>
          <h1 className="font-bold text-[16px] text-[#1a1a1a]">
            Mes Amis &amp; Tribu
          </h1>
          <button
            type="button"
            onClick={() => {
              setInviteError(null);
              setInviteOpen((v) => !v);
            }}
            className="w-9 h-9 bg-[#c0012c] rounded-xl flex items-center justify-center text-white transition-colors"
          >
            <UserPlusIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#fafafa] border border-[#e5e5e5] flex gap-2.5 h-[44px] items-center px-3.5 rounded-full w-full">
          <SearchIcon className="w-[15px] h-[15px] text-[#bbb]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou e-mail…"
            className="flex-1 bg-transparent text-[13px] text-[#1a1a1a] placeholder-[#bbb] outline-none"
          />
        </div>

        {/* Invite Form (collapsible) */}
        {inviteOpen && (
          <form
            onSubmit={handleInvite}
            className="bg-[#fdf0f2] border border-[#f0c0c8] rounded-xl p-3 flex flex-col gap-2"
          >
            <p className="text-[12px] font-semibold text-[#c0012c]">
              Inviter par e-mail
            </p>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="ami@exemple.com"
              autoComplete="email"
              autoFocus
              className="w-full h-9 px-3 rounded-lg border border-[#f0c0c8] bg-white text-[13px] text-[#1a1a1a] placeholder-[#bbb] outline-none focus:border-[#c0012c]"
            />
            {inviteError && (
              <p className="text-[11px] text-[#c0012c]">{inviteError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setInviteOpen(false);
                  setInviteEmail("");
                  setInviteError(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#c0012c] text-[12px] font-semibold text-[#c0012c]"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={inviteSubmitting || !inviteEmail.trim()}
                className="px-3 py-1.5 rounded-lg bg-[#c0012c] text-[12px] font-semibold text-white disabled:opacity-50"
              >
                {inviteSubmitting ? "Envoi…" : "Envoyer"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-[18px] px-6 pb-[100px]">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <MutedText>Chargement de ta Tribu…</MutedText>
          </div>
        ) : (
          <>
            {/* Online Section */}
            {onlineFriends.length > 0 && (
              <div className="flex flex-col gap-2.5 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#22c55e] rounded-sm" />
                    <p className="font-bold text-[14px] text-[#1a1a1a]">
                      En ligne maintenant
                    </p>
                  </div>
                  <p className="font-bold text-[14px] text-[#22c55e]">
                    {onlineFriends.length}
                  </p>
                </div>

                {onlineFriends.map((f) => (
                  <div
                    key={f.friendshipId}
                    className="bg-[#fafafa] border border-[#e5e5e5] flex gap-3 items-center px-3 py-2.5 rounded-xl w-full"
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${colorForUserId(f.user.id)}`}
                      >
                        <span className="font-bold text-[16px] text-white">
                          {initialOf(f.user.firstName, f.user.pseudo)}
                        </span>
                      </div>
                      <div className="absolute w-3 h-3 bg-[#22c55e] border-2 border-white rounded-md right-0 bottom-0" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-bold text-[14px] text-[#1a1a1a] truncate">
                        {displayShortName(f.user.firstName, f.user.lastName)}
                      </p>
                      <p className="text-[12px] text-[#9ca3af] truncate">
                        {f.user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="bg-[#fdf0f2] px-3 py-1.5 rounded-2xl shrink-0"
                    >
                      <span className="font-semibold text-[12px] text-[#c0012c]">
                        Inviter
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {onlineFriends.length > 0 && incomingInvitations.length > 0 && (
              <div className="h-px bg-[#f0f0f0] w-full" />
            )}

            {/* Invitations Section */}
            {incomingInvitations.length > 0 && (
              <div className="flex flex-col gap-2.5 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <BellIcon className="w-3.5 h-3.5 text-[#1a1a1a]" />
                    <p className="font-bold text-[14px] text-[#1a1a1a]">
                      Invitations en attente
                    </p>
                  </div>
                  <div className="min-w-[20px] h-5 bg-[#c0012c] rounded-lg flex items-center justify-center px-1.5">
                    <span className="font-bold text-[10px] text-white">
                      {incomingInvitations.length}
                    </span>
                  </div>
                </div>

                {incomingInvitations.map((inv) => (
                  <div
                    key={inv.friendshipId}
                    className="bg-[#fdf0f2] border border-[#f0c0c8] p-3 rounded-xl flex gap-3"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 self-center ${colorForUserId(inv.user.id)}`}
                    >
                      <span className="font-bold text-[16px] text-white">
                        {initialOf(inv.user.firstName, inv.user.pseudo)}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <p className="font-bold text-[13px] text-[#1a1a1a] truncate">
                        {displayShortName(inv.user.firstName, inv.user.lastName)}{" "}
                        vous invite
                      </p>
                      <p className="text-[12px] text-[#9ca3af] truncate mt-0.5">
                        {inv.user.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleRespond(inv.friendshipId, "accept")
                        }
                        className="h-[27px] px-4 bg-[#c0012c] rounded-lg flex items-center justify-center"
                      >
                        <span className="font-semibold text-[12px] text-white">
                          Accepter
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleRespond(inv.friendshipId, "decline")
                        }
                        className="h-[27px] px-4 border border-[#c0012c] rounded-lg flex items-center justify-center"
                      >
                        <span className="font-semibold text-[12px] text-[#c0012c]">
                          Refuser
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {incomingInvitations.length > 0 && (
              <div className="h-px bg-[#f0f0f0] w-full" />
            )}

            {/* All Friends Section */}
            <div className="flex flex-col gap-2.5 w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-bold text-[14px] text-[#1a1a1a]">
                  Toute ma Tribu
                </p>
                <p className="text-[13px] text-[#9ca3af]">
                  {filteredFriends.length} ami
                  {filteredFriends.length > 1 ? "s" : ""}
                </p>
              </div>

              {filteredFriends.length === 0 ? (
                <div className="bg-[#fafafa] border border-dashed border-[#e5e5e5] rounded-xl py-8 px-6 text-center">
                  <p className="text-[13px] text-[#9ca3af]">
                    {searchQuery
                      ? "Aucun ami ne correspond à ta recherche."
                      : "Ta Tribu est vide. Invite un ami pour commencer !"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 w-full">
                  {filteredFriends.map((f) => (
                    <button
                      key={f.friendshipId}
                      type="button"
                      className="flex flex-col items-center gap-1 w-[52px]"
                    >
                      <div className="relative">
                        <div
                          className={`w-[52px] h-[52px] rounded-[26px] flex items-center justify-center ${colorForUserId(f.user.id)}`}
                        >
                          <span className="font-bold text-[18px] text-white">
                            {initialOf(f.user.firstName, f.user.pseudo)}
                          </span>
                        </div>
                        {f.online && (
                          <div className="absolute w-3 h-3 bg-[#22c55e] border-2 border-white rounded-md right-0 bottom-0" />
                        )}
                      </div>
                      <p className="font-medium text-[11px] text-[#1a1a1a] truncate w-full text-center">
                        {f.user.firstName}
                      </p>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setInviteError(null);
                      setInviteOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 w-[52px]"
                  >
                    <div className="w-[52px] h-[52px] bg-[#f5f5f5] border border-[#e5e5e5] rounded-[26px] flex items-center justify-center">
                      <PlusIcon className="w-[22px] h-[22px] text-[#6b7280]" />
                    </div>
                    <p className="font-medium text-[11px] text-[#9ca3af]">
                      Inviter
                    </p>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 bg-[#1a1a1a] text-white text-[13px] font-medium px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
