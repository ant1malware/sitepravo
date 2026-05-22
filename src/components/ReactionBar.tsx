import React from 'react';
import { Heart, Smile, Rocket, Laugh, Eye } from 'lucide-react';
import { toggleLikePost } from '../store/forumRemote';
import { listPostReactions, togglePostReaction, getMyPostReaction, type PostReaction } from '../store/postReactions';

export default function ReactionBar({ postId, currentUserId, onPostUpdated }: { postId: string; currentUserId?: string | null; onPostUpdated?: () => void }) {
  const [, force] = React.useReducer((x) => x + 1, 0);
  const my = currentUserId ? getMyPostReaction(postId, currentUserId) : undefined;
  const entry = listPostReactions(postId);
  const disabled = !currentUserId;

  const Btn = ({ r, label, Icon }: { r: PostReaction; label: string; Icon?: any }) => (
    <button
      className={`btn text-xs ${my === r ? 'btn-primary' : ''}`}
      onClick={() => { if (!currentUserId) return; togglePostReaction(postId, currentUserId, r); force(); }}
      title={label}
      aria-pressed={my === r}
      disabled={disabled}
    >
      {Icon ? <Icon size={14} /> : label}
      {entry.counts?.[r] ? <span className="opacity-80">{entry.counts[r]}</span> : null}
    </button>
  );

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {/* API-backed like (server) */}
      <button className="btn text-xs" onClick={async () => { try { await toggleLikePost(postId); onPostUpdated?.(); } catch {} }} title="Like">
        <Heart size={14} />
      </button>
      {/* Local emoji reactions */}
      <Btn r="smile" label=":)" Icon={Smile as any} />
      <Btn r="heart" label="❤" Icon={Heart as any} />
      <Btn r="laugh" label="😄" Icon={Laugh as any} />
      <Btn r="rocket" label="🚀" Icon={Rocket as any} />
      <Btn r="eyes" label="👀" Icon={Eye as any} />
    </div>
  );
}
