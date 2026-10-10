import { source } from '@/lib/source';
import { MyProgress } from './my-progress';

/** Server wrapper: reads the topic list from the notes so the dashboard never goes out of date. */
export function MyProgressFromNotes() {
  const topics = source
    .getPages()
    .filter((p) => p.slugs[0] === 'topics')
    .sort((a, b) => a.url.localeCompare(b.url))
    .map((p) => ({ slug: p.slugs[1], title: p.data.title, url: p.url }));
  return <MyProgress topics={topics} />;
}
