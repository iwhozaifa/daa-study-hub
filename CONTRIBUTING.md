# Contributing to the DAA Study Hub

Classmates are welcome to fix mistakes, add practice questions or improve explanations.
Please follow the three rules below. They keep the repository legal and keep it useful for learning.

## 1. Copyright: write it yourself

- **Never paste text, figures or examples** from the lecture slides, the CLRS book or any other source.
  Explain the idea in your own simple words, with your **own** numbers, arrays and functions.
- Cite where an idea comes from instead: *"Slide 12, Lecture07 Asymptotic"* or *"CLRS 4e §3.2"*.
- **Never commit PDFs, slide decks or e-books.** `.gitignore` blocks `*.pdf`, and GitHub Actions refuses to publish
  if a `.pdf`, `.ppt`, `.pptx` or `.epub` file is ever tracked.
- Spot check: if a sentence came out close to the slide's wording, search the slide text for a distinctive
  phrase (`pdftotext slides.pdf - | grep -i "phrase"`). If it's there, reword your sentence.

## 2. Learning first: no full assignment solutions

Guided hints, analogies and **new** practice problems are welcome. Full solutions to graded assignments are not.

## 3. Match the page template

Each topic page in `content/docs/topics/` has, in this order (the tests check it):

1. frontmatter with `title` and a one-line `description`
2. a `<Callout type="info" title="In one sentence">` box
3. **Everyday analogy**
4. **Key rules**
5. four tabs: `<Tabs groupId="study-mode" persist items={[...]}>` with `<Tab value="Visual">`, `"Worked example"`,
   `"Guided questions"` and `"Explanation & drill"`
6. **Common mistakes**
7. **Mastery check**, ending with `<MasteryTracker topic="NN-slug" />` (the slug is the file name)
8. **See it move** (optional)
9. **References**

Answers go inside `<Accordions><Accordion title="✅ Answer">…</Accordion></Accordions>` and hints inside
`<Accordion title="💡 Hint">`, so they stay hidden until clicked. Leave a blank line inside each component around your text.
In ordinary text write `\{`, `\}` and `&lt;` (inside `$maths$` and code you can type them normally).

If you add a worked example with numbers (a trace, a count, a c/n₀ proof), add a check for it in
`tests/facts.test.ts` so a wrong number can never reach the site.

## How to submit a change

```bash
git clone https://github.com/iwhozaifa/daa-study-hub && cd daa-study-hub
npm install
git switch -c fix-topic-6-typo
# edit files in content/docs/
npm run dev          # preview at http://localhost:3000/daa-study-hub
npm run check        # types + tests + browser tests must all pass
git commit -am "Topic 6: fix typo in Example 2"
git push -u origin fix-topic-6-typo
gh pr create         # or open a pull request on GitHub
```

New page? Add its file name to the `meta.json` in the same folder. The pull request is tested automatically,
and the site redeploys when it is merged into `main`.
