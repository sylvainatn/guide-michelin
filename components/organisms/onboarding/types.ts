import type {
  BudgetTier,
  CuisineStyle,
  TravelEnvironment,
  TravelPace,
  TravelStyle,
  TripDuration,
} from "../../../lib/auth/client";

export type OnboardingState = {
  age: number;
  environments: TravelEnvironment[];
  cuisines: CuisineStyle[];
  travelStyle: TravelStyle | null;
  travelPace: TravelPace | null;
  tripDuration: TripDuration | null;
  budgetPerNight: number;
  budgetTier: BudgetTier | null;
};

export const defaultOnboardingState: OnboardingState = {
  age: 27,
  environments: [],
  cuisines: [],
  travelStyle: null,
  travelPace: null,
  tripDuration: null,
  budgetPerNight: 485,
  budgetTier: null,
};

export type StepProps = {
  state: OnboardingState;
  setState: (patch: Partial<OnboardingState>) => void;
  onNext: () => void;
};
