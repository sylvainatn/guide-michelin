"use client";

import { useEffect, useMemo, useState } from "react";
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

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const diffInNights = (checkIn: Date, checkOut: Date) =>
  Math.max(
    1,
    Math.round(
      (startOfDay(checkOut).getTime() - startOfDay(checkIn).getTime()) /
        MS_PER_DAY,
    ),
  );

export const DateSelector = ({ onDateChange, initialDates }: DateSelectorProps) => {
  const today = useMemo(() => startOfDay(new Date()), []);

  const [selectedDates, setSelectedDates] = useState<ReservationDates | null>(
    initialDates ?? null,
  );
  // Track partial selection when user has picked only the check-in date.
  const [pendingCheckIn, setPendingCheckIn] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(
    initialDates?.checkIn ?? new Date(),
  );

  // Keep the internal state in sync if the parent provides new initialDates asynchronously.
  useEffect(() => {
    if (!initialDates) return;
    setSelectedDates((prev) => {
      if (
        prev &&
        prev.checkIn.getTime() === initialDates.checkIn.getTime() &&
        prev.checkOut.getTime() === initialDates.checkOut.getTime()
      ) {
        return prev;
      }
      return initialDates;
    });
  }, [initialDates]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(
      startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1),
    );

    const days: Date[] = [];
    const current = new Date(startDate);

    while (days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  const isInSelectedRange = (date: Date) => {
    if (!selectedDates) return false;
    const d = startOfDay(date).getTime();
    return (
      d >= startOfDay(selectedDates.checkIn).getTime() &&
      d <= startOfDay(selectedDates.checkOut).getTime()
    );
  };

  const isStartDate = (date: Date) => {
    if (selectedDates && sameDay(date, selectedDates.checkIn)) return true;
    if (pendingCheckIn && sameDay(date, pendingCheckIn)) return true;
    return false;
  };

  const isEndDate = (date: Date) => {
    if (!selectedDates) return false;
    return sameDay(date, selectedDates.checkOut);
  };

  const isPast = (date: Date) =>
    startOfDay(date).getTime() < today.getTime();

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${MONTHS[date.getMonth()].substring(0, 3).toLowerCase()}.`;
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day: Date) => {
    if (day.getMonth() !== currentDate.getMonth()) return;
    if (isPast(day)) return;

    // If nothing is pending, start a new range.
    if (!pendingCheckIn) {
      setPendingCheckIn(startOfDay(day));
      setSelectedDates(null);
      onDateChange(null);
      return;
    }

    const checkIn = pendingCheckIn;
    const clicked = startOfDay(day);

    // Clicking the same day twice resets the selection.
    if (sameDay(checkIn, clicked)) {
      setPendingCheckIn(null);
      return;
    }

    // If user picks an earlier date as the second click, use it as the new check-in.
    if (clicked.getTime() < checkIn.getTime()) {
      setPendingCheckIn(clicked);
      setSelectedDates(null);
      onDateChange(null);
      return;
    }

    const nights = diffInNights(checkIn, clicked);
    const next: ReservationDates = {
      checkIn,
      checkOut: clicked,
      nights,
    };
    setSelectedDates(next);
    setPendingCheckIn(null);
    onDateChange(next);
  };

  const days = getDaysInMonth(currentDate);
  const currentMonth = currentDate.getMonth();
  const isCurrentViewMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="font-semibold text-sm text-tertiary">
          Sélection des dates
        </h3>
        <span className="bg-red-50 px-2.5 py-1 rounded-full">
          <span className="text-xs font-medium text-primary">
            {pendingCheckIn
              ? "Choisir la date de départ"
              : selectedDates
                ? "Modifier"
                : "Choisir une date"}
          </span>
        </span>
      </div>

      {/* Calendar */}
      <div className="bg-tertiary rounded-2xl p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={previousMonth}
            disabled={isCurrentViewMonth}
            className="p-1 disabled:opacity-30"
            aria-label="Mois précédent"
          >
            <ChevronLeftIcon className="size-4 text-white" />
          </button>
          <h4 className="font-semibold text-sm text-white">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1"
            aria-label="Mois suivant"
          >
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
            const past = isPast(day);
            const inRange = isInSelectedRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            const isSelectable = isCurrentMonth && !past;

            const baseClasses = [
              "text-center py-1 text-xs relative",
            ];
            if (!isCurrentMonth) {
              baseClasses.push("text-transparent pointer-events-none");
            } else if (past) {
              baseClasses.push("text-neutral-500 cursor-not-allowed");
            } else {
              baseClasses.push("text-white cursor-pointer");
            }
            if (inRange && !isStart && !isEnd) {
              baseClasses.push("bg-primary/20 text-primary font-semibold");
            }
            if (isStart || isEnd) {
              baseClasses.push("bg-primary text-white rounded-xl font-semibold");
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={!isSelectable}
                className={baseClasses.join(" ")}
                aria-label={
                  isCurrentMonth ? day.toDateString() : undefined
                }
              >
                <span className="relative z-10 w-7 h-7 flex items-center justify-center mx-auto">
                  {isCurrentMonth ? day.getDate() : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Dates Display */}
        {selectedDates ? (
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

            <div className="bg-white/20 px-2 py-1 rounded-md">
              <span className="text-xs text-white/70">
                {selectedDates.nights} nuits
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-2">
            <span className="text-xs text-white/70">
              {pendingCheckIn
                ? `Arrivée le ${formatDate(pendingCheckIn)} · choisissez la date de départ`
                : "Sélectionnez votre date d'arrivée"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
