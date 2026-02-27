import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { NewListingForm } from '@/components/SellerForms';

export default async function NewListingPage() {
  await requireRole(['SELLER']);
  const companies = await prisma.company.findMany({ select: { id: true, name: true } });
  return <div className="max-w-xl"><h1 className="mb-3 text-2xl font-semibold">Create listing draft</h1><NewListingForm companies={companies} /></div>;
}
