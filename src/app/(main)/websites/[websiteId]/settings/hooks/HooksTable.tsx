import { DataColumn, DataTable, type DataTableProps, Row, Text } from '@umami/react-zen';
import { DateDistance } from '@/components/common/DateDistance';
import { useMessages } from '@/components/hooks';
import { HookDeleteButton } from './HookDeleteButton';
import { HookEditButton } from './HookEditButton';

export interface HooksTableProps extends DataTableProps {
  websiteId: string;
  showActions?: boolean;
}

export function HooksTable({ websiteId, showActions, ...props }: HooksTableProps) {
  const { t, labels } = useMessages();

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={t(labels.name)}>
        {({ name, enabled }: any) => (
          <Row alignItems="center" gap="2">
            <Text>{name}</Text>
            {!enabled && (
              <Text size="xs" color="muted">
                (disabled)
              </Text>
            )}
          </Row>
        )}
      </DataColumn>
      <DataColumn id="triggerType" label={t(labels.triggerType)}>
        {({ triggerType }: any) => <Text>{triggerType}</Text>}
      </DataColumn>
      <DataColumn id="eventName" label={t(labels.eventName)}>
        {({ eventName }: any) => eventName}
      </DataColumn>
      <DataColumn id="created" label={t(labels.created)}>
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
      {showActions && (
        <DataColumn id="action" align="end" width="100px">
          {(row: any) => {
            const { id, name } = row;

            return (
              <Row>
                <HookEditButton websiteId={websiteId} hookId={id} />
                <HookDeleteButton websiteId={websiteId} hookId={id} name={name} />
              </Row>
            );
          }}
        </DataColumn>
      )}
    </DataTable>
  );
}
