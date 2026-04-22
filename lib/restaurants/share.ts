type ShareInput = {
  id: string;
  name: string;
};

type ShareResult = "shared" | "copied" | "unsupported";

export const shareRestaurant = async ({
  id,
  name,
}: ShareInput): Promise<ShareResult> => {
  if (typeof window === "undefined") return "unsupported";

  const url = `${window.location.origin}/restaurants/${id}`;
  const data: ShareData = {
    title: name,
    text: `Decouvre ${name} sur le Guide Michelin.`,
    url,
  };

  if ("share" in navigator) {
    try {
      await navigator.share(data);
      return "shared";
    } catch {
      // User cancelled or share rejected -- fall through to clipboard.
    }
  }

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      return "unsupported";
    }
  }

  return "unsupported";
};
