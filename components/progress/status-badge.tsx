'use client';
import { Badge } from '@/components/ui/badge';
import { getTopic, type Status } from '@/lib/progress';
import { useProgress } from './use-progress';

const LABEL: Record<Status, string> = { 'not-started': 'Not started', 'in-progress': 'In progress', mastered: '✓ Mastered' };
const STYLE: Record<Status, string> = {
  'not-started': 'border-border text-muted-foreground',
  'in-progress': 'border-hazard text-hazard',
  mastered: 'border-gold bg-gold text-background',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={STYLE[status]} data-status={status}>
      {LABEL[status]}
    </Badge>
  );
}

/** Small badge for the home-page topic cards; shows nothing until the visitor has started the topic. */
export function TopicStatusBadge({ slug }: { slug: string }) {
  const { data } = useProgress();
  const { status } = getTopic(data, slug);
  if (status === 'not-started') return null;
  return <StatusBadge status={status} />;
}
