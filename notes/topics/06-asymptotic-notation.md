# 6 · Asymptotic notation: O, Ω, Θ

!!! abstract "In one sentence"
    $O$, $\Omega$ and $\Theta$ compare **how fast functions grow for large $n$**, ignoring constant factors
    and small inputs. $O$ is "at most", $\Omega$ is "at least", and $\Theta$ is "exactly, up to constants".

## Everyday analogy

**Speed limits on a motorway.** "$f = O(g)$" is like "this car **never goes faster** than $c\times$ the
speed limit $g$, once it's on the motorway (after $n_0$)". "$\Omega$" is a **minimum** speed. "$\Theta$" means the
car stays **between** a minimum and a maximum, so it is "in the same lane" as $g$. What happens in the car
park before the motorway (small $n$) doesn't count.

## Definitions

| Notation | Means | Formal definition: there exist positive constants… |
|---|---|---|
| $f(n) = O(g(n))$ | $f$ grows **no faster** than $g$ | $c, n_0$ with $0 \le f(n) \le c\,g(n)$ for all $n \ge n_0$ |
| $f(n) = \Omega(g(n))$ | $f$ grows **at least as fast** as $g$ | $c, n_0$ with $0 \le c\,g(n) \le f(n)$ for all $n \ge n_0$ |
| $f(n) = \Theta(g(n))$ | **same** growth rate | $c_1, c_2, n_0$ with $c_1 g(n) \le f(n) \le c_2 g(n)$ for all $n \ge n_0$ |
| $f(n) = o(g(n))$ | **strictly** slower (an upper bound that is *not* tight) | for **every** $c > 0$ there is an $n_0$ … $f(n) < c\,g(n)$ |
| $f(n) = \omega(g(n))$ | **strictly** faster | for **every** $c > 0$ … $f(n) > c\,g(n)$ |

$$f = \Theta(g) \iff f = O(g) \text{ and } f = \Omega(g)$$

!!! warning "Careful with little-o"
    The Lecture07 notation slide (Slide 6) calls $o$ a "tight upper bound". CLRS defines $o$ as an upper
    bound that is **not** tight ($2n = o(n^2)$, but $2n^2 \ne o(n^2)$). Use the CLRS meaning, and check with your
    instructor if an exam question depends on it.

**Growth ladder** (each grows strictly slower than the next):

$$1 \;<\; \log n \;<\; \sqrt n \;<\; n \;<\; n\log n \;<\; n^2 \;<\; n^3 \;<\; 2^n \;<\; 3^n \;<\; n! \;<\; n^n$$

**Limit shortcut** (for intuition and checking, not a replacement for a c/n₀ proof when one is asked):
if $\lim_{n\to\infty} f(n)/g(n)$ is $0$, then $f = o(g)$; if it is a constant $> 0$, then $f = \Theta(g)$; if it is $\infty$, then $f = \omega(g)$.

---

=== "Visual"

    **Watch the ladder pull apart**

    | $n$ | $\log_2 n$ | $n$ | $n\log_2 n$ | $n^2$ | $2^n$ |
    |---|---|---|---|---|---|
    | 10 | 3.3 | 10 | 33 | 100 | 1 024 |
    | 100 | 6.6 | 100 | 664 | 10 000 | $\approx 1.3\times10^{30}$ |
    | 1 000 | 10 | 1 000 | 9 966 | 1 000 000 | $\approx 10^{301}$ |

    **What $f = O(g)$ looks like:** take $f(n) = 3n + 7$ and $c\cdot g(n) = 4n$.

    | $n$ | 1 | 3 | 5 | 6 | **7** | 8 | 10 | 100 |
    |---|---|---|---|---|---|---|---|---|
    | $f(n) = 3n+7$ | 10 | 16 | 22 | 25 | **28** | 31 | 37 | 307 |
    | $4n$ | 4 | 12 | 20 | 24 | **28** | 32 | 40 | 400 |
    | $f \le 4n$? | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |

    Before $n_0 = 7$, $f$ is bigger, and that's allowed. From $n_0$ on, $f$ **stays** under $c\cdot g$ forever, so $3n + 7 = O(n)$.

    **$\Theta$ = sandwich:** $c_1 g(n) \le f(n) \le c_2 g(n)$. $f$ is trapped between two scaled copies of $g$.

=== "Worked example"

    **The recipe for a c/n₀ proof**

    1. Write the inequality you need.
    2. **Upper bound:** make $f$ *bigger* by replacing every lower-order term with the top power (and drop negative terms).
    3. **Lower bound:** make $f$ *smaller* by dropping positive lower-order terms, or fold a negative term into part of the top term.
    4. Read off $c$ (and $c_1, c_2$), then the $n_0$ from which every step is valid.
    5. **Check** one value of $n \ge n_0$.

    ---

    **Example 1.** Show $3n + 7 = O(n)$.
    Want $3n + 7 \le cn$. Try $c = 4$: $3n + 7 \le 4n \iff 7 \le n$. So $c = 4$, $n_0 = 7$.
    Check $n = 7$: $28 \le 28$ ✓

    **Example 2.** Show $5n^2 - 3n + 2 = \Theta(n^2)$.

    - **Upper:** for $n \ge 1$, $-3n \le 0$ and $2 \le 2n^2$, so $5n^2 - 3n + 2 \le 5n^2 + 2n^2 = 7n^2$. Take $c_2 = 7$.
    - **Lower:** want $5n^2 - 3n + 2 \ge 4n^2 \iff n^2 - 3n + 2 \ge 0 \iff (n-1)(n-2) \ge 0$. That holds for every integer $n \ge 1$. Take $c_1 = 4$.
    - So $c_1 = 4$, $c_2 = 7$, $n_0 = 1$. Check $n = 3$: $36 \le 38 \le 63$ ✓

    **Example 3 (not O, by contradiction).** Show $n^2 \ne O(10n)$.
    Suppose $n^2 \le c\cdot10n$ for all $n \ge n_0$. Dividing by $n$ gives $n \le 10c$ for **all** large $n$, but $n$ grows without bound while $10c$ is fixed. Contradiction ∎

    **Example 4 (Ω).** Show $\frac{n^2}{2} - 5 = \Omega(n^2)$.
    Try $c = \frac14$: $\frac{n^2}{2} - 5 \ge \frac{n^2}{4} \iff \frac{n^2}{4} \ge 5 \iff n^2 \ge 20 \iff n \ge 5$. So $c = \frac14$, $n_0 = 5$.

=== "Guided questions"

    **Q1.** Is $n = O(n^2)$? Is $n^2 = O(n)$?

    ??? success "Answer"
        Yes ($c = 1$, $n_0 = 1$). No: $n^2 \le cn$ would force $n \le c$, which is impossible. $O$ is "at most", so a loose upper bound is still **true**.

    **Q2.** Is $2^{n+1} = O(2^n)$? Is $2^{2n} = O(2^n)$?

    ??? tip "Hint"
        Rewrite $2^{n+1}$ and $2^{2n}$ using the exponent rules.

    ??? success "Answer"
        $2^{n+1} = 2\cdot2^n$, so yes with $c = 2$. $2^{2n} = 2^n \cdot 2^n$, and the ratio $2^n$ is not a constant, so **no**.

    **Q3.** Why must $n_0$ sometimes be bigger than 1?

    ??? success "Answer"
        For small $n$, lower-order terms or constants can dominate (e.g. $3n + 7$ vs $4n$ at $n = 2$). The definition only cares about $n \ge n_0$.

    **Q4.** An algorithm is $O(n^2)$ in the worst case and $\Omega(n)$ in the best case (like insertion sort). Can you give one Θ for "its running time"?

    ??? success "Answer"
        No single Θ covers all inputs. You say worst case $\Theta(n^2)$ and best case $\Theta(n)$. That's exactly why $O$ and $\Omega$ are useful on their own.

=== "Explanation & drill"

    **Explanation.** Exact step counts like $5n^2 - 3n + 2$ are messy and machine-dependent. Asymptotic notation keeps only the **shape**: the fastest-growing term, without its constant. $O$ gives a ceiling, $\Omega$ a floor, $\Theta$ both. To *prove* a bound you must exhibit the constants. Any valid constants are fine; they don't have to be the smallest. To *disprove*, assume the constants exist and show the inequality forces $n$ to be bounded, which is a contradiction.

    **Drill**

    **1.** Order these by growth: $n\log n$, $2^n$, $\sqrt n$, $n^2$, $\log n$, $100$.

    ??? success "Answer"
        $100 < \log n < \sqrt n < n\log n < n^2 < 2^n$

    **2.** Find $c, n_0$: $2n^2 + 5n = O(n^2)$.

    ??? success "Answer"
        $5n \le 5n^2$ for $n \ge 1$, so $\le 7n^2$: $c = 7$, $n_0 = 1$.

    **3.** True or false: $\log_2 n = \Theta(\log_{10} n)$.

    ??? success "Answer"
        True. They differ by the constant factor $\log_2 10$.

    **4.** True or false: $n\log n = O(n^{1.5})$.

    ??? success "Answer"
        True: $\log n$ grows slower than $n^{0.5}$.

    **5.** Show $50n + 3 \ne \Omega(n^2)$.

    ??? success "Answer"
        Suppose $cn^2 \le 50n + 3 \le 53n$ for $n \ge \max(n_0, 1)$. Then $n \le 53/c$ for all large $n$, a contradiction ∎

---

## Common mistakes

- Picking $n_0$ first, then a $c$ that only works for a different $n_0$. State both and **check** them.
- Thinking $O$ means "tight". $n = O(n^5)$ is true, just not useful. Use $\Theta$ when you mean tight.
- Dropping a *negative* term in a **lower** bound, which makes $f$ bigger, not smaller.
- Writing $O(2n^2 + 3)$. Simplify to $O(n^2)$.
- The little-o slide wording (see the warning above).

## Mastery check

!!! question "Solve without hints, then explain"
    (a) Prove $4n^3 + 10n^2 + 5 = \Theta(n^3)$ with explicit $c_1, c_2, n_0$.
    (b) Prove $n^2 \ne O(5n + 2)$.

??? success "Answers"
    (a) Lower: $4n^3 + 10n^2 + 5 \ge 4n^3$ for all $n \ge 1$, so $c_1 = 4$. Upper: $10n^2 \le 10n^3$ and $5 \le 5n^3$ for $n \ge 1$, so $\le 19n^3$ and $c_2 = 19$. $n_0 = 1$.
    (b) Suppose $n^2 \le c(5n + 2)$ for $n \ge n_0$. For $n \ge 1$, $5n + 2 \le 7n$, so $n^2 \le 7cn$, i.e. $n \le 7c$ for all large $n$, a contradiction ∎

## See it move

- [Desmos](https://www.desmos.com/calculator): plot $3x + 7$ and $4x$ and see them cross at $n_0 = 7$.

## References

- Lecture07 *Asymptotic Analysis*: Slides 2–4 (growth classes), 6 (notation overview), 7–13 (Big-O and examples), 14–18 (Ω), 19–24 (Θ), 25 (when Θ isn't possible).
- CLRS 4e Ch 3: §3.1 (O, Ω, Θ intuition), §3.2 (formal definitions, o and ω), §3.3 (standard functions).
