import Image from "next/image";
import { LogoBadge } from "./LogoBadge";

type Variant = "signin" | "signup";

const sources: Record<Variant, { src: string; alt: string }> = {
  signin: { src: "/images/hero-signin.png", alt: "" },
  signup: { src: "/images/hero-signup.png", alt: "" },
};

const heights: Record<Variant, string> = {
  signin: "h-[55vh] min-h-80",
  signup: "h-[42vh] min-h-65",
};

export const AuthHero = ({ variant }: { variant: Variant }) => {
  const { src, alt } = sources[variant];
  return (
    <div className={`relative w-full overflow-hidden ${heights[variant]}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 460px"
        className="object-cover"
      />
      <div className="absolute left-6 top-8 z-10">
        <LogoBadge />
      </div>
    </div>
  );
};
