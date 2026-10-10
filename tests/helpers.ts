import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(__dirname, '..');
export const DOCS = path.join(ROOT, 'content/docs');

/** All .mdx files under content/docs, as paths relative to it (e.g. "topics/04-insertion-sort.mdx"). */
export function mdxFiles(): string[] {
  return (fs.readdirSync(DOCS, { recursive: true }) as string[])
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.split(path.sep).join('/'))
    .sort();
}

export function read(rel: string): string {
  return fs.readFileSync(path.join(DOCS, rel), 'utf8');
}

/** Page URL for a content file: "topics/04-insertion-sort.mdx" -> "/docs/topics/04-insertion-sort". */
export function urlOf(rel: string): string {
  const slug = rel.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '');
  return slug ? `/docs/${slug}` : '/docs';
}
