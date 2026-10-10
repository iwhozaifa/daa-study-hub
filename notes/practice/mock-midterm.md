# Mock midterm (exam mode)

!!! info "How to use exam mode"
    1. Set a **75-minute timer** on your phone. Closed book: no notes, no cheatsheet.
    2. Write your answers on paper. Do **not** open any answer until the timer ends.
    3. Mark yourself with the hidden answers. Copy every mistake into [My mistakes](../mistakes.md).
    4. Record your score in [Progress](../progress.md). Redo the paper 2 days later on the questions you missed.

    The questions mix all topics in the order an exam might, and are new problems written for practice.
    They are not copies of slide or book exercises.

**Total: 50 marks**

---

### Q1. Warm-up (6 marks)

(a) Simplify $\log_2(32n^4)$. **[2]**
(b) Give a closed form for $\sum_{i=1}^{n}(4i + 1)$. **[2]**
(c) Evaluate $1 + 3 + 9 + 27 + 81$ using the geometric-series formula. **[2]**

??? success "Answers"
    (a) $5 + 4\log_2 n$.
    (b) $4\cdot\frac{n(n+1)}{2} + n = 2n^2 + 3n$.
    (c) $\frac{3^5 - 1}{3 - 1} = \frac{242}{2} = 121$.

### Q2. Counting steps (6 marks)

```text
for i ← 1 to n do
    for j ← i to n do
        for k ← 1 to 10 do
            x ← x + 1
```

(a) Exactly how many times does `x ← x + 1` run? **[3]**
(b) Give the Θ bound and explain the role of the `k` loop. **[3]**

??? success "Answers"
    (a) The `j` loop runs $n - i + 1$ times, so the total is $10\sum_{i=1}^n (n - i + 1) = 10\cdot\frac{n(n+1)}{2} = 5n(n+1)$.
    (b) $\Theta(n^2)$. The `k` loop is a constant (10) factor, so it doesn't change the growth rate.

### Q3. Asymptotic proofs (10 marks)

(a) Prove $6n^2 + 4n - 10 = \Theta(n^2)$ with explicit $c_1, c_2, n_0$. **[5]**
(b) Rank from slowest- to fastest-growing: $n^{1.5}$, $n\log n$, $2^{n/2}$, $\log(n^2)$, $\sqrt n$. **[5]**

??? success "Answers"
    (a) Upper: for $n \ge 1$, $6n^2 + 4n - 10 \le 6n^2 + 4n^2 = 10n^2$, so $c_2 = 10$. Lower: $6n^2 + 4n - 10 \ge 6n^2$ when $4n \ge 10$, i.e. $n \ge 3$, so $c_1 = 6$. Take $n_0 = 3$. Check $n = 3$: $54 \le 56 \le 90$ ✓
    (b) $\log(n^2) = 2\log n < \sqrt n < n\log n < n^{1.5} < 2^{n/2}$.

### Q4. Insertion sort (8 marks)

(a) Trace insertion sort on `[6, 2, 8, 1, 4]`. Show the array after each outer iteration and count the shifts. **[4]**
(b) State the loop invariant and explain the maintenance step in your own words. **[4]**

??? success "Answers"
    (a) $j = 2$: `[2, 6, 8, 1, 4]` (1) · $j = 3$: `[2, 6, 8, 1, 4]` (0) · $j = 4$: `[1, 2, 6, 8, 4]` (3) · $j = 5$: `[1, 2, 4, 6, 8]` (2). **6 shifts.**
    (b) At the start of each iteration, `A[1..j-1]` holds the original first $j - 1$ elements in sorted order. Maintenance: elements bigger than the key shift right by one, keeping their order, and the key drops into the gap after the last element ≤ key, so `A[1..j]` is sorted.

### Q5. Correctness (6 marks)

```text
CountEven(A, n)
1  c ← 0
2  for i ← 1 to n do
3      if A[i] mod 2 = 0 then c ← c + 1
4  return c
```

State a loop invariant and prove initialization, maintenance and termination.

??? success "Answer"
    **Invariant:** at the start of iteration $i$, $c$ = the number of even elements in $A[1..i-1]$.
    **Init:** $i = 1$, the range is empty, and $c = 0$ ✓. **Maintenance:** if $A[i]$ is even, $c$ goes up by 1, otherwise it is unchanged, so $c$ counts the evens in $A[1..i]$ ✓.
    **Termination:** the loop exits at $i = n + 1$, so $c$ = the number of evens in $A[1..n]$ ∎

### Q6. Induction (6 marks)

Prove for all $n \ge 1$: $\sum_{i=1}^{n} i\cdot 2^{i} = (n - 1)2^{n+1} + 2$.

??? success "Answer"
    **Base** $n = 1$: LHS $= 2$, RHS $= 0 + 2 = 2$ ✓.
    **Step:** assume it holds for $k$. Then
    $\sum_{i=1}^{k+1} i2^i = (k-1)2^{k+1} + 2 + (k+1)2^{k+1} = 2k\cdot2^{k+1} + 2 = k\cdot2^{k+2} + 2$,
    which is the formula with $n = k + 1$ ✓ ∎

### Q7. Merge sort & recurrences (8 marks)

(a) Show the merge of `[3, 5, 9]` and `[2, 4, 10, 11]`. How many comparisons? **[2]**
(b) Solve $T(n) = 3T(n/2) + n$ with a recursion tree: give the level table and the Θ answer. **[4]**
(c) Solve $T(n) = T(n/3) + 1$. **[2]**

??? success "Answers"
    (a) 2, 3, 4, 5, 9, 10, 11. Comparisons: 3v2, 3v4, 5v4, 5v10, 9v10, then the left list is empty: **5**.
    (b) Level $i$: $3^i$ nodes of size $n/2^i$, total $(3/2)^i n$, which grows. The leaves dominate: $3^{\log_2 n} = n^{\log_2 3} \approx n^{1.585}$, so $\Theta(n^{\log_2 3})$.
    (c) One node per level, $\log_3 n + 1$ levels, so $\Theta(\log n)$.

---

**Score bands:** 45+ ready · 35–44 review your mistakes · below 35 redo the weakest topics in a different study mode.
