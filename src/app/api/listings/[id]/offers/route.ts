import { NextResponse } from 'next/server';
import { requireVerifiedInvestor } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const investor = await requireVerifiedInvestor();
    const nda = await prisma.ndaAcceptance.findUnique({ where: { userId_listingId: { userId: investor.id, listingId: params.id } } });
    if (!nda) return NextResponse.json({ error: 'NDA acceptance required' }, { status: 403 });
    const { amount, message } = await req.json();
    const offer = await prisma.offer.create({ data: { listingId: params.id, investorId: investor.id, amount: Number(amount), message: String(message).slice(0, 1500) } });
    await logAudit(investor.id, 'offer.sent', 'offer', offer.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
