'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  EMPTY,
  MAX_SCORE,
  addMistake,
  getTopic,
  parseImport,
  removeMistake,
  removeMock,
  serialize,
  summary,
  today,
} from '@/lib/progress';
import { MockScoreForm } from './mock-score-form';
import { StatusBadge } from './status-badge';
import { useProgress } from './use-progress';

export interface TopicInfo {
  slug: string;
  title: string;
  url: string;
}

/** The whole personal dashboard on the Progress page. */
export function MyProgress({ topics }: { topics: TopicInfo[] }) {
  const { data, update, replace, storageWorks } = useProgress();
  const s = summary(
    data,
    topics.map((t) => t.slug),
  );

  return (
    <div className="not-prose space-y-8" data-testid="my-progress">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-3xl font-normal tracking-wide">
            <span data-testid="mastered-count">{s.mastered}</span> / {s.total} topics mastered
          </CardTitle>
          <CardDescription>
            {s.inProgress} in progress ·{' '}
            {storageWorks
              ? 'saved in this browser only, nothing is sent anywhere'
              : 'your browser blocks storage, so progress lasts for this visit only'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(s.mastered / s.total) * 100} aria-label="Topics mastered" />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="font-display text-3xl tracking-wide">Topics</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode that worked</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((t) => {
                const p = getTopic(data, t.slug);
                return (
                  <TableRow key={t.slug} data-topic={t.slug}>
                    <TableCell className="whitespace-normal">
                      <Link href={t.url} className="hover:text-hazard underline-offset-4 hover:underline">
                        {t.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell>{p.mode ?? '—'}</TableCell>
                    <TableCell>{p.updated ?? '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground">Tick the “Your mastery check” card at the bottom of each topic page.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl tracking-wide">Mock exams</h2>
        <MockScoreForm />
        {data.mocks.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table data-testid="mock-list">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Paper</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Weak questions</TableHead>
                  <TableHead>
                    <span className="sr-only">Delete</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.mocks.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.date}</TableCell>
                    <TableCell>{m.paper}</TableCell>
                    <TableCell className="font-semibold">
                      {m.score} / {MAX_SCORE}
                    </TableCell>
                    <TableCell className="whitespace-normal">{m.weak || '—'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete paper ${m.paper} score from ${m.date}`}
                        onClick={() => update((d) => removeMock(d, m.id))}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <p className="text-sm text-muted-foreground">Bands: 45+ ready · 35–44 review your mistakes · below 35 redo the weakest topics.</p>
      </section>

      <MistakesLog topics={topics} />

      <BackupControls
        onExport={() => {
          const blob = new Blob([serialize(data)], { type: 'application/json' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `daa-progress-${today()}.json`;
          a.click();
          URL.revokeObjectURL(a.href);
        }}
        onImport={replace}
        onReset={() => replace(EMPTY)}
      />
    </div>
  );
}

function MistakesLog({ topics }: { topics: TopicInfo[] }) {
  const { data, update } = useProgress();
  const [form, setForm] = useState({ topic: topics[0]?.title ?? '', what: '', why: '', fix: '' });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="space-y-3">
      <h2 id="my-mistakes" className="scroll-mt-24 font-display text-3xl tracking-wide">My mistakes</h2>
      <p className="text-sm text-muted-foreground">
        Every mistake from a drill or mock exam goes here: what you did, why, and the fix. Reread it before the exam.
      </p>
      <form
        className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2 [&>div]:min-w-0"
        data-testid="mistake-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.what.trim()) return;
          update((d) => addMistake(d, { ...form, date: today() }));
          setForm({ ...form, what: '', why: '', fix: '' });
        }}
      >
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="mistake-topic">Topic</Label>
          <select
            id="mistake-topic"
            value={form.topic}
            onChange={set('topic')}
            className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm"
          >
            {topics.map((t) => (
              <option key={t.slug}>{t.title}</option>
            ))}
            <option>Mock exam</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="mistake-what">What I did wrong</Label>
          <Input id="mistake-what" required value={form.what} onChange={set('what')} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="mistake-why">Why</Label>
          <Input id="mistake-why" value={form.why} onChange={set('why')} />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="mistake-fix">The fix (what I'll do next time)</Label>
          <Input id="mistake-fix" value={form.fix} onChange={set('fix')} />
        </div>
        <Button type="submit" className="sm:w-fit">
          Add mistake
        </Button>
      </form>
      {data.mistakes.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table data-testid="mistake-list">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>What</TableHead>
                <TableHead>Why</TableHead>
                <TableHead>Fix</TableHead>
                <TableHead>
                  <span className="sr-only">Delete</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.mistakes.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.date}</TableCell>
                  <TableCell className="whitespace-normal">{m.topic}</TableCell>
                  <TableCell className="whitespace-normal">{m.what}</TableCell>
                  <TableCell className="whitespace-normal">{m.why || '—'}</TableCell>
                  <TableCell className="whitespace-normal">{m.fix || '—'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete mistake: ${m.what}`}
                      onClick={() => update((d) => removeMistake(d, m.id))}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

function BackupControls({
  onExport,
  onImport,
  onReset,
}: {
  onExport: () => void;
  onImport: (d: typeof EMPTY) => void;
  onReset: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <section className="space-y-3">
      <h2 className="font-display text-3xl tracking-wide">Backup &amp; other devices</h2>
      <p className="text-sm text-muted-foreground">
        Your progress lives only in this browser. Clearing browsing data erases it, so export a backup now and then. To
        continue on another device, export here and import there.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onExport}>
          <Download /> Export progress
        </Button>
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload /> Import progress
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          data-testid="import-input"
          aria-label="Progress file to import"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            const result = parseImport(await file.text());
            if (!result.ok) return setMessage({ ok: false, text: `Import failed: ${result.error}` });
            if (!confirm('Replace the progress in this browser with the imported file?')) return;
            onImport(result.data);
            setMessage({ ok: true, text: 'Progress imported.' });
          }}
        />
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            if (!confirm('Erase all progress saved in this browser? Export a backup first if unsure.')) return;
            onReset();
            setMessage({ ok: true, text: 'Progress erased.' });
          }}
        >
          <Trash2 /> Reset
        </Button>
      </div>
      {message && (
        <p role="status" className={message.ok ? 'text-sm text-muted-foreground' : 'text-sm font-medium text-destructive'}>
          {message.text}
        </p>
      )}
    </section>
  );
}
