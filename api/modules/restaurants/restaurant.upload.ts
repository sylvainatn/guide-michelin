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
mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_SIZE_BYTES = 100 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
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
