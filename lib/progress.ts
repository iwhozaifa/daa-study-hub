// Personal progress tracker: pure data + rules, no React. Everything is stored in the visitor's own browser
// (localStorage); nothing is ever sent to a server. See components/progress/ for the UI.

export const STORAGE_KEY = 'daa-study-hub-progress-v1';
export const VERSION = 1;

export const STATUSES = ['not-started', 'in-progress', 'mastered'] as const;
export type Status = (typeof STATUSES)[number];

export const MODES = ['Visual', 'Worked example', 'Guided questions', 'Explanation & drill'] as const;
export type Mode = (typeof MODES)[number];

/** The Definition of Done: solve without hints, then explain it back (the 5 prompts from the self-study page). */
export const CHECKS = [
  'Solved the mastery check with no hints',
  'Said it in one sentence',
  'Explained it with my own analogy',
  'Walked through the steps of my own hand trace',
  'Explained why it is correct / how fast it is',
  'Named a trap a beginner would fall into',
] as const;

export const MAX_SCORE = 50;

export interface TopicProgress {
  status: Status;
  checks: boolean[];
  mode?: Mode;
  updated?: string;
}

export interface MockScore {
  id: string;
  date: string;
  paper: 'A' | 'B';
  score: number;
  weak: string;
}

export interface Mistake {
  id: string;
  date: string;
  topic: string;
  what: string;
  why: string;
  fix: string;
}

export interface ProgressData {
  version: typeof VERSION;
  topics: Record<string, TopicProgress>;
  mocks: MockScore[];
  mistakes: Mistake[];
}

export const EMPTY: ProgressData = Object.freeze({ version: VERSION, topics: {}, mocks: [], mistakes: [] }) as ProgressData;

export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getTopic(data: ProgressData, slug: string): TopicProgress {
  return data.topics[slug] ?? { status: 'not-started', checks: CHECKS.map(() => false) };
}

export const allChecked = (t: TopicProgress) => t.checks.length === CHECKS.length && t.checks.every(Boolean);

function withTopic(data: ProgressData, slug: string, topic: TopicProgress, date: string): ProgressData {
  return { ...data, topics: { ...data.topics, [slug]: { ...topic, updated: date } } };
}

/** Tick or untick one checklist item. Unticking demotes a mastered topic to in progress. */
export function toggleCheck(data: ProgressData, slug: string, index: number, date = today()): ProgressData {
  if (index < 0 || index >= CHECKS.length) return data;
  const t = getTopic(data, slug);
  const checks = t.checks.map((c, i) => (i === index ? !c : c));
  let status = t.status;
  if (status === 'mastered' && !checks.every(Boolean)) status = 'in-progress';
  if (status === 'not-started' && checks.some(Boolean)) status = 'in-progress';
  return withTopic(data, slug, { ...t, checks, status }, date);
}

/** Change a topic's status. "Mastered" is refused (data returned unchanged) until every check is ticked. */
export function setStatus(data: ProgressData, slug: string, status: Status, date = today()): ProgressData {
  const t = getTopic(data, slug);
  if (status === 'mastered' && !allChecked(t)) return data;
  return withTopic(data, slug, { ...t, status }, date);
}

export function setMode(data: ProgressData, slug: string, mode: Mode | undefined, date = today()): ProgressData {
  return withTopic(data, slug, { ...getTopic(data, slug), mode }, date);
}

export function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(MAX_SCORE, Math.max(0, Math.round(score * 2) / 2));
}

export function addMock(data: ProgressData, mock: Omit<MockScore, 'id'>, id = newId()): ProgressData {
  const entry: MockScore = { ...mock, id, score: clampScore(mock.score), weak: mock.weak.trim() };
  return { ...data, mocks: [...data.mocks, entry] };
}

export function removeMock(data: ProgressData, id: string): ProgressData {
  return { ...data, mocks: data.mocks.filter((m) => m.id !== id) };
}

export function addMistake(data: ProgressData, mistake: Omit<Mistake, 'id'>, id = newId()): ProgressData {
  const entry: Mistake = {
    ...mistake,
    id,
    what: mistake.what.trim(),
    why: mistake.why.trim(),
    fix: mistake.fix.trim(),
  };
  return { ...data, mistakes: [...data.mistakes, entry] };
}

export function removeMistake(data: ProgressData, id: string): ProgressData {
  return { ...data, mistakes: data.mistakes.filter((m) => m.id !== id) };
}

export function summary(data: ProgressData, slugs: string[]) {
  const statuses = slugs.map((s) => getTopic(data, s).status);
  return {
    total: slugs.length,
    mastered: statuses.filter((s) => s === 'mastered').length,
    inProgress: statuses.filter((s) => s === 'in-progress').length,
  };
}

export function serialize(data: ProgressData): string {
  return JSON.stringify(data, null, 2);
}

// ---------- validation (for Import and for whatever is already in localStorage) ----------

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : null);

export type ParseResult = { ok: true; data: ProgressData } | { ok: false; error: string };

/** Validates a progress file and rebuilds it from known fields only (anything unexpected is dropped). */
export function parseImport(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' };
  }
  if (!isObj(raw)) return { ok: false, error: 'This is not a DAA Study Hub progress file.' };
  if (raw.version !== VERSION) return { ok: false, error: `Unsupported file version (expected ${VERSION}).` };
  if (!isObj(raw.topics) || !Array.isArray(raw.mocks) || !Array.isArray(raw.mistakes)) {
    return { ok: false, error: 'This is not a DAA Study Hub progress file.' };
  }

  const topics: Record<string, TopicProgress> = {};
  for (const [slug, t] of Object.entries(raw.topics)) {
    if (!/^[\w-]{1,80}$/.test(slug) || !isObj(t)) return { ok: false, error: `Topic "${slug}" is malformed.` };
    if (!STATUSES.includes(t.status as Status)) return { ok: false, error: `Topic "${slug}" has an unknown status.` };
    if (!Array.isArray(t.checks) || t.checks.length !== CHECKS.length || !t.checks.every((c) => typeof c === 'boolean')) {
      return { ok: false, error: `Topic "${slug}" has a malformed checklist.` };
    }
    const topic: TopicProgress = { status: t.status as Status, checks: [...(t.checks as boolean[])] };
    if (topic.status === 'mastered' && !allChecked(topic)) topic.status = 'in-progress';
    if (MODES.includes(t.mode as Mode)) topic.mode = t.mode as Mode;
    const updated = str(t.updated, 10);
    if (updated) topic.updated = updated;
    topics[slug] = topic;
  }

  const mocks: MockScore[] = [];
  for (const m of raw.mocks) {
    if (!isObj(m) || (m.paper !== 'A' && m.paper !== 'B') || typeof m.score !== 'number') {
      return { ok: false, error: 'A mock exam entry is malformed.' };
    }
    mocks.push({
      id: str(m.id, 64) || newId(),
      date: str(m.date, 10) ?? '',
      paper: m.paper,
      score: clampScore(m.score),
      weak: str(m.weak) ?? '',
    });
  }

  const mistakes: Mistake[] = [];
  for (const m of raw.mistakes) {
    if (!isObj(m) || str(m.what) === null) return { ok: false, error: 'A mistake entry is malformed.' };
    mistakes.push({
      id: str(m.id, 64) || newId(),
      date: str(m.date, 10) ?? '',
      topic: str(m.topic, 200) ?? '',
      what: str(m.what) ?? '',
      why: str(m.why) ?? '',
      fix: str(m.fix) ?? '',
    });
  }

  return { ok: true, data: { version: VERSION, topics, mocks, mistakes } };
}
