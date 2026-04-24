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

type ImageSource = "none" | "url" | "upload";

const IMAGE_SOURCE_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "url", label: "Lien externe" },
  { value: "upload", label: "Uploader un fichier" },
] as const satisfies ReadonlyArray<{ value: ImageSource; label: string }>;

export default function AddRestaurantPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [chefName, setChefName] = useState("");
  const [stars, setStars] = useState<"0" | "1" | "2" | "3">("0");
  const [priceRange, setPriceRange] = useState<"EUR" | "EUREUR" | "EUREUREUR" | "EUREUREUREUR">("EUREUR");
  const [style, setStyle] = useState("");
  const [videoSource, setVideoSource] = useState<VideoSource>("none");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageSource, setImageSource] = useState<ImageSource>("none");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [photos360, setPhotos360] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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

      let finalImageUrl: string | undefined;

      if (imageSource === "url") {
        finalImageUrl = imageUrl.trim() || undefined;
      } else if (imageSource === "upload") {
        if (!imageFile) {
          setError("Sélectionne un fichier image.");
          setPending(false);
          return;
        }
        const { url } = await restaurantApi.uploadImage(token, imageFile);
        finalImageUrl = url;
      }

      const parsedStars = Number.parseInt(stars, 10);
      const trimmedStyle = style
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      await restaurantApi.create(token, {
        name,
        description,
        address,
        videoUrl: finalVideoUrl,
        mainImageUrl: finalImageUrl,
        chefName: chefName.trim() || undefined,
        stars: parsedStars > 0 ? parsedStars : undefined,
        priceRange,
        style: trimmedStyle.length > 0 ? trimmedStyle : undefined,
        photos360: photos360.length > 0 ? photos360 : undefined,
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
            Fiche Michelin (optionnel)
          </legend>

          <FormField
            label="Nom du chef"
            value={chefName}
            onChange={setChefName}
            maxLength={200}
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <Label>Etoiles</Label>
              <select
                value={stars}
                onChange={(e) => setStars(e.target.value as typeof stars)}
                className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="0">Aucune</option>
                <option value="1">1 etoile</option>
                <option value="2">2 etoiles</option>
                <option value="3">3 etoiles</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <Label>Gamme de prix</Label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="EUR">&euro;</option>
                <option value="EUREUR">&euro;&euro;</option>
                <option value="EUREUREUR">&euro;&euro;&euro;</option>
                <option value="EUREUREUREUR">&euro;&euro;&euro;&euro;</option>
              </select>
            </label>
          </div>

          <FormField
            label="Style (separes par des virgules)"
            value={style}
            onChange={setStyle}
            placeholder="Gastronomie, Vignes"
            maxLength={500}
          />
        </fieldset>

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

        <fieldset className="space-y-3 rounded-md border border-neutral-200 p-4">
          <legend className="px-1 text-h2 text-neutral-700">
            Image principale (optionnel)
          </legend>

          <RadioGroup
            name="imageSource"
            value={imageSource}
            options={IMAGE_SOURCE_OPTIONS}
            onChange={(next) => {
              setImageSource(next);
              if (next !== "url") setImageUrl("");
              if (next !== "upload") setImageFile(null);
            }}
          />

          {imageSource === "url" && (
            <FormField
              label="URL de l'image"
              type="url"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://images.example.com/photo.jpg"
              maxLength={2000}
            />
          )}

          {imageSource === "upload" && (
            <label className="block space-y-1.5">
              <Label>Fichier image (jpg, png, webp, avif — max 10 Mo)</Label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200"
              />
              {imageFile && (
                <MutedText>
                  {imageFile.name} — {(imageFile.size / (1024 * 1024)).toFixed(1)} Mo
                </MutedText>
              )}
            </label>
          )}
        </fieldset>

        <fieldset className="space-y-3 rounded-md border border-neutral-200 p-4">
          <legend className="px-1 text-h2 text-neutral-700">
            Photos 360° (optionnel)
          </legend>

          {photos360.length > 0 && (
            <ul className="space-y-2">
              {photos360.map((url, i) => (
                <li key={url} className="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2">
                  <span className="flex-1 truncate font-mono text-xs text-neutral-600">{url}</span>
                  <button
                    type="button"
                    onClick={() => setPhotos360((prev) => prev.filter((_, j) => j !== i))}
                    className="shrink-0 text-xs text-red-500 hover:text-red-700"
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          )}

          {photos360.length === 0 && (
            <MutedText>Aucune photo 360° — le bouton «&nbsp;Vue 360°&nbsp;» n'apparaîtra pas sur la fiche.</MutedText>
          )}

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 p-4 text-sm text-neutral-500 hover:border-primary hover:text-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{uploadingPhoto ? "Upload en cours…" : "Cliquer pour uploader une photo 360°"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={uploadingPhoto}
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const token = getAccessToken();
                if (!token) return;
                setUploadingPhoto(true);
                try {
                  const { url } = await restaurantApi.uploadImage(token, file);
                  setPhotos360((prev) => [...prev, url]);
                } catch {
                  setError("Échec de l'upload de la photo.");
                } finally {
                  setUploadingPhoto(false);
                  e.target.value = "";
                }
              }}
            />
          </label>

          <div className="space-y-1">
            <p className="text-center text-xs text-neutral-400">ou ajouter via une URL externe</p>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="https://example.com/panorama.jpg"
                className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = photoUrlInput.trim();
                  if (trimmed.length > 0) {
                    setPhotos360((prev) => [...prev, trimmed]);
                    setPhotoUrlInput("");
                  }
                }}
                className="rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-50"
              >
                Ajouter
              </button>
            </div>
          </div>
        </fieldset>

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" disabled={pending} fullWidth>
          {pending ? "Enregistrement…" : "Enregistrer le restaurant"}
        </Button>
      </form>
    </div>
  );
}
