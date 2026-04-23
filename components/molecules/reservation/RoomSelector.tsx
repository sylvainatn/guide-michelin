"use client";

import { BedIcon, CheckIcon, ChevronRightIcon } from "@/components/atoms/icons";
import type { RoomOption } from "@/types/reservation";

interface RoomSelectorProps {
  rooms: RoomOption[];
  onRoomSelect: (roomId: string) => void;
}

export const RoomSelector = ({ rooms, onRoomSelect }: RoomSelectorProps) => {
  return (
    <div className="w-full">
      <h3 className="font-semibold text-sm text-tertiary mb-2.5">
        Option de chambre
      </h3>
      
      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`
              flex items-center gap-3 p-4 rounded-xl h-15 w-full text-left transition-all
              ${room.selected 
                ? "bg-primary text-white" 
                : "bg-neutral-50 border border-neutral-200 text-tertiary hover:bg-neutral-100"
              }
            `}
          >
            {/* Room Icon */}
            <div className={`
              rounded-lg w-9 h-9 flex items-center justify-center
              ${room.selected 
                ? "bg-white bg-opacity-20" 
                : "bg-neutral-200"
              }
            `}>
              <BedIcon className={`size-4 ${room.selected ? "text-white" : "text-neutral-600"}`} />
            </div>

            {/* Room Info */}
            <div className="flex-1 flex flex-col gap-0.5">
              <span className={`
                font-semibold text-sm
                ${room.selected ? "text-white" : "text-tertiary"}
              `}>
                {room.name}
              </span>
              <span className={`
                text-xs
                ${room.selected ? "text-white text-opacity-50" : "text-neutral-400"}
              `}>
                {room.description}
              </span>
            </div>

            {/* Selection Indicator / Arrow */}
            {room.selected ? (
              <div className="bg-white rounded-xl w-5 h-5 flex items-center justify-center">
                <CheckIcon className="size-3 text-primary" />
              </div>
            ) : (
              <ChevronRightIcon className="size-4 text-neutral-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};