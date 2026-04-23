"use client";

import type { MichelinExtra as MichelinExtraType } from "@/types/reservation";

interface MichelinExtraProps {
  extra: MichelinExtraType;
}

export const MichelinExtra = ({ extra }: MichelinExtraProps) => {
  return (
    <div className="bg-red-50 border border-primary rounded-xl p-3.5 flex items-center gap-3">
      {/* Michelin Star Icon */}
      <div className="bg-primary rounded-xl w-9 h-9 flex items-center justify-center">
        <span className="text-white font-semibold text-base">★</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="font-semibold text-xs text-primary">
          {extra.name}
        </span>
        <p className="text-xs text-primary text-opacity-75 leading-relaxed">
          {extra.description}
          {extra.chef && (
            <span className="block">Chef {extra.chef}</span>
          )}
        </p>
      </div>
    </div>
  );
};