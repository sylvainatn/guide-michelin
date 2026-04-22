import Image from "next/image";

export const BrandHero = () => (
  <div className="relative bg-primary">
    <div className="flex flex-col items-center justify-center px-6 pt-24 pb-28">
      <Image
        src="/logos/white-logo.png"
        alt="Le Guide Michelin"
        width={240}
        height={140}
        priority
        className="h-auto w-60 select-none"
      />
    </div>
    <svg
      aria-hidden
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className="absolute inset-x-0 -bottom-px block h-10 w-full text-primary"
    >
      <path d="M0,0 L0,2 Q50,10 100,2 L100,0 Z" fill="currentColor" />
    </svg>
  </div>
);
