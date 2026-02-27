import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ListingActions } from '@/components/ListingActions';
import { DataRoomManager } from '@/components/DataRoomManager';
import { canAccessListingDataroom } from '@/lib/rbac';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id }, include: { company: true, files: true } });
  if (!listing) return <div>Listing not found</div>;
  const session = await getServerSession(authOptions);
  const nda = session?.user ? await prisma.ndaAcceptance.findUnique({ where: { userId_listingId: { userId: session.user.id, listingId: listing.id } } }) : null;
  const showDataroom = session?.user ? await canAccessListingDataroom(session.user.id, listing.id, session.user.role) : false;
  return <div className="space-y-4"><h1 className="text-2xl font-semibold">{listing.company.name}</h1><p>{listing.shortTeaser}</p><p>{listing.instrumentType} · {listing.percent}%</p>
  {session?.user && <ListingActions listingId={listing.id} canAcceptNda={session.user.role==='INVESTOR' && session.user.verificationStatus==='VERIFIED'} canOffer={session.user.role==='INVESTOR' && session.user.verificationStatus==='VERIFIED'} ndaAccepted={!!nda} />}
  {showDataroom ? <div><h2 className="text-xl font-semibold">Dataroom</h2><DataRoomManager listingId={listing.id} files={listing.files.map(f=>({id:f.id,filename:f.filename,size:f.size}))} canManage={session!.user.role==='SELLER' || session!.user.role==='ADMIN'} /></div> : <p className="text-sm">Dataroom is gated by NDA acceptance.</p>}
  </div>;
}
