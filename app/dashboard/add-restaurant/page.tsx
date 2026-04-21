"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";
import { restaurantApi } from "../../../lib/restaurants/client";

type VideoSource = "none" | "url" | "upload";

export default function AddRestaurantPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [videoSource, setVideoSource] = useState<VideoSource>("none");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

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
      let finalVideoUrl: string | undefined;

      if (videoSource === "url") {
        finalVideoUrl = videoUrl.trim() || undefined;
      } else if (videoSource === "upload") {
        if (!videoFile) {
          setError("Sélectionne un fichier vidéo.");
          setPending(false);
          return;
        }
        const { url } = await restaurantApi.uploadVideo(token, videoFile);
        finalVideoUrl = url;
      }

      await restaurantApi.create(token, {
        name,
        description,
        address,
        videoUrl: finalVideoUrl,
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

  if (status !== "authenticated" || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-neutral-500">Chargement…</p>
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
        <h1 className="text-2xl font-semibold">Ajouter un restaurant</h1>
        <p className="text-sm text-neutral-500">
          Renseigne les informations principales de l’établissement.
        </p>
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
          <legend className="px-1 text-sm font-medium text-neutral-700">
            Vidéo (optionnel)
          </legend>

          <div className="flex flex-wrap gap-4 text-sm">
            <RadioOption
              name="videoSource"
              value="none"
              checked={videoSource === "none"}
              onChange={() => {
                setVideoSource("none");
                setVideoUrl("");
                setVideoFile(null);
              }}
              label="Aucune"
            />
            <RadioOption
              name="videoSource"
              value="url"
              checked={videoSource === "url"}
              onChange={() => {
                setVideoSource("url");
                setVideoFile(null);
              }}
              label="Lien externe"
            />
            <RadioOption
              name="videoSource"
              value="upload"
              checked={videoSource === "upload"}
              onChange={() => {
                setVideoSource("upload");
                setVideoUrl("");
              }}
              label="Uploader un fichier"
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
          {pending ? "Enregistrement…" : "Enregistrer le restaurant"}
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
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) => (
  <label className="inline-flex cursor-pointer items-center gap-2">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="accent-black"
    />
    <span>{label}</span>
  </label>
);
