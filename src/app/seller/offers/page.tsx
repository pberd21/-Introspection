import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export default async function SellerOffersPage() {
  const seller = await requireRole(['SELLER']);
  const offers = await prisma.offer.findMany({ where: { listing: { sellerId: seller.id } }, include: { listing: { include: { company: true } }, investor: true } });
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">Received offers</h1>{offers.map((o)=><div key={o.id} className="rounded border bg-white p-3"><p>{o.listing.company.name} · {o.investor.name} · {o.amount.toLocaleString()} RUB · {o.status}</p>{o.status==='SENT' && <form action={`/api/seller/offers/${o.id}/accept`} method="post"><button className="rounded bg-green-700 px-3 py-1 text-white">Accept offer</button></form>}</div>)}</div>;
}
