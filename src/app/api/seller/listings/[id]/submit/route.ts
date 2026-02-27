import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const seller = await requireRole(['SELLER']);
    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing || listing.sellerId !== seller.id) throw new Error('FORBIDDEN');
    await prisma.listing.update({ where: { id: params.id }, data: { status: 'PENDING_REVIEW' } });
    await logAudit(seller.id, 'listing.submitted_for_review', 'listing', params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
