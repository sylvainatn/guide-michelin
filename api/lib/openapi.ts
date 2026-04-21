// Doit être en PREMIER : étend Zod avec `.openapi()` avant que les schémas
// ne soient évalués (voir le commentaire dans `zod-openapi-setup.ts`).
import "./zod-openapi-setup";

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { env } from "../config/env";
import { loginSchema, signupSchema } from "../modules/auth/auth.schema";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "../modules/restaurants/restaurant.schema";

const registry = new OpenAPIRegistry();

// -------- Security ----------------------------------------------------------
const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// -------- Schémas partagés --------------------------------------------------
const ErrorSchema = registry.register(
  "Error",
  z
    .object({
      error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.unknown().optional(),
      }),
    })
    .openapi({ description: "Format d'erreur standard de l'API." }),
);

const PublicUserSchema = registry.register(
  "PublicUser",
  z.object({
    id: z.string(),
    email: z.email(),
    lastName: z.string(),
    firstName: z.string(),
    emailVerified: z.string().nullable(),
    createdAt: z.string(),
  }),
);

const AuthResponseSchema = registry.register(
  "AuthResponse",
  z.object({
    user: PublicUserSchema,
    accessToken: z.string(),
  }),
);

const RestaurantSchema = registry.register(
  "Restaurant",
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    address: z.string(),
    videoUrl: z.string().nullable(),
    ownerId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
);

const CreateRestaurantSchema = registry.register(
  "CreateRestaurantInput",
  createRestaurantSchema,
);

const UpdateRestaurantSchema = registry.register(
  "UpdateRestaurantInput",
  updateRestaurantSchema,
);

const SignupSchema = registry.register("SignupInput", signupSchema);
const LoginSchema = registry.register("LoginInput", loginSchema);

// -------- Helpers -----------------------------------------------------------
const jsonBody = (schema: z.ZodTypeAny) => ({
  content: { "application/json": { schema } },
});

const errorResponse = (description: string) => ({
  description,
  content: { "application/json": { schema: ErrorSchema } },
});

// -------- Auth --------------------------------------------------------------
registry.registerPath({
  method: "post",
  path: "/auth/signup",
  tags: ["Auth"],
  summary: "Crée un nouveau compte utilisateur.",
  request: { body: jsonBody(SignupSchema) },
  responses: {
    201: { description: "Compte créé.", ...jsonBody(AuthResponseSchema) },
    400: errorResponse("Payload invalide."),
    409: errorResponse("Email déjà utilisé."),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Connecte un utilisateur existant.",
  request: { body: jsonBody(LoginSchema) },
  responses: {
    200: { description: "Connexion réussie.", ...jsonBody(AuthResponseSchema) },
    401: errorResponse("Identifiants invalides."),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  summary: "Régénère un access token via le cookie de refresh.",
  responses: {
    200: { description: "Tokens rafraîchis.", ...jsonBody(AuthResponseSchema) },
    401: errorResponse("Refresh token invalide ou expiré."),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  summary: "Déconnecte l'utilisateur (révoque la session).",
  responses: { 204: { description: "Déconnecté." } },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  summary: "Retourne l'utilisateur authentifié.",
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "Utilisateur courant.",
      ...jsonBody(z.object({ user: PublicUserSchema })),
    },
    401: errorResponse("Non authentifié."),
  },
});

// -------- Restaurants -------------------------------------------------------
registry.registerPath({
  method: "get",
  path: "/restaurants",
  tags: ["Restaurants"],
  summary: "Liste les restaurants du propriétaire connecté.",
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "Liste des restaurants.",
      ...jsonBody(z.object({ restaurants: z.array(RestaurantSchema) })),
    },
    401: errorResponse("Non authentifié."),
  },
});

registry.registerPath({
  method: "post",
  path: "/restaurants",
  tags: ["Restaurants"],
  summary: "Crée un nouveau restaurant pour l'utilisateur connecté.",
  security: [{ [bearerAuth.name]: [] }],
  request: { body: jsonBody(CreateRestaurantSchema) },
  responses: {
    201: {
      description: "Restaurant créé.",
      ...jsonBody(z.object({ restaurant: RestaurantSchema })),
    },
    400: errorResponse("Payload invalide."),
    401: errorResponse("Non authentifié."),
  },
});

registry.registerPath({
  method: "get",
  path: "/restaurants/{id}",
  tags: ["Restaurants"],
  summary: "Récupère un restaurant par son identifiant.",
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: "Restaurant trouvé.",
      ...jsonBody(z.object({ restaurant: RestaurantSchema })),
    },
    401: errorResponse("Non authentifié."),
    403: errorResponse("Pas propriétaire."),
    404: errorResponse("Restaurant introuvable."),
  },
});

registry.registerPath({
  method: "patch",
  path: "/restaurants/{id}",
  tags: ["Restaurants"],
  summary: "Met à jour un restaurant (propriétaire uniquement).",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: jsonBody(UpdateRestaurantSchema),
  },
  responses: {
    200: {
      description: "Restaurant mis à jour.",
      ...jsonBody(z.object({ restaurant: RestaurantSchema })),
    },
    400: errorResponse("Payload invalide."),
    401: errorResponse("Non authentifié."),
    403: errorResponse("Pas propriétaire."),
    404: errorResponse("Restaurant introuvable."),
  },
});

registry.registerPath({
  method: "delete",
  path: "/restaurants/{id}",
  tags: ["Restaurants"],
  summary: "Supprime un restaurant (propriétaire uniquement).",
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    204: { description: "Restaurant supprimé." },
    401: errorResponse("Non authentifié."),
    403: errorResponse("Pas propriétaire."),
    404: errorResponse("Restaurant introuvable."),
  },
});

registry.registerPath({
  method: "post",
  path: "/restaurants/video",
  tags: ["Restaurants"],
  summary: "Upload un fichier vidéo (mp4, webm, ogg, mov — max 100 Mo).",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            video: z.string().openapi({ type: "string", format: "binary" }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Fichier uploadé. `url` est le chemin interne à fournir à POST /restaurants.",
      ...jsonBody(z.object({ url: z.string() })),
    },
    400: errorResponse("Fichier manquant ou format non supporté."),
    401: errorResponse("Non authentifié."),
  },
});

// -------- Health ------------------------------------------------------------
registry.registerPath({
  method: "get",
  path: "/health",
  tags: ["System"],
  summary: "Vérifie l'état de l'API et de Redis.",
  responses: {
    200: {
      description: "OK",
      ...jsonBody(z.object({ status: z.string(), redis: z.string() })),
    },
  },
});

// -------- Document ----------------------------------------------------------
export const openApiDocument = new OpenApiGeneratorV3(
  registry.definitions,
).generateDocument({
  openapi: "3.0.3",
  info: {
    title: "Guide Michelin API",
    version: "1.0.0",
    description:
      "API du Guide Michelin — authentification, gestion des restaurants et upload de médias.",
  },
  servers: [{ url: `http://localhost:${env.API_PORT}` }],
});
