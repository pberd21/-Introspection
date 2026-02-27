import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { StatusChip } from '@/components/StatusChip';

export default async function InvestorOffersPage() {
  const user = await requireRole(['INVESTOR']);
  const offers = await prisma.offer.findMany({ where: { investorId: user.id }, include: { listing: { include: { company: true } } } });
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">My offers</h1>{offers.map((o)=><div key={o.id} className="rounded border bg-white p-3"><p>{o.listing.company.name} · {o.amount.toLocaleString()} RUB</p><StatusChip value={o.status} />{o.status==='SENT' && <form action={`/api/investor/offers/${o.id}/withdraw`} method="post"><button className="text-sm text-red-600">Withdraw</button></form>}</div>)}</div>;
}
