import { z } from "zod";

export const friendshipStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "DECLINED",
]);

export const inviteFriendSchema = z
  .object({
    pseudo: z.string().min(1).optional(),
    email: z.email().optional(),
  })
  .refine((v) => v.pseudo || v.email, {
    message: "Pseudo ou email requis.",
  });

export type InviteFriendInput = z.infer<typeof inviteFriendSchema>;

export const respondInvitationSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

export type RespondInvitationInput = z.infer<typeof respondInvitationSchema>;

export const friendshipIdParamSchema = z.object({
  id: z.cuid(),
});

export const searchFriendsSchema = z.object({
  q: z.string().trim().optional(),
});

export type SearchFriendsInput = z.infer<typeof searchFriendsSchema>;
