import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { markVisible, setStatsListener, removeStatsListener, vote, type Totals } from './vote';
import Button from './ui/Button';

export default function VoteWidget({ cardId }: { cardId: string }) {
  const [totals, setTotals] = React.useState<Totals>({ up: 0, down: 0 });
  const [busy, setBusy] = React.useState(false);
  const voted = typeof window !== 'undefined' && !!localStorage.getItem(`voted:${cardId}`);
  const disabled = busy || voted || localStorage.getItem('telemetry_disabled') === '1';

  React.useEffect(() => {
    markVisible(cardId);
    setStatsListener(cardId, setTotals);
    return () => removeStatsListener(cardId);
  }, [cardId]);

  async function on(v: 1|-1) {
    if (disabled) return;
    setBusy(true);
    setTotals((t)=> ({ up: t.up + (v===1?1:0), down: t.down + (v===-1?1:0) }));
    const res = await vote(cardId, v);
    if (res) setTotals(res);
    setBusy(false);
  }

  if (localStorage.getItem('telemetry_disabled') === '1') return null;

  return (
    <div className="mt-2 flex items-center gap-2 text-xs">
      <Button onClick={()=>on(1)} disabled={disabled}>
        <ThumbsUp className="h-4 w-4" /> {totals.up}
      </Button>
      <Button onClick={()=>on(-1)} disabled={disabled}>
        <ThumbsDown className="h-4 w-4" /> {totals.down}
      </Button>
    </div>
  );
}

