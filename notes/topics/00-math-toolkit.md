# 0 · Math toolkit: logs, exponents, sums

!!! abstract "In one sentence"
    Algorithm analysis keeps asking two questions: **"how many times can I halve this?"** (that's a
    logarithm) and **"what do all these loop steps add up to?"** (that's a sum). This page gives you the
    handful of rules that answer both.

## Everyday analogy

- **Logarithm = the "how many folds" number.** Fold a 64-page newspaper in half, again and again, until
  one page is left. You fold it 6 times, so $\log_2 64 = 6$. A log counts *how many halvings* (or
  doublings) it takes.
- **Sum = the till receipt.** Each loop iteration adds an item to the bill. The closed-form formula is
  the total printed at the bottom, so you don't have to add the items one by one.

## Key rules

| Rule | Formula | Plain words |
|---|---|---|
| Definition | $\log_b x = y \iff b^y = x$ | "What power of $b$ gives $x$?" |
| Product | $\log_b(xy) = \log_b x + \log_b y$ | multiply inside → add outside |
| Quotient | $\log_b(x/y) = \log_b x - \log_b y$ | divide inside → subtract outside |
| Power | $\log_b(x^a) = a\log_b x$ | exponent jumps out to the front |
| Undo | $b^{\log_b x} = x$ | a power and a log cancel |
| Change base | $\log_c x = \dfrac{\log_b x}{\log_b c}$ | all logs differ only by a constant |
| Swap trick | $a^{\log_b c} = c^{\log_b a}$ | handy in recurrences |
| Exponents | $2^a\cdot 2^b = 2^{a+b}$, $(2^a)^b = 2^{ab}$ | |
| Arithmetic sum | $\sum_{i=1}^{n} i = \dfrac{n(n+1)}{2}$ | $\Theta(n^2)$ |
| Squares | $\sum_{i=1}^{n} i^2 = \dfrac{n(n+1)(2n+1)}{6}$ | $\Theta(n^3)$ |
| Geometric ($r\ne1$) | $\sum_{i=0}^{k} r^i = \dfrac{r^{k+1}-1}{r-1}$ | |
| Powers of 2 | $\sum_{i=0}^{k} 2^i = 2^{k+1}-1$ | "the next power, minus one" |
| Shrinking geometric ($0<r<1$) | $\sum_{i=0}^{\infty} r^i = \dfrac{1}{1-r}$ | a constant |
| Harmonic | $\sum_{i=1}^{n} \dfrac1i \approx \ln n$ | $\Theta(\log n)$ |
| Constant | $\sum_{i=1}^{n} c = cn$ | |

Notation in this course: $\lg n = \log_2 n$, $\ln n = \log_e n$. In Big-O the base doesn't matter (change-base rule).

---

=== "Visual"

    **Logs as halving: the staircase**

    | Step | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
    |---|---|---|---|---|---|---|---|
    | Size | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

    6 halvings reach 1, so $\log_2 64 = 6$. Double $n$ and you add just **one** step. That's why $\log n$ grows so slowly.

    | $n$ | 8 | 1 024 | 1 048 576 (≈ a million) | ≈ a billion |
    |---|---|---|---|---|
    | $\log_2 n$ | 3 | 10 | 20 | 30 |

    **Gauss's pairing trick for $1+2+\dots+n$ (here $n = 8$)**

    ```
     1   2   3   4
     8   7   6   5      ← same numbers written backwards
    ---------------
     9   9   9   9      ← every pair sums to n+1
    ```
    4 pairs × 9 = 36 = $\frac{8\cdot 9}{2}$. In general, $n/2$ pairs of $(n+1)$ give $\frac{n(n+1)}{2}$.

    **Powers of 2: each term beats everything before it**

    ```
    1 + 2 + 4 + 8 = 15        next term = 16 = 15 + 1
    ■ ■■ ■■■■ ■■■■■■■■
    ```
    So $1 + 2 + \dots + 2^k = 2^{k+1}-1$. The **largest term dominates**: the total is less than twice the last term.

    ```mermaid
    flowchart LR
      A["n = 16"] -->|"/2"| B["8"] -->|"/2"| C["4"] -->|"/2"| D["2"] -->|"/2"| E["1"]
      E -.->|"4 arrows = log₂16"| A
    ```

=== "Worked example"

    **Problem.** Simplify $\log_2(8n^3)$ and find $\sum_{i=1}^{n}(2i+3)$.

    **Part 1: the log**

    1. Split the product: $\log_2(8n^3) = \log_2 8 + \log_2 n^3$.
    2. $\log_2 8 = 3$ because $2^3 = 8$.
    3. Power rule: $\log_2 n^3 = 3\log_2 n$.
    4. Answer: $3 + 3\log_2 n$, which is $\Theta(\log n)$.

    **Part 2: the sum.** Break it into pieces you already know.

    $$\sum_{i=1}^{n}(2i+3) = 2\sum_{i=1}^{n} i + \sum_{i=1}^{n} 3 = 2\cdot\frac{n(n+1)}{2} + 3n = n^2 + 4n$$

    **Check with $n = 3$:** $5 + 7 + 9 = 21$ and $3^2 + 4\cdot3 = 21$ ✓

    **Rule you just used:** a sum of a (constant × term + constant) splits into separate sums, and constants come out front.

=== "Guided questions"

    Try each one before opening the answer.

    **Q1.** What is $\log_2 32$?

    ??? tip "Hint"
        How many times do you multiply 2 by itself to reach 32?

    ??? success "Answer"
        $2^5 = 32$, so **5**.

    **Q2.** Is $\log_2(8 + 8)$ equal to $\log_2 8 + \log_2 8$?

    ??? tip "Hint"
        Work out both sides as numbers.

    ??? success "Answer"
        No. The left side is $\log_2 16 = 4$ and the right side is $3 + 3 = 6$. The product rule only splits **products**, never sums.

    **Q3.** A loop starts at $i = 1$ and doubles $i$ until $i \ge n$. Roughly how many iterations?

    ??? tip "Hint"
        After $k$ iterations, $i = 2^k$. When does $2^k$ reach $n$?

    ??? success "Answer"
        $2^k \ge n \Rightarrow k \ge \log_2 n$, so about $\lceil\log_2 n\rceil$ iterations.

    **Q4.** What is $1 + 2 + 4 + \dots + 512$?

    ??? tip "Hint"
        $512 = 2^9$. Use "next power minus one".

    ??? success "Answer"
        $2^{10} - 1 = 1023$.

    **Q5.** Why can we write $O(\log n)$ without saying which base?

    ??? success "Answer"
        Change of base: $\log_2 n = \log_{10} n / \log_{10} 2 \approx 3.32\log_{10} n$. Different bases differ only by a constant factor, and Big-O ignores constant factors.

=== "Explanation & drill"

    **Explanation.** A logarithm answers "what exponent?". $\log_2 n$ is the number of times you can halve $n$ before reaching 1, which is exactly the number of rounds in binary search or the number of levels when merge sort keeps splitting.
    Sums appear because a loop's total work is (work in iteration 1) + (work in iteration 2) + … . Learn to recognise three shapes:

    - **Arithmetic** ($1 + 2 + \dots + n$): grows like $n^2$. You get it from a loop whose inner work grows by 1 each time.
    - **Geometric, growing** ($1 + 2 + 4 + \dots$): dominated by the **last** term.
    - **Geometric, shrinking** ($n + n/2 + n/4 + \dots$): dominated by the **first** term, total $\le 2n$.

    **Drill** (answers hidden)

    **1.** $\log_2 1 = ?$

    ??? success "Answer"
        0

    **2.** Simplify $2^{\log_2 n}$.

    ??? success "Answer"
        $n$

    **3.** Simplify $\log_2(n^2/4)$.

    ??? success "Answer"
        $2\log_2 n - 2$

    **4.** $\sum_{i=1}^{100} i = ?$

    ??? success "Answer"
        $100\cdot101/2 = 5050$

    **5.** $\sum_{i=0}^{\log_2 n} 2^i = ?$ (assume $n$ is a power of 2)

    ??? success "Answer"
        $2^{\log_2 n + 1} - 1 = 2n - 1$

    **6.** $n + \frac n2 + \frac n4 + \dots + 1 = ?$ (assume $n$ is a power of 2)

    ??? success "Answer"
        $2n - 1$, which is $\Theta(n)$. Same terms as Q5, written in reverse order.

    **7.** $\sum_{i=1}^{4} i^2 = ?$

    ??? success "Answer"
        $1 + 4 + 9 + 16 = 30$, and the formula gives $4\cdot5\cdot9/6 = 30$ ✓

    **8.** Which is bigger for large $n$: $\log_2 n$ or $\sqrt n$?

    ??? success "Answer"
        $\sqrt n$. Every polynomial power $n^{\varepsilon}$ (with $\varepsilon > 0$) eventually beats any log.


---

## Common mistakes

- $\log(a + b) \ne \log a + \log b$. Only **products** split.
- $(\log n)^2 \ne \log(n^2)$. The first is "log squared"; the second equals $2\log n$.
- $\sum_{i=1}^{n} i$ is **not** $n$. It's about $n^2/2$.
- Off-by-one in sums: $\sum_{i=0}^{k} 2^i$ has $k+1$ terms.

## Mastery check

!!! question "Solve without hints, then explain in your own words"
    (a) Find a closed form for $\sum_{i=1}^{n}(3i - 1)$ and check it with $n = 4$.
    (b) How many times can you halve 4096 before reaching 1?
    (c) Simplify $\log_2(16\,n^5)$.

??? success "Answers"
    (a) $3\cdot\frac{n(n+1)}{2} - n = \frac{3n^2 + n}{2}$. With $n = 4$: $2 + 5 + 8 + 11 = 26$ and $(48 + 4)/2 = 26$ ✓
    (b) $4096 = 2^{12}$, so **12**.
    (c) $4 + 5\log_2 n$.

## See it move

- [Desmos: plot $\log_2 x$, $\sqrt x$ and $x$ together](https://www.desmos.com/calculator) to *see* which grows faster.

## References

- Lecture06 *Algorithm Analysis: Mathematical Background*: Slides 13–21 (logarithms), 22–26 (series).
- CLRS 4e §3.3 (standard functions: logs, exponentials) and Appendix A (summations, A.1–A.2).
