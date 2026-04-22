import { StarFilledIcon } from "./icons";

export const UserInitialAvatar = ({
  initial,
  showBadge = true,
}: {
  initial: string;
  showBadge?: boolean;
}) => (
  <div className="relative flex size-20 items-center justify-center rounded-full bg-michelin-red-700 ring-4 ring-white/15">
    <span className="text-2xl font-semibold text-white">
      {initial.toUpperCase()}
    </span>
    {showBadge && (
      <span className="absolute bottom-0 left-1 flex size-6 items-center justify-center rounded-full bg-michelin-gold-500 ring-2 ring-primary">
        <StarFilledIcon className="h-3 w-3 text-white" />
      </span>
    )}
  </div>
);
