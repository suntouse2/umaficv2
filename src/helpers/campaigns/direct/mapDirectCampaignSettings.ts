export function mapDirectCampaignSettingsToResponse(
  data: TDirectCampaignSettings & {
    temporary: {
      first_message: { messages: TFunnelMessage[] }[];
      any_message: { messages: TFunnelMessage[] }[];
    };
  }
): TDirectCampaignSettings | undefined {
  const transposedData = { ...data };

  if (transposedData.settings.auto_reply.funnel.funnel_type == 'keyword') {
    const firstMessages = transposedData?.temporary?.first_message[0]?.messages;
    const anyMessages = transposedData?.temporary?.any_message[0]?.messages;

    if (!firstMessages || firstMessages.length == 0) return;

    transposedData.settings.auto_reply.funnel.order = [];
    transposedData.settings.auto_reply.funnel.order.push({ order: 1, messages: [...firstMessages] });

    if (anyMessages && anyMessages.length > 0) transposedData.settings.auto_reply.funnel.order.push({ order: 2, messages: [...anyMessages] });
  }
  delete (transposedData as { [key: string]: unknown })['temporary'];

  return transposedData;
}

export function mapDirectCampaignSettingsFromResponse(data: TDirectCampaignSettings): TDirectCampaignSettings & {
  temporary: {
    first_message: { messages: TFunnelMessage[] }[];
    any_message: { messages: TFunnelMessage[] }[];
  };
} {
  const first_message: { messages: TFunnelMessage[] }[] = [{ messages: [] }];
  const any_message: { messages: TFunnelMessage[] }[] = [{ messages: [] }];
  if (data.settings.auto_reply.funnel.funnel_type == 'keyword') {
    first_message[0]['messages'] = data.settings.auto_reply.funnel.order[0]?.messages ?? [];
    any_message[0]['messages'] = data.settings.auto_reply.funnel.order[1]?.messages ?? [];
    data.settings.auto_reply.funnel.order = [];
  }
  return {
    ...data,
    temporary: {
      first_message,
      any_message,
    },
  };
}
