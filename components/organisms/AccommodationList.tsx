import Link from "next/link";
import {
  type AccommodationDTO,
  ACCOMMODATION_CATEGORY_LABEL,
} from "../../lib/accommodations/client";
import { MutedText } from "../atoms/MutedText";

export const AccommodationList = ({
  accommodations,
  emptyLinkHref,
  itemHrefPrefix = "/dashboard/accommodations",
}: {
  accommodations: AccommodationDTO[] | null;
  emptyLinkHref: string;
  itemHrefPrefix?: string;
}) => {
  if (accommodations === null) return <MutedText>Chargement…</MutedText>;

  if (accommodations.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
        Aucun hébergement enregistré.{" "}
        <Link href={emptyLinkHref} className="text-black underline">
          Ajouter le premier
        </Link>
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
      {accommodations.map((a) => (
        <li key={a.id}>
          <Link
            href={`${itemHrefPrefix}/${a.id}`}
            className="block px-4 py-3 transition-colors hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{a.name}</p>
              <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                {ACCOMMODATION_CATEGORY_LABEL[a.category]}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-neutral-500">
              {a.description}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {a.address}
              {typeof a.priceFromEur === "number" &&
                ` · dès ${a.priceFromEur} €/nuit`}
              {typeof a.stars === "number" && a.stars > 0 && ` · ${a.stars}★`}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
