# Cheatsheet

One page, every formula. If something here is unclear, follow the link to its topic.

## Logs & exponents · [Topic 0](topics/00-math-toolkit.md)

| | |
|---|---|
| $\log_b x = y \iff b^y = x$ | $\log_b(xy) = \log_b x + \log_b y$ |
| $\log_b(x/y) = \log_b x - \log_b y$ | $\log_b x^a = a\log_b x$ |
| $b^{\log_b x} = x$ | $\log_c x = \log_b x / \log_b c$ |
| $a^{\log_b c} = c^{\log_b a}$ | $\log_2(n/2) = \log_2 n - 1$ |
| $2^{10} \approx 10^3$ | $\log_2 10^6 \approx 20$ |

## Sums · [Topic 0](topics/00-math-toolkit.md)

| Sum | Closed form | Θ |
|---|---|---|
| $\sum_{i=1}^n 1$ | $n$ | $n$ |
| $\sum_{i=1}^n i$ | $\frac{n(n+1)}{2}$ | $n^2$ |
| $\sum_{i=1}^n i^2$ | $\frac{n(n+1)(2n+1)}{6}$ | $n^3$ |
| $\sum_{i=0}^k 2^i$ | $2^{k+1} - 1$ | last term |
| $\sum_{i=0}^k r^i$ ($r \ne 1$) | $\frac{r^{k+1} - 1}{r - 1}$ | |
| $\sum_{i=0}^\infty r^i$ ($r < 1$) | $\frac{1}{1-r}$ | constant |
| $\sum_{i=1}^n \frac1i$ | $\approx \ln n$ | $\log n$ |

## Proof templates · [Topic 2](topics/02-proof-techniques.md), [Topic 3](topics/03-correctness.md)

- **Induction:** base case → hypothesis $S(k)$ → prove $S(k+1)$ by writing it as "$S(k)$ + new piece".
- **Contradiction:** assume the opposite → derive something impossible → so the claim holds.
- **Contraposition:** to prove $P \Rightarrow Q$, prove $\neg Q \Rightarrow \neg P$.
- **Loop invariant:** Initialization · Maintenance · Termination (substitute the exit value, e.g. $i = n + 1$).
- **Correctness** = partial correctness + termination.

## Algorithms · [Topic 4](topics/04-insertion-sort.md), [Topic 7](topics/07-divide-and-conquer.md)

| | Best | Worst | Extra space | Stable |
|---|---|---|---|---|
| Insertion sort | $\Theta(n)$ sorted | $\Theta(n^2)$ reverse | $\Theta(1)$ | yes |
| Merge sort | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n)$ | yes |
| Binary search | $\Theta(1)$ | $\Theta(\log n)$ | $\Theta(1)$ iterative | — |

- Insertion sort worst case: shifts $= \frac{n(n-1)}{2}$. Shifts = number of inversions.
- Merging lists of sizes $p$ and $q$: at most $p + q - 1$ comparisons.

## Loops · [Topic 5](topics/05-loop-analysis-and-space.md)

| Pattern | Θ |
|---|---|
| independent nested $n \times n$ | $n^2$ |
| `j ← 1 to i` inside `i ← 1 to n` | $n^2$ (≈ $n^2/2$) |
| counter doubles / halves | $\log n$ |
| halving outer, inner does $i$ work | $n$ |
| header `for i ← 1 to n` runs | $n + 1$ times |

## Asymptotics · [Topic 6](topics/06-asymptotic-notation.md)

- $f = O(g)$: $\exists c, n_0$ with $f(n) \le c\,g(n)$ for all $n \ge n_0$
- $f = \Omega(g)$: $\exists c, n_0$ with $f(n) \ge c\,g(n)$ for all $n \ge n_0$
- $f = \Theta(g)$: both, i.e. $c_1 g \le f \le c_2 g$
- $1 < \log n < \sqrt n < n < n\log n < n^2 < n^3 < 2^n < n! < n^n$
- Disprove $f = O(g)$: assume $c, n_0$ exist, derive $n \le$ constant, contradiction.

## Recurrences · [Topic 8](topics/08-recurrences.md)

For $T(n) = aT(n/b) + f(n)$: level $i$ has $a^i$ nodes of size $n/b^i$, there are $\log_b n + 1$ levels, and the leaves number $n^{\log_b a}$.

| Recurrence | Θ |
|---|---|
| $T(n/2) + 1$ | $\log n$ |
| $T(n/2) + n$ | $n$ |
| $2T(n/2) + 1$ | $n$ |
| $2T(n/2) + n$ | $n\log n$ |
| $2T(n/2) + n^2$ | $n^2$ |
| $4T(n/2) + n$ | $n^2$ |
| $T(n-1) + 1$ | $n$ |
| $T(n-1) + n$ | $n^2$ |
