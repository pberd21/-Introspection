import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { DataRoomManager } from '@/components/DataRoomManager';

export default async function SellerDataroomPage({ params }: { params: { id: string } }) {
  const seller = await requireRole(['SELLER']);
  const listing = await prisma.listing.findUnique({ where: { id: params.id }, include: { files: true } });
  if (!listing || listing.sellerId !== seller.id) return <div>Not found</div>;
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">Dataroom manager</h1><DataRoomManager listingId={params.id} files={listing.files.map(f=>({id:f.id,filename:f.filename,size:f.size}))} canManage /></div>;
}
