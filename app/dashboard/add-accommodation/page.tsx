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
import {
  type AccommodationCategory,
  ACCOMMODATION_CATEGORY_LABEL,
  accommodationApi,
} from "../../../lib/accommodations/client";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";

type ImageSource = "none" | "url" | "upload";
type VideoSource = "none" | "url" | "upload";

const IMAGE_SOURCE_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "url", label: "Lien externe" },
  { value: "upload", label: "Uploader un fichier" },
] as const satisfies ReadonlyArray<{ value: ImageSource; label: string }>;

const VIDEO_SOURCE_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "url", label: "Lien externe" },
  { value: "upload", label: "Uploader un fichier" },
] as const satisfies ReadonlyArray<{ value: VideoSource; label: string }>;

const CATEGORY_VALUES: AccommodationCategory[] = [
  "HOTEL",
  "BED_AND_BREAKFAST",
  "CHALET",
  "VILLA",
  "APARTMENT",
  "RESORT",
];

export default function AddAccommodationPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState<AccommodationCategory>("HOTEL");
  const [stars, setStars] = useState<"0" | "1" | "2" | "3" | "4" | "5">("0");
  const [priceFromEur, setPriceFromEur] = useState("");
  const [amenities, setAmenities] = useState("");
  const [imageSource, setImageSource] = useState<ImageSource>("none");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource>("none");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [video360, setVideo360] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
    else if (status === "authenticated" && user && user.role !== "ADMIN") {
      router.replace("/account");
    }
  }, [status, user, router]);

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
      let finalImageUrl: string | undefined;
      if (imageSource === "url") {
        finalImageUrl = imageUrl.trim() || undefined;
      } else if (imageSource === "upload") {
        if (!imageFile) {
          setError("Sélectionne un fichier image.");
          setPending(false);
          return;
        }
        const { url } = await accommodationApi.uploadImage(token, imageFile);
        finalImageUrl = url;
      }

      let finalVideoUrl: string | undefined;
      if (videoSource === "url") {
        finalVideoUrl = videoUrl.trim() || undefined;
      } else if (videoSource === "upload") {
        if (!videoFile) {
          setError("Sélectionne un fichier vidéo.");
          setPending(false);
          return;
        }
        const { url } = await accommodationApi.uploadVideo(token, videoFile);
        finalVideoUrl = url;
      }

      const parsedStars = Number.parseInt(stars, 10);
      const parsedPrice = priceFromEur.trim()
        ? Number.parseInt(priceFromEur, 10)
        : Number.NaN;
      const trimmedAmenities = amenities
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await accommodationApi.create(token, {
        name,
        description,
        address,
        category,
        stars: parsedStars > 0 ? parsedStars : undefined,
        priceFromEur: Number.isFinite(parsedPrice) ? parsedPrice : undefined,
        mainImageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        video360: finalVideoUrl ? video360 : undefined,
        amenities: trimmedAmenities.length > 0 ? trimmedAmenities : undefined,
      });
      router.push("/dashboard/accommodations");
    } catch (err) {
      if (err instanceof ApiError && err.code === "file_too_large") {
        setError("Le fichier est trop volumineux.");
      } else if (
        err instanceof ApiError &&
        err.code === "unsupported_media_type"
      ) {
        setError("Format de fichier non supporté.");
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

  if (status !== "authenticated" || !user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BackLink href="/dashboard/accommodations">
          Retour à la liste des hébergements
        </BackLink>
        <PageHeader
          title="Ajouter un hébergement"
          subtitle="Renseigne les informations principales de l'établissement."
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Nom"
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
          <legend className="px-1 text-h2 text-neutral-700">Catégorie</legend>
          <label className="block space-y-1.5">
            <Label>Type d&apos;hébergement</Label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as AccommodationCategory)
              }
              className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
            >
              {CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {ACCOMMODATION_CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <Label>Étoiles</Label>
              <select
                value={stars}
                onChange={(e) => setStars(e.target.value as typeof stars)}
                className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="0">Aucune</option>
                <option value="1">1 étoile</option>
                <option value="2">2 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="5">5 étoiles</option>
              </select>
            </label>

            <FormField
              label="Prix de départ (€/nuit)"
              type="number"
              value={priceFromEur}
              onChange={setPriceFromEur}
              placeholder="280"
            />
          </div>

          <FormField
            label="Équipements (séparés par des virgules)"
            value={amenities}
            onChange={setAmenities}
            placeholder="Spa, Piscine, Restaurant"
            maxLength={500}
          />
        </fieldset>

        <fieldset className="space-y-3 rounded-md border border-neutral-200 p-4">
          <legend className="px-1 text-h2 text-neutral-700">
            Image principale (optionnel)
          </legend>

          <RadioGroup
            name="accImageSource"
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
                  {imageFile.name} —{" "}
                  {(imageFile.size / (1024 * 1024)).toFixed(1)} Mo
                </MutedText>
              )}
            </label>
          )}
        </fieldset>

        <fieldset className="space-y-3 rounded-md border border-neutral-200 p-4">
          <legend className="px-1 text-h2 text-neutral-700">
            Vidéo (optionnel)
          </legend>

          <RadioGroup
            name="accVideoSource"
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
                  {videoFile.name} —{" "}
                  {(videoFile.size / (1024 * 1024)).toFixed(1)} Mo
                </MutedText>
              )}
            </label>
          )}

          {videoSource !== "none" && (
            <label className="flex items-start gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm">
              <input
                type="checkbox"
                checked={video360}
                onChange={(e) => setVideo360(e.target.checked)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span className="flex-1">
                <span className="block font-medium text-neutral-900">
                  Vidéo 360° équirectangulaire
                </span>
                <span className="text-[12px] text-neutral-500">
                  À cocher si la vidéo a été filmée avec une caméra 360° (ratio
                  2:1). L&apos;utilisateur pourra pivoter la caméra à la main.
                </span>
              </span>
            </label>
          )}
        </fieldset>

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" disabled={pending} fullWidth>
          {pending ? "Enregistrement…" : "Enregistrer l'hébergement"}
        </Button>
      </form>
    </div>
  );
}
