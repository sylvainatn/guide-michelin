"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@/components/atoms/icons";
import type { ReservationDates } from "@/types/reservation";

interface DateSelectorProps {
  onDateChange: (dates: ReservationDates | null) => void;
  initialDates?: ReservationDates;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export const DateSelector = ({ onDateChange, initialDates }: DateSelectorProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<ReservationDates | null>(
    initialDates || {
      checkIn: new Date(2025, 9, 10), // 10 octobre 2025
      checkOut: new Date(2025, 9, 14), // 14 octobre 2025
      nights: 4
    }
  );
  const [isEditing, setIsEditing] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));
    
    const days = [];
    const current = new Date(startDate);
    
    while (days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isInSelectedRange = (date: Date) => {
    if (!selectedDates) return false;
    return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
  };

  const isStartDate = (date: Date) => {
    if (!selectedDates) return false;
    return date.toDateString() === selectedDates.checkIn.toDateString();
  };

  const isEndDate = (date: Date) => {
    if (!selectedDates) return false;
    return date.toDateString() === selectedDates.checkOut.toDateString();
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${MONTHS[date.getMonth()].substring(0, 3).toLowerCase()}.`;
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const days = getDaysInMonth(currentDate);
  const currentMonth = currentDate.getMonth();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="font-semibold text-sm text-tertiary">
          Sélection des dates
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-50 px-2.5 py-1 rounded-full"
          >
            <span className="text-xs font-medium text-primary">Modifier</span>
          </button>
        )}
      </div>

      {/* Calendar */}
      <div className="bg-tertiary rounded-2xl p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={previousMonth} className="p-1">
            <ChevronLeftIcon className="size-4 text-white" />
          </button>
          <h4 className="font-semibold text-sm text-white">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button onClick={nextMonth} className="p-1">
            <ChevronRightIcon className="size-4 text-white" />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-0 mb-1.5">
          {WEEKDAYS.map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-neutral-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 mb-4">
          {days.map((day, i) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const inRange = isInSelectedRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            
            return (
              <div
                key={i}
                className={`
                  text-center py-1 text-xs relative
                  ${!isCurrentMonth ? "text-transparent" : "text-white"}
                  ${inRange && !isStart && !isEnd ? "bg-primary bg-opacity-20" : ""}
                  ${isStart || isEnd ? "bg-primary text-white rounded-xl font-semibold" : ""}
                  ${inRange && !isStart && !isEnd ? "text-primary font-semibold" : ""}
                `}
              >
                <span className="relative z-10 w-7 h-7 flex items-center justify-center">
                  {isCurrentMonth ? day.getDate() : ""}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Dates Display */}
        {selectedDates && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="bg-neutral-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
              <CalendarIcon className="size-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {formatDate(selectedDates.checkIn)}
              </span>
            </div>
            
            <div className="h-px w-5 bg-primary"></div>
            
            <div className="bg-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
              <CalendarIcon className="size-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {formatDate(selectedDates.checkOut)}
              </span>
            </div>
            
            <div className="bg-white bg-opacity-20 px-2 py-1 rounded-md">
              <span className="text-xs text-white text-opacity-50">
                {selectedDates.nights} nuits
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};