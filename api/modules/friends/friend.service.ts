import { prisma } from "../../../lib/prisma";
import { BadRequest, Conflict, NotFound } from "../../lib/errors";
import type {
  InviteFriendInput,
  RespondInvitationInput,
  SearchFriendsInput,
} from "./friend.schema";

/** Délai (ms) au-dessus duquel un utilisateur est considéré hors-ligne. */
export const ONLINE_WINDOW_MS = 5 * 60 * 1000;

const publicFriendSelect = {
  id: true,
  email: true,
  pseudo: true,
  firstName: true,
  lastName: true,
  lastSeenAt: true,
} as const;

export type PublicFriendUser = {
  id: string;
  email: string;
  pseudo: string;
  firstName: string;
  lastName: string;
  lastSeenAt: Date | null;
};

export type FriendListItem = {
  friendshipId: string;
  user: PublicFriendUser;
  status: "ACCEPTED";
  online: boolean;
  sinceAt: Date;
};

export type PendingInvitation = {
  friendshipId: string;
  user: PublicFriendUser;
  status: "PENDING";
  createdAt: Date;
  direction: "INCOMING" | "OUTGOING";
};

const isOnline = (lastSeenAt: Date | null) =>
  !!lastSeenAt && Date.now() - lastSeenAt.getTime() < ONLINE_WINDOW_MS;

/** Liste les amis acceptés (dans les deux sens), avec filtre texte optionnel. */
export const listFriends = async (
  userId: string,
  input: SearchFriendsInput,
): Promise<FriendListItem[]> => {
  const q = input.q?.trim();
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: { select: publicFriendSelect },
      addressee: { select: publicFriendSelect },
    },
    orderBy: { updatedAt: "desc" },
  });

  const items = friendships.map<FriendListItem>((f) => {
    const user = f.requesterId === userId ? f.addressee : f.requester;
    return {
      friendshipId: f.id,
      user,
      status: "ACCEPTED",
      online: isOnline(user.lastSeenAt),
      sinceAt: f.updatedAt,
    };
  });

  if (!q) return items;
  const needle = q.toLowerCase();
  return items.filter((it) => {
    const fullName = `${it.user.firstName} ${it.user.lastName}`.toLowerCase();
    return (
      it.user.email.toLowerCase().includes(needle) ||
      it.user.pseudo.toLowerCase().includes(needle) ||
      fullName.includes(needle)
    );
  });
};

/** Liste les invitations en attente reçues et envoyées. */
export const listInvitations = async (
  userId: string,
): Promise<PendingInvitation[]> => {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "PENDING",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: { select: publicFriendSelect },
      addressee: { select: publicFriendSelect },
    },
    orderBy: { createdAt: "desc" },
  });

  return friendships.map<PendingInvitation>((f) => {
    const direction = f.addresseeId === userId ? "INCOMING" : "OUTGOING";
    const user = direction === "INCOMING" ? f.requester : f.addressee;
    return {
      friendshipId: f.id,
      user,
      status: "PENDING",
      createdAt: f.createdAt,
      direction,
    };
  });
};

export const inviteFriend = async (
  userId: string,
  input: InviteFriendInput,
) => {
  const target = await prisma.user.findFirst({
    where: input.pseudo
      ? { pseudo: input.pseudo }
      : { email: input.email!.toLowerCase() },
    select: publicFriendSelect,
  });
  if (!target) {
    throw NotFound("user_not_found", "Aucun utilisateur trouvé.");
  }
  if (target.id === userId) {
    throw BadRequest("self_invite", "Vous ne pouvez pas vous inviter vous-même.");
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId: target.id },
        { requesterId: target.id, addresseeId: userId },
      ],
    },
  });

  if (existing) {
    if (existing.status === "ACCEPTED") {
      throw Conflict("already_friends", "Vous êtes déjà amis.");
    }
    if (existing.status === "PENDING") {
      throw Conflict("invitation_pending", "Une invitation est déjà en attente.");
    }
    // DECLINED → on recrée l'invitation en mettant à jour
    return prisma.friendship.update({
      where: { id: existing.id },
      data: {
        requesterId: userId,
        addresseeId: target.id,
        status: "PENDING",
      },
    });
  }

  return prisma.friendship.create({
    data: {
      requesterId: userId,
      addresseeId: target.id,
      status: "PENDING",
    },
  });
};

export const respondToInvitation = async (
  userId: string,
  friendshipId: string,
  input: RespondInvitationInput,
) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });
  if (!friendship || friendship.addresseeId !== userId) {
    throw NotFound("invitation_not_found", "Invitation introuvable.");
  }
  if (friendship.status !== "PENDING") {
    throw Conflict(
      "invitation_already_handled",
      "Cette invitation a déjà été traitée.",
    );
  }

  return prisma.friendship.update({
    where: { id: friendshipId },
    data: {
      status: input.action === "accept" ? "ACCEPTED" : "DECLINED",
    },
  });
};

export const removeFriendship = async (
  userId: string,
  friendshipId: string,
) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
    select: { id: true, requesterId: true, addresseeId: true },
  });
  if (
    !friendship ||
    (friendship.requesterId !== userId && friendship.addresseeId !== userId)
  ) {
    throw NotFound("friendship_not_found", "Relation introuvable.");
  }
  await prisma.friendship.delete({ where: { id: friendshipId } });
};

export const touchLastSeen = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { lastSeenAt: new Date() },
  });
};
