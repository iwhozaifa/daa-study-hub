# DAA Study Hub

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-16-111111)](https://fumadocs.dev)
[![MDX](https://img.shields.io/badge/MDX-1B1F24?logo=mdx&logoColor=white)](https://mdxjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![KaTeX](https://img.shields.io/badge/KaTeX-008080?logo=latex&logoColor=white)](https://katex.org)
[![Mermaid](https://img.shields.io/badge/Mermaid-FF3670?logo=mermaid&logoColor=white)](https://mermaid.js.org)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-deployed-222222?logo=githubpages&logoColor=white)](https://iwhozaifa.github.io/daa-study-hub/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Beginner-friendly study notes for **CS332 Design and Analysis of Algorithms**: logs and sums, proofs,
loop invariants, insertion sort, Big-O/Ω/Θ, merge sort and recurrences.

**📖 Read it as a website: <https://iwhozaifa.github.io/daa-study-hub/>**

## Table of contents

- [Features](#features)
- [Topics covered](#topics-covered)
- [Tech stack](#tech-stack)
- [Run it locally](#run-it-locally)
- [Tests](#tests)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Copyright of course material](#copyright-of-course-material)
- [License](#license)

## Features

- **Four study modes per topic**, as tabs: Visual · Worked example · Guided questions · Explanation & drill
- **Hidden answers and hints** that open on click, plus a **mastery check** at the end of every topic
- **Two timed mock midterms**, a **cheatsheet**, a "which technique?" guide and a common-mistakes page
- **70 flashcards**: flip them on the site's Flashcards page (filter by topic, shuffle, keyboard keys), or import
  the same [`flashcards/daa-flashcards.csv`](flashcards/daa-flashcards.csv) into Anki
- **Private progress tracker** (mastery checklist, mock scores, mistakes log) saved in your own browser —
  no login or account — with export/import to move between devices
- References to the lecture slides and CLRS 4th ed. on every page
- Light/dark mode, full-text search and LaTeX maths

## Topics covered

| #  | Topic                          |
| -- | ------------------------------ |
| 00 | Math toolkit (logs, sums)      |
| 01 | Algorithms and counting        |
| 02 | Proof techniques               |
| 03 | Correctness (loop invariants)  |
| 04 | Insertion sort                 |
| 05 | Loop analysis and space        |
| 06 | Asymptotic notation (O, Ω, Θ)  |
| 07 | Divide and conquer             |
| 08 | Recurrences                    |

## Tech stack

| Layer            | Tools                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Framework        | [Next.js](https://nextjs.org) 16 (static export) + [React](https://react.dev) 19          |
| Docs engine      | [Fumadocs](https://fumadocs.dev) (core, MDX, UI)                                          |
| Content          | [MDX](https://mdxjs.com) files in [`content/docs/`](content/docs)                         |
| Styling & UI     | [Tailwind CSS](https://tailwindcss.com) 4, [shadcn/ui](https://ui.shadcn.com), Radix UI, Lucide icons |
| Maths & diagrams | [KaTeX](https://katex.org) (via remark-math / rehype-katex), [Mermaid](https://mermaid.js.org) |
| Language         | [TypeScript](https://www.typescriptlang.org)                                              |
| Testing          | [Vitest](https://vitest.dev) (unit/content), [Playwright](https://playwright.dev) + axe-core (E2E & accessibility) |
| CI / hosting     | GitHub Actions → GitHub Pages                                                             |
| Visitor stats    | [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) (cookie-free)       |

## Run it locally

**Prerequisites:** [Node.js](https://nodejs.org) 24 or newer (the version CI uses) and npm.

```bash
# 1. Clone the repository
git clone https://github.com/iwhozaifa/daa-study-hub.git
cd daa-study-hub

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev          # open http://localhost:3000/daa-study-hub
```

To build and preview the production (static) site:

```bash
npm run build        # outputs the static site to out/
npm start            # serves it at http://localhost:4321/daa-study-hub
```

## Tests

```bash
npm test             # content rules + recomputes every number in the worked examples (Vitest)
npx playwright install chromium   # first time only, before the browser tests
npm run test:e2e     # builds the site and clicks through it in Chromium, incl. accessibility (Playwright + axe)
npm run check        # TypeScript + both of the above
```

GitHub Actions runs all of them on every push; the site is only published if they pass.

## Project structure

```text
app/              Next.js routes, layout and global styles
components/       React components (progress tracker, Mermaid, search, shadcn/ui)
content/docs/     All notes as MDX: topics/, practice/ (mock midterms), cheatsheet, study plan…
flashcards/       Anki flashcard deck (CSV)
lib/              Shared helpers (content source, progress storage, layout)
tests/            Vitest tests and Playwright E2E tests (tests/e2e/)
.github/          CI workflow that tests and deploys to GitHub Pages
```

How everything fits together: [`content/docs/how-this-site-works.mdx`](content/docs/how-this-site-works.mdx).

## Contributing

Fixes, new practice questions and clearer explanations are welcome.
Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) first — it covers the copyright rules, the page template and
how to submit a change.

## Copyright of course material

All notes are written in our own words, with original examples. They cite *"Slide N, &lt;deck&gt;"* and
*"CLRS 4e §X"* rather than copying them. The original slides and textbook are **not** in this repository
(see `.gitignore`), and both the deploy workflow and the test suite fail if a PDF or slide file is ever committed.

## License

This project is released under the [MIT License](LICENSE). The license covers the code and the original notes in
this repository; it does not cover the lecture slides or the CLRS textbook, which belong to their respective owners.
