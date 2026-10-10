# 4 · Insertion sort

!!! abstract "In one sentence"
    Insertion sort grows a sorted section on the left, one element at a time: take the next element
    (the **key**), slide bigger elements one step right, and drop the key into the gap.
    **Best case $\Theta(n)$** (already sorted), **worst case $\Theta(n^2)$** (reverse sorted).

## Everyday analogy

**Sorting a hand of playing cards.** You pick up cards one by one. Each new card is slid leftwards past
every card that's bigger than it, until it sits in the right place. The cards in your hand are
**always** sorted, and that's the loop invariant.

## The algorithm

```text
InsertionSort(A, n)
1  for j ← 2 to n do
2      key ← A[j]
3      // insert A[j] into the sorted part A[1..j-1]
4      i ← j − 1
5      while i > 0 and A[i] > key do
6          A[i + 1] ← A[i]          // shift the bigger element right
7          i ← i − 1
8      A[i + 1] ← key               // drop key into the gap
```

(The slides call the outer variable `j`; CLRS 4e renames it `i`. The algorithm is the same.)

**Loop invariant:** whenever the outer loop is about to begin a pass with index `j`, the left part `A[1..j-1]`
contains exactly the items that started there, now in sorted order.

---

=== "Visual"

    **Trace on `[7, 3, 9, 1, 5]`** (our own example). **Bold** = the sorted part *after* the step.

    | Step | key | What happens | Array after | Shifts |
    |---|---|---|---|---|
    | start | — | `A[1..1]` is trivially sorted | **7**, 3, 9, 1, 5 | — |
    | $j = 2$ | 3 | 7 > 3 → shift 7 right; drop 3 at position 1 | **3, 7**, 9, 1, 5 | 1 |
    | $j = 3$ | 9 | 7 > 9? no → stays put | **3, 7, 9**, 1, 5 | 0 |
    | $j = 4$ | 1 | 9, 7, 3 all > 1 → shift all three; drop 1 at front | **1, 3, 7, 9**, 5 | 3 |
    | $j = 5$ | 5 | 9, 7 > 5 shift; 3 > 5? no → drop 5 after 3 | **1, 3, 5, 7, 9** | 2 |

    Total: **6 shifts** and **8 key comparisons** (`A[i] > key` checks).

    Fun fact: the number of shifts always equals the number of **inversions** (pairs that are in the wrong order). Here they are (7,3), (7,1), (7,5), (3,1), (9,1), (9,5): 6 ✓

    ```text
    j = 4, key = 1
    [3][7][9][1][5]      take key = 1, leaving a gap at position 4
    [3][7][ ][9][5]      9 > 1 → shift right
    [3][ ][7][9][5]      7 > 1 → shift right
    [ ][3][7][9][5]      3 > 1 → shift right, i = 0 so stop
    [1][3][7][9][5]      drop key into the gap
    ```

=== "Worked example"

    **Running time with cost × frequency.** Let $t_j$ = the number of times the `while` test (line 5) runs for that $j$, counting the final failing test.

    | Line | Cost | Times |
    |---|---|---|
    | 1 `for` | $c_1$ | $n$ |
    | 2 `key ←` | $c_2$ | $n - 1$ |
    | 4 `i ←` | $c_4$ | $n - 1$ |
    | 5 `while` test | $c_5$ | $\sum_{j=2}^{n} t_j$ |
    | 6 shift | $c_6$ | $\sum_{j=2}^{n} (t_j - 1)$ |
    | 7 `i ← i−1` | $c_7$ | $\sum_{j=2}^{n} (t_j - 1)$ |
    | 8 drop key | $c_8$ | $n - 1$ |

    **Best case: already sorted, e.g. `[1, 2, 3, 4, 5]`.** Each key is ≥ its left neighbour, so the while test fails immediately: $t_j = 1$. Lines 6–7 never run.
    $$T(n) = c_1 n + (c_2 + c_4 + c_5 + c_8)(n - 1) = an + b \;\Rightarrow\; \Theta(n)$$

    **Worst case: reverse sorted, e.g. `[5, 4, 3, 2, 1]`.** Each key must pass **every** element to its left: $t_j = j$.
    Use the sums from [Topic 0](00-math-toolkit.md):
    $$\sum_{j=2}^{n} j = \frac{n(n+1)}{2} - 1, \qquad \sum_{j=2}^{n} (j - 1) = \frac{n(n-1)}{2}$$
    Both are quadratic, so $T(n) = an^2 + bn + c \Rightarrow \Theta(n^2)$.

    **Check with $n = 5$ reverse sorted:** shifts $= 1 + 2 + 3 + 4 = 10 = \frac{5\cdot4}{2}$ ✓

    **Average case:** a random key moves past about half the sorted part, so roughly $n^2/4$ shifts, still $\Theta(n^2)$.

=== "Guided questions"

    **Q1.** Why does the `for` loop start at $j = 2$, not $j = 1$?

    ??? success "Answer"
        A one-element array `A[1..1]` is already sorted. That's also why initialization of the invariant holds.

    **Q2.** In the while condition `i > 0 and A[i] > key`, why must `i > 0` come first?

    ??? success "Answer"
        When $i = 0$ we'd read `A[0]`, which doesn't exist. Checking `i > 0` first stops before that (short-circuit "and").

    **Q3.** Maintenance step: the invariant says `A[1..j-1]` is sorted. After one iteration, why is `A[1..j]` sorted?

    ??? tip "Hint"
        What do lines 5–7 do to elements bigger than key, and where exactly does key land?

    ??? success "Answer"
        Every element bigger than key moves one step right (keeping their order), and key goes right after the last element ≤ key. So everything left of key is ≤ key and everything right of it is > key, which means `A[1..j]` is sorted.

    **Q4.** Termination: what is $j$ when the for loop ends, and what does the invariant give?

    ??? success "Answer"
        $j = n + 1$, so `A[1..n]` (the whole array) holds the original elements in sorted order ∎

    **Q5.** Is insertion sort *stable* (do equal elements keep their order)?

    ??? success "Answer"
        Yes. It only shifts elements strictly greater than key (`A[i] > key`), so an equal element is never jumped over.

=== "Explanation & drill"

    **Explanation.** Insertion sort is **incremental**: after processing $j$ elements, the prefix is sorted. The work for each key depends on how far it travels left, so the input order matters hugely. Sorted input means each key moves 0 steps (linear time). Reverse-sorted input means key $j$ moves $j - 1$ steps (quadratic time). It sorts **in place** (only $O(1)$ extra memory: `key` and `i`) and is very fast on small or nearly-sorted arrays, which is why real libraries use it for tiny sub-arrays.

    **Drill**

    **1.** Trace `[2, 8, 5, 3]`. Give the array after each $j$.

    ??? success "Answer"
        $j = 2$: `[2, 8, 5, 3]` (no shift) → $j = 3$: `[2, 5, 8, 3]` → $j = 4$: `[2, 3, 5, 8]`. 3 shifts in total.

    **2.** How many shifts on a reverse-sorted array of size 6?

    ??? success "Answer"
        $1 + 2 + 3 + 4 + 5 = 15 = \frac{6\cdot5}{2}$

    **3.** What is the extra space used?

    ??? success "Answer"
        $\Theta(1)$: just `key`, `i` and `j`.

    **4.** If an array of size $n$ has only 3 elements out of place, roughly how fast is insertion sort?

    ??? success "Answer"
        Nearly linear: about $n$ + (number of inversions), which is $\Theta(n)$ when the inversions are few.

---

## Common mistakes

- Writing the best case as "small array". It means **already sorted**, for any $n$.
- Using $t_j = j - 1$ for the worst case of the *while test*. The test runs $j$ times (including the failing check); the *shifts* are $j - 1$.
- Forgetting the final `A[i + 1] ← key` in a trace, so the key "disappears".
- An invariant that says "`A[1..j-1]` is sorted" but forgets "…and contains the **original** elements of `A[1..j-1]`".

## Mastery check

!!! question "Solve without hints, then explain"
    (a) Trace insertion sort on `[4, 1, 3, 2]`, showing the array after each $j$ and counting shifts.
    (b) Give a worst-case input of size 5 and its number of shifts.
    (c) Explain in 2–3 sentences why the best case is linear.

??? success "Answers"
    (a) $j = 2$: `[1, 4, 3, 2]` (1 shift) · $j = 3$: `[1, 3, 4, 2]` (1) · $j = 4$: `[1, 2, 3, 4]` (2). **4 shifts**.
    (b) `[5, 4, 3, 2, 1]`, with $1 + 2 + 3 + 4 = 10$ shifts.
    (c) In sorted input each key is already ≥ its left neighbour, so the while loop fails on its first test. Each of the $n - 1$ outer iterations does constant work, giving $\Theta(n)$.

## See it move

- [VisuAlgo: Sorting](https://visualgo.net/en/sorting): pick **INS** (insertion sort) and step through your own array.

## References

- 05-06 *Insertion Sort & Analysis*: Slides 4–5 (algorithm and trace), 6–7 (loop invariant and correctness), 10–13 (running time, best/worst case).
- CLRS 4e §2.1 (insertion sort, loop invariant), §2.2 (running-time analysis). Homework from Slide 8: exercises 2.1-1 to 2.1-4. Hints available on request, no full solutions.
