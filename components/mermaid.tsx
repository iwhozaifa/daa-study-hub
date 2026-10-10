'use client';
// Fumadocs' Mermaid recipe (https://fumadocs.dev/docs/markdown/mermaid), with the site palette.
import { use, useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, setPromise: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  const { default: mermaid } = use(cachePromise('mermaid', () => import('mermaid')));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'inherit',
    themeCSS: 'margin: 1.5rem auto 0;',
    theme: 'base',
    themeVariables: dark
      ? { primaryColor: '#1E1918', primaryTextColor: '#EDE6D6', primaryBorderColor: '#FF5A1F', lineColor: '#E8B23A', secondaryColor: '#2A2220', tertiaryColor: '#141110' }
      : { primaryColor: '#FAF5EA', primaryTextColor: '#1A1514', primaryBorderColor: '#A5330A', lineColor: '#7A560F', secondaryColor: '#EBD9C4', tertiaryColor: '#F3ECDD' },
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () => mermaid.render(id.replaceAll(':', ''), chart.replaceAll('\\n', '\n'))),
  );

  return (
    <div
      className="mermaid-diagram"
      ref={(container) => {
        if (container) bindFunctions?.(container);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
