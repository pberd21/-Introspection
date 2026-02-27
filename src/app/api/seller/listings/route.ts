import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

const schema = z.object({
  companyId: z.string().min(1),
  instrumentType: z.enum(['OOO_SHARE', 'AO_SHARES']),
  percent: z.number().positive(),
  priceMin: z.number().positive(),
  priceMax: z.number().positive(),
  shortTeaser: z.string().min(8)
});

export async function POST(req: Request) {
  try {
    const seller = await requireRole(['SELLER']);
    const body = schema.parse(await req.json());
    const listing = await prisma.listing.create({ data: { ...body, sellerId: seller.id, status: 'DRAFT' } });
    await logAudit(seller.id, 'listing.created', 'listing', listing.id);
    return NextResponse.json({ ok: true, id: listing.id });
  } catch (e) {
    return apiError(e);
  }
}
