import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import './global.css';

const inter = Inter({ subsets: ['latin', 'greek'], variable: '--font-inter' });
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-jb' });

export const metadata: Metadata = {
  title: { default: 'DAA Study Hub', template: '%s · DAA Study Hub' },
  description: 'Beginner-friendly notes, drills and mock exams for CS332 Design and Analysis of Algorithms.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${mono.variable} font-sans`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
