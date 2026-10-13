import Link from 'next/link';
import { ArrowRight, BookOpenCheck, Eye, Layers, ListChecks, MessageCircleQuestion, Swords, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DaysLeft } from '@/components/days-left';
import { TopicStatusBadge } from '@/components/progress/status-badge';
import { source } from '@/lib/source';

const modes = [
  { icon: Eye, name: 'Visual', text: 'Trace tables, diagrams and step-by-step pictures.' },
  { icon: BookOpenCheck, name: 'Worked example', text: 'One problem solved slowly, then the rule.' },
  { icon: MessageCircleQuestion, name: 'Guided questions', text: 'Work it out yourself, with hidden hints.' },
  { icon: Swords, name: 'Explanation & drill', text: 'A straight explanation, then practice.' },
];

const week = ['Oct 12–17', 'Oct 12–17', 'Oct 12–17', 'Oct 12–17', 'Oct 18–24', 'Oct 18–24', 'Oct 18–24', 'Oct 25–29', 'Oct 25–29'];

const tools = [
  { href: '/docs/cheatsheet', icon: ListChecks, name: 'Cheatsheet', text: 'Every formula on one page' },
  { href: '/docs/which-technique', icon: MessageCircleQuestion, name: 'Which technique?', text: 'Read a question, pick the method' },
  { href: '/docs/mistakes', icon: TriangleAlert, name: 'My mistakes', text: 'Never repeat an error' },
  { href: '/docs/flashcards', icon: Layers, name: 'Flashcards', text: '70 cards: flip them here or import into Anki' },
];

export default function HomePage() {
  const topics = source
    .getPages()
    .filter((p) => p.slugs[0] === 'topics')
    .sort((a, b) => a.url.localeCompare(b.url));

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="hero-slash" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-24">
          <Badge className="stamp mb-6 bg-blood text-background text-sm">
            <DaysLeft />
          </Badge>
          <h1 className="font-display text-6xl leading-[0.9] tracking-wide sm:text-8xl">
            Design &amp; Analysis
            <br />
            <span className="text-hazard">of Algorithms</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            CS332 notes rebuilt for beginners: plain-word explanations, hand traces, hidden answers and timed mock
            exams. Pick a mode, learn it, then prove it without hints.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/docs/topics/00-math-toolkit">
                Start with Topic 0 <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs/practice/mock-midterm">Take a mock exam</Link>
            </Button>
          </div>
        </div>
        <div aria-hidden className="saw-edge" />
      </section>

      {/* Study modes */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-4xl tracking-wide">
          Pick how you learn <span className="text-hazard">today</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every topic page has these four tabs. The one you choose stays selected on every page.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map(({ icon: Icon, name, text }) => (
            <Card key={name} className="lift">
              <CardHeader>
                <Icon className="size-7 text-hazard" />
                <CardTitle className="mt-2 text-lg">{name}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="font-display text-4xl tracking-wide">
          Nine topics. <span className="text-blood">One midterm.</span>
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="topic-grid">
          {topics.map((page, i) => {
            const [num, ...rest] = page.data.title.split(' · ');
            return (
              <Link key={page.url} href={page.url} className="group">
                <Card className="lift h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <span className="topic-num font-display text-6xl leading-none">{num}</span>
                      <Badge variant="outline" className="border-gold text-gold">
                        {week[i]}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg group-hover:text-hazard">{rest.join(' · ')}</CardTitle>
                    <CardDescription>{page.data.description}</CardDescription>
                    <div className="mt-2 min-h-5">
                      <TopicStatusBadge slug={page.slugs[1]} />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Toolbox */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-display text-4xl tracking-wide">
          The <span className="text-gold">toolbox</span>
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map(({ href, icon: Icon, name, text }) => (
            <Link key={name} href={href} className="group">
              <Card className="lift h-full">
                <CardHeader>
                  <Icon className="size-6 text-gold" />
                  <CardTitle className="mt-2 group-hover:text-hazard">{name}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          Notes are written in our own words with original examples, citing the lecture slides and CLRS 4e. The original
          slides and book are not in this site.
        </p>
      </section>
    </main>
  );
}
