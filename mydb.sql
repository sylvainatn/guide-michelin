-- Adminer 5.4.2 PostgreSQL 15.17 dump

\connect "mydb";

INSERT INTO "accommodations" ("id", "createdAt", "updatedAt", "name", "description", "address", "category", "stars", "priceFromEur", "mainImageUrl", "amenities", "photos", "ownerId", "videoUrl", "video360") VALUES
('cmobi0dut0008zz1zirpiwuxl',	'2026-04-23 13:09:25.157',	'2026-04-23 13:15:35.54',	'Maison Lumiere Hotel',	'18 suites feutrees a deux pas des Champs-Elysees, bar a champagnes et voiturier 24/7.',	'8eme arrondissement, Paris',	'HOTEL',	5,	490,	NULL,	'{Spa,Bar,Voiturier,Concierge}',	'{}',	'b10ed346-5125-46da-b20f-b83551ae30b0',	'/uploads/videos/accommodation/1776950135497-f732fe65-f5ec-4a58-badd-2176f008cfae.mp4',	'0'),
('cmobi0dur0007zz1z82q5hgjg',	'2026-04-23 13:09:25.155',	'2026-04-23 13:16:32.866',	'Chalet Megeve Alpina',	'Chalet familial pied des pistes, cheminee, cave a vin et spa nordique. Vue imprenable sur le Mont-Blanc.',	'Megeve, Haute-Savoie',	'CHALET',	4,	520,	NULL,	'{"Spa nordique",Cheminee,"Ski in/out"}',	'{}',	'b10ed346-5125-46da-b20f-b83551ae30b0',	'/uploads/videos/accommodation/1776950192823-3acf3de2-7727-487f-9e62-a7cf2f902d8e.mp4',	'0'),
('cmobi0duo0006zz1zqxxaos5v',	'2026-04-23 13:09:25.152',	'2026-04-23 13:17:09.314',	'Villa Cap Ferret',	'Villa les pieds dans le sable, toit-terrasse panoramique sur le bassin d''Arcachon. Piscine chauffee, chef prive sur demande.',	'Cap Ferret, Gironde',	'VILLA',	5,	860,	NULL,	'{Piscine,Spa,"Plage privee","Chef prive"}',	'{}',	'b10ed346-5125-46da-b20f-b83551ae30b0',	'/uploads/videos/accommodation/1776950229269-f1a84691-f011-461e-bb67-ed9a903ff880.mp4',	'0')
ON CONFLICT ("id") DO UPDATE SET
	"updatedAt" = EXCLUDED."updatedAt",
	"name" = EXCLUDED."name",
	"description" = EXCLUDED."description",
	"address" = EXCLUDED."address",
	"category" = EXCLUDED."category",
	"stars" = EXCLUDED."stars",
	"priceFromEur" = EXCLUDED."priceFromEur",
	"mainImageUrl" = EXCLUDED."mainImageUrl",
	"amenities" = EXCLUDED."amenities",
	"photos" = EXCLUDED."photos",
	"ownerId" = EXCLUDED."ownerId",
	"videoUrl" = EXCLUDED."videoUrl",
	"video360" = EXCLUDED."video360";

INSERT INTO "restaurants" ("id", "createdAt", "updatedAt", "name", "description", "address", "ownerId", "videoUrl", "chefName", "stars", "priceRange", "style", "tourStops", "photos360", "mainImageUrl") VALUES
('cmobi0dui0004zz1zh4tps457',	'2026-04-23 13:09:25.146',	'2026-04-23 13:10:35.564',	'Les Terres Salees',	'Bistrot marin sur la cote basque. Poissons du jour, iode et feu de bois. Une adresse franche, vibrante, gourmande.',	'Biarritz, Pyrenees-Atlantiques',	'b10ed346-5125-46da-b20f-b83551ae30b0',	'/uploads/videos/restaurant/1776949835518-486f6f2e-d1cf-4323-9534-5ec67c6c0a27.mp4',	'Tomas Etcheverry',	NULL,	'EUREUR',	'{"Bib Gourmand","Bord de mer"}',	'{"stops": [{"id": "terrasse", "label": "Terrasse", "camera": {"pos": [0, 1.7, 8], "look": [0, 1.4, 0]}, "duration": 5000}, {"id": "bar", "label": "Bar en bois", "camera": {"pos": [-3, 1.7, 2], "look": [0, 1.4, 0]}, "duration": 4500}, {"id": "salle", "label": "Salle principale", "camera": {"pos": [3, 1.7, 0], "look": [0, 1.4, -2]}, "duration": 5000}], "ambient": "dawn"}',	'{}',	NULL),
('cmobi0due0002zz1z6hs4rjas',	'2026-04-23 13:09:25.142',	'2026-04-23 13:10:55.17',	'Maison Lumiere',	'Un ecrin contemporain a Paris, cuisine instinctive et produits de saison. Ambiance feutree, chandeliers et tableaux anciens.',	'8eme arrondissement, Paris',	'b10ed346-5125-46da-b20f-b83551ae30b0',	'/uploads/videos/restaurant/1776949855084-731f4655-e4af-4a8a-9cf6-a4c1f50ecf5a.mp4',	'Elise Moreau',	2,	'EUREUREUREUR',	'{Gastronomie,Moderne}',	'{"stops": [{"id": "entree", "label": "Entree", "camera": {"pos": [0, 1.7, 7], "look": [0, 1.5, 0]}, "duration": 4500}, {"id": "salon", "label": "Salon prive", "camera": {"pos": [-4, 1.7, 1], "look": [0, 1.4, 0]}, "duration": 5000}, {"id": "passe", "label": "Le passe", "camera": {"pos": [3, 1.9, -2], "look": [3, 1.4, -5]}, "duration": 4500}, {"id": "cave", "label": "Cave a vin", "camera": {"pos": [0, 1.6, -5.5], "look": [0, 1.4, -8]}, "duration": 4500}], "ambient": "soir"}',	'{}',	NULL),
('cmobi0du50000zz1zgfwzjb2o',	'2026-04-23 13:09:25.133',	'2026-04-23 13:11:48.032',	'Bordeaux Secret',	'Une table confidentielle au coeur du Bordelais, ou le terroir dialogue avec l''elegance moderne. Vue panoramique sur les vignes.',	'Saint-Emilion, Bordelais',	'b10ed346-5125-46da-b20f-b83551ae30b0',	'/uploads/videos/restaurant/1776949907982-68547dec-2e5c-4b2d-9e23-a3e4bd87935b.mp4',	'Louis Vasseur',	1,	'EUREUREUR',	'{"Pour vous","Vignes & Gastronomie"}',	'{"stops": [{"id": "entree", "label": "Entree", "camera": {"pos": [0, 1.7, 7], "look": [0, 1.5, 0]}, "duration": 4500}, {"id": "salle", "label": "Salle a manger", "camera": {"pos": [-3.5, 1.7, 2], "look": [0, 1.4, 0]}, "duration": 5000}, {"id": "cuisine", "label": "Cuisine ouverte", "camera": {"pos": [3.5, 1.9, -2], "look": [3.5, 1.4, -5]}, "duration": 5000}, {"id": "cave", "label": "Cave a vin", "camera": {"pos": [0, 1.6, -5.5], "look": [0, 1.4, -8]}, "duration": 4500}], "ambient": "midi"}',	'{}',	NULL)
ON CONFLICT ("id") DO UPDATE SET
	"updatedAt" = EXCLUDED."updatedAt",
	"name" = EXCLUDED."name",
	"description" = EXCLUDED."description",
	"address" = EXCLUDED."address",
	"ownerId" = EXCLUDED."ownerId",
	"videoUrl" = EXCLUDED."videoUrl",
	"chefName" = EXCLUDED."chefName",
	"stars" = EXCLUDED."stars",
	"priceRange" = EXCLUDED."priceRange",
	"style" = EXCLUDED."style",
	"tourStops" = EXCLUDED."tourStops",
	"photos360" = EXCLUDED."photos360",
	"mainImageUrl" = EXCLUDED."mainImageUrl";

-- 2026-04-23 13:22:52 UTC
