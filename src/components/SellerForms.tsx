'use client';

export function NewListingForm({ companies }: { companies: { id: string; name: string }[] }) {
  return <form className="space-y-2" onSubmit={async(e)=>{e.preventDefault();const form=new FormData(e.currentTarget);const payload={companyId:form.get('companyId'),instrumentType:form.get('instrumentType'),percent:Number(form.get('percent')),priceMin:Number(form.get('priceMin')),priceMax:Number(form.get('priceMax')),shortTeaser:form.get('shortTeaser')};const res=await fetch('/api/seller/listings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(res.ok){location.href='/seller/listings';}}}>
    <select name="companyId" className="w-full rounded border px-2 py-1">{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <select name="instrumentType" className="w-full rounded border px-2 py-1"><option value="OOO_SHARE">OOO_SHARE</option><option value="AO_SHARES">AO_SHARES</option></select>
    <input name="percent" required className="w-full rounded border px-2 py-1" placeholder="Percent" />
    <input name="priceMin" required className="w-full rounded border px-2 py-1" placeholder="Price min" />
    <input name="priceMax" required className="w-full rounded border px-2 py-1" placeholder="Price max" />
    <textarea name="shortTeaser" required className="w-full rounded border px-2 py-1" placeholder="Teaser" />
    <button className="rounded bg-slate-900 px-3 py-1 text-white">Create draft</button>
  </form>;
}

export function EditListingForm({ listing }: { listing: any }) {
  return <form className="space-y-2" onSubmit={async(e)=>{e.preventDefault();const form=new FormData(e.currentTarget);const payload={instrumentType:form.get('instrumentType'),percent:form.get('percent'),priceMin:form.get('priceMin'),priceMax:form.get('priceMax'),shortTeaser:form.get('shortTeaser')};await fetch(`/api/seller/listings/${listing.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});location.reload();}}>
    <select name="instrumentType" defaultValue={listing.instrumentType} className="w-full rounded border px-2 py-1"><option value="OOO_SHARE">OOO_SHARE</option><option value="AO_SHARES">AO_SHARES</option></select>
    <input name="percent" defaultValue={listing.percent} className="w-full rounded border px-2 py-1" />
    <input name="priceMin" defaultValue={listing.priceMin} className="w-full rounded border px-2 py-1" />
    <input name="priceMax" defaultValue={listing.priceMax} className="w-full rounded border px-2 py-1" />
    <textarea name="shortTeaser" defaultValue={listing.shortTeaser} className="w-full rounded border px-2 py-1" />
    <button className="rounded bg-slate-900 px-3 py-1 text-white">Save</button>
    <button type="button" onClick={async()=>{await fetch(`/api/seller/listings/${listing.id}/submit`,{method:'POST'});location.reload();}} className="ml-2 rounded bg-blue-700 px-3 py-1 text-white">Submit for review</button>
  </form>;
}
