import React from "react";

export const useStepper = (stepsLength: number) => {
  const [stepIndex, setStepIndex] = React.useState<number>(0);

  const onNext = () => {
    const nextStep = stepIndex + 1;

    if (nextStep === stepsLength) {
      return;
    }
    setStepIndex(nextStep);
  };

  const onBack = () => {
    const isCanGoBack = stepIndex > 0;

    if (!isCanGoBack) {
      return;
    }

    setStepIndex(stepIndex - 1);
  };

  return {
    activeStepIndex: stepIndex,
    isCanGoNext: stepsLength > stepIndex + 1,
    isCanGoBack: stepIndex !== 0,
    onNext,
    onBack,
  };
};
