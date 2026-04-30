import {
  Button,
  Column,
  Form,
  FormField,
  FormSubmitButton,
  ListItem,
  Row,
  Select,
  Switch,
  TextField,
} from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { useHookQuery } from '@/components/hooks/queries/useHookQuery';
import { useUpdateQuery } from '@/components/hooks/queries/useUpdateQuery';

const TRIGGER_TYPES = [
  { id: 'url', labelKey: 'urlTrigger' },
  { id: 'click', labelKey: 'clickTrigger' },
  { id: 'pageview', labelKey: 'pageviewTrigger' },
  { id: 'form', labelKey: 'formTrigger' },
  { id: 'timer', labelKey: 'timerTrigger' },
] as const;

export function HookEditForm({
  websiteId,
  hookId,
  onSave,
  onClose,
}: {
  websiteId: string;
  hookId?: string;
  onSave?: () => void;
  onClose?: () => void;
}) {
  const { t, labels, messages, getErrorMessage } = useMessages();
  const { mutateAsync, error, isPending, touch, toast } = useUpdateQuery(
    hookId ? `/websites/${websiteId}/hooks/${hookId}` : `/websites/${websiteId}/hooks`,
  );
  const { data, isLoading } = useHookQuery(websiteId, hookId);

  const handleSubmit = async (formData: any) => {
    const { name, enabled, triggerType, eventName, eventData, ...rest } = formData;

    // Build triggerConfig from type-specific fields
    let triggerConfig: Record<string, any> = {};
    if (triggerType === 'url') {
      triggerConfig = { urlPattern: rest.urlPattern, matchType: rest.matchType || 'contains' };
    } else if (triggerType === 'click' || triggerType === 'form') {
      triggerConfig = { selector: rest.selector };
    } else if (triggerType === 'timer') {
      triggerConfig = { delay: Number(rest.delay) || 5 };
    }

    // Parse eventData from JSON string
    let parsedEventData: Record<string, any> | null = null;
    if (eventData) {
      try {
        parsedEventData = JSON.parse(eventData);
      } catch {
        parsedEventData = null;
      }
    }

    await mutateAsync(
      {
        name,
        enabled: enabled ?? true,
        triggerType,
        triggerConfig,
        eventName,
        eventData: parsedEventData,
      },
      {
        onSuccess: async () => {
          toast(t(messages.saved));
          touch('hooks');
          touch(`hook:${hookId}`);
          onSave?.();
          onClose?.();
        },
      },
    );
  };

  if (hookId && isLoading) {
    return null;
  }

  const triggerConfig = (data?.triggerConfig as Record<string, any>) || {};

  const defaultValues = data
    ? {
        name: data.name,
        enabled: data.enabled,
        triggerType: data.triggerType,
        eventName: data.eventName,
        eventData: data.eventData ? JSON.stringify(data.eventData, null, 2) : '',
        urlPattern: triggerConfig.urlPattern || '',
        matchType: triggerConfig.matchType || 'contains',
        selector: triggerConfig.selector || '',
        delay: String(triggerConfig.delay || '5'),
      }
    : {
        enabled: true,
        triggerType: 'url',
        matchType: 'contains',
        delay: '5',
      };

  return (
    <Form
      onSubmit={handleSubmit}
      error={getErrorMessage(error)}
      defaultValues={defaultValues}
    >
      {({ watch }) => {
        const triggerType = watch('triggerType');

        return (
          <Column gap="4">
            <FormField
              label={t(labels.name)}
              name="name"
              rules={{ required: t(labels.required) }}
            >
              <TextField autoComplete="off" autoFocus={!hookId} />
            </FormField>

            <FormField label={t(labels.triggerType)} name="triggerType">
              {({ value, onChange }: any) => (
                <Select value={value} onChange={onChange}>
                  {TRIGGER_TYPES.map(({ id, labelKey }) => (
                    <ListItem key={id} id={id}>
                      {t((labels as any)[labelKey] || id)}
                    </ListItem>
                  ))}
                </Select>
              )}
            </FormField>

            {triggerType === 'url' && (
              <>
                <FormField
                  label={t(labels.urlPattern)}
                  name="urlPattern"
                  rules={{ required: t(labels.required) }}
                >
                  <TextField placeholder="/checkout/success" autoComplete="off" />
                </FormField>
                <FormField label={t(labels.matchType)} name="matchType">
                  {({ value, onChange }: any) => (
                    <Select value={value} onChange={onChange}>
                      <ListItem id="exact">{t(labels.is)}</ListItem>
                      <ListItem id="contains">{t(labels.contains)}</ListItem>
                      <ListItem id="regex">{t(labels.regexMatch)}</ListItem>
                    </Select>
                  )}
                </FormField>
              </>
            )}

            {(triggerType === 'click' || triggerType === 'form') && (
              <FormField
                label={t(labels.selector)}
                name="selector"
                rules={{ required: t(labels.required) }}
              >
                <TextField placeholder="#buy-btn, .add-to-cart" autoComplete="off" />
              </FormField>
            )}

            {triggerType === 'timer' && (
              <FormField
                label={`${t(labels.delay)} (${t(labels.seconds)})`}
                name="delay"
                rules={{ required: t(labels.required) }}
              >
                <TextField type="number" placeholder="5" autoComplete="off" />
              </FormField>
            )}

            <FormField
              label={t(labels.eventName)}
              name="eventName"
              rules={{ required: t(labels.required) }}
            >
              <TextField placeholder="checkout-complete" autoComplete="off" />
            </FormField>

            <FormField label={`${t(labels.eventData)} (JSON)`} name="eventData">
              <TextField
                asTextArea
                placeholder={'{\n  "revenue": 19.99,\n  "currency": "USD"\n}'}
                resize="vertical"
              />
            </FormField>

            <FormField label="" name="enabled">
              {({ value, onChange }: any) => (
                <Switch isSelected={value} onChange={onChange}>
                  Enabled
                </Switch>
              )}
            </FormField>

            <Row justifyContent="flex-end" paddingTop="3" gap="3">
              {onClose && (
                <Button isDisabled={isPending} onPress={onClose}>
                  {t(labels.cancel)}
                </Button>
              )}
              <FormSubmitButton variant="primary" isDisabled={isPending}>
                {t(labels.save)}
              </FormSubmitButton>
            </Row>
          </Column>
        );
      }}
    </Form>
  );
}
