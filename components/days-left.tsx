'use client';
import { useEffect, useState } from 'react';

// Counted in the visitor's browser, so the static site never shows a stale number.
const MIDTERM = new Date(2026, 10, 2); // 2 Nov 2026 (months are 0-based)

export function DaysLeft() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDays(Math.round((MIDTERM.getTime() - today.getTime()) / 86_400_000));
  }, []);

  if (days === null) return <span data-testid="days-left">Midterm · 2 Nov</span>;
  if (days > 1) return <span data-testid="days-left">{days} days to midterm</span>;
  if (days === 1) return <span data-testid="days-left">Midterm tomorrow</span>;
  if (days === 0) return <span data-testid="days-left">Midterm today. Good luck!</span>;
  return <span data-testid="days-left">Midterm done</span>;
}
