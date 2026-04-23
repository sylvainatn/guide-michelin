"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type SubmitEventHandler } from "react";
import { Button } from "../../../../components/atoms/Button";
import { ErrorText } from "../../../../components/atoms/ErrorText";
import { Label } from "../../../../components/atoms/Label";
import { MutedText } from "../../../../components/atoms/MutedText";
import { BackLink } from "../../../../components/molecules/BackLink";
import { ConfirmDialog } from "../../../../components/molecules/ConfirmDialog";
import { FormField } from "../../../../components/molecules/FormField";
import { PageHeader } from "../../../../components/molecules/PageHeader";
import { RadioGroup } from "../../../../components/molecules/RadioGroup";
import { TextareaField } from "../../../../components/molecules/TextareaField";
import {
  type AccommodationCategory,
  type AccommodationDTO,
  ACCOMMODATION_CATEGORY_LABEL,
  type UpdateAccommodationInput,
  accommodationApi,
} from "../../../../lib/accommodations/client";
import { ApiError } from "../../../../lib/auth/client";
import { useAuth } from "../../../../lib/auth/context";

const Video360Player = dynamic(
  () =>
    import("../../../../components/organisms/Video360Player").then(
      (m) => m.Video360Player,
    ),
  { ssr: false },
);

const CATEGORY_VALUES: AccommodationCategory[] = [
  "HOTEL",
  "BED_AND_BREAKFAST",
  "CHALET",
  "VILLA",
  "APARTMENT",
  "RESORT",
];

type MediaAction = "keep" | "replace-url" | "replace-upload" | "remove";

const MEDIA_OPTIONS = [
  { value: "keep", label: "Ne pas changer" },
  { value: "replace-url", label: "Remplacer par URL" },
  { value: "replace-upload", label: "Remplacer par upload" },
  { value: "remove", label: "Supprimer" },
] as const satisfies ReadonlyArray<{ value: MediaAction; label: string }>;

type StarValue = "0" | "1" | "2" | "3" | "4" | "5";

export default function EditAccommodationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, status, getAccessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initial, setInitial] = useState<AccommodationDTO | null>(null);

  // Champs édités
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState<AccommodationCategory>("HOTEL");
  const [stars, setStars] = useState<StarValue>("0");
  const [priceFromEur, setPriceFromEur] = useState("");
  const [amenities, setAmenities] = useState("");
  const [video360, setVideo360] = useState(false);

  const [imageAction, setImageAction] = useState<MediaAction>("keep");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [videoAction, setVideoAction] = useState<MediaAction>("keep");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
        const { accommodation: a } = await accommodationApi.getById(token, id);
        if (cancelled) return;
        setInitial(a);
        setName(a.name);
        setDescription(a.description);
        setAddress(a.address);
        setCategory(a.category);
        setStars(String(a.stars ?? 0) as StarValue);
        setPriceFromEur(
          typeof a.priceFromEur === "number" ? String(a.priceFromEur) : "",
        );
        setAmenities(a.amenities.join(", "));
        setVideo360(a.video360);
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError && err.status === 404
            ? "Hébergement introuvable."
            : "Impossible de charger la fiche.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, user, id, getAccessToken]);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!initial) return;
    const token = getAccessToken();
    if (!token) {
      setError("Session expirée. Reconnecte-toi.");
      return;
    }
    setError(null);
    setFeedback(null);
    setPending(true);
    try {
      // Résolution des medias selon l'action choisie
      const nextImage = await resolveMedia(
        imageAction,
        imageUrl,
        imageFile,
        (f) => accommodationApi.uploadImage(token, f),
      );
      const nextVideo = await resolveMedia(
        videoAction,
        videoUrl,
        videoFile,
        (f) => accommodationApi.uploadVideo(token, f),
      );

      const patch: UpdateAccommodationInput = {};
      if (name.trim() && name.trim() !== initial.name)
        patch.name = name.trim();
      if (description.trim() && description.trim() !== initial.description)
        patch.description = description.trim();
      if (address.trim() && address.trim() !== initial.address)
        patch.address = address.trim();
      if (category !== initial.category) patch.category = category;

      const parsedStars = Number.parseInt(stars, 10);
      const nextStars = parsedStars > 0 ? parsedStars : null;
      if (nextStars !== initial.stars) patch.stars = nextStars;

      const parsedPrice = priceFromEur.trim()
        ? Number.parseInt(priceFromEur, 10)
        : Number.NaN;
      const nextPrice = Number.isFinite(parsedPrice) ? parsedPrice : null;
      if (nextPrice !== initial.priceFromEur) patch.priceFromEur = nextPrice;

      const nextAmenities = amenities
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (
        nextAmenities.join("|") !== initial.amenities.join("|")
      )
        patch.amenities = nextAmenities;

      if (nextImage !== undefined) patch.mainImageUrl = nextImage;
      if (nextVideo !== undefined) patch.videoUrl = nextVideo;
      if (video360 !== initial.video360) patch.video360 = video360;

      if (Object.keys(patch).length === 0) {
        setFeedback("Aucun changement à enregistrer.");
        setPending(false);
        return;
      }

      const { accommodation: updated } = await accommodationApi.update(
        token,
        initial.id,
        patch,
      );
      setInitial(updated);
      setImageAction("keep");
      setImageFile(null);
      setImageUrl("");
      setVideoAction("keep");
      setVideoFile(null);
      setVideoUrl("");
      setFeedback("Modifications enregistrées.");
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

  const handleDelete = async () => {
    if (!initial) return;
    const token = getAccessToken();
    if (!token) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await accommodationApi.remove(token, initial.id);
      router.replace("/dashboard/accommodations");
    } catch {
      setDeleteError("Suppression impossible. Réessaie.");
      setDeleting(false);
    }
  };

  if (status !== "authenticated" || !user || user.role !== "ADMIN" || loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  if (loadError || !initial) {
    return (
      <div className="space-y-4">
        <BackLink href="/dashboard/accommodations">Retour</BackLink>
        <ErrorText>{loadError ?? "Hébergement introuvable."}</ErrorText>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BackLink href="/dashboard/accommodations">Retour à la liste</BackLink>
        <PageHeader
          title={initial.name}
          subtitle={`${ACCOMMODATION_CATEGORY_LABEL[initial.category]} — édition`}
        />
      </div>

      {/* Preview des médias actuels */}
      {initial.mainImageUrl && imageAction === "keep" && (
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={initial.mainImageUrl}
            alt={initial.name}
            className="h-64 w-full object-cover"
          />
        </div>
      )}

      {initial.videoUrl &&
        videoAction === "keep" &&
        (initial.video360 ? (
          <Video360Player
            src={initial.videoUrl}
            className="h-80 w-full rounded-2xl border border-neutral-200"
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-black">
            <video
              src={initial.videoUrl}
              controls
              className="h-64 w-full object-cover"
            />
          </div>
        ))}

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
                onChange={(e) => setStars(e.target.value as StarValue)}
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
            Image principale
          </legend>
          <RadioGroup
            name="imageAction"
            value={imageAction}
            options={MEDIA_OPTIONS}
            onChange={(next) => {
              setImageAction(next);
              if (next !== "replace-url") setImageUrl("");
              if (next !== "replace-upload") setImageFile(null);
            }}
          />
          {imageAction === "replace-url" && (
            <FormField
              label="URL de l'image"
              type="url"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://images.example.com/photo.jpg"
              maxLength={2000}
            />
          )}
          {imageAction === "replace-upload" && (
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
          <legend className="px-1 text-h2 text-neutral-700">Vidéo</legend>
          <RadioGroup
            name="videoAction"
            value={videoAction}
            options={MEDIA_OPTIONS}
            onChange={(next) => {
              setVideoAction(next);
              if (next !== "replace-url") setVideoUrl("");
              if (next !== "replace-upload") setVideoFile(null);
            }}
          />
          {videoAction === "replace-url" && (
            <FormField
              label="URL de la vidéo"
              type="url"
              value={videoUrl}
              onChange={setVideoUrl}
              placeholder="https://videos.example.com/clip.mp4"
              maxLength={2000}
            />
          )}
          {videoAction === "replace-upload" && (
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
                L&apos;utilisateur pourra pivoter la caméra à la main.
              </span>
            </span>
          </label>
        </fieldset>

        {feedback && (
          <p
            className={`rounded-md px-3 py-2 text-sm ${
              feedback.includes("enregistrées")
                ? "bg-[#eef7f1] text-[#2f8a5c]"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {feedback}
          </p>
        )}

        {error && <ErrorText>{error}</ErrorText>}
        {deleteError && <ErrorText>{deleteError}</ErrorText>}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending} className="flex-1">
            {pending ? "Enregistrement…" : "Enregistrer les modifications"}
          </Button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-primary bg-white px-5 text-[13px] font-semibold text-primary hover:bg-[#fbe4e9] disabled:opacity-60"
          >
            {deleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer cet hébergement ?"
        description={`${initial.name} sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        tone="danger"
        pending={deleting}
        onConfirm={() => {
          setConfirmOpen(false);
          void handleDelete();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

// Résolution de l'action média → valeur à envoyer au PATCH :
// - undefined : pas de changement (ne pas inclure dans le patch)
// - null : effacer le média côté back
// - string : nouvelle URL
const resolveMedia = async (
  action: MediaAction,
  url: string,
  file: File | null,
  upload: (f: File) => Promise<{ url: string }>,
): Promise<string | null | undefined> => {
  if (action === "keep") return undefined;
  if (action === "remove") return null;
  if (action === "replace-url") {
    const trimmed = url.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (action === "replace-upload") {
    if (!file) return undefined;
    const { url: uploaded } = await upload(file);
    return uploaded;
  }
  return undefined;
};
