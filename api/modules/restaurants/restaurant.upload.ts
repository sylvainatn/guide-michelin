import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { BadRequest } from "../../lib/errors";

// Les fichiers sont écrits dans `public/uploads/videos/` à la racine du projet.
// Next.js sert `public/` à la racine du site, donc `/uploads/videos/xxx.mp4`
// est directement accessible côté front.
const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads", "videos");
const IMAGE_UPLOAD_DIR = path.resolve(
  process.cwd(),
  "public",
  "uploads",
  "images",
);
mkdirSync(UPLOAD_DIR, { recursive: true });
mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });

const MAX_SIZE_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

// Whitelist mimetype → extension. L'extension est *dérivée* du mimetype
// pour empêcher un attaquant d'injecter .html/.svg/.php via originalname.
const EXT_BY_MIME: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = EXT_BY_MIME[file.mimetype] ?? "";
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in EXT_BY_MIME)) {
      cb(new Error("unsupported_media_type"));
      return;
    }
    cb(null, true);
  },
}).single("video");

export const videoUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  upload(req, res, (err: unknown) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(BadRequest("file_too_large", "La vidéo dépasse 100 Mo."));
      }
      return next(BadRequest("upload_error", err.message));
    }
    if (err instanceof Error && err.message === "unsupported_media_type") {
      return next(
        BadRequest(
          "unsupported_media_type",
          "Format non supporté (mp4, webm, ogg, mov uniquement).",
        ),
      );
    }
    return next(err);
  });

export const uploadVideo = (req: Request, res: Response) => {
  if (!req.file) {
    throw BadRequest("missing_file", "Aucun fichier vidéo fourni.");
  }
  const url = `/uploads/videos/${req.file.filename}`;
  res.status(201).json({ url });
};

// --- Image upload (main picture du restaurant) ---

const IMAGE_EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGE_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = IMAGE_EXT_BY_MIME[file.mimetype] ?? "";
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in IMAGE_EXT_BY_MIME)) {
      cb(new Error("unsupported_media_type"));
      return;
    }
    cb(null, true);
  },
}).single("image");

export const imageUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  imageUpload(req, res, (err: unknown) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(BadRequest("file_too_large", "L'image dépasse 10 Mo."));
      }
      return next(BadRequest("upload_error", err.message));
    }
    if (err instanceof Error && err.message === "unsupported_media_type") {
      return next(
        BadRequest(
          "unsupported_media_type",
          "Format non supporté (jpg, png, webp, avif uniquement).",
        ),
      );
    }
    return next(err);
  });

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    throw BadRequest("missing_file", "Aucun fichier image fourni.");
  }
  const url = `/uploads/images/${req.file.filename}`;
  res.status(201).json({ url });
};
