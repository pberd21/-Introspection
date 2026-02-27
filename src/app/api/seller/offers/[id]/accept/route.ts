import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const seller = await requireRole(['SELLER']);
    const offer = await prisma.offer.findUnique({ where: { id: params.id }, include: { listing: true } });
    if (!offer || offer.listing.sellerId !== seller.id) throw new Error('FORBIDDEN');

    const deal = await prisma.$transaction(async (tx) => {
      await tx.offer.updateMany({ where: { listingId: offer.listingId, id: { not: offer.id } }, data: { status: 'REJECTED' } });
      await tx.offer.update({ where: { id: offer.id }, data: { status: 'ACCEPTED' } });
      return tx.deal.create({ data: { listingId: offer.listingId, sellerId: seller.id, investorId: offer.investorId, offerId: offer.id, status: 'LOI' } });
    });

    await logAudit(seller.id, 'offer.accepted', 'offer', offer.id);
    await logAudit(seller.id, 'deal.created', 'deal', deal.id);
    return NextResponse.json({ ok: true, dealId: deal.id });
  } catch (e) {
    return apiError(e);
  }
}
