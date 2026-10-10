import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import type { MDXComponents } from 'mdx/types';
import { Mermaid } from '@/components/mermaid';
import { MasteryTracker } from '@/components/progress/mastery-tracker';
import { MockScoreForm } from '@/components/progress/mock-score-form';
import { MyProgressFromNotes } from '@/components/progress/my-progress-server';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    Accordions,
    Accordion,
    Mermaid,
    MasteryTracker,
    MockScoreForm,
    MyProgress: MyProgressFromNotes,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
