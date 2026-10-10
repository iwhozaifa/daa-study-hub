'use client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CHECKS, MODES, allChecked, getTopic, setMode, setStatus, toggleCheck, type Mode, type Status } from '@/lib/progress';
import { StatusBadge } from './status-badge';
import { useProgress } from './use-progress';

/** "Your mastery check" card at the bottom of each topic page. */
export function MasteryTracker({ topic }: { topic: string }) {
  const { data, update, storageWorks } = useProgress();
  const t = getTopic(data, topic);
  const unlocked = allChecked(t);

  return (
    <Card className="not-prose my-8 border-2 border-gold/60" data-testid="mastery-tracker">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="font-display text-3xl font-normal tracking-wide">Your mastery check</CardTitle>
          <StatusBadge status={t.status} />
        </div>
        <CardDescription>
          Solve the problem above with no hints, close the page and explain it out loud. Tick each step honestly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="sr-only">Mastery checklist</legend>
          {CHECKS.map((label, i) => {
            const id = `${topic}-check-${i}`;
            return (
              <div key={id} className="flex items-start gap-3">
                <Checkbox
                  id={id}
                  checked={t.checks[i]}
                  onCheckedChange={() => update((d) => toggleCheck(d, topic, i))}
                  className="mt-0.5"
                />
                <Label htmlFor={id} className="leading-snug font-normal">
                  {i === 0 ? <strong>{label}</strong> : label}
                </Label>
              </div>
            );
          })}
        </fieldset>

        <div className="space-y-2">
          <p className="text-sm font-medium" id={`${topic}-status-label`}>
            Status
          </p>
          <ToggleGroup
            type="single"
            variant="outline"
            aria-labelledby={`${topic}-status-label`}
            value={t.status}
            onValueChange={(v) => v && update((d) => setStatus(d, topic, v as Status))}
            className="flex-wrap"
          >
            <ToggleGroupItem value="not-started">Not started</ToggleGroupItem>
            <ToggleGroupItem value="in-progress">In progress</ToggleGroupItem>
            <ToggleGroupItem value="mastered" disabled={!unlocked}>
              Mastered
            </ToggleGroupItem>
          </ToggleGroup>
          {!unlocked && <p className="text-sm text-muted-foreground">Tick all six steps to unlock “Mastered”.</p>}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium" id={`${topic}-mode-label`}>
            Which study mode worked for you?
          </p>
          <ToggleGroup
            type="single"
            variant="outline"
            aria-labelledby={`${topic}-mode-label`}
            value={t.mode ?? ''}
            onValueChange={(v) => update((d) => setMode(d, topic, (v || undefined) as Mode | undefined))}
            className="flex-wrap"
          >
            {MODES.map((m) => (
              <ToggleGroupItem key={m} value={m}>
                {m}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {storageWorks ? 'Saved in this browser only' : 'Your browser blocks storage: progress lasts for this visit only'}
          {t.updated ? ` · updated ${t.updated}` : ''}
        </span>
        <Link href="/docs/progress" className="text-hazard underline underline-offset-4">
          See all my progress →
        </Link>
      </CardFooter>
    </Card>
  );
}
