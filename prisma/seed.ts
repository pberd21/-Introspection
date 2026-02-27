import { PrismaClient, DealStatus, InstrumentType, ListingStatus, OfferStatus, Role, VerificationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser(name: string, email: string, password: string, role: Role, verification: VerificationStatus) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role },
    create: {
      name,
      email,
      passwordHash,
      role,
      verification: { create: { status: verification } }
    },
    include: { verification: true }
  });
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.dataRoomFile.deleteMany();
  await prisma.ndaAcceptance.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.company.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  const admin = await createUser('Admin', 'admin@privateshares.local', 'Admin123!', Role.ADMIN, VerificationStatus.VERIFIED);
  const seller1 = await createUser('Seller One', 'seller1@privateshares.local', 'Seller123!', Role.SELLER, VerificationStatus.VERIFIED);
  const seller2 = await createUser('Seller Two', 'seller2@privateshares.local', 'Seller123!', Role.SELLER, VerificationStatus.VERIFIED);
  const inv1 = await createUser('Investor Verified', 'investor1@privateshares.local', 'Investor123!', Role.INVESTOR, VerificationStatus.VERIFIED);
  const inv2 = await createUser('Investor Pending', 'investor2@privateshares.local', 'Investor123!', Role.INVESTOR, VerificationStatus.PENDING);
  const inv3 = await createUser('Investor New', 'investor3@privateshares.local', 'Investor123!', Role.INVESTOR, VerificationStatus.UNVERIFIED);

  const companies = await prisma.$transaction([
    prisma.company.create({ data: { name: 'Volga Agro Tech', industry: 'AgriTech', location: 'Kazan', description: 'Precision agriculture platform', isAnonymousAllowed: true } }),
    prisma.company.create({ data: { name: 'Nord Logistics Group', industry: 'Logistics', location: 'Moscow', description: 'Regional freight network', isAnonymousAllowed: false } }),
    prisma.company.create({ data: { name: 'Siberia Med Devices', industry: 'Healthcare', location: 'Novosibirsk', description: 'Medical diagnostics tools', isAnonymousAllowed: false } })
  ]);

  const listings = await prisma.$transaction([
    prisma.listing.create({ data: { companyId: companies[0].id, sellerId: seller1.id, instrumentType: InstrumentType.OOO_SHARE, percent: 15, priceMin: 20000000, priceMax: 26000000, shortTeaser: 'Minority growth stake with export upside', status: ListingStatus.APPROVED } }),
    prisma.listing.create({ data: { companyId: companies[1].id, sellerId: seller1.id, instrumentType: InstrumentType.AO_SHARES, percent: 10, priceMin: 35000000, priceMax: 42000000, shortTeaser: 'Cash-flow positive logistics operator', status: ListingStatus.PENDING_REVIEW } }),
    prisma.listing.create({ data: { companyId: companies[2].id, sellerId: seller2.id, instrumentType: InstrumentType.OOO_SHARE, percent: 8, priceMin: 18000000, priceMax: 22000000, shortTeaser: 'Diagnostics producer with government contracts', status: ListingStatus.DRAFT } }),
    prisma.listing.create({ data: { companyId: companies[1].id, sellerId: seller2.id, instrumentType: InstrumentType.AO_SHARES, percent: 22, priceMin: 50000000, priceMax: 62000000, shortTeaser: 'Control block from retiring founder', status: ListingStatus.APPROVED } }),
    prisma.listing.create({ data: { companyId: companies[0].id, sellerId: seller1.id, instrumentType: InstrumentType.OOO_SHARE, percent: 5, priceMin: 9000000, priceMax: 12000000, shortTeaser: 'Small strategic ticket for partner investor', status: ListingStatus.REJECTED } })
  ]);

  await prisma.ndaAcceptance.create({ data: { userId: inv1.id, listingId: listings[0].id } });

  const offerAccepted = await prisma.offer.create({
    data: {
      listingId: listings[0].id,
      investorId: inv1.id,
      amount: 23000000,
      message: 'Ready for quick close with escrow.',
      status: OfferStatus.ACCEPTED
    }
  });

  await prisma.offer.create({
    data: {
      listingId: listings[3].id,
      investorId: inv1.id,
      amount: 53000000,
      message: 'Interest subject to dataroom review.',
      status: OfferStatus.SENT
    }
  });

  const deal = await prisma.deal.create({
    data: {
      listingId: listings[0].id,
      sellerId: seller1.id,
      investorId: inv1.id,
      offerId: offerAccepted.id,
      status: DealStatus.DOCS
    }
  });

  await prisma.message.createMany({
    data: [
      { dealId: deal.id, senderId: seller1.id, text: 'We uploaded corporate docs.' },
      { dealId: deal.id, senderId: inv1.id, text: 'Received, legal team is reviewing.' },
      { dealId: deal.id, senderId: admin.id, text: 'Reminder: preemptive rights notice deadline in 5 days.' }
    ]
  });

  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, action: 'user.signup', entityType: 'user', entityId: admin.id },
      { userId: seller1.id, action: 'listing.created', entityType: 'listing', entityId: listings[0].id },
      { userId: admin.id, action: 'listing.approved', entityType: 'listing', entityId: listings[0].id },
      { userId: inv1.id, action: 'nda.accepted', entityType: 'listing', entityId: listings[0].id },
      { userId: inv1.id, action: 'offer.sent', entityType: 'offer', entityId: offerAccepted.id },
      { userId: seller1.id, action: 'offer.accepted', entityType: 'offer', entityId: offerAccepted.id },
      { userId: seller1.id, action: 'deal.created', entityType: 'deal', entityId: deal.id },
      { userId: admin.id, action: 'verification.verified', entityType: 'user', entityId: inv1.id },
      { userId: inv2.id, action: 'verification.submitted', entityType: 'user', entityId: inv2.id },
      { userId: seller2.id, action: 'listing.created', entityType: 'listing', entityId: listings[2].id }
    ]
  });

  console.log('Seed complete');
  console.log({ admin: admin.email, seller1: seller1.email, seller2: seller2.email, inv1: inv1.email, inv2: inv2.email, inv3: inv3.email });
}

main().finally(async () => prisma.$disconnect());
