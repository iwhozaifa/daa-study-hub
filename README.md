# DAA Study Hub

Beginner-friendly study notes for **CS332 Design and Analysis of Algorithms**: logs and sums, proofs,
loop invariants, insertion sort, Big-O/Ω/Θ, merge sort and recurrences.

**📖 Read it as a website: <https://iwhozaifa.github.io/daa-study-hub/>**

Each topic page offers four study modes as tabs (Visual · Worked example · Guided questions ·
Explanation & drill), hidden answers, a mastery check and references to the lecture slides and CLRS 4th ed.

## Run it locally

```bash
uv venv .venv
uv pip install --python .venv/bin/python -r requirements.txt
.venv/bin/mkdocs serve        # http://127.0.0.1:8000
```

How everything fits together: [`notes/how-this-site-works.md`](notes/how-this-site-works.md).
Want to help? Read [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Copyright

All notes are written in our own words, with original examples. They cite *"Slide N, <deck>"* and
*"CLRS 4e §X"* rather than copying them. The original slides and textbook are **not** in this repository
(see `.gitignore`), and the deploy workflow fails if a PDF or slide file is ever committed.
