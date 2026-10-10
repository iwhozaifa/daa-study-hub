# Which technique?

Exam questions rarely name the method. Use this page to go from **what the question looks like** to
**what to do**. It grows as the course continues (greedy, DP and graphs get added when we reach them).

## "Analyse this…" questions

| If the question shows… | Do this | Topic |
|---|---|---|
| loops with fixed bounds | multiply the loop sizes (inside-out) | [5](topics/05-loop-analysis-and-space.md) |
| an inner loop bound that depends on the outer variable | write the sum, use a closed form | [0](topics/00-math-toolkit.md), [5](topics/05-loop-analysis-and-space.md) |
| a counter that doubles/halves | $\log n$ iterations | [5](topics/05-loop-analysis-and-space.md) |
| a function that calls itself | write the recurrence $T(n) = \dots$ | [8](topics/08-recurrences.md) |
| $T(n) = aT(n/b) + f(n)$ | recursion tree → equal / shrinking / growing levels | [8](topics/08-recurrences.md) |
| $T(n) = T(n-1) + \dots$ | expansion (unroll), then a sum | [8](topics/08-recurrences.md) |
| "prove $T(n) = O(\dots)$" for a recurrence | guess from the tree, then induction (substitution) | [8](topics/08-recurrences.md) |
| "best / worst case" | find the input that makes the inner loop shortest / longest | [4](topics/04-insertion-sort.md) |

## "Prove…" questions

| If the question says… | Use | Topic |
|---|---|---|
| "show $f(n) = O/\Omega/\Theta(g(n))$" | find explicit $c$ ($c_1, c_2$) and $n_0$ | [6](topics/06-asymptotic-notation.md) |
| "show $f(n) \ne O(g(n))$" | contradiction: get $n \le$ constant | [6](topics/06-asymptotic-notation.md) |
| "prove this loop algorithm is correct" | loop invariant: Init / Maintenance / Termination | [3](topics/03-correctness.md) |
| "prove this recursive algorithm is correct" | induction on $n$ | [3](topics/03-correctness.md) |
| "prove for all $n \ge 1$" (a sum or formula) | induction | [2](topics/02-proof-techniques.md) |
| "there is no…" / "impossible" | contradiction | [2](topics/02-proof-techniques.md) |
| "if P then Q" where "not Q" is concrete | contraposition | [2](topics/02-proof-techniques.md) |

## "Design an algorithm…" questions (strategy picker)

| Problem smell | Try first | Notes |
|---|---|---|
| small input, or you just need *something correct* | **Brute force** | try every possibility; often $n^2$, $n^3$ or $2^n$ |
| splits into independent halves that combine cheaply | **Divide & conquer** | e.g. merge sort, binary search; write the recurrence |
| "build the answer one element at a time, keeping it valid" | **Incremental** | e.g. insertion sort; prove with a loop invariant |
| a locally best choice seems to never hurt | **Greedy** | *coming later in the course* |
| subproblems overlap / repeat | **Dynamic programming** | *coming later in the course* |
| networks, routes, connections | **Graph algorithms** | *coming later in the course* |

**Assignment write-ups** (per the course rules, Intro Slide 19) need: a plain-English description,
a worked example, a correctness argument and a running-time analysis. Each topic page models all four.
