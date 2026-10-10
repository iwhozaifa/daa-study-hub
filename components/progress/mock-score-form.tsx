'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_SCORE, addMock, today } from '@/lib/progress';
import { useProgress } from './use-progress';

/** Log a mock-exam score. With `paper` set (on a paper's own page) the paper choice is fixed. */
export function MockScoreForm({ paper: fixedPaper }: { paper?: 'A' | 'B' }) {
  const { update } = useProgress();
  const [paper, setPaper] = useState<'A' | 'B'>(fixedPaper ?? 'A');
  const [score, setScore] = useState('');
  const [weak, setWeak] = useState('');
  const [saved, setSaved] = useState(false);
  const id = `mock-${fixedPaper ?? 'any'}`;

  return (
    <form
      className="not-prose my-6 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-[auto_8rem_1fr_auto] sm:items-end [&>div]:min-w-0"
      data-testid="mock-score-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (score === '') return;
        update((d) => addMock(d, { paper, score: Number(score), weak, date: today() }));
        setScore('');
        setWeak('');
        setSaved(true);
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-paper`}>Paper</Label>
        {fixedPaper ? (
          <p id={`${id}-paper`} className="h-9 content-center font-semibold">
            {fixedPaper}
          </p>
        ) : (
          <select
            id={`${id}-paper`}
            value={paper}
            onChange={(e) => setPaper(e.target.value as 'A' | 'B')}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-score`}>Score / {MAX_SCORE}</Label>
        <Input
          id={`${id}-score`}
          type="number"
          min={0}
          max={MAX_SCORE}
          step={0.5}
          required
          value={score}
          onChange={(e) => {
            setScore(e.target.value);
            setSaved(false);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-weak`}>Weak questions (optional)</Label>
        <Input id={`${id}-weak`} placeholder="e.g. Q3a, Q7b" value={weak} onChange={(e) => setWeak(e.target.value)} />
      </div>
      <Button type="submit">Log my score</Button>
      {saved && (
        <p role="status" className="text-sm text-muted-foreground sm:col-span-4">
          {fixedPaper ? 'Saved in this browser. See it on your Progress page.' : 'Saved in this browser.'}
        </p>
      )}
    </form>
  );
}
