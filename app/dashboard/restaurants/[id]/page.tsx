"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/atoms/Button";
import { ErrorText } from "../../../../components/atoms/ErrorText";
import { Label } from "../../../../components/atoms/Label";
import { MutedText } from "../../../../components/atoms/MutedText";
import { BackLink } from "../../../../components/molecules/BackLink";
import { FormField } from "../../../../components/molecules/FormField";
import { PageHeader } from "../../../../components/molecules/PageHeader";
import { RadioGroup } from "../../../../components/molecules/RadioGroup";
import { TextareaField } from "../../../../components/molecules/TextareaField";
import { ApiError } from "../../../../lib/auth/client";
import { useAuth } from "../../../../lib/auth/context";
import {
  type PriceRange,
  type UpdateRestaurantInput,
  restaurantApi,
} from "../../../../lib/restaurants/client";

type VideoSource = "none" | "url" | "upload";
type StarValue = "0" | "1" | "2" | "3";

const VIDEO_SOURCE_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "url", label: "Lien externe" },
  { value: "upload", label: "Uploader un fichier" },
] as const satisfies ReadonlyArray<{ value: VideoSource; label: string }>;

const DEFAULT_PRICE_RANGE: PriceRange = "EUREUR";

export default function EditRestaurantPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, status, getAccessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [chefName, setChefName] = useState("");
  const [stars, setStars] = useState<StarValue>("0");
  const [priceRange, setPriceRange] = useState<PriceRange>(DEFAULT_PRICE_RANGE);
  const [priceRangeEnabled, setPriceRangeEnabled] = useState(false);
  const [style, setStyle] = useState("");
  const [photos360, setPhotos360] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [videoSource, setVideoSource] = useState<VideoSource>("none");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
    else if (status === "authenticated" && user && user.role !== "ADMIN") {
      router.replace("/account");
    }
  }, [status, user, router]);

  useEffect(() => {
    if (status !== "authenticated" || user?.role !== "ADMIN" || !id) return;
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
        setChefName(restaurant.chefName ?? "");
        setStars(String(restaurant.stars ?? 0) as StarValue);
        if (restaurant.priceRange) {
          setPriceRange(restaurant.priceRange);
          setPriceRangeEnabled(true);
        } else {
          setPriceRangeEnabled(false);
        }
        setStyle(restaurant.style.join(", "));
        setPhotos360(restaurant.photos360 ?? []);
        setCurrentVideoUrl(restaurant.videoUrl);
        if (restaurant.videoUrl) {
          setVideoSource("url");
          setVideoUrl(restaurant.videoUrl);
        } else {
          setVideoSource("none");
        }
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError && err.status === 404
            ? "Ce restaurant n'existe pas ou plus."
            : "Impossible de charger ce restaurant.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, user, id, getAccessToken]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const token = getAccessToken();
    if (!token) {
      setError("Session expiree. Reconnecte-toi.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      let nextVideoUrl: string | null | undefined;

      if (videoSource === "none") {
        nextVideoUrl = currentVideoUrl ? null : undefined;
      } else if (videoSource === "url") {
        const trimmed = videoUrl.trim();
        nextVideoUrl = trimmed.length > 0 ? trimmed : null;
      } else {
        if (!videoFile) {
          setError("Selectionne un fichier video.");
          setPending(false);
          return;
        }
        const { url } = await restaurantApi.uploadVideo(token, videoFile);
        nextVideoUrl = url;
      }

      const parsedStars = Number.parseInt(stars, 10);
      const trimmedStyle = style
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const input: UpdateRestaurantInput = {
        name,
        description,
        address,
        chefName: chefName.trim().length > 0 ? chefName.trim() : null,
        stars: parsedStars > 0 ? parsedStars : null,
        priceRange: priceRangeEnabled ? priceRange : null,
        style: trimmedStyle,
        photos360,
      };
      if (nextVideoUrl !== undefined) input.videoUrl = nextVideoUrl;

      const { restaurant } = await restaurantApi.update(token, id, input);
      setCurrentVideoUrl(restaurant.videoUrl);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.code === "file_too_large") {
        setError("Le fichier depasse 100 Mo.");
      } else if (
        err instanceof ApiError &&
        err.code === "unsupported_media_type"
      ) {
        setError("Format video non supporte (mp4, webm, ogg, mov).");
      } else if (err instanceof ApiError && err.code === "validation_error") {
        setError("Verifie les champs du formulaire.");
      } else if (err instanceof ApiError && err.status === 403) {
        setError("Tu n'es pas proprietaire de ce restaurant.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Enregistrement impossible. Reessaie.");
      }
    } finally {
      setPending(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    const token = getAccessToken();
    if (!token) {
      setError("Session expiree. Reconnecte-toi.");
      return;
    }
    const confirmed = window.confirm(
      "Supprimer definitivement ce restaurant ? Cette action est irreversible.",
    );
    if (!confirmed) return;
    setError(null);
    setDeleting(true);
    try {
      await restaurantApi.remove(token, id);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError("Tu n'es pas proprietaire de ce restaurant.");
      } else if (err instanceof ApiError && err.status === 404) {
        setError("Ce restaurant n'existe plus.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Suppression impossible. Reessaie.");
      }
      setDeleting(false);
    }
  };

  if (status !== "authenticated" || !user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <BackLink href="/dashboard">Retour au tableau de bord</BackLink>
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        <BackLink href="/dashboard">Retour au tableau de bord</BackLink>
        <ErrorText>{loadError}</ErrorText>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BackLink href="/dashboard">Retour au tableau de bord</BackLink>
        <PageHeader
          title="Modifier le restaurant"
          subtitle="Met a jour les informations de l'etablissement."
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
                onChange={(e) => setStars(e.target.value as StarValue)}
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
                value={priceRangeEnabled ? priceRange : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") {
                    setPriceRangeEnabled(false);
                  } else {
                    setPriceRangeEnabled(true);
                    setPriceRange(v as PriceRange);
                  }
                }}
                className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="">Non definie</option>
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
            Video (optionnel)
          </legend>

          {currentVideoUrl && videoSource !== "upload" && (
            <MutedText>Video actuelle : {currentVideoUrl}</MutedText>
          )}

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
              label="URL de la video"
              type="url"
              value={videoUrl}
              onChange={setVideoUrl}
              placeholder="https://www.youtube.com/watch?v=..."
              maxLength={2000}
            />
          )}

          {videoSource === "upload" && (
            <label className="block space-y-1.5">
              <Label>Fichier video (mp4, webm, ogg, mov — max 100 Mo)</Label>
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
            Photos 360° (optionnel)
          </legend>

          {/* Liste des photos en cours */}
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

          {/* Upload fichier — méthode principale */}
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

          {/* Ajout via URL — méthode secondaire */}
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

        <div className="flex flex-col gap-3">
          <Button type="submit" disabled={pending || deleting} fullWidth>
            {pending ? "Enregistrement…" : "Enregistrer les modifications"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onDelete}
            disabled={pending || deleting}
            fullWidth
          >
            {deleting ? "Suppression…" : "Supprimer ce restaurant"}
          </Button>
        </div>
      </form>
    </div>
  );
}
