import React from 'react';
import { getSessionAccount, getProfileById, type RemoteProfile } from './authRemote';

type ChebAccessState = { allowed: boolean; loading: boolean };

const CHEB_LABELS = ['cheb', 'cheb-access', 'chebzik'];

let state: ChebAccessState = { allowed: false, loading: true };
let inFlight: Promise<boolean> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      /* ignore listener error */
    }
  }
}

function normalizeLabels(profile: RemoteProfile | null | undefined): string[] {
  return (profile?.labels || []).map((label) => label.trim().toLowerCase()).filter(Boolean);
}

function hasChebLabel(labels: string[]): boolean {
  return labels.some((label) => CHEB_LABELS.includes(label));
}

async function evaluateChebAccess(): Promise<boolean> {
  try {
    const me = await getSessionAccount();
    if (!me) {
      state = { allowed: false, loading: false };
      emit();
      return false;
    }
    const isOwner = Boolean((me as any)?.owner) || (me.userNumber || 0) === 1;
    if (me.role === 'developer' || isOwner) {
      state = { allowed: true, loading: false };
      emit();
      return true;
    }
    let allowed = false;
    try {
      const profile = await getProfileById(me.id);
      allowed = hasChebLabel(normalizeLabels(profile));
    } catch {
      allowed = false;
    }
    state = { allowed, loading: false };
    emit();
    return allowed;
  } catch {
    state = { allowed: false, loading: false };
    emit();
    return false;
  }
}

export function getChebAccessState(): ChebAccessState {
  return state;
}

export function subscribeChebAccess(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function refreshChebAccess(force = false): Promise<boolean> {
  if (!force && !state.loading) return state.allowed;
  if (inFlight) return inFlight;
  state = { ...state, loading: true };
  emit();
  inFlight = evaluateChebAccess().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

if (typeof window !== 'undefined') {
  window.addEventListener('forum:session', () => {
    refreshChebAccess(true).catch(() => {});
  });
}

export function useChebAccess(): ChebAccessState {
  const [snapshot, setSnapshot] = React.useState<ChebAccessState>(() => getChebAccessState());

  React.useEffect(() => {
    const update = () => setSnapshot(getChebAccessState());
    const unsubscribe = subscribeChebAccess(update);
    refreshChebAccess(true).catch(() => {});
    return unsubscribe;
  }, []);

  return snapshot;
}
