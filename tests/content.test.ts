// Checks that the notes follow the house rules: page template, sidebar, links, flashcards, copyright.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DOCS, ROOT, mdxFiles, read } from './helpers';

const files = mdxFiles();
const topics = files.filter((f) => f.startsWith('topics/'));
const MODES = ['Visual', 'Worked example', 'Guided questions', 'Explanation & drill'];

describe('pages', () => {
  it('has all 9 topic pages', () => {
    expect(topics).toHaveLength(9);
  });

  it.each(files)('%s has a title in its frontmatter', (f) => {
    expect(read(f)).toMatch(/^---\ntitle: .+\n/);
  });

  it.each(files)('%s has no links inside headings (headings are already links)', (f) => {
    const outsideCode = read(f).replace(/```[\s\S]*?```/g, '');
    expect(outsideCode).not.toMatch(/^#{1,6} .*\]\(/m);
  });

  it.each(files)('%s has no leftover MkDocs syntax', (f) => {
    const outsideCode = read(f).replace(/```[\s\S]*?```/g, '');
    expect(outsideCode).not.toMatch(/^\s*(!!!|\?\?\?|===) /m);
  });
});

describe('topic page template', () => {
  it.each(topics)('%s has every section, in order', (f) => {
    const s = read(f);
    const markers = [
      '<Callout type="info" title="In one sentence">',
      '## Everyday analogy',
      '<Tabs groupId="study-mode" persist',
      ...MODES.map((m) => `<Tab value="${m}">`),
      '## Common mistakes',
      '## Mastery check',
      '## References',
    ];
    let pos = -1;
    for (const m of markers) {
      const at = s.indexOf(m, pos + 1);
      expect(at, `missing or out of order: ${m}`).toBeGreaterThan(pos);
      pos = at;
    }
  });

  it.each(topics)('%s hides the mastery-check answer', (f) => {
    const s = read(f);
    const mastery = s.slice(s.indexOf('## Mastery check'));
    expect(mastery).toMatch(/<Accordion title="✅ Answers?">/);
  });

  it.each(topics)('%s ends its mastery check with a tracker card for itself', (f) => {
    const slug = f.replace(/^topics\/|\.mdx$/g, '');
    const s = read(f);
    const at = s.indexOf(`<MasteryTracker topic="${slug}" />`);
    expect(at).toBeGreaterThan(s.indexOf('## Mastery check'));
    expect(at).toBeLessThan(s.indexOf('## References'));
    expect(s.match(/<MasteryTracker /g)).toHaveLength(1);
  });

  it.each(topics)('%s cites the slides and CLRS', (f) => {
    const refs = read(f).slice(read(f).indexOf('## References'));
    expect(refs).toMatch(/Slides?|pp?\. ?\d/);
    expect(refs).toMatch(/CLRS/);
  });
});

describe('sidebar (meta.json)', () => {
  function listed(dir: string): string[] {
    const metaPath = path.join(DOCS, dir, 'meta.json');
    const all = fs
      .readdirSync(path.join(DOCS, dir))
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => path.posix.join(dir, f));
    if (!fs.existsSync(metaPath)) return all;
    const { pages } = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as { pages: string[] };
    return pages.flatMap((p) => {
      if (p.startsWith('---')) return [];
      if (p.startsWith('...')) return listed(path.posix.join(dir, p.slice(3)));
      const file = path.posix.join(dir, `${p}.mdx`);
      expect(fs.existsSync(path.join(DOCS, file)), `meta.json lists a missing page: ${file}`).toBe(true);
      return [file];
    });
  }

  it('lists every page exactly once', () => {
    const shown = listed('').map((f) => f.replace(/^\//, ''));
    expect([...shown].sort()).toEqual(files);
    expect(new Set(shown).size).toBe(shown.length);
  });
});

describe('links', () => {
  it.each(files)('%s links only to pages that exist', (f) => {
    for (const [, target] of read(f).matchAll(/\]\(((?!https?:|#|mailto:)[^)#\s]+)(#[^)]*)?\)/g)) {
      const resolved = path.join(DOCS, path.dirname(f), target);
      expect(fs.existsSync(resolved), `${f} → ${target}`).toBe(true);
    }
  });

  it('home page links point at real notes', () => {
    const home = fs.readFileSync(path.join(ROOT, 'app/(home)/page.tsx'), 'utf8');
    const hrefs = [...home.matchAll(/href[=:] ?['"](\/docs[^'"]*)['"]/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(3);
    for (const h of hrefs) {
      const rel = h.replace(/^\/docs\/?/, '') || 'index';
      expect(fs.existsSync(path.join(DOCS, `${rel}.mdx`)), h).toBe(true);
    }
  });
});

describe('mock midterms', () => {
  it.each(['practice/mock-midterm.mdx', 'practice/mock-midterm-b.mdx'])('%s adds up to 50 marks', (f) => {
    const marks = [...read(f).matchAll(/^### Q\d+\..*\((\d+) marks\)/gm)].map((m) => Number(m[1]));
    expect(marks.length).toBe(7);
    expect(marks.reduce((a, b) => a + b, 0)).toBe(50);
  });

  it.each([
    ['practice/mock-midterm.mdx', 'A'],
    ['practice/mock-midterm-b.mdx', 'B'],
  ])('%s has a score form for paper %s', (f, paper) => {
    expect(read(f)).toContain(`<MockScoreForm paper="${paper}" />`);
  });

  it('the progress page holds the personal dashboard', () => {
    expect(read('progress.mdx')).toContain('<MyProgress />');
  });

  it.each(['practice/mock-midterm.mdx', 'practice/mock-midterm-b.mdx'])('%s hides every answer', (f) => {
    const s = read(f);
    const questions = (s.match(/^### Q\d+\./gm) ?? []).length;
    const answers = (s.match(/<Accordion title="✅ Answers?">/g) ?? []).length;
    expect(answers).toBe(questions);
  });
});

describe('flashcards', () => {
  const lines = fs.readFileSync(path.join(ROOT, 'flashcards/daa-flashcards.csv'), 'utf8').trim().split('\n');
  const header = lines.filter((l) => l.startsWith('#'));
  const cards = lines.filter((l) => !l.startsWith('#'));

  function parseCsvLine(line: string): string[] {
    const cells: string[] = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') (cur += '"'), i++;
        else if (ch === '"') quoted = false;
        else cur += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') cells.push(cur), (cur = '');
      else cur += ch;
    }
    cells.push(cur);
    return cells;
  }

  it('has the Anki import header', () => {
    expect(header).toEqual(['#separator:comma', '#html:false', '#columns:Front,Back,Tags', '#tags column:3']);
  });

  it('has 70 well-formed cards with topic tags and no duplicates', () => {
    const parsed = cards.map(parseCsvLine);
    expect(parsed).toHaveLength(70);
    for (const c of parsed) {
      expect(c, c.join(' | ')).toHaveLength(3);
      expect(c[0].trim().length).toBeGreaterThan(0);
      expect(c[1].trim().length).toBeGreaterThan(0);
      expect(c[2]).toMatch(/^t[0-8] /);
    }
    expect(new Set(parsed.map((c) => c[0])).size).toBe(parsed.length);
  });
});

describe('copyright', () => {
  it('no PDFs, slide decks or e-books are tracked by Git', () => {
    const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n');
    expect(tracked.filter((f) => /\.(pdf|pptx?|key|odp|epub|djvu|mobi)$/i.test(f))).toEqual([]);
  });
});
