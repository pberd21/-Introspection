import { requireAuth, canAccessDeal } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { DealTimeline } from '@/components/DealTimeline';
import { DealChat } from '@/components/DealChat';

export default async function DealPage({ params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!(await canAccessDeal(user.id, params.id, user.role))) return <div>Access denied</div>;
  const deal = await prisma.deal.findUnique({ where: { id: params.id }, include: { listing: { include: { company: true } }, messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } } } });
  if (!deal) return <div>Deal not found</div>;
  return <div className="space-y-4"><h1 className="text-2xl font-semibold">Deal room: {deal.listing.company.name}</h1><DealTimeline current={deal.status} dealId={deal.id} canAdvance={user.role==='SELLER' || user.role==='ADMIN'} /><div className="space-y-2 rounded border bg-white p-3">{deal.messages.map(m=><div key={m.id}><p className="text-xs text-slate-500">{m.sender.name}</p><p>{m.text}</p></div>)}</div><DealChat dealId={deal.id} /></div>;
}
