import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const seller = await requireRole(['SELLER']);
    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing || listing.sellerId !== seller.id) throw new Error('FORBIDDEN');
    const body = await req.json();
    await prisma.listing.update({ where: { id: params.id }, data: {
      instrumentType: body.instrumentType,
      percent: Number(body.percent),
      priceMin: Number(body.priceMin),
      priceMax: Number(body.priceMax),
      shortTeaser: String(body.shortTeaser)
    }});
    await logAudit(seller.id, 'listing.updated', 'listing', params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
