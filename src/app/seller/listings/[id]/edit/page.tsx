import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { EditListingForm } from '@/components/SellerForms';

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const seller = await requireRole(['SELLER']);
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.sellerId !== seller.id) return <div>Not found</div>;
  return <div className="max-w-xl"><h1 className="mb-3 text-2xl font-semibold">Edit listing</h1><EditListingForm listing={listing} /></div>;
}
