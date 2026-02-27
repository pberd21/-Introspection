'use client';

import { useState } from 'react';

export function ListingActions({ listingId, canAcceptNda, canOffer, ndaAccepted }: { listingId: string; canAcceptNda: boolean; canOffer: boolean; ndaAccepted: boolean }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  return <div className="space-y-3">
    {canAcceptNda && !ndaAccepted && <div className="rounded border p-3"><a className="text-blue-700 underline" href={`/api/listings/${listingId}/nda`}>Download NDA PDF</a><button onClick={async () => { await fetch(`/api/listings/${listingId}/nda`, { method: 'POST' }); location.reload(); }} className="ml-3 rounded bg-slate-900 px-3 py-1 text-white">Accept NDA</button></div>}
    {canOffer && ndaAccepted && <form className="space-y-2 rounded border p-3" onSubmit={async (e)=>{e.preventDefault(); await fetch(`/api/listings/${listingId}/offers`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount: Number(amount), message })}); location.reload();}}>
      <h3 className="font-semibold">Submit offer</h3>
      <input value={amount} onChange={(e)=>setAmount(e.target.value)} required className="w-full rounded border px-2 py-1" placeholder="Amount RUB"/>
      <textarea value={message} onChange={(e)=>setMessage(e.target.value)} required className="w-full rounded border px-2 py-1" placeholder="Message"/>
      <button className="rounded bg-slate-900 px-3 py-1 text-white">Send offer</button>
    </form>}
  </div>;
}
