import React from 'react';

export type ScoreInput = { posts?: number; likes?: number; topics?: number };

export function computePoints({ posts = 0, likes = 0, topics = 0 }: ScoreInput) {
  // score = topics*4 + posts*1 + likes*2
  return topics * 4 + posts * 1 + likes * 2;
}

export function badgeFor(points: number): { name: string; color: string } {
  if (points >= 1000) return { name: 'Expert', color: '#22c55e' };
  if (points >= 500) return { name: 'Gold', color: '#eab308' };
  if (points >= 250) return { name: 'Silver', color: '#a1a1aa' };
  if (points >= 100) return { name: 'Bronze', color: '#d97706' };
  return { name: 'Newbie', color: '#8b5cf6' };
}

export default function Badge({ points }: { points: number }) {
  const meta = badgeFor(points);
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: meta.color }}>
      <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
      {meta.name} • {points} pts
    </span>
  );
}
