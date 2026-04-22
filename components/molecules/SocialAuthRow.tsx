import {
  AppleGlyph,
  GoogleGlyph,
  InstagramGlyph,
} from "../atoms/SocialIcons";

const tile =
  "flex size-12 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 transition-transform active:scale-95";

export const SocialAuthRow = () => (
  <div className="flex items-center justify-center gap-4">
    <button type="button" aria-label="Continuer avec Google" className={`${tile} bg-white`}>
      <GoogleGlyph className="size-6" />
    </button>
    <button type="button" aria-label="Continuer avec Apple" className={`${tile} bg-black text-white`}>
      <AppleGlyph className="size-6" />
    </button>
    <button
      type="button"
      aria-label="Continuer avec Instagram"
      className={`${tile} text-white`}
      style={{
        background:
          "linear-gradient(135deg,#feda75 0%,#fa7e1e 25%,#d62976 55%,#962fbf 80%,#4f5bd5 100%)",
      }}
    >
      <InstagramGlyph className="size-6" />
    </button>
  </div>
);
