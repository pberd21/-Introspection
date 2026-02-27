import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { StatusChip } from '@/components/StatusChip';

export default async function MarketplacePage({ searchParams }: { searchParams: { industry?: string; instrumentType?: string; min?: string; max?: string } }) {
  const listings = await prisma.listing.findMany({
    where: {
      status: 'APPROVED',
      company: searchParams.industry ? { industry: { contains: searchParams.industry } } : undefined,
      instrumentType: searchParams.instrumentType as any || undefined,
      priceMin: searchParams.min ? { gte: Number(searchParams.min) } : undefined,
      priceMax: searchParams.max ? { lte: Number(searchParams.max) } : undefined
    },
    include: { company: true }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <form className="grid grid-cols-4 gap-2 rounded border bg-white p-3">
        <input name="industry" placeholder="Industry" className="rounded border px-2 py-1" defaultValue={searchParams.industry} />
        <select name="instrumentType" defaultValue={searchParams.instrumentType} className="rounded border px-2 py-1"><option value="">Any instrument</option><option>OOO_SHARE</option><option>AO_SHARES</option></select>
        <input name="min" placeholder="Min" className="rounded border px-2 py-1" defaultValue={searchParams.min} />
        <input name="max" placeholder="Max" className="rounded border px-2 py-1" defaultValue={searchParams.max} />
        <button className="col-span-4 rounded bg-slate-900 py-1 text-white">Apply filters</button>
      </form>
      {listings.length === 0 ? <p>No listings found.</p> : listings.map((l) => <div key={l.id} className="rounded border bg-white p-4"><div className="flex justify-between"><h2 className="font-semibold">{l.company.name}</h2><StatusChip value={l.status} /></div><p>{l.shortTeaser}</p><p>{l.instrumentType} · {l.percent}% · {l.priceMin.toLocaleString()} - {l.priceMax.toLocaleString()} RUB</p><Link className="text-blue-700 underline" href={`/listings/${l.id}`}>Open listing</Link></div>)}
    </div>
  );
}
