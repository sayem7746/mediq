import fs from "node:fs";
import path from "node:path";

export const CONTENT_POLICY_VERSION = "2026-09-20.1";

export const PROHIBITED_PATTERNS: Array<{ id: string; re: RegExp }> = [
  { id: "chest-pain", re: /chest pain/i },
  { id: "heart-attack", re: /heart attack/i },
  { id: "best-hospital", re: /best hospital/i },
  { id: "best-for-you", re: /best for you/i },
  { id: "we-recommend", re: /we recommend /i },
  { id: "guaranteed-successful", re: /guaranteed successful/i },
  { id: "tell-us-symptoms", re: /tell us your symptoms/i },
  { id: "you-may-have", re: /you may have a /i },
  { id: "match-the-right-doctor", re: /match the right doctor/i },
];

export const PERMITTED_DISCLAIMER_PATTERNS = [
  /information and navigation only/i,
  /not medical advice/i,
  /not a diagnosis/i,
  /do not enter symptoms/i,
  /contact local emergency/i,
];

export type PolicyHit = {
  file: string;
  id: string;
  snippet: string;
};

function stripPermitted(text: string): string {
  return PERMITTED_DISCLAIMER_PATTERNS.reduce(
    (acc, pattern) => acc.replace(pattern, " "),
    text,
  );
}

function isQuotedDocsExample(file: string, line: string): boolean {
  if (
    !file.includes(`${path.sep}docs${path.sep}`) &&
    !file.includes("/docs/")
  ) {
    return false;
  }
  const trimmed = line.trim();
  return (
    trimmed.startsWith(">") ||
    trimmed.startsWith("-") ||
    trimmed.startsWith("1.") ||
    trimmed.includes("“") ||
    trimmed.includes('"')
  );
}

export function scanText(text: string, file: string): PolicyHit[] {
  const hits: PolicyHit[] = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line) => {
    if (isQuotedDocsExample(file, line)) return;
    const scanned = stripPermitted(line);
    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.re.test(scanned)) {
        hits.push({ file, id: pattern.id, snippet: line.trim().slice(0, 160) });
      }
    }
  });
  return hits;
}

export function scanFiles(files: string[]): PolicyHit[] {
  return files.flatMap((file) => scanText(fs.readFileSync(file, "utf8"), file));
}

export function flagProhibitedPhrases(text: string): string[] {
  return PROHIBITED_PATTERNS.filter((pattern) => pattern.re.test(text)).map(
    (pattern) => pattern.id,
  );
}
