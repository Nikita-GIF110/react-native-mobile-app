import React, { createContext, useContext, useState, ReactNode } from "react";

type StepperContextType = {
  activeStepIndex: number;
  stepsLength: number;
  isCanGoNext: boolean;
  isCanGoBack: boolean;
  onNext: () => void;
  onBack: () => void;
  reset: () => void;
};

const StepperContext = createContext<StepperContextType | undefined>(undefined);

type StepperProviderProps = {
  children: ReactNode;
  stepsLength: number;
  initialStep?: number;
};

export const StepperProvider = ({
  children,
  stepsLength,
  initialStep = 0,
}: StepperProviderProps) => {
  const [stepIndex, setStepIndex] = useState<number>(
    Math.min(initialStep, stepsLength - 1)
  );

  const onNext = () => {
    const nextStep = stepIndex + 1;

    if (nextStep >= stepsLength) {
      return;
    }

    setStepIndex(nextStep);
  };

  const onBack = () => {
    const isCanGoBack = stepIndex > 0;

    if (!isCanGoBack) {
      return;
    }

    const prevStep = stepIndex - 1;
    setStepIndex(prevStep);
  };

  const reset = () => setStepIndex(initialStep);

  return (
    <StepperContext.Provider
      value={{
        activeStepIndex: stepIndex,
        stepsLength,
        isCanGoNext: stepIndex < stepsLength - 1,
        isCanGoBack: stepIndex > 0,
        onNext,
        onBack,
        reset,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = (): StepperContextType => {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }

  return context;
};
export const useStep = (stepIndex: number) => {
  const { activeStepIndex } = useStepper();

  return {
    isActive: activeStepIndex === stepIndex,
    isCompleted: activeStepIndex > stepIndex,
    isUpcoming: activeStepIndex < stepIndex,
  };
};
export const useStepperProgress = () => {
  const { activeStepIndex, stepsLength } = useStepper();

  return {
    current: activeStepIndex + 1,
    total: stepsLength,
    progress: ((activeStepIndex + 1) / stepsLength) * 100,
  };
};
