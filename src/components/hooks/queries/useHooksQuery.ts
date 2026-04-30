import type { ReactQueryOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useModified } from '../useModified';
import { usePagedQuery } from '../usePagedQuery';

export function useHooksQuery(
  { websiteId }: { websiteId: string },
  params?: Record<string, any>,
  options?: ReactQueryOptions,
) {
  const { modified } = useModified('hooks');
  const { get } = useApi();

  return usePagedQuery({
    queryKey: ['hooks', { websiteId, modified, ...params }],
    queryFn: pageParams => {
      return get(`/websites/${websiteId}/hooks`, {
        ...pageParams,
        ...params,
      });
    },
    ...options,
  });
}
