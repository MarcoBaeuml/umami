import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { QueryFilters } from '@/lib/types';

export async function findHook(criteria: Prisma.HookFindUniqueArgs) {
  return prisma.client.hook.findUnique(criteria);
}

export async function getHook(hookId: string) {
  return findHook({
    where: {
      id: hookId,
    },
  });
}

export async function getWebsiteHooks(websiteId: string, filters: QueryFilters = {}) {
  const { search } = filters;

  const where: Prisma.HookWhereInput = {
    websiteId,
    ...prisma.getSearchParameters(search, [{ name: 'contains' }]),
  };

  return prisma.pagedQuery('hook', { where }, filters);
}

export async function getEnabledWebsiteHooks(websiteId: string) {
  return prisma.client.hook.findMany({
    where: {
      websiteId,
      enabled: true,
    },
    select: {
      id: true,
      triggerType: true,
      triggerConfig: true,
      eventName: true,
      eventData: true,
    },
  });
}

export async function createHook(data: Prisma.HookUncheckedCreateInput) {
  return prisma.client.hook.create({ data });
}

export async function updateHook(hookId: string, data: Prisma.HookUncheckedUpdateInput) {
  return prisma.client.hook.update({ where: { id: hookId }, data });
}

export async function deleteHook(hookId: string) {
  return prisma.client.hook.delete({ where: { id: hookId } });
}
