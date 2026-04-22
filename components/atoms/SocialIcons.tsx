import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const GoogleGlyph = (props: IconProps) => (
  <svg viewBox="0 0 48 48" aria-hidden {...props}>
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59A14.5 14.5 0 0 1 9.77 24c0-1.59.27-3.14.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.87.92 7.55 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

export const AppleGlyph = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" {...props}>
    <path d="M16.37 12.63c.02-2.33 1.9-3.44 1.98-3.5-1.08-1.58-2.77-1.8-3.37-1.82-1.43-.14-2.79.84-3.52.84-.74 0-1.85-.82-3.05-.8-1.56.02-3.01.91-3.82 2.31-1.63 2.82-.42 7 1.17 9.3.78 1.13 1.71 2.4 2.93 2.35 1.17-.05 1.61-.76 3.03-.76 1.42 0 1.82.76 3.06.74 1.27-.02 2.07-1.15 2.84-2.29.89-1.31 1.26-2.57 1.28-2.64-.03-.01-2.45-.94-2.53-3.73zM13.93 5.5c.65-.79 1.09-1.88.97-2.97-.93.04-2.07.62-2.74 1.4-.6.7-1.13 1.82-.99 2.88 1.04.08 2.1-.53 2.76-1.31z" />
  </svg>
);

export const InstagramGlyph = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="none" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
  </svg>
);
