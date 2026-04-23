import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { BadRequest } from "./errors";

// Scope du sous-dossier de stockage : `public/uploads/<kind>/<scope>/...`
// Next sert `public/` à la racine, donc l'URL publique est identique au
// chemin disque sans le préfixe `public/`.
export type UploadScope = "restaurant" | "accommodation";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const VIDEO_EXT_BY_MIME: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
};

const IMAGE_EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

type Kind = "video" | "image";

const KIND_CONFIG = {
  video: {
    folder: "videos",
    field: "video",
    extByMime: VIDEO_EXT_BY_MIME,
    maxBytes: MAX_VIDEO_BYTES,
    typeLabel: "vidéo",
    supportedLabel: "mp4, webm, ogg, mov",
  },
  image: {
    folder: "images",
    field: "image",
    extByMime: IMAGE_EXT_BY_MIME,
    maxBytes: MAX_IMAGE_BYTES,
    typeLabel: "image",
    supportedLabel: "jpg, png, webp, avif",
  },
} as const;

const friendlySize = (bytes: number) => `${Math.round(bytes / (1024 * 1024))} Mo`;

const createUpload = (kind: Kind, scope: UploadScope) => {
  const { folder, field, extByMime, maxBytes, typeLabel, supportedLabel } =
    KIND_CONFIG[kind];

  const destDir = path.resolve(
    process.cwd(),
    "public",
    "uploads",
    folder,
    scope,
  );
  mkdirSync(destDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destDir),
    filename: (_req, file, cb) => {
      // L'extension est dérivée du mimetype (whitelist), pas de l'originalname
      // pour éviter l'injection de .html/.svg/.php.
      const ext = extByMime[file.mimetype] ?? "";
      cb(null, `${Date.now()}-${randomUUID()}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxBytes, files: 1 },
    fileFilter: (_req, file, cb) => {
      if (!(file.mimetype in extByMime)) {
        cb(new Error("unsupported_media_type"));
        return;
      }
      cb(null, true);
    },
  }).single(field);

  const middleware = (req: Request, res: Response, next: NextFunction) =>
    upload(req, res, (err: unknown) => {
      if (!err) return next();
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            BadRequest(
              "file_too_large",
              `La ${typeLabel} dépasse ${friendlySize(maxBytes)}.`,
            ),
          );
        }
        return next(BadRequest("upload_error", err.message));
      }
      if (err instanceof Error && err.message === "unsupported_media_type") {
        return next(
          BadRequest(
            "unsupported_media_type",
            `Format non supporté (${supportedLabel} uniquement).`,
          ),
        );
      }
      return next(err);
    });

  const handler = (req: Request, res: Response) => {
    if (!req.file) {
      throw BadRequest("missing_file", `Aucun fichier ${typeLabel} fourni.`);
    }
    const url = `/uploads/${folder}/${scope}/${req.file.filename}`;
    res.status(201).json({ url });
  };

  return { middleware, handler };
};

export const createVideoUpload = (scope: UploadScope) =>
  createUpload("video", scope);

export const createImageUpload = (scope: UploadScope) =>
  createUpload("image", scope);
