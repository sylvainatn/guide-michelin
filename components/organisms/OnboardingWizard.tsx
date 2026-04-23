"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { profileApi } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import { StepHeader } from "../molecules/StepHeader";
import { StepAge } from "./onboarding/StepAge";
import { StepBudget } from "./onboarding/StepBudget";
import { StepCuisine } from "./onboarding/StepCuisine";
import { StepEnvironment } from "./onboarding/StepEnvironment";
import { StepPace } from "./onboarding/StepPace";
import { StepSummary } from "./onboarding/StepSummary";
import { StepTravelStyle } from "./onboarding/StepTravelStyle";
import { defaultOnboardingState, type OnboardingState } from "./onboarding/types";

const TOTAL = 7;

export const OnboardingWizard = () => {
  const router = useRouter();
  const { user, getAccessToken } = useAuth();
  const [step, setStep] = useState(1);
  const [state, setStateRaw] = useState<OnboardingState>(defaultOnboardingState);
  const [submitting, setSubmitting] = useState(false);

  const setState = (patch: Partial<OnboardingState>) =>
    setStateRaw((prev) => ({ ...prev, ...patch }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.push("/signin");
      return;
    }
    setSubmitting(true);
    try {
      await profileApi.update(
        {
          age: state.age,
          environments: state.environments,
          cuisines: state.cuisines,
          travelStyle: state.travelStyle ?? undefined,
          travelPace: state.travelPace ?? undefined,
          tripDuration: state.tripDuration ?? undefined,
          budgetPerNight: state.budgetPerNight,
          budgetTier: state.budgetTier ?? undefined,
          completed: true,
        },
        accessToken,
      );
      router.push("/");
    } catch {
      setSubmitting(false);
    }
  };

  const stepProps = { state, setState, onNext: next };

  return (
    <div className="flex min-h-full flex-col gap-6 bg-white px-6 py-6">
      <StepHeader
        current={step}
        total={TOTAL}
        onBack={step > 1 ? back : undefined}
      />
      {step === 1 && <StepAge {...stepProps} />}
      {step === 2 && <StepEnvironment {...stepProps} />}
      {step === 3 && <StepCuisine {...stepProps} />}
      {step === 4 && <StepTravelStyle {...stepProps} />}
      {step === 5 && <StepPace {...stepProps} />}
      {step === 6 && <StepBudget {...stepProps} />}
      {step === 7 && (
        <StepSummary
          firstName={user?.firstName ?? "Escapadeur"}
          lastName={user?.lastName ?? ""}
          state={state}
          submitting={submitting}
          onEdit={() => setStep(1)}
          onSubmit={submit}
        />
      )}
    </div>
  );
};
