"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ApiError } from "../../../../../lib/auth/client";
import { useAuth } from "../../../../../lib/auth/context";
import { restaurantApi } from "../../../../../lib/restaurants/client";

type VideoSource = "keep" | "none" | "url" | "upload";

export default function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource>("keep");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const token = getAccessToken();
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const { restaurant } = await restaurantApi.getById(token, id);
        if (cancelled) return;
        setName(restaurant.name);
        setDescription(restaurant.description);
        setAddress(restaurant.address);
        setCurrentVideoUrl(restaurant.videoUrl);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setLoadError("Restaurant introuvable.");
        } else if (err instanceof ApiError && err.status === 403) {
          setLoadError("Tu n'es pas propriétaire de ce restaurant.");
        } else {
          setLoadError("Impossible de charger ce restaurant.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, status, getAccessToken]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      setError("Session expirée. Reconnecte-toi.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      let videoUrlToSend: string | null | undefined;

      if (videoSource === "none") {
        videoUrlToSend = null;
      } else if (videoSource === "url") {
        videoUrlToSend = videoUrl.trim() || undefined;
      } else if (videoSource === "upload") {
        if (!videoFile) {
          setError("Sélectionne un fichier vidéo.");
          setPending(false);
          return;
        }
        const { url } = await restaurantApi.uploadVideo(token, videoFile);
        videoUrlToSend = url;
      }

      await restaurantApi.update(token, id, {
        name,
        description,
        address,
        ...(videoSource === "keep" ? {} : { videoUrl: videoUrlToSend }),
      });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.code === "file_too_large") {
        setError("Le fichier dépasse 100 Mo.");
      } else if (err instanceof ApiError && err.code === "unsupported_media_type") {
        setError("Format vidéo non supporté (mp4, webm, ogg, mov).");
      } else if (err instanceof ApiError && err.code === "validation_error") {
        setError("Vérifie les champs du formulaire.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Enregistrement impossible. Réessaie.");
      }
    } finally {
      setPending(false);
    }
  };

  if (status !== "authenticated" || !user || loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-neutral-500">Chargement…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{loadError}</p>
        <Link href="/dashboard" className="text-sm underline">
          ← Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p>
          <Link href="/dashboard" className="text-sm text-neutral-500 underline">
            ← Retour au tableau de bord
          </Link>
        </p>
        <h1 className="text-2xl font-semibold">Modifier le restaurant</h1>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Nom du restaurant"
          value={name}
          onChange={setName}
          required
          maxLength={200}
        />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={5000}
            rows={5}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </label>
        <Field
          label="Adresse"
          value={address}
          onChange={setAddress}
          required
          maxLength={500}
        />

        <fieldset className="space-y-3 rounded-md border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-medium text-neutral-700">Vidéo</legend>

          {currentVideoUrl && videoSource === "keep" && (
            <p className="text-xs text-neutral-500">
              Vidéo actuelle :{" "}
              <a
                href={currentVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {currentVideoUrl}
              </a>
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <RadioOption
              name="videoSource"
              checked={videoSource === "keep"}
              onChange={() => {
                setVideoSource("keep");
                setVideoUrl("");
                setVideoFile(null);
              }}
              label={currentVideoUrl ? "Garder l'actuelle" : "Aucune (inchangé)"}
            />
            <RadioOption
              name="videoSource"
              checked={videoSource === "none"}
              onChange={() => {
                setVideoSource("none");
                setVideoUrl("");
                setVideoFile(null);
              }}
              label="Supprimer la vidéo"
            />
            <RadioOption
              name="videoSource"
              checked={videoSource === "url"}
              onChange={() => {
                setVideoSource("url");
                setVideoFile(null);
              }}
              label="Nouveau lien"
            />
            <RadioOption
              name="videoSource"
              checked={videoSource === "upload"}
              onChange={() => {
                setVideoSource("upload");
                setVideoUrl("");
              }}
              label="Nouveau fichier"
            />
          </div>

          {videoSource === "url" && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-neutral-700">
                URL de la vidéo
              </span>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                maxLength={2000}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </label>
          )}

          {videoSource === "upload" && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-neutral-700">
                Fichier vidéo (mp4, webm, ogg, mov — max 100 Mo)
              </span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200"
              />
              {videoFile && (
                <span className="text-xs text-neutral-500">
                  {videoFile.name} — {(videoFile.size / (1024 * 1024)).toFixed(1)} Mo
                </span>
              )}
            </label>
          )}
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}

const Field = ({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-neutral-700">{label}</span>
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
    />
  </label>
);

const RadioOption = ({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) => (
  <label className="inline-flex cursor-pointer items-center gap-2">
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="accent-black"
    />
    <span>{label}</span>
  </label>
);
