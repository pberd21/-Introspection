'use client';

import { useState } from 'react';

export default function VerificationPage() {
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  return <div className="max-w-xl space-y-3"><h1 className="text-2xl font-semibold">Investor verification</h1><textarea value={note} onChange={(e)=>setNote(e.target.value)} className="w-full rounded border px-2 py-1" placeholder="Documents note or references"/><button className="rounded bg-slate-900 px-3 py-1 text-white" onClick={async()=>{const res=await fetch('/api/verification/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({documentsNote:note})});setMsg(res.ok?'Submitted for review':'Failed');}}>Submit</button><p>{msg}</p></div>;
}
