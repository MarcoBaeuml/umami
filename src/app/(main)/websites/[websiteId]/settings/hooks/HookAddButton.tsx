import { useMessages } from '@/components/hooks';
import { Plus } from '@/components/icons';
import { DialogButton } from '@/components/input/DialogButton';
import { HookEditForm } from './HookEditForm';

export function HookAddButton({ websiteId }: { websiteId: string }) {
  const { t, labels } = useMessages();

  return (
    <DialogButton icon={<Plus />} label={t(labels.addHook)} variant="primary" width="600px">
      {({ close }) => <HookEditForm websiteId={websiteId} onClose={close} />}
    </DialogButton>
  );
}
