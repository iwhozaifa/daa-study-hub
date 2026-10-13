// Reads flashcards/daa-flashcards.csv, the same file Anki imports, so the site and Anki never disagree.
import fs from 'node:fs';
import path from 'node:path';

export const CSV_PATH = 'flashcards/daa-flashcards.csv';

export type Flashcard = { front: string; back: string; topic: string; tags: string[] };

/** Splits one CSV line into cells ("" inside quotes is a literal quote). */
export function parseCsvLine(line: string): string[] {
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

/** Card lines of the CSV (Anki's `#…` header lines removed). */
export function cardLines(root = process.cwd()): string[] {
  return fs
    .readFileSync(path.join(root, CSV_PATH), 'utf8')
    .trim()
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'));
}

/** Every card, in file order. Runs at build time only. */
export function loadFlashcards(root = process.cwd()): Flashcard[] {
  return cardLines(root).map((line) => {
    const [front, back, tagCell = ''] = parseCsvLine(line);
    const tags = tagCell.trim().split(/\s+/).filter(Boolean);
    return { front, back, topic: tags[0] ?? '', tags };
  });
}
