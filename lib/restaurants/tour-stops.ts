/**
 * Configuration des points de vue d'une visite 3D.
 * Stockee en JSON sur Restaurant.tourStops ; un fallback procedural
 * est utilise si le champ est null.
 */

export type Ambience = "dawn" | "midi" | "soir";

export type Vec3 = [number, number, number];

export type TourStop = {
  id: string;
  label: string;
  camera: {
    pos: Vec3;
    look: Vec3;
  };
  /** Duree en ms avant de passer au stop suivant (mode visite guidee). */
  duration: number;
};

export type TourConfig = {
  ambient: Ambience;
  stops: TourStop[];
};

/**
 * Configuration par defaut : 4 stops qui marchent pour n'importe quelle salle
 * generee proceduralement (entree / salle principale / cuisine / cave).
 */
export const DEFAULT_TOUR_CONFIG: TourConfig = {
  ambient: "midi",
  stops: [
    {
      id: "entree",
      label: "Entree",
      camera: { pos: [0, 1.7, 7], look: [0, 1.5, 0] },
      duration: 4500,
    },
    {
      id: "salle",
      label: "Salle a manger",
      camera: { pos: [-3.5, 1.7, 2], look: [0, 1.4, 0] },
      duration: 5000,
    },
    {
      id: "cuisine",
      label: "Cuisine ouverte",
      camera: { pos: [3.5, 1.9, -2], look: [3.5, 1.4, -5] },
      duration: 5000,
    },
    {
      id: "cave",
      label: "Cave a vin",
      camera: { pos: [0, 1.6, -5.5], look: [0, 1.4, -8] },
      duration: 4500,
    },
  ],
};

export const isTourConfig = (value: unknown): value is TourConfig => {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<TourConfig>;
  if (!v.ambient || !Array.isArray(v.stops)) return false;
  return v.stops.every(
    (s) =>
      s &&
      typeof s.id === "string" &&
      typeof s.label === "string" &&
      s.camera &&
      Array.isArray(s.camera.pos) &&
      s.camera.pos.length === 3 &&
      Array.isArray(s.camera.look) &&
      s.camera.look.length === 3 &&
      typeof s.duration === "number",
  );
};
