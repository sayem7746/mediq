export const correctionStates = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "published",
] as const;

export type CorrectionState = (typeof correctionStates)[number];

const transitions: Record<CorrectionState, CorrectionState[]> = {
  submitted: ["under_review"],
  under_review: ["approved", "rejected"],
  approved: ["published"],
  rejected: [],
  published: [],
};

export class CorrectionTransitionError extends Error {
  constructor(from: CorrectionState, to: CorrectionState) {
    super(`Cannot move correction from ${from} to ${to}`);
  }
}

export function canTransitionCorrection(
  from: CorrectionState,
  to: CorrectionState,
): boolean {
  return transitions[from].includes(to);
}

export function transitionCorrection(
  from: CorrectionState,
  to: CorrectionState,
): CorrectionState {
  if (!canTransitionCorrection(from, to)) {
    throw new CorrectionTransitionError(from, to);
  }
  return to;
}
