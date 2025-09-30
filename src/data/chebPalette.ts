export type ChebPaletteId =
  | 'pal_ocean'
  | 'pal_sunset'
  | 'pal_void'
  | 'pal_blossom'
  | 'pal_midnight'
  | 'pal_aurora'
  | 'pal_candy'
  | 'pal_celestial'
  | 'pal_softnight';

export type ChebPaletteGradient = [string, string];

export const CHEBZIK_DEFAULT_GRADIENT: ChebPaletteGradient = ['#bcd3ff', '#6a79ff'];

const PALETTE_MAP: Record<ChebPaletteId, ChebPaletteGradient> = {
  pal_ocean: ['#bcd3ff', '#6a79ff'],
  pal_sunset: ['#ffd7a1', '#ff6a88'],
  pal_void: ['#a7b0ff', '#5a2cff'],
  pal_blossom: ['#ffb3d2', '#ff77a9'],
  pal_midnight: ['#2b2d55', '#141729'],
  pal_aurora: ['#7de3ff', '#8b5cf6'],
  pal_candy: ['#ffe6f3', '#ffc8de'],
  pal_celestial: ['#8ad7ff', '#b388ff'],
  pal_softnight: ['#1f2448', '#513d8a'],
};

export function getChebPaletteGradient(paletteId?: string | null): ChebPaletteGradient | null {
  if (!paletteId) return null;
  const id = paletteId as ChebPaletteId;
  return (PALETTE_MAP as Record<string, ChebPaletteGradient | undefined>)[id] ?? null;
}

