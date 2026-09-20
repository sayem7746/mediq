export const caseStatuses = [
  "received",
  "being-routed",
  "provider-contacted",
  "provider-response-received",
  "closed",
] as const;

export type CaseStatus = (typeof caseStatuses)[number];

const transitions: Record<CaseStatus, CaseStatus[]> = {
  received: ["being-routed"],
  "being-routed": ["provider-contacted", "closed"],
  "provider-contacted": ["provider-response-received", "closed"],
  "provider-response-received": ["closed"],
  closed: [],
};

export function canTransitionCase(from: CaseStatus, to: CaseStatus): boolean {
  return transitions[from].includes(to);
}

export function transitionCase(from: CaseStatus, to: CaseStatus): CaseStatus {
  if (!canTransitionCase(from, to)) {
    throw new Error(`Cannot move case from ${from} to ${to}`);
  }
  return to;
}
