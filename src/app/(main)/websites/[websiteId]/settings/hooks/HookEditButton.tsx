import { useMessages } from '@/components/hooks';
import { Edit } from '@/components/icons';
import { DialogButton } from '@/components/input/DialogButton';
import { HookEditForm } from './HookEditForm';

export function HookEditButton({
  websiteId,
  hookId,
}: {
  websiteId: string;
  hookId: string;
}) {
  const { t, labels } = useMessages();

  return (
    <DialogButton icon={<Edit />} variant="quiet" title={t(labels.edit)} width="600px">
      {({ close }) => <HookEditForm websiteId={websiteId} hookId={hookId} onClose={close} />}
    </DialogButton>
  );
}
