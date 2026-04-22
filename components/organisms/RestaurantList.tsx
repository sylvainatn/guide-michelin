import Link from "next/link";
import type { RestaurantDTO } from "../../lib/restaurants/client";
import { MutedText } from "../atoms/MutedText";

export const RestaurantList = ({
  restaurants,
  emptyLinkHref,
  itemHrefPrefix = "/dashboard/restaurants",
}: {
  restaurants: RestaurantDTO[] | null;
  emptyLinkHref: string;
  itemHrefPrefix?: string;
}) => {
  if (restaurants === null) return <MutedText>Chargement…</MutedText>;

  if (restaurants.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
        Tu n&rsquo;as pas encore enregistré de restaurant.{" "}
        <Link href={emptyLinkHref} className="text-black underline">
          Ajouter le premier
        </Link>
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
      {restaurants.map((r) => (
        <li key={r.id}>
          <Link
            href={`${itemHrefPrefix}/${r.id}`}
            className="block px-4 py-3 transition-colors hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
          >
            <p className="font-medium">{r.name}</p>
            <p className="line-clamp-2 text-sm text-neutral-500">{r.description}</p>
            <p className="mt-1 text-xs text-neutral-400">{r.address}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
