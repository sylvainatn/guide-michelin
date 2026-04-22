import "dotenv/config";
import { hashPassword } from "../api/modules/auth/password.service";
import { prisma } from "../lib/prisma";
import { DEFAULT_TOUR_CONFIG, type TourConfig } from "../lib/restaurants/tour-stops";

const seedUsers = [
  {
    email: "admin@michelin.local",
    pseudo: "admin",
    password: "Admin1234!",
    firstName: "Ada",
    lastName: "Admin",
    role: "ADMIN" as const,
  },
  {
    email: "user@michelin.local",
    pseudo: "ulysse",
    password: "User1234!",
    firstName: "Ulysse",
    lastName: "User",
    role: "USER" as const,
  },
];

type SeedReview = {
  productsScore: number;
  harmonyScore: number;
  masteryScore: number;
  personalityScore: number;
  regularityScore: number;
  inspectorName: string;
  verdict: string;
  priceFromEur: number;
  tripDuration: string;
  partnerBadge: string;
  locationLabel: string;
};

type SeedRestaurant = {
  slug: string;
  name: string;
  description: string;
  address: string;
  chefName: string;
  stars: number;
  priceRange: "EUR" | "EUREUR" | "EUREUREUR" | "EUREUREUREUR";
  style: string[];
  tourStops: TourConfig;
  review: SeedReview;
};

const seedRestaurants: SeedRestaurant[] = [
  {
    slug: "bordeaux-secret",
    name: "Bordeaux Secret",
    description:
      "Une table confidentielle au coeur du Bordelais, ou le terroir dialogue avec l'elegance moderne. Vue panoramique sur les vignes.",
    address: "Saint-Emilion, Bordelais",
    chefName: "Louis Vasseur",
    stars: 1,
    priceRange: "EUREUREUR",
    style: ["Pour vous", "Vignes & Gastronomie"],
    tourStops: DEFAULT_TOUR_CONFIG,
    review: {
      productsScore: 9.4,
      harmonyScore: 9.1,
      masteryScore: 9.6,
      personalityScore: 9.8,
      regularityScore: 9.3,
      inspectorName: "Inspecteur Michelin",
      verdict:
        "Une signature rare, ancree dans le terroir bordelais. Louis Vasseur orchestre des menus d'une justesse remarquable.",
      priceFromEur: 485,
      tripDuration: "2 jours · 1 nuit",
      partnerBadge: "Tablet Hotels",
      locationLabel: "Saint-Emilion · Bordelais · France",
    },
  },
  {
    slug: "maison-lumiere",
    name: "Maison Lumiere",
    description:
      "Un ecrin contemporain a Paris, cuisine instinctive et produits de saison. Ambiance feutree, chandeliers et tableaux anciens.",
    address: "8eme arrondissement, Paris",
    chefName: "Elise Moreau",
    stars: 2,
    priceRange: "EUREUREUREUR",
    style: ["Gastronomie", "Moderne"],
    tourStops: {
      ambient: "soir",
      stops: [
        { id: "entree", label: "Entree", camera: { pos: [0, 1.7, 7], look: [0, 1.5, 0] }, duration: 4500 },
        { id: "salon", label: "Salon prive", camera: { pos: [-4, 1.7, 1], look: [0, 1.4, 0] }, duration: 5000 },
        { id: "passe", label: "Le passe", camera: { pos: [3, 1.9, -2], look: [3, 1.4, -5] }, duration: 4500 },
        { id: "cave", label: "Cave a vin", camera: { pos: [0, 1.6, -5.5], look: [0, 1.4, -8] }, duration: 4500 },
      ],
    },
    review: {
      productsScore: 9.7,
      harmonyScore: 9.5,
      masteryScore: 9.8,
      personalityScore: 9.4,
      regularityScore: 9.6,
      inspectorName: "Inspecteur Michelin",
      verdict:
        "Elise Moreau elargit le repertoire parisien avec une precision d'orfevre. Deux etoiles meritees pour une cuisine audacieuse.",
      priceFromEur: 720,
      tripDuration: "1 soir · 1 nuit",
      partnerBadge: "Tablet Hotels",
      locationLabel: "Paris 8e · Ile-de-France · France",
    },
  },
  {
    slug: "les-terres-salees",
    name: "Les Terres Salees",
    description:
      "Bistrot marin sur la cote basque. Poissons du jour, iode et feu de bois. Une adresse franche, vibrante, gourmande.",
    address: "Biarritz, Pyrenees-Atlantiques",
    chefName: "Tomas Etcheverry",
    stars: 0,
    priceRange: "EUREUR",
    style: ["Bib Gourmand", "Bord de mer"],
    tourStops: {
      ambient: "dawn",
      stops: [
        { id: "terrasse", label: "Terrasse", camera: { pos: [0, 1.7, 8], look: [0, 1.4, 0] }, duration: 5000 },
        { id: "bar", label: "Bar en bois", camera: { pos: [-3, 1.7, 2], look: [0, 1.4, 0] }, duration: 4500 },
        { id: "salle", label: "Salle principale", camera: { pos: [3, 1.7, 0], look: [0, 1.4, -2] }, duration: 5000 },
      ],
    },
    review: {
      productsScore: 8.9,
      harmonyScore: 9.0,
      masteryScore: 8.8,
      personalityScore: 9.2,
      regularityScore: 8.7,
      inspectorName: "Inspecteur Michelin",
      verdict:
        "Tomas Etcheverry signe un bistrot marin sincere, ou la peche du jour guide la carte. L'accueil basque fait le reste.",
      priceFromEur: 185,
      tripDuration: "2 jours · 1 nuit",
      partnerBadge: "Bib Gourmand",
      locationLabel: "Biarritz · Pays Basque · France",
    },
  },
];

async function main() {
  let adminId: string | null = null;

  for (const u of seedUsers) {
    const passwordHash = await hashPassword(u.password);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        pseudo: u.pseudo,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        passwordHash,
      },
      create: {
        email: u.email,
        pseudo: u.pseudo,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        passwordHash,
        emailVerified: new Date(),
      },
    });
    if (user.role === "ADMIN") adminId = user.id;
    console.log(`ok ${user.role.padEnd(5)}  ${user.email}  (password: ${u.password})`);
  }

  if (!adminId) throw new Error("Admin user missing, cannot seed restaurants.");

  for (const r of seedRestaurants) {
    // Pas d'unique sur name/slug : on cherche par (name, ownerId) pour idempotence.
    const existing = await prisma.restaurant.findFirst({
      where: { name: r.name, ownerId: adminId },
      select: { id: true },
    });
    const data = {
      name: r.name,
      description: r.description,
      address: r.address,
      chefName: r.chefName,
      stars: r.stars,
      priceRange: r.priceRange,
      style: r.style,
      tourStops: r.tourStops as unknown as object,
      ownerId: adminId,
    };
    let restaurantId: string;
    if (existing) {
      await prisma.restaurant.update({ where: { id: existing.id }, data });
      restaurantId = existing.id;
      console.log(`ok RESTO  ${r.name}  (updated)`);
    } else {
      const created = await prisma.restaurant.create({ data });
      restaurantId = created.id;
      console.log(`ok RESTO  ${r.name}  (created, id=${created.id})`);
    }

    await prisma.michelinReview.upsert({
      where: { restaurantId },
      update: r.review,
      create: { restaurantId, ...r.review },
    });
    console.log(`ok REVIEW ${r.name}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
