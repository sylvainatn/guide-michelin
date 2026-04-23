import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as friendController from "./friend.controller";

export const friendRouter = Router();

friendRouter.get("/", requireAuth, friendController.listFriends);
friendRouter.delete("/:id", requireAuth, friendController.removeFriend);

friendRouter.get(
  "/invitations",
  requireAuth,
  friendController.listInvitations,
);
friendRouter.post(
  "/invitations",
  requireAuth,
  friendController.inviteFriend,
);
friendRouter.patch(
  "/invitations/:id",
  requireAuth,
  friendController.respondInvitation,
);

friendRouter.post("/heartbeat", requireAuth, friendController.heartbeat);
