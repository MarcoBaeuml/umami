import { z } from 'zod';
import { uuid } from '@/lib/crypto';
import { getQueryFilters, parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';
import { pagingParams, searchParams } from '@/lib/schema';
import { canCreateHook, canViewWebsiteHooks } from '@/permissions';
import { createHook, getWebsiteHooks } from '@/queries/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const schema = z.object({
    ...pagingParams,
    ...searchParams,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canViewWebsiteHooks(auth, websiteId))) {
    return unauthorized();
  }

  const filters = await getQueryFilters(query);
  const hooks = await getWebsiteHooks(websiteId, filters);

  return json(hooks);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const schema = z.object({
    name: z.string().max(100),
    enabled: z.boolean().optional(),
    triggerType: z.enum(['url', 'click', 'pageview', 'form', 'timer']),
    triggerConfig: z.record(z.string(), z.any()),
    eventName: z.string().max(50),
    eventData: z.record(z.string(), z.any()).nullable().optional(),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canCreateHook(auth, websiteId))) {
    return unauthorized();
  }

  const { name, enabled, triggerType, triggerConfig, eventName, eventData } = body;

  const hook = await createHook({
    id: uuid(),
    websiteId,
    name,
    enabled: enabled ?? true,
    triggerType,
    triggerConfig,
    eventName,
    eventData: eventData ?? null,
  });

  return json(hook);
}
