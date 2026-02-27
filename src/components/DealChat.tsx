'use client';

import { useState } from 'react';

export function DealChat({ dealId }: { dealId: string }) {
  const [text, setText] = useState('');
  return <form className="flex gap-2" onSubmit={async (e)=>{e.preventDefault(); await fetch(`/api/deals/${dealId}/messages`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text})}); location.reload();}}><input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 rounded border px-2 py-1" placeholder="Write message"/><button className="rounded bg-slate-900 px-3 py-1 text-white">Send</button></form>;
}
