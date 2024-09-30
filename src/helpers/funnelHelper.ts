type FunnelData = {
  value: {
    messages: TFunnelMessage[];
    order?: number;
    keywords?: string[];
  }[];
  filter_type: 'order' | 'keyword' | 'none';
};
type MessageData = {
  filter: string[] | number | null;
  message: TFunnelMessage;
  index?: number;
  old_filter?: string[] | number;
};

export function addMessage(funnelData: FunnelData, messageData: MessageData) {
  if (funnelData.filter_type == 'keyword') {
    const filter = messageData.filter as string[];
    const index = funnelData.value.findIndex((o) => o.keywords == filter);
    if (index !== -1) {
      funnelData.value[index]['messages'].push(messageData.message);
    } else {
      funnelData.value.push({ keywords: filter, messages: [messageData.message] });
    }
  }
  if (funnelData.filter_type == 'order') {
    const filter = messageData.filter as number;
    const index = funnelData.value.findIndex((o) => o.order == filter);
    if (index !== -1) {
      funnelData.value[index]['messages'].push(messageData.message);
    } else {
      funnelData.value.push({ order: filter, messages: [messageData.message] });
    }
  }
  if (funnelData.filter_type == 'none') {
    if (funnelData.value.length > 0) {
      funnelData.value[0]['messages'].push(messageData.message);
    } else {
      funnelData.value.push({ messages: [messageData.message] });
    }
  }
}
