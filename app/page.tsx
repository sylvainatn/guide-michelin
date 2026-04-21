"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/atoms/Button";
import { PageHeader } from "../components/molecules/PageHeader";

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-50 md:px-4 md:py-6">
      <div className="w-full px-4 py-12 text-center md:h-[calc(100dvh-3rem)] md:max-h-[900px] md:w-[min(420px,100%)] md:rounded-3xl md:bg-white md:px-6 md:py-16 md:shadow-2xl md:ring-1 md:ring-black/10">
        <PageHeader
          title="Guide Michelin"
          subtitle="La marque globale de l'art de vivre."
          align="center"
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <Button onClick={() => router.push("/signin")}>Se connecter</Button>
          <Button variant="secondary" onClick={() => router.push("/signup")}>
            Créer un compte
          </Button>
        </div>
      </div>
    </main>
  );
}
