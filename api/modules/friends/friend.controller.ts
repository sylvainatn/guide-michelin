import type { Request, Response } from "express";
import {
  friendshipIdParamSchema,
  inviteFriendSchema,
  respondInvitationSchema,
  searchFriendsSchema,
} from "./friend.schema";
import * as friendService from "./friend.service";

export const listFriends = async (req: Request, res: Response) => {
  const input = searchFriendsSchema.parse(req.query);
  const friends = await friendService.listFriends(req.user!.id, input);
  res.json({ friends });
};

export const listInvitations = async (req: Request, res: Response) => {
  const invitations = await friendService.listInvitations(req.user!.id);
  res.json({ invitations });
};

export const inviteFriend = async (req: Request, res: Response) => {
  const input = inviteFriendSchema.parse(req.body);
  const friendship = await friendService.inviteFriend(req.user!.id, input);
  res.status(201).json({ friendship });
};

export const respondInvitation = async (req: Request, res: Response) => {
  const { id } = friendshipIdParamSchema.parse(req.params);
  const input = respondInvitationSchema.parse(req.body);
  const friendship = await friendService.respondToInvitation(
    req.user!.id,
    id,
    input,
  );
  res.json({ friendship });
};

export const removeFriend = async (req: Request, res: Response) => {
  const { id } = friendshipIdParamSchema.parse(req.params);
  await friendService.removeFriendship(req.user!.id, id);
  res.status(204).end();
};

export const heartbeat = async (req: Request, res: Response) => {
  await friendService.touchLastSeen(req.user!.id);
  res.status(204).end();
};
