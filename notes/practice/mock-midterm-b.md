# Mock midterm B (exam mode)

!!! info "How to use exam mode"
    Same rules as [Paper A](mock-midterm.md): closed book, a 75-minute phone timer, and no answers opened until it rings.
    Take it **after** Paper A and after reviewing your [mistakes](../mistakes.md), so it measures what you learned.
    Several questions have a twist that catches a common beginner trap. Read each one carefully.

**Total: 50 marks**

---

### Q1. Warm-up (6 marks)

(a) Simplify $\log_3(81n^2)$. **[2]**
(b) Give a closed form for $\sum_{i=1}^{n}(2i - 1)$. **[2]**
(c) Evaluate $\sum_{i=0}^{6} 2^i$ with the geometric-series formula. **[2]**

??? success "Answers"
    (a) $\log_3 81 + \log_3 n^2 = 4 + 2\log_3 n$.
    (b) $2\cdot\frac{n(n+1)}{2} - n = n^2$ (the sum of the first $n$ odd numbers is a perfect square).
    (c) $\frac{2^{7} - 1}{2 - 1} = 127$.

### Q2. Counting steps (6 marks)

```text
i ← n
while i > 1 do
    for j ← 1 to i do
        x ← x + 1
    i ← ⌊i / 2⌋
```

(a) For $n = 16$, exactly how many times does `x ← x + 1` run? **[3]**
(b) Give the Θ bound for general $n$ and justify it. *(Careful: it is **not** $n\log n$.)* **[3]**

??? success "Answers"
    (a) $i$ takes the values 16, 8, 4, 2, so $16 + 8 + 4 + 2 = 30$.
    (b) The inner loop does $n + \frac n2 + \frac n4 + \dots$ steps. That is a geometric series bounded by $2n$, and the first pass alone is $n$, so the total is $\Theta(n)$. The outer loop runs $\log n$ times, but the passes **shrink**, so you can't multiply $\log n \times n$.

### Q3. Asymptotic proofs (10 marks)

(a) Prove $2n^3 - 5n^2 + 1 = \Theta(n^3)$ with explicit $c_1, c_2, n_0$. **[5]**
(b) True or false? Give a one-line reason for each. **[5]**
  (i) $n^2 + 100n = O(n^2)$ (ii) $3^n = O(2^n)$ (iii) $\frac{n}{\log n} = \Omega(\sqrt n)$ (iv) $2^{\log_2 n} = \Theta(n)$ (v) $n^{0.01} = O(\log^2 n)$

??? success "Answers"
    (a) **Upper:** for $n \ge 1$, $-5n^2 \le 0$ and $1 \le n^3$, so $f(n) \le 3n^3$: $c_2 = 3$.
    **Lower:** for $n \ge 5$, $n^3 \ge 5n^2$, so $f(n) = n^3 + (n^3 - 5n^2) + 1 \ge n^3$: $c_1 = 1$.
    $n_0 = 5$. Check $n = 5$: $125 \le 126 \le 375$ ✓ (at $n = 4$ the lower bound fails: $49 < 64$).
    (b) (i) **T**: $100n \le 100n^2$, so $c = 101$. (ii) **F**: $3^n / 2^n = 1.5^n \to \infty$. (iii) **T**: $\frac{n/\log n}{\sqrt n} = \frac{\sqrt n}{\log n} \to \infty$.
    (iv) **T**: $2^{\log_2 n} = n$ exactly. (v) **F**: every positive power of $n$ eventually beats any power of $\log n$.

### Q4. Insertion sort (8 marks)

(a) Trace insertion sort on `[4, 9, 2, 7, 1]`. Show the array after each outer iteration, and count both **shifts** and **key comparisons**. **[4]**
(b) Describe the input of size $n$ that makes insertion sort do the most shifts, and give that number exactly. What input gives the fewest? **[4]**

??? success "Answers"
    (a) $j = 2$: `[4, 9, 2, 7, 1]` (0 shifts, 1 comparison) · $j = 3$: `[2, 4, 9, 7, 1]` (2, 2) · $j = 4$: `[2, 4, 7, 9, 1]` (1, 2) · $j = 5$: `[1, 2, 4, 7, 9]` (4, 4).
    **7 shifts, 9 comparisons.** (When the key runs off the left end, the loop stops on $i = 0$ without a comparison.)
    (b) A reverse-sorted array: key $j$ shifts $j - 1$ elements, so $\sum_{j=2}^{n}(j-1) = \frac{n(n-1)}{2}$, which is $\Theta(n^2)$. An already-sorted array gives 0 shifts and $n - 1$ comparisons, which is $\Theta(n)$.

### Q5. Correctness (6 marks)

```text
MaxIndex(A, n)
1  m ← 1
2  for i ← 2 to n do
3      if A[i] > A[m] then m ← i
4  return m
```

State a loop invariant and prove initialization, maintenance and termination.

??? success "Answer"
    **Invariant:** at the start of the iteration with index $i$, $A[m]$ is a largest value in $A[1..i-1]$.
    **Init:** $i = 2$, the range is $A[1..1]$, and $m = 1$ ✓.
    **Maintenance:** if $A[i] > A[m]$, the new element is bigger than everything before, so $m \leftarrow i$ makes $A[m]$ the max of $A[1..i]$. Otherwise $A[m] \ge A[i]$ and stays the max ✓.
    **Termination:** the loop exits with $i = n + 1$, so $A[m]$ is a largest value in $A[1..n]$ and the function returns its index ∎

### Q6. Induction (6 marks)

Prove that $3$ divides $n^3 + 2n$ for every integer $n \ge 1$.

??? success "Answer"
    **Base** $n = 1$: $1 + 2 = 3$ ✓.
    **Step:** assume $3 \mid k^3 + 2k$. Then
    $(k+1)^3 + 2(k+1) = k^3 + 3k^2 + 3k + 1 + 2k + 2 = (k^3 + 2k) + 3(k^2 + k + 1)$.
    The first bracket is divisible by 3 (the hypothesis) and the second is 3 times an integer, so the sum is divisible by 3 ∎

### Q7. Recurrences (8 marks)

(a) Solve $T(n) = T(n-1) + n$, $T(1) = 1$, by **expansion** (iteration). Give the exact closed form and the Θ. **[3]**
(b) Solve $T(n) = 2T(n/2) + 1$, $T(1) = 1$, with a **recursion tree**: give the level table and the Θ. **[3]**
(c) Use **substitution** to show $T(n) = T(n/2) + n$, $T(1) = 1$, satisfies $T(n) \le 2n$. **[2]**

??? success "Answers"
    (a) $T(n) = n + (n-1) + T(n-2) = \dots = n + (n-1) + \dots + 2 + T(1) = \frac{n(n+1)}{2}$, which is $\Theta(n^2)$.
    (b) Level $i$ has $2^i$ nodes, each costing 1, so the level costs $2^i$. Levels $i = 0..\log_2 n$, so the total is $2^{\log_2 n + 1} - 1 = 2n - 1$, which is $\Theta(n)$. *(A trap: the work is at the leaves, not $\Theta(\log n)$.)*
    (c) Base: $T(1) = 1 \le 2$ ✓. Step: assume $T(n/2) \le 2\cdot\frac n2 = n$. Then $T(n) \le n + n = 2n$ ✓ ∎

---

**Score bands:** 45+ ready · 35–44 review your mistakes · below 35 redo the weakest topics in a different study mode.
