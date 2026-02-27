import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('UNAUTHORIZED');
  return session.user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) throw new Error('FORBIDDEN');
  return user;
}

export async function requireVerifiedInvestor() {
  const user = await requireRole(['INVESTOR']);
  if (user.verificationStatus !== 'VERIFIED') throw new Error('VERIFICATION_REQUIRED');
  return user;
}

export async function canAccessListingDataroom(userId: string, listingId: string, role: Role) {
  if (role === 'ADMIN') return true;
  const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { sellerId: true } });
  if (!listing) return false;
  if (listing.sellerId === userId) return true;
  const nda = await prisma.ndaAcceptance.findUnique({ where: { userId_listingId: { userId, listingId } } });
  return !!nda;
}

export async function canAccessDeal(userId: string, dealId: string, role: Role) {
  if (role === 'ADMIN') return true;
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, select: { sellerId: true, investorId: true } });
  if (!deal) return false;
  return deal.sellerId === userId || deal.investorId === userId;
}
