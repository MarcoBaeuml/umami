import { useApi } from '../useApi';
import { useModified } from '../useModified';

export function useHookQuery(websiteId?: string, hookId?: string) {
  const { get, useQuery } = useApi();
  const { modified } = useModified(`hook:${hookId}`);

  return useQuery({
    queryKey: ['hook', { websiteId, hookId, modified }],
    queryFn: () => {
      return get(`/websites/${websiteId}/hooks/${hookId}`);
    },
    enabled: !!websiteId && !!hookId,
  });
}
