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

Each topic page in `notes/topics/` has, in this order:

1. an `!!! abstract "In one sentence"` box
2. **Everyday analogy**
3. **Key rules**
4. four tabs: `=== "Visual"`, `=== "Worked example"`, `=== "Guided questions"` and `=== "Explanation & drill"`
5. **Common mistakes**
6. **Mastery check**
7. **See it move**
8. **References**

Answers go in `??? success "Answer"` blocks and hints in `??? tip "Hint"` blocks, so they stay hidden until clicked.
Check every number in a worked example (by hand or with a calculator) before you submit.

## How to submit a change

```bash
git clone https://github.com/iwhozaifa/daa-study-hub && cd daa-study-hub
uv venv .venv && uv pip install --python .venv/bin/python -r requirements.txt
git switch -c fix-topic-6-typo
# edit files in notes/
.venv/bin/mkdocs serve            # preview at http://127.0.0.1:8000
.venv/bin/mkdocs build --strict   # must finish with no warnings
git commit -am "Topic 6: fix typo in Example 2"
git push -u origin fix-topic-6-typo
gh pr create                      # or open a pull request on GitHub
```

New page? Add it to `nav:` in `mkdocs.yml`. The site redeploys automatically when a pull request is merged into `main`.
