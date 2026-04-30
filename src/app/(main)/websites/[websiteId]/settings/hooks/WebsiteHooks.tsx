import { Column, Heading, Row } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { HookAddButton } from './HookAddButton';
import { HooksDataTable } from './HooksDataTable';

export function WebsiteHooks({ websiteId }: { websiteId: string }) {
  const { t, labels } = useMessages();

  return (
    <Column gap="4">
      <Row justifyContent="space-between" alignItems="center">
        <Heading>{t(labels.hooks)}</Heading>
        <HookAddButton websiteId={websiteId} />
      </Row>
      <HooksDataTable websiteId={websiteId} showActions={true} />
    </Column>
  );
}
