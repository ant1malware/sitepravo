export const OWNER_USER_NUMBER = 1;

export type IdentityMeta = {
  id?: string | null;
  userNumber?: number | string | null;
  owner?: boolean | null;
  hidden?: boolean | null;
};

/** Determine if an account should be considered sensitive/hidden. */
export function isSensitive(meta: IdentityMeta | null | undefined): boolean {
  if (!meta) return false;
  if (typeof meta.hidden === 'boolean') return meta.hidden;
  if (meta.owner) return true;
  const num = typeof meta.userNumber === 'string' ? Number(meta.userNumber) : meta.userNumber;
  return typeof num === 'number' && Number.isFinite(num) && num === OWNER_USER_NUMBER;
}

/**
 * Returns true when the viewer is allowed to see the target account.
 * The owner of the hidden profile (matching id) keeps full access.
 */
export function canViewerSee(meta: IdentityMeta | null | undefined, viewerId?: string | null): boolean {
  if (!isSensitive(meta)) return true;
  if (!meta?.id) return false;
  return !!viewerId && viewerId === meta.id;
}

export function filterVisible<T extends IdentityMeta>(items: T[], viewerId?: string | null): T[] {
  return items.filter((item) => canViewerSee(item, viewerId));
}
