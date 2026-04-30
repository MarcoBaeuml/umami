import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { badRequest } from '@/lib/response';
import { getEnabledWebsiteHooks } from '@/queries/prisma';

export async function GET(request: Request) {
  const schema = z.object({
    websiteId: z.uuid(),
  });

  const { query, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { websiteId } = query;

  if (!websiteId) {
    return badRequest({ message: 'websiteId is required' });
  }

  const hooks = await getEnabledWebsiteHooks(websiteId);

  return Response.json(
    { hooks },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    },
  );
}
