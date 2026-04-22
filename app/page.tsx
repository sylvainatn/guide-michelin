"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/atoms/Button";
import { PlainLink } from "../components/atoms/PlainLink";
import { BrandHero } from "../components/molecules/BrandHero";

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="flex flex-1 items-stretch justify-center bg-neutral-50 md:items-center md:px-4 md:py-6">
      <div className="flex w-full flex-col overflow-hidden bg-neutral-50 md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(420px,100%)] md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10">
        <BrandHero />
        <div className="flex flex-1 flex-col items-center justify-end gap-4 px-6 pt-10 pb-10">
          <Button fullWidth onClick={() => router.push("/signup")}>
            Créer mon compte
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push("/signin")}
          >
            Se connecter
          </Button>
          <PlainLink href="/feed" className="mt-2">
            Continuer sans me connecter
          </PlainLink>
        </div>
      </div>
    </main>
  );
}
