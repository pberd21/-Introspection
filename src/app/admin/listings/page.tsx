import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { AdminListingActions } from '@/components/AdminActions';

export default async function AdminListingsPage() {
  await requireRole(['ADMIN']);
  const listings = await prisma.listing.findMany({ where: { status: 'PENDING_REVIEW' }, include: { company: true, seller: true } });
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">Listings for review</h1>{listings.map((l)=><div key={l.id} className="rounded border bg-white p-3"><p>{l.company.name} by {l.seller.name}</p><p>{l.shortTeaser}</p><AdminListingActions id={l.id} /></div>)}</div>;
}
