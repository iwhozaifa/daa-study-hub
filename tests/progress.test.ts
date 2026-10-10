// Rules of the in-browser progress tracker (lib/progress.ts).
import { describe, expect, it } from 'vitest';
import {
  CHECKS,
  EMPTY,
  addMistake,
  addMock,
  clampScore,
  getTopic,
  parseImport,
  removeMistake,
  removeMock,
  serialize,
  setMode,
  setStatus,
  summary,
  toggleCheck,
  type ProgressData,
} from '@/lib/progress';

const T = '04-insertion-sort';
const D = '2026-10-20';
const tickAll = (d: ProgressData, slug = T) => CHECKS.reduce((acc, _, i) => toggleCheck(acc, slug, i, D), d);

describe('mastery rules (Definition of Done)', () => {
  it('a new topic is not started with nothing ticked', () => {
    expect(getTopic(EMPTY, T)).toEqual({ status: 'not-started', checks: [false, false, false, false, false, false] });
  });

  it('refuses "mastered" until all six steps are ticked', () => {
    let d = toggleCheck(EMPTY, T, 0, D);
    expect(setStatus(d, T, 'mastered', D)).toBe(d); // unchanged
    d = tickAll(EMPTY);
    expect(getTopic(setStatus(d, T, 'mastered', D), T).status).toBe('mastered');
  });

  it('ticking the first step moves a topic to in progress', () => {
    expect(getTopic(toggleCheck(EMPTY, T, 0, D), T).status).toBe('in-progress');
  });

  it('unticking a step demotes a mastered topic to in progress', () => {
    const mastered = setStatus(tickAll(EMPTY), T, 'mastered', D);
    expect(getTopic(toggleCheck(mastered, T, 3, D), T).status).toBe('in-progress');
  });

  it('records the date and the mode that worked', () => {
    const d = setMode(toggleCheck(EMPTY, T, 0, D), T, 'Visual', D);
    expect(getTopic(d, T)).toMatchObject({ mode: 'Visual', updated: D });
    expect(getTopic(setMode(d, T, undefined, D), T).mode).toBeUndefined();
  });

  it('ignores out-of-range checklist indexes and never mutates its input', () => {
    expect(toggleCheck(EMPTY, T, 99, D)).toBe(EMPTY);
    const before = serialize(EMPTY);
    tickAll(EMPTY);
    expect(serialize(EMPTY)).toBe(before);
  });

  it('summary counts mastered and in-progress topics', () => {
    let d = setStatus(tickAll(EMPTY, 'a'), 'a', 'mastered', D);
    d = toggleCheck(d, 'b', 0, D);
    expect(summary(d, ['a', 'b', 'c'])).toEqual({ total: 3, mastered: 1, inProgress: 1 });
  });
});

describe('mock scores and mistakes', () => {
  it('clamps scores to 0–50 in half marks', () => {
    expect([clampScore(-3), clampScore(51), clampScore(37.3), clampScore(NaN)]).toEqual([0, 50, 37.5, 0]);
  });

  it('adds and removes mock scores', () => {
    const d = addMock(EMPTY, { paper: 'A', score: 44, weak: ' Q3a ', date: D }, 'm1');
    expect(d.mocks).toEqual([{ id: 'm1', paper: 'A', score: 44, weak: 'Q3a', date: D }]);
    expect(removeMock(d, 'm1').mocks).toEqual([]);
  });

  it('adds and removes mistakes', () => {
    const d = addMistake(EMPTY, { topic: '6', what: ' n0 first ', why: 'x', fix: 'c first', date: D }, 'x1');
    expect(d.mistakes[0]).toMatchObject({ id: 'x1', what: 'n0 first' });
    expect(removeMistake(d, 'x1').mistakes).toEqual([]);
  });
});

describe('export / import', () => {
  const full = addMistake(
    addMock(setMode(setStatus(tickAll(EMPTY), T, 'mastered', D), T, 'Worked example', D), { paper: 'B', score: 39, weak: 'Q2b', date: D }, 'm'),
    { topic: '4', what: 'off by one', why: 'i = 0', fix: 'trace it', date: D },
    'k',
  );

  it('round-trips an export exactly', () => {
    const result = parseImport(serialize(full));
    expect(result).toEqual({ ok: true, data: full });
  });

  it.each([
    ['not JSON', 'hello'],
    ['an array', '[]'],
    ['the wrong version', JSON.stringify({ ...full, version: 2 })],
    ['missing lists', JSON.stringify({ version: 1, topics: {} })],
    ['an unknown status', JSON.stringify({ ...full, topics: { [T]: { status: 'genius', checks: CHECKS.map(() => true) } } })],
    ['a short checklist', JSON.stringify({ ...full, topics: { [T]: { status: 'in-progress', checks: [true] } } })],
    ['a bad paper', JSON.stringify({ ...full, mocks: [{ paper: 'C', score: 1 }] })],
    ['a weird topic key', JSON.stringify({ ...full, topics: { '../../x': getTopic(EMPTY, T) } })],
  ])('rejects %s', (_, text) => {
    const r = parseImport(text);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.length).toBeGreaterThan(5);
  });

  it('downgrades a "mastered" topic whose checklist is incomplete', () => {
    const forged = { ...full, topics: { [T]: { status: 'mastered', checks: [true, false, false, false, false, false] } } };
    const r = parseImport(JSON.stringify(forged));
    expect(r.ok && r.data.topics[T].status).toBe('in-progress');
  });

  it('drops unknown fields and clamps imported scores', () => {
    const r = parseImport(
      JSON.stringify({ ...full, extra: 'x', mocks: [{ id: 'm', date: D, paper: 'A', score: 99, weak: '', evil: true }] }),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).not.toHaveProperty('extra');
      expect(r.data.mocks[0]).toEqual({ id: 'm', date: D, paper: 'A', score: 50, weak: '' });
    }
  });
});
