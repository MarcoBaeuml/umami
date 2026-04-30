import { DataGrid } from '@/components/common/DataGrid';
import { useHooksQuery } from '@/components/hooks';
import { HooksTable } from './HooksTable';

export function HooksDataTable({
  websiteId,
  showActions = false,
}: {
  websiteId: string;
  showActions?: boolean;
}) {
  const query = useHooksQuery({ websiteId });

  return (
    <DataGrid query={query} allowSearch={true} autoFocus={false} allowPaging={true}>
      {({ data }) => <HooksTable websiteId={websiteId} data={data} showActions={showActions} />}
    </DataGrid>
  );
}
