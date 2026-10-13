'use client';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/cn';
import type { Flashcard } from '@/lib/flashcards';

const ALL = 'all';

/** Flip-through deck for the Anki CSV: filter by topic, shuffle, flip with click/Space, move with ← →. */
export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const topics = useMemo(() => [...new Set(cards.map((c) => c.topic))].sort(), [cards]);
  const [topic, setTopic] = useState(ALL);
  const [order, setOrder] = useState<number[] | null>(null); // null = file order
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    const idx = order ?? cards.map((_, i) => i);
    return idx.map((i) => cards[i]).filter((c) => topic === ALL || c.topic === topic);
  }, [cards, order, topic]);
  const card = deck[pos];

  function go(next: number) {
    setPos((next + deck.length) % deck.length);
    setFlipped(false);
  }

  function shuffle() {
    const idx = cards.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    setOrder(idx);
    setPos(0);
    setFlipped(false);
  }

  function reset() {
    setOrder(null);
    setPos(0);
    setFlipped(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') go(pos + 1);
    else if (e.key === 'ArrowLeft') go(pos - 1);
    else return;
    e.preventDefault();
  }

  if (!card) return null;

  return (
    <section className="not-prose my-6 space-y-5" aria-label="Flashcards" onKeyDown={onKeyDown} data-testid="flashcards">
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        spacing={1}
        value={topic}
        onValueChange={(v) => {
          if (!v) return;
          setTopic(v);
          setPos(0);
          setFlipped(false);
        }}
        aria-label="Filter by topic"
        className="w-full flex-wrap"
      >
        <ToggleGroupItem value={ALL}>All</ToggleGroupItem>
        {topics.map((t) => (
          <ToggleGroupItem key={t} value={t} aria-label={`Topic ${t.slice(1)}`}>
            {t.toUpperCase()}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span data-testid="flashcard-count">
            Card {pos + 1} / {deck.length}
          </span>
          <span>{order ? 'Shuffled' : 'In order'}</span>
        </div>
        <Progress value={((pos + 1) / deck.length) * 100} aria-label="Position in deck" />
      </div>

      <div className="perspective-distant">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? 'Show question' : 'Show answer'}
          data-testid="flashcard"
          data-flipped={flipped}
          className={cn(
            'relative grid h-72 w-full cursor-pointer rounded-xl text-left transition-transform duration-500 transform-3d outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none sm:h-80',
            flipped && 'rotate-y-180',
          )}
        >
          <Face side="Question" card={card} hidden={flipped} className="border-hazard">
            {card.front}
          </Face>
          <Face side="Answer" card={card} hidden={!flipped} className="rotate-y-180 border-gold bg-gold/10">
            {card.back}
          </Face>
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {flipped ? `Answer: ${card.back}` : `Question: ${card.front}`}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go(pos - 1)}>
            <ArrowLeft /> Prev
          </Button>
          <Button onClick={() => go(pos + 1)}>
            Next <ArrowRight />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={shuffle}>
            <Shuffle /> Shuffle
          </Button>
          {order && (
            <Button variant="ghost" onClick={reset}>
              <RotateCcw /> In order
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Click the card or press Space to flip. Use ← → to move.</p>
    </section>
  );
}

function Face({
  side,
  card,
  hidden,
  className,
  children,
}: {
  side: string;
  card: Flashcard;
  hidden: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={hidden}
      className={cn(
        'col-start-1 row-start-1 flex flex-col gap-4 overflow-auto rounded-xl border-2 bg-card p-6 shadow-sm backface-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-xl tracking-wide text-muted-foreground">{side}</span>
        <span className="flex gap-1.5">
          {card.tags.includes('trap') && <Badge className="bg-blood text-background">Trap</Badge>}
          <Badge variant="outline">{card.tags.filter((t) => t !== 'trap').join(' · ')}</Badge>
        </span>
      </div>
      <p className="m-auto text-center text-xl leading-relaxed font-medium whitespace-pre-line sm:text-2xl">{children}</p>
    </div>
  );
}
