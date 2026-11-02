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

/** Lomuto partition of a[p..r] (0-based) around a[r], as in the slides; returns the pivot's index. */
function partition(a: number[], p: number, r: number) {
  const x = a[r];
  let i = p - 1;
  let comparisons = 0;
  for (let j = p; j < r; j++) {
    comparisons++;
    if (a[j] <= x) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  [a[i + 1], a[r]] = [a[r], a[i + 1]];
  return { q: i + 1, comparisons };
}

function quicksortComparisons(input: number[]) {
  const a = [...input];
  let total = 0;
  const go = (p: number, r: number) => {
    if (p >= r) return;
    const { q, comparisons } = partition(a, p, r);
    total += comparisons;
    go(p, q - 1);
    go(q + 1, r);
  };
  go(0, a.length - 1);
  return { sorted: a, comparisons: total };
}

/** i-th smallest (1-based), always pivoting on the last element; records the pivot of each call. */
function select(input: number[], i: number) {
  const a = [...input];
  const pivots: number[] = [];
  let p = 0;
  let r = a.length - 1;
  for (;;) {
    if (p === r) return { value: a[p], pivots };
    const { q } = partition(a, p, r);
    pivots.push(a[q]);
    const k = q - p + 1;
    if (i === k) return { value: a[q], pivots };
    if (i < k) r = q - 1;
    else {
      i -= k;
      p = q + 1;
    }
  }
}

type Sub = { lo: number; hi: number; sum: number }; // 1-based, inclusive

function maxSubarrayBrute(a: number[]): Sub {
  let best: Sub = { lo: 1, hi: 1, sum: -Infinity };
  for (let i = 0; i < a.length; i++) {
    let s = 0;
    for (let j = i; j < a.length; j++) {
      s += a[j];
      if (s > best.sum) best = { lo: i + 1, hi: j + 1, sum: s };
    }
  }
  return best;
}

/** MaxCrossingSubarray from the slides (0-based arguments, 1-based result). */
function maxCrossing(a: number[], low: number, mid: number, high: number): Sub {
  let leftsum = -Infinity;
  let rightsum = -Infinity;
  let maxleft = mid;
  let maxright = mid + 1;
  let s = 0;
  for (let i = mid; i >= low; i--) {
    s += a[i];
    if (s > leftsum) [leftsum, maxleft] = [s, i];
  }
  s = 0;
  for (let j = mid + 1; j <= high; j++) {
    s += a[j];
    if (s > rightsum) [rightsum, maxright] = [s, j];
  }
  return { lo: maxleft + 1, hi: maxright + 1, sum: leftsum + rightsum };
}

/** MaxSubarray from the slides: ties prefer left, then right, then crossing. */
function maxSubarray(a: number[], low = 0, high = a.length - 1): Sub {
  if (low === high) return { lo: low + 1, hi: high + 1, sum: a[low] };
  const mid = Math.floor((low + high) / 2);
  const l = maxSubarray(a, low, mid);
  const r = maxSubarray(a, mid + 1, high);
  const x = maxCrossing(a, low, mid, high);
  if (l.sum >= r.sum && l.sum >= x.sum) return l;
  if (r.sum >= l.sum && r.sum >= x.sum) return r;
  return x;
}

describe('Topic 9: iteration and master method', () => {
  const note = read('topics/09-master-method.mdx');

  it('3T(n/4) + n with T(1) = 1 is exactly 4n − 3n^(log_4 3)', () => {
    const t = (n: number): number => (n === 1 ? 1 : 3 * t(n / 4) + n);
    for (let k = 0; k <= 10; k++) {
      const n = 4 ** k;
      expect(Math.abs(t(n) - (4 * n - 3 * n ** (Math.log(3) / Math.log(4))))).toBeLessThan(1e-6 * n);
    }
    expect(t(4)).toBe(7);
    expect(note).toContain('4n - 3n^{\\log_4 3}');
  });

  it('2T(n/2) + n with T(1) = 1 is exactly n + n log2 n', () => {
    const t = (n: number): number => (n === 1 ? 1 : 2 * t(n / 2) + n);
    for (let k = 0; k <= 20; k++) expect(t(2 ** k)).toBe(2 ** k + k * 2 ** k);
  });

  it('master-method examples match a direct evaluation (ratio settles to a constant)', () => {
    const ratio = (t: (n: number) => number, g: (n: number) => number) => [2 ** 12, 2 ** 16].map((n) => t(n) / g(n));
    const rec = (a: number, f: (n: number) => number) => {
      const t = (n: number): number => (n <= 1 ? 1 : a * t(n / 2) + f(n));
      return t;
    };
    for (const [a, f, g] of [
      [4, (n: number) => n, (n: number) => n * n],
      [4, (n: number) => n * n, (n: number) => n * n * Math.log2(n)],
      [4, (n: number) => n ** 3, (n: number) => n ** 3],
      [2, () => 1, (n: number) => n],
    ] as const) {
      const [r1, r2] = ratio(rec(a, f), g);
      expect(Math.abs(r1 - r2) / r2).toBeLessThan(0.1);
    }
  });
});

describe('Topic 10: partition, quicksort and selection', () => {
  const note = read('topics/10-quicksort-and-selection.mdx');

  it('partition [2,8,7,1,3,5,6,4] → [2,1,3,4,7,5,6,8], q = 4, 7 comparisons', () => {
    const a = [2, 8, 7, 1, 3, 5, 6, 4];
    const { q, comparisons } = partition(a, 0, 7);
    expect(a).toEqual([2, 1, 3, 4, 7, 5, 6, 8]);
    expect([q + 1, comparisons]).toEqual([4, 7]);
    expect(note).toContain('**7 comparisons**');
  });

  it('drill: partition [4,7,1,6,3,5] → [4,1,3,5,7,6], q = 4', () => {
    const a = [4, 7, 1, 6, 3, 5];
    const { q, comparisons } = partition(a, 0, 5);
    expect(a).toEqual([4, 1, 3, 5, 7, 6]);
    expect([q + 1, comparisons]).toEqual([4, 5]);
  });

  it('mastery: partition [5,3,8,1,9,2,7] → [5,3,1,2,7,8,9], q = 5, 6 comparisons; 3rd smallest is 3', () => {
    const a = [5, 3, 8, 1, 9, 2, 7];
    const { q, comparisons } = partition(a, 0, 6);
    expect(a).toEqual([5, 3, 1, 2, 7, 8, 9]);
    expect([q + 1, comparisons]).toEqual([5, 6]);
    expect(select([5, 3, 8, 1, 9, 2, 7], 3)).toEqual({ value: 3, pivots: [7, 2, 3] });
    expect(note).toContain('**6 comparisons**');
  });

  it('select agrees with sorting on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const n = 1 + (t % 15);
      const a = Array.from({ length: n }, (_, k) => (k * 7919 + t * 104729) % 97);
      const sorted = [...a].sort((x, y) => x - y);
      for (let i = 1; i <= n; i++) expect(select(a, i).value).toBe(sorted[i - 1]);
    }
  });

  it('quicksort on sorted input makes n(n−1)/2 comparisons', () => {
    for (let n = 1; n <= 40; n++) {
      const r = quicksortComparisons(Array.from({ length: n }, (_, k) => k));
      expect(r.comparisons).toBe((n * (n - 1)) / 2);
    }
    expect(quicksortComparisons([1, 2, 3, 4, 5]).comparisons).toBe(10);
  });

  it('median of medians: 3⌊n/10⌋ ≥ n/4 from n = 50, and 1/5 + 3/4 = 19/20', () => {
    for (let n = 50; n <= 5000; n++) expect(3 * Math.floor(n / 10)).toBeGreaterThanOrEqual(n / 4);
    expect(1 / 5 + 3 / 4).toBeCloseTo(19 / 20);
  });
});

describe('Topic 11: maximum subarray', () => {
  const note = read('topics/11-maximum-subarray.mdx');

  it('stock example: changes give A[8..11], sum 43', () => {
    const price = [100, 113, 110, 85, 105, 102, 86, 63, 81, 101, 94, 106];
    const change = price.slice(1).map((p, d) => p - price[d]);
    expect(change).toEqual([13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12]);
    expect(maxSubarray(change)).toEqual({ lo: 8, hi: 11, sum: 43 });
    expect(note).toContain('**`A[8..11]`, sum 43**');
  });

  it('lecture examples 1 and 2', () => {
    expect(maxSubarray([1, -4, 3, -4])).toEqual({ lo: 3, hi: 3, sum: 3 });
    expect(maxSubarray([1, -4, 3, 4, -2, 6])).toEqual({ lo: 3, hi: 6, sum: 11 });
  });

  it('worked example [−2,1,−3,4,−1,2,1,−5]: crossing A[4..7] = 6 wins', () => {
    const a = [-2, 1, -3, 4, -1, 2, 1, -5];
    expect(maxSubarray(a.slice(0, 4))).toEqual({ lo: 4, hi: 4, sum: 4 });
    expect(maxSubarray(a.slice(4)).sum).toBe(3);
    expect(maxCrossing(a, 0, 3, 7)).toEqual({ lo: 4, hi: 7, sum: 6 });
    expect(maxSubarray(a)).toEqual({ lo: 4, hi: 7, sum: 6 });
  });

  it('drill 3 and mastery answers', () => {
    expect(maxCrossing([2, -1, -2, 3, 1, -4, 5], 0, 3, 6)).toEqual({ lo: 4, hi: 7, sum: 5 });
    const m = [3, -5, 4, -1, 2, -6, 5, 1];
    expect(maxSubarray(m.slice(0, 4))).toEqual({ lo: 3, hi: 3, sum: 4 });
    expect(maxSubarray(m.slice(4)).sum).toBe(6);
    expect(maxCrossing(m, 0, 3, 7)).toEqual({ lo: 3, hi: 5, sum: 5 });
    expect(maxSubarray(m)).toEqual({ lo: 7, hi: 8, sum: 6 });
  });

  it('divide & conquer agrees with brute force on random arrays', () => {
    for (let t = 0; t < 300; t++) {
      const n = 1 + (t % 20);
      const a = Array.from({ length: n }, (_, k) => ((k * 37 + t * 101) % 41) - 20);
      expect(maxSubarray(a).sum).toBe(maxSubarrayBrute(a).sum);
    }
  });
});

type Adj = Record<string, string[]>;

/** BFS as in the slides: mark on enqueue, record pred and distance; also logs the queue after each dequeue. */
function bfs(adj: Adj, s: string) {
  const pred: Record<string, string | null> = {};
  const d: Record<string, number> = {};
  const order: string[] = [];
  const queues: string[][] = [];
  for (const v of Object.keys(adj)) d[v] = Infinity;
  pred[s] = null;
  d[s] = 0;
  const q = [s];
  while (q.length) {
    const v = q.shift()!;
    order.push(v);
    for (const w of adj[v])
      if (d[w] === Infinity) {
        d[w] = d[v] + 1;
        pred[w] = v;
        q.push(w);
      }
    queues.push([...q]);
  }
  return { pred, d, order, queues };
}

function path(pred: Record<string, string | null>, v: string) {
  const out = [v];
  while (pred[v] != null) out.unshift((v = pred[v]!));
  return out.join('→');
}

/** DFS(G) from the slides: vertices in key order, lists in the given order; classifies every edge. */
function dfs(adj: Adj) {
  let time = 0;
  const color: Record<string, 'W' | 'G' | 'B'> = {};
  const d: Record<string, number> = {};
  const f: Record<string, number> = {};
  const edges: Record<string, 'T' | 'B' | 'F' | 'C'> = {};
  for (const u of Object.keys(adj)) color[u] = 'W';
  const visit = (u: string) => {
    color[u] = 'G';
    d[u] = ++time;
    for (const v of adj[u]) {
      if (color[v] === 'W') {
        edges[`${u}→${v}`] = 'T';
        visit(v);
      } else edges[`${u}→${v}`] = color[v] === 'G' ? 'B' : d[u] < d[v] ? 'F' : 'C';
    }
    color[u] = 'B';
    f[u] = ++time;
  };
  for (const u of Object.keys(adj)) if (color[u] === 'W') visit(u);
  const times = Object.fromEntries(Object.keys(adj).map((v) => [v, `${d[v]}/${f[v]}`]));
  const topo = Object.keys(adj).sort((a, b) => f[b] - f[a]);
  return { times, edges, topo };
}

function undirected(n: number, edges: [number, number][]): Adj {
  const adj: Adj = {};
  for (let v = 1; v <= n; v++) adj[v] = [];
  for (const [u, v] of edges) adj[u].push(String(v)), adj[v].push(String(u));
  for (const v of Object.keys(adj)) adj[v].sort((a, b) => Number(a) - Number(b));
  return adj;
}

const LECTURE_GRAPH: [number, number][] = [[1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [3, 7], [3, 8], [4, 5], [5, 6], [7, 8]];

describe('Topic 12: graphs and BFS', () => {
  const note = read('topics/12-graphs-and-bfs.mdx');
  const slides: Adj = {
    0: ['8'], 1: ['3', '7', '9', '2'], 2: ['8', '1', '4'], 3: ['4', '5', '1'], 4: ['2', '3'],
    5: ['3', '6'], 6: ['7', '5'], 7: ['1', '6'], 8: ['2', '0', '9'], 9: ['1', '8'],
  };

  it('10-node trace from 2: queue after each dequeue', () => {
    const r = bfs(slides, '2');
    expect(r.order).toEqual(['2', '8', '1', '4', '0', '9', '3', '7', '5', '6']);
    expect(r.queues.map((q) => q.join(' '))).toEqual(['8 1 4', '1 4 0 9', '4 0 9 3 7', '0 9 3 7', '9 3 7', '3 7', '7 5', '5 6', '6', '']);
  });

  it('pred and d tables and the reported paths', () => {
    const r = bfs(slides, '2');
    const digits = '0123456789'.split('');
    expect(digits.map((v) => r.pred[v] ?? '–').join(' ')).toBe('8 2 – 1 2 3 7 1 2 8');
    expect(digits.map((v) => r.d[v]).join(' ')).toBe('2 1 0 2 1 3 3 2 1 2');
    expect([path(r.pred, '6'), path(r.pred, '0'), path(r.pred, '1'), path(r.pred, '5')]).toEqual(['2→1→7→6', '2→8→0', '2→1', '2→1→3→5']);
    expect(note).toContain('**2 → 1 → 7 → 6**');
  });

  it('lecture 8-node graph: m = 11, degree sum 22, layers and mastery answers', () => {
    const g = undirected(8, LECTURE_GRAPH);
    expect(Object.values(g).reduce((s, l) => s + l.length, 0)).toBe(22);
    const r = bfs(g, '1');
    expect(r.order).toEqual(['1', '2', '3', '4', '5', '7', '8', '6']);
    expect(Object.keys(g).map((v) => r.d[v])).toEqual([0, 1, 1, 2, 2, 3, 2, 2]);
    const tree = new Set(Object.entries(r.pred).filter(([, p]) => p).map(([v, p]) => [Number(p), Number(v)].sort((a, b) => a - b).join('-')));
    expect(tree.size).toBe(7);
    expect(LECTURE_GRAPH.map((e) => e.join('-')).filter((e) => !tree.has(e))).toEqual(['2-3', '3-5', '4-5', '7-8']);
    expect(note).toContain('**1, 2, 3, 4, 5, 7, 8, 6**');
  });
});

describe('Topic 13: DFS and topological sort', () => {
  const note = read('topics/13-dfs-and-topological-sort.mdx');

  it('lecture trace on u..z: times and edge classes', () => {
    const r = dfs({ u: ['v', 'x'], v: ['y'], w: ['y', 'z'], x: ['v'], y: ['x'], z: ['z'] });
    expect(r.times).toEqual({ u: '1/8', v: '2/7', w: '9/12', x: '4/5', y: '3/6', z: '10/11' });
    expect(r.edges).toEqual({ 'u→v': 'T', 'v→y': 'T', 'y→x': 'T', 'x→v': 'B', 'u→x': 'F', 'w→y': 'C', 'w→z': 'T', 'z→z': 'B' });
  });

  it('homework DAG: times and topological order', () => {
    const r = dfs({
      m: ['q', 'r', 'x'], n: ['o', 'q', 'u'], o: ['r', 's', 'v'], p: ['o', 's', 'z'], q: ['t'], r: ['u', 'y'], s: ['r'],
      t: [], u: ['t'], v: ['w', 'x'], w: ['z'], x: [], y: ['v'], z: [],
    });
    expect(r.topo.join(', ')).toBe('p, n, o, s, m, r, y, v, x, w, z, u, q, t');
    expect(Object.values(r.edges)).not.toContain('B');
    expect(r.times.m).toBe('1/20');
    expect(r.times.p).toBe('27/28');
    expect(note).toContain('**p, n, o, s, m, r, y, v, x, w, z, u, q, t**');
  });

  it('course-plan DAG (visual + mastery)', () => {
    const r = dfs({ Math: ['DS', 'Discrete'], DS: ['Algo', 'DB'], Discrete: ['Algo'], Algo: ['Graphs'], Graphs: [], DB: [] });
    expect(r.times).toEqual({ Math: '1/12', DS: '2/9', Discrete: '10/11', Algo: '3/6', Graphs: '4/5', DB: '7/8' });
    expect(r.edges['Discrete→Algo']).toBe('C');
    expect(r.topo).toEqual(['Math', 'Discrete', 'DS', 'DB', 'Algo', 'Graphs']);
  });

  it('drill 2: a..e with a cycle', () => {
    const r = dfs({ a: ['b', 'd'], b: ['c'], c: ['a', 'd'], d: [], e: ['c', 'd'] });
    expect(r.times).toEqual({ a: '1/8', b: '2/7', c: '3/6', d: '4/5', e: '9/10' });
    expect(r.edges).toEqual({ 'a→b': 'T', 'b→c': 'T', 'c→a': 'B', 'c→d': 'T', 'a→d': 'F', 'e→c': 'C', 'e→d': 'C' });
  });

  it('drill 3: the getting-dressed order respects every arc', () => {
    const order = ['socks', 'trousers', 'shoes', 'shirt', 'belt', 'tie', 'jacket'];
    const arcs = [['shirt', 'tie'], ['tie', 'jacket'], ['trousers', 'shoes'], ['trousers', 'belt'], ['belt', 'jacket'], ['socks', 'shoes']];
    for (const [a, b] of arcs) expect(order.indexOf(a)).toBeLessThan(order.indexOf(b));
  });
});
