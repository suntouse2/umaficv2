export function mapDirectCampaignSettingsToResponse(
  data: TDirectCampaignSettings & {
    temporary: {
      first_message: { messages: TFunnelMessage[] }[];
      any_message: { messages: TFunnelMessage[] }[];
    };
  }
): TDirectCampaignSettings | undefined {
  const transposedData = { ...data };
  const firstMessages = transposedData?.temporary?.first_message[0]?.messages;
  const firstOrderIndex = transposedData.settings.auto_reply.funnel.order.findIndex((order) => order.order == 1);
  if (!firstMessages || firstMessages.length == 0) return;

  if (firstOrderIndex === -1) {
    transposedData.settings.auto_reply.funnel.order.push({ order: 1, messages: [...firstMessages] });
  } else {
    transposedData.settings.auto_reply.funnel.order[firstOrderIndex] = { order: 1, messages: [...firstMessages] };
  }

  if (transposedData.settings.auto_reply.funnel.funnel_type == 'keyword') {
    const anyMessages = transposedData?.temporary?.any_message[0]?.messages;

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
  const firstOrderIndex = data.settings.auto_reply.funnel.order.findIndex((order) => order.order == 1);

  if (data.settings.auto_reply.funnel.funnel_type == 'order') {
    if (firstOrderIndex !== -1) {
      first_message[0]['messages'] = data.settings.auto_reply.funnel.order[firstOrderIndex]['messages'];
      data.settings.auto_reply.funnel.order.splice(firstOrderIndex, 1);
    }
  }

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
