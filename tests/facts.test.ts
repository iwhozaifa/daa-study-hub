// Recomputes the numbers the notes claim (traces, counts, sums, c/n0 constants) with small reference
// implementations, and checks the note still states that number. A wrong worked example fails the build.
import { describe, expect, it } from 'vitest';
import { read } from './helpers';

/** Insertion sort as in the slides: count shifts and key comparisons (A[i] > key checks). */
function insertionSort(input: number[]) {
  const a = [...input];
  let shifts = 0;
  let comparisons = 0;
  const passes: number[][] = [];
  for (let j = 1; j < a.length; j++) {
    const key = a[j];
    let i = j - 1;
    while (i >= 0) {
      comparisons++;
      if (a[i] <= key) break;
      a[i + 1] = a[i];
      shifts++;
      i--;
    }
    a[i + 1] = key;
    passes.push([...a]);
  }
  return { sorted: a, shifts, comparisons, passes };
}

function merge(left: number[], right: number[]) {
  const out: number[] = [];
  let i = 0;
  let j = 0;
  let comparisons = 0;
  while (i < left.length && j < right.length) {
    comparisons++;
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return { out: [...out, ...left.slice(i), ...right.slice(j)], comparisons };
}

/** Top-down merge sort; the left half gets the extra element on odd sizes. */
function mergeSort(a: number[]): { out: number[]; comparisons: number } {
  if (a.length <= 1) return { out: a, comparisons: 0 };
  const mid = Math.ceil(a.length / 2);
  const l = mergeSort(a.slice(0, mid));
  const r = mergeSort(a.slice(mid));
  const m = merge(l.out, r.out);
  return { out: m.out, comparisons: l.comparisons + r.comparisons + m.comparisons };
}

const sum = (from: number, to: number, f: (i: number) => number) => {
  let s = 0;
  for (let i = from; i <= to; i++) s += f(i);
  return s;
};

/** Checks lo(n) <= f(n) <= hi(n) for n0 <= n <= 2000 (a numeric sanity check of a c/n0 proof). */
function holdsFrom(n0: number, lo: (n: number) => number, f: (n: number) => number, hi: (n: number) => number) {
  for (let n = n0; n <= 2000; n++) if (!(lo(n) <= f(n) && f(n) <= hi(n))) return false;
  return true;
}

const inf = () => Infinity;
const zero = () => -Infinity;

describe('Topic 4: insertion sort traces', () => {
  const note = read('topics/04-insertion-sort.mdx');

  it('[7,3,9,1,5]: 6 shifts and 8 key comparisons', () => {
    const r = insertionSort([7, 3, 9, 1, 5]);
    expect([r.shifts, r.comparisons]).toEqual([6, 8]);
    expect(note).toContain('**6 shifts** and **8 key comparisons**');
  });

  it('shifts equal inversions', () => {
    const a = [7, 3, 9, 1, 5];
    let inversions = 0;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) inversions++;
    expect(inversions).toBe(insertionSort(a).shifts);
  });

  it('drill and mastery answers', () => {
    expect(insertionSort([2, 8, 5, 3]).shifts).toBe(3);
    expect(insertionSort([4, 1, 3, 2]).shifts).toBe(4);
    expect(insertionSort([4, 1, 3, 2]).passes).toEqual([
      [1, 4, 3, 2],
      [1, 3, 4, 2],
      [1, 2, 3, 4],
    ]);
    expect(insertionSort([5, 4, 3, 2, 1]).shifts).toBe(10);
    expect(insertionSort([6, 5, 4, 3, 2, 1]).shifts).toBe(15);
    expect(note).toContain('**4 shifts**');
  });

  it('worst case is n(n-1)/2 shifts', () => {
    for (let n = 1; n <= 30; n++) {
      const reversed = Array.from({ length: n }, (_, i) => n - i);
      expect(insertionSort(reversed).shifts).toBe((n * (n - 1)) / 2);
    }
  });
});

describe('Topic 7: merge sort traces', () => {
  const note = read('topics/07-divide-and-conquer.mdx');

  it('[6,2,9,4,1,7,3,8]: 17 comparisons', () => {
    const r = mergeSort([6, 2, 9, 4, 1, 7, 3, 8]);
    expect(r.out).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
    expect(r.comparisons).toBe(17);
    expect(note).toContain('Total **17 comparisons**');
  });

  it('mastery [5,1,4,2,8,3]: 11 comparisons', () => {
    expect(mergeSort([5, 1, 4, 2, 8, 3]).comparisons).toBe(11);
    expect(note).toContain('**Total 11 comparisons.**');
  });

  it('merging lists of size 4 and 6 takes 4 to 9 comparisons', () => {
    expect(merge([1, 2, 3, 4], [5, 6, 7, 8, 9, 10]).comparisons).toBe(4);
    expect(merge([1, 3, 5, 7], [2, 4, 6, 8, 9, 10]).comparisons).toBeLessThanOrEqual(9);
    expect(merge([2, 4, 6, 8], [1, 3, 5, 7, 9, 10]).comparisons).toBe(8);
    expect(merge([3, 5, 7, 11], [1, 2, 4, 6, 8, 10]).comparisons).toBe(9);
  });
});

describe('Topic 6: c and n0 constants hold', () => {
  it('3n + 7 <= 4n exactly from n0 = 7', () => {
    expect(holdsFrom(7, zero, (n) => 3 * n + 7, (n) => 4 * n)).toBe(true);
    expect(3 * 6 + 7 <= 4 * 6).toBe(false);
  });
  it('4n² <= 5n² - 3n + 2 <= 7n² from n0 = 1', () => {
    expect(holdsFrom(1, (n) => 4 * n * n, (n) => 5 * n * n - 3 * n + 2, (n) => 7 * n * n)).toBe(true);
  });
  it('n²/2 - 5 >= n²/4 from n0 = 5', () => {
    expect(holdsFrom(5, (n) => (n * n) / 4, (n) => (n * n) / 2 - 5, inf)).toBe(true);
    expect((4 * 4) / 2 - 5 >= (4 * 4) / 4).toBe(false);
  });
  it('mastery: 4n³ <= 4n³ + 10n² + 5 <= 19n³ from n0 = 1', () => {
    expect(holdsFrom(1, (n) => 4 * n ** 3, (n) => 4 * n ** 3 + 10 * n ** 2 + 5, (n) => 19 * n ** 3)).toBe(true);
  });
});

describe('Mock midterm A answers', () => {
  it('Q1 logs and sums', () => {
    for (const n of [1, 2, 10, 1000]) expect(Math.log2(32 * n ** 4)).toBeCloseTo(5 + 4 * Math.log2(n));
    for (let n = 1; n <= 50; n++) expect(sum(1, n, (i) => 4 * i + 1)).toBe(2 * n * n + 3 * n);
    expect(1 + 3 + 9 + 27 + 81).toBe((3 ** 5 - 1) / 2);
    expect((3 ** 5 - 1) / 2).toBe(121);
  });
  it('Q2 triple loop runs 5n(n+1) times', () => {
    for (let n = 1; n <= 25; n++) {
      let x = 0;
      for (let i = 1; i <= n; i++) for (let j = i; j <= n; j++) for (let k = 1; k <= 10; k++) x++;
      expect(x).toBe(5 * n * (n + 1));
    }
  });
  it('Q3a c1 = 6, c2 = 10, n0 = 3 (and n0 = 2 is too small)', () => {
    const f = (n: number) => 6 * n * n + 4 * n - 10;
    expect(holdsFrom(3, (n) => 6 * n * n, f, (n) => 10 * n * n)).toBe(true);
    expect(f(2) >= 6 * 4).toBe(false);
  });
  it('Q4 trace of [6,2,8,1,4]', () => {
    const r = insertionSort([6, 2, 8, 1, 4]);
    expect(r.passes).toEqual([
      [2, 6, 8, 1, 4],
      [2, 6, 8, 1, 4],
      [1, 2, 6, 8, 4],
      [1, 2, 4, 6, 8],
    ]);
    expect(r.shifts).toBe(6);
  });
  it('Q6 sum of i·2^i = (n-1)2^(n+1) + 2', () => {
    for (let n = 1; n <= 30; n++) expect(sum(1, n, (i) => i * 2 ** i)).toBe((n - 1) * 2 ** (n + 1) + 2);
  });
  it('Q7a merging [3,5,9] and [2,4,10,11] takes 5 comparisons', () => {
    const m = merge([3, 5, 9], [2, 4, 10, 11]);
    expect(m.out).toEqual([2, 3, 4, 5, 9, 10, 11]);
    expect(m.comparisons).toBe(5);
  });
});

describe('Mock midterm B answers', () => {
  it('Q1 logs and sums', () => {
    for (const n of [1, 3, 9, 100]) expect(Math.log(81 * n * n) / Math.log(3)).toBeCloseTo(4 + 2 * (Math.log(n) / Math.log(3)));
    for (let n = 1; n <= 50; n++) expect(sum(1, n, (i) => 2 * i - 1)).toBe(n * n);
    expect(sum(0, 6, (i) => 2 ** i)).toBe(127);
  });
  it('Q2 halving loop: 30 steps for n = 16 and under 2n in general', () => {
    const steps = (n: number) => {
      let c = 0;
      for (let i = n; i > 1; i = Math.floor(i / 2)) c += i;
      return c;
    };
    expect(steps(16)).toBe(30);
    for (let n = 2; n <= 5000; n++) {
      expect(steps(n)).toBeGreaterThanOrEqual(n);
      expect(steps(n)).toBeLessThan(2 * n);
    }
  });
  it('Q3a c1 = 1, c2 = 3, n0 = 5 (fails at n = 4)', () => {
    const f = (n: number) => 2 * n ** 3 - 5 * n ** 2 + 1;
    expect(holdsFrom(5, (n) => n ** 3, f, (n) => 3 * n ** 3)).toBe(true);
    expect(f(4) >= 4 ** 3).toBe(false);
  });
  it('Q4 [4,9,2,7,1]: 7 shifts and 9 comparisons', () => {
    const r = insertionSort([4, 9, 2, 7, 1]);
    expect([r.shifts, r.comparisons]).toEqual([7, 9]);
    expect(read('practice/mock-midterm-b.mdx')).toContain('**7 shifts, 9 comparisons.**');
  });
  it('Q6 3 divides n³ + 2n', () => {
    for (let n = 1; n <= 1000; n++) expect((n ** 3 + 2 * n) % 3).toBe(0);
  });
  it('Q7 recurrences', () => {
    const a = (n: number): number => (n === 1 ? 1 : a(n - 1) + n);
    const b = (n: number): number => (n === 1 ? 1 : 2 * b(n / 2) + 1);
    const c = (n: number): number => (n === 1 ? 1 : c(n / 2) + n);
    for (let n = 1; n <= 200; n++) expect(a(n)).toBe((n * (n + 1)) / 2);
    for (let k = 0; k <= 20; k++) {
      expect(b(2 ** k)).toBe(2 * 2 ** k - 1);
      expect(c(2 ** k)).toBeLessThanOrEqual(2 * 2 ** k);
    }
  });
});
