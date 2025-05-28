import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WorkflowStep {
  id: string;
  name: string;
  path: string;
  completed: boolean;
  unlocked: boolean;
  order: number;
}

interface WorkflowState {
  currentStep: number;
  steps: WorkflowStep[];
  isAutoProgression: boolean;
  completedSteps: string[];

  // Actions
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: string) => void;
  unlockStep: (stepId: string) => void;
  resetWorkflow: () => void;
  setAutoProgression: (enabled: boolean) => void;
  getNextStep: () => WorkflowStep | null;
  getPreviousStep: () => WorkflowStep | null;
  canAccessStep: (stepId: string) => boolean;
}

const defaultSteps: WorkflowStep[] = [
  {
    id: "index",
    name: "Welcome Home",
    path: "/",
    completed: false,
    unlocked: true,
    order: 0,
  },
  {
    id: "countdown",
    name: "Countdown Magic",
    path: "/countdown",
    completed: false,
    unlocked: false,
    order: 1,
  },
  {
    id: "anniversary",
    name: "Our Anniversary",
    path: "/timeline",
    completed: false,
    unlocked: false,
    order: 2,
  },
  {
    id: "love-story",
    name: "Love Story",
    path: "/love-letters",
    completed: false,
    unlocked: false,
    order: 3,
  },
  {
    id: "gallery",
    name: "Memory Gallery",
    path: "/photo-booth",
    completed: false,
    unlocked: false,
    order: 4,
  },
  {
    id: "games",
    name: "Love Games",
    path: "/games",
    completed: false,
    unlocked: false,
    order: 5,
  },
  {
    id: "fireworks",
    name: "Fireworks Show",
    path: "/celebration",
    completed: false,
    unlocked: false,
    order: 6,
  },
];

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      steps: defaultSteps,
      isAutoProgression: true,
      completedSteps: [],

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      completeStep: (stepId: string) => {
        const state = get();
        const stepIndex = state.steps.findIndex((step) => step.id === stepId);

        if (stepIndex !== -1) {
          const updatedSteps = [...state.steps];
          updatedSteps[stepIndex].completed = true;

          // Unlock next step
          if (stepIndex + 1 < updatedSteps.length) {
            updatedSteps[stepIndex + 1].unlocked = true;
          }

          set({
            steps: updatedSteps,
            completedSteps: [...state.completedSteps, stepId],
          });
        }
      },

      unlockStep: (stepId: string) => {
        const state = get();
        const stepIndex = state.steps.findIndex((step) => step.id === stepId);

        if (stepIndex !== -1) {
          const updatedSteps = [...state.steps];
          updatedSteps[stepIndex].unlocked = true;

          set({ steps: updatedSteps });
        }
      },

      resetWorkflow: () => {
        set({
          currentStep: 0,
          steps: defaultSteps.map((step) => ({
            ...step,
            completed: false,
            unlocked: step.order === 0,
          })),
          completedSteps: [],
        });
      },

      setAutoProgression: (enabled: boolean) => {
        set({ isAutoProgression: enabled });
      },

      getNextStep: () => {
        const state = get();
        const currentStepIndex = state.currentStep;
        return currentStepIndex + 1 < state.steps.length
          ? state.steps[currentStepIndex + 1]
          : null;
      },

      getPreviousStep: () => {
        const state = get();
        const currentStepIndex = state.currentStep;
        return currentStepIndex > 0 ? state.steps[currentStepIndex - 1] : null;
      },

      canAccessStep: (stepId: string) => {
        const state = get();
        const step = state.steps.find((s) => s.id === stepId);
        return step ? step.unlocked : false;
      },
    }),
    {
      name: "anniversary-workflow-storage",
      version: 1,
    },
  ),
);
