import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { StatusChip } from '@/components/StatusChip';

export default async function SellerListingsPage() {
  const seller = await requireRole(['SELLER']);
  const listings = await prisma.listing.findMany({ where: { sellerId: seller.id }, include: { company: true } });
  return <div className="space-y-3"><div className="flex justify-between"><h1 className="text-2xl font-semibold">My listings</h1><Link href="/seller/listings/new" className="rounded bg-slate-900 px-3 py-1 text-white">New listing</Link></div>{listings.map((l)=><div key={l.id} className="rounded border bg-white p-3"><p>{l.company.name}</p><StatusChip value={l.status} /><div className="flex gap-3"><Link className="text-blue-700" href={`/seller/listings/${l.id}/edit`}>Edit</Link><Link className="text-blue-700" href={`/seller/listings/${l.id}/dataroom`}>Dataroom</Link></div></div>)}</div>;
}
