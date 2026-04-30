import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, ok, unauthorized } from '@/lib/response';
import { canDeleteHook, canUpdateHook, canViewHook } from '@/permissions';
import { deleteHook, getHook, updateHook } from '@/queries/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string; hookId: string }> },
) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { hookId } = await params;

  if (!(await canViewHook(auth, hookId))) {
    return unauthorized();
  }

  const hook = await getHook(hookId);

  return json(hook);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ websiteId: string; hookId: string }> },
) {
  const schema = z.object({
    name: z.string().max(100).optional(),
    enabled: z.boolean().optional(),
    triggerType: z.enum(['url', 'click', 'pageview', 'form', 'timer']).optional(),
    triggerConfig: z.record(z.string(), z.any()).optional(),
    eventName: z.string().max(50).optional(),
    eventData: z.record(z.string(), z.any()).nullable().optional(),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { hookId } = await params;

  if (!(await canUpdateHook(auth, hookId))) {
    return unauthorized();
  }

  const { name, enabled, triggerType, triggerConfig, eventName, eventData } = body;

  const hook = await updateHook(hookId, {
    ...(name !== undefined && { name }),
    ...(enabled !== undefined && { enabled }),
    ...(triggerType !== undefined && { triggerType }),
    ...(triggerConfig !== undefined && { triggerConfig }),
    ...(eventName !== undefined && { eventName }),
    ...(eventData !== undefined && { eventData }),
  });

  return json(hook);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ websiteId: string; hookId: string }> },
) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { hookId } = await params;

  if (!(await canDeleteHook(auth, hookId))) {
    return unauthorized();
  }

  await deleteHook(hookId);

  return ok();
}
