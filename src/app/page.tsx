import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">PrivateShares.RU MVP</h1>
      <p>Curated private secondary marketplace for non-public Russian company participations.</p>
      <Link href="/marketplace" className="rounded bg-slate-900 px-4 py-2 text-white">Browse marketplace</Link>
    </div>
  );
}
