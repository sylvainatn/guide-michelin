import "dotenv/config";
import { hashPassword } from "../api/modules/auth/password.service";
import { prisma } from "../lib/prisma";
import { DEFAULT_TOUR_CONFIG, type TourConfig } from "../lib/restaurants/tour-stops";

// ID épinglé pour matcher les FK `ownerId` présentes dans `mydb.sql`
// (dump Adminer exporté depuis l'environnement de dev).
const ADMIN_ID = "b10ed346-5125-46da-b20f-b83551ae30b0";

const seedUsers: Array<{
  id?: string;
  email: string;
  pseudo: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "USER";
}> = [
  {
    id: ADMIN_ID,
    email: "admin@michelin.local",
    pseudo: "admin",
    password: "Admin1234!",
    firstName: "Ada",
    lastName: "Admin",
    role: "ADMIN",
  },
  {
    email: "user@michelin.local",
    pseudo: "ulysse",
    password: "User1234!",
    firstName: "Ulysse",
    lastName: "User",
    role: "USER",
  },
];

/**
 * Amis fictifs connectés à l'utilisateur `ulysse` (seedUsers[1]).
 * `onlineMinutesAgo` : simule le `lastSeenAt` (null = hors-ligne).
 * `relation` : ACCEPTED = ami, PENDING_INCOMING = invitation reçue,
 * PENDING_OUTGOING = invitation envoyée.
 */
type SeedFriend = {
  email: string;
  pseudo: string;
  password: string;
  firstName: string;
  lastName: string;
  onlineMinutesAgo: number | null;
  relation: "ACCEPTED" | "PENDING_INCOMING" | "PENDING_OUTGOING";
};

const seedFriends: SeedFriend[] = [
  {
    email: "adrien@michelin.local",
    pseudo: "adrien_m",
    password: "Friend1234!",
    firstName: "Adrien",
    lastName: "Martin",
    onlineMinutesAgo: 1,
    relation: "ACCEPTED",
  },
  {
    email: "sophie@michelin.local",
    pseudo: "sophie_l",
    password: "Friend1234!",
    firstName: "Sophie",
    lastName: "Laurent",
    onlineMinutesAgo: 2,
    relation: "ACCEPTED",
  },
  {
    email: "lucas@michelin.local",
    pseudo: "lucas_d",
    password: "Friend1234!",
    firstName: "Lucas",
    lastName: "Dupont",
    onlineMinutesAgo: null,
    relation: "PENDING_INCOMING",
  },
  {
    email: "camille@michelin.local",
    pseudo: "camille_r",
    password: "Friend1234!",
    firstName: "Camille",
    lastName: "Rousseau",
    onlineMinutesAgo: null,
    relation: "ACCEPTED",
  },
  {
    email: "thomas@michelin.local",
    pseudo: "thomas_b",
    password: "Friend1234!",
    firstName: "Thomas",
    lastName: "Bernard",
    onlineMinutesAgo: 120,
    relation: "ACCEPTED",
  },
  {
    email: "julie@michelin.local",
    pseudo: "julie_p",
    password: "Friend1234!",
    firstName: "Julie",
    lastName: "Petit",
    onlineMinutesAgo: null,
    relation: "ACCEPTED",
  },
  {
    email: "maxime@michelin.local",
    pseudo: "maxime_g",
    password: "Friend1234!",
    firstName: "Maxime",
    lastName: "Garcia",
    onlineMinutesAgo: 3,
    relation: "ACCEPTED",
  },
  {
    email: "lea@michelin.local",
    pseudo: "lea_f",
    password: "Friend1234!",
    firstName: "Léa",
    lastName: "Fontaine",
    onlineMinutesAgo: null,
    relation: "ACCEPTED",
  },
  {
    email: "nina@michelin.local",
    pseudo: "nina_c",
    password: "Friend1234!",
    firstName: "Nina",
    lastName: "Chen",
    onlineMinutesAgo: null,
    relation: "PENDING_INCOMING",
  },
  {
    email: "paul@michelin.local",
    pseudo: "paul_v",
    password: "Friend1234!",
    firstName: "Paul",
    lastName: "Vasseur",
    onlineMinutesAgo: null,
    relation: "PENDING_OUTGOING",
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

type SeedAccommodation = {
  slug: string;
  name: string;
  description: string;
  address: string;
  category:
    | "HOTEL"
    | "BED_AND_BREAKFAST"
    | "CHALET"
    | "VILLA"
    | "APARTMENT"
    | "RESORT";
  stars?: number;
  priceFromEur?: number;
  amenities?: string[];
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

const seedAccommodations: SeedAccommodation[] = [
  {
    slug: "villa-cap-ferret",
    name: "Villa Cap Ferret",
    description:
      "Villa les pieds dans le sable, toit-terrasse panoramique sur le bassin d'Arcachon. Piscine chauffee, chef prive sur demande.",
    address: "Cap Ferret, Gironde",
    category: "VILLA",
    stars: 5,
    priceFromEur: 860,
    amenities: ["Piscine", "Spa", "Plage privee", "Chef prive"],
  },
  {
    slug: "chalet-megeve-alpina",
    name: "Chalet Megeve Alpina",
    description:
      "Chalet familial pied des pistes, cheminee, cave a vin et spa nordique. Vue imprenable sur le Mont-Blanc.",
    address: "Megeve, Haute-Savoie",
    category: "CHALET",
    stars: 4,
    priceFromEur: 520,
    amenities: ["Spa nordique", "Cheminee", "Ski in/out"],
  },
  {
    slug: "hotel-maison-lumiere",
    name: "Maison Lumiere Hotel",
    description:
      "18 suites feutrees a deux pas des Champs-Elysees, bar a champagnes et voiturier 24/7.",
    address: "8eme arrondissement, Paris",
    category: "HOTEL",
    stars: 5,
    priceFromEur: 490,
    amenities: ["Spa", "Bar", "Voiturier", "Concierge"],
  },
];

async function main() {
  let adminId: string | null = null;
  let ulysseId: string | null = null;

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
        ...(u.id ? { id: u.id } : {}),
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
    if (user.pseudo === "ulysse") ulysseId = user.id;
    console.log(`ok ${user.role.padEnd(5)}  ${user.email}  (password: ${u.password})`);
  }

  if (!adminId) throw new Error("Admin user missing, cannot seed restaurants.");
  if (!ulysseId) throw new Error("Ulysse user missing, cannot seed friendships.");

  // ---------- AMIS FICTIFS + FRIENDSHIPS ----------
  for (const f of seedFriends) {
    const passwordHash = await hashPassword(f.password);
    const lastSeenAt =
      f.onlineMinutesAgo === null
        ? null
        : new Date(Date.now() - f.onlineMinutesAgo * 60 * 1000);

    const friend = await prisma.user.upsert({
      where: { email: f.email },
      update: {
        pseudo: f.pseudo,
        firstName: f.firstName,
        lastName: f.lastName,
        passwordHash,
        lastSeenAt,
      },
      create: {
        email: f.email,
        pseudo: f.pseudo,
        firstName: f.firstName,
        lastName: f.lastName,
        role: "USER",
        passwordHash,
        emailVerified: new Date(),
        lastSeenAt,
      },
    });

    const { requesterId, addresseeId, status } =
      f.relation === "PENDING_INCOMING"
        ? { requesterId: friend.id, addresseeId: ulysseId, status: "PENDING" as const }
        : f.relation === "PENDING_OUTGOING"
          ? { requesterId: ulysseId, addresseeId: friend.id, status: "PENDING" as const }
          : { requesterId: ulysseId, addresseeId: friend.id, status: "ACCEPTED" as const };

    // On nettoie les deux directions possibles pour être idempotent sur le re-seed
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: ulysseId, addresseeId: friend.id },
          { requesterId: friend.id, addresseeId: ulysseId },
        ],
      },
    });

    await prisma.friendship.create({
      data: { requesterId, addresseeId, status },
    });

    const onlineTag =
      f.onlineMinutesAgo !== null && f.onlineMinutesAgo < 5 ? "🟢" : "⚪";
    console.log(
      `ok FRIEND ${onlineTag} ${f.pseudo.padEnd(10)}  (${f.relation})`,
    );
  }

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

  for (const a of seedAccommodations) {
    const existing = await prisma.accommodation.findFirst({
      where: { name: a.name, ownerId: adminId },
      select: { id: true },
    });
    const data = {
      name: a.name,
      description: a.description,
      address: a.address,
      category: a.category,
      stars: a.stars,
      priceFromEur: a.priceFromEur,
      amenities: a.amenities ?? [],
      ownerId: adminId,
    };
    if (existing) {
      await prisma.accommodation.update({ where: { id: existing.id }, data });
      console.log(`ok HEBER  ${a.name}  (updated)`);
    } else {
      const created = await prisma.accommodation.create({ data });
      console.log(`ok HEBER  ${a.name}  (created, id=${created.id})`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
