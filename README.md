# DAA Study Hub

Beginner-friendly study notes for **CS332 Design and Analysis of Algorithms**: logs and sums, proofs,
loop invariants, insertion sort, Big-O/Ω/Θ, merge sort and recurrences.

**📖 Read it as a website: <https://iwhozaifa.github.io/daa-study-hub/>**

Each topic page offers four study modes as tabs (Visual · Worked example · Guided questions ·
Explanation & drill), hidden answers, a mastery check and references to the lecture slides and CLRS 4th ed.
There are also two timed mock midterms, a cheatsheet and 70 Anki flashcards.
Each visitor gets a **private progress tracker** (mastery checklist, mock scores, mistakes log) saved in their own
browser, with no login or account, plus export/import to move between devices.

Built with [Fumadocs](https://fumadocs.dev) (Next.js + React), [shadcn/ui](https://ui.shadcn.com), Tailwind CSS,
KaTeX and Mermaid. Notes are MDX files in [`content/docs/`](content/docs).

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000/daa-study-hub
```

## Tests

```bash
npm test             # content rules + recomputes every number in the worked examples (Vitest)
npm run test:e2e     # builds the site and clicks through it in Chromium, incl. accessibility (Playwright + axe)
npm run check        # TypeScript + both of the above
```

GitHub Actions runs all of them on every push; the site is only published if they pass.
How everything fits together: [`content/docs/how-this-site-works.mdx`](content/docs/how-this-site-works.mdx).
Want to help? Read [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Copyright

All notes are written in our own words, with original examples. They cite *"Slide N, <deck>"* and
*"CLRS 4e §X"* rather than copying them. The original slides and textbook are **not** in this repository
(see `.gitignore`), and both the deploy workflow and the test suite fail if a PDF or slide file is ever committed.
