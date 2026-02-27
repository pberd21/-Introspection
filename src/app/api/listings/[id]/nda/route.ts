import { NextResponse } from 'next/server';
import { requireVerifiedInvestor } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

function ndaPdf(listingId: string, investorName: string) {
  const text = `%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj\n4 0 obj<</Length 120>>stream\nBT /F1 12 Tf 72 720 Td (PrivateShares NDA) Tj 0 -24 Td (Listing: ${listingId}) Tj 0 -24 Td (Investor: ${investorName}) Tj 0 -24 Td (By accepting, investor agrees confidentiality.) Tj ET\nendstream endobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000110 00000 n \n0000000190 00000 n \ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n380\n%%EOF`;
  return new TextEncoder().encode(text);
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireVerifiedInvestor();
    const bytes = ndaPdf(params.id, user.name || user.email || user.id);
    return new NextResponse(bytes, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="nda-${params.id}.pdf"` } });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireVerifiedInvestor();
    await prisma.ndaAcceptance.upsert({
      where: { userId_listingId: { userId: user.id, listingId: params.id } },
      create: { userId: user.id, listingId: params.id },
      update: {}
    });
    await logAudit(user.id, 'nda.accepted', 'listing', params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
