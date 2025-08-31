import React from 'react';

export default function ContextText() {
  const [text, setText] = React.useState('');
  React.useEffect(() => {
    try {
      setText(localStorage.getItem('context_text') || '');
    } catch {}
  }, []);
  if (!text) return null;
  return <div className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-pre-line">{text}</div>;
}
