import { prisma } from '@/lib/prisma';

export async function logAudit(userId: string | null, action: string, entityType: string, entityId: string, meta?: Record<string, unknown>) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      metaJson: meta ? JSON.stringify(meta) : null
    }
  });
}
