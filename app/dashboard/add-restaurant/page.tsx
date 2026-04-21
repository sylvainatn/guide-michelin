"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type SubmitEventHandler } from "react";
import { Button } from "../../../components/atoms/Button";
import { ErrorText } from "../../../components/atoms/ErrorText";
import { Label } from "../../../components/atoms/Label";
import { MutedText } from "../../../components/atoms/MutedText";
import { BackLink } from "../../../components/molecules/BackLink";
import { FormField } from "../../../components/molecules/FormField";
import { PageHeader } from "../../../components/molecules/PageHeader";
import { RadioGroup } from "../../../components/molecules/RadioGroup";
import { TextareaField } from "../../../components/molecules/TextareaField";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";
import { restaurantApi } from "../../../lib/restaurants/client";

type VideoSource = "none" | "url" | "upload";

const VIDEO_SOURCE_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "url", label: "Lien externe" },
  { value: "upload", label: "Uploader un fichier" },
] as const satisfies ReadonlyArray<{ value: VideoSource; label: string }>;

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

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
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
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BackLink href="/dashboard">Retour au tableau de bord</BackLink>
        <PageHeader
          title="Ajouter un restaurant"
          subtitle="Renseigne les informations principales de l'établissement."
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Nom du restaurant"
          value={name}
          onChange={setName}
          required
          maxLength={200}
        />
        <TextareaField
          label="Description"
          value={description}
          onChange={setDescription}
          required
          maxLength={5000}
          rows={5}
        />
        <FormField
          label="Adresse"
          value={address}
          onChange={setAddress}
          required
          maxLength={500}
        />

        <fieldset className="space-y-3 rounded-md border border-neutral-200 p-4">
          <legend className="px-1 text-h2 text-neutral-700">
            Vidéo (optionnel)
          </legend>

          <RadioGroup
            name="videoSource"
            value={videoSource}
            options={VIDEO_SOURCE_OPTIONS}
            onChange={(next) => {
              setVideoSource(next);
              if (next !== "url") setVideoUrl("");
              if (next !== "upload") setVideoFile(null);
            }}
          />

          {videoSource === "url" && (
            <FormField
              label="URL de la vidéo"
              type="url"
              value={videoUrl}
              onChange={setVideoUrl}
              placeholder="https://www.youtube.com/watch?v=..."
              maxLength={2000}
            />
          )}

          {videoSource === "upload" && (
            <label className="block space-y-1.5">
              <Label>Fichier vidéo (mp4, webm, ogg, mov — max 100 Mo)</Label>
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200"
              />
              {videoFile && (
                <MutedText>
                  {videoFile.name} — {(videoFile.size / (1024 * 1024)).toFixed(1)} Mo
                </MutedText>
              )}
            </label>
          )}
        </fieldset>

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" disabled={pending} fullWidth>
          {pending ? "Enregistrement…" : "Enregistrer le restaurant"}
        </Button>
      </form>
    </div>
  );
}
